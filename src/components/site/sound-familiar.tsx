import { Reveal } from "./reveal";

const QUESTIONS = [
  "You get back from a site visit, open your phone, and there are twelve enquiries waiting — and no way to tell which of them are still worth calling.",
  "You find a three-day-old message in WhatsApp and genuinely cannot remember whether you replied to it.",
  "The agency's report arrives every month looking healthy, while your calendar keeps looking the same.",
  "By evening you have no idea how many opportunities slipped away today — only that some did.",
];

export function SoundFamiliar() {
  return (
    <section id="sound-familiar" className="band-base py-[40px] min-[900px]:py-[56px]">
      <div className="container-page mx-auto max-w-[900px]">
        <Reveal>
          <span className="eyebrow">Sound familiar?</span>
          <h2 className="mt-4 text-[26px] leading-[1.15] font-extrabold tracking-[-0.025em] text-fg">
            Four questions worth sitting with for a moment.
          </h2>
        </Reveal>

        <ul className="mt-6">
          {QUESTIONS.map((q, i) => (
            <Reveal
              key={q}
              className={i < QUESTIONS.length - 1 ? "border-b border-border" : ""}
            >
              <div className="grid grid-cols-[26px_1fr] gap-[14px] py-[14px] min-[900px]:py-[18px]">
                <span
                  aria-hidden="true"
                  className="text-[20px] leading-[1.3] font-extrabold text-lime"
                >
                  ?
                </span>
                <p className="text-[15px] leading-[1.5] font-medium text-fg min-[900px]:text-[17px]">
                  {q}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-[28px] text-center">
          <p className="text-[17px] font-medium text-fg">
            If even one of these is true, you're not doing anything wrong. Almost every business
            that spends on ads ends up here.
          </p>
        </Reveal>

        <Reveal className="mt-[12px] text-center text-[15px] text-muted">
          <p>
            <strong className="font-semibold text-fg">
              You don't have a lead problem. You have a follow-up problem
            </strong>{" "}
            — and it shows up at five specific points.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
