import { Check, X } from "lucide-react";

const GET = [
  "A stage-by-stage read of your current funnel",
  "The one bottleneck costing you the most, named",
  "Landing page and offer review against 25 checks",
  "Where follow-up is leaking, and what it costs",
  "A priority order for what to fix first",
  "The three working documents, sent on confirmation",
];

const WONT = [
  "A pitch deck or a predetermined package",
  "Guaranteed numbers nobody can guarantee",
  "A generic audit you could have downloaded",
  "Pressure to decide anything on the call",
  "A junior account manager instead of Akhil",
  "A full build delivered in 30 minutes",
];

/** What the session is. */
export function SessionGetCard() {
  return (
    <div className="rounded-[12px] border border-border bg-surface p-6">
      <h3 className="text-[20px] font-bold text-lime">What you get in the session</h3>
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
      <h3 className="text-[20px] font-bold text-muted">What you won't get</h3>
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

