import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, Calendar, Check, Lock, MessageCircle } from "lucide-react";
import logo from "@/assets/growth-multiplier-ai-logo.png";
import {
  EMPTY_ANSWERS,
  QUESTIONS,
  STORAGE_KEY,
  readLeadHandle,
  submitQualification,
  validateAnswer,
  type LeadHandle,
  type QualificationAnswers,
  type QualificationField,
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

const TOTAL = QUESTIONS.length;
const REVIEW_STEP = TOTAL;
const PAY_STEP = TOTAL + 1;

function QualifyPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QualificationAnswers>(EMPTY_ANSWERS);
  const [errors, setErrors] = useState<Partial<Record<QualificationField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<QualificationField, boolean>>>({});
  const [returnToReview, setReturnToReview] = useState(false);
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
      if (raw) setAnswers({ ...EMPTY_ANSWERS, ...(JSON.parse(raw) as QualificationAnswers) });
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

  const question: Question | undefined = QUESTIONS[step];

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
      else if (firstRadioRef.current) firstRadioRef.current.focus();
      else headingRef.current?.focus();
    }, 60);
    return () => window.clearTimeout(t);
  }, [step]);

  const setValue = useCallback(
    (field: QualificationField, value: string, q: Question) => {
      setAnswers((a) => ({ ...a, [field]: value }));
      setErrors((e) => {
        if (!e[field]) return e;
        const msg = validateAnswer(q, value);
        const next = { ...e };
        if (msg) next[field] = msg;
        else delete next[field];
        return next;
      });
    },
    [],
  );

  const goNext = useCallback(() => {
    if (!question) return;
    const msg = validateAnswer(question, answers[question.field]);
    setTouched((t) => ({ ...t, [question.field]: true }));
    if (msg) {
      setErrors((e) => ({ ...e, [question.field]: msg }));
      (inputRef.current ?? firstRadioRef.current)?.focus();
      return;
    }
    setErrors((e) => {
      const next = { ...e };
      delete next[question.field];
      return next;
    });
    if (returnToReview) {
      setReturnToReview(false);
      setStep(REVIEW_STEP);
      return;
    }
    setStep((s) => s + 1);
  }, [answers, question, returnToReview]);

  const percent = Math.round((Math.min(step, PAY_STEP) / PAY_STEP) * 100);
  const progressLabel =
    step === PAY_STEP
      ? "Last step"
      : step === REVIEW_STEP
        ? "Review"
        : `Question ${step + 1} of ${TOTAL}`;

  return (
    <div className="min-h-dvh px-5 pt-10 pb-16">
      <header className="mx-auto max-w-[560px] text-center">
        <div className="flex flex-col items-center gap-3">
          <img
            src={logo}
            alt="Growth Multiplier AI logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-contain"
          />
          <span className="text-[15px] font-bold tracking-[-0.01em] text-fg">
            Growth Multiplier AI
          </span>
        </div>
        <Link
          to="/"
          className="mt-4 inline-block text-[13px] text-muted transition-colors hover:text-fg"
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
          <p className="mt-2 text-[12.5px] text-muted-2">Takes about a minute. No payment yet.</p>
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
            {question && (
              <QuestionStep
                question={question}
                value={answers[question.field]}
                error={touched[question.field] ? errors[question.field] : undefined}
                onChange={(v) => setValue(question.field, v, question)}
                onBlur={() => {
                  if (!touched[question.field]) return;
                  const msg = validateAnswer(question, answers[question.field]);
                  setErrors((e) => {
                    const next = { ...e };
                    if (msg) next[question.field] = msg;
                    else delete next[question.field];
                    return next;
                  });
                }}
                onTouch={() => setTouched((t) => ({ ...t, [question.field]: true }))}
                onSubmit={goNext}
                headingRef={headingRef}
                inputRef={inputRef}
                firstRadioRef={firstRadioRef}
              />
            )}

            {step === REVIEW_STEP && (
              <ReviewStep
                answers={answers}
                headingRef={headingRef}
                onEdit={(index) => {
                  setReturnToReview(true);
                  setStep(index);
                }}
              />
            )}

            {step === PAY_STEP && (
              <PaymentStep headingRef={headingRef} handle={handle} handleError={handleError} />
            )}
          </div>

          {step <= REVIEW_STEP && (
            <div className="mt-7 flex flex-col-reverse items-center gap-3 sm:flex-row-reverse sm:justify-between">
              <button
                type="button"
                className="btn-primary w-full sm:w-auto"
                onClick={() => {
                  if (step === REVIEW_STEP) {
                    setHandleError(null);
                    setHandle(readLeadHandle());
                    submitQualification(answers)
                      .then(setHandle)
                      .catch(() => {
                        setHandleError(
                          "We couldn't save your answers. Please check your connection and try again.",
                        );
                      });
                    setStep(PAY_STEP);
                  } else {
                    goNext();
                  }
                }}
              >
                {step === REVIEW_STEP
                  ? "Continue to payment →"
                  : step === TOTAL - 1
                    ? "Review my answers →"
                    : "Continue →"}
              </button>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setReturnToReview(false);
                    setStep((s) => s - 1);
                  }}
                  className="min-h-[44px] rounded-[8px] px-2 text-[14px] text-muted transition-colors hover:text-fg"
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
                onClick={() => {
                  setStep(REVIEW_STEP);
                }}
                className="min-h-[44px] rounded-[8px] px-2 text-[14px] text-muted transition-colors hover:text-fg"
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

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-[13px] text-urgent">
      <AlertCircle size={15} className="mt-[1px] shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

interface StepProps {
  question: Question;
  value: string;
  error: string | undefined;
  onChange: (v: string) => void;
  onBlur: () => void;
  onTouch: () => void;
  onSubmit: () => void;
  headingRef: React.MutableRefObject<HTMLHeadingElement | null>;
  inputRef: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  firstRadioRef: React.MutableRefObject<HTMLInputElement | null>;
}

function QuestionStep({
  question,
  value,
  error,
  onChange,
  onBlur,
  onTouch,
  onSubmit,
  headingRef,
  inputRef,
  firstRadioRef,
}: StepProps) {
  const id = `q-${question.field}`;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const describedBy = [question.helper ? helperId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ");

  inputRef.current = null;
  firstRadioRef.current = null;

  if (question.kind === "choice") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <fieldset aria-describedby={describedBy || undefined}>
          <legend className="text-[19px] leading-snug font-semibold text-fg">
            {question.label}
          </legend>
          {question.helper && (
            <p id={helperId} className="mt-2 text-[13.5px] text-muted">
              {question.helper}
            </p>
          )}
          <div className="mt-4 flex flex-col gap-[10px]">
            {question.options.map((opt, i) => {
              const selected = value === opt;
              return (
                <label
                  key={opt}
                  className={`flex min-h-[48px] cursor-pointer items-center justify-between gap-3 rounded-[10px] border p-[14px] text-[14.5px] transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-lime ${
                    selected
                      ? "border-lime bg-[rgba(131,226,78,0.08)] text-fg"
                      : "border-border bg-surface-2 text-fg hover:border-border-strong"
                  }`}
                >
                  <input
                    ref={
                      i === 0
                        ? (el) => {
                            firstRadioRef.current = el;
                          }
                        : undefined
                    }
                    type="radio"
                    name={question.field}
                    value={opt}
                    checked={selected}
                    aria-invalid={error ? true : undefined}
                    onChange={() => {
                      onTouch();
                      onChange(opt);
                    }}
                    className="sr-only"
                  />
                  <span>{opt}</span>
                  {selected && <Check size={16} className="shrink-0 text-lime" aria-hidden="true" />}
                </label>
              );
            })}
          </div>
          {error && <FieldError id={errorId} message={error} />}
        </fieldset>
        <button type="submit" className="sr-only" tabIndex={-1} aria-hidden="true">
          Continue
        </button>
      </form>
    );
  }

  if (question.kind === "textarea") {
    return (
      <div>
        <label htmlFor={id} className="block text-[19px] leading-snug font-semibold text-fg">
          {question.label}
        </label>
        {question.helper && (
          <p id={helperId} className="mt-2 text-[13.5px] text-muted">
            {question.helper}
          </p>
        )}
        <textarea
          id={id}
          ref={(el) => {
            inputRef.current = el;
          }}
          rows={question.rows}
          maxLength={question.maxLength}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            onTouch();
            onBlur();
          }}
          className={`mt-4 w-full resize-y rounded-[10px] border bg-surface-2 p-[14px] text-[16px] text-fg placeholder:text-muted-2 ${
            error ? "border-urgent" : "border-border"
          }`}
        />
        <p className="mt-1 text-right text-[12px] text-muted-2">
          {value.length}/{question.maxLength}
        </p>
        {error && <FieldError id={errorId} message={error} />}
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor={id} className="block text-[19px] leading-snug font-semibold text-fg">
        {question.label}
      </label>
      {question.helper && (
        <p id={helperId} className="mt-2 text-[13.5px] text-muted">
          {question.helper}
        </p>
      )}
      <input
        id={id}
        ref={(el) => {
          inputRef.current = el;
        }}
        type={question.inputType}
        autoComplete={question.autoComplete}
        inputMode={question.inputMode}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          onTouch();
          onBlur();
        }}
        className={`mt-4 min-h-[48px] w-full rounded-[10px] border bg-surface-2 px-[14px] py-3 text-[16px] text-fg placeholder:text-muted-2 ${
          error ? "border-urgent" : "border-border"
        }`}
      />
      {error && <FieldError id={errorId} message={error} />}
      <button type="submit" className="sr-only" tabIndex={-1} aria-hidden="true">
        Continue
      </button>
    </form>
  );
}

function ReviewStep({
  answers,
  onEdit,
  headingRef,
}: {
  answers: QualificationAnswers;
  onEdit: (index: number) => void;
  headingRef: React.MutableRefObject<HTMLHeadingElement | null>;
}) {
  return (
    <div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-[19px] leading-snug font-semibold text-fg outline-none"
      >
        Review your answers
      </h2>
      <p className="mt-2 text-[13.5px] text-muted">
        Check this looks right before you reserve your session.
      </p>
      <ul className="mt-5">
        {QUESTIONS.map((q, i) => (
          <li
            key={q.field}
            className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-b-0"
          >
            <div className="min-w-0">
              <p className="text-[12px] tracking-[0.08em] text-muted-2 uppercase">
                {q.reviewLabel}
              </p>
              <p className="mt-1 text-[14.5px] break-words text-fg">{answers[q.field]}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(i)}
              className="shrink-0 rounded-[8px] px-2 py-1 text-[13px] text-muted transition-colors hover:text-fg"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
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
        {state === "paid" ? "Payment confirmed" : "Reserve your strategy session"}
      </h2>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-[10px] border border-border bg-surface-2 p-[14px]">
        <span className="text-[14.5px] text-muted">1:1 Growth Strategy Call</span>
        <span className="text-[20px] font-bold text-lime">₹9</span>
      </div>

      <p className="mt-3 text-[14px] leading-relaxed text-muted">
        ₹9 isn't the price of the strategy. It's a small commitment to reserve your session.
      </p>

      {mode === "test" && state !== "paid" && (
        <div className="mt-4 rounded-[10px] border border-amber-500/30 bg-amber-500/10 p-3">
          <p className="flex items-start gap-2 text-[13px] leading-relaxed text-amber-200">
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
            Slot selection opens next — you'll also get an email confirmation.
          </p>
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
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11.5px] text-muted-2">
            <Lock size={12} aria-hidden="true" /> Secure payment. Your card details never touch
            this site.
          </p>
        </>
      )}

      {(message ?? handleError) && (
        <p className="mt-3 flex items-start gap-1.5 text-[13px] text-urgent" role="alert">
          <AlertCircle size={15} className="mt-[1px] shrink-0" aria-hidden="true" />
          <span>{message ?? handleError}</span>
        </p>
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
