import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";

const STEPS = [
  {
    n: "1",
    tag: "Secure your slot",
    title: "Pay ₹9 to reserve the call",
    body: "A small, transparent commitment fee keeps the calendar for people who are serious about fixing their acquisition. Processed securely through Razorpay.",
  },
  {
    n: "2",
    tag: "Pick your time",
    title: "Choose a slot that suits you",
    body: "Once payment is verified, you'll pick an available time on the calendar. You'll get a confirmation with the meeting link straight away.",
  },
  {
    n: "3",
    tag: "Get connected",
    title: "Join the WhatsApp community",
    body: "After your appointment is confirmed, you're invited into our WhatsApp community for reminders, resources and direct access before the call.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-y">
      <div className="container-page">
        <Reveal className="max-w-[760px]">
          <span className="eyebrow">How it works</span>
          <h2 className="h2-section mt-4">From ₹9 to a working acquisition system</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Three steps to your strategy call — and a clear view of what happens after it.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <Reveal key={s.n} className="card-surface p-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-lime text-[13px] font-bold text-lime-ink">
                {s.n}
              </span>
              <p className="mt-4 text-[11px] font-semibold tracking-[0.16em] text-lime uppercase">
                {s.tag}
              </p>
              <h3 className="mt-2 text-[17px] font-bold tracking-[-0.01em] text-fg">{s.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-5 card-surface p-6 md:p-7">
          <h3 className="text-[17px] font-bold tracking-[-0.01em] text-fg">On the call itself</h3>
          <p className="mt-3 max-w-[860px] text-[14.5px] leading-relaxed text-muted">
            We put your real numbers against the Acquisition Leak Map, find the stage costing you
            most, and walk through what the Growth Multiplier Engine™ looks like built around your
            business — which stages you already have, which are missing, and the order to fix them
            in. You keep that plan whether or not we work together afterwards.
          </p>
        </Reveal>

        <div className="mt-8 text-center">
          <BookCta />
        </div>
      </div>
    </section>
  );
}
