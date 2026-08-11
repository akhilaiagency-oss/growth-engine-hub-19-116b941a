import { Reveal } from "./reveal";

const ROWS = [
  {
    title: "System-first, not service-first",
    body: "Most agencies sell a deliverable: a page, a campaign, an automation. We build the connected system those pieces are supposed to belong to, because a great landing page attached to slow follow-up still loses.",
  },
  {
    title: "AI where it earns its place",
    body: "Two jobs: scoring an enquiry the moment it arrives, and replying before interest cools. Those are the points where software genuinely beats a person. Everywhere else the work is strategy and engineering, and we don't dress that up as something cleverer.",
  },
  {
    title: "You talk to the person doing the work",
    body: "Akhil runs the strategy call and stays involved in delivery. No handoff to a junior account manager after you sign.",
  },
  {
    title: "Measurable, or we say so",
    body: "Every stage is tracked, and where something can't be attributed cleanly we tell you rather than dressing it up in a report.",
  },
  {
    title: "Honest about being early",
    body: "We're building this in the open. You get direct founder attention now, and a partner with something to prove.",
  },
];

export function WhySection() {
  return (
    <section id="why" className="section-y band-base">
      <div className="container-narrow">
        <Reveal>
          <span className="eyebrow">Why Growth Multiplier AI</span>
          <h2 className="h2-section mt-4">Why work with us specifically</h2>
        </Reveal>

        <ul className="mt-8">
          {ROWS.map((r, i) => (
            <li key={r.title}>
              <Reveal
                className={`flex flex-col gap-3 py-7 min-[700px]:flex-row min-[700px]:gap-8 ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <h3 className="shrink-0 text-[15.5px] font-bold tracking-[-0.01em] text-fg min-[700px]:w-[220px]">
                  {r.title}
                </h3>
                <p className="text-[14.5px] leading-relaxed text-muted">{r.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
