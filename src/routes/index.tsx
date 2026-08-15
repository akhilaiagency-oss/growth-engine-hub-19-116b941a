import { createFileRoute } from "@tanstack/react-router";
import { FAQS } from "@/data/faq";
import { SiteNav } from "@/components/site/site-nav";
import { Hero } from "@/components/site/hero";
import { ProofStrip } from "@/components/site/proof-strip";
import { LeakMap } from "@/components/site/leak-map";
import { EngineSection } from "@/components/site/engine-section";
import { ResultsSection } from "@/components/site/results-section";
import { FounderSection } from "@/components/site/founder-section";
import { FitSection } from "@/components/site/fit-section";
import { SessionSection } from "@/components/site/session-section";
import { DeliverablesSection } from "@/components/site/deliverables-section";
import { FaqSection } from "@/components/site/faq-section";
import { CapacitySection } from "@/components/site/capacity-section";
import { TwoRoadsSection } from "@/components/site/two-roads-section";
import { SiteFooter } from "@/components/site/site-footer";
import { StickyMobileCta } from "@/components/site/sticky-mobile-cta";


const TITLE = "Growth Multiplier AI — Turn Ad Traffic Into Qualified Opportunities";
const DESCRIPTION =
  "We connect your landing pages, lead qualification, follow-up and booking into one acquisition system — so the traffic you're already paying for turns into booked appointments.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Growth Multiplier AI",
          description: DESCRIPTION,
          email: "akhil.ai.agency@gmail.com",
          founder: { "@type": "Person", name: "Akhil Srivastava" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <ProofStrip />
        <LeakMap />
        <EngineSection />
        <ResultsSection />
        <FounderSection />
        <FitSection />
        <SessionSection />
        <DeliverablesSection />
        <FaqSection />
        <CapacitySection />
        <TwoRoadsSection />

      </main>
      <SiteFooter />
      <StickyMobileCta />
    </>
  );
}
