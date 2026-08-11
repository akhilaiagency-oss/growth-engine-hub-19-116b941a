import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";

export function AlreadyPaying() {
  return (
    <section id="already-paying" className="section-y">
      <div className="container-narrow">
        <Reveal>
          <span className="eyebrow">Why solve this now</span>
          <h2 className="h2-section mt-4">You're already paying for the traffic.</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Every click represents an acquisition cost you have already committed. If the landing
            page, the qualification, the follow-up and the booking process aren't working together,
            part of that investment can disappear before a sales conversation ever happens.
          </p>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Your acquisition system is already producing signals. The question is whether those
            signals are being converted, qualified, followed up and turned into conversations — or
            quietly lost between stages.
          </p>
        </Reveal>

        <Reveal className="mt-8 rounded-[12px] border border-border bg-surface p-6">
          <p
            className="text-[17px] leading-relaxed font-semibold text-fg"
            style={{ borderLeft: "2px solid var(--lime)", paddingLeft: "18px" }}
          >
            Before increasing your ad budget, it's worth finding where the existing funnel is
            leaking.
          </p>
        </Reveal>

        <Reveal className="mt-8 flex justify-center">
          <BookCta label="Find My Acquisition Gaps" />
        </Reveal>
      </div>
    </section>
  );
}
