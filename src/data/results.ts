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
  /** Headline result, as reported by the client. */
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
    stat: "PLACEHOLDER — result 01",
    quote: "Placeholder quote 01 — replace with the client's own words, published with permission.",
    initials: "C1",
    name: "Client name 01",
    businessType: "Business type",
    city: "City",
  },
  {
    id: "story-02",
    stat: "PLACEHOLDER — result 02",
    quote: "Placeholder quote 02 — replace with the client's own words, published with permission.",
    initials: "C2",
    name: "Client name 02",
    businessType: "Business type",
    city: "City",
  },
  {
    id: "story-03",
    stat: "PLACEHOLDER — result 03",
    quote: "Placeholder quote 03 — replace with the client's own words, published with permission.",
    initials: "C3",
    name: "Client name 03",
    businessType: "Business type",
    city: "City",
  },
  {
    id: "story-04",
    stat: "PLACEHOLDER — result 04",
    quote: "Placeholder quote 04 — replace with the client's own words, published with permission.",
    initials: "C4",
    name: "Client name 04",
    businessType: "Business type",
    city: "City",
  },
];

export interface PortfolioItem {
  id: string;
  /** 16:10 screenshot (WebP, < 200KB). */
  screenshotUrl?: string;
  url: string;
  tag: string;
  title: string;
  line: string;
}

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: "work-01",
    url: "clientdomain-01.com",
    tag: "Industry placeholder",
    title: "Project title 01",
    line: "One line describing what was built and which stages it connected.",
  },
  {
    id: "work-02",
    url: "clientdomain-02.com",
    tag: "Industry placeholder",
    title: "Project title 02",
    line: "One line describing what was built and which stages it connected.",
  },
  {
    id: "work-03",
    url: "clientdomain-03.com",
    tag: "Industry placeholder",
    title: "Project title 03",
    line: "One line describing what was built and which stages it connected.",
  },
  {
    id: "work-04",
    url: "clientdomain-04.com",
    tag: "Industry placeholder",
    title: "Project title 04",
    line: "One line describing what was built and which stages it connected.",
  },
];
