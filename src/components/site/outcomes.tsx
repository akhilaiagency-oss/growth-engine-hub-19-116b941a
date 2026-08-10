import { Check } from "lucide-react";
import { Reveal } from "./reveal";

const OUTCOMES = [
  {
    title: "Leads arrive pre-qualified",
    body: "Your team stops sorting through everyone and starts talking to people who match your criteria.",
  },
  {
    title: "Follow-up stops depending on someone remembering",
    body: "Response happens automatically, at speed, every time — including evenings and weekends.",
  },
  {
    title: "The calendar fills with real opportunities",
    body: "Booked appointments become the metric that matters, rather than raw lead volume.",
  },
  {
    title: "Ad spend becomes accountable",
    body: "You can see which stage every rupee dies at, so budget decisions stop being guesswork.",
  },
  {
    title: "Nothing lives in someone's head anymore",
    body: "Every lead, stage and next action sits in one CRM the whole team can see.",
  },
  {
    title: "Improvement becomes systematic",
    body: "Because every stage is measured, optimisation is a decision — not a hunch.",
  },
];

export function Outcomes() {
  return (
    <section id="outcomes" className="section-y bg-surface">
      <div className="container-page">
        <Reveal className="max-w-[760px]">
          <span className="eyebrow">Outcomes</span>
          <h2 className="h2-section mt-4">What changes once the system is running</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Not promises with numbers attached — structural changes to how acquisition works in your
            business.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {OUTCOMES.map((o) => (
            <Reveal key={o.title} className="rounded-[12px] border border-border bg-bg p-6">
              <div className="flex items-start gap-3">
                <Check size={18} className="mt-0.5 shrink-0 text-lime" />
                <div>
                  <h3 className="text-[16px] font-bold tracking-[-0.01em] text-fg">{o.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{o.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
