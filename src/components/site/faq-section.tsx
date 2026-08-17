import { useState } from "react";
import { Plus } from "lucide-react";
import { FAQS } from "@/data/faq";
import { Reveal } from "./reveal";

const WA_NUMBER = "+91 93112 13876";


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
                    <span className="text-[15px] font-semibold text-fg">{f.q}</span>
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
                  <p className="max-w-[720px] pb-6 text-[15px] text-muted">
                    {f.a.split(WA_NUMBER).flatMap((part, idx) =>
                      idx === 0
                        ? [part]
                        : [
                            <a
                              key={`wa-${idx}`}
                              href="https://wa.me/919311213876"
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-lime underline underline-offset-2"
                            >
                              {WA_NUMBER}
                            </a>,
                            part,
                          ],
                    )}
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
