import { createFileRoute } from "@tanstack/react-router";
import { FAQS } from "@/data/faq";
import { SiteNav } from "@/components/site/site-nav";
import { Hero } from "@/components/site/hero";
import { TrustStrip } from "@/components/site/trust-strip";
import { ProblemSection } from "@/components/site/problem-section";
import { AlreadyPaying } from "@/components/site/already-paying";
import { FuturePacing } from "@/components/site/future-pacing";
import { LeakMap } from "@/components/site/leak-map";
import { EngineSection } from "@/components/site/engine-section";
import { Outcomes } from "@/components/site/outcomes";
import { SessionSection } from "@/components/site/session-section";
import { HowItWorks } from "@/components/site/how-it-works";
import { ProofSection } from "@/components/site/proof-section";
import { WhySection } from "@/components/site/why-section";
import { FounderSection } from "@/components/site/founder-section";
import { WhoFor } from "@/components/site/who-for";
import { FaqSection } from "@/components/site/faq-section";
import { FinalCta } from "@/components/site/final-cta";
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
        <TrustStrip />
        <ProblemSection />
        <AlreadyPaying />
        <LeakMap />
        <EngineSection />
        <FuturePacing />
        <Outcomes />
        <ProofSection />
        <FounderSection />
        <SessionSection />
        <HowItWorks />
        <WhySection />
        <WhoFor />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
      <StickyMobileCta />
    </>

  );
}
