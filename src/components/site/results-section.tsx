import { useState } from "react";
import { Play } from "lucide-react";
import { CLIENT_STORIES, PORTFOLIO, type ClientStory, type PortfolioItem } from "@/data/results";
import { Reveal } from "./reveal";

function StoryCard({ story }: { story: ClientStory }) {
  const [playing, setPlaying] = useState(false);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[12px] border border-border bg-surface">
      <div
        className="relative w-full overflow-hidden bg-surface-2"
        style={{ aspectRatio: "16 / 9" }}
      >
        {playing && story.videoUrl ? (
          <video
            controls
            autoPlay
            playsInline
            src={story.videoUrl}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            {story.thumbnailUrl ? (
              <img
                src={story.thumbnailUrl}
                alt=""
                width={640}
                height={360}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-[12px] tracking-[0.12em] text-muted-2 uppercase">
                Video thumbnail placeholder
              </span>
            )}
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play the video story from ${story.name}`}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-lime text-lime-ink">
                <Play size={22} fill="currentColor" />
              </span>
            </button>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[23px] leading-[1.15] font-extrabold text-lime">{story.stat}</p>
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted italic">“{story.quote}”</p>

        <ul className="mt-4 grid grid-cols-2 gap-3">
          {[0, 1].map((i) => {
            const src = story.chatUrls?.[i];
            return (
              <li
                key={i}
                className="overflow-hidden rounded-[8px] border border-border bg-surface-2"
                style={{ aspectRatio: "3 / 4" }}
              >
                {src ? (
                  <img
                    src={src}
                    alt={`Message thread backing the result reported by ${story.name}`}
                    width={300}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center px-2 text-center text-[12px] text-muted-2">
                    Chat screenshot
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-auto flex items-center gap-3 border-t border-border pt-4" style={{ marginTop: "auto" }}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-2 text-[12px] font-semibold text-muted-2">
            {story.photoUrl ? (
              <img
                src={story.photoUrl}
                alt=""
                width={36}
                height={36}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              story.initials
            )}
          </span>
          <span>
            <span className="block text-[14px] font-semibold text-fg">{story.name}</span>
            <span className="block text-[12px] text-muted-2">
              {story.businessType} · {story.city}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}

function WorkCard({ item }: { item: PortfolioItem }) {
  return (
    <article className="overflow-hidden rounded-[12px] border border-border bg-surface">
      <div className="overflow-hidden rounded-[10px] border border-border bg-bg" style={{ margin: "16px 16px 0" }}>
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <span aria-hidden="true" className="flex gap-1.5">
            {["#FF6B5E", "#F59E0B", "#83E24E"].map((c) => (
              <span key={c} className="h-2 w-2 rounded-full" style={{ background: c }} />
            ))}
          </span>
          <span className="flex-1 truncate rounded-[6px] bg-surface-2 px-2 py-1 text-[12px] text-muted-2">
            {item.url}
          </span>
        </div>
        <div className="relative w-full bg-surface-2" style={{ aspectRatio: "16 / 10" }}>
          {item.screenshotUrl ? (
            <img
              src={item.screenshotUrl}
              alt={`${item.title} — acquisition system screenshot`}
              width={640}
              height={400}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-[12px] tracking-[0.12em] text-muted-2 uppercase">
              Screenshot placeholder
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <span className="text-[12px] font-semibold tracking-[0.14em] text-lime uppercase">
          {item.tag}
        </span>
        <h3 className="mt-2 text-[17px] font-bold tracking-[-0.01em] text-fg">{item.title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{item.line}</p>
      </div>
    </article>
  );
}

export function ResultsSection() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section id="results" className="section-y band-raised">
      <div className="container-page">
        <Reveal className="head max-w-[760px]">
          <span className="eyebrow">Client results</span>
          <h2 className="h2-section mt-4">What happened after the system went in</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Four businesses, in their own words. Each clip is unedited, and each claim is backed by
            the message thread underneath it.
          </p>
        </Reveal>

        <div className="grid gap-5 min-[900px]:grid-cols-2">
          {CLIENT_STORIES.map((s, i) => (
            <Reveal
              key={s.id}
              className={i > 1 && !showAll ? "hidden min-[900px]:block" : ""}
            >
              <StoryCard story={s} />
            </Reveal>
          ))}
        </div>

        {!showAll && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="mt-5 flex min-h-[48px] w-full items-center justify-center rounded-[10px] border border-border-strong text-[14.5px] font-semibold text-fg transition-colors hover:border-lime hover:text-lime min-[900px]:hidden"
          >
            Show all 4 client stories
          </button>
        )}

        <p className="mt-5 text-center text-[12.5px] leading-relaxed text-muted-2">
          Figures are as reported by each client and published with their permission. Results vary
          by business, offer and market.
        </p>

        <Reveal className="head mt-14 max-w-[760px]">
          <span className="eyebrow">Selected work</span>
          <h2 className="h2-section mt-4">Acquisition systems we've built</h2>
        </Reveal>

        <div className="grid gap-5 min-[900px]:grid-cols-2">
          {PORTFOLIO.map((p, i) => (
            <Reveal
              key={p.id}
              className={i > 1 && !showAll ? "hidden min-[900px]:block" : ""}
            >
              <WorkCard item={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
