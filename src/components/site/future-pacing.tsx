import { Check } from "lucide-react";
import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";

const ITEMS = [
  "which traffic is producing genuine interest",
  "which landing pages actually convert",
  "which leads are qualified, and which aren't",
  "which prospects are reaching a booked appointment",
  "where follow-up is breaking down",
  "which part of the funnel deserves attention next",
];

export function FuturePacing() {
  return (
    <section id="what-changes" className="section-y bg-surface">
      <div className="container-narrow">
        <Reveal>
          <span className="eyebrow">What changes</span>
          <h2 className="h2-section mt-4">
            Imagine knowing exactly where your acquisition is leaking.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Imagine opening your acquisition reporting and seeing more than clicks and form fills.
          </p>
        </Reveal>

        <Reveal>
          <ul className="mt-8 grid gap-3.5 md:grid-cols-2">
            {ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[15px] text-muted">
                <Check size={16} className="mt-0.5 shrink-0 text-lime" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-12">
          <p className="mx-auto max-w-[640px] text-center text-[17px] leading-relaxed font-medium text-fg">
            That's the kind of acquisition visibility the Growth Multiplier Engine™ is designed to
            build.
          </p>
        </Reveal>

        <Reveal className="mt-8 flex justify-center">
          <BookCta />
        </Reveal>
      </div>
    </section>
  );
}
