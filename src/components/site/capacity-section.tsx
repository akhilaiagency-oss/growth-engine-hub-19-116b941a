import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";
import { SessionsLeftBox, CountdownBox } from "./urgency-boxes";

export function CapacitySection() {
  return (
    <section id="capacity" className="section-y band-raised">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[820px] rounded-[16px] border border-border-strong bg-surface p-6 md:p-9">
          <span className="eyebrow">Capacity</span>
          <h2 className="h2-section mt-4">Why the calendar is limited</h2>
          <p className="mt-4 text-[15.5px] leading-[1.75] text-muted">
            Every session is run by Akhil personally, and each one takes preparation before the call
            and a written plan after it. That caps how many can happen in a week. When the week's
            sessions are taken, booking reopens the following Monday.
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
