import { AlertCircle, Check } from "lucide-react";
import type { Question } from "@/data/qualification";

export function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-[13px] text-urgent">
      <AlertCircle size={15} className="mt-[1px] shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

export interface QuestionStepProps {
  question: Question;
  value: string;
  error: string | undefined;
  onChange: (v: string) => void;
  onBlur: () => void;
  onTouch: () => void;
  onSubmit: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  firstRadioRef: React.MutableRefObject<HTMLInputElement | null>;
}

/**
 * One question, one screen. Shared by `/qualify` (contact) and `/book`
 * (post-payment qualification) so both flows stay identical.
 */
export function QuestionStep({
  question,
  value,
  error,
  onChange,
  onBlur,
  onTouch,
  onSubmit,
  inputRef,
  firstRadioRef,
}: QuestionStepProps) {
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
