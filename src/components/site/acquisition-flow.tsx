const NODES = [
  { name: "Traffic", sub: "Paid + organic" },
  { name: "Landing page", sub: "One clear action" },
  { name: "Qualification", sub: "Scored on arrival" },
  { name: "Follow-up", sub: "Replies in seconds" },
  { name: "Booked call", sub: "In your calendar" },
];

/**
 * Semantic five-stage acquisition flow strip shown under the hero H1.
 * Horizontal five-up at 900px+, compact 2-column grid below that
 * (last node spans both columns).
 */
export function AcquisitionFlow({ className = "" }: { className?: string }) {
  return (
    <figure className={`mx-auto w-full max-w-[960px] ${className}`}>
      <ol
        aria-label="The five stages of a connected acquisition system"
        className="grid grid-cols-2 overflow-hidden rounded-[14px] border border-border-strong bg-surface min-[900px]:grid-cols-5"
      >
        {NODES.map((n, i) => {
          const last = i === NODES.length - 1;
          const mobileBorders = [
            i >= 2 ? "border-t border-border" : "",
            i % 2 === 1 ? "border-l border-border" : "",
          ].join(" ");
          const desktopBorders =
            i > 0
              ? "min-[900px]:border-t-0 min-[900px]:border-l min-[900px]:border-border"
              : "min-[900px]:border-l-0";
          return (
            <li
              key={n.name}
              className={`flex flex-col items-center gap-1.5 px-3 py-3 min-[900px]:py-[18px] ${mobileBorders} ${desktopBorders} ${
                last ? "col-span-2 min-[900px]:col-span-1" : ""
              }`}
              style={last ? { background: "rgba(131,226,78,0.07)" } : undefined}
            >
              <span
                aria-hidden="true"
                className="h-[9px] w-[9px] rounded-full"
                style={
                  last
                    ? {
                        background: "var(--lime)",
                        boxShadow: "0 0 0 4px rgba(131,226,78,0.18)",
                      }
                    : { background: "var(--muted-2)" }
                }
              />
              <span
                className={`text-[10.5px] font-semibold uppercase tracking-[0.09em] ${
                  last ? "text-lime" : "text-fg"
                }`}
              >
                {n.name}
              </span>
              <span className="text-[10.5px] text-muted-2">{n.sub}</span>
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-3 text-[12.5px] leading-relaxed text-muted-2">
        Five stages. Most businesses own each one separately — and nobody owns the joins.
      </figcaption>
    </figure>
  );
}
