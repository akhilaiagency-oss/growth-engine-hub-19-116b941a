import { Play } from "lucide-react";

interface VslSlotProps {
  videoUrl?: string;
}

function toYoutubeEmbed(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^www\./, "");
  let id = "";
  if (host === "youtu.be") {
    id = parsed.pathname.slice(1);
  } else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (parsed.pathname.startsWith("/embed/")) return url;
    if (parsed.pathname === "/watch") id = parsed.searchParams.get("v") ?? "";
    else if (parsed.pathname.startsWith("/shorts/")) id = parsed.pathname.split("/")[2] ?? "";
  }
  if (!/^[\w-]{6,}$/.test(id)) return null;
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
}

export function VslSlot({ videoUrl }: VslSlotProps) {
  const embedUrl = videoUrl ? toYoutubeEmbed(videoUrl) : null;

  return (
    <div className="w-full max-w-none">
      <div
        className="relative w-full overflow-hidden rounded-[8px] bg-surface-2 min-[900px]:rounded-[12px]"
        style={
          videoUrl
            ? { aspectRatio: "16 / 9", border: "1px solid var(--border-strong)" }
            : {
                aspectRatio: "16 / 9",
                border: "1px dashed var(--border-strong)",
                backgroundImage:
                  "radial-gradient(520px 260px at 50% 30%, rgba(62,134,255,0.16), transparent 66%)",
              }
        }
      >
        {videoUrl ? (
          embedUrl ? (
            <iframe
              src={embedUrl}
              title="Growth Multiplier AI walkthrough"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <video
              controls
              playsInline
              src={videoUrl}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="flex h-[66px] w-[66px] items-center justify-center rounded-full bg-lime text-lime-ink">
              <Play size={26} fill="currentColor" />
            </span>
            <span className="text-[15px] font-semibold text-fg">
              Watch: how the acquisition system works
            </span>
            <span className="text-[13px] text-muted-2">VSL slot — your video goes here.</span>
          </div>
        )}
      </div>
      <p className="mt-3 hidden text-center text-[12px] text-muted min-[900px]:block">
        A short walkthrough of how the system works — then book your call below.
      </p>
    </div>
  );
}
