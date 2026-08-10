/**
 * Calendly webhook receiver.
 *
 * Under /api/public/* so Calendly can reach it, and therefore fully
 * self-secured: the raw body is HMAC-verified against
 * CALENDLY_WEBHOOK_SIGNING_KEY before anything is read from it, and every
 * event is recorded by its Calendly event uri so replays are a no-op.
 * This is the ONLY thing that can mark a strategy call as BOOKED.
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/webhooks/calendly")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const signature = request.headers.get("calendly-webhook-signature");

        const { verifyCalendlySignature } = await import("@/lib/calendly.server");
        if (!verifyCalendlySignature(raw, signature)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: Record<string, unknown>;
        try {
          payload = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const eventType = typeof payload["event"] === "string" ? payload["event"] : "unknown";
        const inner = (payload["payload"] ?? {}) as { uri?: string };
        const eventId = `${eventType}:${inner.uri ?? String(payload["created_at"] ?? "")}`;

        const { applyCalendlyWebhook } = await import("@/lib/strategy-call-booking.server");
        try {
          const result = await applyCalendlyWebhook({ eventId, eventType, payload });
          return Response.json({ received: true, result });
        } catch (error) {
          console.error("Calendly webhook processing failed", error);
          // 500 asks Calendly to retry; processing stays idempotent.
          return new Response("Processing error", { status: 500 });
        }
      },
    },
  },
});
