import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";
import { SessionsLeftBox, CountdownBox } from "./urgency-boxes";

export function CapacitySection() {
  return (
    <section id="capacity" className="section-y band-raised">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[820px] rounded-[16px] border border-border-strong bg-surface p-6 md:p-9">
          <span className="eyebrow">Capacity</span>
          <h2 className="mt-4 text-[28px] leading-[1.12] font-extrabold tracking-[-0.025em] text-fg md:text-[38px]">
            But we can't take everyone.
          </h2>
          <p className="mt-4 text-[15.5px] leading-[1.75] text-muted">
            Akhil personally writes and builds every page — copy, design, domain setup, automation.
            Nothing is outsourced, and nothing is handed to a junior. That's the whole point of
            working with us, and it's also the limit:{" "}
            <strong className="font-semibold text-fg">a maximum of four new builds a month.</strong>
          </p>
          <p className="mt-4 text-[15.5px] leading-[1.75] text-muted">
            Which is why the ₹9 sessions are capped too. Every one of them is 30 minutes of the same
            person's time.
          </p>

          <div className="mt-6 grid gap-3 min-[520px]:grid-cols-2">
            <SessionsLeftBox withDashes />
            <CountdownBox note="Resets Monday, 00:00 IST." />
          </div>

          <div className="mt-6">
            <BookCta fullWidth />
          </div>
          <p className="mt-3 text-center text-[12.5px] leading-relaxed text-muted-2">
            Refundable on request. You keep the plan either way.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
