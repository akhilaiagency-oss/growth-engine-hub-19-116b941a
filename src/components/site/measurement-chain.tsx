const CHAIN = ["Traffic", "Lead", "Qualified", "Booked", "Showed", "Opportunity", "Revenue"];

/** The seven measured stages every build is instrumented against. */
export function MeasurementChain() {
  return (
    <figure>
      <p className="text-[12px] font-semibold tracking-[0.14em] text-lime uppercase">
        How we measure — every build is instrumented against this chain
      </p>
      <ol
        aria-label="The seven measured stages, from traffic to revenue"
        className="mt-4 grid grid-cols-1 gap-2 min-[900px]:grid-cols-7 min-[900px]:gap-0"
      >
        {CHAIN.map((stage, i) => {
          const last = i === CHAIN.length - 1;
          const first = i === 0;
          return (
            <li
              key={stage}
              className="border border-border bg-surface-2 px-3 py-3 text-center min-[900px]:border-l-0 min-[900px]:first:border-l"
              style={{
                borderRadius: first ? "8px 8px 0 0" : last ? "0 0 8px 8px" : undefined,
                ...(last
                  ? { background: "rgba(131,226,78,0.07)", borderColor: "rgba(131,226,78,0.35)" }
                  : null),
              }}
            >
              <span
                className={`block text-[12px] font-semibold tracking-[0.09em] uppercase ${
                  last ? "text-lime" : "text-fg"
                }`}
              >
                {stage}
              </span>
              <span className="mt-1 block text-[12px] text-muted-2">
                Stage {String(i + 1).padStart(2, "0")}
              </span>
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-4 text-center text-[13px] text-muted">
        Every stage is tracked separately, so a drop can be located rather than guessed at.
      </figcaption>
    </figure>
  );
}
