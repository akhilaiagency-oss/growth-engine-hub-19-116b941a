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
        fontSize="11.5"
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
        stroke={active ? "var(--lime)" : "var(--border-strong)"}
        strokeWidth="1.5"
        className="transition-colors group-hover:stroke-[var(--cyan)] group-focus-visible:stroke-[var(--cyan)]"
      />
      <text
        x={stage.x}
        y={stage.y + 5}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill={active ? "var(--lime-ink)" : "var(--cyan)"}
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
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Seven stages built as one closed loop. Five carry a stranger from first impression to a
            confirmed appointment; two feed everything learned back into the start.
          </p>
        </Reveal>

        <Reveal className="mt-10 rounded-[16px] border border-border bg-bg p-5 md:p-8">
          {/* Desktop loop diagram */}
          <div className="hidden min-[820px]:block">
            <svg
              viewBox="0 0 1040 330"
              width="100%"
              className="h-auto w-full"
              role="group"
              aria-label="The Growth Multiplier Engine closed loop"
            >
              <path
                d="M122,100 L918,100 A62.5,62.5 0 0 1 918,225 L122,225 A62.5,62.5 0 0 1 122,100"
                fill="none"
                stroke="var(--border-strong)"
                strokeWidth="1.5"
              />
              <path
                d="M122,100 L918,100 A62.5,62.5 0 0 1 918,225 L122,225 A62.5,62.5 0 0 1 122,100"
                fill="none"
                stroke="var(--cyan)"
                strokeOpacity="0.55"
                strokeWidth="1.5"
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
                  stroke="var(--cyan)"
                  strokeOpacity="0.55"
                  strokeWidth="1.6"
                />
              ))}

              <text
                x="520"
                y="22"
                textAnchor="middle"
                fontSize="10"
                letterSpacing="1.6"
                fill="var(--muted-2)"
              >
                FORWARD PATH — STRANGER TO BOOKED APPOINTMENT
              </text>
              <text
                x="520"
                y="318"
                textAnchor="middle"
                fontSize="10"
                letterSpacing="1.6"
                fill="var(--muted-2)"
              >
                RETURN PATH — WHAT WE LEARN GOES BACK IN
              </text>

              <text
                x="520"
                y="157"
                textAnchor="middle"
                fontSize="14"
                fontWeight="700"
                letterSpacing="2.4"
                fill="var(--fg)"
              >
                GROWTH MULTIPLIER ENGINE™
              </text>
              <text x="520" y="179" textAnchor="middle" fontSize="11.5" fill="var(--muted-2)">
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

          {/* Mobile timeline */}
          <div className="min-[820px]:hidden">
            <ul className="relative flex flex-col gap-4 pl-1">
              {ENGINE_STAGES.map((s) => {
                const isActive = s.id === activeId;
                return (
                  <li key={s.id} className="relative flex items-center gap-4">
                    <span
                      className="absolute top-8 bottom-[-16px] left-4 w-[1.5px]"
                      style={{ background: "var(--border-strong)" }}
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveId(s.id)}
                      className="relative z-10 flex items-center gap-4 text-left"
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[12px] font-bold md:text-[11px]"
                        style={{
                          background: isActive ? "var(--lime)" : "var(--surface-2)",
                          borderColor: isActive ? "var(--lime)" : "var(--border-strong)",
                          color: isActive ? "var(--lime-ink)" : "var(--cyan)",
                        }}
                      >
                        {s.number}
                      </span>
                      <span
                        className="text-[12.5px] font-semibold tracking-[1.2px]"
                        style={{ color: isActive ? "var(--fg)" : "var(--muted)" }}
                      >
                        {s.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 flex items-center gap-3 rounded-[8px] border border-dashed border-border-strong p-3">
              <RefreshCw size={16} className="shrink-0 text-cyan" />
              <p className="text-[12.5px] leading-relaxed text-muted">
                What we measure and optimise feeds straight back into Attract.
              </p>
            </div>
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
                      <span className="text-[12px] font-bold text-lime md:text-[11px]">
                        {s.number}
                      </span>
                      <span className="text-[12.5px] font-semibold tracking-[1px] text-fg">
                        {s.name}
                      </span>
                    </span>
                    <span className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-muted">
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
              <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-lime text-[12px] font-bold text-lime-ink md:text-[11px]">
                {active.number}
              </span>
              <span className="text-[12px] font-semibold tracking-[2px] text-fg">
                {active.name}
              </span>
              <span className="text-[12px] tracking-[1.6px] md:text-[11px] text-muted-2 uppercase">
                {active.phase}
              </span>
            </div>
            <h3 className="mt-4 text-[19px] font-bold tracking-[-0.015em] text-fg">
              {active.title}
            </h3>
            <p className="mt-3 max-w-[760px] text-[14.5px] leading-relaxed text-muted">
              {active.body}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {active.chips.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-[12.5px] text-muted md:text-[11.5px]"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="mt-6 rounded-[12px] border border-border bg-bg p-6">
          <p
            className="text-[16px] leading-relaxed"
            style={{ borderLeft: "2px solid var(--lime)", paddingLeft: "18px" }}
          >
            <span className="text-[19px] font-semibold text-fg">
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
