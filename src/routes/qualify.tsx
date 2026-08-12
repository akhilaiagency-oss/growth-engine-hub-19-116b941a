import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Calendar, Lock, MessageCircle, ShieldCheck } from "lucide-react";
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
import { createStrategyCallPaymentLink } from "@/lib/strategy-call.functions";
import { SessionAvailability } from "@/components/site/session-availability";

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

type PayState = "idle" | "starting" | "redirecting" | "error";

function PaymentStep({
  headingRef,
  handle,
  handleError,
}: {
  headingRef: React.MutableRefObject<HTMLHeadingElement | null>;
  handle: LeadHandle | null;
  handleError: string | null;
}) {
  const navigate = useNavigate();
  const [state, setState] = useState<PayState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const pay = useCallback(async () => {
    if (!handle) return;
    setMessage(null);
    setState("starting");
    try {
      const result = await createStrategyCallPaymentLink({ data: handle });

      if ("alreadyPaid" in result) {
        void navigate({ to: "/book" });
        return;
      }
      if ("locked" in result) {
        setState("error");
        setMessage("We couldn't find your session. Please start the form again.");
        return;
      }

      // Hand off to Razorpay's hosted page. Nothing sensitive lives here.
      setState("redirecting");
      window.location.href = result.shortUrl;
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }, [handle, navigate]);

  const busy = state === "starting" || state === "redirecting";

  return (
    <div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-[19px] leading-snug font-semibold text-fg outline-none"
      >
        Secure your session for ₹9
      </h2>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-[10px] border border-border bg-surface-2 p-[14px]">
        <span className="text-[14.5px] text-muted">1:1 AI Growth Strategy Session</span>
        <span className="text-[20px] font-bold text-lime">₹9</span>
      </div>

      <p className="mt-3 text-[14px] leading-relaxed text-muted">
        ₹9 isn't the price of the strategy. It's a small commitment to reserve your session.
      </p>

      <button
        type="button"
        onClick={() => void pay()}
        disabled={busy || !handle}
        className={`btn-primary mt-5 w-full ${busy || !handle ? "cursor-not-allowed opacity-60" : ""}`}
      >
        {busy ? "Redirecting to secure payment…" : "Pay ₹9 and choose my slot →"}
      </button>
      <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[12.5px] text-muted-2 md:text-[11.5px]">
        <Lock size={12} aria-hidden="true" /> You'll pay on Razorpay's secure page, then return
        here.
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

      {(message ?? handleError) && (
        <p className="mt-3 flex items-start gap-1.5 text-[13px] text-urgent" role="alert">
          <AlertCircle size={15} className="mt-[1px] shrink-0" aria-hidden="true" />
          <span>{message ?? handleError}</span>
        </p>
      )}

      <div className="mt-6 flex flex-col gap-2">
        <p className="flex items-center gap-2 text-[13px] text-muted-2">
          <Calendar size={15} aria-hidden="true" /> After payment: choose your slot
        </p>
        <p className="flex items-center gap-2 text-[13px] text-muted-2">
          <MessageCircle size={15} aria-hidden="true" /> Then: join the WhatsApp community
        </p>
      </div>
    </div>
  );
}
