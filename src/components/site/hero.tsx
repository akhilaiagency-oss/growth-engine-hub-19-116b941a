import { BookCta } from "./book-cta";
import { CtaNote } from "./cta-note";
import { VslSlot } from "./vsl-slot";
import { AcquisitionFlow } from "./acquisition-flow";
import { URGENCY } from "@/lib/urgency";

const FACTS = ["30–45 minutes, 1-on-1 with Akhil", "You keep the funnel plan either way"];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pt-[40px] pb-[52px] min-[900px]:pt-[112px]"
      style={{
        backgroundImage:
          "radial-gradient(800px 440px at 20% -10%, rgba(62,134,255,0.18), transparent 62%), radial-gradient(700px 420px at 84% 2%, rgba(131,226,78,0.10), transparent 58%)",
      }}
    >
      {/*
       * DOM order stays logical for screen readers and SEO.
       * Below 900px, CSS `order` moves the VSL + offer + CTAs above the flow strip.
       */}
      <div className="mx-auto flex max-w-[840px] flex-col text-center">
        <p className="order-1 mx-auto max-w-[820px] text-[17px] font-bold leading-[1.35] text-fg min-[900px]:text-[20px]">
          Stop Losing Qualified Leads To <span className="text-lime">Slow Follow-Up</span> And{" "}
          <span className="text-lime">Broken Funnels</span>
        </p>

        <h1 className="order-2 mt-5 text-[26px] leading-[1.12] font-extrabold tracking-[-0.025em] text-fg min-[900px]:mt-6 min-[900px]:text-[52px] min-[900px]:leading-[1.08]">
          Turn More Clicks Into Paying Customers With One Connected{" "}
          <span className="text-electric-soft">Acquisition System</span>
        </h1>

        <AcquisitionFlow className="order-6 mt-7 min-[900px]:order-3 min-[900px]:mt-8" />

        <div className="order-4 mt-6 flex justify-center min-[900px]:order-4 min-[900px]:mt-8">
          <span
            className="inline-flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 rounded-[10px] text-[18px] font-bold text-lime"
            style={{
              background: "rgba(131,226,78,0.1)",
              border: "1px solid rgba(131,226,78,0.35)",
              padding: "13px 22px",
            }}
          >
            <span className="text-[14px] font-semibold text-muted-2 line-through">
              ₹{URGENCY.originalPrice}
            </span>
            <span>₹{URGENCY.offerPrice}</span>
            <span>· 1-on-1 AI Growth Strategy Session</span>
          </span>
        </div>

        <ul className="order-7 mt-6 flex flex-col items-center justify-center gap-3 text-[13.5px] text-muted min-[620px]:flex-row min-[620px]:gap-10 min-[900px]:order-5">
          {FACTS.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>

        <div className="order-5 mt-4 flex flex-col items-stretch justify-center gap-3 min-[520px]:flex-row min-[520px]:items-center min-[900px]:order-6 min-[900px]:mt-8">
          <BookCta />
          <a href="#engine" className="btn-secondary">
            See How It Works
          </a>
        </div>

        <CtaNote className="order-5 mt-4 min-[900px]:order-7" />

        <div className="order-3 mt-6 min-[900px]:order-8 min-[900px]:mt-10">
          <VslSlot />
        </div>
      </div>
    </section>
  );
}
