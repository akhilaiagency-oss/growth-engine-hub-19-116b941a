/**
 * Booking (Calendly) state machine for the ₹9 Strategy Call — server only.
 *
 * Calendly's FREE plan has no webhooks, so confirmation is PULL-based: the
 * server asks the Calendly REST API whether a matching event exists. The
 * browser is never trusted — the embed's `event_scheduled` message is only a
 * hint that we should verify.
 *
 * The booking step itself is gated by `strategy_call_booking_unlocked(lead_id)`,
 * which only returns true for a payment that is BOTH `paid` and `verified`.
 */
import {
  eventUuid,
  getSchedulingUrl,
  getScheduledEvent,
  isCalendlyApiConfigured,
  listEventInvitees,
  listScheduledEvents,
  sameEmail,
} from "./calendly.server";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const CONFIRMED_STATUSES = ["confirmed", "scheduled", "rescheduled"] as const;

export interface BookingAccess {
  unlocked: boolean;
  configured: boolean;
  schedulingUrl: string | null;
  prefill: { name: string; email: string } | null;
  booking: {
    status: string;
    scheduledAt: string | null;
    eventName: string | null;
    joinUrl: string | null;
    rescheduleUrl: string | null;
    cancelUrl: string | null;
    timezone: string | null;
    eventUuid: string | null;
  } | null;
  whatsappStatus: string;
}

async function loadLead(leadId: string, accessToken: string) {
  const db = await admin();
  const { data } = await db
    .from("strategy_call_leads")
    .select("id, name, email")
    .eq("id", leadId)
    .eq("access_token", accessToken)
    .maybeSingle();
  return data;
}

/** Server-verified payment gate + the timestamp bookings must start after. */
async function paidPayment(leadId: string) {
  const db = await admin();
  const { data } = await db
    .from("strategy_call_payments")
    .select("id, verified_at, paid_at")
    .eq("lead_id", leadId)
    .eq("status", "paid")
    .eq("verification_status", "verified")
    .maybeSingle();
  return data;
}

/**
 * Authoritative gate + scheduling URL issuer.
 * The lead id also travels to Calendly as `utm_content` for traceability, but
 * matching is done on the invitee email via the API.
 */
export async function getBookingAccess(
  leadId: string,
  accessToken: string,
): Promise<BookingAccess> {
  const db = await admin();
  const locked: BookingAccess = {
    unlocked: false,
    configured: Boolean(getSchedulingUrl()),
    schedulingUrl: null,
    prefill: null,
    booking: null,
    whatsappStatus: "not_granted",
  };

  const lead = await loadLead(leadId, accessToken);
  if (!lead) return locked;

  const { data: unlocked } = await db.rpc("strategy_call_booking_unlocked", {
    _lead_id: lead.id,
  });
  if (unlocked !== true) return locked;

  const [{ data: booking }, { data: entitlement }] = await Promise.all([
    db
      .from("strategy_call_bookings")
      .select(
        "status, scheduled_at, calendly_event_name, calendly_event_uuid, join_url, calendly_reschedule_url, calendly_cancel_url, timezone",
      )
      .eq("lead_id", lead.id)
      .maybeSingle(),
    db
      .from("strategy_call_entitlements")
      .select("whatsapp_status")
      .eq("lead_id", lead.id)
      .maybeSingle(),
  ]);

  const base = getSchedulingUrl();
  let schedulingUrl: string | null = null;
  if (base) {
    const url = new URL(base);
    url.searchParams.set("name", lead.name);
    url.searchParams.set("email", lead.email);
    url.searchParams.set("utm_content", lead.id);
    url.searchParams.set("utm_source", "growth-multiplier-ai");
    url.searchParams.set("utm_campaign", "strategy-call-9");
    url.searchParams.set("hide_gdpr_banner", "1");
    schedulingUrl = url.toString();
  }

  return {
    unlocked: true,
    configured: Boolean(base),
    schedulingUrl,
    prefill: { name: lead.name, email: lead.email },
    booking: booking
      ? {
          status: booking.status,
          scheduledAt: booking.scheduled_at,
          eventName: booking.calendly_event_name,
          joinUrl: booking.join_url,
          rescheduleUrl: booking.calendly_reschedule_url,
          cancelUrl: booking.calendly_cancel_url,
          timezone: booking.timezone,
          eventUuid: booking.calendly_event_uuid,
        }
      : null,
    whatsappStatus: entitlement?.whatsapp_status ?? "not_granted",
  };
}

export type VerifyStatus = "unpaid" | "pending" | "confirmed" | "not_configured";

export interface VerifyResult {
  status: VerifyStatus;
  booking: BookingAccess["booking"];
}

/**
 * The ONLY code path allowed to mark a booking confirmed.
 * Requires a server-verified, captured Razorpay payment first, then asks the
 * Calendly API whether an active event exists for this exact invitee email.
 */
export async function verifyCalendlyBooking(
  leadId: string,
  accessToken: string,
): Promise<VerifyResult> {
  const db = await admin();
  const lead = await loadLead(leadId, accessToken);
  if (!lead) return { status: "unpaid", booking: null };

  const payment = await paidPayment(lead.id);
  if (!payment) return { status: "unpaid", booking: null };

  if (!isCalendlyApiConfigured()) return { status: "not_configured", booking: null };

  const paidAtRaw = payment.verified_at ?? payment.paid_at ?? null;
  const paidAtMs = paidAtRaw ? new Date(paidAtRaw).getTime() : null;

  // `min_start_time` filters on when an event STARTS, so it is only a coarse
  // pre-filter that drops past events. `created_at` is the authoritative gate.
  const events = await listScheduledEvents({
    inviteeEmail: lead.email,
    minStartTime: paidAtRaw ? new Date(paidAtRaw).toISOString() : null,
    status: "active",
  });

  for (const event of events) {
    // The booking step is gated behind payment, so a legitimate booking for
    // this payment can only have been created after the payment was verified.
    // An older event belongs to an earlier session and must never be claimed.
    if (paidAtMs !== null) {
      if (!event.created_at) continue;
      if (new Date(event.created_at).getTime() <= paidAtMs) continue;
    }

    const uuid = eventUuid(event.uri);

    // Never let two leads claim the same Calendly event.
    const { data: claimed } = await db
      .from("strategy_call_bookings")
      .select("lead_id")
      .eq("calendly_event_uri", event.uri)
      .neq("lead_id", lead.id)
      .maybeSingle();
    if (claimed) continue;

    const invitees = await listEventInvitees(uuid);
    // Exact email match only — never claim someone else's booking.
    const invitee = invitees.find(
      (i) => sameEmail(i.email, lead.email) && i.status !== "canceled",
    );
    if (!invitee) continue;

    const now = new Date().toISOString();
    const { error } = await db.from("strategy_call_bookings").upsert(
      {
        lead_id: lead.id,
        payment_id: payment.id,
        calendly_event_uri: event.uri,
        calendly_event_uuid: uuid,
        calendly_invitee_uri: invitee.uri,
        invitee_email: invitee.email ?? lead.email,
        calendly_event_name: event.name ?? null,
        calendly_reschedule_url: invitee.reschedule_url ?? null,
        calendly_cancel_url: invitee.cancel_url ?? null,
        join_url: event.location?.join_url ?? null,
        scheduled_at: event.start_time ?? null,
        event_end_time: event.end_time ?? null,
        timezone: invitee.timezone ?? null,
        status: "confirmed",
        booked_at: now,
        verified_at: now,
        verification_method: "calendly_api",
        cancelled_at: null,
        cancellation_reason: null,
      },
      { onConflict: "lead_id" },
    );
    if (error) throw new Error(error.message);

    await db.from("strategy_call_leads").update({ stage: "booked" }).eq("id", lead.id);

    // WhatsApp access is unlocked here and nowhere else on the client path.
    await db
      .from("strategy_call_entitlements")
      .update({ whatsapp_status: "enabled", whatsapp_access_enabled_at: now, revoked_at: null })
      .eq("lead_id", lead.id)
      .in("whatsapp_status", ["not_granted", "invited", "revoked"]);

    return {
      status: "confirmed",
      booking: {
        status: "confirmed",
        scheduledAt: event.start_time ?? null,
        eventName: event.name ?? null,
        joinUrl: event.location?.join_url ?? null,
        rescheduleUrl: invitee.reschedule_url ?? null,
        cancelUrl: invitee.cancel_url ?? null,
        timezone: invitee.timezone ?? null,
        eventUuid: uuid,
      },
    };
  }

  return { status: "pending", booking: null };
}

export interface ReconcileSummary {
  checked: number;
  cancelled: number;
}

/**
 * Cancellation handling without webhooks: re-check confirmed bookings against
 * the Calendly API. A cancelled or missing event rolls the lead back to `paid`
 * so they can rebook — the ₹9 stays valid.
 */
export async function reconcileCalendlyBookings(limit = 200): Promise<ReconcileSummary> {
  const db = await admin();
  if (!isCalendlyApiConfigured()) return { checked: 0, cancelled: 0 };

  const { data: bookings } = await db
    .from("strategy_call_bookings")
    .select("id, lead_id, calendly_event_uuid")
    .in("status", [...CONFIRMED_STATUSES])
    .not("calendly_event_uuid", "is", null)
    .limit(limit);

  let cancelled = 0;
  for (const booking of bookings ?? []) {
    const uuid = booking.calendly_event_uuid;
    if (!uuid) continue;
    const event = await getScheduledEvent(uuid);
    const isGone = event === null || event.status === "canceled";
    if (!isGone) continue;

    await db
      .from("strategy_call_bookings")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancellation_reason: "Cancelled in Calendly",
      })
      .eq("id", booking.id);

    // Payment stays valid, so the lead drops back to `paid` and can rebook.
    await db.from("strategy_call_leads").update({ stage: "paid" }).eq("id", booking.lead_id);
    cancelled += 1;
  }

  return { checked: bookings?.length ?? 0, cancelled };
}
