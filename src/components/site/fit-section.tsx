import { Check, X } from "lucide-react";
import { Reveal } from "./reveal";

const FOR = [
  'Your agency\'s answer to "why aren\'t these closing?" is to raise the budget',
  "Your cost per lead keeps climbing and nobody can tell you why",
  "Enquiries sit in WhatsApp until someone remembers to reply",
  "Your team spends its best hours on people who were never going to buy",
  "You have five tools that each work, and none of them talk to each other",
];

const NOT_FOR = [
  "You want a landing page built and nothing behind it",
  "You want results without changing how follow-up works",
  "You aren't running paid traffic yet and have no budget to start",
  "You'd rather buy a guarantee than build a system",
  "You want someone to take instructions, not challenge them",
];

export function FitSection() {
  return (
    <section id="fit" className="section-y band-base">
      <div className="container-page">
        <Reveal className="max-w-[760px]">
          <span className="eyebrow">Fit</span>
          <h2 className="h2-section mt-4">Which of these is a yes for you?</h2>
          <p className="mt-4 max-w-[700px] text-[17px] text-muted">
            You're already spending money on ads or portals — and sending that traffic to a WhatsApp
            number, a dead Instagram bio link, or a page that captures nothing and converts no one.
            This call is about the part that comes after the click.
          </p>
        </Reveal>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Reveal className="rounded-[12px] border border-border bg-surface p-6 md:p-6">
            <h3 className="text-[17px] font-bold tracking-[-0.01em] text-lime">
              This call is for you if
            </h3>
            <ul className="mt-5 flex flex-col gap-4">
              {FOR.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] text-fg">
                  <Check size={17} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="rounded-[12px] border border-border bg-surface p-6 md:p-6">
            <h3 className="text-[17px] font-bold tracking-[-0.01em] text-muted">
              This call isn't for you if
            </h3>
            <ul className="mt-5 flex flex-col gap-4">
              {NOT_FOR.map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-3 text-[15px] text-muted"
                >
                  <X size={17} className="mt-0.5 shrink-0 text-muted-2" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
