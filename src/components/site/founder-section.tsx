import { Check } from "lucide-react";
import portrait from "@/assets/akhil-portrait-4x5.jpg";
import { Reveal } from "./reveal";


const WORKS = [
  "AI-first growth systems strategist",
  "Client acquisition systems builder",
  "Funnel strategist",
  "Conversion-focused operator",
  "Technology + marketing systems thinker",
];

export function FounderSection() {
  return (
    <section id="founder" className="section-y band-raised">
      <div className="container-page">
        <div className="grid items-start gap-10 min-[900px]:grid-cols-[0.85fr_1.15fr] min-[900px]:gap-[56px]">
          <Reveal className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-3 blur-2xl sm:-inset-8"
              style={{
                backgroundImage:
                  "radial-gradient(320px 260px at 12% 8%, rgba(62,134,255,0.20), transparent 65%), radial-gradient(320px 260px at 88% 92%, rgba(131,226,78,0.16), transparent 65%)",
              }}
            />
            <div
              className="relative overflow-hidden rounded-[16px] border border-border-strong"
              style={{ boxShadow: "0 30px 70px -30px rgba(0,0,0,0.85)" }}
            >
              <div className="relative aspect-[4/5] w-full">
                <img
                  src={portrait}
                  alt="Akhil Srivastava, Founder of Growth Multiplier AI"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div

                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[56%]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, var(--surface) 0%, rgba(14,21,38,0.75) 40%, transparent 100%)",
                  }}
                />
                <span className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-border-strong bg-[rgba(7,11,20,0.6)] px-3 py-1.5 text-[12px] font-semibold md:text-[12px] tracking-[0.16em] text-fg uppercase backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden="true" />
                  Founder
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span
                    className="block h-[2px] w-9 bg-lime"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-[20px] font-bold tracking-[-0.015em] text-fg">
                    Akhil Srivastava
                  </p>
                  <p className="mt-1 text-[12px] text-muted">Founder, Growth Multiplier AI</p>
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-[16px] border border-border bg-surface-2 p-5">
              <p className="text-[12px] font-semibold md:text-[12px] tracking-[0.16em] text-muted-2 uppercase">
                How Akhil works
              </p>
              <ul className="mt-4 grid gap-3">
                {WORKS.map((w) => (
                  <li key={w} className="flex items-start gap-2.5 text-[15px] text-muted">
                    <Check size={16} className="mt-0.5 shrink-0 text-lime" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-5 rounded-[16px] border border-border bg-surface-2 p-5">
              <h3 className="text-[15px] font-bold tracking-[-0.01em] text-fg">
                System-first, not service-first
              </h3>
              <p className="mt-2 text-[15px] text-muted">
                Most agencies sell a deliverable. We build the connected system those pieces
                belong to, because a great landing page attached to slow follow-up still loses.
              </p>
            </div>

          </Reveal>

          <Reveal>
            <span className="eyebrow">Founder-led</span>
            <h2 className="mt-4 text-[26px] leading-[1.15] font-extrabold tracking-[-0.025em] text-fg md:text-[40px]">
              Built By Someone Who Thinks In Systems.
            </h2>

            <div
              className="founder-story mt-5"
              style={{ borderLeft: "2px solid var(--lime)" }}
            >
              <p className="text-[17px] font-medium text-fg">
                For a few years, everything I sold, I sold by hand.
              </p>
              <p className="mt-[14px] text-[15px] text-muted">
                Facebook groups, WhatsApp communities, cold outreach — one conversation at a time.
                It worked. A single online sale of{" "}
                <b className="font-semibold text-fg">₹70,000</b>. Around{" "}
                <b className="font-semibold text-fg">₹2–2.5 lakh</b> through referral programmes for
                Upstox, Angel One and 5Paisa, running a team of 10–15 people I built during COVID.
                Close to <b className="font-semibold text-fg">₹1 lakh</b> more from affiliate work.
                All of it organic. I never spent a rupee on ads.
              </p>
              <p className="mt-[14px] text-[15px] text-muted">
                It was also exhausting, and completely unpredictable.
              </p>
              <p className="mt-[14px] text-[15px] text-muted">
                What bothered me most wasn't the hours. It was watching interested people quietly
                disappear. Someone would reply, I'd get pulled into something else, and by the time
                I came back they had gone cold. Some I forgot entirely. Some were ready to buy and I
                never found out.
              </p>
              <p
                className="founder-pull text-[17px] font-semibold text-fg"
                style={{
                  borderTop: "1px solid var(--border)",
                  borderBottom: "1px solid var(--border)",
                  padding: "14px 0",
                  marginTop: "20px",
                  marginBottom: "16px",
                }}
              >
                I wasn't losing them because I couldn't generate interest. I was losing them because
                nothing caught that interest after it arrived.
              </p>
              <p className="text-[15px] text-muted">
                That is the entire idea behind Growth Multiplier AI. Generating attention was never
                the hard part — what happens in the minutes and days afterwards is where the money
                actually goes. Once I saw that, I stopped trying to work harder and started building
                the thing that should have been doing the work: responding, qualifying, following up
                and booking, every time, without depending on me remembering.
              </p>
              <p className="mt-4 text-[12px] font-semibold tracking-[0.1em] text-muted-2 uppercase">
                Akhil Srivastava — Founder
              </p>
            </div>


            <div className="mt-8 flex flex-col gap-5 border-t border-border pt-6">
              <div>
                <h3 className="text-[15px] font-bold tracking-[-0.01em] text-fg">
                  You talk to the person doing the work
                </h3>
                <p className="mt-2 text-[15px] text-muted">
                  Akhil runs the strategy call and stays involved in delivery. No handoff to a
                  junior account manager after you sign.
                </p>
              </div>
            </div>



            <p className="mt-6 text-[15px] text-muted">
              Which is why an engagement starts with your funnel rather than our service list — and
              why Akhil runs the strategy call himself instead of routing it to a sales team.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Founder-led delivery", "Strategy-driven engagements"].map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-[12px] text-muted md:text-[12px]"
                >
                  {p}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
