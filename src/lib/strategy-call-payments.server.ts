/**
 * Payment state machine for the ₹9 Strategy Call — server only.
 *
 * Flow: hosted Razorpay Payment Link (redirect), returning to /book with a
 * signed set of query params. States:
 *   created → payment_pending → paid | payment_failed | payment_cancelled
 * Only `paid` + `verified` unlocks Calendly, and that decision is made here
 * (and in the database function `strategy_call_booking_unlocked`), never by
 * the browser. The redirect params are a hint that needs verifying — the
 * webhook is the authoritative path. Both converge on `markPaid`.
 */
import {
  STRATEGY_CALL_AMOUNT_PAISE,
  STRATEGY_CALL_CURRENCY,
  createPaymentLink,
  fetchRazorpayPayment,
  verifyPaymentLinkSignature,
} from "./razorpay.server";

export type PaymentState =
  | "created"
  | "payment_pending"
  | "paid"
  | "payment_failed"
  | "payment_cancelled";

const GENERIC_ERROR = "Something went wrong. Please try again.";
const CALLBACK_URL = "https://growthmultiplierai.live/book";
const LINK_TTL_SECONDS = 3600;

export interface PaymentLinkResult {
  shortUrl?: string;
  alreadyPaid?: boolean;
  locked?: boolean;
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

async function findLead(leadId: string, accessToken: string) {
  const db = await admin();
  const { data, error } = await db
    .from("strategy_call_leads")
    .select("id, name, email, phone")
    .eq("id", leadId)
    .eq("access_token", accessToken)
    .maybeSingle();
  if (error) console.error("Lead lookup failed", error);
  return data ?? null;
}

async function requireLead(leadId: string, accessToken: string) {
  const lead = await findLead(leadId, accessToken);
  if (!lead) throw new Error("We couldn't find your session. Please start again.");
  return lead;
}

/**
 * Creates (or reuses) the single open hosted Payment Link for a lead.
 * Never creates a second live link while one is still usable.
 */
export async function startPaymentLink(
  leadId: string,
  accessToken: string,
): Promise<PaymentLinkResult> {
  const lead = await findLead(leadId, accessToken);
  if (!lead) return { locked: true };

  const db = await admin();

  // Already paid? Never create another link.
  const { data: paid } = await db
    .from("strategy_call_payments")
    .select("id")
    .eq("lead_id", lead.id)
    .eq("status", "paid")
    .maybeSingle();
  if (paid) return { alreadyPaid: true };

  // Reuse an open, unexpired link so a refresh doesn't spawn a second one.
  const freshAfter = new Date(Date.now() - LINK_TTL_SECONDS * 1000).toISOString();
  const { data: open } = await db
    .from("strategy_call_payments")
    .select("id, razorpay_payment_link_short_url, created_at")
    .eq("lead_id", lead.id)
    .eq("status", "created")
    .not("razorpay_payment_link_short_url", "is", null)
    .gte("created_at", freshAfter)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (open?.razorpay_payment_link_short_url) {
    return { shortUrl: open.razorpay_payment_link_short_url };
  }

  // A fresh row first: its UUID is the Razorpay reference_id (36 chars).
  const { data: row, error: insertError } = await db
    .from("strategy_call_payments")
    .insert({
      lead_id: lead.id,
      amount_paise: STRATEGY_CALL_AMOUNT_PAISE,
      currency: STRATEGY_CALL_CURRENCY,
      status: "created",
      attempts: 1,
    })
    .select("id")
    .single();

  if (insertError || !row) {
    console.error("Payment row insert failed", insertError);
    throw new Error(GENERIC_ERROR);
  }

  let link;
  try {
    link = await createPaymentLink({
      amountPaise: STRATEGY_CALL_AMOUNT_PAISE,
      referenceId: row.id,
      description: "₹9 AI Growth Strategy Session — Growth Multiplier AI",
      customer: { name: lead.name, email: lead.email, contact: lead.phone },
      notes: { lead_id: lead.id, payment_row_id: row.id },
      callbackUrl: CALLBACK_URL,
      expireBy: Math.floor(Date.now() / 1000) + LINK_TTL_SECONDS,
    });
  } catch (error) {
    console.error("Payment link creation failed", error);
    throw new Error(GENERIC_ERROR);
  }

  const { error: updateError } = await db
    .from("strategy_call_payments")
    .update({
      razorpay_payment_link_id: link.id,
      razorpay_payment_link_short_url: link.short_url,
      razorpay_reference_id: link.reference_id || row.id,
    })
    .eq("id", row.id);
  if (updateError) {
    console.error("Payment row link update failed", updateError);
    throw new Error(GENERIC_ERROR);
  }

  const { error: stageError } = await db
    .from("strategy_call_leads")
    .update({ stage: "payment_pending" })
    .eq("id", lead.id);
  if (stageError) console.error("Lead stage update failed", stageError);

  return { shortUrl: link.short_url };
}

/** Marks a payment row paid + verified and unlocks the rest of the journey. */
async function markPaid(input: {
  paymentRowId: string;
  paymentId: string;
  signature?: string | undefined;
  method?: string | undefined;
  payload?: Record<string, unknown> | undefined;
}): Promise<string | null> {
  const db = await admin();
  const { data: payment, error } = await db
    .from("strategy_call_payments")
    .select("id, lead_id, status")
    .eq("id", input.paymentRowId)
    .maybeSingle();

  if (error) console.error("Payment lookup failed", error);
  if (!payment) return null;
  if (payment.status === "paid") return payment.lead_id; // idempotent no-op

  const now = new Date().toISOString();
  const { error: updateError } = await db
    .from("strategy_call_payments")
    .update({
      razorpay_payment_id: input.paymentId,
      razorpay_signature: input.signature ?? null,
      status: "paid",
      verification_status: "verified",
      verified_at: now,
      paid_at: now,
      method: input.method ?? null,
      failure_reason: null,
      provider_payload: asJson(input.payload),
    })
    .eq("id", payment.id);
  if (updateError) {
    console.error("Payment mark-paid failed", updateError);
    throw new Error(GENERIC_ERROR);
  }

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

export interface PaymentLinkReturnParams {
  paymentId: string;
  paymentLinkId: string;
  referenceId: string;
  status: string;
  signature: string;
}

/**
 * Verifies the hosted Payment Link redirect server-side: signature, ownership,
 * then the real amount/currency/status straight from the Razorpay API.
 */
export async function verifyPaymentLinkReturn(input: {
  leadId: string;
  accessToken: string;
  params: PaymentLinkReturnParams;
}): Promise<{ status: PaymentState; bookingUnlocked: boolean; error?: string }> {
  const lead = await requireLead(input.leadId, input.accessToken);
  const db = await admin();
  const p = input.params;

  const signatureOk = verifyPaymentLinkSignature({
    paymentLinkId: p.paymentLinkId,
    referenceId: p.referenceId,
    status: p.status,
    paymentId: p.paymentId,
    signature: p.signature,
  });
  if (!signatureOk) {
    console.error("Payment link signature mismatch", {
      leadId: lead.id,
      referenceId: p.referenceId,
      paymentLinkId: p.paymentLinkId,
    });
    return { status: "payment_failed", bookingUnlocked: false, error: GENERIC_ERROR };
  }

  const { data: payment, error } = await db
    .from("strategy_call_payments")
    .select("id, lead_id, status")
    .eq("razorpay_reference_id", p.referenceId)
    .maybeSingle();
  if (error) console.error("Payment row lookup failed", error);

  if (!payment || payment.lead_id !== lead.id) {
    console.error("Payment link reference does not belong to lead", {
      leadId: lead.id,
      referenceId: p.referenceId,
    });
    return { status: "payment_failed", bookingUnlocked: false, error: GENERIC_ERROR };
  }

  if (payment.status === "paid") return { status: "paid", bookingUnlocked: true };

  const remote = await fetchRazorpayPayment(p.paymentId);
  const valid =
    remote !== null &&
    remote.amount === STRATEGY_CALL_AMOUNT_PAISE &&
    remote.currency === STRATEGY_CALL_CURRENCY &&
    remote.status === "captured";

  if (!valid) {
    console.error("Payment link amount/status assertion failed — manual review needed", {
      paymentRowId: payment.id,
      paymentId: p.paymentId,
      amount: remote?.amount,
      currency: remote?.currency,
      remoteStatus: remote?.status,
    });
    await db
      .from("strategy_call_payments")
      .update({
        verification_status: "mismatch",
        razorpay_payment_id: p.paymentId,
        failure_reason: "Payment link verification failed",
      })
      .eq("id", payment.id);
    return { status: payment.status as PaymentState, bookingUnlocked: false, error: GENERIC_ERROR };
  }

  await markPaid({
    paymentRowId: payment.id,
    paymentId: p.paymentId,
    signature: p.signature,
    ...(remote.method ? { method: remote.method } : {}),
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
  amount?: number;
  currency?: string;
  method?: string;
  error_description?: string;
}

interface RazorpayLinkEntity {
  id?: string;
  reference_id?: string;
}

async function paymentRowIdForEvent(
  db: Awaited<ReturnType<typeof admin>>,
  link: RazorpayLinkEntity,
  payment: RazorpayWebhookEntity,
): Promise<string | null> {
  if (link.reference_id) {
    const { data } = await db
      .from("strategy_call_payments")
      .select("id")
      .eq("razorpay_reference_id", link.reference_id)
      .maybeSingle();
    if (data) return data.id;
  }
  if (link.id) {
    const { data } = await db
      .from("strategy_call_payments")
      .select("id")
      .eq("razorpay_payment_link_id", link.id)
      .maybeSingle();
    if (data) return data.id;
  }
  if (payment.order_id) {
    const { data } = await db
      .from("strategy_call_payments")
      .select("id")
      .eq("razorpay_order_id", payment.order_id)
      .maybeSingle();
    if (data) return data.id;
  }
  return null;
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
    console.error("Webhook event insert failed", insertError);
    throw new Error(GENERIC_ERROR);
  }

  const container = (
    input.payload as {
      payload?: {
        payment?: { entity?: RazorpayWebhookEntity };
        payment_link?: { entity?: RazorpayLinkEntity };
      };
    }
  ).payload;
  const entity = (container?.payment?.entity ?? {}) as RazorpayWebhookEntity;
  const linkEntity = (container?.payment_link?.entity ?? {}) as RazorpayLinkEntity;

  let result = "ignored";
  const rowId = await paymentRowIdForEvent(db, linkEntity, entity);

  if (rowId) {
    if (
      input.eventType === "payment_link.paid" ||
      input.eventType === "payment.captured" ||
      input.eventType === "order.paid"
    ) {
      // Never grant on an amount we did not ask for.
      if (
        entity.amount !== STRATEGY_CALL_AMOUNT_PAISE ||
        entity.currency !== STRATEGY_CALL_CURRENCY
      ) {
        console.error("Webhook amount/currency mismatch — not granting", {
          paymentRowId: rowId,
          amount: entity.amount,
          currency: entity.currency,
        });
        await db
          .from("strategy_call_payments")
          .update({
            verification_status: "mismatch",
            failure_reason: "Webhook amount/currency mismatch",
          })
          .eq("id", rowId)
          .neq("status", "paid");
        result = "mismatch";
      } else {
        const leadId = await markPaid({
          paymentRowId: rowId,
          paymentId: entity.id ?? "",
          ...(entity.method ? { method: entity.method } : {}),
          payload: input.payload,
        });
        result = leadId ? "paid" : "unknown_payment";
      }
    } else if (input.eventType === "payment.failed") {
      await db
        .from("strategy_call_payments")
        .update({
          status: "payment_failed",
          razorpay_payment_id: entity.id ?? null,
          failure_reason: entity.error_description ?? "Payment failed",
          provider_payload: asJson(input.payload),
        })
        .eq("id", rowId)
        .in("status", ["created", "payment_pending"]);
      result = "failed";
    }
  } else {
    result = "unknown_payment";
  }

  await db
    .from("strategy_call_webhook_events")
    .update({ result, processed_at: new Date().toISOString() })
    .eq("provider", "razorpay")
    .eq("event_id", input.eventId);

  return result;
}
