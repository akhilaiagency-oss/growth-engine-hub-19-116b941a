import { Star } from "lucide-react";
import { CLIENT_STORIES, GOOGLE_RATING } from "@/data/results";


/** Thin full-width band directly beneath the hero. Not a section. */
export function ProofStrip() {
  return (
    <div
      className="border-y border-border bg-surface"
      style={{ paddingBlock: "22px" }}
      aria-label="Client results summary"
    >
      <div className="container-page flex flex-col items-center gap-4 text-center min-[760px]:flex-row min-[760px]:justify-center min-[760px]:text-left">
        <ul className="flex items-center" aria-hidden="true">
          {CLIENT_STORIES.map((c, i) => (
            <li
              key={c.id}
              className="flex h-[44px] w-[44px] items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-surface-2 text-[12px] font-semibold text-muted-2"
              style={{ marginLeft: i === 0 ? 0 : "-12px" }}
            >
              {c.photoUrl ? (
                <img
                  src={c.photoUrl}
                  alt=""
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                c.initials
              )}
            </li>
          ))}
        </ul>

        <p className="text-[15px] text-muted">
          <strong className="font-semibold text-fg">Four businesses have had this built.</strong>{" "}
          Watch them describe what changed — in their own words.
        </p>

        <a
          href="#results"
          className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-lime underline-offset-4 hover:underline"
        >
          See the results ↓
        </a>

        <div className="w-full border-t border-border pt-4 text-center min-[900px]:w-auto min-[900px]:border-t-0 min-[900px]:border-l min-[900px]:pt-0 min-[900px]:pl-5 min-[900px]:text-left">
          <span className="flex items-center justify-center gap-2 min-[900px]:justify-start">
            <span className="flex gap-0.5" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={14} fill="#F5B captured" style={{ display: "none" }} />
              ))}
            </span>
            <span className="text-[12px] text-muted-2">Google reviews</span>
          </span>
          <span className="mt-1 flex items-baseline justify-center gap-1.5 min-[900px]:justify-start">
            <span className="text-[15px] font-bold text-fg">{GOOGLE_RATING.score}</span>
            <span className="text-[12px] text-muted-2">· {GOOGLE_RATING.reviewCount} reviews</span>
          </span>
        </div>
      </div>
    </div>
  );
}

