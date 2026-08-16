import { Play } from "lucide-react";

interface VslSlotProps {
  videoUrl?: string;
}

export function VslSlot({ videoUrl }: VslSlotProps) {
  const isYoutube = !!videoUrl && /youtu\.?be/.test(videoUrl);

  return (
    <div className="mx-auto w-full max-w-full min-[900px]:max-w-[640px]">
      <div
        className="relative w-full overflow-hidden rounded-[12px] bg-surface-2"
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
          isYoutube ? (
            <iframe
              src={videoUrl}
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
            <span className="text-[12px] text-muted-2">VSL slot — your video goes here.</span>
          </div>
        )}
      </div>
      <p className="mt-3 hidden text-center text-[12px] text-muted min-[900px]:block">
        A short walkthrough of how the system works — then book your call below.
      </p>
    </div>
  );
}
