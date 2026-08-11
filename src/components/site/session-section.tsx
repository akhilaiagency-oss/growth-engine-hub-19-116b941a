import { Check, X } from "lucide-react";
import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";
import { CtaNote } from "./cta-note";
import { SessionAvailability } from "./session-availability";

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
          <h2 className="h2-section mt-4">What's Inside Your ₹9 Strategy Call?</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            A working session on your acquisition system — run by Akhil, structured around the Leak
            Map, and specific to your business. Here's what we cover.
          </p>
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
              <div className="flex items-baseline gap-3">
                <span className="text-[30px] font-bold text-fg">₹9</span>
                <span className="text-[13px] text-muted md:text-[12.5px]">reserves your session</span>
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
              <p className="mt-3 text-center text-[12.5px] text-muted-2 md:text-[11.5px]">
                Secure checkout through Razorpay
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-6 flex items-start gap-3 rounded-[12px] border border-border bg-surface-2 p-5">
          <Info size={16} className="mt-0.5 shrink-0 text-muted-2" />
          <p className="text-[14px] leading-relaxed text-muted">
            What this call is not: a pitch, a generic audit template, or a promise of guaranteed
            leads, revenue or return on ad spend. It is a working session and a prioritised plan —
            nothing more, and nothing less.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
