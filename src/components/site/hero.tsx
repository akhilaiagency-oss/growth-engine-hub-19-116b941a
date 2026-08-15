import { BookCta } from "./book-cta";
import { VslSlot } from "./vsl-slot";
import { URGENCY } from "@/lib/urgency";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pt-[88px] pb-[36px] min-[900px]:pt-[112px]"
      style={{
        backgroundImage:
          "radial-gradient(800px 440px at 20% -10%, rgba(62,134,255,0.18), transparent 62%), radial-gradient(700px 420px at 84% 2%, rgba(131,226,78,0.10), transparent 58%)",
      }}
    >
      <div className="mx-auto max-w-[840px] text-center">
        <p className="mx-auto max-w-[820px] text-[17px] font-bold leading-[1.35] text-fg min-[900px]:text-[20px]">
          Stop Losing Qualified Leads To <span className="text-lime">Slow Follow-Up</span> And{" "}
          <span className="text-lime">Broken Funnels</span>
        </p>

        <h1 className="mt-4 text-[26px] leading-[1.1] font-extrabold tracking-[-0.025em] text-fg min-[900px]:text-[44px]">
          Turn More Clicks Into Paying Customers With One Connected{" "}
          <span className="text-electric-soft">Acquisition System</span>
        </h1>

        <div className="mt-[26px]">
          <VslSlot />
        </div>

        <div className="mt-[22px] flex justify-center">
          <span
            className="inline-flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 rounded-[10px] text-[15px] font-bold text-lime min-[900px]:text-[18px]"
            style={{
              background: "rgba(131,226,78,0.1)",
              border: "1px solid rgba(131,226,78,0.35)",
              padding: "10px 18px",
            }}
          >
            <span className="text-[14px] font-semibold text-muted-2 line-through">
              ₹{URGENCY.originalPrice}
            </span>
            <span>₹{URGENCY.offerPrice}</span>
            <span>· 1-on-1 AI Growth Strategy Session</span>
          </span>
        </div>

        <div className="mt-[18px] flex flex-col items-stretch justify-center gap-[10px] min-[520px]:flex-row min-[520px]:items-center min-[520px]:gap-3">
          <BookCta fullWidth className="min-[520px]:w-auto" />
          <a href="#engine" className="btn-secondary">
            See How It Works
          </a>
        </div>

        <p className="mx-auto mt-4 max-w-[520px] text-[12.5px] leading-relaxed text-muted-2 min-[900px]:text-[13px]">
          30–45 minutes, 1-on-1 with Akhil · You keep the funnel plan either way
        </p>
      </div>
    </section>
  );
}
