import { BookCta } from "./book-cta";
import { CtaNote } from "./cta-note";
import { VslSlot } from "./vsl-slot";
import { AcquisitionFlow } from "./acquisition-flow";
import { URGENCY } from "@/lib/urgency";

const FACTS = ["⏱ 30–45 minutes, 1-on-1 with Akhil", "📋 You keep the funnel plan either way"];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pt-[112px] pb-[52px]"
      style={{
        backgroundImage:
          "radial-gradient(800px 440px at 20% -10%, rgba(62,134,255,0.18), transparent 62%), radial-gradient(700px 420px at 84% 2%, rgba(131,226,78,0.10), transparent 58%)",
      }}
    >
      <div className="mx-auto max-w-[840px] text-center">
        <p className="mx-auto max-w-[820px] text-[20px] font-bold leading-[1.35] text-fg">
          Stop Losing Qualified Leads To <span className="text-lime">Slow Follow-Up</span> And{" "}
          <span className="text-lime">Broken Funnels</span>
        </p>

        <h1 className="mt-6 text-[31px] leading-[1.08] font-extrabold tracking-[-0.025em] text-fg md:text-[52px]">
          Turn More Clicks Into Paying Customers With One Connected{" "}
          <span className="text-electric-soft">Acquisition System</span>
        </h1>

        <AcquisitionFlow />

        <div className="mt-8 flex justify-center">
          <span
            className="inline-flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 rounded-[10px] text-[18px] font-bold text-lime"
            style={{
              background: "rgba(131,226,78,0.1)",
              border: "1px solid rgba(131,226,78,0.35)",
              padding: "13px 22px",
            }}
          >
            <span aria-hidden="true">🗓</span>
            <span className="text-[14px] font-semibold text-muted-2 line-through">
              ₹{URGENCY.originalPrice}
            </span>
            <span>₹{URGENCY.offerPrice}</span>
            <span>· 1-on-1 AI Growth Strategy Session</span>
          </span>
        </div>

        <ul className="mt-6 flex flex-col items-center justify-center gap-3 text-[13.5px] text-muted min-[620px]:flex-row min-[620px]:gap-10">
          {FACTS.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 min-[520px]:flex-row min-[520px]:items-center">
          <BookCta />
          <a href="#engine" className="btn-secondary">
            See How It Works
          </a>
        </div>

        <CtaNote className="mt-4" />

        <div className="mt-10">
          <VslSlot />
        </div>
      </div>
    </section>
  );
}
