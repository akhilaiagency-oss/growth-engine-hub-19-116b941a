import { Timer, Unplug, CalendarX } from "lucide-react";
import { Reveal } from "./reveal";

const CARDS = [
  {
    Icon: Timer,
    title: "Interest has a shelf life",
    body: "Your budget buys the click. What happens in the next few minutes decides whether it turns into anything — and in most businesses, nobody owns those minutes.",
  },
  {
    Icon: Unplug,
    title: "Every part works. The joins don't.",
    body: "Ads in one platform, a form in another, a CRM nobody updates, WhatsApp on somebody's personal phone. No single piece is broken — the handoffs between them are.",
  },
  {
    Icon: CalendarX,
    title: "The dashboard says yes, the calendar says no",
    body: "Lead volume looks healthy right up until you check who's actually booked. Without a filter early on, the cost of unqualified leads lands on your sales time instead of your ad spend.",
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="section-y">
      <div className="container-page">
        <Reveal className="max-w-[760px]">
          <span className="eyebrow">The acquisition problem</span>
          <h2 className="h2-section mt-4">
            Buying attention is the easy half. Keeping hold of it is where the money goes.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Most businesses can get a stranger to click. What breaks is everything between that
            click and a confirmed appointment — and it usually breaks in three places at once.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {CARDS.map(({ Icon, title, body }) => (
            <Reveal key={title} className="card-surface p-6">
              <Icon size={20} className="text-muted-2" />
              <h3 className="mt-4 text-[17px] font-bold tracking-[-0.01em] text-fg">{title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
