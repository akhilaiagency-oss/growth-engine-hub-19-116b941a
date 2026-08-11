import { URGENCY } from "@/lib/urgency";

/** Small chip: how many strategy sessions remain in the current batch. */
export function SlotsLeft({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-[8px] border border-border bg-surface-2 px-2.5 py-1 text-[12px] text-muted ${className}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-urgent" aria-hidden="true" />
      Only <strong className="font-semibold text-urgent">{URGENCY.slotsLeft}</strong> slots left
    </span>
  );
}
