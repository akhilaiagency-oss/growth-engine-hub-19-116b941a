import { Check, X } from "lucide-react";
import { Reveal } from "./reveal";

const FOR = [
  "You're already running paid traffic, or you're ready to start",
  "You sell something that involves a call, consultation or appointment",
  "You're getting leads but too few turn into real conversations",
  "Your follow-up depends on someone manually remembering to do it",
  "You want one connected system instead of five disconnected tools",
];

const NOT_FOR = [
  "You're looking for a one-off landing page with nothing behind it",
  "You want overnight results without changing how follow-up works",
  "You have no budget for traffic and aren't planning to have one",
  "You'd rather buy a guarantee than build a system",
  "You only want a vendor to take instructions, not a partner to challenge them",
];

export function WhoFor() {
  return (
    <section id="fit" className="section-y band-raised">
      <div className="container-page">
        <Reveal className="max-w-[760px]">
          <span className="eyebrow">Fit</span>
          <h2 className="h2-section mt-4">Who this call is for</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            This is a working session on a specific problem. It's genuinely useful for some
            businesses and a waste of time for others — here's the honest split.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Reveal className="card-surface p-6 md:p-7">
            <h3 className="text-[17px] font-bold tracking-[-0.01em] text-lime">
              This is for you if
            </h3>
            <ul className="mt-5 flex flex-col gap-3.5">
              {FOR.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-fg">
                  <Check size={17} className="mt-0.5 shrink-0 text-lime" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="card-surface p-6 md:p-7">
            <h3 className="text-[17px] font-bold tracking-[-0.01em] text-muted">
              This isn't for you if
            </h3>
            <ul className="mt-5 flex flex-col gap-3.5">
              {NOT_FOR.map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-3 text-[14.5px] leading-relaxed text-muted"
                >
                  <X size={17} className="mt-0.5 shrink-0 text-muted-2" />
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
