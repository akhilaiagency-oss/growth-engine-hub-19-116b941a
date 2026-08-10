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
    title: "Put the offer in front of people who could actually buy it",
    body: "Campaigns are built around one specific offer for one specific buyer. The targeting, the creative and the promise are decided together — so the click already has a reason to happen before the page ever loads.",
    chips: ["Meta Ads", "Audience architecture", "Offer positioning", "Creative testing"],
    x: 122,
    y: 100,
  },
  {
    id: "convert",
    number: "02",
    name: "CONVERT",
    phase: "FORWARD PATH",
    title: "Give that click exactly one thing to do",
    body: "Landing pages designed around a single decision. Structure, sequence and evidence are arranged so a visitor never has to work out what happens next — and never has a second option competing for the same attention.",
    chips: ["Landing page design", "Message match", "Conversion copy", "Page speed"],
    x: 321,
    y: 100,
  },
  {
    id: "qualify",
    number: "03",
    name: "QUALIFY",
    phase: "FORWARD PATH",
    title: "Sort the buyers from the browsers before anyone picks up the phone",
    body: "Every submission is scored against your real criteria — fit, budget, timing, intent — the moment it arrives. This is where machine judgement genuinely outperforms a human doing it manually at 11pm: it never gets tired, and it never skips one.",
    chips: ["Lead scoring", "Intent signals", "Disqualification rules", "Routing"],
    x: 520,
    y: 100,
  },
  {
    id: "nurture",
    number: "04",
    name: "NURTURE",
    phase: "FORWARD PATH",
    title: "Reply in seconds, then stay useful until they're ready",
    body: "Automated WhatsApp and email sequences respond while interest is still live, then keep the conversation going on the channel the person actually reads. Nothing waits for someone to remember it on Monday.",
    chips: ["WhatsApp automation", "Email sequences", "Speed-to-lead", "Re-engagement"],
    x: 719,
    y: 100,
  },
  {
    id: "book",
    number: "05",
    name: "BOOK",
    phase: "FORWARD PATH",
    title: "Turn a warm conversation into a confirmed slot",
    body: "Scheduling wired straight into your CRM, with confirmations and reminders that cut no-shows. Every appointment lands in the calendar carrying the full context of how it got there.",
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
    body: "Tracking runs across all five forward stages, so when something underperforms you know which step dropped it — instead of arguing about which channel to blame.",
    chips: ["Full-funnel tracking", "Stage attribution", "Reporting", "Dashboards"],
    x: 653,
    y: 225,
  },
  {
    id: "optimize",
    number: "07",
    name: "OPTIMIZE",
    phase: "RETURN PATH",
    title: "Send what you learn back to the start",
    body: "Findings from measurement become the next round of changes at Attract and Convert. This is the stage that makes it an engine rather than a campaign: every cycle starts from what the last one proved.",
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
