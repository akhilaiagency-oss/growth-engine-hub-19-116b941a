import { URGENCY, useCountdown } from "@/lib/urgency";

/**
 * Segmented HH : MM : SS countdown.
 * Fixed-width tabular digits inside hairline tiles so nothing jitters as it ticks.
 */
export function CountdownBlocks({
  className = "",
  size = "md",
  align = "center",
}: {
  className?: string;
  size?: "sm" | "md";
  align?: "center" | "start";
}) {
  const { ready, expired, label } = useCountdown();
  const [hh, mm, ss] = label.split(":");

  const tile =
    size === "sm"
      ? "min-w-[42px] px-2 py-1.5 text-[19px]"
      : "min-w-[56px] px-2.5 py-2.5 text-[26px]";
  const cap = size === "sm" ? "text-[10.5px]" : "text-[11px]";

  if (ready && expired) {
    return (
      <div
        className={`flex ${align === "center" ? "justify-center" : "justify-start"} ${className}`}
      >
        <span className="rounded-[8px] border border-border bg-surface-2 px-3 py-2 text-[12.5px] text-muted">
          Offer window closed — sessions continue at ₹{URGENCY.originalPrice}
        </span>
      </div>
    );
  }

  const parts: Array<[string, string]> = [
    [hh, "Hours"],
    [mm, "Minutes"],
    [ss, "Seconds"],
  ];

  return (
    <div
      className={`flex flex-col gap-2 ${align === "center" ? "items-center" : "items-start"} ${className}`}
    >
      <span
        className={`${cap} font-semibold uppercase tracking-[0.16em] text-muted-2`}
      >
        Offer ends in
      </span>
      <div className="flex items-start gap-1.5" role="timer" aria-live="off">
        {parts.map(([value, caption], i) => (
          <div key={caption} className="flex items-start gap-1.5">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`${tile} inline-flex items-center justify-center rounded-[10px] border border-border-strong bg-[#05080F] text-center font-mono font-bold tabular-nums leading-none text-urgent`}
                suppressHydrationWarning
              >
                {value}
              </span>
              <span
                className={`${cap} font-medium uppercase tracking-[0.1em] text-muted-2`}
              >
                {caption}
              </span>
            </div>
            {i < 2 ? (
              <span
                className={`${size === "sm" ? "text-[17px] leading-[30px]" : "text-[22px] leading-[46px]"} font-bold text-muted-2`}
                aria-hidden="true"
              >
                :
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
