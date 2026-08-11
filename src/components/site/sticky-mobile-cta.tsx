import { BookCta } from "./book-cta";
import { OfferCountdown } from "./offer-countdown";
import { URGENCY } from "@/lib/urgency";

export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[rgba(7,11,20,0.94)] backdrop-blur-md min-[900px]:hidden">
      <div
        className="px-4 pt-2.5"
        style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="inline-flex items-baseline gap-1.5 text-[12px] text-muted">
            <span className="line-through text-muted-2">₹{URGENCY.originalPrice}</span>
            <span className="text-[15px] font-bold text-lime">₹{URGENCY.offerPrice}</span>
            <span>today</span>
          </span>
          <OfferCountdown label="Ends in" />
        </div>
        <BookCta label="Book My Strategy Call" fullWidth />
      </div>
    </div>
  );
}
