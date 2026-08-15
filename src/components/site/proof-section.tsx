import { FileText, LineChart, BookOpen, Info } from "lucide-react";
import { Reveal } from "./reveal";

const CHAIN = ["Traffic", "Lead", "Qualified", "Booked", "Showed", "Opportunity", "Revenue"];

const CARDS = [
  {
    Icon: FileText,
    title: "Client case studies",
    body: "Not published yet. Verified results appear here as engagements complete, with real numbers and named permission — or not at all.",
  },
  {
    Icon: LineChart,
    title: "Live tracking dashboard",
    body: "In build. Client-facing funnel reporting is part of the system itself; a preview of the real interface will live here.",
  },
  {
    Icon: BookOpen,
    title: "The method, in the open",
    body: "What we can show you is the thinking. The Leak Map and the seven stages above aren't a teaser for a framework — they are the framework, published in full.",
  },
];

function MeasurementChain() {
  return (
    <figure>
      <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-lime">
        How we measure — every build is instrumented against this chain
      </p>
      <ol
        aria-label="The seven measured stages, from traffic to revenue"
        className="mt-4 grid grid-cols-1 gap-2 min-[900px]:grid-cols-7 min-[900px]:gap-0"
      >
        {CHAIN.map((stage, i) => {
          const last = i === CHAIN.length - 1;
          const first = i === 0;
          return (
            <li
              key={stage}
              className="border border-border bg-surface-2 px-3 py-3 text-center min-[900px]:border-l-0 min-[900px]:first:border-l"
              style={{
                borderRadius: first ? "8px 8px 0 0" : last ? "0 0 8px 8px" : undefined,
                ...(last
                  ? { background: "rgba(131,226,78,0.07)", borderColor: "rgba(131,226,78,0.35)" }
                  : null),
              }}
            >
              <span
                className={`block text-[11.5px] font-semibold uppercase tracking-[0.09em] ${
                  last ? "text-lime" : "text-fg"
                }`}
              >
                {stage}
              </span>
              <span className="mt-1 block text-[10px] text-muted-2">
                Stage {String(i + 1).padStart(2, "0")}
              </span>
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-4 text-center text-[13px] leading-relaxed text-muted">
        Every stage is tracked separately, so a drop can be located rather than guessed at.
      </figcaption>
    </figure>
  );
}

export function ProofSection() {
  return (
    <section id="proof" className="section-y band-base">
      <div className="container-page">
        <Reveal className="max-w-[760px]">
          <span className="eyebrow">Proof &amp; evidence</span>
          <h2 className="h2-section mt-4">What we can show you today — and what we can't yet</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Growth Multiplier AI is early. We'd rather say that plainly than borrow credibility we
            haven't earned.
          </p>
        </Reveal>

        <Reveal className="mt-8 rounded-[12px] border border-border bg-surface p-6">
          <MeasurementChain />
        </Reveal>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {CARDS.map(({ Icon, title, body }) => (
            <Reveal key={title} className="rounded-[12px] border border-border bg-surface p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-dashed border-border-strong text-muted-2">
                <Icon size={18} />
              </span>
              <h3 className="mt-4 text-[16px] font-bold tracking-[-0.01em] text-fg">{title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6 flex items-start gap-3 rounded-[12px] border border-border bg-surface p-6">
          <Info size={18} className="mt-0.5 shrink-0 text-lime" />
          <p className="text-[14.5px] leading-relaxed text-muted">
            <strong className="font-semibold text-fg">
              No invented testimonials. No borrowed client logos. No round numbers pulled from
              nowhere.
            </strong>{" "}
            If a business is willing to show you fake proof before you've paid them anything, it
            tells you what they'll do once you have. Ask on the call for a straight account of
            exactly where we are.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
