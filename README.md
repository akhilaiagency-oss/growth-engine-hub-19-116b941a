# Growth Engine Builder

Build a single-page, conversion-focused discovery-call landing page for "Growth Multiplier AI" (founder: Akhil Srivastava). This is NOT a corporate brochure site — it is a premium dark-SaaS funnel whose only job is to get qualified visitors to click "Book My ₹9 Strategy Call →".

Implement this FULLY in ONE pass. Do not simplify, do not stub sections, do not substitute placeholder copy — every string below is final approved copy and must appear verbatim. React + TypeScript + Tailwind + shadcn/ui, single page, no routing needed.

════════════════════════════════
DESIGN SYSTEM (use these exact values)
════════════════════════════════
Font: Inter only (400/500/600/700/800), via Google Fonts. No second display font.
Colors:
--bg #070B14 (deep navy-black page base)
--surface #0E1526 (cards, alternating sections)
--surface-2 #131C33 (nested/hover surfaces)
--border rgba(255,255,255,0.09) | --border-strong rgba(255,255,255,0.18)
--fg #F4F6FA | --muted #93A0B4 | --muted-2 #6B7686
--lime #83E24E (PRIMARY accent: CTAs, eyebrows, active states) | --lime-ink #0A2110 (text on lime)
--electric #3E86FF / --electric-soft #7CB2FF (secondary: headline highlight, general icons)
--cyan #3FDCE8 (RESTRICTED: only system/data-viz — the Engine diagram + Leak Map)
--urgent #FF6B5E (sparing)
Radius: 8px buttons/inputs, 12px cards, 16px large containers. NO pill-shaped buttons or cards (pills only for small eyebrow/chip tags).
Borders: 1px hairlines, low opacity. Minimal shadows. NO heavy glassmorphism.
Glow: only on primary CTA hover — box-shadow: 0 0 0 1px var(--lime), 0 10px 26px -10px rgba(131,226,78,.35). No ambient page glow.
Gradients: restrained. Only a soft two-tone radial behind the hero and final CTA. No aurora/multi-hue blends.
Spacing: generous. Sections 96px desktop / 60px mobile. Container max-width 1120px; text-heavy sections 820px.
Motion: MINIMAL. One-time fade + 12px lift on scroll into view (IntersectionObserver, ~400ms ease-out, unobserve after). Hover = colour/border transitions only. NO continuous/ambient animation, no floating, no shimmer, no pulsing. Respect prefers-reduced-motion.
Buttons: Primary = solid lime fill, #0A2110 text, 8px radius, no glow at rest. Secondary = transparent + 1px border-strong, border turns electric-soft on hover.

════════════════════════════════
SECTION ORDER — exactly these 15, in this order
════════════════════════════════

1) MINIMAL NAV — fixed, transparent, gains rgba(7,11,20,.88) + blur + bottom hairline after 12px scroll. Left: circular logo + "Growth Multiplier AI" with "Founder: Akhil Srivastava" beneath in 11px muted. Centre links (hide <900px): Leak Map / The Engine / How It Works / FAQ. Right: primary button "Book My ₹9 Strategy Call →". Mobile: hamburger → slide-down panel with the 4 links + full-width CTA. NOTHING else in the nav.

2) HERO — centred, max 840px, top padding 168px.
Eyebrow pill: "AI-POWERED CLIENT ACQUISITION SYSTEMS"
H1 (52px desktop / 31px mobile, weight 800, tracking -0.025em): "Turn Ad Traffic Into Qualified Opportunities — Not Just Leads." with "Qualified Opportunities" in --electric-soft.
Sub (17px, muted, max 660px): "Growth Multiplier AI connects high-converting landing pages, AI qualification, CRM, automation and follow-up into one acquisition system designed to turn traffic into qualified leads, booked appointments and measurable revenue."
Then a VSL VIDEO SLOT (this is required, and it sits between the subheadline and the buttons): 16:9, max-width 760px, 12px radius, --surface-2 background with a soft blue radial, 1px dashed border-strong, centred lime circular play button (66px), label "Watch: how the acquisition system works", hint "VSL slot — your video goes here." Build this as a component that accepts an optional `videoUrl` prop — if provided render a responsive `<video controls playsInline>` or YouTube `<iframe>` filling the frame with object-fit:cover; if absent render the placeholder. Caption below: "Short walkthrough — then book your call below."
Then buttons side by side (stack full-width <520px): PRIMARY "Book My ₹9 Strategy Call →" and SECONDARY "See How The System Works" (anchors to #engine).
Microcopy: "30–45 minutes, 1-on-1 with the founder · You keep the plan either way"
Hero background: radial-gradient(800px 440px at 20% -10%, rgba(62,134,255,0.18), transparent 62%), radial-gradient(700px 420px at 84% 2%, rgba(131,226,78,0.10), transparent 58%)

3) TRUST STRIP — full-bleed --surface band, top+bottom hairline, 4 equal columns divided by vertical hairlines (2 cols <860px, 1 col <480px). Small lime icon + bold title + muted subtitle:
• "Direct founder access" / "Akhil hosts every strategy call personally"
• "Secure ₹9 checkout" / "Payments processed via Razorpay"
• "No obligation to buy" / "A working session, not a pitch call"
• "Systems, not one-off tactics" / "Built to be measured end to end"

4) THE ACQUISITION PROBLEM
Eyebrow "THE ACQUISITION PROBLEM". H2: "Buying attention is the easy half. Keeping hold of it is where the money goes."
Sub: "Most businesses can get a stranger to click. What breaks is everything between that click and a confirmed appointment — and it usually breaks in three places at once."
3 cards (muted icons, not lime):
• "Interest has a shelf life" — "Your budget buys the click. What happens in the next few minutes decides whether it turns into anything — and in most businesses, nobody owns those minutes."
• "Every part works. The joins don't." — "Ads in one platform, a form in another, a CRM nobody updates, WhatsApp on somebody's personal phone. No single piece is broken — the handoffs between them are."
• "The dashboard says yes, the calendar says no" — "Lead volume looks healthy right up until you check who's actually booked. Without a filter early on, the cost of unqualified leads lands on your sales time instead of your ad spend."

5) ACQUISITION LEAK MAP (--surface section) — the diagnostic.
Eyebrow "THE DIAGNOSTIC". H2: "The Acquisition Leak Map"
Sub: "Before we build anything, we find out where you're losing people. The first five stages of the Engine are also the five places acquisition quietly narrows — and almost every business is losing far more at one of them than at the other four combined."
Card containing a legend ("Volume still in the funnel" = cyan swatch, "Where the leak happens" = urgent swatch) then 5 rows. Each row = 180px label column (numbered 26px cyan square + stage name) + a 34px-tall --surface-2 track containing a narrowing bar filled `linear-gradient(90deg, rgba(63,220,232,0.30), rgba(63,220,232,0.14))` with a 2px cyan right edge, and a note overlaid at left:
01 Attract — 100% — "Paid traffic arrives — the money is already spent by this point"
02 Convert — 72% — "*Leaks when* the page asks for attention it hasn't earned"
03 Qualify — 52% — "*Leaks when* nothing sorts a serious buyer from a curious one"
04 Nurture — 30% — "*Leaks most —* the reply comes hours late, or never comes"
05 Book — 16% — "Whatever survives all four is what your calendar actually gets"
(the italic-marked lead-ins render in --urgent; rows stack to single column <700px)
Footnote box: "This is a **shape, not a statistic** — an illustration of how acquisition typically narrows, not measured results from any business. On your call we put your real numbers against each stage and find which one is costing you most."
Below the card, centred: primary button "Map My Funnel — Book My ₹9 Strategy Call →"

6) THE GROWTH MULTIPLIER ENGINE™ — THIS IS THE HERO VISUAL OF THE PAGE. Make it the strongest graphic element. It is a proprietary mechanism, so render it as a CLOSED LOOP — never a downward funnel triangle and never a plain left-to-right row of boxes.
Eyebrow "OUR PROPRIETARY SYSTEM". H2: "The Growth Multiplier Engine™"
Sub: "Seven stages built as one closed loop. Five carry a stranger from first impression to a confirmed appointment; two feed everything learned back into the start."

DESKTOP (>820px) — inline SVG, viewBox "0 0 1040 300", width 100%, height auto. Use this exact geometry:
• Track path (draw twice: 1.5px --border-strong beneath, then 1.5px --cyan at 0.55 opacity on top):
  M122,100 L918,100 A62.5,62.5 0 0 1 918,225 L122,225 A62.5,62.5 0 0 1 122,100
  (a stadium/racetrack shape — flat top edge, semicircular right cap, flat bottom edge, semicircular left cap)
• Direction chevrons, 1.6px cyan @0.55, pointing RIGHT along the top at x=217,416,615,814 (y=100) e.g. "M217,94 L226,100 L217,106"; pointing LEFT along the bottom at x=789,524,259 (y=225) e.g. "M789,219 L780,225 L789,231"
• Forward-path nodes on the TOP edge (label ABOVE at y=58, circle r=26 at y=100, number centred at y=105):
  x=122 ATTRACT 01 | x=321 CONVERT 02 | x=520 QUALIFY 03 | x=719 NURTURE 04 | x=918 BOOK 05
• Return-path nodes on the BOTTOM edge (circle r=26 at y=225, number at y=230, label BELOW at y=278):
  x=653 MEASURE 06 | x=387 OPTIMIZE 07
• Phase labels, 10px, letter-spacing 1.6, --muted-2, centred at x=520: y=74 "FORWARD PATH — STRANGER TO BOOKED APPOINTMENT"; y=256 "RETURN PATH — WHAT WE LEARN GOES BACK IN"
• Centre wordmark filling the empty middle: x=520 y=157, 14px, weight 700, letter-spacing 2.4, --fg: "GROWTH MULTIPLIER ENGINE™"; x=520 y=179, 11.5px, --muted-2: "One connected acquisition loop"
• Node styling: circle fill --surface-2, stroke --border-strong 1.5px; number 11px bold --cyan; label 11.5px weight 600 letter-spacing 1.4 --muted. Hover: stroke → cyan, label → --fg. ACTIVE: circle fill+stroke --lime, number --lime-ink, label --fg. Nodes are keyboard-focusable buttons (role="button", tabIndex, Enter/Space activate).

MOBILE (<820px) — hide the SVG, render instead a vertical timeline: 7 rows connected by a 1.5px left rail, each with a 32px circular numbered dot and the stage name. Same active styling (lime dot, --fg name). Below it a dashed-rail row with a circular-arrow icon: "What we measure and optimise feeds straight back into Attract."

SHARED DETAIL PANEL (below both, --surface-2, 12px radius, aria-live="polite"): lime number chip + stage name (12px, letter-spacing 2) + phase label; then H3 title, paragraph, and a row of capability chips. Clicking ANY node (SVG or mobile) updates this panel and syncs the active state across both. Default to stage 01 on load. Stage content:
01 ATTRACT · FORWARD PATH — "Put the offer in front of people who could actually buy it" — "Campaigns are built around one specific offer for one specific buyer. The targeting, the creative and the promise are decided together — so the click already has a reason to happen before the page ever loads." — chips: Meta Ads / Audience architecture / Offer positioning / Creative testing
02 CONVERT · FORWARD PATH — "Give that click exactly one thing to do" — "Landing pages designed around a single decision. Structure, sequence and evidence are arranged so a visitor never has to work out what happens next — and never has a second option competing for the same attention." — chips: Landing page design / Message match / Conversion copy / Page speed
03 QUALIFY · FORWARD PATH — "Sort the buyers from the browsers before anyone picks up the phone" — "Every submission is scored against your real criteria — fit, budget, timing, intent — the moment it arrives. This is where machine judgement genuinely outperforms a human doing it manually at 11pm: it never gets tired, and it never skips one." — chips: Lead scoring / Intent signals / Disqualification rules / Routing
04 NURTURE · FORWARD PATH — "Reply in seconds, then stay useful until they're ready" — "Automated WhatsApp and email sequences respond while interest is still live, then keep the conversation going on the channel the person actually reads. Nothing waits for someone to remember it on Monday." — chips: WhatsApp automation / Email sequences / Speed-to-lead / Re-engagement
05 BOOK · FORWARD PATH — "Turn a warm conversation into a confirmed slot" — "Scheduling wired straight into your CRM, with confirmations and reminders that cut no-shows. Every appointment lands in the calendar carrying the full context of how it got there." — chips: Appointment booking / CRM setup / Reminders / Pipeline stages
06 MEASURE · RETURN PATH — "See the whole journey, not just the last click" — "Tracking runs across all five forward stages, so when something underperforms you know which step dropped it — instead of arguing about which channel to blame." — chips: Full-funnel tracking / Stage attribution / Reporting / Dashboards
07 OPTIMIZE · RETURN PATH — "Send what you learn back to the start" — "Findings from measurement become the next round of changes at Attract and Convert. This is the stage that makes it an engine rather than a campaign: every cycle starts from what the last one proved." — chips: Conversion rate optimisation / Experiment design / Creative iteration / Quarterly review

Directly beneath the Engine card, a pull-quote block (--surface, 2px lime left border):
"**We don't just run marketing channels.** We connect the acquisition journey — so no stage hands the next one a problem it can't solve." (first sentence --fg weight 600 at 19px; remainder --muted weight 400)

7) OUTCOMES (--surface section) — Eyebrow "OUTCOMES". H2: "What changes once the system is running". Sub: "Not promises with numbers attached — structural changes to how acquisition works in your business."
2-col grid, each card a lime check icon + title + line:
• "Leads arrive pre-qualified" — "Your team stops sorting through everyone and starts talking to people who match your criteria."
• "Follow-up stops depending on someone remembering" — "Response happens automatically, at speed, every time — including evenings and weekends."
• "The calendar fills with real opportunities" — "Booked appointments become the metric that matters, rather than raw lead volume."
• "Ad spend becomes accountable" — "You can see which stage every rupee dies at, so budget decisions stop being guesswork."
• "Nothing lives in someone's head anymore" — "Every lead, stage and next action sits in one CRM the whole team can see."
• "Improvement becomes systematic" — "Because every stage is measured, optimisation is a decision — not a hunch."

8) HOW THE SYSTEM WORKS — Eyebrow "HOW IT WORKS". H2: "From ₹9 to a working acquisition system". Sub: "Three steps to your strategy call — and a clear view of what happens after it."
3 step cards (lime numbered square, uppercase tagline, title, body):
1 · SECURE YOUR SLOT · "Pay ₹9 to reserve the call" — "A small, transparent commitment fee keeps the calendar for people who are serious about fixing their acquisition. Processed securely through Razorpay."
2 · PICK YOUR TIME · "Choose a slot that suits you" — "Once payment is verified, you'll pick an available time on the calendar. You'll get a confirmation with the meeting link straight away."
3 · GET CONNECTED · "Join the WhatsApp community" — "After your appointment is confirmed, you're invited into our WhatsApp community for reminders, resources and direct access before the call."
Then a full-width card "On the call itself": "We put your real numbers against the Acquisition Leak Map, find the stage costing you most, and walk through what the Growth Multiplier Engine™ looks like built around your business — which stages you already have, which are missing, and the order to fix them in. You keep that plan whether or not we work together afterwards."
Centred primary CTA below: "Book My ₹9 Strategy Call →"

9) PROOF / EVIDENCE (--surface section) — CRITICAL: this business has NO clients, results, testimonials or logos yet. Do NOT invent any. Do not add star ratings, counters, client logo strips, or "trusted by" rows anywhere on this page.
Eyebrow "PROOF & EVIDENCE". H2: "What we can show you today — and what we can't yet". Sub: "Growth Multiplier AI is early. We'd rather tell you that plainly than borrow credibility we haven't earned."
3 cards with dashed-border muted placeholder icons:
• "Client case studies" — "Not published yet. Verified results will appear here as engagements complete — with real numbers and named permission, or not at all."
• "Live tracking dashboard" — "In build. Client-facing funnel reporting is part of the system itself — a preview of the real interface will live here."
• "The method, in the open" — "What we can show you is the thinking. The Leak Map and the seven stages of the Engine above aren't a teaser for a framework — they are the framework, published in full."
Statement box below (lime info icon): "**No invented testimonials. No borrowed client logos. No round numbers pulled from nowhere.** If a business is willing to show you fake proof before you've paid them anything, it tells you what they'll do once you have. Ask on the call for a straight account of exactly where we are."

10) WHY GROWTH MULTIPLIER AI — 820px column. Eyebrow "WHY GROWTH MULTIPLIER AI". H2: "Why work with us specifically". Five rows, each a 220px left title column + body (stack <700px), separated by hairlines:
• "System-first, not service-first" — "Most agencies sell you a deliverable — a page, a campaign, an automation. We build the connected system those pieces are supposed to be part of, because a great landing page attached to slow follow-up still loses."
• "AI where it earns its place" — "We use it for two jobs: scoring a lead the moment it arrives, and replying before interest cools. Those are the points where software genuinely outperforms a person. Everywhere else the work is strategy and engineering — and we don't dress that up as something cleverer."
• "You talk to the person doing the work" — "Akhil hosts the strategy call and stays involved in delivery. There's no handoff to a junior account manager after you sign."
• "Measurable, or we say so" — "Every stage is tracked, and where something can't be attributed cleanly, we tell you rather than dressing it up in a report."
• "Honest about being early" — "We're building this in the open, which means you get direct founder attention now — and a partner with something to prove."

11) FOUNDER (--surface section) — 2-column grid, 0.85fr / 1.15fr, 56px gap, stacks <900px.
LEFT: premium portrait card. A soft ambient glow sits BEHIND the card (radial blue at top-left + radial lime at bottom-right, low opacity, blurred). The card itself has border-strong, 16px radius, overflow hidden, deep soft shadow, and NO inner padding — the photograph runs edge to edge. Inside: a 4:5 frame with the founder photo object-fit:cover; a gradient scrim rising from the bottom (to --surface at the base, fading to transparent at ~56% height) so the photo dissolves into the card rather than sitting in a box; a small glass "FOUNDER" pill top-left (blurred dark bg, hairline border, lime dot); and overlaid at the bottom on the scrim: a 36px lime rule, then "Akhil Srivastava" (19px, 700) and "Founder, Growth Multiplier AI" (12.5px muted). Use `/src/assets/akhil-portrait-4x5.jpg` as the src — I will upload the actual photograph in the editor. Add alt="Akhil Srivastava, Founder of Growth Multiplier AI". Never substitute a stock photo or generated likeness.
RIGHT: Eyebrow "FOUNDER-LED". H2 (38px): "Built By Someone Who Thinks In Systems."
Blockquote (2px lime left border, 17.5px, weight 500, --fg): "Growth Multiplier AI was built around a simple idea: businesses don't need another disconnected marketing service. They need a client acquisition system where every stage works together." with cite "AKHIL SRIVASTAVA — FOUNDER".
Then a hairline-separated block labelled "HOW AKHIL WORKS" listing (2-col, lime checks): AI-first growth systems strategist / Client acquisition systems builder / Funnel strategist / Conversion-focused operator / Technology + marketing systems thinker
Closing line: "Which is why an engagement starts with your funnel rather than our service list — and why Akhil runs the strategy call himself instead of routing it to a sales team."
Two pill signals: "Founder-led delivery" and "Strategy-driven engagements".
TONE RULE: credible operator, never guru/celebrity/influencer. No awards, certifications, client logos, revenue figures or years-of-experience claims — none exist.

12) WHO THIS IS FOR — Eyebrow "FIT". H2: "Who this call is for". Sub: "This is a working session on a specific problem. It's genuinely useful for some businesses and a waste of time for others — here's the honest split."
Two cards side by side. LEFT "This is for you if" (lime heading + lime check bullets):
• "You're already running paid traffic, or you're ready to start"
• "You sell something that involves a call, consultation or appointment"
• "You're getting leads but too few turn into real conversations"
• "Your follow-up depends on someone manually remembering to do it"
• "You want one connected system instead of five disconnected tools"
RIGHT "This isn't for you if" (muted heading + muted × bullets):
• "You're looking for a one-off landing page with nothing behind it"
• "You want overnight results without changing how follow-up works"
• "You have no budget for traffic and aren't planning to have one"
• "You'd rather buy a guarantee than build a system"
• "You only want a vendor to take instructions, not a partner to challenge them"

13) FAQ (--surface section, 820px) — Eyebrow "FAQ". H2: "Before you book". Accordion, one open at a time, plus-icon rotating 45° to lime when open, hairline dividers:
• "Why does the strategy call cost ₹9?" — "It's a commitment filter, not a revenue stream. A tiny paid step means the calendar goes to people actually working on this problem — which keeps the call focused and useful for both sides."
• "What actually happens on the call?" — "We map your current funnel onto the Acquisition Leak Map, work out which stage is losing you the most, and outline what the Growth Multiplier Engine would look like applied to your business. It's a working session, not a presentation."
• "Is this just a sales pitch?" — "No. You'll get the funnel breakdown regardless of whether we work together — and if your acquisition system doesn't need rebuilding, you'll be told that directly."
• "How do I pick a time after paying?" — "Once your ₹9 payment is verified you're taken straight to the scheduler to choose an available slot, and you'll get a confirmation with the meeting link."
• "What's the WhatsApp community for?" — "After your appointment is confirmed you're invited in — it's used for call reminders, resources, and direct access to us before your session."
• "Do I need to already be running ads?" — "It helps, because we can look at real numbers. If you're about to start, the call is about designing the system before you spend rather than diagnosing it afterwards."
• "Which businesses does this work for?" — "Anything where the sale involves a call, consultation or appointment — coaching, clinics, professional services, B2B, high-consideration services. If you sell purely self-serve at low ticket, it's probably not a fit."
• "Do you work with businesses outside India?" — "Yes. The call runs over Zoom or Google Meet and can be held in English or Hindi."
Emit FAQPage JSON-LD structured data from this same array.

14) FINAL CTA — large 16px-radius panel, --surface with a soft lime radial from the top, 72px padding.
Eyebrow "GET STARTED". H2 (34px): "Find out which stage is costing you the most."
Body: "Book the ₹9 strategy call, pick a time that works, and walk away with your acquisition funnel mapped — leak by leak."
Primary CTA "Book My ₹9 Strategy Call →". Below it three lime-check reassurance items in a row: "30–45 minutes, 1-on-1" · "Secure Razorpay checkout" · "You keep the plan either way".

15) FOOTER — top hairline, 3 columns (1.6fr/1fr/1fr, stack <700px). Col 1: logo + name + "AI-powered client acquisition systems that turn ad traffic into qualified opportunities, booked appointments and measurable revenue." Col 2 "ON THIS PAGE": Acquisition Leak Map / Growth Multiplier Engine™ / How it works / FAQ. Col 3 "CONTACT": akhil.ai.agency@gmail.com (mailto) and "WhatsApp community — link added at launch". Bottom bar: "© 2026 Growth Multiplier AI. All rights reserved." and "Growth Multiplier Engine™ is a trademark of Growth Multiplier AI."
Do NOT add blog, careers, pricing, services catalogue, about-us or portfolio links anywhere.

════════════════════════════════
PERSISTENT UI
════════════════════════════════
• Sticky mobile CTA bar (<900px only): fixed bottom, blurred dark bg, top hairline, "Strategy call / ₹9" on the left and a full-width primary "Book My ₹9 Strategy Call →" button. Add bottom padding to the footer so it isn't obscured.
• BOOKING JOURNEY MODAL — every single CTA on the page opens this same modal. It is a 3-step architecture preview with NO real integrations yet (do NOT install or wire Razorpay, Calendly or WhatsApp — build the frontend journey only, structured so those drop in later):
  Header: small eyebrow "Booking journey — architecture preview" + close button. A 3-segment progress indicator that fills lime as you advance.
  Step 1 "Reserve your strategy call": copy "Secure checkout will run through Razorpay. Not connected yet — this is the placeholder for the payment step."; an amount row "1:1 Growth Strategy Call" / "₹9" (lime); a dashed placeholder box "Razorpay checkout renders here once payments are connected."; button "Continue to Payment (demo) →"; note "Demo only — no real payment is processed on this page."
  Step 2 "Choose your call time": "After payment is verified, you'll pick an available slot here via Calendly."; dashed box "Calendly scheduler embeds here once connected."; button "Continue (demo slot selected) →"; note "Demo only — no real calendar is connected yet."
  Step 3 "You're booked": lime circular check; "Your appointment is confirmed. Join the WhatsApp community for reminders, resources and direct access before your call."; button "Join WhatsApp Community →"; note "WhatsApp link goes live at launch — placeholder for now."
  Closes on overlay click, X, and Escape. Locks body scroll while open. Resets to step 1 each time it opens.

════════════════════════════════
TECHNICAL
════════════════════════════════
• Fully responsive; verify at 375 / 768 / 1440. The Engine SVG must scale cleanly and swap to the mobile timeline below 820px.
• Correct heading hierarchy: one H1 (hero), H2 per section. Semantic landmarks (header/main/section/footer). All interactive elements keyboard-accessible with visible focus. Alt text on all images. AA contrast.
• SEO: title "Growth Multiplier AI — Turn Ad Traffic Into Qualified Opportunities"; meta description = the hero subheadline; Organization + FAQPage JSON-LD; Open Graph tags.
• Logo: use `/src/assets/growth-multiplier-ai-logo.png` (circular, render at 36px in nav / 32px in footer) — I will upload the actual file in the editor.
• Extract the 7 Engine stages and the 8 FAQs into typed data arrays and render from them — do not hardcode repeated markup.
• Every CTA anywhere on the page opens the booking modal. Track them with a single reusable BookCta component so a real payment handler can be swapped in later in one place.

════════════════════════════════
ABSOLUTE CONSTRAINTS
════════════════════════════════
1. Do NOT fabricate testimonials, client logos, star ratings, review counts, revenue figures, client counts, case studies, awards or certifications. There are none. The Proof section's honesty IS the positioning.
2. Do NOT add pricing tables, blog, careers, about-us, portfolio, service catalogue, or extra nav items.
3. Do NOT install or connect Razorpay, Calendly, Supabase or WhatsApp in this pass. Frontend + user-journey architecture only.
4. The percentages in the Leak Map are illustrative proportions, not data — keep the disclaimer.
5. Do not overuse "AI". It appears in the brand name, the hero eyebrow and subheadline, the QUALIFY stage, and the "AI where it earns its place" row. Do not add it as a decorative modifier anywhere else.
6. Keep it visually distinctive and premium — expensive, not flashy. Restrained corners, hairline borders, generous whitespace, one accent doing the work. It must not look like a generic marketing-agency template, a crypto/gaming/cyberpunk site, or an AI chatbot landing page.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://growth-engine-hub-19.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3de4bc79-d857-4fb3-b130-803c4985076a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
