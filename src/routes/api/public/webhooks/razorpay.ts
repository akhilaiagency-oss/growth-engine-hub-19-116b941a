/**
 * Razorpay webhook receiver.
 *
 * Under /api/public/* so Razorpay can reach it, and therefore fully
 * self-secured: the raw body is HMAC-verified against RAZORPAY_WEBHOOK_SECRET
 * before anything is read from it, and every event is recorded by its Razorpay
 * event id so replays are a no-op. This is the authoritative source of truth
 * for payment state — the browser callback is only a fast path.
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/webhooks/razorpay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const signature = request.headers.get("x-razorpay-signature");

        const { verifyWebhookSignature } = await import("@/lib/razorpay.server");
        if (!verifyWebhookSignature(raw, signature)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: Record<string, unknown>;
        try {
          payload = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const eventType = typeof payload["event"] === "string" ? payload["event"] : "unknown";
        const eventId =
          request.headers.get("x-razorpay-event-id") ??
          `${eventType}:${String(payload["created_at"] ?? "")}`;

        const { applyVerifiedWebhook } = await import("@/lib/strategy-call-payments.server");
        try {
          const result = await applyVerifiedWebhook({ eventId, eventType, payload });
          return Response.json({ received: true, result });
        } catch (error) {
          console.error("Razorpay webhook processing failed", error);
          // 500 asks Razorpay to retry; processing stays idempotent.
          return new Response("Processing error", { status: 500 });
        }
      },
    },
  },
});
