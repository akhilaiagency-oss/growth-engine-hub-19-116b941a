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
import { BrandLockup } from "@/components/site/brand-lockup";
import { QualificationDetailsFlow } from "@/components/site/question-flow";
import {
  EMPTY_DETAILS,
  readLeadHandle,
  submitQualificationDetails,
  type LeadHandle,
} from "@/data/qualification";
import {
  claimWhatsappCommunityAccess,
  getFunnelStatus,
  getStrategyCallBooking,
  verifyStrategyCallBooking,
  claimHostedPagePayment,
} from "@/lib/strategy-call.functions";

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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const pollRef = useRef<number | null>(null);
  const handleRef = useRef<LeadHandle | null>(null);

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
    handleRef.current = h;
    if (!h) {
      setLoading(false);
      return;
    }
    void (async () => {
      // 1. The hosted Razorpay Payment Page returns nothing the browser can
      // prove, so the signature-verified webhook is the only authority. If an
      // attempt is open, wait for it to land.
      const initial = await getFunnelStatus({ data: h }).catch(() => null);
      if (initial?.payment && initial.payment.status !== "paid") {
        setConfirmingPayment(true);
        let paid = false;
        for (let i = 0; i < 45 && !paid; i += 1) {
          await sleep(2000);
          const status = await getFunnelStatus({ data: h }).catch(() => null);
          paid = status?.payment?.status === "paid";
        }
        setConfirmingPayment(false);
        if (!paid) setPaymentFailed(true);
      }

      const result = await load(h);
      const status = result?.booking?.status;
      const settled = status === "confirmed" || status === "scheduled" || status === "rescheduled";
      // Only re-check a booking we already know about, or one Calendly just
      // redirected back from. Otherwise a pre-existing event for this email
      // could be claimed before the visitor has picked anything.
      const params = new URLSearchParams(window.location.search);
      const returnedFromCalendly =
        params.has("invitee_uuid") || params.has("event_type_uuid") || params.has("assigned_to");
      const knownEvent = Boolean(result?.booking?.eventUuid);
      if (result?.unlocked && !settled && (knownEvent || returnedFromCalendly)) {
        const ok = await verifyStrategyCallBooking({ data: h })
          .then((r) => r.status === "confirmed")
          .catch(() => false);
        if (ok) await load(h);
      }
    })();
  }, [load]);

  // Calendly tells the browser a slot was picked — that is only a hint.
  // Nothing is written from the client; the server asks the Calendly API and
  // re-validates the hinted event against every gate before confirming.
  const runVerification = useCallback(
    async (h: LeadHandle, hints?: { eventUri?: string; inviteeUri?: string }) => {
      try {
        const result = await verifyStrategyCallBooking({ data: { ...h, ...hints } });
        if (result.status === "confirmed" && result.booking) {
          // The server already returned the confirmed booking AND the freshly
          // computed WhatsApp gate — render it now, no extra round trip.
          setAccess((prev) =>
            prev
              ? {
                  ...prev,
                  booking: result.booking,
                  whatsappUnlocked: result.whatsappUnlocked,
                  whatsappStatus: result.whatsappStatus,
                }
              : prev,
          );
          setError(null);
          // Non-blocking background revalidate; the UI never waits on it.
          void load(h);
          return true;
        }
      } catch {
        /* verification is best-effort; the next attempt or refresh resolves it */
      }
      return false;
    },
    [load],
  );

  // Front-loaded: fire immediately, then back off gently. With the direct
  // event fetch, confirmation normally lands on the first or second attempt.
  const startPolling = useCallback(
    (h: LeadHandle, hints?: { eventUri?: string; inviteeUri?: string }) => {
      if (pollRef.current) return;
      setAwaitingConfirmation(true);
      setUnconfirmed(false);
      const delays = [0, 700, 1200, 2000, 3000, 5000, 8000, 12000];
      let attempt = 0;
      const schedule = () => {
        pollRef.current = window.setTimeout(() => {
          void (async () => {
            pollRef.current = null;
            const ok = await runVerification(h, hints);
            attempt += 1;
            if (ok) {
              setAwaitingConfirmation(false);
              return;
            }
            if (attempt < delays.length) {
              schedule();
            } else {
              setAwaitingConfirmation(false);
              setUnconfirmed(true);
            }
          })();
        }, delays[attempt]);
      };
      schedule();
    },
    [runVerification],
  );

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (typeof event.origin !== "string" || !event.origin.includes("calendly.com")) return;
      const data = event.data as
        | { event?: string; payload?: { event?: { uri?: string }; invitee?: { uri?: string } } }
        | null;
      if (data?.event === "calendly.event_scheduled" && handleRef.current) {
        const eventUri = data.payload?.event?.uri;
        const inviteeUri = data.payload?.invitee?.uri;
        startPolling(handleRef.current, {
          ...(typeof eventUri === "string" ? { eventUri } : {}),
          ...(typeof inviteeUri === "string" ? { inviteeUri } : {}),
        });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [startPolling]);

  useEffect(
    () => () => {
      if (pollRef.current) window.clearTimeout(pollRef.current);
    },
    [],
  );

  const booking = access?.booking ?? null;
  const confirmed =
    booking !== null &&
    (booking.status === "confirmed" ||
      booking.status === "scheduled" ||
      booking.status === "rescheduled");
  const cancelled = booking?.status === "cancelled";

  // The five post-payment questions sit between a verified payment and the
  // calendar. Leads who already answered them (including every pre-split lead)
  // skip straight through.
  const showDetails = Boolean(access?.unlocked) && !confirmed && !access?.qualificationComplete;

  useCalendlyWidget(
    access?.unlocked && access.schedulingUrl && !confirmed && !showDetails
      ? access.schedulingUrl
      : null,
    "calendly-inline",
  );

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-4">
          <Link to="/" className="flex min-w-0 items-center">
            <BrandLockup />
          </Link>
          <Link
            to="/"
            className="-mr-2 flex min-h-[44px] items-center gap-1.5 rounded-[8px] px-2 text-[13.5px] text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft size={14} aria-hidden="true" /> Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-5 py-12">
        {confirmingPayment ? (
          <p className="flex items-center gap-2 text-[14px] text-muted">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Confirming your
            payment…
          </p>
        ) : loading ? (
          <p className="flex items-center gap-2 text-[14px] text-muted">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Checking your
            reservation…
          </p>
        ) : !access?.unlocked ? (
          <LockedCard
            hasHandle={Boolean(handle)}
            paymentFailed={paymentFailed}
            handle={handle}
            onClaimed={() => handle && void load(handle)}
          />
        ) : confirmed ? (
          <ConfirmedCard
            booking={booking}
            whatsappStatus={access.whatsappStatus}
            whatsappUnlocked={access.whatsappUnlocked}
            handle={handle}
          />
        ) : showDetails && handle ? (
          <>
            <p className="text-[14px] font-semibold text-lime">Payment confirmed ✓</p>
            <p className="mt-1 mb-6 text-[14.5px] text-muted">
              Your strategy session is now ready to schedule.
            </p>
            <QualificationDetailsFlow
              initial={access.qualification ?? EMPTY_DETAILS}
              onComplete={async (details) => {
                const { saved } = await submitQualificationDetails(handle, details);
                if (!saved) return false;
                // Reveal the calendar in the same view — no reload, no extra click.
                setAccess((prev) => (prev ? { ...prev, qualificationComplete: true } : prev));
                return true;
              }}
            />
          </>
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
              <p className="sticky top-2 z-20 mt-4 flex items-center gap-2 rounded-[10px] border border-lime/40 backdrop-blur-md sm:static bg-[rgba(131,226,78,0.08)] p-3 text-[13.5px] text-fg">
                <Loader2 size={15} className="animate-spin text-lime" aria-hidden="true" />
                Confirming your booking…
              </p>
            )}

            {unconfirmed && (
              <div className="mt-4 rounded-[10px] border border-border bg-surface-2 p-3">
                <p className="text-[13.5px] leading-relaxed text-fg">
                  Your slot looks booked — we're just confirming it with Calendly. This page will
                  update, or refresh in a minute.
                </p>
                <button
                  type="button"
                  disabled={checking}
                  onClick={() => {
                    if (!handle) return;
                    setChecking(true);
                    void (async () => {
                      const ok = await runVerification(handle);
                      if (ok) setUnconfirmed(false);
                      setChecking(false);
                    })();
                  }}
                  className="mt-1 -ml-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-[8px] px-2 text-[13.5px] text-lime transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                  <RefreshCw size={13} aria-hidden="true" />
                  {checking ? "Checking…" : "Check again"}
                </button>
              </div>
            )}

            {access.configured && access.schedulingUrl ? (
              <div
                id="calendly-inline"
                className="mt-6 h-[1100px] w-full max-w-full overflow-x-hidden overflow-y-hidden rounded-[12px] border border-border bg-surface sm:h-[780px]"
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
              className="mt-4 -ml-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-[8px] px-2 text-[13.5px] text-muted transition-colors hover:text-fg"
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

function LockedCard({
  hasHandle,
  paymentFailed = false,
  handle,
  onClaimed,
}: {
  hasHandle: boolean;
  paymentFailed?: boolean;
  handle: LeadHandle | null;
  onClaimed: () => void;
}) {
  return (
    <div className="mx-auto max-w-[560px] rounded-[16px] border border-border bg-surface p-8">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[12px] border border-border bg-surface-2">
        <Lock size={20} className="text-muted" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-center text-[22px] leading-tight font-semibold text-fg">
        {paymentFailed || hasHandle
          ? "We're still confirming your payment"
          : "Reserve your strategy session"}
      </h1>
      <p className="mx-auto mt-3 max-w-[440px] text-center text-[14.5px] leading-relaxed text-muted">
        {paymentFailed || hasHandle
          ? "If money left your account, your payment is safe and recorded. It usually confirms within a minute."
          : "A confirmed ₹9 payment is required before selecting your strategy-session time."}
      </p>

      {handle ? (
        <>
          <RecoveryPanel handle={handle} onClaimed={onClaimed} />
          <p className="mt-3 text-center text-[12.5px] text-muted-2">
            Confirmation can take a moment — this page keeps checking in the background.
          </p>
          <div className="mt-6 border-t border-border pt-5 text-center">
            <p className="text-[12.5px] text-muted-2">Haven't paid yet?</p>
            <Link
              to="/qualify"
              className="mt-1 inline-flex min-h-[44px] items-center text-[13.5px] text-muted underline underline-offset-4 transition-colors hover:text-fg"
            >
              Reserve my session for ₹9 →
            </Link>
          </div>
        </>
      ) : (
        <div className="mt-6 text-center">
          <Link to="/qualify" className="btn-primary inline-flex">
            Book My ₹9 Strategy Call →
          </Link>
        </div>
      )}
    </div>
  );
}

/**
 * Primary recovery action — binds a signature-verified payment the webhook
 * could not match. The server does all the checking; this only collects the
 * email that was used on the payment page.
 */
function RecoveryPanel({ handle, onClaimed }: { handle: LeadHandle; onClaimed: () => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    if (!email.trim()) return;
    setBusy(true);
    setMessage(null);
    try {
      const result = await claimHostedPagePayment({ data: { ...handle, email: email.trim() } });
      if (result.status === "paid" || result.status === "already_paid") {
        setMessage("Payment found — unlocking your booking…");
        onClaimed();
      } else if (result.status === "not_found") {
        setMessage(result.message);
      } else {
        setMessage("We couldn't find your session. Please start again.");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-6">
      <p className="text-[15px] font-semibold text-fg">
        Almost there — we just need to match your payment
      </p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
        If you paid with a different email address than the one you gave us, enter the email you
        used on the payment page and we'll connect it to your session.
      </p>
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <label className="sr-only" htmlFor="recovery-email">
          Email used on the payment page
        </label>
        <input
          id="recovery-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="min-h-[44px] w-full flex-1 rounded-[8px] border border-border bg-surface-2 px-3 text-[16px] text-fg outline-none focus:border-lime"
        />
        <button
          type="submit"
          disabled={busy}
          className="btn-primary min-h-[44px] shrink-0 disabled:opacity-60"
        >
          {busy ? "Checking…" : "Find my payment"}
        </button>
      </form>
      {message && (
        <p className="mt-3 text-[13px] text-muted" role="status">
          {message}
        </p>
      )}
    </div>
  );
}


function ConfirmedCard({
  booking,
  whatsappStatus,
  whatsappUnlocked,
  handle,
}: {
  booking: NonNullable<Access["booking"]>;
  whatsappStatus: string;
  whatsappUnlocked: boolean;
  handle: LeadHandle | null;
}) {
  const [opening, setOpening] = useState(false);
  // Derived from props so a fresh gate arriving with the verify response (or a
  // background revalidate) unlocks the button without a reload.
  const [claimFailed, setClaimFailed] = useState(false);
  const [joinedLocally, setJoinedLocally] = useState(false);
  const locked = claimFailed || !whatsappUnlocked;
  const joined = joinedLocally || whatsappStatus === "joined";
  const setLocked = setClaimFailed;
  const setJoined = setJoinedLocally;

  const when = booking.scheduledAt
    ? new Date(booking.scheduledAt).toLocaleString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  const join = async () => {
    if (!handle) return;
    setOpening(true);
    try {
      const result = await claimWhatsappCommunityAccess({ data: handle });
      if (result.status === "ok") {
        setJoined(true);
        window.open(result.url, "_blank", "noopener,noreferrer");
      } else {
        setLocked(true);
      }
    } catch {
      setLocked(true);
    } finally {
      setOpening(false);
    }
  };

  return (
    <div className="mx-auto max-w-[620px]">
      <div className="overflow-hidden rounded-[16px] border border-lime/40">
        <div className="bg-[rgba(131,226,78,0.06)] p-5 sm:p-7">
          <span className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-lime/50 bg-[rgba(131,226,78,0.12)]">
            <Check size={20} className="text-lime" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-[24px] leading-tight font-semibold text-fg">
            Your Strategy Session Is Locked In ✓
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
        </div>

        <div className="h-px w-full bg-border" aria-hidden="true" />

        <div className="bg-surface p-5 sm:p-7">
          <p className="flex items-center gap-2 text-[15px] font-semibold text-fg">
            <MessageCircle size={16} className="text-lime" aria-hidden="true" /> Join The Growth
            Multiplier AI Community
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            You're officially booked. Join the Growth Multiplier AI community for strategy insights,
            AI growth resources, funnel breakdowns and important updates before your session.
          </p>

          {locked || !handle ? (
            <p className="mt-4 text-[13.5px] text-muted-2">
              Community access is being set up — we'll send your invite before your session.
            </p>
          ) : (
            <>
              <button
                type="button"
                onClick={() => void join()}
                disabled={opening}
                className="btn-primary mt-5 inline-flex disabled:opacity-60"
              >
                {opening ? "Opening…" : "Join The WhatsApp Community →"}
              </button>
              {joined && (
                <p className="mt-2 text-[12.5px] text-muted-2">You've already been given access.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>

  );
}

