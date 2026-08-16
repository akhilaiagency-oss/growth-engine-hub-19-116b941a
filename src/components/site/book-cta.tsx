import { Link } from "@tanstack/react-router";
import { URGENCY } from "@/lib/urgency";

interface BookCtaProps {
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
  fullWidth?: boolean;
  /** Show the ₹99 → ₹9 anchor inside the button. */
  showPrice?: boolean;
}

/**
 * Single place every CTA on the page routes through.
 * All CTAs send the visitor to the /qualify pre-payment qualification page.
 */
export function BookCta({
  label = "Book My ₹9 Strategy Call",
  variant = "primary",
  className = "",
  fullWidth = false,
  showPrice = true,
}: BookCtaProps) {
  const base = variant === "primary" ? "btn-primary" : "btn-secondary";
  const dividerTone =
    variant === "primary" ? "bg-[rgba(10,33,16,0.28)]" : "bg-border-strong";
  const oldTone = variant === "primary" ? "text-[rgba(10,33,16,0.6)]" : "text-muted-2";
  const nowTone = variant === "primary" ? "text-lime-ink" : "text-lime";

  return (
    <Link
      to="/qualify"
      className={`${base} ${fullWidth ? "w-full" : ""} !gap-0 ${className}`}
      aria-label={`${label} — ₹${URGENCY.offerPrice} today, down from ₹${URGENCY.originalPrice}`}
    >
      <span className="whitespace-nowrap">{label}</span>
      {showPrice ? (
        <>
          <span className={`mx-3 h-4 w-px shrink-0 ${dividerTone}`} aria-hidden="true" />
          <span className="inline-flex items-baseline gap-1.5">
            <span className={`text-[12px] font-semibold line-through ${oldTone}`}>
              ₹{URGENCY.originalPrice}
            </span>
            <span className={`text-[17px] font-extrabold ${nowTone}`}>
              ₹{URGENCY.offerPrice}
            </span>
          </span>
        </>
      ) : null}
      <span className="ml-2" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
