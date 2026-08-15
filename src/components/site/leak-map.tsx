import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";
import { AcquisitionFlow } from "./acquisition-flow";


interface Row {
  n: string;
  stage: string;
  pct: number;
  lead?: string;
  note: string;
}

const ROWS: Row[] = [
  {
    n: "01",
    stage: "Attract",
    pct: 100,
    note: "Your budget has already been spent by this point",
  },
  {
    n: "02",
    stage: "Convert",
    pct: 72,
    lead: "Common bottleneck —",
    note: "the page doesn't make the next step obvious",
  },
  {
    n: "03",
    stage: "Qualify",
    pct: 52,
    lead: "Potential leak —",
    note: "nothing separates a serious buyer from a browser",
  },
  {
    n: "04",
    stage: "Nurture",
    pct: 30,
    lead: "Most common leak —",
    note: "the reply lands after interest has cooled",
  },
  {
    n: "05",
    stage: "Book",
    pct: 16,
    note: "What survives all four is what your sales calendar actually receives",
  },
];

export function LeakMap() {
  return (
    <section id="leak-map" className="section-y band-base">
      <div className="container-page">
        <Reveal className="max-w-[760px]">
          <span className="eyebrow">The diagnostic</span>
          <h2 className="h2-section mt-4">Where could your acquisition system be leaking?</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Before we build anything, we find where you're losing people. The first five stages of
            the Engine are also the five places acquisition quietly narrows — and almost every
            business is losing more at one of them than at the other four combined.
          </p>
        </Reveal>

        <Reveal className="mt-8 rounded-[16px] border border-border bg-surface p-5 md:p-8">
          <div className="flex flex-wrap items-center gap-6 border-b border-border pb-5">
            <span className="flex items-center gap-2 text-[12.5px] text-muted md:text-[12px]">
              <span
                className="h-2.5 w-2.5 rounded-[3px]"
                style={{ background: "var(--cyan)" }}
                aria-hidden="true"
              />
              Volume still in the funnel
            </span>
            <span className="flex items-center gap-2 text-[12.5px] text-muted md:text-[12px]">
              <span
                className="h-2.5 w-2.5 rounded-[3px]"
                style={{ background: "var(--urgent)" }}
                aria-hidden="true"
              />
              Where the leak happens
            </span>
          </div>

          <ul className="mt-6 flex flex-col gap-6 min-[700px]:gap-4">
            {ROWS.map((r) => (
              <li
                key={r.n}
                className="flex flex-col gap-2 min-[700px]:flex-row min-[700px]:items-center min-[700px]:gap-5"
              >
                <div className="flex shrink-0 items-center gap-3 min-[700px]:w-[180px]">
                  <span
                    className="flex h-[26px] w-[26px] items-center justify-center rounded-[6px] border text-[12px] font-bold min-[700px]:text-[11px]"
                    style={{
                      borderColor: "rgba(63,220,232,0.35)",
                      color: "var(--cyan)",
                      background: "rgba(63,220,232,0.08)",
                    }}
                  >
                    {r.n}
                  </span>
                  <span className="text-[15px] font-semibold text-fg min-[700px]:text-[14px]">
                    {r.stage}
                  </span>
                </div>

                {/* Mobile: slim visual bar + readable copy beneath */}
                <div className="w-full min-[700px]:hidden">
                  <div className="relative h-[10px] w-full overflow-hidden rounded-[5px] bg-surface-2">
                    <div
                      className="absolute inset-y-0 left-0"
                      style={{
                        width: `${r.pct}%`,
                        background:
                          "linear-gradient(90deg, rgba(63,220,232,0.30), rgba(63,220,232,0.14))",
                        borderRight: "2px solid var(--cyan)",
                      }}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    <span className="font-bold text-fg">{r.pct}%</span>{" "}
                    {r.lead && (
                      <span className="italic" style={{ color: "var(--urgent)" }}>
                        {r.lead}{" "}
                      </span>
                    )}
                    <span>{r.note}</span>
                  </p>
                </div>

                {/* 700px and up: original inline-in-bar treatment */}
                <div className="relative hidden h-[34px] w-full overflow-hidden rounded-[6px] bg-surface-2 min-[700px]:block">
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: `${r.pct}%`,
                      background:
                        "linear-gradient(90deg, rgba(63,220,232,0.30), rgba(63,220,232,0.14))",
                      borderRight: "2px solid var(--cyan)",
                    }}
                    aria-hidden="true"
                  />
                  <p className="relative flex h-full items-center gap-1.5 px-3 text-[11.5px] leading-tight text-muted">
                    <span className="font-bold text-fg">{r.pct}%</span>
                    {r.lead && (
                      <span className="italic" style={{ color: "var(--urgent)" }}>
                        {r.lead}
                      </span>
                    )}
                    <span className="line-clamp-2">{r.note}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>


          <div className="mt-7 rounded-[8px] border border-border bg-surface-2 p-4 text-[13px] leading-relaxed text-muted md:text-[12.5px]">
            This is a <strong className="font-semibold text-fg">shape, not a statistic</strong> — an
            illustration of how acquisition typically narrows, not measured results from any
            business. On your call we put your real numbers against each stage and find which one is
            costing you most.
          </div>
        </Reveal>

        <div className="mt-8 text-center">
          <p className="mb-[14px] text-[14.5px] leading-relaxed text-muted">
            Most owners can guess their weakest stage. Almost none can prove it.
          </p>
          <BookCta label="Map My Funnel — Book My ₹9 Strategy Call" />
        </div>
      </div>
    </section>
  );
}
