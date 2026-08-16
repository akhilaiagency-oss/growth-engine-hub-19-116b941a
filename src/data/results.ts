/**
 * Placeholder data for the Client Results and Selected Work blocks.
 *
 * Every asset field is optional. While a field is undefined the component
 * renders a clearly-labelled placeholder frame at the correct aspect ratio,
 * so real assets can be dropped in here without touching any markup.
 *
 * NOTHING HERE IS PRESENTED AS A VERIFIED CLAIM until real assets and real
 * permissioned quotes replace the placeholder strings below.
 */

export interface ClientStory {
  id: string;
  /** 16:9 video poster image (WebP, < 200KB). */
  thumbnailUrl?: string;
  /** Video the play button loads on click. Nothing loads until clicked. */
  videoUrl?: string;
  /**
   * Headline result, as reported by the client. Always write it as
   * before → after with real figures (e.g. "₹2L → ₹7L in 5 months"),
   * never as a percentage.
   */
  stat: string;
  quote: string;
  /** Two 3:4 chat-thread screenshots backing the claim. */
  chatUrls?: [string?, string?];
  /** 36px round client photo. */
  photoUrl?: string;
  initials: string;
  name: string;
  businessType: string;
  city: string;
}

export const CLIENT_STORIES: ClientStory[] = [
  {
    id: "story-01",
    stat: "₹0.0L → ₹0.0L in 00 months",
    quote: "Placeholder quote 01 — replace with the client's own words, published with permission.",
    initials: "C1",
    name: "Client name 01",
    businessType: "Business type",
    city: "City",
  },
  {
    id: "story-02",
    stat: "₹0.0L → ₹0.0L in 00 months",
    quote: "Placeholder quote 02 — replace with the client's own words, published with permission.",
    initials: "C2",
    name: "Client name 02",
    businessType: "Business type",
    city: "City",
  },
  {
    id: "story-03",
    stat: "₹0.0L → ₹0.0L in 00 months",
    quote: "Placeholder quote 03 — replace with the client's own words, published with permission.",
    initials: "C3",
    name: "Client name 03",
    businessType: "Business type",
    city: "City",
  },
  {
    id: "story-04",
    stat: "₹0.0L → ₹0.0L in 00 months",
    quote: "Placeholder quote 04 — replace with the client's own words, published with permission.",
    initials: "C4",
    name: "Client name 04",
    businessType: "Business type",
    city: "City",
  },
];

export interface PortfolioItem {
  id: string;
  /** Placeholder label shown in the browser frame's URL field. */
  label: string;
  /** Industry tag. */
  industry: string;
  /** What was built. */
  title: string;
  /** One line of description. */
  description: string;
  /** 16:10 screenshot (WebP, < 200KB). Empty string renders the placeholder. */
  image: string;
}

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: "work-01",
    label: "CLIENT LANDING PAGE 1",
    industry: "Industry placeholder",
    title: "Project title 01",
    description: "One line describing what was built and which stages it connected.",
    image: "",
  },
  {
    id: "work-02",
    label: "CLIENT LANDING PAGE 2",
    industry: "Industry placeholder",
    title: "Project title 02",
    description: "One line describing what was built and which stages it connected.",
    image: "",
  },
  {
    id: "work-03",
    label: "CLIENT LANDING PAGE 3",
    industry: "Industry placeholder",
    title: "Project title 03",
    description: "One line describing what was built and which stages it connected.",
    image: "",
  },
  {
    id: "work-04",
    label: "CLIENT LANDING PAGE 4",
    industry: "Industry placeholder",
    title: "Project title 04",
    description: "One line describing what was built and which stages it connected.",
    image: "",
  },
];


/** Google Business rating shown in the proof strip. Edit both values here only. */
export const GOOGLE_RATING = {
  score: "5.0",
  reviewCount: 4,
};
