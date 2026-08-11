import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection, MailLink } from "@/components/site/legal-page";

const TITLE = "Refund Policy — Growth Multiplier AI";
const DESCRIPTION =
  "The ₹9 strategy session fee is fully refundable on request before the session. Here is how to ask and how long it takes.";

export const Route = createFileRoute("/refund-policy")({
  component: RefundPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://growthmultiplierai.live/refund-policy" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://growthmultiplierai.live/refund-policy" }],
  }),
});

function RefundPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="11 August 2026"
      intro="The ₹9 exists to make the booking real, not to make money. If you want it back, you get it back."
    >
      <LegalSection heading="Fully refundable before the session">
        <p>
          The ₹9 strategy session fee is fully refundable on request at any point before the
          session takes place. You do not need to give a reason and we will not ask for one.
        </p>
      </LegalSection>

      <LegalSection heading="How to request a refund">
        <p>
          Email <MailLink /> from the address you used to book, or include it in the message. A
          single line is enough. We will confirm by reply once the refund has been raised.
        </p>
      </LegalSection>

      <LegalSection heading="How long it takes">
        <p>
          Refunds are issued back through Razorpay to the original payment method. We raise the
          refund within 2 working days of your request. Razorpay and your bank or card issuer then
          typically take 5 to 7 working days to place the money back in your account — that part of
          the timeline is theirs, not ours.
        </p>
      </LegalSection>

      <LegalSection heading="If we can't deliver the session">
        <p>
          If we have to cancel — illness, a scheduling failure, a technical problem on our side, or
          a booking we decide isn't a fit — the choice is yours: a full refund, or a new time at
          your convenience. We will contact you directly to arrange it.
        </p>
      </LegalSection>

      <LegalSection heading="After the session">
        <p>
          Once the session has been delivered, the ₹9 is not refundable — the time was spent on your
          business. If something about the session was genuinely wrong, email <MailLink /> and we
          will look at it case by case.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
