import { Check } from "lucide-react";
import portrait from "@/assets/akhil-portrait-4x5.jpg";
import { Reveal } from "./reveal";


const WORKS = [
  "AI-first growth systems strategist",
  "Client acquisition systems builder",
  "Funnel strategist",
  "Conversion-focused operator",
  "Technology + marketing systems thinker",
];

export function FounderSection() {
  return (
    <section id="founder" className="section-y band-raised">
      <div className="container-page">
        <div className="grid items-start gap-10 min-[900px]:grid-cols-[0.85fr_1.15fr] min-[900px]:gap-[56px]">
          <Reveal className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-3 blur-2xl sm:-inset-8"
              style={{
                backgroundImage:
                  "radial-gradient(320px 260px at 12% 8%, rgba(62,134,255,0.20), transparent 65%), radial-gradient(320px 260px at 88% 92%, rgba(131,226,78,0.16), transparent 65%)",
              }}
            />
            <div
              className="relative overflow-hidden rounded-[16px] border border-border-strong"
              style={{ boxShadow: "0 30px 70px -30px rgba(0,0,0,0.85)" }}
            >
              <div className="relative aspect-[4/5] w-full">
                <img
                  src={portrait}
                  alt="Akhil Srivastava, Founder of Growth Multiplier AI"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div

                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[56%]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, var(--surface) 0%, rgba(14,21,38,0.75) 40%, transparent 100%)",
                  }}
                />
                <span className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-border-strong bg-[rgba(7,11,20,0.6)] px-3 py-1.5 text-[12px] font-semibold md:text-[10.5px] tracking-[0.16em] text-fg uppercase backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden="true" />
                  Founder
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span
                    className="block h-[2px] w-9 bg-lime"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-[19px] font-bold tracking-[-0.015em] text-fg">
                    Akhil Srivastava
                  </p>
                  <p className="mt-1 text-[12.5px] text-muted">Founder, Growth Multiplier AI</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <span className="eyebrow">Founder-led</span>
            <h2 className="mt-4 text-[28px] leading-[1.15] font-extrabold tracking-[-0.025em] text-fg md:text-[38px]">
              Built By Someone Who Thinks In Systems.
            </h2>

            <blockquote
              className="mt-6 text-[17.5px] leading-relaxed font-medium text-fg"
              style={{ borderLeft: "2px solid var(--lime)", paddingLeft: "18px" }}
            >
              Growth Multiplier AI was built around a simple idea: businesses don't need another
              disconnected marketing service. They need a client acquisition system where every
              stage works together.
              <cite className="mt-4 block text-[12px] font-semibold md:text-[11px] tracking-[0.16em] text-muted-2 not-italic uppercase">
                Akhil Srivastava — Founder
              </cite>
            </blockquote>

            <div className="mt-8 border-t border-border pt-6">
              <p className="text-[12px] font-semibold md:text-[11px] tracking-[0.16em] text-muted-2 uppercase">
                How Akhil works
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {WORKS.map((w) => (
                  <li key={w} className="flex items-start gap-2.5 text-[14px] text-muted">
                    <Check size={16} className="mt-0.5 shrink-0 text-lime" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 text-[14.5px] leading-relaxed text-muted">
              Which is why an engagement starts with your funnel rather than our service list — and
              why Akhil runs the strategy call himself instead of routing it to a sales team.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Founder-led delivery", "Strategy-driven engagements"].map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-[12.5px] text-muted md:text-[11.5px]"
                >
                  {p}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
