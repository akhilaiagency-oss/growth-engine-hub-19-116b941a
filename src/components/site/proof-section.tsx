import { FileText, LineChart, BookOpen, Info, ChevronRight } from "lucide-react";
import { Reveal } from "./reveal";

const CHAIN = [
  "Traffic",
  "Lead",
  "Qualified",
  "Booked",
  "Showed",
  "Opportunity",
  "Revenue",
];


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

        <div className="mt-8 grid gap-5 md:grid-cols-3">
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

        <Reveal className="mt-6 rounded-[12px] border border-border bg-surface p-6">
          <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-fg">
            Built to be measured
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            Proof of results will live here as engagements complete. In the meantime, here is the
            chain every Growth Multiplier AI build is instrumented against.
          </p>
          <ul className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2.5">
            {CHAIN.map((stage, i) => (
              <li key={stage} className="flex items-center gap-2">
                <span className="rounded-[10px] border border-border bg-surface-2 px-3 py-1.5 text-[12.5px] text-muted">
                  {stage}
                </span>
                {i < CHAIN.length - 1 && (
                  <ChevronRight
                    size={14}
                    aria-hidden="true"
                    className="shrink-0 text-cyan opacity-40"
                  />
                )}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[12.5px] leading-relaxed text-muted-2">
            Every stage is tracked separately, so a drop can be located rather than guessed at.
          </p>
        </Reveal>

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
