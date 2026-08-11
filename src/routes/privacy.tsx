import { createFileRoute } from "@tanstack/react-router";
import { LegalList, LegalPage, LegalSection, MailLink } from "@/components/site/legal-page";

const TITLE = "Privacy Policy — Growth Multiplier AI";
const DESCRIPTION =
  "What Growth Multiplier AI collects when you book a ₹9 strategy session, where it is stored, who processes it, and how to have it deleted.";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://growthmultiplierai.live/privacy" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://growthmultiplierai.live/privacy" }],
  }),
});

function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="11 August 2026"
      intro="This page describes exactly what this website collects, why, and who else touches it. It covers the ₹9 strategy session booking flow, which is the only place the site asks you for information."
    >
      <LegalSection heading="What we collect">
        <p>Before payment, on the qualification page:</p>
        <LegalList
          items={[
            "Your name",
            "Your email address",
            "Your phone or WhatsApp number",
          ]}
        />
        <p>After payment, before you choose a time:</p>
        <LegalList
          items={[
            "What kind of business you run",
            "What you sell",
            "Your monthly marketing investment (a range, not an exact figure)",
            "The outcome you want from the session",
            "When you want to start",
          ]}
        />
        <p>
          We also record the page you started from, basic campaign parameters, and your browser's
          user agent string. We do not collect anything else, and there are no optional fields
          hidden elsewhere on the site.
        </p>
      </LegalSection>

      <LegalSection heading="Payment information">
        <p>
          The ₹9 payment is processed by Razorpay. Card, UPI and bank details are entered inside
          Razorpay's own checkout and never reach this website or its servers.
        </p>
        <p>
          From a payment we store only the Razorpay order ID, the Razorpay payment ID, the payment
          status, the amount, the method label (for example "card" or "upi") and the timestamps. We
          keep the signature Razorpay returns so the payment can be verified server-side.
        </p>
      </LegalSection>

      <LegalSection heading="Booking information">
        <p>
          Sessions are scheduled through Calendly. When you book, we read back from Calendly and
          store the scheduled start and end time, the event name and identifier, the timezone, the
          email address you gave Calendly, the meeting join link, and the reschedule and cancel
          links so the booking can be managed.
        </p>
      </LegalSection>

      <LegalSection heading="Where it is stored">
        <p>
          All of the above is stored in a PostgreSQL database hosted on Supabase. The tables are
          locked down at the database level — no visitor, signed in or not, can read them from the
          browser. Access is restricted to the business owner, Akhil Srivastava.
        </p>
      </LegalSection>

      <LegalSection heading="Why we collect it">
        <LegalList
          items={[
            "To reserve, prepare for and deliver your strategy session.",
            "To let Akhil review your business before the call, so the session isn't generic.",
            "To contact you about that session — confirmation, reminders, rescheduling.",
            "To give you access to the WhatsApp community after a confirmed booking.",
          ]}
        />
        <p>
          We do not use your information for advertising, we do not build profiles for resale, and
          we do not sell or rent your data to anyone.
        </p>
      </LegalSection>

      <LegalSection heading="Third parties">
        <LegalList
          items={[
            <>
              <span className="text-fg">Razorpay</span> — processes the ₹9 payment.
            </>,
            <>
              <span className="text-fg">Calendly</span> — schedules the session and holds the
              calendar event.
            </>,
            <>
              <span className="text-fg">WhatsApp</span> — hosts the community you can join after a
              confirmed booking.
            </>,
            <>
              <span className="text-fg">Supabase</span> — hosts the database this site writes to.
            </>,
          ]}
        />
        <p>
          Each of these providers handles your information under its own privacy policy. We share
          with them only what their service needs to function.
        </p>
      </LegalSection>

      <LegalSection heading="Retention and deletion">
        <p>
          We keep your information for as long as it is useful for delivering and following up on
          your session, and for as long as payment records need to be retained.
        </p>
        <p>
          You can ask for your information to be deleted at any time by emailing <MailLink />. Say
          which email address you used to book and we will remove your lead, qualification answers
          and booking records. Payment records held by Razorpay are subject to their retention
          rules and their own policy.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about this policy, or about what we hold on you: <MailLink />.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
