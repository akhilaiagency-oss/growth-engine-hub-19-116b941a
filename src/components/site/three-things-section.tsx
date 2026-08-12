import { Reveal } from "./reveal";

const TRIED = [
  {
    n: "01",
    title: "You hired an agency",
    body: "₹30,000 to ₹1,00,000 a month. They ran the ads and the enquiries arrived. Very few of them closed. When you asked why, the answer was to raise the budget or change the creative — never to look at what happens after the click.",
  },
  {
    n: "02",
    title: "You bought the tools",
    body: "A CRM, an automation platform, a business WhatsApp number. Each one works on its own. Each one got configured halfway. Within two months the team was back to the spreadsheet and a personal phone, because nothing spoke to anything else.",
  },
  {
    n: "03",
    title: "You hired someone to own it",
    body: "A marketing executive to hold it all together. Now they manage the agency and the tools, and they report the same number you were already getting — leads. Not qualified opportunities. Not booked appointments. Leads.",
  },
];

export function ThreeThingsSection() {
  return (
    <section id="three-things" className="section-y band-raised">
      <div className="container-page">
        <Reveal className="max-w-[760px]">
          <span className="eyebrow">Why the last fix didn't hold</span>
          <h2 className="h2-section mt-4">You've already tried three ways to fix this.</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            None of them were wrong. Each one solved a piece of it. The problem is that nobody was
            responsible for connecting the pieces to each other.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {TRIED.map((t) => (
            <Reveal key={t.n} className="card-surface p-6">
              <span className="text-[13px] font-bold tracking-[0.12em] text-muted-2">{t.n}</span>
              <h3 className="mt-3 text-[17px] font-semibold text-fg">{t.title}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.7] text-muted">{t.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal
          className="mt-6 rounded-[16px] border border-border-strong p-[26px] md:p-10"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(62,134,255,0.07), rgba(131,226,78,0.05))",
          }}
        >
          <span className="eyebrow text-electric-soft">The fourth option</span>
          <h3 className="mt-4 text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-fg md:text-[26px]">
            There is a fourth thing nobody has offered you: the connection between them.
          </h3>
          <p className="mt-4 max-w-[760px] text-[15.5px] leading-[1.75] text-muted">
            Every option above buys you a part. An agency buys attention. A tool buys a function. A
            hire buys hours. Not one of them is accountable for the journey a buyer actually takes —
            from the click, through qualification and follow-up, to a confirmed appointment. That
            journey is what decides whether ad spend becomes revenue, and it is the only part nobody
            owns.
          </p>
          <p className="mt-5 text-[15px] font-semibold text-lime">
            That connected journey has a name →
          </p>
        </Reveal>
      </div>
    </section>
  );
}
