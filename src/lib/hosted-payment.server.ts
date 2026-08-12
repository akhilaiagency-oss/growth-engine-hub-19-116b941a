/**
 * Dashboard-hosted Razorpay Payment Page flow — server only.
 *
 * Razorpay activation is pending, so API-created Payment Links cannot be used
 * in production. Instead the visitor is redirected to a Payment Page created in
 * the Razorpay dashboard. That page returns nothing the browser can prove, so
 * the signature-verified webhook is the ONLY authority for granting access.
 *
 * The Payment Links code path (createRazorpayPaymentLink / startPaymentLink /
 * verifyPaymentLinkReturn) is intentionally kept in the codebase and is simply
 * no longer called from the client — it comes back the moment activation lands.
 */
import {
  STRATEGY_CALL_AMOUNT_PAISE,
  STRATEGY_CALL_CURRENCY,
} from "./razorpay.server";
import {
  extractPayer,
  findStrategyCallLead,
  isPaymentIdBound,
  markPaidForLead,
} from "./strategy-call-payments.server";

const GENERIC_ERROR = "Something went wrong. Please try again.";

export type HostedPaymentStart =
  | { locked: true }
  | { alreadyPaid: true }
  | { paymentUrl: string; amountPaise: number; currency: string };

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/** Server-only accessor. The URL never appears in a page payload. */
export function getHostedPaymentPageUrl(): string {
  const url = (process.env["RAZORPAY_PAYMENT_PAGE_URL"] ?? "").trim();
  if (!url.startsWith("https://")) {
    console.error("[strategy-call] RAZORPAY_PAYMENT_PAGE_URL missing or not https");
    throw new Error("Payments are not available right now. Please try again shortly.");
  }
  return url;
}

export function isHostedPaymentConfigured(): boolean {
  return (process.env["RAZORPAY_PAYMENT_PAGE_URL"] ?? "").trim().startsWith("https://");
}

/**
 * Opens (or reuses) a pending payment attempt for a lead and hands back the
 * hosted Payment Page URL to redirect to.
 */
export async function startHostedPagePayment(
  leadId: string,
  accessToken: string,
): Promise<HostedPaymentStart> {
  const lead = await findStrategyCallLead(leadId, accessToken);
  if (!lead) return { locked: true };

  const db = await admin();

  const { data: paid } = await db
    .from("strategy_call_payments")
    .select("id")
    .eq("lead_id", lead.id)
    .eq("status", "paid")
    .maybeSingle();
  if (paid) return { alreadyPaid: true };

  const { data: open } = await db
    .from("strategy_call_payments")
    .select("id")
    .eq("lead_id", lead.id)
    .in("status", ["created", "payment_pending"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (open) {
    const { error } = await db
      .from("strategy_call_payments")
      .update({ status: "payment_pending" as const })
      .eq("id", open.id);
    if (error) {
      console.error("[strategy-call] hosted payment update failed", error);
      throw new Error(GENERIC_ERROR);
    }
  } else {
    const { error } = await db.from("strategy_call_payments").insert({
      lead_id: lead.id,
      amount_paise: STRATEGY_CALL_AMOUNT_PAISE,
      currency: STRATEGY_CALL_CURRENCY,
      attempts: 1,
      status: "created" as const,
    });
    if (error) {
      console.error("[strategy-call] hosted payment insert failed", error);
      throw new Error(GENERIC_ERROR);
    }
  }

  await db.from("strategy_call_leads").update({ stage: "payment_pending" }).eq("id", lead.id);

  return {
    paymentUrl: getHostedPaymentPageUrl(),
    amountPaise: STRATEGY_CALL_AMOUNT_PAISE,
    currency: STRATEGY_CALL_CURRENCY,
  };
}

const CLAIMABLE_EVENTS = ["payment_page.paid", "payment.captured"];

const NOT_FOUND_MESSAGE =
  "We couldn't find a payment for that email yet — it can take a minute. Try again shortly.";

export type HostedPaymentClaim =
  | { status: "paid" }
  | { status: "already_paid" }
  | { status: "locked" }
  | { status: "not_found"; message: string };

/**
 * Recovery path for a payment the webhook could not match. It can only bind an
 * event that was signature-verified, correctly priced, recorded as unmatched,
 * and not already bound to another payment row — so it can never unlock a lead
 * without a real payment behind it.
 */
export async function claimHostedPagePayment(input: {
  leadId: string;
  accessToken: string;
  email: string;
}): Promise<HostedPaymentClaim> {
  const lead = await findStrategyCallLead(input.leadId, input.accessToken);
  if (!lead) return { status: "locked" };

  const db = await admin();

  const { data: paid } = await db
    .from("strategy_call_payments")
    .select("id")
    .eq("lead_id", lead.id)
    .eq("status", "paid")
    .maybeSingle();
  if (paid) return { status: "already_paid" };

  const email = input.email.trim().toLowerCase();

  const { data: events, error } = await db
    .from("strategy_call_webhook_events")
    .select("id, event_type, payload, signature_verified, result")
    .eq("provider", "razorpay")
    .eq("signature_verified", true)
    .eq("result", "unmatched")
    .in("event_type", CLAIMABLE_EVENTS)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error("[strategy-call] claim lookup failed", error);
    throw new Error(GENERIC_ERROR);
  }

  for (const event of events ?? []) {
    const payload = (event.payload ?? {}) as {
      payload?: { payment?: { entity?: Record<string, unknown> } };
    };
    const entity = payload.payload?.payment?.entity;
    if (!entity) continue;
    if (entity["amount"] !== STRATEGY_CALL_AMOUNT_PAISE) continue;
    if (entity["currency"] !== STRATEGY_CALL_CURRENCY) continue;

    const payer = extractPayer(entity);
    if (payer.email !== email) continue;

    const paymentId = typeof entity["id"] === "string" ? entity["id"] : "";
    if (!paymentId || (await isPaymentIdBound(paymentId))) continue;

    await markPaidForLead(lead.id, {
      paymentId,
      method: typeof entity["method"] === "string" ? entity["method"] : null,
      payload: payload as unknown as Record<string, unknown>,
      matchMethod: "manual_claim",
    });

    await db
      .from("strategy_call_webhook_events")
      .update({ result: "paid", processed_at: new Date().toISOString() })
      .eq("id", event.id);

    return { status: "paid" };
  }

  return { status: "not_found", message: NOT_FOUND_MESSAGE };
}
