import { Link } from "@tanstack/react-router";

interface BookCtaProps {
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
  fullWidth?: boolean;
}

/**
 * Single place every CTA on the page routes through.
 * All CTAs send the visitor to the /qualify pre-payment qualification page.
 */
export function BookCta({
  label = "Book My ₹9 Strategy Call →",
  variant = "primary",
  className = "",
  fullWidth = false,
}: BookCtaProps) {
  const base = variant === "primary" ? "btn-primary" : "btn-secondary";
  return (
    <Link to="/qualify" className={`${base} ${fullWidth ? "w-full" : ""} ${className}`}>
      {label}
    </Link>
  );
}
