/** Paste the YouTube video ID here (the part after v= or youtu.be/). Leave empty to show the placeholder. */
export const VSL_YOUTUBE_ID = "";

/** Optional: overrides the auto-generated YouTube thumbnail. */
export const VSL_POSTER_URL = "";

/**
 * Accepts a bare YouTube ID or a full URL (watch?v=, youtu.be/, /embed/)
 * and returns the bare ID. Returns "" when nothing usable is provided.
 */
export function resolveYoutubeId(input: string): string {
  const value = (input || "").trim();
  if (!value) return "";

  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{6,})/,
    /youtu\.be\/([A-Za-z0-9_-]{6,})/,
    /\/embed\/([A-Za-z0-9_-]{6,})/,
    /\/shorts\/([A-Za-z0-9_-]{6,})/,
  ];
  for (const re of patterns) {
    const m = value.match(re);
    if (m?.[1]) return m[1];
  }

  if (/^[A-Za-z0-9_-]{6,}$/.test(value)) return value;
  return "";
}
