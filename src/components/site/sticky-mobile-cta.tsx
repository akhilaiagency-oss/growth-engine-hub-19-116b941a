import { BookCta } from "./book-cta";
import { URGENCY } from "@/lib/urgency";
import { useNextSlot } from "@/hooks/use-next-slot";

export function StickyMobileCta() {
  const slot = useNextSlot();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[rgba(7,11,20,0.94)] backdrop-blur-md min-[900px]:hidden">
      <div
        className="px-4 pt-2.5"
        style={{ padding: "10px 16px calc(10px + env(safe-area-inset-bottom))" }}
      >
        <div className="mb-2 flex items-center justify-center gap-3">
          <span className="inline-flex items-baseline gap-1.5 text-[12px] text-muted">
            <span className="line-through text-muted-2">₹{URGENCY.originalPrice}</span>
            <span className="text-[15px] font-bold text-lime">₹{URGENCY.offerPrice}</span>
            <span>today</span>
          </span>
        </div>
        {slot ? (
          <p className="mb-2 text-center text-[12px] text-muted-2">
            Available slot:{" "}
            <span className="font-semibold whitespace-nowrap text-lime">
              {slot.slotLabel.replace(" IST", "")}
            </span>
          </p>
        ) : null}
        <BookCta fullWidth />
      </div>
    </div>
  );
}
