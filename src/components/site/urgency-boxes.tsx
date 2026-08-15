import { useNextSlot } from "@/hooks/use-next-slot";
import { TOTAL_SLOTS_PER_DAY } from "@/data/capacity";

const LABEL = "text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-2";

/** Slots still ahead today — computed from the clock. */
export function SessionsLeftBox({
  label = "Slots left today",
  withDashes = false,
}: {
  label?: string;
  withDashes?: boolean;
  /** @deprecated retained for call-site compatibility */
  total?: number;
}) {
  const slot = useNextSlot();
  const count = slot?.slotsLeftToday ?? null;

  return (
    <div className="rounded-[10px] border border-border bg-bg p-4">
      <p className={LABEL}>{label}</p>
      {count === 0 ? (
        <p className="mt-2 text-[14px] leading-relaxed text-muted">
          Today's sessions are done — next slot opens at 3:00 PM tomorrow.
        </p>
      ) : (
        <>
          <p className="mt-2 text-[30px] leading-none font-extrabold text-lime tabular-nums">
            {count === null ? "--" : count}
          </p>
          {withDashes && count !== null && (
            <ul aria-hidden="true" className="mt-3 flex gap-1.5">
              {Array.from({ length: TOTAL_SLOTS_PER_DAY }).map((_, i) => (
                <li
                  key={i}
                  className="h-[4px] flex-1 rounded-full"
                  style={{
                    background:
                      i < count ? "var(--lime)" : "var(--border-strong)",
                  }}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

/** Time until the next 30-minute session slot begins, in IST. */
export function CountdownBox({
  label = "Next session slot begins in",
  note,
}: {
  label?: string;
  note?: string;
}) {
  const slot = useNextSlot();

  const units: { value: string; unit: string }[] = [
    { value: slot?.hours ?? "--", unit: "hrs" },
    { value: slot?.minutes ?? "--", unit: "min" },
    { value: slot?.seconds ?? "--", unit: "sec" },
  ];

  return (
    <div
      className="rounded-[10px] border border-border bg-bg p-4"
      aria-live="off"
      aria-label={
        slot ? `Next session slot begins at ${slot.nextSlotLabel}` : "Next session slot"
      }
    >
      <p className={LABEL}>{label}</p>
      <ul className="mt-2 flex items-baseline gap-3">
        {units.map((u) => (
          <li key={u.unit} className="flex items-baseline gap-1">
            <span className="text-[22px] leading-none font-extrabold text-fg tabular-nums">
              {u.value}
            </span>
            <span className="text-[12px] text-muted-2">{u.unit}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[12px] leading-relaxed text-muted-2">
        {slot ? `Next slot: ${slot.nextSlotLabel}` : "\u00a0"}
      </p>
      {note ? <p className="mt-1 text-[12px] leading-relaxed text-muted-2">{note}</p> : null}
    </div>
  );
}
