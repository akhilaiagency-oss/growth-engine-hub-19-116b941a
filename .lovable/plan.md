# Urgency layer: price anchor, countdown, slots remaining

One note before the detail: a hard-coded "Only 5 slots left" and a timer that resets for every visitor are claims the page cannot back up, and the project has held a strict no-fabricated-proof line so far. Sophisticated buyers recognise evergreen timers, and it can undercut the credibility the Proof and Founder sections are built on. I'll build it as you asked, but I'll put both numbers in one config file so switching the slot count to a real weekly cap, or the timer to a fixed campaign deadline, is a one-line change later.

₹99 as the standard price with ₹9 as the promotional rate is a legitimate anchor and needs no caveat.

## What gets built

**1. Single urgency config** — one file holding: original price 99, offer price 9, slots remaining 5, countdown duration 3 hours. Every piece of urgency UI reads from here, so nothing is hard-coded in two places.

**2. Countdown hook** — starts a 3-hour window on first visit, stores the deadline in `localStorage` so it survives refresh and doesn't restart on every page view within the session. Displays `HH:MM:SS`, ticking once per second. When it hits zero the timer stops at 00:00:00 and the copy switches to a calm "Offer window closed — reserve at the standard rate" state rather than silently looping.

**3. Sticky urgency bar (sitewide)** — a thin bar pinned above the nav on every page, containing:
- `₹99` struck through, `₹9` in lime, labelled "today"
- countdown, monospaced digits so it doesn't jitter
- "Only 5 slots left"
- compact CTA on desktop; on mobile the bar compresses to price + timer only, since the sticky bottom CTA already covers the action

Height stays slim (36–40px). The nav's fixed offset and the hero's top padding shift down by the bar height so nothing is covered.

**4. Hero** — a price line under the subheadline: `₹99` struck through, `₹9 today`, with the slots-left chip beside it. Sits above the CTA row.

**5. Session / offer card** — the `₹9` figure becomes `₹99` struck through followed by `₹9`, with "Today's rate" beneath. The existing "₹9 isn't the price of the strategy" line and the Clarity Guarantee stay untouched. The live Calendly availability component is replaced here by the fixed 5-slot line, so the page never shows two different slot numbers.

**6. Final CTA** — same price anchor plus the countdown, immediately above the button.

## Design and behaviour rules

- Countdown and slot count use `--urgent #FF6B5E` sparingly (digits and the slots chip only); price uses lime. No pulsing, glow or ambient animation — the digits changing is the only movement.
- Struck-through price in `--muted-2`, current price in `--fg`/lime at a heavier weight.
- Radius 8px on chips, hairline borders, no pills beyond the small chips already allowed.
- Respects `prefers-reduced-motion` (no transitions on the ticking value).
- Nothing below 12px at 375px width; the bar stays single-line on mobile.
- Server rendering: the timer renders a stable placeholder until hydration to avoid a mismatch.

## Technical notes

- New: `src/lib/urgency.ts` (config + `useCountdown` hook), `src/components/site/urgency-bar.tsx`, `src/components/site/price-anchor.tsx`, `src/components/site/slots-left.tsx`.
- Edited: `src/routes/__root.tsx` (mount the bar), `site-nav.tsx` (top offset), `hero.tsx`, `session-section.tsx`, `final-cta.tsx`.
- `session-availability.tsx` and its Calendly server function stay in the codebase but are no longer rendered on the landing page, so reverting to real availability is a one-line swap.
- No backend, database or payment changes. The ₹9 charge amount is unchanged.
