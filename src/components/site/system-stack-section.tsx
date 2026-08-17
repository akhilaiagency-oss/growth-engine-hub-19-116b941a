import { Check, LayoutTemplate, BrainCircuit, Database, MessageCircle, BarChart3, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";

interface StackRow {
  color: string;
  title: string;
  body: string;
  Icon: LucideIcon;
}

const ROWS: StackRow[] = [
  {
    color: "#3E86FF",
    title: "Landing page",
    body: "Most pages ask a visitor to do three things at once, so they do none. We build around one decision — and you never touch it again.",
    Icon: LayoutTemplate,
  },
  {
    color: "#2DD4BF",
    title: "AI lead qualification",
    body: "Your team's best hours go to people who were never going to buy. Scoring happens the second an enquiry lands, not on the call.",
    Icon: BrainCircuit,
  },
  {
    color: "#83E24E",
    title: "CRM integration",
    body: "Right now your leads live in WhatsApp, in calls, in portals, and in someone's memory. One place, one view, nothing lost.",
    Icon: Database,
  },
  {
    color: "#25D366",
    title: "WhatsApp automation",
    body: "A reply at 11pm is worth more than a perfect one tomorrow. This is the stage where most deals quietly die.",
    Icon: MessageCircle,
  },
  {
    color: "#A78BFA",
    title: "Analytics dashboard",
    body: "Your agency's report looks healthy while your calendar looks the same. This shows which stage actually broke.",
    Icon: BarChart3,
  },
  {
    color: "#818CF8",
    title: "Funnel optimization",
    body: "Most changes are guesses. When every stage is measured, the next fix is a decision.",
    Icon: TrendingUp,
  },
];

export function SystemStackSection() {
  return (
    <section id="stack" className="section-y band-base">
      <div className="container-page">
        <Reveal className="max-w-[820px]">
          <span className="eyebrow">Deliverables</span>
          <h2 className="h2-section mt-4">Everything in one connected funnel system</h2>
          <p className="mt-4 text-[17px] text-muted">
            The same seven stages of the Engine, named as the things we actually build. Any agency
            can sell you one row — the value is in the wiring between them.
          </p>
        </Reveal>

        <ul className="mt-6 flex flex-col gap-3">
          {ROWS.map(({ color, title, body, Icon }) => (
            <li key={title}>
              <Reveal className="flex items-center gap-0 overflow-hidden rounded-[12px] border border-border bg-surface pr-5 pl-0">
                <span
                  className="flex h-[70px] w-[70px] items-center justify-center min-[900px]:h-[96px] min-[900px]:w-[96px]"
                  style={{
                    background: `linear-gradient(135deg, ${color}33, ${color}11)`,
                  }}
                  aria-hidden="true"
                >
                  <Icon size={26} style={{ color }} />
                </span>

                <span
                  className="ml-4 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border min-[900px]:ml-0 min-[900px]:h-[30px] min-[900px]:w-[30px]"
                  style={{ borderColor: color }}
                  aria-hidden="true"
                >
                  <Check size={15} style={{ color }} />
                </span>

                <div className="py-4 pl-4 min-[900px]:pl-5">
                  <h3
                    className="text-[15px] font-bold tracking-[0.08em] uppercase min-[900px]:text-[17px]"
                    style={{ color }}
                  >
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-muted">{body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal
          className="mt-6 rounded-[14px] px-5 py-4 text-center"
          style={{
            border: "1px solid rgba(131,226,78,0.4)",
            backgroundColor: "rgba(131,226,78,0.06)",
          }}
        >
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[15px] font-bold">
            <span className="text-muted">Our goal:</span>
            <span className="text-fg">More leads</span>
            <span className="text-muted-2" aria-hidden="true">
              |
            </span>
            <span className="text-electric-soft">More conversions</span>
            <span className="text-muted-2" aria-hidden="true">
              |
            </span>
            <span className="text-lime">More revenue</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
