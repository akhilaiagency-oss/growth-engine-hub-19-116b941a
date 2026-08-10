export type EnginePhase = "FORWARD PATH" | "RETURN PATH";

export interface EngineStage {
  id: string;
  number: string;
  name: string;
  phase: EnginePhase;
  title: string;
  body: string;
  chips: string[];
  x: number;
  y: number;
}

export const ENGINE_STAGES: EngineStage[] = [
  {
    id: "attract",
    number: "01",
    name: "ATTRACT",
    phase: "FORWARD PATH",
    title: "Reach the people who can actually buy",
    body: "Campaigns built around one offer for one buyer. Targeting, creative and promise are decided together, so the click arrives with intent instead of curiosity.",
    chips: ["Meta Ads", "Audience architecture", "Offer positioning", "Creative testing"],
    x: 122,
    y: 100,
  },
  {
    id: "convert",
    number: "02",
    name: "CONVERT",
    phase: "FORWARD PATH",
    title: "Give that click exactly one next step",
    body: "A landing page built around a single decision. What the visitor sees, in what order, and what they're asked to do — arranged so nothing competes for the same attention.",
    chips: ["Landing page design", "Message match", "Conversion copy", "Page speed"],
    x: 321,
    y: 100,
  },
  {
    id: "qualify",
    number: "03",
    name: "QUALIFY",
    phase: "FORWARD PATH",
    title: "Separate buyers from browsers before your team spends an hour",
    body: "Every enquiry is scored against your real criteria — fit, budget, timing, intent — the moment it arrives. This is where automation genuinely beats a person: it never misses one, and it never gets to it tomorrow.",
    chips: ["Lead scoring", "Intent signals", "Disqualification rules", "Routing"],
    x: 520,
    y: 100,
  },
  {
    id: "nurture",
    number: "04",
    name: "NURTURE",
    phase: "FORWARD PATH",
    title: "Reply while the interest is still there",
    body: "WhatsApp and email sequences respond within seconds, then keep the conversation going on the channel your buyer actually opens. Nothing waits for someone to remember.",
    chips: ["WhatsApp automation", "Email sequences", "Speed-to-lead", "Re-engagement"],
    x: 719,
    y: 100,
  },
  {
    id: "book",
    number: "05",
    name: "BOOK",
    phase: "FORWARD PATH",
    title: "Turn interest into a confirmed appointment",
    body: "Booking wired directly into your CRM, with confirmations and reminders that reduce no-shows. Every appointment arrives carrying the full history of how it got there.",
    chips: ["Appointment booking", "CRM setup", "Reminders", "Pipeline stages"],
    x: 918,
    y: 100,
  },
  {
    id: "measure",
    number: "06",
    name: "MEASURE",
    phase: "RETURN PATH",
    title: "See the whole journey, not just the last click",
    body: "Every stage reports separately, so when something slips you know which step lost it — instead of guessing which channel to blame.",
    chips: ["Full-funnel tracking", "Stage attribution", "Reporting", "Dashboards"],
    x: 653,
    y: 225,
  },
  {
    id: "optimize",
    number: "07",
    name: "OPTIMIZE",
    phase: "RETURN PATH",
    title: "Put what you learn back into the top",
    body: "What measurement reveals becomes the next round of changes at Attract and Convert. That loop is the difference between a campaign that ends and a system that compounds.",
    chips: [
      "Conversion rate optimisation",
      "Experiment design",
      "Creative iteration",
      "Quarterly review",
    ],
    x: 387,
    y: 225,
  },
];
