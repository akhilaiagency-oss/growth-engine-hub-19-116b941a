import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";

const OUTCOMES = [
  {
    icon: "🎯",
    title: "More qualified opportunities",
    body: "Your team spends its hours on buyers who actually match your criteria.",
  },
  {
    icon: "⚡",
    title: "Faster follow-up",
    body: "Replies run on a Tuesday morning and a Sunday night alike, without anyone remembering.",
  },
  {
    icon: "🪣",
    title: "Less lead leakage",
    body: "Every enquiry is captured, scored and routed instead of sitting in someone's inbox.",
  },
  {
    icon: "🔍",
    title: "Clearer funnel visibility",
    body: "Point at the stage where the money stops working, and change it on evidence.",
  },
  {
    icon: "📅",
    title: "More booked conversations",
    body: "Booked appointments become the number you diagnose, not just the number you report.",
  },
  {
    icon: "📈",
    title: "Better conversion, measurably",
    body: "When every stage is measured, the next change is a decision rather than an opinion.",
  },
];

export function Outcomes() {
  return (
    <section id="outcomes" className="section-y band-raised">
      <div className="container-page">
        <Reveal className="max-w-[760px]">
          <span className="eyebrow">Who this is built for</span>
          <h2 className="h2-section mt-4">This system is built for businesses that want to…</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Structural changes to how acquisition works — not promises with numbers attached.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 min-[900px]:grid-cols-3">
          {OUTCOMES.map((o) => (
            <Reveal key={o.title} className="rounded-[12px] border border-border bg-bg p-6">
              <span
                aria-hidden="true"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-[9px] text-[18px]"
                style={{
                  background: "rgba(131,226,78,0.11)",
                  border: "1px solid rgba(131,226,78,0.25)",
                }}
              >
                {o.icon}
              </span>
              <h3 className="mt-4 text-[16px] font-bold tracking-[-0.01em] text-fg">{o.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{o.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 flex justify-center">
          <BookCta />
        </Reveal>
      </div>
    </section>
  );
}
