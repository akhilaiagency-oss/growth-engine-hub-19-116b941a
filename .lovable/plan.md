# Fix: YouTube video not showing in the hero

## Why it's blank

The link saved in `src/data/vsl.ts` is a **share link**:

```
https://youtu.be/Hmtkr_qZsGI?si=9Xg1pFp32pevVq8z
```

YouTube refuses to load share/watch links inside an embedded player frame — only
`https://www.youtube.com/embed/<id>` URLs are allowed. The hero passes the share
link straight into the frame, so the browser loads nothing and you see an empty
rectangle.

## The fix

Add a small URL normaliser inside `src/components/site/vsl-slot.tsx` that converts
any YouTube link into its embed form before rendering:

- `youtu.be/<id>?si=...` → `youtube.com/embed/<id>`
- `youtube.com/watch?v=<id>` → `youtube.com/embed/<id>`
- already-embed URLs pass through unchanged
- non-YouTube URLs (an MP4 file later) keep using the normal video player

Embed params added for a clean premium look: `rel=0`, `modestbranding=1`,
`playsinline=1`. No autoplay, no ambient motion.

This means `src/data/vsl.ts` stays exactly as you pasted it — you can keep
pasting plain share links in future and it will just work.

## Scope

- `src/components/site/vsl-slot.tsx` — one helper function plus the `src` change.
- Nothing else. No backend, payment, booking, webhook, capacity or route files touched.
  No migrations.

## Verification

Typecheck, then load the page and confirm the frame resolves to
`youtube.com/embed/Hmtkr_qZsGI` and the poster thumbnail paints.
