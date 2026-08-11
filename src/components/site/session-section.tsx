import { Check, X } from "lucide-react";
import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";
import { CtaNote } from "./cta-note";
import { PriceAnchor } from "./price-anchor";
import { SlotsLeft } from "./slots-left";
import { OfferCountdown } from "./offer-countdown";

const VALUE_POINTS = [
  "Acquisition funnel diagnosis",
  "Conversion bottleneck review",
  "Priority action plan",
];

const THIS_IS = [
  "A focused strategy conversation",
  "An acquisition funnel diagnosis",
  "Identification of conversion bottlenecks",
  "Practical prioritisation of what to fix first",
];

const THIS_ISNT = [
  "A guaranteed-results pitch",
  "A generic marketing consultation",
  "A pressure-filled sales presentation",
  "A full consulting engagement in 45 minutes",
];



const AGENDA = [
  {
    n: "01",
    title: "Acquisition funnel diagnosis",
    body: "We walk your funnel end to end and establish what is actually happening at each stage, rather than what the dashboard reports.",
  },
  {
    n: "02",
    title: "Conversion bottlenecks",
    body: "Where the drop-off concentrates, and which single stage is costing you more than the other four combined.",
  },
  {
    n: "03",
    title: "Lead-quality assessment",
    body: "Whether the enquiries arriving actually match the buyer you want, and what that is doing to your team's time.",
  },
  {
    n: "04",
    title: "Landing-page opportunities",
    body: "What your page is asking visitors to do, what is competing with it, and what to change first.",
  },
  {
    n: "05",
    title: "Qualification and automation opportunities",
    body: "Which decisions and follow-ups can be handled the moment they happen instead of the next working day.",
  },
  {
    n: "06",
    title: "Booking-flow opportunities",
    body: "How interest turns into a confirmed appointment, and where that path is adding friction.",
  },
  {
    n: "07",
    title: "Recommended priorities",
    body: "The order to fix things in — what moves first, what can wait, and what to leave alone for now.",
  },
];

const DETAILS = [
  "30–45 minutes, 1-on-1 with Akhil",
  "Zoom or Google Meet",
  "English or Hindi",
  "You keep the plan whether or not we work together",
];

export function SessionSection() {
  return (
    <section id="session" className="section-y">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <span className="eyebrow">The session</span>
          <h2 className="h2-section mt-4">What's Inside Your ₹9 AI Growth Strategy Session?</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            A working session on your acquisition system — run by Akhil, structured around the Leak
            Map, and specific to your business. Here's what we cover.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Reserve a focused 1:1 session to identify the biggest bottleneck in your client
            acquisition journey.
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

        <div className="mt-10 grid items-start gap-10 min-[900px]:grid-cols-[1.35fr_1fr]">
          {/* Agenda */}
          <Reveal className="card-surface p-2">
            <ul>
              {AGENDA.map((a, i) => (
                <li
                  key={a.n}
                  className={`flex gap-4 px-4 py-[18px] ${
                    i < AGENDA.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] border border-border bg-surface-2 text-[12px] font-bold text-lime md:text-[11px]">
                    {a.n}
                  </span>
                  <div>
                    <h3 className="text-[16px] font-semibold text-fg">{a.title}</h3>
                    <p className="mt-1 text-[14px] leading-[1.6] text-muted">{a.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

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
              <p className="mt-1.5 text-[12.5px] text-muted-2">
                Today's rate. Standard price ₹99.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <SlotsLeft />
                <OfferCountdown />
              </div>

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

              <div className="mt-5 border-l-2 border-lime pl-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-lime md:text-[11.5px]">
                  Clarity guarantee
                </p>
                <p className="mt-2 text-[14px] leading-[1.7] text-fg">
                  You'll leave the session knowing what we believe deserves attention first in your
                  acquisition system — not a generic marketing presentation.
                </p>
              </div>

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
              <SessionAvailability className="mt-4 text-center" />
              <p className="mt-3 text-center text-[12.5px] text-muted-2 md:text-[11.5px]">
                Secure checkout through Razorpay
              </p>

            </div>
          </Reveal>
        </div>

        <Reveal className="mt-6 rounded-[12px] border border-border bg-surface-2 p-6">
          <h3 className="text-[17px] font-semibold text-fg">
            Here's what this is — and what it isn't
          </h3>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 sm:gap-8">
            <div>
              <p className="text-[14px] font-semibold text-lime">This is</p>
              <ul className="mt-3 space-y-2.5">
                {THIS_IS.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[14px] leading-[1.6] text-muted">
                    <Check size={15} className="mt-[3px] shrink-0 text-lime" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-muted">This isn't</p>
              <ul className="mt-3 space-y-2.5">
                {THIS_ISNT.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[14px] leading-[1.6] text-muted">
                    <X size={15} className="mt-[3px] shrink-0 text-muted-2" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-[14px] leading-relaxed text-muted">
            No obligation to work with Growth Multiplier AI after the session.
          </p>
        </Reveal>

      </div>
    </section>
  );
}
