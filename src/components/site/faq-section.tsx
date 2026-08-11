import { useState } from "react";
import { Plus } from "lucide-react";
import { FAQS } from "@/data/faq";
import { Reveal } from "./reveal";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-y band-base">
      <div className="container-narrow">
        <Reveal>
          <span className="eyebrow">FAQ</span>
          <h2 className="h2-section mt-4">Before you book</h2>
        </Reveal>

        <div className="mt-8">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} className={i > 0 ? "border-t border-border" : ""}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-[15.5px] font-semibold text-fg">{f.q}</span>
                    <Plus
                      size={18}
                      aria-hidden="true"
                      className={`mt-0.5 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-45 text-lime" : "text-muted-2"
                      }`}
                    />
                  </button>
                </h3>
                {isOpen && (
                  <p className="max-w-[720px] pb-6 text-[14.5px] leading-relaxed text-muted">
                    {f.a}
                  </p>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
