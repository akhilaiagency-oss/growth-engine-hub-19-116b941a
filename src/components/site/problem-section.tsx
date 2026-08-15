import { Timer, Unplug, CalendarX } from "lucide-react";
import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";
import { AcquisitionFlow } from "./acquisition-flow";

const CARDS = [
  {
    Icon: Timer,
    title: "The reply arrives after the interest has gone",
    body: "A buyer is never more interested than in the first few minutes. When follow-up depends on someone noticing a notification, that window closes before anybody acts on it.",
  },
  {
    Icon: Unplug,
    title: "Your tools work. The handoffs don't.",
    body: "Ads in one platform, the form in another, a CRM nobody updates, WhatsApp on a personal phone. Every piece works on its own. Opportunities fall through the gaps between them.",
  },
  {
    Icon: CalendarX,
    title: "You're counting leads, not opportunities",
    body: "Lead volume looks healthy right until you check the calendar. With no qualification early on, an unqualified enquiry gets paid for twice — once in ad spend, again in your team's time.",
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="section-y band-base">
      <div className="container-page">
        <Reveal className="max-w-[760px]">
          <span className="eyebrow">The acquisition problem</span>
          <h2 className="h2-section mt-4">
            Your ads are generating attention. The opportunities are disappearing between the click
            and the sale.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Attention is the part you can buy. Everything after it — the page, the filter, the
            reply, the booking — decides whether that spend becomes revenue. In most businesses it
            breaks in three places at once.
          </p>
        </Reveal>

        <Reveal className="mt-8">
          <AcquisitionFlow />
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {CARDS.map(({ Icon, title, body }) => (
            <Reveal key={title} className="card-surface p-6">
              <span
                aria-hidden="true"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-[9px] text-lime"
                style={{
                  background: "rgba(131,226,78,0.11)",
                  border: "1px solid rgba(131,226,78,0.25)",
                }}
              >
                <Icon size={18} />
              </span>
              <h3 className="mt-4 text-[17px] font-bold tracking-[-0.01em] text-fg">{title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6 rounded-[12px] border border-border bg-bg p-6">
          <p
            className="text-[17px] leading-relaxed font-semibold text-fg"
            style={{ borderLeft: "2px solid var(--lime)", paddingLeft: "18px" }}
          >
            Every click represents an acquisition cost you have already committed. Before increasing
            your ad budget, it's worth finding where the existing funnel is leaking.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
