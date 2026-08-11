import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, Calendar, Check, Lock, MessageCircle, ShieldCheck } from "lucide-react";
import { BrandLockup } from "@/components/site/brand-lockup";
import { QuestionStep } from "@/components/site/question-step";
import {
  CONTACT_QUESTIONS,
  EMPTY_ANSWERS,
  STORAGE_KEY,
  readLeadHandle,
  submitQualification,
  validateAnswer,
  type ContactField,
  type LeadHandle,
  type Question,
} from "@/data/qualification";
import {
  createStrategyCallOrder,
  recordStrategyCallOutcome,
  verifyStrategyCallPayment,
} from "@/lib/strategy-call.functions";
import { loadRazorpayCheckout, openRazorpayCheckout } from "@/lib/razorpay-checkout";

const TITLE = "Strategy Session Qualification — Growth Multiplier AI";
const DESCRIPTION =
  "Answer a few questions so your Growth Multiplier AI strategy session is specific to your business.";

export const Route = createFileRoute("/qualify")({
  component: QualifyPage,
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

/** Only three fields stand between intent and the ₹9 payment. */
const TOTAL = CONTACT_QUESTIONS.length;
const PAY_STEP = TOTAL;

type ContactAnswers = Record<ContactField, string>;

const EMPTY_CONTACT: ContactAnswers = {
  name: EMPTY_ANSWERS.name,
  email: EMPTY_ANSWERS.email,
  phone: EMPTY_ANSWERS.phone,
};

function QualifyPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ContactAnswers>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [restored, setRestored] = useState(false);
  const [handle, setHandle] = useState<LeadHandle | null>(null);
  const [handleError, setHandleError] = useState<string | null>(null);

  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const firstRadioRef = useRef<HTMLInputElement | null>(null);

  // Restore in-progress answers so a refresh mid-form doesn't lose them.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const cached = JSON.parse(raw) as Partial<ContactAnswers>;
        setAnswers({
          name: cached.name ?? "",
          email: cached.email ?? "",
          phone: cached.phone ?? "",
        });
      }
    } catch {
      /* ignore malformed storage */
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* storage unavailable */
    }
  }, [answers, restored]);

  const question: Question | undefined = CONTACT_QUESTIONS[step];
  const field = question?.field as ContactField | undefined;

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
      else if (firstRadioRef.current) firstRadioRef.current.focus();
      else headingRef.current?.focus();
    }, 60);
    return () => window.clearTimeout(t);
  }, [step]);

  const startPayment = useCallback((current: ContactAnswers) => {
    setHandleError(null);
    setHandle(readLeadHandle());
    submitQualification(current)
      .then(setHandle)
      .catch(() => {
        setHandleError(
          "We couldn't save your answers. Please check your connection and try again.",
        );
      });
    setStep(PAY_STEP);
  }, []);

  const goNext = useCallback(() => {
    if (!question || !field) return;
    const msg = validateAnswer(question, answers[field]);
    setTouched((t) => ({ ...t, [field]: true }));
    if (msg) {
      setErrors((e) => ({ ...e, [field]: msg }));
      (inputRef.current ?? firstRadioRef.current)?.focus();
      return;
    }
    setErrors((e) => {
      const next = { ...e };
      delete next[field];
      return next;
    });
    // No review step: after the third answer, go straight to payment.
    if (step === TOTAL - 1) startPayment(answers);
    else setStep((s) => s + 1);
  }, [answers, field, question, startPayment, step]);

  const percent = Math.round((Math.min(step, PAY_STEP) / PAY_STEP) * 100);
  const progressLabel = step === PAY_STEP ? "Last step" : `Question ${step + 1} of ${TOTAL}`;

  return (
    <div className="min-h-dvh px-5 pt-10 pb-16">
      <header className="mx-auto max-w-[560px] text-center">
        <BrandLockup stacked />
        <Link
          to="/"
          className="mt-2 inline-flex min-h-[44px] items-center justify-center px-3 text-[13.5px] text-muted transition-colors hover:text-fg"
        >
          ← Back to site
        </Link>
      </header>

      <main className="mx-auto mt-10 max-w-[560px]">
        <div className="text-center">
          <h1 className="text-[26px] leading-[1.15] font-extrabold tracking-[-0.025em] text-fg md:text-[32px]">
            Let's See If Growth Multiplier AI Is A Fit.
          </h1>
          <p className="mx-auto mt-3 max-w-[480px] text-[15.5px] leading-relaxed text-muted">
            Answer a few questions so we can make your strategy session specific to your business.
          </p>
          <p className="mt-2 text-[12.5px] text-muted-2">
            Takes about 30 seconds. No payment yet.
          </p>
        </div>

        <div className="mt-8 rounded-[16px] border border-border bg-surface p-5 sm:p-7">
          <div aria-live="polite">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold tracking-[0.08em] text-muted-2 uppercase">
                {progressLabel}
              </span>
              <span className="text-[12px] font-semibold tracking-[0.08em] text-muted-2 uppercase">
                {percent}%
              </span>
            </div>
            <div className="mt-2 h-1 w-full rounded-[2px] bg-surface-2">
              <div
                className="h-1 rounded-[2px] bg-lime transition-[width] duration-300 ease-out motion-reduce:transition-none"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div key={step} className="step-enter mt-6">
            {question && field && (
              <QuestionStep
                question={question}
                value={answers[field]}
                error={touched[field] ? errors[field] : undefined}
                onChange={(v) => {
                  setAnswers((a) => ({ ...a, [field]: v }));
                  setErrors((e) => {
                    if (!e[field]) return e;
                    const msg = validateAnswer(question, v);
                    const next = { ...e };
                    if (msg) next[field] = msg;
                    else delete next[field];
                    return next;
                  });
                }}
                onBlur={() => {
                  if (!touched[field]) return;
                  const msg = validateAnswer(question, answers[field]);
                  setErrors((e) => {
                    const next = { ...e };
                    if (msg) next[field] = msg;
                    else delete next[field];
                    return next;
                  });
                }}
                onTouch={() => setTouched((t) => ({ ...t, [field]: true }))}
                onSubmit={goNext}
                inputRef={inputRef}
                firstRadioRef={firstRadioRef}
              />
            )}

            {step === PAY_STEP && (
              <PaymentStep headingRef={headingRef} handle={handle} handleError={handleError} />
            )}
          </div>

          {step < PAY_STEP && (
            <div className="mt-7 flex flex-col-reverse items-center gap-3 sm:flex-row-reverse sm:justify-between">
              <button type="button" className="btn-primary w-full sm:w-auto" onClick={goNext}>
                {step === TOTAL - 1 ? "Continue to payment →" : "Continue →"}
              </button>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[8px] px-3 text-[14px] text-muted transition-colors hover:text-fg"
                >
                  ← Back
                </button>
              )}
            </div>
          )}

          {step === PAY_STEP && (
            <div className="mt-7">
              <button
                type="button"
                onClick={() => setStep(TOTAL - 1)}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[8px] px-3 text-[14px] text-muted transition-colors hover:text-fg"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

type PayState = "idle" | "starting" | "open" | "verifying" | "paid" | "error";

function PaymentStep({
  headingRef,
  handle,
  handleError,
}: {
  headingRef: React.MutableRefObject<HTMLHeadingElement | null>;
  handle: LeadHandle | null;
  handleError: string | null;
}) {
  const [state, setState] = useState<PayState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<"test" | "live" | null>(null);

  const pay = useCallback(async () => {
    if (!handle) return;
    setMessage(null);
    setState("starting");
    try {
      const order = await createStrategyCallOrder({ data: handle });
      setMode(order.mode);
      await loadRazorpayCheckout();
      setState("open");

      openRazorpayCheckout({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amountPaise,
        currency: order.currency,
        name: "Growth Multiplier AI",
        description: "₹9 Strategy Call reservation",
        prefill: order.prefill,
        theme: { color: "#83E24E" },
        handler: (response) => {
          setState("verifying");
          void (async () => {
            // The browser saying "success" proves nothing. The server checks
            // the signature before anything is unlocked.
            const result = await verifyStrategyCallPayment({
              data: {
                ...handle,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            });
            if (result.bookingUnlocked) {
              setState("paid");
            } else {
              setState("error");
              setMessage(
                "We couldn't confirm this payment yet. If money left your account, it will confirm automatically within a few minutes.",
              );
            }
          })().catch(() => {
            setState("error");
            setMessage("We couldn't confirm this payment. Please contact us before retrying.");
          });
        },
        modal: {
          ondismiss: () => {
            setState("idle");
            void recordStrategyCallOutcome({
              data: {
                ...handle,
                orderId: order.orderId,
                outcome: "payment_cancelled",
                reason: "Checkout dismissed",
              },
            });
          },
        },
      });
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Try again.");
    }
  }, [handle]);

  const busy = state === "starting" || state === "open" || state === "verifying";

  return (
    <div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-[19px] leading-snug font-semibold text-fg outline-none"
      >
        {state === "paid" ? "Payment confirmed" : "Secure your session for ₹9"}
      </h2>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-[10px] border border-border bg-surface-2 p-[14px]">
        <span className="text-[14.5px] text-muted">1:1 AI Growth Strategy Session</span>
        <span className="text-[20px] font-bold text-lime">₹9</span>
      </div>

      <p className="mt-3 text-[14px] leading-relaxed text-muted">
        ₹9 isn't the price of the strategy. It's a small commitment to reserve your session.
      </p>

      {mode === "test" && state !== "paid" && (
        <div className="mt-4 rounded-[10px] border border-amber/30 bg-amber/10 p-3">
          <p className="flex items-start gap-2 text-[13px] leading-relaxed text-amber-soft">
            <AlertCircle size={16} className="mt-[2px] shrink-0" aria-hidden="true" />
            <span>
              <strong className="font-medium">Test mode</strong> — no real money will be
              charged. Use Razorpay test card details below.
            </span>
          </p>
        </div>
      )}

      {mode === "test" && state !== "paid" && (
        <div className="mt-3 rounded-[10px] border border-border bg-surface-2 p-3">
          <p className="text-[12px] font-medium uppercase tracking-wide text-muted-2">
            Razorpay test card
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[13px]">
            <div>
              <p className="text-muted-2">Card number</p>
              <p className="font-mono text-fg">5267 3181 8797 5449</p>
            </div>
            <div>
              <p className="text-muted-2">Expiry / CVV</p>
              <p className="font-mono text-fg">Any future date / any 3 digits</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-2">OTP</p>
              <p className="font-mono text-fg">1234</p>
            </div>
          </div>
        </div>
      )}

      {state === "paid" ? (
        <div className="mt-4 rounded-[12px] border border-lime bg-[rgba(131,226,78,0.08)] p-6 text-center">
          <Check size={22} className="mx-auto text-lime" aria-hidden="true" />
          <p className="mt-3 text-[14.5px] text-fg">
            Your ₹9 payment is verified and your session is reserved.
          </p>
          <p className="mt-1 text-[12.5px] text-muted">
            Choose your slot next — you'll also get an email confirmation.
          </p>
          <Link to="/book" className="btn-primary mt-4 inline-flex">
            Choose my slot →
          </Link>
        </div>

      ) : (
        <>
          <button
            type="button"
            onClick={() => void pay()}
            disabled={busy || !handle}
            className={`btn-primary mt-5 w-full ${busy || !handle ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {state === "verifying"
              ? "Confirming your payment…"
              : busy
                ? "Opening secure checkout…"
                : "Pay ₹9 and choose my slot →"}
          </button>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[12.5px] text-muted-2 md:text-[11.5px]">
            <Lock size={12} aria-hidden="true" /> Secure payment. Your card details never touch
            this site.
          </p>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[12.5px] text-muted">
            <ShieldCheck size={13} className="shrink-0 text-lime" aria-hidden="true" />
            Fully refundable on request — email us any time before your session.
          </p>
          <SessionAvailability className="mt-4 text-center" />
          <p className="mt-3 text-center text-[12px] text-muted-2">
            By continuing you agree to our{" "}
            <Link to="/terms" className="underline-offset-4 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </>
      )}

      {(message ?? handleError) && (
        <p className="mt-3 flex items-start gap-1.5 text-[13px] text-urgent" role="alert">
          <AlertCircle size={15} className="mt-[1px] shrink-0" aria-hidden="true" />
          <span>{message ?? handleError}</span>
        </p>
      )}

      {mode === "test" && state !== "paid" && (
        <div className="mt-5 rounded-[10px] border border-border bg-surface-2 p-4">
          <p className="text-[13px] font-medium text-fg">Webhook setup (test mode)</p>
          <p className="mt-1 text-[12px] leading-relaxed text-muted">
            In your Razorpay test dashboard, point this webhook URL to this app:
          </p>
          <code className="mt-2 block break-all rounded-[6px] bg-bg px-3 py-2 text-[12px] font-mono text-amber-soft">
            https://growth-engine-hub-19.lovable.app/api/public/webhooks/razorpay
          </code>
          <p className="mt-2 text-[12px] text-muted">
            Subscribe to: <span className="text-fg">payment.captured</span>,{" "}
            <span className="text-fg">order.paid</span>,{" "}
            <span className="text-fg">payment.failed</span>.
          </p>
          <p className="mt-1 text-[12px] text-muted-2">
            Secret name: <span className="font-mono text-muted">RAZORPAY_WEBHOOK_SECRET</span>
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2">
        <p className="flex items-center gap-2 text-[13px] text-muted-2">
          <Calendar size={15} aria-hidden="true" />{" "}
          {state === "paid" ? "Next: choose your slot" : "After payment: choose your slot"}
        </p>
        <p className="flex items-center gap-2 text-[13px] text-muted-2">
          <MessageCircle size={15} aria-hidden="true" /> Then: join the WhatsApp community
        </p>
      </div>
    </div>
  );
}
