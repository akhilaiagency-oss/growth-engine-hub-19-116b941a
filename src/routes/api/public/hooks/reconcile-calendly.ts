/**
 * Calendly reconciliation endpoint (no webhooks on Calendly's free plan).
 *
 * Called on a schedule by pg_cron and available for manual admin runs.
 * Self-secured: the caller must present the project's `apikey` header. It
 * performs no writes based on caller input and returns only counts.
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/reconcile-calendly")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected =
          process.env["SUPABASE_ANON_KEY"] ?? process.env["SUPABASE_PUBLISHABLE_KEY"];
        const provided =
          request.headers.get("apikey") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
          "";

        if (!expected || provided !== expected) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { reconcileCalendlyBookings } = await import("@/lib/strategy-call-booking.server");
        try {
          const summary = await reconcileCalendlyBookings();
          return Response.json({ ok: true, ...summary });
        } catch (error) {
          console.error("Calendly reconciliation failed", error);
          return new Response(JSON.stringify({ ok: false }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
