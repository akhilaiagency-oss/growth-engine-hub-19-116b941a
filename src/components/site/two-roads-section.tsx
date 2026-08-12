import { Reveal } from "./reveal";

export function TwoRoadsSection() {
  return (
    <section id="two-roads" className="section-y band-raised">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <span className="eyebrow">Two roads</span>
          <h2 className="h2-section mt-4">You have two ways to leave this page.</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Both are reasonable. They just lead somewhere different.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 min-[900px]:grid-cols-2">
          <Reveal className="rounded-[12px] border border-border bg-surface p-6 md:p-7">
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-2">
              Option 1
            </span>
            <h3 className="mt-3 text-[19px] font-bold tracking-[-0.01em] text-muted">
              Close the tab
            </h3>
            <p className="mt-3 text-[14.5px] leading-[1.75] text-muted">
              Nothing bad happens today. Tomorrow the ads keep running, the enquiries keep arriving,
              and the same stage keeps leaking — you just still won't know which one it is. Three
              months from now you'll have spent another few lakh on traffic and you'll be reading a
              page like this one again, deciding whether to bother.
            </p>
          </Reveal>

          <Reveal
            className="rounded-[12px] p-6 md:p-7"
            style={{
              border: "1px solid rgba(131,226,78,0.35)",
              backgroundImage:
                "linear-gradient(180deg, rgba(131,226,78,0.09), rgba(131,226,78,0.03))",
            }}
          >
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-lime">
              Option 2
            </span>
            <h3 className="mt-3 text-[19px] font-bold tracking-[-0.01em] text-fg">
              Spend ₹9 and forty minutes
            </h3>
            <p className="mt-3 text-[14.5px] leading-[1.75] text-muted">
              Your funnel gets mapped stage by stage. You find out exactly where the money stops
              working, and you leave with the order to fix it in — plus the three documents. If it
              isn't worth it, you're refunded. The plan is yours either way.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-7 text-center text-[19px] font-semibold text-fg">
          The difference between the two is <span className="text-lime">₹9 and forty minutes</span>.
        </Reveal>
      </div>
    </section>
  );
}
