/**
 * Calendly server-only adapter.
 *
 * The `.server.ts` extension keeps this out of every client bundle.
 * CALENDLY_WEBHOOK_SIGNING_KEY is read inside functions and never returned to
 * the browser. Only the public scheduling URL is ever sent to the client.
 */
import { createHmac, timingSafeEqual } from "crypto";

export function getSchedulingUrl(): string | null {
  const url = process.env["CALENDLY_SCHEDULING_URL"];
  return url && url.startsWith("https://") ? url : null;
}

function safeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Calendly signs webhooks as `Calendly-Webhook-Signature: t=<ts>,v1=<hex>`
 * where the HMAC-SHA256 is computed over `<ts>.<raw body>`.
 */
export function verifyCalendlySignature(rawBody: string, header: string | null): boolean {
  const key = process.env["CALENDLY_WEBHOOK_SIGNING_KEY"];
  if (!key || !header) return false;

  const parts = Object.fromEntries(
    header.split(",").map((chunk) => {
      const [k, ...rest] = chunk.trim().split("=");
      return [k ?? "", rest.join("=")];
    }),
  ) as Record<string, string>;

  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;

  // Reject stale signatures (replay window: 5 minutes).
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return false;

  const expected = createHmac("sha256", key).update(`${timestamp}.${rawBody}`).digest("hex");
  return safeEqualHex(expected, signature);
}

export interface CalendlyInviteePayload {
  uri?: string;
  email?: string;
  name?: string;
  timezone?: string;
  status?: string;
  rescheduled?: boolean;
  old_invitee?: string | null;
  new_invitee?: string | null;
  cancel_url?: string;
  reschedule_url?: string;
  cancellation?: { reason?: string; canceled_by?: string } | null;
  tracking?: { utm_content?: string | null; utm_campaign?: string | null } | null;
  scheduled_event?: {
    uri?: string;
    name?: string;
    start_time?: string;
    status?: string;
    location?: { join_url?: string; type?: string; location?: string } | null;
  } | null;
}
