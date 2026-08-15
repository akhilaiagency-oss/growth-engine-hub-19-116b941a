import { Reveal } from "./reveal";

const DOCUMENTS = [
  {
    label: "Document 01",
    title: "The Landing Page Audit Checklist",
    body: "23 checks, run against a page before deciding whether to rebuild it or repair it. Covers the single-action test, the qualification gap, mobile CTA position, and the four things that quietly kill an enquiry form.",
  },
  {
    label: "Document 02",
    title: "The Follow-Up Speed Scorecard",
    body: "A one-page instrument for measuring how long your enquiries actually wait for a first reply — split across weekday, evening and weekend. Most owners guess in minutes. The scorecard gives you the real number, and what it costs at your current cost per lead.",
  },
  {
    label: "Document 03",
    title: "The Lead Qualification Question Bank",
    body: "42 questions across fit, problem, timing, authority and budget, for any business where the sale involves a call, consultation or appointment.",
  },
];

export function DeliverablesSection() {
  return (
    <section id="deliverables" className="section-y band-raised">
      <div className="container-page">
        <Reveal className="max-w-[820px]">
          <span className="eyebrow">Yours to keep</span>
          <h2 className="h2-section mt-4">
            Three working documents you keep, whether or not we work together.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Not lead magnets written to be downloaded and forgotten. These are the internal
            checklists we run before building any acquisition system. All three are sent the moment
            your session is confirmed.
          </p>
        </Reveal>

        <div className="mt-7 grid gap-5 min-[900px]:grid-cols-3">
          {DOCUMENTS.map((d) => (
            <Reveal
              key={d.label}
              className="border-l-2 border-lime bg-surface p-6"
              style={{ borderRadius: "0 12px 12px 0" }}
            >
              <span className="text-[12px] font-semibold tracking-[0.14em] text-muted-2 uppercase">
                {d.label}
              </span>
              <h3 className="mt-2 text-[16.5px] font-semibold text-fg">{d.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-muted">{d.body}</p>
            </Reveal>
          ))}
        </div>

        <p className="mt-5 flex items-start gap-2.5 text-[13.5px] leading-relaxed text-muted">
          <span aria-hidden="true" className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-lime" />
          Sent on confirmation. Nothing further is required from you to receive them.
        </p>
      </div>
    </section>
  );
}
