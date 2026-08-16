import { Check, ShieldCheck } from "lucide-react";
import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";
import { CtaNote } from "./cta-note";
import { PriceAnchor } from "./price-anchor";
import { ValueStack } from "./value-stack";
import { AfterYouPay } from "./after-you-pay";
import { SessionGetCard, SessionWontCard } from "./session-expectations";

const VALUE_POINTS = [
  "Acquisition funnel diagnosis",
  "Conversion bottleneck review",
  "Priority action plan",
];


const CHECKPOINTS = [
  {
    n: "01",
    stage: "Landing page",
    body: "What it asks visitors to do, and what competes with it",
  },
  { n: "02", stage: "Offer", body: "Whether the promise matches what the traffic expected" },
  { n: "03", stage: "CTA", body: "Whether there is exactly one next step, or several competing" },
  {
    n: "04",
    stage: "Lead capture",
    body: "What you ask for, and what it costs you in completions",
  },
  {
    n: "05",
    stage: "Qualification",
    body: "Whether anything sorts a serious buyer from a browser",
  },
  { n: "06", stage: "Follow-up", body: "How long an enquiry actually waits for a human reply" },
  {
    n: "07",
    stage: "Booking",
    body: "How interest becomes a confirmed appointment, and where it snags",
  },
];

const DETAILS = [
  "30 minutes, 1-on-1 with Akhil",
  "Zoom or Google Meet",
  "English or Hindi",
  "You keep the plan whether or not we work together",
];

function DiagnosticStack() {
  return (
    <ol className="relative flex flex-col gap-2 pl-[12px]">
      <span
        aria-hidden="true"
        className="absolute top-[14px] bottom-[14px] left-0 w-[2px] rounded-[2px]"
        style={{ backgroundImage: "linear-gradient(180deg, var(--lime), rgba(131,226,78,0.15))" }}
      />
      {CHECKPOINTS.map((c) => (
        <li key={c.n} className="min-w-0">
          <div
            className="grid grid-cols-[28px_1fr] items-start gap-[10px] rounded-[10px] border border-border bg-surface-2 min-[620px]:grid-cols-[30px_152px_1fr] min-[620px]:gap-3"
            style={{ padding: "12px 16px" }}
          >
            <span className="text-[13px] font-bold text-lime">{c.n}</span>
            <h3 className="min-w-0 text-[13px] font-semibold tracking-[0.1em] text-fg uppercase">
              {c.stage}
            </h3>
            <p className="col-span-2 min-w-0 text-[15px] text-muted min-[620px]:col-span-1">
              {c.body}
            </p>
          </div>
        </li>
      ))}
    </ol>

  );
}

export function SessionSection() {
  return (
    <section
      id="session"
      className="section-y band-base"
      style={{
        backgroundImage:
          "radial-gradient(680px 300px at 50% 0%, rgba(131,226,78,0.10), transparent 70%)",
      }}
    >
      <div className="container-page">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <span className="eyebrow">The offer</span>
          <h2 className="h2-section mt-4">What we review on your ₹9 strategy call</h2>
          <p className="mt-4 text-[17px] text-muted">
            We walk your acquisition funnel stage by stage — the same seven checkpoints the Engine
            is built on.
          </p>
          <ul className="mt-5 flex flex-col items-center gap-2.5 min-[620px]:flex-row min-[620px]:justify-center min-[620px]:gap-6">
            {VALUE_POINTS.map((v) => (
              <li key={v} className="flex items-center gap-2 text-[13px] text-muted">
                <Check size={15} className="shrink-0 text-lime" aria-hidden="true" />
                {v}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-8 grid items-start gap-6 min-[980px]:mt-8 min-[980px]:grid-cols-[1.15fr_0.85fr] min-[980px]:gap-8">
          <div className="flex flex-col gap-5">
            <Reveal>
              <DiagnosticStack />
            </Reveal>
            <Reveal>
              <SessionGetCard />
            </Reveal>
            <Reveal>
              <SessionWontCard />
            </Reveal>
          </div>

          {/* Value stack + commitment card */}
          <div className="min-[980px]:self-stretch">
            <div className="flex flex-col gap-6 min-[980px]:sticky min-[980px]:top-[96px]">
            <Reveal>
              <ValueStack />
            </Reveal>

            <Reveal className="overflow-hidden rounded-[16px] border border-border-strong bg-surface">

            <div className="h-[2px] w-full bg-lime" />
            <div className="p-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <PriceAnchor size="lg" suffix="" />
                <span className="text-[13px] text-muted md:text-[12px]">
                  1:1 Growth Strategy Session
                </span>
              </div>
              <p className="mt-1.5 text-[12px] text-muted-2">Today's rate. Standard price ₹99.</p>

              <div className="my-6 h-px w-full bg-border" />

              <p className="border-l-2 border-lime pl-4 text-[17px] font-semibold text-fg">
                ₹9 isn't the price of the strategy. It's a small commitment to reserve your session.
              </p>

              <p className="mt-5 text-[15px] text-muted">
                A paid step — however small — means the calendar goes to people who are genuinely
                working on this problem. It keeps the session focused, and it means Akhil arrives
                having looked at your business rather than running a generic call.
              </p>

              <div className="my-6 h-px w-full bg-border" />

              <p className="text-[15px] font-semibold text-fg">Low commitment. High clarity.</p>
              <p className="mt-2 text-[15px] text-muted">
                The ₹9 reserves your session. The goal isn't to sell you a predetermined package —
                it's to understand your acquisition system, identify the biggest bottleneck, and
                work out whether Growth Multiplier AI is genuinely a fit.
              </p>

              <p className="mt-5 text-[15px] font-semibold text-fg">
                If we're not the right fit, we'll tell you.
              </p>

              <p className="mt-6 text-[12px] font-semibold tracking-[0.14em] text-muted-2 uppercase md:text-[12px]">
                Session details
              </p>
              <ul className="mt-3 space-y-2.5">
                {DETAILS.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-[13px] text-muted">
                    <Check size={14} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <BookCta fullWidth />
              </div>
              <CtaNote className="mt-3" />
              <p className="mt-3 text-center text-[12px] text-muted-2 md:text-[12px]">
                Secure checkout through Razorpay
              </p>
            </div>
            </Reveal>
            </div>
          </div>
        </div>


        <Reveal className="mt-8 rounded-[16px] border border-border bg-surface p-6 md:p-9">
          <AfterYouPay />
        </Reveal>


        <Reveal
          className="mt-6 rounded-[16px] p-[24px] md:p-10"
          style={{
            border: "1px solid rgba(131,226,78,0.3)",
            backgroundColor: "rgba(131,226,78,0.045)",
          }}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-border-strong bg-surface">
            <ShieldCheck size={20} className="text-lime" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-[20px] leading-[1.2] font-bold tracking-[-0.02em] text-fg md:text-[26px]">
            If you don't leave with clarity, you don't pay.
          </h3>
          <p className="mt-4 max-w-[760px] text-[15px] text-muted">
            Attend the session. If you finish it without knowing which stage of your acquisition
            system is costing you the most, and what to do about it first — email{" "}
            <a
              href="mailto:akhil.ai.agency@gmail.com"
              className="font-semibold text-lime underline underline-offset-4"
            >
              akhil.ai.agency@gmail.com
            </a>{" "}
            and your ₹9 is returned. No form to fill in. No reason required. No follow-up asking you
            to reconsider.
          </p>
          <p className="mt-4 text-[13px] text-muted-2">
            We would rather refund ₹9 than have you tell someone the call wasn't worth your time.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
