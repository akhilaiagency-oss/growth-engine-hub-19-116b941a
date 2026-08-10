import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  Loader2,
  Lock,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import logo from "@/assets/growth-multiplier-ai-logo.png";
import { readLeadHandle, type LeadHandle } from "@/data/qualification";
import { getStrategyCallBooking } from "@/lib/strategy-call.functions";

const TITLE = "Book Your Strategy Session — Growth Multiplier AI";
const DESCRIPTION =
  "Choose the time for your 1:1 Growth Multiplier AI strategy session. Available after your ₹9 reservation is confirmed.";

export const Route = createFileRoute("/book")({
  // Booking depends on a browser-held lead handle, so it renders client-side.
  ssr: false,
  component: BookPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
});

type Access = Awaited<ReturnType<typeof getStrategyCallBooking>>;

const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";

function useCalendlyWidget(url: string | null, mountId: string) {
  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    const mount = () => {
      const el = document.getElementById(mountId);
      const api = (window as unknown as { Calendly?: { initInlineWidget: (o: object) => void } })
        .Calendly;
      if (cancelled || !el || !api || el.childElementCount > 0) return;
      api.initInlineWidget({ url, parentElement: el });
    };

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SCRIPT}"]`);
    if (existing) {
      mount();
    } else {
      const script = document.createElement("script");
      script.src = CALENDLY_SCRIPT;
      script.async = true;
      script.onload = mount;
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, [url, mountId]);
}

function BookPage() {
  const [handle, setHandle] = useState<LeadHandle | null>(null);
  const [access, setAccess] = useState<Access | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const pollRef = useRef<number | null>(null);

  const load = useCallback(async (h: LeadHandle) => {
    try {
      const result = await getStrategyCallBooking({ data: h });
      setAccess(result);
      setError(null);
      return result;
    } catch {
      setError("We couldn't check your booking status. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const h = readLeadHandle();
    setHandle(h);
    if (!h) {
      setLoading(false);
      return;
    }
    void load(h);
  }, [load]);

  // Calendly tells the browser a slot was picked — that is only a hint.
  // The booking is not BOOKED until our webhook confirms it server-side.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (typeof event.origin !== "string" || !event.origin.includes("calendly.com")) return;
      const data = event.data as { event?: string } | null;
      if (data?.event === "calendly.event_scheduled") setAwaitingConfirmation(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!awaitingConfirmation || !handle) return;
    let attempts = 0;
    const tick = async () => {
      attempts += 1;
      const result = await load(handle);
      if (result?.booking && result.booking.status !== "pending") {
        setAwaitingConfirmation(false);
        if (pollRef.current) window.clearInterval(pollRef.current);
      } else if (attempts >= 20 && pollRef.current) {
        window.clearInterval(pollRef.current);
      }
    };
    pollRef.current = window.setInterval(() => void tick(), 4000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [awaitingConfirmation, handle, load]);

  const booking = access?.booking ?? null;
  const confirmed =
    booking !== null && (booking.status === "scheduled" || booking.status === "rescheduled");
  const cancelled = booking?.status === "cancelled";

  useCalendlyWidget(
    access?.unlocked && access.schedulingUrl && !confirmed ? access.schedulingUrl : null,
    "calendly-inline",
  );

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Growth Multiplier AI" className="h-9 w-9 rounded-full" />
            <span className="text-[15px] font-semibold text-fg">Growth Multiplier AI</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft size={14} aria-hidden="true" /> Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-5 py-12">
        {loading ? (
          <p className="flex items-center gap-2 text-[14px] text-muted">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Checking your
            reservation…
          </p>
        ) : !access?.unlocked ? (
          <LockedCard hasHandle={Boolean(handle)} />
        ) : confirmed ? (
          <ConfirmedCard booking={booking} whatsappStatus={access.whatsappStatus} />
        ) : (
          <>
            <h1 className="text-[26px] leading-tight font-semibold text-fg sm:text-[32px]">
              Choose your strategy session time
            </h1>
            <p className="mt-2 max-w-[620px] text-[14.5px] leading-relaxed text-muted">
              Your ₹9 reservation is confirmed. Pick the slot that works for you — your session
              is only locked in once the calendar confirms it.
            </p>

            {cancelled && (
              <p className="mt-4 rounded-[10px] border border-border bg-surface-2 p-3 text-[13.5px] text-muted">
                Your previous session was cancelled. Your ₹9 reservation is still valid — pick a
                new time below.
              </p>
            )}

            {awaitingConfirmation && (
              <p className="mt-4 flex items-center gap-2 rounded-[10px] border border-lime/40 bg-[rgba(131,226,78,0.08)] p-3 text-[13.5px] text-fg">
                <Loader2 size={15} className="animate-spin text-lime" aria-hidden="true" />
                Waiting for the calendar to confirm your slot…
              </p>
            )}

            {access.configured && access.schedulingUrl ? (
              <div
                id="calendly-inline"
                className="mt-6 min-h-[720px] overflow-hidden rounded-[12px] border border-border bg-surface"
              />
            ) : (
              <div className="mt-6 rounded-[12px] border border-dashed border-border-strong bg-surface p-8 text-center">
                <Calendar size={22} className="mx-auto text-muted" aria-hidden="true" />
                <p className="mt-3 text-[14px] text-fg">Scheduling calendar not connected yet.</p>
                <p className="mt-1 text-[13px] text-muted">
                  Your ₹9 reservation is confirmed and saved. We'll email you to arrange the time.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => handle && void load(handle)}
              className="mt-4 flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-fg"
            >
              <RefreshCw size={13} aria-hidden="true" /> Refresh booking status
            </button>
          </>
        )}

        {error && (
          <p className="mt-4 flex items-start gap-1.5 text-[13px] text-urgent" role="alert">
            <AlertCircle size={15} className="mt-[1px] shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </main>
    </div>
  );
}

function LockedCard({ hasHandle }: { hasHandle: boolean }) {
  return (
    <div className="mx-auto max-w-[560px] rounded-[16px] border border-border bg-surface p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[12px] border border-border bg-surface-2">
        <Lock size={20} className="text-muted" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-[22px] leading-tight font-semibold text-fg">
        Strategy Session Booking Locked
      </h1>
      <p className="mx-auto mt-3 max-w-[420px] text-[14.5px] leading-relaxed text-muted">
        A confirmed ₹9 payment is required before selecting your strategy-session time.
      </p>
      <Link to="/qualify" className="btn-primary mt-6 inline-flex">
        {hasHandle ? "Complete my ₹9 reservation →" : "Book My ₹9 Strategy Call →"}
      </Link>
      <p className="mt-3 text-[12.5px] text-muted-2">
        Already paid? Give it a moment and refresh — confirmation can take a minute.
      </p>
    </div>
  );
}

function ConfirmedCard({
  booking,
  whatsappStatus,
}: {
  booking: NonNullable<Access["booking"]>;
  whatsappStatus: string;
}) {
  const when = booking.scheduledAt
    ? new Date(booking.scheduledAt).toLocaleString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="mx-auto max-w-[620px]">
      <div className="rounded-[16px] border border-lime/40 bg-[rgba(131,226,78,0.06)] p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-lime/50 bg-[rgba(131,226,78,0.12)]">
          <Check size={20} className="text-lime" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-[24px] leading-tight font-semibold text-fg">
          Your strategy session is booked
        </h1>
        {when && (
          <p className="mt-2 flex items-center gap-2 text-[15px] text-fg">
            <Calendar size={16} className="text-lime" aria-hidden="true" /> {when}
            {booking.timezone ? ` (${booking.timezone})` : ""}
          </p>
        )}
        {booking.eventName && (
          <p className="mt-1 text-[13.5px] text-muted">{booking.eventName}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {booking.joinUrl && (
            <a
              href={booking.joinUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary inline-flex"
            >
              Join link →
            </a>
          )}
          {booking.rescheduleUrl && (
            <a
              href={booking.rescheduleUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-[10px] border border-border px-4 py-2.5 text-[13.5px] text-fg transition-colors hover:border-border-strong"
            >
              Reschedule
            </a>
          )}
          {booking.cancelUrl && (
            <a
              href={booking.cancelUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-[10px] border border-border px-4 py-2.5 text-[13.5px] text-muted transition-colors hover:text-fg"
            >
              Cancel
            </a>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-[12px] border border-border bg-surface p-5">
        <p className="flex items-center gap-2 text-[14px] font-medium text-fg">
          <MessageCircle size={16} className="text-lime" aria-hidden="true" /> WhatsApp access
          unlocked
        </p>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
          {whatsappStatus === "not_granted"
            ? "Your access is being set up — we'll message you shortly."
            : "We'll send your invite to the number you gave us before the session."}
        </p>
      </div>
    </div>
  );
}
