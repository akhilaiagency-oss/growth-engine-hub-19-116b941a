import { useNextSlot } from "@/hooks/use-next-slot";
import { SESSIONS_LEFT_THIS_WEEK } from "@/data/capacity";

const LABEL = "text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-2";

/** Sessions still open this week — a hand-maintained constant. */
export function SessionsLeftBox({
  label = "Sessions left this week",
  withDashes = false,
}: {
  label?: string;
  withDashes?: boolean;
}) {
  const count = SESSIONS_LEFT_THIS_WEEK;

  return (
    <div className="flex min-h-[78px] flex-col items-center justify-center rounded-[10px] border border-border bg-bg p-4">
      <p className={LABEL}>{label}</p>
      <p className="mt-2 text-[34px] leading-none font-extrabold text-lime tabular-nums">{count}</p>
      {withDashes && (
        <ul aria-hidden="true" className="mt-3 flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <li
              key={i}
              className="h-[4px] flex-1 rounded-full"
              style={{ background: i < count ? "var(--lime)" : "var(--border-strong)" }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/** Time until the first slot a visitor could actually book, in IST. */
export function CountdownBox({
  label = "Booking closes in",
  showSlotLine = false,
}: {
  label?: string;
  showSlotLine?: boolean;
}) {
  const slot = useNextSlot();

  const units: { value: string; unit: string }[] = [
    { value: slot?.hours ?? "--", unit: "Hrs" },
    { value: slot?.minutes ?? "--", unit: "Min" },
    { value: slot?.seconds ?? "--", unit: "Sec" },
  ];

  return (
    <div
      className="rounded-[10px] border border-border bg-bg p-4"
      aria-label={
        slot ? `Next available session slot at ${slot.slotLabel}` : "Next available session slot"
      }
    >
      <p className={LABEL}>{label}</p>
      <ul
        className="mt-2 flex items-baseline gap-4 min-[421px]:gap-5 min-[900px]:gap-3"
        aria-live="off"
      >
        {units.map((u) => (
          <li key={u.unit} className="flex items-baseline gap-1">
            <span className="text-[20px] leading-none font-extrabold text-fg tabular-nums min-[900px]:text-[26px]">
              {u.value}
            </span>
            <span className="text-[12px] text-muted-2">{u.unit}</span>
          </li>
        ))}
      </ul>
      {showSlotLine && (
        <p className="mt-2 text-[12px] text-muted-2">
          {slot ? `Available slot: ${slot.slotLabel}` : "\u00a0"}
        </p>
      )}
    </div>
  );
}
