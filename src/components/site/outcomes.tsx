import { Check } from "lucide-react";
import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";

const OUTCOMES = [
  {
    title: "Your calendar fills with qualified opportunities",
    body: "Fewer conversations, better ones. Your team spends its hours on buyers who actually match your criteria.",
  },
  {
    title: "Every enquiry gets a reply in seconds",
    body: "Follow-up runs on a Tuesday morning and a Sunday night alike, without depending on anyone remembering.",
  },
  {
    title: "You can see the whole pipeline in one place",
    body: "Every lead, stage and next action sits in the CRM instead of across inboxes, phones and someone's memory.",
  },
  {
    title: "Ad spend becomes accountable",
    body: "You can point at the stage where the money stops working, and decide what to change on evidence.",
  },
  {
    title: "Booked appointments become the metric",
    body: "Lead count stops being the number you report and starts being the number you diagnose.",
  },
  {
    title: "Improvement stops being guesswork",
    body: "When every stage is measured, the next change is a decision rather than an opinion.",
  },
];

const VISIBILITY_ITEMS = [
  "which traffic is producing genuine interest",
  "which landing pages actually convert",
  "which leads are qualified, and which aren't",
  "which prospects are reaching a booked appointment",
  "where follow-up is breaking down",
  "which part of the funnel deserves attention next",
];

export function Outcomes() {
  return (
    <section id="outcomes" className="section-y band-raised">
      <div className="container-page">
        <Reveal className="max-w-[760px]">
          <span className="eyebrow">Outcomes</span>
          <h2 className="h2-section mt-4">What changes once the system is running</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            No numbers attached — we haven't earned the right to quote any yet. These are the
            structural changes to how acquisition works in your business.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
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

        <Reveal className="mt-6 rounded-[12px] border border-border bg-bg p-6 md:p-7">
          <h3 className="text-[17px] font-bold tracking-[-0.01em] text-fg">
            Imagine opening your reporting and seeing more than clicks and form fills
          </h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {VISIBILITY_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-muted">
                <Check size={15} className="mt-0.5 shrink-0 text-lime" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-8 flex justify-center">
          <BookCta />
        </Reveal>
      </div>
    </section>
  );
}
