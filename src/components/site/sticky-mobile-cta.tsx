import { BookCta } from "./book-cta";

export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[rgba(7,11,20,0.92)] backdrop-blur-md min-[900px]:hidden">
      <div
        className="flex items-center gap-3 px-4 pt-3"
        style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}
      >
        <div className="shrink-0 leading-tight">
          <span className="block text-[12px] text-muted">Strategy call</span>
          <span className="block text-[15px] font-bold text-lime">₹9</span>
        </div>
        <div className="flex-1">
          <BookCta label="Book ₹9 Strategy Call →" fullWidth />
        </div>
      </div>
    </div>
  );
}
