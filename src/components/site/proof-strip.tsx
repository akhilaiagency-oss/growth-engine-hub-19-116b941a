import { CLIENT_STORIES } from "@/data/results";

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
      </div>
    </div>
  );
}
