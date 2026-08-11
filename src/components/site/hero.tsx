import { BookCta } from "./book-cta";
import { CtaNote } from "./cta-note";
import { VslSlot } from "./vsl-slot";
import { PriceAnchor } from "./price-anchor";
import { SlotsLeft } from "./slots-left";
import { CountdownBlocks } from "./countdown-blocks";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pt-[132px] pb-[72px]"
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

        <div className="mx-auto mt-8 flex max-w-[520px] flex-col items-center gap-4 rounded-[16px] border border-border bg-[rgba(14,21,38,0.72)] px-6 py-5 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            <PriceAnchor size="lg" suffix="today" />
            <SlotsLeft />
          </div>
        </div>

        <div className="mt-10">
          <VslSlot />
        </div>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 min-[520px]:flex-row min-[520px]:items-center">
          <BookCta />
          <a href="#engine" className="btn-secondary">
            See How The System Works
          </a>
        </div>

        <div className="mx-auto mt-7 flex max-w-[460px] flex-col items-center gap-3 rounded-[16px] border border-border bg-[rgba(14,21,38,0.72)] px-6 py-5 backdrop-blur-sm">
          <CountdownBlocks />
          <p className="text-[12.5px] leading-relaxed text-muted-2">
            When the timer ends, the session returns to ₹99.
          </p>
        </div>

        <CtaNote className="mt-4" />



        <p className="mt-4 text-[12.5px] text-muted-2">
          30–45 minutes, 1-on-1 with Akhil · You keep the funnel plan whether or not we work
          together
        </p>
      </div>
    </section>
  );
}
