import { Reveal } from "./reveal";
import { BookCta } from "./book-cta";
import { CtaNote } from "./cta-note";
import { RefundNote } from "./refund-note";
import { PriceAnchor } from "./price-anchor";

export function TwoRoadsSection() {
  return (
    <section id="get-started" className="section-y band-base">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <span className="eyebrow">Two roads</span>
          <h2 className="h2-section mt-4">You have two ways to leave this page.</h2>
          <p className="mt-4 text-[17px] text-muted">
            Both are reasonable. They just lead somewhere different.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 min-[900px]:grid-cols-2">
          <Reveal className="rounded-[12px] border border-border bg-surface p-6 md:p-6">
            <span className="text-[12px] font-semibold tracking-[0.14em] text-muted-2 uppercase">
              Option 1
            </span>
            <h3 className="mt-3 text-[20px] font-bold tracking-[-0.01em] text-muted">
              Close the tab
            </h3>
            <p className="mt-3 text-[15px] text-muted">
              Nothing bad happens today. Tomorrow the ads keep running, the enquiries keep arriving,
              and the same stage keeps leaking — you just still won't know which one it is. Three
              months from now you'll have spent another few lakh on traffic and you'll be reading a
              page like this one again, deciding whether to bother.
            </p>
          </Reveal>

          <Reveal
            className="rounded-[12px] p-6 md:p-6"
            style={{
              border: "1px solid rgba(131,226,78,0.35)",
              backgroundImage:
                "linear-gradient(180deg, rgba(131,226,78,0.09), rgba(131,226,78,0.03))",
            }}
          >
            <span className="text-[12px] font-semibold tracking-[0.14em] text-lime uppercase">
              Option 2
            </span>
            <h3 className="mt-3 text-[20px] font-bold tracking-[-0.01em] text-fg">
              Spend ₹9 and thirty minutes
            </h3>
            <p className="mt-3 text-[15px] text-muted">
              Your funnel gets mapped stage by stage. You find out exactly where the money stops
              working, and you leave with the order to fix it in — plus the three documents. If it
              isn't worth it, you're refunded. The plan is yours either way.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-6 text-center text-[20px] font-semibold text-fg">
          The difference between the two is <span className="text-lime">₹9 and thirty minutes</span>
          .
        </Reveal>

        <Reveal
          className="mt-8 rounded-[16px] border border-border bg-surface px-6 py-12 text-center md:px-[72px] md:py-[64px]"
          style={{
            backgroundImage:
              "radial-gradient(520px 220px at 50% 0%, rgba(131,226,78,0.12), transparent 70%)",
          }}
        >
          <h3 className="mx-auto max-w-[680px] text-[26px] leading-[1.15] font-extrabold tracking-[-0.025em] text-fg md:text-[34px]">
            Find out where your opportunities are disappearing.
          </h3>
          <p className="mx-auto mt-4 max-w-[620px] text-[17px] text-muted">
            Book the ₹9 strategy call. We'll map your funnel stage by stage, find where the drop-off
            is costing you the most, and you'll leave with the plan — whether or not we work
            together.
          </p>

          <div className="mx-auto mt-6 flex max-w-[480px] items-center justify-center rounded-[14px] border border-border bg-surface-2 px-6 py-5">
            <PriceAnchor size="lg" suffix="today" />
          </div>

          <div className="mt-6">
            <BookCta />
          </div>
          <CtaNote className="mt-3" />
          <RefundNote />

        </Reveal>
      </div>
    </section>
  );
}
