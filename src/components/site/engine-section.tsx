import { MeasurementChain } from "./measurement-chain";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { ENGINE_STAGES, type EngineStage } from "@/data/engine";
import { Reveal } from "./reveal";

const CHEVRON_TOP = [217, 416, 615, 814];
const CHEVRON_BOTTOM = [789, 524, 259];

function Node({
  stage,
  active,
  onSelect,
}: {
  stage: EngineStage;
  active: boolean;
  onSelect: () => void;
}) {
  const isTop = stage.y === 100;
  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={`${stage.number} ${stage.name}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="group cursor-pointer outline-none"
    >
      <text
        x={stage.x}
        y={isTop ? 58 : 278}
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        letterSpacing="1.4"
        fill={active ? "var(--fg)" : "var(--muted)"}
        className="transition-colors group-hover:fill-[var(--fg)] group-focus-visible:fill-[var(--fg)]"
      >
        {stage.name}
      </text>
      <circle
        cx={stage.x}
        cy={stage.y}
        r={26}
        fill={active ? "var(--lime)" : "var(--surface-2)"}
        stroke={
          active
            ? "var(--lime)"
            : isTop
              ? "var(--border-strong)"
              : "rgba(131,226,78,0.4)"
        }
        strokeWidth="1.5"
        className="transition-colors group-hover:stroke-[var(--cyan)] group-focus-visible:stroke-[var(--cyan)]"
      />
      <text
        x={stage.x}
        y={stage.y + 5}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill={active ? "var(--lime-ink)" : isTop ? "var(--cyan)" : "var(--lime)"}
        className="pointer-events-none"
      >
        {stage.number}
      </text>

    </g>
  );
}

export function EngineSection() {
  const [activeId, setActiveId] = useState(ENGINE_STAGES[0]!.id);
  const active = ENGINE_STAGES.find((s) => s.id === activeId)!;

  return (
    <section
      id="engine"
      className="section-y band-raised"
      style={{
        backgroundImage:
          "radial-gradient(760px 320px at 50% 0%, rgba(62,134,255,0.10), transparent 68%), radial-gradient(560px 260px at 78% 12%, rgba(63,220,232,0.06), transparent 66%)",
      }}
    >
      <div className="container-page">
        <Reveal className="max-w-[760px]">
          <span className="eyebrow">Our proprietary system</span>
          <h2 className="h2-section mt-4">The Growth Multiplier Engine™</h2>
          <p className="mt-4 text-[17px] text-muted">
            Seven stages built as one closed loop. Five carry a stranger from first impression to a
            confirmed appointment; two feed everything learned back into the start.
          </p>
        </Reveal>

        <Reveal className="mt-8 rounded-[16px] border border-border bg-bg p-5 md:p-8">
          {/* Desktop loop diagram */}
          <div className="hidden min-[820px]:block">
            <svg
              viewBox="0 0 1040 330"
              width="100%"
              className="h-auto w-full"
              role="img"
              aria-label="The Growth Multiplier Engine closed loop: Attract, Convert, Qualify, Nurture and Book run along the forward path; Measure and Optimize run along the return path, feeding back into Attract."
            >
              <path
                d="M122,100 L918,100 A62.5,62.5 0 0 1 918,225 L122,225 A62.5,62.5 0 0 1 122,100"
                fill="none"
                stroke="var(--border-strong)"
                strokeWidth="1.5"
              />
              {/* Forward arc */}
              <path
                d="M122,100 L918,100 A62.5,62.5 0 0 1 918,225"
                fill="none"
                stroke="var(--cyan)"
                strokeOpacity="0.55"
                strokeWidth="1.5"
              />
              {/* Return arc — dashed, marching back toward Attract */}
              <path
                className="engine-return-path"
                d="M918,225 L122,225 A62.5,62.5 0 0 1 122,100"
                fill="none"
                stroke="var(--lime)"
                strokeOpacity="0.75"
                strokeWidth="1.6"
                strokeDasharray="6 8"
              />

              {CHEVRON_TOP.map((x) => (
                <path
                  key={`t${x}`}
                  d={`M${x},94 L${x + 9},100 L${x},106`}
                  fill="none"
                  stroke="var(--cyan)"
                  strokeOpacity="0.55"
                  strokeWidth="1.6"
                />
              ))}
              {CHEVRON_BOTTOM.map((x) => (
                <path
                  key={`b${x}`}
                  d={`M${x},219 L${x - 9},225 L${x},231`}
                  fill="none"
                  stroke="var(--lime)"
                  strokeOpacity="0.8"
                  strokeWidth="1.6"
                />
              ))}

              <text
                x="520"
                y="22"
                textAnchor="middle"
                fontSize="12"
                letterSpacing="1.6"
                fill="var(--muted-2)"
              >
                FORWARD PATH — STRANGER TO BOOKED APPOINTMENT
              </text>
              <text
                x="520"
                y="318"
                textAnchor="middle"
                fontSize="12"
                letterSpacing="1.6"
                fill="var(--lime)"
                fillOpacity="0.8"
              >
                RETURN PATH — WHAT WE LEARN GOES BACK IN
              </text>


              <text
                x="520"
                y="157"
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                letterSpacing="2.4"
                fill="var(--fg)"
              >
                GROWTH MULTIPLIER ENGINE™
              </text>
              <text x="520" y="179" textAnchor="middle" fontSize="12" fill="var(--muted-2)">
                One connected acquisition loop
              </text>

              {ENGINE_STAGES.map((s) => (
                <Node
                  key={s.id}
                  stage={s}
                  active={s.id === activeId}
                  onSelect={() => setActiveId(s.id)}
                />
              ))}
            </svg>
          </div>

          {/* Mobile vertical flow — the full loop, legible without the SVG */}
          <div className="min-[820px]:hidden">
            <ol
              aria-label="The seven stages of the Growth Multiplier Engine"
              className="relative"
            >

              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-[24px] bottom-[34px] left-[17px] w-[2px]"
                style={{ background: "linear-gradient(180deg, var(--cyan), rgba(131,226,78,0.5))" }}
              />
              {ENGINE_STAGES.map((s) => {
                const isFirst = s.number === "01";
                const isReturn = s.phase === "RETURN PATH";
                return (
                  <li
                    key={s.id}
                    className="relative grid grid-cols-[36px_1fr] items-start gap-[14px] py-[12px]"
                  >
                    <span
                      className="z-[2] flex h-9 w-9 items-center justify-center rounded-full border-2 text-[13px] font-bold"
                      style={{
                        background: isFirst ? "var(--lime)" : "var(--surface-2)",
                        borderColor: isFirst
                          ? "var(--lime)"
                          : isReturn
                            ? "rgba(131,226,78,0.5)"
                            : "rgba(255,255,255,0.18)",
                        color: isFirst
                          ? "var(--lime-ink)"
                          : isReturn
                            ? "var(--lime)"
                            : "var(--cyan)",
                      }}
                    >
                      {s.number}
                    </span>
                    <div className="min-w-0">
                      <span className="block text-[13px] font-bold tracking-[0.09em] text-fg uppercase">
                        {s.name}
                      </span>
                      <span className="mt-1 block text-[13px] leading-[1.5] text-muted">
                        {s.title}
                      </span>
                    </div>
                  </li>
                );
              })}
              <li className="relative grid grid-cols-[36px_1fr] items-start gap-[14px] py-[12px]">
                <span
                  aria-hidden="true"
                  className="z-[2] flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed text-[15px]"
                  style={{
                    background: "var(--surface-2)",
                    borderColor: "rgba(131,226,78,0.5)",
                    color: "var(--lime)",
                  }}
                >
                  ↺
                </span>
                <div className="min-w-0">
                  <span className="block text-[13px] font-bold tracking-[0.09em] text-fg uppercase">
                    Back to Attract
                  </span>
                  <span className="mt-1 block text-[13px] leading-[1.5] text-muted">
                    What we measure and optimise feeds straight back into the top.
                  </span>
                </div>
              </li>
            </ol>
          </div>


          {/* Scannable stage list — all seven readable without interaction */}
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ENGINE_STAGES.map((s) => {
              const isActive = s.id === activeId;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveId(s.id)}
                    className="flex h-full w-full flex-col rounded-[8px] border-l-2 p-3 text-left transition-colors"
                    style={{
                      borderLeftColor: isActive ? "var(--lime)" : "var(--border)",
                      background: isActive ? "var(--surface-2)" : "transparent",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-lime md:text-[12px]">
                        {s.number}
                      </span>
                      <span className="text-[12px] font-semibold tracking-[1px] text-fg">
                        {s.name}
                      </span>
                    </span>
                    <span className="mt-1 line-clamp-2 text-[12px] leading-snug text-muted">
                      {s.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Shared detail panel */}
          <div
            aria-live="polite"
            className="mt-8 rounded-[12px] border border-border bg-surface-2 p-5 md:p-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-lime text-[12px] font-bold text-lime-ink md:text-[12px]">
                {active.number}
              </span>
              <span className="text-[12px] font-semibold tracking-[2px] text-fg">
                {active.name}
              </span>
              <span className="text-[12px] tracking-[1.6px] md:text-[12px] text-muted-2 uppercase">
                {active.phase}
              </span>
            </div>
            <h3 className="mt-4 text-[20px] font-bold tracking-[-0.015em] text-fg">
              {active.title}
            </h3>
            <p className="mt-3 max-w-[760px] text-[15px] text-muted">
              {active.body}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {active.chips.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-[12px] text-muted md:text-[12px]"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="mt-6 rounded-[12px] border border-border bg-bg p-6">
          <MeasurementChain />
        </Reveal>

        <Reveal className="mt-6 rounded-[12px] border border-border bg-bg p-6">

          <p
            className="text-[17px]"
            style={{ borderLeft: "2px solid var(--lime)", paddingLeft: "18px" }}
          >
            <span className="text-[20px] font-semibold text-fg">
              We don't just run marketing channels.
            </span>{" "}
            <span className="font-normal text-muted">
              We connect the acquisition journey — so no stage hands the next one a problem it can't
              solve.
            </span>
          </p>
        </Reveal>

      </div>
    </section>
  );
}
