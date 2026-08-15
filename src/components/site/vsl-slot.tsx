import { useState } from "react";
import { Play } from "lucide-react";
import { VSL_POSTER_URL, VSL_YOUTUBE_ID, resolveYoutubeId } from "@/data/vsl";

interface VslSlotProps {
  /** Optional override — bare YouTube ID or a full YouTube URL. */
  videoId?: string;
}

/**
 * Click-to-play facade. No YouTube iframe or third-party script is loaded
 * until the visitor actively plays the video.
 */
export function VslSlot({ videoId }: VslSlotProps) {
  const id = resolveYoutubeId(videoId ?? VSL_YOUTUBE_ID);
  const [playing, setPlaying] = useState(false);
  const [posterFallback, setPosterFallback] = useState(false);

  const poster =
    VSL_POSTER_URL ||
    `https://i.ytimg.com/vi/${id}/${posterFallback ? "hqdefault" : "maxresdefault"}.jpg`;

  return (
    <div className="mx-auto w-full max-w-[760px]">
      <div
        className="relative aspect-video w-full overflow-hidden rounded-[12px] bg-surface-2"
        style={
          id
            ? { border: "1px solid var(--border-strong)" }
            : {
                border: "1px dashed var(--border-strong)",
                backgroundImage:
                  "radial-gradient(520px 260px at 50% 30%, rgba(62,134,255,0.16), transparent 66%)",
              }
        }
      >
        {!id ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="flex h-[66px] w-[66px] items-center justify-center rounded-full bg-lime text-lime-ink">
              <Play size={26} fill="currentColor" />
            </span>
            <span className="text-[14.5px] font-semibold text-fg">
              Watch: how the acquisition system works
            </span>
            <span className="text-[12.5px] text-muted-2">VSL slot — your video goes here.</span>
          </div>
        ) : playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title="Growth Multiplier AI walkthrough"
            allow="accelerated-media; autoplay; encrypted-media"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Play video: how the acquisition system works"
            className="group absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center"
          >
            <img
              src={poster}
              alt=""
              loading="eager"
              onError={() => setPosterFallback(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(7,11,20,0.28) 0%, rgba(7,11,20,0.10) 40%, rgba(7,11,20,0.55) 100%)",
              }}
            />
            <span className="relative flex h-[66px] w-[66px] items-center justify-center rounded-full bg-lime text-lime-ink transition-shadow group-hover:shadow-[var(--shadow-cta-hover)]">
              <Play size={26} fill="currentColor" />
            </span>
          </button>
        )}
      </div>
      <p className="mt-3 text-center text-[12.5px] text-muted">
        A short walkthrough of how the system works — then book your call below.
      </p>
    </div>
  );
}
