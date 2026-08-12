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
  fetchRazorpayPayment,
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

  // The payment row UUID is the Razorpay reference_id (36 chars < 40 limit),
  // so a retry always gets a fresh, unique reference.
  let paymentRowId = open?.id ?? null;
  if (!paymentRowId) {
    const { data: inserted, error } = await db
      .from("strategy_call_payments")
      .insert({
        lead_id: lead.id,
        amount_paise: STRATEGY_CALL_AMOUNT_PAISE,
        currency: STRATEGY_CALL_CURRENCY,
        attempts: 1,
        status: "created" as const,
      })
      .select("id")
      .single();
    if (error || !inserted) {
      console.error("[strategy-call] payment insert failed", error);
      throw new Error(GENERIC_ERROR);
    }
    paymentRowId = inserted.id;
  }

  const referenceId = paymentRowId;
  const link = await createRazorpayPaymentLink({
    amountPaise: STRATEGY_CALL_AMOUNT_PAISE,
    referenceId,
    description: "₹9 AI Growth Strategy Session — Growth Multiplier AI",
    customer: { name: lead.name, email: lead.email, contact: lead.phone },
    callbackUrl: callbackUrl(origin),
    notes: { lead_id: lead.id, payment_row_id: paymentRowId },
    expireBy: Math.floor(Date.now() / 1000) + 3600,
  });

  const { error: updateError } = await db
    .from("strategy_call_payments")
    .update({
      razorpay_payment_link_id: link.id,
      razorpay_payment_link_short_url: link.short_url,
      razorpay_reference_id: referenceId,
      status: "payment_pending" as const,
      receipt: referenceId,
      attempts: 1,
    })
    .eq("id", paymentRowId);
  if (updateError) {
    console.error("[strategy-call] payment update failed", updateError);
    throw new Error(GENERIC_ERROR);
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
  referenceId?: string | undefined;
  paymentId: string;
  signature?: string | undefined;
  method?: string | undefined;
  payload?: Record<string, unknown> | undefined;
}): Promise<string | null> {
  const db = await admin();

  let query = db.from("strategy_call_payments").select("id, lead_id, status");
  if (input.referenceId) query = query.eq("razorpay_reference_id", input.referenceId);
  else if (input.paymentLinkId) query = query.eq("razorpay_payment_link_id", input.paymentLinkId);
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
    .eq("razorpay_reference_id", input.referenceId)
    .maybeSingle();

  if (!payment || payment.lead_id !== lead.id) {
    console.error("[strategy-call] payment link return did not match this lead");
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

  // Signature proves authenticity; Razorpay's API proves the money.
  const remote = await fetchRazorpayPayment(input.paymentId);
  const amountOk =
    remote?.amount === STRATEGY_CALL_AMOUNT_PAISE &&
    remote.currency === STRATEGY_CALL_CURRENCY &&
    remote.status === "captured";

  if (!amountOk) {
    console.error("[strategy-call] payment amount/status mismatch — manual review", {
      paymentId: input.paymentId,
      amount: remote?.amount,
      currency: remote?.currency,
      status: remote?.status,
    });
    await db
      .from("strategy_call_payments")
      .update({
        verification_status: "mismatch",
        razorpay_payment_id: input.paymentId,
        failure_reason: "Payment amount, currency or capture status did not match",
      })
      .eq("id", payment.id);
    return { status: payment.status as PaymentState, bookingUnlocked: false };
  }

  await markPaid({
    paymentLinkId: input.paymentLinkId,
    referenceId: input.referenceId,
    paymentId: input.paymentId,
    signature: input.signature,
    method: remote.method,
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
  amount?: number;
  currency?: string;
  error_description?: string;
}

interface RazorpayWebhookPayload {
  payload?: {
    payment?: { entity?: RazorpayWebhookEntity };
    payment_link?: { entity?: { id?: string; status?: string; reference_id?: string } };
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
  const referenceId = body.payload?.payment_link?.entity?.reference_id;
  const orderId = entity.order_id;
  let result = "ignored";

  const paidEvent =
    input.eventType === "payment_page.paid" ||
    input.eventType === "payment_link.paid" ||
    input.eventType === "payment.captured" ||
    input.eventType === "order.paid";

  if (paidEvent) {
    // Never grant on an amount we did not ask for.
    if (entity.amount !== STRATEGY_CALL_AMOUNT_PAISE || entity.currency !== STRATEGY_CALL_CURRENCY) {
      console.error("[strategy-call] webhook amount mismatch — manual review", {
        eventId: input.eventId,
        amount: entity.amount,
        currency: entity.currency,
      });
      result = "mismatch";
    } else {
      // Legacy Payment Links carry our own reference; hosted Payment Pages do
      // not, so we fall back to matching the payer's email + phone.
      let leadId: string | null = null;
      if (referenceId || paymentLinkId || orderId) {
        leadId = await markPaid({
          referenceId,
          paymentLinkId,
          orderId,
          paymentId: entity.id ?? "",
          method: entity.method,
          payload: input.payload,
        });
      }

      if (leadId) {
        result = "paid";
      } else {
        const payer = extractPayer(entity as Record<string, unknown>);
        const match = await findLeadForPayer(payer);
        if (match) {
          await markPaidForLead(match.leadId, {
            paymentId: entity.id ?? "",
            method: entity.method ?? null,
            payload: input.payload,
            matchMethod: match.matchMethod,
          });
          result = "paid";
        } else {
          console.error("[strategy-call] paid webhook could not be matched to a lead", {
            eventId: input.eventId,
          });
          result = "unmatched";
        }
      }
    }

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

// ---------------------------------------------------------------------------
// Hosted Payment Page support.
//
// A Dashboard-hosted Razorpay Payment Page gives us no signed browser return
// and no reference id of ours, so the signature-verified webhook is the ONLY
// authority. Matching is done on the payer's email (and phone when present),
// which is why /qualify tells the visitor to reuse the same details.
// ---------------------------------------------------------------------------

export interface Payer {
  email: string | null;
  contact: string | null;
}

function normEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim().toLowerCase();
  return v.length > 3 && v.includes("@") ? v : null;
}

/** Last 10 digits — India-friendly comparison that ignores +91 / spacing. */
function phoneTail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const digits = value.replace(/\D+/g, "");
  return digits.length >= 10 ? digits.slice(-10) : null;
}

/** Pulls the payer's email/phone out of a Razorpay payment entity. */
export function extractPayer(entity: Record<string, unknown>): Payer {
  const notes = (entity["notes"] ?? {}) as Record<string, unknown>;
  const email = normEmail(entity["email"]) ?? normEmail(notes["email"]);
  const contact =
    phoneTail(entity["contact"]) ?? phoneTail(notes["contact"]) ?? phoneTail(notes["phone"]);
  return { email, contact };
}

export interface PayerMatch {
  leadId: string;
  matchMethod: "webhook_email_phone" | "webhook_email_only" | "webhook_phone_only";
}

/** Lead ids that already have a paid payment row. */
async function paidLeadIds(ids: string[]): Promise<Set<string>> {
  if (ids.length === 0) return new Set();
  const db = await admin();
  const { data } = await db
    .from("strategy_call_payments")
    .select("lead_id")
    .in("lead_id", ids)
    .eq("status", "paid");
  return new Set((data ?? []).map((r) => r.lead_id));
}

/**
 * Finds the lead behind a payer, in strict order of confidence:
 *
 *   1. webhook_email_phone — email exact + last 10 phone digits match
 *   2. webhook_email_only  — email exact, phone differs/absent
 *   3. webhook_phone_only  — phone matches, email does NOT, and exactly one
 *      unpaid lead carries that phone. Two or more candidates = no match.
 *
 * Only leads without a paid payment are ever eligible.
 */
export async function findLeadForPayer(payer: Payer): Promise<PayerMatch | null> {
  const db = await admin();

  if (payer.email) {
    const { data: leads, error } = await db
      .from("strategy_call_leads")
      .select("id, email, phone, created_at")
      .ilike("email", payer.email)
      .order("created_at", { ascending: false })
      .limit(25);
    if (error) {
      console.error("[strategy-call] payer lead lookup failed", error);
      return null;
    }
    const candidates = (leads ?? []).filter(
      (l) => (l.email ?? "").trim().toLowerCase() === payer.email,
    );
    if (candidates.length > 0) {
      const alreadyPaid = await paidLeadIds(candidates.map((c) => c.id));
      const open = candidates.filter((c) => !alreadyPaid.has(c.id));
      if (open.length > 0) {
        const withPhone = payer.contact
          ? open.find((c) => phoneTail(c.phone) === payer.contact)
          : undefined;
        if (withPhone) return { leadId: withPhone.id, matchMethod: "webhook_email_phone" };
        return { leadId: open[0]!.id, matchMethod: "webhook_email_only" };
      }
    }
  }

  // Tier 3 — phone only. Autofill often supplies a different email on the
  // payment page, but the phone number is typed fresh both times.
  if (!payer.contact) return null;

  const { data: phoneLeads, error: phoneError } = await db
    .from("strategy_call_leads")
    .select("id, email, phone, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (phoneError) {
    console.error("[strategy-call] payer phone lookup failed", phoneError);
    return null;
  }

  const phoneCandidates = (phoneLeads ?? []).filter(
    (l) => phoneTail(l.phone) === payer.contact,
  );
  if (phoneCandidates.length === 0) return null;

  const alreadyPaid = await paidLeadIds(phoneCandidates.map((c) => c.id));
  const open = phoneCandidates.filter((c) => !alreadyPaid.has(c.id));

  // Ambiguity must never auto-grant: leave it for the recovery panel.
  if (open.length !== 1) {
    if (open.length > 1) {
      console.error("[strategy-call] phone-only match ambiguous — left unmatched", {
        candidates: open.length,
      });
    }
    return null;
  }

  return { leadId: open[0]!.id, matchMethod: "webhook_phone_only" };
}


/**
 * Marks a lead paid + verified from a matched provider payment. Idempotent:
 * a lead that already has a paid row is left untouched.
 */
export async function markPaidForLead(
  leadId: string,
  input: {
    paymentId: string;
    method?: string | null;
    payload?: Record<string, unknown> | undefined;
    matchMethod: string;
  },
): Promise<boolean> {
  const db = await admin();

  const { data: paid } = await db
    .from("strategy_call_payments")
    .select("id")
    .eq("lead_id", leadId)
    .eq("status", "paid")
    .maybeSingle();
  if (paid) return true;

  const { data: open } = await db
    .from("strategy_call_payments")
    .select("id")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let paymentRowId = open?.id ?? null;
  if (!paymentRowId) {
    const { data: inserted, error } = await db
      .from("strategy_call_payments")
      .insert({
        lead_id: leadId,
        amount_paise: STRATEGY_CALL_AMOUNT_PAISE,
        currency: STRATEGY_CALL_CURRENCY,
        attempts: 1,
        status: "created" as const,
      })
      .select("id")
      .single();
    if (error || !inserted) {
      console.error("[strategy-call] payment insert failed", error);
      throw new Error(GENERIC_ERROR);
    }
    paymentRowId = inserted.id;
  }

  const now = new Date().toISOString();
  const { error: updateError } = await db
    .from("strategy_call_payments")
    .update({
      razorpay_payment_id: input.paymentId,
      status: "paid" as const,
      verification_status: "verified",
      verified_at: now,
      paid_at: now,
      method: input.method ?? null,
      failure_reason: null,
      match_method: input.matchMethod,
      matched_at: now,
      provider_payload: asJson(input.payload),
    })
    .eq("id", paymentRowId);
  if (updateError) {
    console.error("[strategy-call] payment mark-paid failed", updateError);
    throw new Error(GENERIC_ERROR);
  }

  await db.from("strategy_call_leads").update({ stage: "paid" }).eq("id", leadId);
  await db
    .from("strategy_call_bookings")
    .upsert(
      { lead_id: leadId, payment_id: paymentRowId, status: "pending" },
      { onConflict: "lead_id", ignoreDuplicates: true },
    );

  return true;
}

/** True when this provider payment id is already bound to any payment row. */
export async function isPaymentIdBound(paymentId: string): Promise<boolean> {
  const db = await admin();
  const { data } = await db
    .from("strategy_call_payments")
    .select("id")
    .eq("razorpay_payment_id", paymentId)
    .limit(1)
    .maybeSingle();
  return Boolean(data);
}

export { requireLead as requireStrategyCallLead, findLead as findStrategyCallLead };
