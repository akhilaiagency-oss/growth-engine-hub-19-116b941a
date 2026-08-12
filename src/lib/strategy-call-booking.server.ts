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
  parseScheduledEventUuid,
  sameEmail,
  type CalendlyEvent,
} from "./calendly.server";
import { getWhatsappCommunityUrl } from "./whatsapp-access.server";
import { isQualificationComplete, type QualificationDetails } from "./strategy-call.server";

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
  /** Boolean gate only — the community URL never travels in this payload. */
  whatsappUnlocked: boolean;
  /** All five post-payment answers present. */
  qualificationComplete: boolean;
  /** Any answers already given, so a returning lead resumes in the right place. */
  qualification: QualificationDetails | null;
}

async function loadLead(leadId: string, accessToken: string) {
  const db = await admin();
  const { data } = await db
    .from("strategy_call_leads")
    .select(
      "id, name, email, business_type, what_you_sell, marketing_spend, desired_outcome, timeline",
    )
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
    .not("verified_at", "is", null)
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
    whatsappUnlocked: false,
    qualificationComplete: false,
    qualification: null,
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
    qualificationComplete: isQualificationComplete(lead),
    qualification: {
      businessType: lead.business_type ?? "",
      whatYouSell: lead.what_you_sell ?? "",
      marketingSpend: lead.marketing_spend ?? "",
      desiredOutcome: lead.desired_outcome ?? "",
      timeline: lead.timeline ?? "",
    },
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
    whatsappUnlocked:
      Boolean(booking && CONFIRMED_STATUSES.includes(booking.status as (typeof CONFIRMED_STATUSES)[number])) &&
      Boolean(getWhatsappCommunityUrl()),
  };
}

export type VerifyStatus = "unpaid" | "pending" | "confirmed" | "not_configured";

export interface VerifyResult {
  status: VerifyStatus;
  booking: BookingAccess["booking"];
  /** Same gate as BookingAccess, so the fast path never renders a stale lock. */
  whatsappUnlocked: boolean;
  whatsappStatus: string;
}

const LOCKED_VERIFY: VerifyResult = {
  status: "unpaid",
  booking: null,
  whatsappUnlocked: false,
  whatsappStatus: "not_granted",
};

export interface BookingHints {
  eventUri?: string | null;
  inviteeUri?: string | null;
}

/**
 * The ONLY code path allowed to mark a booking confirmed.
 * Requires a server-verified, captured Razorpay payment first, then asks the
 * Calendly API whether an active event exists for this exact invitee email.
 *
 * The browser may pass an `eventUri` hint from the embed's `event_scheduled`
 * message. It is UNTRUSTED: it only tells us which event to fetch first, and
 * that event must still pass every check a searched event passes. A forged URI
 * can never confirm a booking — it just fails and falls through to the search.
 */
export async function verifyCalendlyBooking(
  leadId: string,
  accessToken: string,
  hints?: BookingHints,
): Promise<VerifyResult> {
  const db = await admin();
  const lead = await loadLead(leadId, accessToken);
  if (!lead) return LOCKED_VERIFY;

  const payment = await paidPayment(lead.id);
  if (!payment) return LOCKED_VERIFY;

  if (!isCalendlyApiConfigured())
    return { ...LOCKED_VERIFY, status: "not_configured" };

  const paidAtRaw = payment.verified_at ?? payment.paid_at ?? null;
  const paidAtMs = paidAtRaw ? new Date(paidAtRaw).getTime() : null;

  /** Every gate a candidate event must clear before it can be claimed. */
  const tryClaim = async (event: CalendlyEvent): Promise<VerifyResult | null> => {
    if (!event.uri) return null;
    if (event.status === "canceled") return null;

    // The booking step is gated behind payment, so a legitimate booking for
    // this payment can only have been created after the payment was verified.
    // An older event belongs to an earlier session and must never be claimed.
    // No trustworthy payment timestamp means we cannot prove this event belongs
    // to this payment. Refuse rather than guess.
    if (paidAtMs === null) return null;
    if (!event.created_at) return null;
    if (new Date(event.created_at).getTime() <= paidAtMs) return null;

    const uuid = eventUuid(event.uri);

    // Never let two leads claim the same Calendly event.
    const { data: claimed } = await db
      .from("strategy_call_bookings")
      .select("lead_id")
      .eq("calendly_event_uri", event.uri)
      .neq("lead_id", lead.id)
      .maybeSingle();
    if (claimed) return null;

    const invitees = await listEventInvitees(uuid);
    // Exact email match only — never claim someone else's booking.
    const invitee = invitees.find(
      (i) => sameEmail(i.email, lead.email) && i.status !== "canceled",
    );
    if (!invitee) return null;

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

    // Bonus documents email — fire-and-forget, once only. An email failure can
    // never fail or roll back the booking confirmation above.
    try {
      const { sendBonusDocumentsEmail } = await import("./bonus-email.server");
      await sendBonusDocumentsEmail(lead.id);
    } catch {
      /* intentionally ignored */
    }

    // Read the gate back from the row we just wrote: 'enabled', or 'joined'
    // when this lead had already joined during an earlier booking.
    const { data: entitlement } = await db
      .from("strategy_call_entitlements")
      .select("whatsapp_status")
      .eq("lead_id", lead.id)
      .maybeSingle();

    return {
      status: "confirmed",
      whatsappUnlocked: Boolean(getWhatsappCommunityUrl()),
      whatsappStatus: entitlement?.whatsapp_status ?? "enabled",
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
  };

  // FAST PATH — the embed told us exactly which event was created. Fetch that
  // one event directly: no list-indexing lag, no /users/me round trip.
  const hintedUuid =
    parseScheduledEventUuid(hints?.eventUri) ?? parseScheduledEventUuid(hints?.inviteeUri);
  if (hintedUuid) {
    // The event must exist in Calendly — the client's claim alone proves nothing.
    const event = await getScheduledEvent(hintedUuid);
    if (event) {
      const claimed = await tryClaim(event);
      if (claimed) return claimed;
    }
  }

  // FALLBACK — no usable hint, or the hinted event failed validation.
  // `min_start_time` filters on when an event STARTS, so it is only a coarse
  // pre-filter that drops past events. `created_at` is the authoritative gate.
  const events = await listScheduledEvents({
    inviteeEmail: lead.email,
    minStartTime: paidAtRaw ? new Date(paidAtRaw).toISOString() : null,
    status: "active",
  });

  for (const event of events) {
    if (hintedUuid && eventUuid(event.uri) === hintedUuid) continue; // already tried
    const claimed = await tryClaim(event);
    if (claimed) return claimed;
  }

  return { ...LOCKED_VERIFY, status: "pending" };
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

    // Community access is revoked until a new booking is confirmed.
    await db
      .from("strategy_call_entitlements")
      .update({ whatsapp_status: "revoked", revoked_at: new Date().toISOString() })
      .eq("lead_id", booking.lead_id)
      .in("whatsapp_status", ["enabled", "invited", "joined"]);
    cancelled += 1;
  }

  return { checked: bookings?.length ?? 0, cancelled };
}
