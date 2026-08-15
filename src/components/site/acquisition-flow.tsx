const NODES = [
  { name: "Traffic", sub: "Paid + organic" },
  { name: "Landing page", sub: "One clear action" },
  { name: "Qualification", sub: "Scored on arrival" },
  { name: "Follow-up", sub: "Replies in seconds" },
  { name: "Booked call", sub: "In your calendar" },
];

/**
 * Semantic five-stage acquisition flow strip shown under the hero H1.
 * Horizontal with vertical hairlines at 900px+, stacked with horizontal
 * hairlines below that. Text, never an image.
 */
export function AcquisitionFlow() {
  return (
    <figure className="mx-auto w-full max-w-[960px]">
      <ol
        aria-label="The five stages of a connected acquisition system"
        className="grid grid-cols-2 overflow-hidden rounded-[14px] border border-border-strong bg-surface min-[900px]:grid-cols-5"
      >
        {NODES.map((n, i) => {
          const last = i === NODES.length - 1;
          return (
            <li
              key={n.name}
              className={`flex flex-col items-center gap-1.5 px-3 py-4 ${
                i >= 2 ? "border-t border-border" : ""
              } ${i % 2 === 1 ? "border-l border-border" : ""} ${
                last ? "col-span-2" : ""
              } min-[900px]:col-span-1 min-[900px]:border-t-0 ${
                i > 0 ? "min-[900px]:border-l min-[900px]:border-border" : "min-[900px]:border-l-0"
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
        Five stages. Most businesses own each one separately — and the opportunities are lost in the
        handoffs between them.
      </figcaption>
    </figure>
  );
}
