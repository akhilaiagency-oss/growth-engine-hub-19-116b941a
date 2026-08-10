import logo from "@/assets/growth-multiplier-ai-logo.png";

const PAGE_LINKS = [
  { href: "#leak-map", label: "Acquisition Leak Map" },
  { href: "#engine", label: "Growth Multiplier Engine™" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border pb-[104px] min-[900px]:pb-0">
      <div className="container-page py-14">
        <div className="grid gap-10 min-[700px]:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Growth Multiplier AI logo"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full border border-border"
              />
              <span className="text-[15px] font-bold text-fg">Growth Multiplier AI</span>
            </div>
            <p className="mt-4 max-w-[380px] text-[13.5px] leading-relaxed text-muted">
              AI-powered client acquisition systems that turn ad traffic into qualified
              opportunities, booked appointments and measurable revenue.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-2 uppercase">
              On this page
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {PAGE_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[13.5px] text-muted transition-colors hover:text-fg"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-2 uppercase">
              Contact
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href="mailto:akhil.ai.agency@gmail.com"
                  className="text-[13.5px] text-muted transition-colors hover:text-fg"
                >
                  akhil.ai.agency@gmail.com
                </a>
              </li>
              <li className="text-[13.5px] text-muted-2">
                WhatsApp community — link added at launch
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-[12px] text-muted-2 min-[700px]:flex-row min-[700px]:items-center min-[700px]:justify-between">
          <p>© 2026 Growth Multiplier AI. All rights reserved.</p>
          <p>Growth Multiplier Engine™ is a trademark of Growth Multiplier AI.</p>
        </div>
      </div>
    </footer>
  );
}
