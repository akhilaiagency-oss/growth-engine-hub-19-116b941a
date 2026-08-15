import { Check, ShieldCheck, X } from "lucide-react";
import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";
import { CtaNote } from "./cta-note";
import { PriceAnchor } from "./price-anchor";

const VALUE_POINTS = [
  "Acquisition funnel diagnosis",
  "Conversion bottleneck review",
  "Priority action plan",
];

const WHAT_YOU_GET = [
  "Landing-page review",
  "Conversion bottleneck identification",
  "Funnel observations across all seven stages",
  "Priority improvement opportunities",
  "Strategic next steps",
];

const THIS_ISNT = [
  "A guaranteed-results pitch",
  "A generic marketing consultation",
  "A pressure-filled sales presentation",
  "A full consulting engagement in 45 minutes",
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

const DOCUMENTS = [
  {
    label: "Document 01",
    title: "The Landing Page Audit Checklist",
    body: "23 checks, run against a page before deciding whether to rebuild it or repair it. Covers the single-action test, the qualification gap, mobile CTA position, and the four things that quietly kill an enquiry form.",
  },
  {
    label: "Document 02",
    title: "The Follow-Up Speed Scorecard",
    body: "A one-page instrument for measuring how long your enquiries actually wait for a first reply — split across weekday, evening and weekend. Most owners guess in minutes. The scorecard gives you the real number, and what it costs at your current cost per lead.",
  },
  {
    label: "Document 03",
    title: "The Lead Qualification Question Bank",
    body: "42 questions across fit, problem, timing, authority and budget, for any business where the sale involves a call, consultation or appointment.",
  },
];

const DETAILS = [
  "30–45 minutes, 1-on-1 with Akhil",
  "Zoom or Google Meet",
  "English or Hindi",
  "You keep the plan whether or not we work together",
];

const FOR = [
  "You're already running paid traffic, or you're ready to start",
  "You sell something that involves a call, consultation or appointment",
  "You're getting leads but too few turn into real conversations",
  "Your follow-up depends on someone manually remembering to do it",
  "You want one connected system instead of five disconnected tools",
];

const NOT_FOR = [
  "You're looking for a one-off landing page with nothing behind it",
  "You want overnight results without changing how follow-up works",
  "You have no budget for traffic and aren't planning to have one",
  "You'd rather buy a guarantee than build a system",
  "You only want a vendor to take instructions, not a partner to challenge them",
];

function DiagnosticStack() {
  return (
    <ol className="flex flex-col">
      {CHECKPOINTS.map((c, i) => (
        <li key={c.n}>
          <div
            className="grid items-start gap-3 rounded-[10px] border border-border bg-surface-2 min-[620px]:grid-cols-[30px_152px_1fr]"
            style={{ padding: "13px 16px" }}
          >
            <span className="text-[13px] font-bold text-lime">{c.n}</span>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-fg">
              {c.stage}
            </h3>
            <p className="text-[14px] leading-[1.6] text-muted">{c.body}</p>
          </div>
          {i < CHECKPOINTS.length - 1 && (
            <div aria-hidden="true" className="py-1.5 text-center text-[14px] text-muted-2">
              ↓
            </div>
          )}
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
          <span className="eyebrow">The session</span>
          <h2 className="h2-section mt-4">What we review on your ₹9 strategy call</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            We walk your acquisition funnel stage by stage — the same seven checkpoints the Engine
            is built on.
          </p>
          <ul className="mt-5 flex flex-col items-center gap-2.5 min-[620px]:flex-row min-[620px]:justify-center min-[620px]:gap-6">
            {VALUE_POINTS.map((v) => (
              <li key={v} className="flex items-center gap-2 text-[13.5px] text-muted">
                <Check size={15} className="shrink-0 text-lime" aria-hidden="true" />
                {v}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-8 grid items-start gap-8 min-[900px]:grid-cols-[1.35fr_1fr]">
          <div className="flex flex-col gap-6">
            <Reveal>
              <DiagnosticStack />
            </Reveal>

            <Reveal className="mx-auto grid w-full max-w-[840px] gap-6 sm:grid-cols-2 sm:gap-8">
              <div>
                <p className="text-[14px] font-semibold text-lime">What you get</p>
                <ul className="mt-3 space-y-2.5">
                  {WHAT_YOU_GET.map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2.5 text-[14px] leading-[1.6] text-muted"
                    >
                      <Check size={15} className="mt-[3px] shrink-0 text-lime" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-muted">What it isn't</p>
                <ul className="mt-3 space-y-2.5">
                  {THIS_ISNT.map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2.5 text-[14px] leading-[1.6] text-muted"
                    >
                      <X size={15} className="mt-[3px] shrink-0 text-muted-2" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <span className="eyebrow">Yours to keep</span>
              <h3 className="mt-3 text-[21px] font-bold leading-[1.2] tracking-[-0.02em] text-fg md:text-[24px]">
                Three working documents you keep, whether or not we work together.
              </h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-muted">
                Not lead magnets written to be downloaded and forgotten. These are the internal
                checklists we run before building any acquisition system. All three are sent the
                moment your session is confirmed.
              </p>

              <div className="mt-5 flex flex-col gap-4">
                {DOCUMENTS.map((d) => (
                  <div
                    key={d.label}
                    className="border-l-2 border-lime bg-surface p-5"
                    style={{ borderRadius: "0 12px 12px 0" }}
                  >
                    <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-2">
                      {d.label}
                    </span>
                    <h4 className="mt-2 text-[16px] font-semibold text-fg">{d.title}</h4>
                    <p className="mt-2 text-[14px] leading-[1.7] text-muted">{d.body}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4 flex items-start gap-2.5 text-[13.5px] leading-relaxed text-muted">
                <span
                  aria-hidden="true"
                  className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-lime"
                />
                Sent on confirmation. Nothing further is required from you to receive them.
              </p>
            </Reveal>
          </div>

          {/* Commitment card */}
          <Reveal className="overflow-hidden rounded-[16px] border border-border-strong bg-surface">
            <div className="h-[2px] w-full bg-lime" />
            <div className="p-7">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <PriceAnchor size="lg" suffix="" />
                <span className="text-[13px] text-muted md:text-[12.5px]">
                  1:1 AI Growth Strategy Session
                </span>
              </div>
              <p className="mt-1.5 text-[12.5px] text-muted-2">Today's rate. Standard price ₹99.</p>

              <div className="my-6 h-px w-full bg-border" />

              <p className="border-l-2 border-lime pl-4 text-[18px] font-semibold leading-[1.5] text-fg">
                ₹9 isn't the price of the strategy. It's a small commitment to reserve your session.
              </p>

              <p className="mt-5 text-[14px] leading-[1.7] text-muted">
                A paid step — however small — means the calendar goes to people who are genuinely
                working on this problem. It keeps the session focused, and it means Akhil arrives
                having looked at your business rather than running a generic call.
              </p>

              <div className="my-6 h-px w-full bg-border" />

              <p className="text-[15px] font-semibold text-fg">Low commitment. High clarity.</p>
              <p className="mt-2 text-[14px] leading-[1.7] text-muted">
                The ₹9 reserves your session. The goal isn't to sell you a predetermined package —
                it's to understand your acquisition system, identify the biggest bottleneck, and
                work out whether Growth Multiplier AI is genuinely a fit.
              </p>

              <p className="mt-5 text-[14px] font-semibold text-fg">
                If we're not the right fit, we'll tell you.
              </p>

              <p className="mt-7 text-[12px] font-semibold uppercase md:text-[11px] tracking-[0.14em] text-muted-2">
                Session details
              </p>
              <ul className="mt-3 space-y-2.5">
                {DETAILS.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-[13.5px] text-muted">
                    <Check size={14} className="mt-1 shrink-0 text-lime" />
                    {d}
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <BookCta fullWidth />
              </div>
              <CtaNote className="mt-3" />
              <p className="mt-3 text-center text-[12.5px] text-muted-2 md:text-[11.5px]">
                Secure checkout through Razorpay
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal
          className="mt-6 rounded-[16px] p-[26px] md:p-10"
          style={{
            border: "1px solid rgba(131,226,78,0.3)",
            backgroundColor: "rgba(131,226,78,0.045)",
          }}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-border-strong bg-surface">
            <ShieldCheck size={20} className="text-lime" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-[21px] font-bold leading-[1.2] tracking-[-0.02em] text-fg md:text-[24px]">
            If you don't leave with clarity, you don't pay.
          </h3>
          <p className="mt-4 max-w-[760px] text-[15px] leading-[1.75] text-muted">
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
          <p className="mt-4 text-[13.5px] leading-relaxed text-muted-2">
            We would rather refund ₹9 than have you tell someone the call wasn't worth your time.
          </p>
        </Reveal>

        {/* Merged fit section */}
        <Reveal className="mt-10 max-w-[760px]">
          <span className="eyebrow">Fit</span>
          <h3 className="h2-section mt-4">Who this call is for</h3>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Genuinely useful for some businesses, a waste of time for others. Here's the honest
            split.
          </p>
        </Reveal>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Reveal className="rounded-[12px] border border-border bg-bg p-6 md:p-7">
            <h4 className="text-[17px] font-bold tracking-[-0.01em] text-lime">
              This call is for you if
            </h4>
            <ul className="mt-5 flex flex-col gap-3.5">
              {FOR.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-fg">
                  <Check size={17} className="mt-0.5 shrink-0 text-lime" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="rounded-[12px] border border-border bg-bg p-6 md:p-7">
            <h4 className="text-[17px] font-bold tracking-[-0.01em] text-muted">
              This call isn't for you if
            </h4>
            <ul className="mt-5 flex flex-col gap-3.5">
              {NOT_FOR.map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-3 text-[14.5px] leading-relaxed text-muted"
                >
                  <X size={17} className="mt-0.5 shrink-0 text-muted-2" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
