import { Reveal } from "./reveal";
import { FileText } from "lucide-react";
import brandLogo from "@/assets/growth-multiplier-ai-logo.png";

const DOCUMENTS = [
  {
    label: "Document 01",
    title: "The Landing Page Audit Checklist",
    body: "25 checks for deciding whether to rebuild a page or repair it — the single-action test, the qualification gap, mobile CTA position, and the four things that quietly kill an enquiry form.",
  },
  {
    label: "Document 02",
    title: 'The "What To Say On A Sales Call" Cheat Sheet',
    body: "The exact structure for a first call: how to open, what to ask before you pitch anything, how to handle price when it comes up early, and what to say when someone goes quiet.",
  },
  {
    label: "Document 03",
    title: 'The "Why Leads Don\'t Convert" Checklist',
    body: "The 12 places an interested enquiry quietly dies between the form and the sale, and the one-line fix for each, in the order worth fixing them.",
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
          <p className="mt-4 text-[17px] text-muted">
            Not lead magnets written to be downloaded and forgotten. These are the internal
            checklists we run before building any acquisition system. All three are sent the moment
            your session is confirmed.
          </p>
        </Reveal>

        <div className="mt-6 grid gap-5 min-[900px]:grid-cols-3">
          {DOCUMENTS.map((d) => (
            <Reveal
              key={d.label}
              className="overflow-hidden border-l-2 border-lime bg-surface p-6"
              style={{ borderRadius: "0 12px 12px 0" }}
            >
              <div
                className="flex min-h-[156px] flex-col items-center justify-center gap-3 rounded-[8px] border border-dashed border-border-strong bg-surface-2 px-4 py-5 text-center"
                aria-label={`${d.title}: actual document preview unavailable`}
              >
                <img
                  src={brandLogo}
                  alt="Growth Multiplier AI"
                  className="h-8 w-auto object-contain"
                />
                <FileText size={23} className="text-muted" aria-hidden="true" />
                <span className="text-[12px] font-semibold text-muted">
                  Actual document preview unavailable
                </span>
              </div>
              <span className="text-[12px] font-semibold tracking-[0.14em] text-muted-2 uppercase">
                {d.label}
              </span>
              <h3 className="mt-2 text-[17px] font-semibold text-fg">{d.title}</h3>
              <p className="mt-2 text-[15px] text-muted">{d.body}</p>
            </Reveal>
          ))}
        </div>

        <p className="mt-5 flex items-start gap-2.5 text-[13px] text-muted">
          <span aria-hidden="true" className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-lime" />
          Sent on confirmation. Nothing further is required from you to receive them.
        </p>
      </div>
    </section>
  );
}
