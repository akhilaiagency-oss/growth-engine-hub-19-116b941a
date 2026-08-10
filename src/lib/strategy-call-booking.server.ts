/**
 * Booking (Calendly) state machine for the ₹9 Strategy Call — server only.
 *
 * The booking step is gated by `strategy_call_booking_unlocked(lead_id)`, which
 * only returns true for a payment that is BOTH `paid` and `verified`. The
 * browser can never unlock it: the scheduling URL is issued server-side and
 * only after that check passes.
 *
 * A booking is only marked `scheduled` when Calendly itself confirms it via a
 * signature-verified webhook — never because the embed said so.
 */
import { getSchedulingUrl, type CalendlyInviteePayload } from "./calendly.server";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

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
  } | null;
  whatsappStatus: string;
}

/**
 * Authoritative gate + scheduling URL issuer.
 * The lead id travels to Calendly as `utm_content`, which comes back on the
 * webhook payload and is how a Calendly event is tied to the paid lead.
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

  const { data: lead } = await db
    .from("strategy_call_leads")
    .select("id, name, email")
    .eq("id", leadId)
    .eq("access_token", accessToken)
    .maybeSingle();
  if (!lead) return locked;

  const { data: unlocked } = await db.rpc("strategy_call_booking_unlocked", {
    _lead_id: lead.id,
  });
  if (unlocked !== true) return locked;

  const [{ data: booking }, { data: entitlement }] = await Promise.all([
    db
      .from("strategy_call_bookings")
      .select(
        "status, scheduled_at, calendly_event_name, join_url, calendly_reschedule_url, calendly_cancel_url, timezone",
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
        }
      : null,
    whatsappStatus: entitlement?.whatsapp_status ?? "not_granted",
  };
}

type Json = Record<string, unknown>;

function asJson(value: Record<string, unknown> | undefined) {
  return (value ?? {}) as unknown as never;
}

/** Resolves the paid lead a Calendly invitee belongs to. */
async function resolveLeadId(invitee: CalendlyInviteePayload): Promise<string | null> {
  const db = await admin();
  const tracked = invitee.tracking?.utm_content?.trim();
  if (tracked) {
    const { data } = await db
      .from("strategy_call_leads")
      .select("id")
      .eq("id", tracked)
      .maybeSingle();
    if (data) return data.id;
  }

  // Fallback: match the most recent lead with a verified payment for this email.
  const email = invitee.email?.trim().toLowerCase();
  if (!email) return null;
  const { data } = await db
    .from("strategy_call_leads")
    .select("id, created_at")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(5);
  for (const lead of data ?? []) {
    const { data: unlocked } = await db.rpc("strategy_call_booking_unlocked", {
      _lead_id: lead.id,
    });
    if (unlocked === true) return lead.id;
  }
  return null;
}

async function paymentIdFor(leadId: string): Promise<string | null> {
  const db = await admin();
  const { data } = await db
    .from("strategy_call_payments")
    .select("id")
    .eq("lead_id", leadId)
    .eq("status", "paid")
    .maybeSingle();
  return data?.id ?? null;
}

/**
 * Idempotent webhook application. Called only after signature verification.
 * Handles invitee.created (booked), a reschedule (invitee.created with
 * `rescheduled: true`) and invitee.canceled.
 */
export async function applyCalendlyWebhook(input: {
  eventId: string;
  eventType: string;
  payload: Json;
}): Promise<string> {
  const db = await admin();

  // The unique (provider, event_id) index makes replays a no-op.
  const { error: insertError } = await db.from("strategy_call_webhook_events").insert({
    provider: "calendly",
    event_id: input.eventId,
    event_type: input.eventType,
    signature_verified: true,
    payload: asJson(input.payload),
  });
  if (insertError) {
    if (insertError.code === "23505") return "duplicate";
    throw new Error(insertError.message);
  }

  const invitee = (input.payload["payload"] ?? {}) as CalendlyInviteePayload;
  let result = "ignored";

  const leadId = await resolveLeadId(invitee);
  if (!leadId) {
    result = "unknown_lead";
  } else if (input.eventType === "invitee.created") {
    const event = invitee.scheduled_event ?? {};
    const paymentId = await paymentIdFor(leadId);
    const { error } = await db.from("strategy_call_bookings").upsert(
      {
        lead_id: leadId,
        payment_id: paymentId,
        calendly_event_uri: event.uri ?? null,
        calendly_invitee_uri: invitee.uri ?? null,
        calendly_event_name: event.name ?? null,
        calendly_reschedule_url: invitee.reschedule_url ?? null,
        calendly_cancel_url: invitee.cancel_url ?? null,
        join_url: event.location?.join_url ?? null,
        scheduled_at: event.start_time ?? null,
        timezone: invitee.timezone ?? null,
        status: invitee.rescheduled ? "rescheduled" : "scheduled",
        booked_at: new Date().toISOString(),
        cancelled_at: null,
        cancellation_reason: null,
        provider_payload: asJson(input.payload),
      },
      { onConflict: "lead_id" },
    );
    if (error) throw new Error(error.message);

    // Only a Calendly-confirmed booking moves the lead to BOOKED.
    await db.from("strategy_call_leads").update({ stage: "booked" }).eq("id", leadId);

    // WhatsApp access unlocks on a confirmed booking.
    await db
      .from("strategy_call_entitlements")
      .update({ whatsapp_status: "invited", invited_at: new Date().toISOString() })
      .eq("lead_id", leadId)
      .in("whatsapp_status", ["not_granted", "revoked"]);

    result = invitee.rescheduled ? "rescheduled" : "scheduled";
  } else if (input.eventType === "invitee.canceled") {
    await db
      .from("strategy_call_bookings")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancellation_reason: invitee.cancellation?.reason ?? "Cancelled in Calendly",
        provider_payload: asJson(input.payload),
      })
      .eq("lead_id", leadId);

    // Payment stays valid, so the lead drops back to `paid` and can rebook.
    await db.from("strategy_call_leads").update({ stage: "paid" }).eq("id", leadId);
    result = "cancelled";
  }

  await db
    .from("strategy_call_webhook_events")
    .update({ result, processed_at: new Date().toISOString() })
    .eq("provider", "calendly")
    .eq("event_id", input.eventId);

  return result;
}
