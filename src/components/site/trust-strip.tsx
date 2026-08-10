import { UserCheck, ShieldCheck, HandCoins, Workflow } from "lucide-react";

const ITEMS = [
  {
    Icon: UserCheck,
    title: "Direct founder access",
    sub: "Akhil runs every strategy call himself",
  },
  { Icon: ShieldCheck, title: "Secure ₹9 checkout", sub: "Processed through Razorpay" },
  { Icon: HandCoins, title: "A working session", sub: "You leave with a plan, not a proposal" },
  {
    Icon: Workflow,
    title: "Measurable end to end",
    sub: "Every stage tracked, from click to closed",
  },
];

export function TrustStrip() {
  return (
    <section
      aria-label="Why this call is safe to book"
      className="border-y border-border bg-surface"
    >
      <div className="container-page">
        <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 min-[860px]:grid-cols-4">
          {ITEMS.map(({ Icon, title, sub }, i) => (
            <li
              key={title}
              className={`flex items-start gap-3 px-0 py-6 min-[480px]:px-6 ${
                i > 0 ? "border-t border-border min-[480px]:border-t-0" : ""
              } ${i % 2 === 1 ? "min-[480px]:border-l min-[480px]:border-border" : ""} ${
                i >= 2 ? "min-[480px]:border-t min-[480px]:border-border min-[860px]:border-t-0" : ""
              } ${i === 2 ? "min-[860px]:border-l min-[860px]:border-border" : ""}`}
            >
              <Icon size={18} className="mt-0.5 shrink-0 text-lime" />
              <span>
                <span className="block text-[14px] font-bold text-fg">{title}</span>
                <span className="mt-1 block text-[12.5px] leading-relaxed text-muted">{sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
