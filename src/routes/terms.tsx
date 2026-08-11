import { createFileRoute } from "@tanstack/react-router";
import { LegalList, LegalPage, LegalSection, MailLink } from "@/components/site/legal-page";

const TITLE = "Terms of Service — Growth Multiplier AI";
const DESCRIPTION =
  "What the ₹9 strategy session includes, how booking and cancellation work, and the limits of what is being offered.";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://growthmultiplierai.live/terms" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://growthmultiplierai.live/terms" }],
  }),
});

function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="11 August 2026"
      intro="These terms apply when you pay ₹9 to reserve a strategy session with Growth Multiplier AI."
    >
      <LegalSection heading="What the ₹9 buys">
        <p>
          A single one-to-one strategy session of 30 to 45 minutes, delivered personally by Akhil
          Srivastava over a video call. In it we look at how people currently find you, what
          happens after they show interest, and where the acquisition journey is losing them.
        </p>
        <p>
          The ₹9 is a commitment fee to hold the slot, not the price of the work discussed. It does
          not include implementation, ongoing consulting, ad management or any deliverable beyond
          the session itself.
        </p>
      </LegalSection>

      <LegalSection heading="No guarantee of results">
        <p className="text-fg">
          The session is advice and analysis only. Nothing said in it is a guarantee of leads,
          revenue, return on ad spend, conversion rate, booked appointments or any other specific
          result.
        </p>
        <p>
          Outcomes depend on your market, offer, pricing, budget, sales follow-up and execution —
          factors outside our control. You are responsible for the decisions you make with the
          advice given.
        </p>
      </LegalSection>

      <LegalSection heading="Booking, rescheduling and cancellation">
        <p>
          Once your payment is verified, you choose a slot through Calendly. Rescheduling and
          cancelling are also handled through Calendly, using the links in your booking
          confirmation email.
        </p>
        <LegalList
          items={[
            "Please reschedule rather than not turning up — slots are limited.",
            "If you miss a session without rescheduling, we may ask you to rebook.",
            "If we need to move a session, you can pick a new time or take a refund.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="Our right to decline">
        <p>
          We may decline or cancel a booking that is not a fit — for example a business we cannot
          usefully advise, or a request that falls outside what this session covers. If we do, the
          ₹9 is refunded in full and we will tell you why.
        </p>
      </LegalSection>

      <LegalSection heading="WhatsApp community conduct">
        <p>
          Community access is offered after a confirmed booking. It is a place for questions and
          discussion about client acquisition. Access may be revoked without refund for
          spam, self-promotion, harvesting members' contact details, harassment or abusive
          behaviour.
        </p>
      </LegalSection>

      <LegalSection heading="Payments">
        <p>
          Payments are processed by Razorpay. We never see or store your card details. Refunds are
          covered by our <a className="text-lime underline-offset-4 hover:underline" href="/refund-policy">refund policy</a>.
        </p>
      </LegalSection>

      <LegalSection heading="Governing law">
        <p>
          These terms are governed by the laws of India, and any dispute arising from them is
          subject to the jurisdiction of the courts of India.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about these terms: <MailLink />.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
