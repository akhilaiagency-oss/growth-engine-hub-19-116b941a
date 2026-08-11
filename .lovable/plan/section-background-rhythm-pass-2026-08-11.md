# Section background rhythm pass

The page currently runs four dark-base sections in a row, then four raised sections in a row. The eye loses its place, and the two sections that matter most for conversion (the Engine and the Session offer) sit on the same flat background as everything around them. This pass fixes the visual rhythm and gives the money sections real emphasis — no new colours, no layout changes, no copy changes.

## What changes

**1. Strict alternating rhythm**

Every section alternates between the deep base and the raised surface as you scroll, so each new idea reads as a new "band":

```text
Hero            gradient base
Trust strip     surface (unchanged)
Problem         base
Already paying  surface
Leak Map        base          (was surface)
Engine          surface       (was base) + accent frame
Future pacing   base          (was surface)
Outcomes        surface
Proof           base          (was surface)
Founder         surface
Session/offer   base + accent frame
How it works    surface       (was base)
Why us          base
Who it's for    surface       (was base)
FAQ             base          (was surface)
Final CTA       surface band + existing radial wash
```

Where a section flips, the cards inside it flip the opposite way so contrast inside the section is preserved (a card on the base uses surface, a card on surface uses base). That is the only knock-on edit.

**2. Hairline separators between bands**

A single 1px top border on each raised band so the transitions read as deliberate structure rather than an accidental colour shift.

**3. Emphasis on the two hero moments**

- **Engine section:** a very soft two-tone radial wash behind the loop diagram (electric into cyan, low opacity) so the proprietary mechanism visually outranks everything near it. Keeps cyan inside its system/data-viz lane.
- **Session / ₹9 offer:** a soft lime radial from the top, matching the treatment already used on the final CTA, so the offer and the closing ask feel like a matched pair.

**4. Softer top edge on the deep bands**

Deep bands directly after a raised band get a barely-visible vertical fade at the top so the join looks blended rather than stepped.

Everything else — spacing, type, tokens, copy, CTAs, motion — stays exactly as it is. No new colour tokens are introduced; this uses the existing `--bg`, `--surface`, `--surface-2`, `--lime`, `--electric`, `--cyan`.

## Note on the reference URL

The reference is a high-saturation Indian coaching funnel (bright yellows, red urgency bars, heavy banner stacking). That style conflicts with this project's premium restrained dark system and would cheapen it. I'm taking only the structural lesson from it — strong band separation and clear emphasis on the offer block — and expressing that within the existing design system.

## Technical detail

- Section wrappers touched: `leak-map.tsx`, `engine-section.tsx`, `future-pacing.tsx`, `proof-section.tsx`, `session-section.tsx`, `how-it-works.tsx`, `who-for.tsx`, `faq-section.tsx`, `final-cta.tsx`, plus inner card `bg-*` swaps in the flipped sections.
- Two new `@utility` helpers in `src/styles.css`: `band-raised` (surface + top hairline) and `band-base` (base + top fade), so the rhythm is defined in one place instead of repeated per section.
- Radial washes applied as inline `backgroundImage` on the section, matching the existing pattern in `hero.tsx` and `final-cta.tsx`.
