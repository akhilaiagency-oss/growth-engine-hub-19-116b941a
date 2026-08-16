import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BrandLockup } from "./brand-lockup";

/** Shared shell for the three legal pages. Same minimal header as /qualify. */
export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh px-5 pt-10 pb-20">
      <header className="mx-auto max-w-[760px] text-center">
        <BrandLockup stacked />
        <Link
          to="/"
          className="mt-2 inline-flex min-h-[44px] items-center justify-center px-3 text-[13px] text-muted transition-colors hover:text-fg"
        >
          ← Back to site
        </Link>
      </header>

      <main className="mx-auto mt-10 max-w-[760px]">
        <p className="text-[12px] font-semibold tracking-[0.14em] text-muted-2 uppercase">
          Last updated: {updated}
        </p>
        <h1 className="mt-3 text-[26px] leading-[1.12] font-extrabold tracking-[-0.025em] text-fg md:text-[40px]">
          {title}
        </h1>
        {intro && <p className="mt-4 text-[15px] text-muted">{intro}</p>}
        <div className="mt-10 flex flex-col gap-9">{children}</div>
      </main>
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-[20px] font-bold tracking-[-0.015em] text-fg md:text-[20px]">
        {heading}
      </h2>
      <div className="mt-3 flex flex-col gap-3 text-[15px] text-muted">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function MailLink() {
  return (
    <a
      href="mailto:akhil.ai.agency@gmail.com"
      className="text-lime underline-offset-4 hover:underline"
    >
      akhil.ai.agency@gmail.com
    </a>
  );
}
