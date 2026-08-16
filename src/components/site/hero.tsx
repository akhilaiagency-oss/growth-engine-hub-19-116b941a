import { Check } from "lucide-react";
import { BookCta } from "./book-cta";
import { VslSlot } from "./vsl-slot";
import { URGENCY } from "@/lib/urgency";
import { SessionsLeftBox, CountdownBox } from "./urgency-boxes";
import { RefundNote } from "./refund-note";

const WANTS = [
  {
    title: "Generate more qualified leads",
    body: "Landing pages built around one action, so the click arrives with intent.",
  },
  {
    title: "Convert more leads into customers",
    body: "Qualification, CRM and nurturing as one sequence, not three tools.",
  },
  {
    title: "Stop losing leads",
    body: "WhatsApp, email and CRM automation so every enquiry gets a reply while interest is live.",
  },
  {
    title: "Scale without hiring",
    body: "Manual work replaced by workflows that don't forget or take a weekend off.",
  },
  {
    title: "Track every lead",
    body: "Know which stage each lead reached — no guessing, no attribution arguments.",
  },
  {
    title: "Build predictable growth",
    body: "A measurable system instead of effort that resets every month.",
  },
];

const TRUST = [
  { title: "Founder-led", body: "Akhil runs every call" },
  { title: "Secure ₹9 checkout", body: "Processed by Razorpay" },
  { title: "English or Hindi", body: "Whichever you're comfortable in" },
  { title: "No obligation", body: "A working session, not a pitch" },
  { title: "You keep the plan", body: "Whether we work together or not" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pt-5 pb-[44px] min-[900px]:px-5 min-[900px]:pt-[112px]"
      style={{
        backgroundImage:
          "radial-gradient(800px 440px at 20% -10%, rgba(62,134,255,0.18), transparent 62%), radial-gradient(700px 420px at 84% 2%, rgba(131,226,78,0.10), transparent 58%)",
      }}
    >
      <div className="mx-auto w-full max-w-[1120px] min-[900px]:max-w-[1240px]">
        <div className="mx-auto max-w-[900px] text-center">
          <p className="text-[17px] leading-[1.35] font-bold text-fg max-[420px]:text-[16px] min-[900px]:text-[20px]">
            Stop Losing Qualified Leads To <span className="text-lime">Slow Follow-Up</span> And{" "}
            <span className="text-lime">Broken Funnels</span>
          </p>
          <p className="mx-auto mt-2 max-w-[640px] text-[13px] text-muted min-[900px]:text-[15px]">
            For business owners doing{" "}
            <strong className="font-semibold text-fg">₹10L+ a year</strong> — real estate, coaching,
            consulting, e-commerce, info products, or offline moving online.
          </p>

          <h1 className="mt-4 text-[26px] leading-[1.16] font-extrabold tracking-[-0.025em] text-fg max-[420px]:text-[24px] min-[900px]:text-[40px] min-[900px]:leading-[1.1]">
            Turn More Clicks Into Paying Customers With One Connected{" "}
            <span className="text-electric-soft">Acquisition System</span>
          </h1>
        </div>

        <div className="mt-5 grid items-stretch gap-5 min-[900px]:mt-8 min-[900px]:gap-8 min-[900px]:grid-cols-[1.25fr_0.75fr] min-[1061px]:grid-cols-[1.4fr_0.6fr]">
          {/* LEFT — video + action block */}
          <div className="-mx-6 flex flex-col border-y border-border-strong bg-surface px-2 pt-2 min-[900px]:mx-0 min-[900px]:rounded-[14px] min-[900px]:border min-[900px]:p-[14px]">
            <VslSlot />

            <div className="mt-auto flex flex-col gap-3 px-4 pt-5 pb-4 min-[900px]:px-0 min-[900px]:pt-[18px] min-[900px]:pb-0">
              <p className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-center">
                <span className="text-[17px] text-muted-2 line-through">
                  ₹{URGENCY.originalPrice}
                </span>
                <span className="text-[34px] leading-none font-extrabold text-lime">
                  ₹{URGENCY.offerPrice}
                </span>
                <span className="text-[15px] text-muted">1-on-1 Strategy Session</span>
              </p>

              <BookCta
                fullWidth
                showPrice={false}
                className="min-h-[52px] text-[17px] min-[900px]:min-h-0 min-[900px]:text-[15px]"
              />
              <RefundNote className="!mt-0" />

              <div className="grid gap-3 min-[900px]:grid-cols-2">
                <SessionsLeftBox />
                <CountdownBox />
              </div>

              <p className="text-center text-[12px] text-muted-2">
                30 minutes with Akhil — less than one site visit.{" "}
                <strong className="font-bold text-fg">No pitch.</strong>
                <br />
                You keep the funnel plan whether or not we work together
              </p>
            </div>
          </div>

          {/* RIGHT — what this is built for */}
          <div className="flex flex-col rounded-[14px] border border-border-strong bg-surface p-5 min-[900px]:p-[22px]">
            <h2 className="mb-4 text-[17px] leading-[1.25] font-bold tracking-[-0.02em] text-fg min-[900px]:text-[20px]">
              What 30 minutes with Akhil actually gets you
            </h2>
            <ul>
              {WANTS.map((w, i) => (
                <li
                  key={w.title}
                  className={`grid grid-cols-[22px_1fr] gap-3 py-3 min-[900px]:py-[11px] ${
                    i < WANTS.length - 1 ? "border-b border-border" : "pb-0"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full text-lime"
                    style={{
                      border: "1px solid rgba(131,226,78,0.45)",
                      background: "rgba(131,226,78,0.10)",
                    }}
                  >
                    <Check size={12} />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-fg">{w.title}</span>
                    <span className="mt-0.5 block text-[13px] leading-[1.5] text-muted">
                      {w.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust bar */}
        <ul className="mt-5 grid grid-cols-1 overflow-hidden rounded-[14px] border border-border min-[421px]:grid-cols-2 min-[900px]:grid-cols-5">
          {TRUST.map((t, i) => (
            <li
              key={t.title}
              className={`border-b border-border px-4 py-4 text-center min-[900px]:border-b-0 ${
                i % 2 === 1 ? "min-[421px]:border-l min-[421px]:border-border" : ""
              } ${i === TRUST.length - 1 ? "min-[421px]:col-span-2 min-[900px]:col-span-1 border-b-0" : ""} ${
                i > 0 ? "min-[900px]:border-l min-[900px]:border-border" : "min-[900px]:border-l-0"
              }`}
            >
              <span className="block text-[14px] font-bold text-fg min-[900px]:text-[13px]">
                {t.title}
              </span>
              <span className="mt-1 block text-[12px] text-muted-2">{t.body}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
