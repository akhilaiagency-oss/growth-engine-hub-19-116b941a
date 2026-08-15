import { Target, Zap, Droplets, Search, CalendarCheck, TrendingUp } from "lucide-react";
import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";

const OUTCOMES = [
  {
    Icon: Target,
    title: "More qualified opportunities",
    body: "Your team spends its hours on buyers who actually match your criteria.",
  },
  {
    Icon: Zap,
    title: "Faster follow-up",
    body: "Replies run on a Tuesday morning and a Sunday night alike, without anyone remembering.",
  },
  {
    Icon: Droplets,
    title: "Less lead leakage",
    body: "Every enquiry is captured, scored and routed instead of sitting in someone's inbox.",
  },
  {
    Icon: Search,
    title: "Clearer funnel visibility",
    body: "Point at the stage where the money stops working, and change it on evidence.",
  },
  {
    Icon: CalendarCheck,
    title: "More booked conversations",
    body: "Booked appointments become the number you diagnose, not just the number you report.",
  },
  {
    Icon: TrendingUp,
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
          {OUTCOMES.map(({ Icon, title, body }) => (
            <Reveal key={title} className="rounded-[12px] border border-border bg-bg p-6">
              <span
                aria-hidden="true"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-[9px] text-lime"
                style={{
                  background: "rgba(131,226,78,0.11)",
                  border: "1px solid rgba(131,226,78,0.25)",
                }}
              >
                <Icon size={18} />
              </span>
              <h3 className="mt-4 text-[16px] font-bold tracking-[-0.01em] text-fg">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{body}</p>

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
