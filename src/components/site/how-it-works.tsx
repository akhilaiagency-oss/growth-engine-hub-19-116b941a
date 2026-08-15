import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";

const STEPS = [
  {
    n: "1",
    tag: "Secure your slot",
    title: "Pay ₹9 to reserve the call",
    body: "A small, transparent commitment keeps the calendar for people actually working on this. Processed securely through Razorpay. Takes under a minute.",
  },
  {
    n: "2",
    tag: "Pick your time",
    title: "Choose a slot that suits you",
    body: "Once payment clears you'll pick an available time and get the confirmation and meeting link straight away.",
  },
  {
    n: "3",
    tag: "Get connected",
    title: "Join the WhatsApp community",
    body: "Once your appointment is confirmed you're invited in, for reminders, resources and direct access before we speak.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-y band-raised">
      <div className="container-page">
        <Reveal className="max-w-[760px]">
          <span className="eyebrow">How it works</span>
          <h2 className="h2-section mt-4">From ₹9 to a working acquisition system</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Three steps to your strategy call — and a clear view of what happens after it.
          </p>
        </Reveal>

        <div className="relative mt-10">
          <span
            aria-hidden="true"
            className="absolute hidden h-px min-[900px]:block"
            style={{
              top: "26px",
              left: "12%",
              right: "12%",
              backgroundImage:
                "linear-gradient(90deg, transparent, rgba(131,226,78,0.55), transparent)",
            }}
          />
          <ol className="grid gap-8 min-[900px]:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n}>
                <Reveal className="text-center min-[900px]:text-left">
                  <span
                    className="relative z-10 mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full text-[18px] font-bold text-lime min-[900px]:mx-0"
                    style={{
                      background: "var(--surface-2)",
                      border: "2px solid var(--lime)",
                    }}
                  >
                    {s.n}
                  </span>
                  <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-lime md:text-[11px]">
                    {s.tag}
                  </p>
                  <h3 className="mt-2 text-[17px] font-bold tracking-[-0.01em] text-fg">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">{s.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <Reveal className="mt-8 rounded-[12px] border border-border bg-bg p-6 md:p-7">
          <h3 className="text-[17px] font-bold tracking-[-0.01em] text-fg">On the call itself</h3>
          <p className="mt-3 max-w-[860px] text-[14.5px] leading-relaxed text-muted">
            We put your real numbers against the Acquisition Leak Map, find the stage costing you
            the most, and work through what the Growth Multiplier Engine™ looks like built around
            your business — which stages you already have, which are missing, and the order to fix
            them in. You keep that plan whether or not we work together.
          </p>
        </Reveal>

        <div className="mt-8 text-center">
          <BookCta />
        </div>
      </div>
    </section>
  );
}
