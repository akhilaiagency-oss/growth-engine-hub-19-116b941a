import { useBooking } from "./booking-context";

interface BookCtaProps {
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
  fullWidth?: boolean;
}

/**
 * Single place every CTA on the page routes through.
 * Swap the onClick here for a real payment handler later.
 */
export function BookCta({
  label = "Book My ₹9 Strategy Call →",
  variant = "primary",
  className = "",
  fullWidth = false,
}: BookCtaProps) {
  const { openBooking } = useBooking();
  const base = variant === "primary" ? "btn-primary" : "btn-secondary";
  return (
    <button
      type="button"
      onClick={openBooking}
      className={`${base} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {label}
    </button>
  );
}
