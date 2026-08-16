import { Link } from "@tanstack/react-router";
import { BrandLockup } from "./brand-lockup";

const PAGE_LINKS = [
  { href: "#leak-map", label: "Acquisition Leak Map" },
  { href: "#engine", label: "Growth Multiplier Engine™" },
  { href: "#results", label: "Results" },
  { href: "#session", label: "The offer" },
  { href: "#faq", label: "FAQ" },
];

const LEGAL_LINKS = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/refund-policy", label: "Refund Policy" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border pb-[calc(104px+env(safe-area-inset-bottom))] min-[900px]:pb-0">
      <div className="container-page py-14">
        <div className="grid gap-10 min-[700px]:grid-cols-2 min-[1000px]:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <BrandLockup size="footer" />

            <p className="mt-4 max-w-[380px] text-[13px] text-muted">
              AI-powered client acquisition systems that turn ad traffic into qualified
              opportunities, booked appointments and measurable revenue.
            </p>
          </div>

          <div>
            <p className="text-[12px] font-semibold md:text-[12px] tracking-[0.16em] text-muted-2 uppercase">
              On this page
            </p>
            <ul className="mt-4 flex flex-col gap-1 md:gap-3">
              {PAGE_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="flex min-h-[44px] items-center text-[13px] text-muted transition-colors hover:text-fg md:min-h-0"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[12px] font-semibold md:text-[12px] tracking-[0.16em] text-muted-2 uppercase">
              Contact
            </p>
            <ul className="mt-4 flex flex-col gap-1 md:gap-3">
              <li>
                <a
                  href="mailto:akhil.ai.agency@gmail.com"
                  className="flex min-h-[44px] items-center text-[13px] text-muted transition-colors hover:text-fg md:min-h-0"
                >
                  akhil.ai.agency@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[12px] font-semibold md:text-[12px] tracking-[0.16em] text-muted-2 uppercase">
              Legal
            </p>
            <ul className="mt-4 flex flex-col gap-1 md:gap-3">
              {LEGAL_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="flex min-h-[44px] items-center text-[13px] text-muted transition-colors hover:text-fg md:min-h-0"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-[12px] text-muted-2 md:text-[12px] min-[700px]:flex-row min-[700px]:items-center min-[700px]:justify-between">
          <p>© 2026 Growth Multiplier AI. All rights reserved.</p>
          <p>Growth Multiplier Engine™ is a trademark of Growth Multiplier AI.</p>
        </div>
      </div>
    </footer>
  );
}
