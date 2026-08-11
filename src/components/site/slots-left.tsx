import { URGENCY } from "@/lib/urgency";

const TOTAL_PIPS = 10;

/**
 * Capacity chip: how many strategy sessions remain in the current batch,
 * with a small segmented meter so the number reads as capacity, not decoration.
 */
export function SlotsLeft({
  className = "",
  showMeter = true,
}: {
  className?: string;
  showMeter?: boolean;
}) {
  const left = Math.min(URGENCY.slotsLeft, TOTAL_PIPS);

  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-[10px] border border-border-strong bg-surface-2 px-3 py-1.5 ${className}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-urgent" aria-hidden="true" />
      <span className="text-[12.5px] leading-none text-muted">
        Only <strong className="font-bold text-urgent">{left}</strong> slots left
      </span>
      {showMeter ? (
        <span className="hidden items-center gap-[3px] min-[420px]:flex" aria-hidden="true">
          {Array.from({ length: TOTAL_PIPS }).map((_, i) => (
            <span
              key={i}
              className={`h-3 w-[3px] rounded-full ${
                i < left ? "bg-urgent" : "bg-[rgba(255,255,255,0.12)]"
              }`}
            />
          ))}
        </span>
      ) : null}
    </span>
  );
}
