/**
 * Razorpay server-only adapter.
 *
 * The `.server.ts` extension keeps this file out of every client bundle.
 * RAZORPAY_KEY_SECRET and RAZORPAY_WEBHOOK_SECRET are read inside functions
 * (never at module scope) and are never returned to the browser. Only the
 * public RAZORPAY_KEY_ID is ever sent to the client — that is by design, it is
 * the publishable half of the pair.
 *
 * Mode is inferred from the key id prefix:
 *   - rzp_test_...  -> test mode (no real money moves)
 *   - rzp_live_...  -> live mode
 * To switch modes, change the three Razorpay secrets to the matching test or
 * live set from your Razorpay dashboard.
 */
import { createHmac, timingSafeEqual } from "crypto";

/** The ₹9 strategy call, in paise. The single source of truth for the amount. */
export const STRATEGY_CALL_AMOUNT_PAISE = 900;
export const STRATEGY_CALL_CURRENCY = "INR";

const RAZORPAY_API = "https://api.razorpay.com/v1";

interface RazorpayCreds {
  keyId: string;
  keySecret: string;
  mode: "test" | "live";
}

export function getRazorpayMode(keyId?: string): "test" | "live" {
  const id = keyId ?? process.env["RAZORPAY_KEY_ID"] ?? "";
  return id.startsWith("rzp_test_") ? "test" : "live";
}

export function getRazorpayCreds(): RazorpayCreds {
  const keyId = process.env["RAZORPAY_KEY_ID"];
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keyId || !keySecret) {
    throw new Error("Razorpay is not configured yet.");
  }
  return { keyId, keySecret, mode: getRazorpayMode(keyId) };
}

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env["RAZORPAY_KEY_ID"] && process.env["RAZORPAY_KEY_SECRET"]);
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
  receipt?: string;
}

function authHeader(keyId: string, keySecret: string) {
  return `Basic ${btoa(`${keyId}:${keySecret}`)}`;
}

export interface RazorpayPaymentLink {
  id: string;
  short_url: string;
  reference_id: string;
  status: string;
}

/**
 * Hosted Payment Link. The buyer is redirected to Razorpay's page and returned
 * to `callback_url` with a signed set of query params.
 */
export async function createPaymentLink(params: {
  amountPaise: number;
  referenceId: string;
  description: string;
  customer: { name: string; email: string; contact: string };
  notes: Record<string, string>;
  callbackUrl: string;
  expireBy: number;
}): Promise<RazorpayPaymentLink> {
  const { keyId, keySecret, mode } = getRazorpayCreds();
  console.log(`[Razorpay] Creating ${mode} payment link ref ${params.referenceId}`);
  const res = await fetch(`${RAZORPAY_API}/payment_links`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: authHeader(keyId, keySecret),
    },
    body: JSON.stringify({
      amount: params.amountPaise,
      currency: STRATEGY_CALL_CURRENCY,
      accept_partial: false,
      reference_id: params.referenceId,
      description: params.description,
      customer: params.customer,
      notify: { email: true, sms: false },
      reminder_enable: false,
      expire_by: params.expireBy,
      notes: params.notes,
      callback_url: params.callbackUrl,
      callback_method: "get",
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Razorpay payment link creation failed", res.status, detail);
    throw new Error("Something went wrong. Please try again.");
  }
  return (await res.json()) as RazorpayPaymentLink;
}

export interface RazorpayPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method?: string;
  error_description?: string;
}

/** Server-side truth for what was actually charged. */
export async function fetchRazorpayPayment(paymentId: string): Promise<RazorpayPayment | null> {
  const { keyId, keySecret } = getRazorpayCreds();
  const res = await fetch(`${RAZORPAY_API}/payments/${encodeURIComponent(paymentId)}`, {
    headers: { authorization: authHeader(keyId, keySecret) },
  });
  if (!res.ok) {
    console.error("Razorpay payment fetch failed", res.status, await res.text());
    return null;
  }
  return (await res.json()) as RazorpayPayment;
}

function safeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Payment Link return handshake:
 * HMAC-SHA256(link_id|reference_id|status|payment_id) with the key secret.
 */
export function verifyPaymentLinkSignature(input: {
  paymentLinkId: string;
  referenceId: string;
  status: string;
  paymentId: string;
  signature: string;
}): boolean {
  const { keySecret } = getRazorpayCreds();
  const expected = createHmac("sha256", keySecret)
    .update(
      `${input.paymentLinkId}|${input.referenceId}|${input.status}|${input.paymentId}`,
    )
    .digest("hex");
  return safeEqualHex(expected, input.signature);
}

/** Webhook: HMAC-SHA256 over the RAW request body with the webhook secret. */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env["RAZORPAY_WEBHOOK_SECRET"];
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}

