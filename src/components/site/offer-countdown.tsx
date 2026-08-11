import { URGENCY, useCountdown } from "@/lib/urgency";

/** Countdown to the visitor's ₹9 offer deadline. Monospaced so digits don't jitter. */
export function OfferCountdown({
  className = "",
  label = "Offer ends in",
}: {
  className?: string;
  label?: string;
}) {
  const { ready, expired, label: time } = useCountdown();

  if (ready && expired) {
    return (
      <span className={`text-[12.5px] text-muted ${className}`}>
        Offer window closed — reserve at the standard rate
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 text-[12.5px] text-muted ${className}`}>
      {label}
      <span
        className="font-mono text-[13px] font-semibold tabular-nums text-urgent"
        suppressHydrationWarning
      >
        {time}
      </span>
    </span>
  );
}

export { URGENCY };
