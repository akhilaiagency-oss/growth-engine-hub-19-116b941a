/**
 * Payment state machine for the ₹9 Strategy Call — server only.
 *
 * States: created → payment_pending → paid | payment_failed | payment_cancelled
 * Only `paid` + `verified` unlocks Calendly, and that decision is made here
 * (and in the database function `strategy_call_booking_unlocked`), never by
 * the browser. A frontend "success" callback is treated as a hint that a
 * signature needs verifying — never as proof of payment.
 */
import {
  STRATEGY_CALL_AMOUNT_PAISE,
  STRATEGY_CALL_CURRENCY,
  createRazorpayOrder,
  getRazorpayCreds,
  verifyCheckoutSignature,
} from "./razorpay.server";

export type PaymentState =
  | "created"
  | "payment_pending"
  | "paid"
  | "payment_failed"
  | "payment_cancelled";

export interface OrderForCheckout {
  orderId: string;
  amountPaise: number;
  currency: string;
  keyId: string;
  mode: "test" | "live";
  prefill: { name: string; email: string; contact: string };
}

type Json = Parameters<typeof JSON.parse>[0] extends never ? never : unknown;

/** Narrows an arbitrary provider payload to the generated Json column type. */
function asJson(value: Record<string, unknown> | undefined) {
  return (value ?? {}) as unknown as Exclude<Json, undefined> & Record<string, never>;
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function requireLead(leadId: string, accessToken: string) {
  const db = await admin();
  const { data } = await db
    .from("strategy_call_leads")
    .select("id, name, email, phone")
    .eq("id", leadId)
    .eq("access_token", accessToken)
    .maybeSingle();
  if (!data) throw new Error("We couldn't find your session. Please start again.");
  return data;
}

/**
 * Creates (or reuses) the single open Razorpay order for a lead.
 * A partial unique index on (lead_id) for open payments makes duplicate
 * payment rows impossible even under concurrent clicks.
 */
export async function startPayment(
  leadId: string,
  accessToken: string,
): Promise<OrderForCheckout> {
  const lead = await requireLead(leadId, accessToken);
  const db = await admin();
  const { keyId, mode } = getRazorpayCreds();

  const prefill = { name: lead.name, email: lead.email, contact: lead.phone };

  // Already paid? Never create a second order.
  const { data: paid } = await db
    .from("strategy_call_payments")
    .select("razorpay_order_id, amount_paise, currency")
    .eq("lead_id", lead.id)
    .eq("status", "paid")
    .maybeSingle();
  if (paid?.razorpay_order_id) {
    return {
      orderId: paid.razorpay_order_id,
      amountPaise: paid.amount_paise,
      currency: paid.currency,
      keyId,
      prefill,
    };
  }

  // Reuse an open attempt so refreshing the page doesn't spawn orders.
  const { data: open } = await db
    .from("strategy_call_payments")
    .select("id, razorpay_order_id, amount_paise, currency")
    .eq("lead_id", lead.id)
    .in("status", ["created", "payment_pending"])
    .maybeSingle();

  if (open?.razorpay_order_id) {
    await db
      .from("strategy_call_payments")
      .update({ status: "payment_pending", attempts: 1 })
      .eq("id", open.id);
    return {
      orderId: open.razorpay_order_id,
      amountPaise: open.amount_paise,
      currency: open.currency,
      keyId,
      prefill,
    };
  }

  const receipt = `sc_${lead.id.replace(/-/g, "").slice(0, 24)}`;
  const order = await createRazorpayOrder({
    amountPaise: STRATEGY_CALL_AMOUNT_PAISE,
    receipt,
    notes: { lead_id: lead.id },
  });

  if (open) {
    await db
      .from("strategy_call_payments")
      .update({ razorpay_order_id: order.id, status: "payment_pending", receipt })
      .eq("id", open.id);
  } else {
    const { error } = await db.from("strategy_call_payments").insert({
      lead_id: lead.id,
      razorpay_order_id: order.id,
      amount_paise: STRATEGY_CALL_AMOUNT_PAISE,
      currency: STRATEGY_CALL_CURRENCY,
      status: "payment_pending",
      receipt,
      attempts: 1,
    });
    if (error) throw new Error(error.message);
  }

  await db
    .from("strategy_call_leads")
    .update({ stage: "payment_pending" })
    .eq("id", lead.id);

  return {
    orderId: order.id,
    amountPaise: STRATEGY_CALL_AMOUNT_PAISE,
    currency: STRATEGY_CALL_CURRENCY,
    keyId,
    prefill,
  };
}

/** Marks a payment row paid + verified and unlocks the rest of the journey. */
async function markPaid(input: {
  orderId: string;
  paymentId: string;
  signature?: string | undefined;
  method?: string | undefined;
  payload?: Record<string, unknown> | undefined;
}): Promise<string | null> {
  const db = await admin();
  const { data: payment } = await db
    .from("strategy_call_payments")
    .select("id, lead_id, status")
    .eq("razorpay_order_id", input.orderId)
    .maybeSingle();

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

  // Booking becomes reachable, and community access is granted.
  await db
    .from("strategy_call_bookings")
    .upsert(
      { lead_id: payment.lead_id, payment_id: payment.id, status: "pending" },
      { onConflict: "lead_id", ignoreDuplicates: true },
    );
  await db
    .from("strategy_call_entitlements")
    .update({ whatsapp_status: "invited", invited_at: new Date().toISOString() })
    .eq("lead_id", payment.lead_id)
    .eq("whatsapp_status", "not_granted");

  return payment.lead_id;
}

/**
 * Verifies the Razorpay Checkout handshake server-side.
 * A bad signature records `mismatch` and leaves the payment locked.
 */
export async function verifyCheckoutPayment(input: {
  leadId: string;
  accessToken: string;
  orderId: string;
  paymentId: string;
  signature: string;
}): Promise<{ status: PaymentState; bookingUnlocked: boolean }> {
  const lead = await requireLead(input.leadId, input.accessToken);
  const db = await admin();

  const { data: payment } = await db
    .from("strategy_call_payments")
    .select("id, lead_id, status")
    .eq("razorpay_order_id", input.orderId)
    .maybeSingle();

  if (!payment || payment.lead_id !== lead.id) {
    return { status: "payment_failed", bookingUnlocked: false };
  }

  const ok = verifyCheckoutSignature({
    orderId: input.orderId,
    paymentId: input.paymentId,
    signature: input.signature,
  });

  if (!ok) {
    await db
      .from("strategy_call_payments")
      .update({
        verification_status: "mismatch",
        razorpay_payment_id: input.paymentId,
        failure_reason: "Signature verification failed",
      })
      .eq("id", payment.id);
    return { status: payment.status as PaymentState, bookingUnlocked: false };
  }

  await markPaid({
    orderId: input.orderId,
    paymentId: input.paymentId,
    signature: input.signature,
  });
  return { status: "paid", bookingUnlocked: true };
}

/** Browser-reported failure/dismissal. Never affects a payment already paid. */
export async function recordCheckoutOutcome(input: {
  leadId: string;
  accessToken: string;
  orderId: string;
  outcome: "payment_failed" | "payment_cancelled";
  reason?: string | undefined;
}): Promise<void> {
  const lead = await requireLead(input.leadId, input.accessToken);
  const db = await admin();
  await db
    .from("strategy_call_payments")
    .update({
      status: input.outcome,
      failure_reason: input.reason ?? null,
      cancelled_at: input.outcome === "payment_cancelled" ? new Date().toISOString() : null,
    })
    .eq("razorpay_order_id", input.orderId)
    .eq("lead_id", lead.id)
    .in("status", ["created", "payment_pending"]);
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
    throw new Error(insertError.message);
  }

  const entity = (
    (input.payload as { payload?: { payment?: { entity?: RazorpayWebhookEntity } } }).payload
      ?.payment?.entity ?? {}
  ) as RazorpayWebhookEntity;
  const orderId = entity.order_id;
  let result = "ignored";

  if (orderId) {
    if (input.eventType === "payment.captured" || input.eventType === "order.paid") {
      const leadId = await markPaid({
        orderId,
        paymentId: entity.id ?? "",
        method: entity.method,
        payload: input.payload,
      });
      result = leadId ? "paid" : "unknown_order";
    } else if (input.eventType === "payment.failed") {
      await db
        .from("strategy_call_payments")
        .update({
          status: "payment_failed",
          razorpay_payment_id: entity.id ?? null,
          failure_reason: entity.error_description ?? "Payment failed",
          provider_payload: asJson(input.payload),
        })
        .eq("razorpay_order_id", orderId)
        .in("status", ["created", "payment_pending"]);
      result = "failed";
    }
  }

  await db
    .from("strategy_call_webhook_events")
    .update({ result, processed_at: new Date().toISOString() })
    .eq("provider", "razorpay")
    .eq("event_id", input.eventId);

  return result;
}
