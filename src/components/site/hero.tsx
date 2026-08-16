import { Check } from "lucide-react";
import { BookCta } from "./book-cta";
import { VslSlot } from "./vsl-slot";
import { URGENCY } from "@/lib/urgency";
import { SessionsLeftBox, CountdownBox } from "./urgency-boxes";

const WANTS = [
  {
    title: "Generate more qualified leads",
    body: "Landing pages built around one action, so the click arrives with intent.",
  },
  {
    title: "Convert more leads into customers",
    body: "Qualification, CRM and nurturing working as one sequence rather than three tools.",
  },
  {
    title: "Stop losing leads",
    body: "WhatsApp, email and CRM automation so every enquiry gets a reply while interest is live.",
  },
  {
    title: "Scale without hiring",
    body: "Repetitive manual work replaced by workflows that don't forget or take a weekend off.",
  },
  {
    title: "Track every lead",
    body: "Know which stage each lead reached, with no guessing and no attribution arguments.",
  },
  {
    title: "Build predictable growth",
    body: "A measurable acquisition system instead of effort that resets every month.",
  },
];

const TRUST = [
  { title: "Founder-led", body: "Akhil runs every call" },
  { title: "Secure ₹9 checkout", body: "Processed by Razorpay" },
  { title: "Refundable", body: "On request, no reason needed" },
  { title: "No obligation", body: "A working session, not a pitch" },
  { title: "You keep the plan", body: "Whether we work together or not" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pt-[88px] pb-[44px] min-[900px]:pt-[112px]"
      style={{
        backgroundImage:
          "radial-gradient(800px 440px at 20% -10%, rgba(62,134,255,0.18), transparent 62%), radial-gradient(700px 420px at 84% 2%, rgba(131,226,78,0.10), transparent 58%)",
      }}
    >
      <div className="mx-auto w-full max-w-[1120px]">
        <div className="mx-auto max-w-[900px] text-center">
          <p className="text-[17px] leading-[1.35] font-bold text-fg min-[900px]:text-[20px]">
            Stop Losing Qualified Leads To <span className="text-lime">Slow Follow-Up</span> And{" "}
            <span className="text-lime">Broken Funnels</span>
          </p>
          <p className="mx-auto mt-2 max-w-[640px] text-[13px] text-muted min-[900px]:text-[15px]">
            For coaches, consultants and service businesses already running paid traffic — or about
            to start.
          </p>

          <h1 className="mt-4 text-[26px] leading-[1.1] font-extrabold tracking-[-0.025em] text-fg min-[900px]:text-[40px]">
            Turn More Clicks Into Paying Customers With One Connected{" "}
            <span className="text-electric-soft">Acquisition System</span>
          </h1>
        </div>

        <div className="mt-7 grid items-stretch gap-5 min-[980px]:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT — video + action block */}
          <div className="flex flex-col rounded-[14px] border border-border-strong bg-surface p-4">
            <VslSlot />

            <div className="mt-5 flex flex-col gap-3" style={{ marginTop: "auto" }}>
              <p className="flex flex-wrap items-baseline justify-center gap-x-2.5 gap-y-1 pt-5 text-center">
                <span className="text-[17px] text-muted-2 line-through">
                  ₹{URGENCY.originalPrice}
                </span>
                <span className="text-[34px] leading-none font-extrabold text-lime">
                  ₹{URGENCY.offerPrice}
                </span>
                <span className="text-[15px] text-muted">1-on-1 Strategy Session</span>
              </p>

              <BookCta fullWidth showPrice={false} />

              <div className="grid gap-3 min-[420px]:grid-cols-2">
                <SessionsLeftBox />
                <CountdownBox />
              </div>

              <p className="text-center text-[12px] text-muted-2">
                30 minutes, 1-on-1 with Akhil · Zoom or Google Meet
                <br />
                You keep the funnel plan whether or not we work together
              </p>
            </div>
          </div>

          {/* RIGHT — what this is built for */}
          <div className="rounded-[14px] border border-border-strong bg-surface p-6">
            <h2 className="text-[20px] leading-[1.2] font-bold tracking-[-0.02em] text-fg min-[900px]:text-[20px]">
              This system is built for businesses that want to…
            </h2>
            <ul className="mt-4">
              {WANTS.map((w, i) => (
                <li
                  key={w.title}
                  className={`flex items-start gap-3 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}
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
                    <span className="block text-[15px] font-bold text-fg">{w.title}</span>
                    <span className="mt-0.5 block text-[13px] text-muted">
                      {w.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust bar */}
        <ul className="mt-5 grid grid-cols-2 overflow-hidden rounded-[14px] border border-border min-[900px]:grid-cols-5">
          {TRUST.map((t, i) => (
            <li
              key={t.title}
              className={`px-4 py-4 text-center ${i % 2 === 1 ? "border-l border-border" : ""} ${
                i > 1 ? "border-t border-border" : ""
              } min-[900px]:border-t-0 ${
                i > 0 ? "min-[900px]:border-l min-[900px]:border-border" : "min-[900px]:border-l-0"
              }`}
            >
              <span className="block text-[13px] font-bold text-fg">{t.title}</span>
              <span className="mt-1 block text-[12px] text-muted-2">{t.body}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
