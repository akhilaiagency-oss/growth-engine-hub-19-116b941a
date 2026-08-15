import { useWeeklyCountdown } from "@/hooks/use-weekly-countdown";
import { SESSIONS_LEFT_THIS_WEEK } from "@/data/capacity";

const LABEL = "text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-2";

/** Sessions remaining this week — a hand-maintained value from src/data/capacity.ts. */
export function SessionsLeftBox({
  label = "Sessions left this week",
  withDashes = false,
  total = 5,
}: {
  label?: string;
  withDashes?: boolean;
  total?: number;
}) {
  const count = SESSIONS_LEFT_THIS_WEEK;

  return (
    <div className="rounded-[10px] border border-border bg-bg p-4">
      <p className={LABEL}>{label}</p>
      <p className="mt-2 text-[30px] leading-none font-extrabold text-lime">{count}</p>
      {withDashes && (
        <ul aria-hidden="true" className="mt-3 flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <li
              key={i}
              className="h-[4px] flex-1 rounded-full"
              style={{
                background: i < count ? "var(--lime)" : "var(--border-strong)",
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}


/** Days / hours / minutes to the coming Sunday 23:59 IST, recomputed each tick. */
export function CountdownBox({
  label = "Booking closes in",
  note,
}: {
  label?: string;
  note?: string;
}) {
  const remaining = useWeeklyCountdown();

  const units: { value: number; unit: string }[] = [
    { value: remaining?.days ?? 0, unit: "days" },
    { value: remaining?.hours ?? 0, unit: "hrs" },
    { value: remaining?.minutes ?? 0, unit: "min" },
  ];

  return (
    <div className="rounded-[10px] border border-border bg-bg p-4">
      <p className={LABEL}>{label}</p>
      <ul className="mt-2 flex items-baseline gap-3">
        {units.map((u) => (
          <li key={u.unit} className="flex items-baseline gap-1">
            <span className="text-[22px] leading-none font-extrabold text-fg tabular-nums">
              {remaining === null ? "--" : String(u.value).padStart(2, "0")}
            </span>
            <span className="text-[12px] text-muted-2">{u.unit}</span>
          </li>
        ))}
      </ul>
      {note ? <p className="mt-2 text-[12px] leading-relaxed text-muted-2">{note}</p> : null}
    </div>
  );
}
