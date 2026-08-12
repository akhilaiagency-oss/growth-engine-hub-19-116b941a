/**
 * Payment state machine for the ₹9 Strategy Call — server only.
 *
 * Flow: Razorpay **Payment Links** (hosted redirect). The browser is sent away
 * to a Razorpay-hosted page and returned to /book with signed GET params.
 *
 * States: created → payment_pending → paid | payment_failed | payment_cancelled
 * Only `paid` + `verified` unlocks Calendly, and that decision is made here
 * (and in the database function `strategy_call_booking_unlocked`), never by
 * the browser. The return-URL params are a hint that a signature needs
 * verifying — the webhook remains authoritative.
 */
import {
  STRATEGY_CALL_AMOUNT_PAISE,
  STRATEGY_CALL_CURRENCY,
  createRazorpayPaymentLink,
  getRazorpayCreds,
  verifyPaymentLinkSignature,
} from "./razorpay.server";

export type PaymentState =
  | "created"
  | "payment_pending"
  | "paid"
  | "payment_failed"
  | "payment_cancelled";

export type PaymentLinkStart =
  | { alreadyPaid: true }
  | { locked: true }
  | {
      shortUrl: string;
      paymentLinkId: string;
      amountPaise: number;
      currency: string;
      mode: "test" | "live";
    };

const GENERIC_ERROR = "Something went wrong. Please try again.";

type Json = Parameters<typeof JSON.parse>[0] extends never ? never : unknown;

/** Narrows an arbitrary provider payload to the generated Json column type. */
function asJson(value: Record<string, unknown> | undefined) {
  return (value ?? {}) as unknown as Exclude<Json, undefined> & Record<string, never>;
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function findLead(leadId: string, accessToken: string) {
  const db = await admin();
  const { data, error } = await db
    .from("strategy_call_leads")
    .select("id, name, email, phone")
    .eq("id", leadId)
    .eq("access_token", accessToken)
    .maybeSingle();
  if (error) {
    console.error("[strategy-call] lead lookup failed", error);
    throw new Error(GENERIC_ERROR);
  }
  return data;
}

async function requireLead(leadId: string, accessToken: string) {
  const lead = await findLead(leadId, accessToken);
  if (!lead) throw new Error("We couldn't find your session. Please start again.");
  return lead;
}

/** Base URL the hosted payment page returns the visitor to. */
function callbackUrl(origin: string | null): string {
  const base =
    (origin && /^https?:\/\//.test(origin) ? origin.replace(/\/+$/, "") : null) ??
    (process.env["PUBLIC_SITE_URL"] ?? "https://growth-engine-hub-19.lovable.app").replace(
      /\/+$/,
      "",
    );
  return `${base}/book`;
}

/**
 * Creates (or reuses) the single open Razorpay Payment Link for a lead and
 * returns the hosted URL to redirect to. Reusing the open row means refreshing
 * or double-clicking never spawns duplicate payment records.
 */
export async function startPaymentLink(
  leadId: string,
  accessToken: string,
  origin: string | null,
): Promise<PaymentLinkStart> {
  const lead = await findLead(leadId, accessToken);
  if (!lead) return { locked: true };

  const db = await admin();
  const { mode } = getRazorpayCreds();

  // Already paid? Never create a second link.
  const { data: paid } = await db
    .from("strategy_call_payments")
    .select("id")
    .eq("lead_id", lead.id)
    .eq("status", "paid")
    .maybeSingle();
  if (paid) return { alreadyPaid: true };

  // Reuse an open attempt's live link when we still have one.
  const { data: open } = await db
    .from("strategy_call_payments")
    .select("id, razorpay_payment_link_id, razorpay_payment_link_short_url, amount_paise, currency")
    .eq("lead_id", lead.id)
    .in("status", ["created", "payment_pending"])
    .maybeSingle();

  if (open?.razorpay_payment_link_short_url && open.razorpay_payment_link_id) {
    await db
      .from("strategy_call_payments")
      .update({ status: "payment_pending", attempts: 1 })
      .eq("id", open.id);
    return {
      shortUrl: open.razorpay_payment_link_short_url,
      paymentLinkId: open.razorpay_payment_link_id,
      amountPaise: open.amount_paise,
      currency: open.currency,
      mode,
    };
  }

  const referenceId = `sc_${lead.id.replace(/-/g, "").slice(0, 18)}_${Date.now().toString(36)}`;
  const link = await createRazorpayPaymentLink({
    amountPaise: STRATEGY_CALL_AMOUNT_PAISE,
    referenceId,
    description: "₹9 Strategy Call reservation",
    customer: { name: lead.name, email: lead.email, contact: lead.phone },
    callbackUrl: callbackUrl(origin),
    notes: { lead_id: lead.id },
  });

  const row = {
    razorpay_payment_link_id: link.id,
    razorpay_payment_link_short_url: link.short_url,
    razorpay_reference_id: referenceId,
    status: "payment_pending" as const,
    receipt: referenceId,
  };

  if (open) {
    const { error } = await db.from("strategy_call_payments").update(row).eq("id", open.id);
    if (error) {
      console.error("[strategy-call] payment update failed", error);
      throw new Error(GENERIC_ERROR);
    }
  } else {
    const { error } = await db.from("strategy_call_payments").insert({
      lead_id: lead.id,
      amount_paise: STRATEGY_CALL_AMOUNT_PAISE,
      currency: STRATEGY_CALL_CURRENCY,
      attempts: 1,
      ...row,
    });
    if (error) {
      console.error("[strategy-call] payment insert failed", error);
      throw new Error(GENERIC_ERROR);
    }
  }

  await db.from("strategy_call_leads").update({ stage: "payment_pending" }).eq("id", lead.id);

  return {
    shortUrl: link.short_url,
    paymentLinkId: link.id,
    amountPaise: STRATEGY_CALL_AMOUNT_PAISE,
    currency: STRATEGY_CALL_CURRENCY,
    mode,
  };
}

/** Marks a payment row paid + verified and unlocks the rest of the journey. */
async function markPaid(input: {
  orderId?: string | undefined;
  paymentLinkId?: string | undefined;
  paymentId: string;
  signature?: string | undefined;
  method?: string | undefined;
  payload?: Record<string, unknown> | undefined;
}): Promise<string | null> {
  const db = await admin();

  let query = db.from("strategy_call_payments").select("id, lead_id, status");
  if (input.paymentLinkId) query = query.eq("razorpay_payment_link_id", input.paymentLinkId);
  else if (input.orderId) query = query.eq("razorpay_order_id", input.orderId);
  else return null;

  const { data: payment } = await query.maybeSingle();

  if (!payment) return null;
  if (payment.status === "paid") return payment.lead_id; // idempotent no-op

  await db
    .from("strategy_call_payments")
    .update({
      razorpay_payment_id: input.paymentId,
      razorpay_signature: input.signature ?? null,
      status: "paid",
      verification_status: "verified",
      verified_at: new Date().toISOString(),
      paid_at: new Date().toISOString(),
      method: input.method ?? null,
      failure_reason: null,
      provider_payload: asJson(input.payload),
    })
    .eq("id", payment.id);

  await db.from("strategy_call_leads").update({ stage: "paid" }).eq("id", payment.lead_id);

  // Booking becomes reachable. Community access stays locked until a booking
  // is confirmed against the Calendly API — payment alone never grants it.
  await db
    .from("strategy_call_bookings")
    .upsert(
      { lead_id: payment.lead_id, payment_id: payment.id, status: "pending" },
      { onConflict: "lead_id", ignoreDuplicates: true },
    );

  return payment.lead_id;
}

/**
 * Verifies the signed GET params Razorpay appends to the Payment Link
 * callback URL. A bad signature records `mismatch` and leaves the lead locked.
 */
export async function verifyPaymentLinkReturn(input: {
  leadId: string;
  accessToken: string;
  paymentId: string;
  paymentLinkId: string;
  referenceId: string;
  status: string;
  signature: string;
}): Promise<{ status: PaymentState; bookingUnlocked: boolean }> {
  const lead = await requireLead(input.leadId, input.accessToken);
  const db = await admin();

  const { data: payment } = await db
    .from("strategy_call_payments")
    .select("id, lead_id, status")
    .eq("razorpay_payment_link_id", input.paymentLinkId)
    .maybeSingle();

  if (!payment || payment.lead_id !== lead.id) {
    return { status: "payment_failed", bookingUnlocked: false };
  }
  if (payment.status === "paid") return { status: "paid", bookingUnlocked: true };

  const ok = verifyPaymentLinkSignature({
    paymentLinkId: input.paymentLinkId,
    referenceId: input.referenceId,
    status: input.status,
    paymentId: input.paymentId,
    signature: input.signature,
  });

  if (!ok || input.status !== "paid") {
    await db
      .from("strategy_call_payments")
      .update({
        verification_status: ok ? "unverified" : "mismatch",
        razorpay_payment_id: input.paymentId,
        failure_reason: ok ? `Payment link status: ${input.status}` : "Signature verification failed",
      })
      .eq("id", payment.id);
    return { status: payment.status as PaymentState, bookingUnlocked: false };
  }

  await markPaid({
    paymentLinkId: input.paymentLinkId,
    paymentId: input.paymentId,
    signature: input.signature,
  });
  return { status: "paid", bookingUnlocked: true };
}

/** Authoritative gate for the booking step. */
export async function isBookingUnlocked(leadId: string, accessToken: string): Promise<boolean> {
  const lead = await requireLead(leadId, accessToken);
  const db = await admin();
  const { data } = await db.rpc("strategy_call_booking_unlocked", { _lead_id: lead.id });
  return data === true;
}

interface RazorpayWebhookEntity {
  id?: string;
  order_id?: string;
  method?: string;
  error_description?: string;
}

interface RazorpayWebhookPayload {
  payload?: {
    payment?: { entity?: RazorpayWebhookEntity };
    payment_link?: { entity?: { id?: string; status?: string } };
  };
}

/** Idempotent webhook application. Called only after signature verification. */
export async function applyVerifiedWebhook(input: {
  eventId: string;
  eventType: string;
  payload: Record<string, unknown>;
}): Promise<string> {
  const db = await admin();

  // The unique (provider, event_id) index makes replays a no-op.
  const { error: insertError } = await db.from("strategy_call_webhook_events").insert({
    provider: "razorpay",
    event_id: input.eventId,
    event_type: input.eventType,
    signature_verified: true,
    payload: asJson(input.payload),
  });
  if (insertError) {
    if (insertError.code === "23505") return "duplicate";
    console.error("[strategy-call] webhook insert failed", insertError);
    throw new Error(GENERIC_ERROR);
  }

  const body = input.payload as RazorpayWebhookPayload;
  const entity = (body.payload?.payment?.entity ?? {}) as RazorpayWebhookEntity;
  const paymentLinkId = body.payload?.payment_link?.entity?.id;
  const orderId = entity.order_id;
  let result = "ignored";

  const paidEvent =
    input.eventType === "payment_link.paid" ||
    input.eventType === "payment.captured" ||
    input.eventType === "order.paid";

  if (paidEvent && (paymentLinkId || orderId)) {
    const leadId = await markPaid({
      paymentLinkId,
      orderId,
      paymentId: entity.id ?? "",
      method: entity.method,
      payload: input.payload,
    });
    result = leadId ? "paid" : "unknown_payment";
  } else if (input.eventType === "payment.failed" && (paymentLinkId || orderId)) {
    let update = db
      .from("strategy_call_payments")
      .update({
        status: "payment_failed" as const,
        razorpay_payment_id: entity.id ?? null,
        failure_reason: entity.error_description ?? "Payment failed",
        provider_payload: asJson(input.payload),
      })
      .in("status", ["created", "payment_pending"]);
    update = paymentLinkId
      ? update.eq("razorpay_payment_link_id", paymentLinkId)
      : update.eq("razorpay_order_id", orderId!);
    await update;
    result = "failed";
  }

  await db
    .from("strategy_call_webhook_events")
    .update({ result, processed_at: new Date().toISOString() })
    .eq("provider", "razorpay")
    .eq("event_id", input.eventId);

  return result;
}
