import { BookCta } from "./book-cta";
import { CtaNote } from "./cta-note";
import { VslSlot } from "./vsl-slot";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pt-[168px] pb-[72px]"
      style={{
        backgroundImage:
          "radial-gradient(800px 440px at 20% -10%, rgba(62,134,255,0.18), transparent 62%), radial-gradient(700px 420px at 84% 2%, rgba(131,226,78,0.10), transparent 58%)",
      }}
    >
      <div className="mx-auto max-w-[840px] text-center">
        <span className="eyebrow-pill">AI-Powered Client Acquisition Systems</span>

        <h1 className="mt-6 text-[31px] leading-[1.08] font-extrabold tracking-[-0.025em] text-fg md:text-[52px]">
          Turn Ad Traffic Into <span className="text-electric-soft">Qualified Opportunities</span> —
          Not Just Leads.
        </h1>

        <p className="mx-auto mt-5 max-w-[660px] text-[17px] leading-relaxed text-muted">
          We connect your landing pages, lead qualification, follow-up and booking into one
          acquisition system — so the traffic you're already paying for turns into booked
          appointments.
        </p>

        <div className="mt-10">
          <VslSlot />
        </div>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 min-[520px]:flex-row min-[520px]:items-center">
          <BookCta />
          <a href="#engine" className="btn-secondary">
            See How The System Works
          </a>
        </div>

        <CtaNote className="mt-3" />


        <p className="mt-4 text-[12.5px] text-muted-2">
          30–45 minutes, 1-on-1 with Akhil · You keep the funnel plan whether or not we work
          together
        </p>
      </div>
    </section>
  );
}
