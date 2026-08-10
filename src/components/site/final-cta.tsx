import { Check } from "lucide-react";
import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";

const ITEMS = ["30–45 minutes, 1-on-1", "Secure Razorpay checkout", "You keep the plan either way"];

export function FinalCta() {
  return (
    <section id="get-started" className="section-y">
      <div className="container-page">
        <Reveal
          className="rounded-[16px] border border-border bg-surface px-6 py-12 text-center md:px-[72px] md:py-[72px]"
          // radial lime wash from the top
        >
          <div
            className="mx-auto max-w-[680px]"
            style={{
              backgroundImage:
                "radial-gradient(520px 220px at 50% -20%, rgba(131,226,78,0.14), transparent 70%)",
            }}
          >
            <span className="eyebrow">Get started</span>
            <h2 className="mt-4 text-[26px] leading-[1.15] font-extrabold tracking-[-0.025em] text-fg md:text-[34px]">
              Find out which stage is costing you the most.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">
              Book the ₹9 strategy call, pick a time that works, and walk away with your acquisition
              funnel mapped — leak by leak.
            </p>
            <div className="mt-8">
              <BookCta />
            </div>
            <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3">
              {ITEMS.map((t) => (
                <li key={t} className="flex items-center gap-2 text-[12.5px] text-muted">
                  <Check size={15} className="text-lime" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
