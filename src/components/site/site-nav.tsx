import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import mark from "@/assets/growth-multiplier-ai-logo.png";
import { BookCta } from "./book-cta";

const LINKS = [
  { href: "#leak-map", label: "Leak Map" },
  { href: "#engine", label: "The Engine" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#faq", label: "FAQ" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled ? "border-b border-border bg-[rgba(7,11,20,0.88)] backdrop-blur-md" : ""
      }`}
    >
      <nav className="container-page flex items-center justify-between gap-6 py-[14px]">
        <a href="#top" className="flex min-w-0 items-center">
          <BrandLockup size="nav" withTagline />
        </a>


        <ul className="hidden items-center gap-7 min-[900px]:flex">
          {LINKS.map((l) => (
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

        <div className="hidden min-[900px]:block">
          <BookCta />
        </div>

        <button
          type="button"
          aria-label={openMenu ? "Close menu" : "Open menu"}
          aria-expanded={openMenu}
          onClick={() => setOpenMenu((v) => !v)}
          className="rounded-[8px] border border-border-strong p-2 text-fg min-[900px]:hidden"
        >
          {openMenu ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {openMenu && (
        <div className="border-t border-border bg-[rgba(7,11,20,0.96)] backdrop-blur-md min-[900px]:hidden">
          <div className="container-page flex flex-col gap-4 py-5">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpenMenu(false)}
                className="flex min-h-[44px] items-center text-[15px] text-muted transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            ))}
            <BookCta fullWidth />
          </div>
        </div>
      )}
    </header>
  );
}
