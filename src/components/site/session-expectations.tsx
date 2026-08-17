import { Check, X } from "lucide-react";

const GET = [
  "A stage-by-stage read of your current funnel",
  "The one bottleneck costing you the most, named",
  "Landing page and offer review against 25 checks",
  "Where follow-up is leaking, and what it costs",
  "A priority order for what to fix first",
  "The three working documents, sent on confirmation",
  "What's already working, and shouldn't be touched",
];

const WONT = [
  "Budget comes up in the first five minutes",
  "You get a proposal, not a diagnosis",
  "Someone junior takes the notes",
  "\u201CWe'll send you a deck\u201D — and that's the last of it",
  "Everything you already built gets called broken",
  "You leave with a quote you can't evaluate",
];

/** What the session is. */
export function SessionGetCard() {
  return (
    <div className="rounded-[12px] border border-border bg-surface p-6">
      <h3 className="text-[20px] font-bold text-lime">This call</h3>
      <ul className="mt-4 space-y-3">
        {GET.map((g) => (
          <li key={g} className="flex items-start gap-3 text-[15px] text-muted">
            <Check size={16} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
            {g}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** What the session isn't. */
export function SessionWontCard() {
  return (
    <div className="rounded-[12px] border border-border bg-surface p-6">
      <h3 className="text-[20px] font-bold text-muted">A typical agency call</h3>
      <ul className="mt-4 space-y-3">
        {WONT.map((w) => (
          <li key={w} className="flex items-start gap-3 text-[15px] text-muted-2">
            <X size={16} className="mt-1 shrink-0 text-muted-2" aria-hidden="true" />
            {w}
          </li>
        ))}
      </ul>
    </div>
  );
}

