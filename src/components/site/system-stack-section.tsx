import { Reveal } from "./reveal";

interface StackRow {
  n: string;
  name: string;
  chips: string[];
}

const ROWS: StackRow[] = [
  {
    n: "01",
    name: "Attention",
    chips: ["Meta Ads", "Paid acquisition", "Lead generation", "Creative testing"],
  },
  {
    n: "02",
    name: "Conversion",
    chips: ["AI landing pages", "Sales funnels", "CRO", "Message match"],
  },
  {
    n: "03",
    name: "Qualification",
    chips: ["AI lead scoring", "Chatbots", "Lead routing", "Disqualification rules"],
  },
  {
    n: "04",
    name: "Nurture",
    chips: ["WhatsApp automation", "Email sequences", "CRM", "Speed-to-lead"],
  },
  {
    n: "05",
    name: "Book",
    chips: ["Appointment booking", "Reminders", "Pipeline stages"],
  },
  {
    n: "06",
    name: "Measure",
    chips: ["Analytics", "Stage attribution", "Funnel optimisation", "Reporting"],
  },
];

export function SystemStackSection() {
  return (
    <section id="stack" className="section-y band-base">
      <div className="container-page">
        <Reveal className="max-w-[760px]">
          <span className="eyebrow">The acquisition system stack</span>
          <h2 className="h2-section mt-4">Six capability groups. One connected system.</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Grouped by where they sit in the buyer's journey — not sold as a service menu.
          </p>
        </Reveal>

        <ol className="mt-8 flex flex-col gap-3">
          {ROWS.map((r) => (
            <li key={r.n}>
              <Reveal
                className="rounded-[12px] border border-border-strong bg-surface"
                style={{ padding: "18px 22px" }}
              >
                <div className="flex flex-col gap-4 min-[760px]:flex-row min-[760px]:items-center">
                  <div className="flex shrink-0 items-center gap-3 min-[760px]:w-[190px]">
                    <span
                      className="flex h-[27px] w-[27px] items-center justify-center rounded-[8px] text-[12px] font-bold text-lime"
                      style={{
                        background: "rgba(131,226,78,0.11)",
                        border: "1px solid rgba(131,226,78,0.25)",
                      }}
                    >
                      {r.n}
                    </span>
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-fg">
                      {r.name}
                    </h3>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {r.chips.map((c) => (
                      <li
                        key={c}
                        className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-[12.5px] text-muted md:text-[11.5px]"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-center text-[13.5px] leading-relaxed text-muted">
          Any agency can sell you one row. The value is in the wiring between them.
        </p>
      </div>
    </section>
  );
}
