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

export interface RazorpayPaymentLink {
  id: string;
  short_url: string;
  status: string;
  reference_id?: string;
}

/** Creates a hosted Razorpay Payment Link and returns its public short URL. */
export async function createRazorpayPaymentLink(params: {
  amountPaise: number;
  referenceId: string;
  description: string;
  customer: { name: string; email: string; contact: string };
  callbackUrl: string;
  notes: Record<string, string>;
}): Promise<RazorpayPaymentLink> {
  const { keyId, keySecret, mode } = getRazorpayCreds();
  console.log(`[Razorpay] Creating ${mode} payment link ${params.referenceId}`);
  const res = await fetch(`${RAZORPAY_API}/payment_links`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
    },
    body: JSON.stringify({
      amount: params.amountPaise,
      currency: STRATEGY_CALL_CURRENCY,
      accept_partial: false,
      reference_id: params.referenceId,
      description: params.description,
      customer: params.customer,
      notify: { sms: false, email: true },
      reminder_enable: true,
      notes: params.notes,
      callback_url: params.callbackUrl,
      callback_method: "get",
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Razorpay payment link creation failed", res.status, detail);
    throw new Error("Could not start the payment. Please try again.");
  }
  return (await res.json()) as RazorpayPaymentLink;
}

function safeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Payment Link return handshake:
 * HMAC-SHA256(payment_link_id|reference_id|status|payment_id) with the secret.
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
    .update(`${input.paymentLinkId}|${input.referenceId}|${input.status}|${input.paymentId}`)
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
