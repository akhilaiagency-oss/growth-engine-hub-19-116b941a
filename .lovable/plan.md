# Wire the VSL YouTube link into the Hero

No video generation, no credits — just a URL string paste.

## Change
1. Create `src/data/vsl.ts` with a single exported constant:
   ```ts
   export const VSL_URL = "PASTE_YOUR_YOUTUBE_URL_HERE";
   ```
2. In `src/components/site/hero.tsx`, import it and pass it to the slot:
   ```tsx
   import { VSL_URL } from "@/data/vsl";
   // ...
   <VslSlot videoUrl={VSL_URL} />
   ```
   (Line 74, currently `<VslSlot />`.)

## What this does
- `VslSlot` detects `youtu.be` / `youtube.com` and renders an `<iframe>` embed automatically — no code change needed in `vsl-slot.tsx`.
- One drop-in point (`src/data/vsl.ts`) so a later real-file or Vimeo swap touches a single line.

## Scope
Presentational only. No backend, payment, booking, webhook, or RLS files touched. No migrations.

## When you approve
I'll create `src/data/vsl.ts` with the placeholder `PASTE_YOUR_YOUTUBE_URL_HERE` and wire the hero. You then paste your actual YouTube URL into that one constant (or tell me the URL and I'll fill it in).
