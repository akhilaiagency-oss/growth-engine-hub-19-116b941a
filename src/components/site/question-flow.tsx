import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { QuestionStep } from "@/components/site/question-step";
import {
  DETAILS_STORAGE_KEY,
  DETAIL_QUESTIONS,
  EMPTY_DETAILS,
  validateAnswer,
  type DetailAnswers,
  type DetailField,
} from "@/data/qualification";

const TOTAL = DETAIL_QUESTIONS.length;

function firstUnanswered(answers: DetailAnswers): number {
  const index = DETAIL_QUESTIONS.findIndex((q) =>
    Boolean(validateAnswer(q, answers[q.field as DetailField])),
  );
  return index === -1 ? TOTAL - 1 : index;
}

/**
 * The five post-payment questions, shown on `/book` before the calendar.
 * Resumes on the first unanswered question, restoring anything already given.
 */
export function QualificationDetailsFlow({
  initial,
  onComplete,
}: {
  initial: DetailAnswers;
  onComplete: (answers: DetailAnswers) => Promise<boolean>;
}) {
  const [answers, setAnswers] = useState<DetailAnswers>(() => {
    let restored: DetailAnswers = { ...EMPTY_DETAILS, ...initial };
    try {
      const raw = sessionStorage.getItem(DETAILS_STORAGE_KEY);
      if (raw) {
        const cached = JSON.parse(raw) as Partial<DetailAnswers>;
        // Server answers win; cached ones only fill the gaps.
        for (const key of Object.keys(EMPTY_DETAILS) as DetailField[]) {
          if (!restored[key] && cached[key]) restored = { ...restored, [key]: cached[key] };
        }
      }
    } catch {
      /* ignore malformed storage */
    }
    return restored;
  });
  const [step, setStep] = useState(() => firstUnanswered({ ...EMPTY_DETAILS, ...initial }));
  const [errors, setErrors] = useState<Partial<Record<DetailField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<DetailField, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const firstRadioRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(DETAILS_STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* storage unavailable */
    }
  }, [answers]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
      else firstRadioRef.current?.focus();
    }, 60);
    return () => window.clearTimeout(t);
  }, [step]);

  const question = DETAIL_QUESTIONS[step];
  const field = question?.field as DetailField | undefined;

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
    if (step < TOTAL - 1) {
      setStep((s) => s + 1);
      return;
    }
    setSaving(true);
    setSaveError(null);
    void onComplete(answers)
      .then((ok) => {
        if (!ok) setSaveError("We couldn't save your answers. Please try again.");
      })
      .catch(() => setSaveError("We couldn't save your answers. Please try again."))
      .finally(() => setSaving(false));
  }, [answers, field, onComplete, question, step]);

  if (!question || !field) return null;

  const percent = Math.round(((step + 1) / TOTAL) * 100);

  return (
    <div className="mx-auto max-w-[620px]">
      <h1 className="text-[26px] leading-tight font-semibold text-fg sm:text-[32px]">
        Two minutes so your session isn't generic
      </h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
        You're paid and your slot is waiting. These answers let Akhil prepare for your business
        before you speak.
      </p>

      <div className="mt-6 rounded-[16px] border border-border bg-surface p-5 sm:p-6">
        <div aria-live="polite">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold tracking-[0.08em] text-muted-2 uppercase">
              Question {step + 1} of {TOTAL}
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
        </div>

        {saveError && (
          <p className="mt-4 flex items-start gap-1.5 text-[13px] text-urgent" role="alert">
            <AlertCircle size={15} className="mt-[1px] shrink-0" aria-hidden="true" />
            <span>{saveError}</span>
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse items-center gap-3 sm:flex-row-reverse sm:justify-between">
          <button
            type="button"
            disabled={saving}
            onClick={goNext}
            className={`btn-primary w-full sm:w-auto ${saving ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {saving
              ? "Saving…"
              : step === TOTAL - 1
                ? "Save and choose my slot →"
                : "Continue →"}
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
      </div>
    </div>
  );
}
