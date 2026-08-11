import { Link } from "@tanstack/react-router";
import { PriceAnchor } from "./price-anchor";
import { OfferCountdown } from "./offer-countdown";
import { URGENCY } from "@/lib/urgency";

/**
 * Slim sitewide urgency band pinned above the nav.
 * Height is fixed at 36px — the root layout reserves the same amount.
 */
export function UrgencyBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-9 border-b border-border bg-[rgba(14,21,38,0.96)] backdrop-blur-md">
      <div className="container-page flex h-9 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <PriceAnchor size="sm" suffix="today" />
          <span className="hidden h-3 w-px bg-border min-[520px]:block" aria-hidden="true" />
          <OfferCountdown className="whitespace-nowrap" />
        </div>

        <div className="hidden items-center gap-4 min-[900px]:flex">
          <span className="whitespace-nowrap text-[12px] text-muted">
            Only <strong className="font-semibold text-urgent">{URGENCY.slotsLeft}</strong> slots
            left
          </span>
          <Link
            to="/qualify"
            className="rounded-[8px] bg-lime px-3 py-1 text-[12px] font-semibold text-lime-ink transition-opacity hover:opacity-90"
          >
            Claim ₹{URGENCY.offerPrice} rate →
          </Link>
        </div>
      </div>
    </div>
  );
}
