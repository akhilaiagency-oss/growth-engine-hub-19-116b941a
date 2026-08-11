import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  createLead,
  readFunnelStatus,
  saveQualificationDetails as persistQualificationDetails,
} from "./strategy-call.server";
import {
  isBookingUnlocked,
  recordCheckoutOutcome,
  startPayment,
  verifyCheckoutPayment,
} from "./strategy-call-payments.server";
import { getBookingAccess, verifyCalendlyBooking } from "./strategy-call-booking.server";
import { claimWhatsappAccess } from "./whatsapp-access.server";


const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(8).max(20),
  sourcePage: z.string().trim().max(200).optional(),
});

const handleSchema = z.object({
  leadId: z.string().uuid(),
  accessToken: z.string().uuid(),
});

const verifySchema = handleSchema.extend({
  orderId: z.string().trim().min(4).max(120),
  paymentId: z.string().trim().min(4).max(120),
  signature: z.string().trim().min(16).max(256),
});

const outcomeSchema = handleSchema.extend({
  orderId: z.string().trim().min(4).max(120),
  outcome: z.enum(["payment_failed", "payment_cancelled"]),
  reason: z.string().trim().max(300).optional(),
});

/** Optional, UNTRUSTED hints from the Calendly embed. Validated server-side. */
const verifyBookingSchema = handleSchema.extend({
  eventUri: z.string().trim().max(300).optional(),
  inviteeUri: z.string().trim().max(300).optional(),
});

/** Public: stores a qualified lead. No secrets ever reach the browser. */
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }) => createLead(data));

/** Public but unguessable: requires the lead id AND its opaque access token. */
export const getFunnelStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => handleSchema.parse(input))
  .handler(async ({ data }) => readFunnelStatus(data.leadId, data.accessToken));

/** Creates the ₹9 Razorpay order server-side and returns only public fields. */
export const createStrategyCallOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => handleSchema.parse(input))
  .handler(async ({ data }) => startPayment(data.leadId, data.accessToken));

/** Verifies the Checkout signature server-side. The browser is never trusted. */
export const verifyStrategyCallPayment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => verifySchema.parse(input))
  .handler(async ({ data }) => verifyCheckoutPayment(data));

/** Records a browser-side failure or dismissal. Cannot downgrade a paid row. */
export const recordStrategyCallOutcome = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => outcomeSchema.parse(input))
  .handler(async ({ data }) => {
    await recordCheckoutOutcome(data);
    return { ok: true };
  });

/** Authoritative answer to "can this lead reach Calendly?" */
export const checkBookingUnlocked = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => handleSchema.parse(input))
  .handler(async ({ data }) => ({
    unlocked: await isBookingUnlocked(data.leadId, data.accessToken),
  }));

/**
 * Issues the Calendly scheduling URL — but only for a verified paid lead.
 * A locked lead gets no URL at all, so the embed cannot be reached.
 */
export const getStrategyCallBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => handleSchema.parse(input))
  .handler(async ({ data }) => getBookingAccess(data.leadId, data.accessToken));


/**
 * Pull-based booking confirmation. Calendly's free plan has no webhooks, so
 * this asks the Calendly API server-side. It is the only path that can mark a
 * booking confirmed, and it requires a server-verified payment first.
 */
export const verifyStrategyCallBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => verifyBookingSchema.parse(input))
  .handler(async ({ data }) =>
    verifyCalendlyBooking(data.leadId, data.accessToken, {
      eventUri: data.eventUri ?? null,
      inviteeUri: data.inviteeUri ?? null,
    }),
  );

/**
 * Returns the WhatsApp community URL only for a lead with a verified payment
 * AND a confirmed booking. The URL never appears in any page payload.
 */
export const claimWhatsappCommunityAccess = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => handleSchema.parse(input))
  .handler(async ({ data }) => claimWhatsappAccess(data.leadId, data.accessToken));

const detailsSchema = handleSchema.extend({
  businessType: z.string().trim().min(1).max(120),
  whatYouSell: z.string().trim().min(10).max(300),
  marketingSpend: z.string().trim().min(1).max(120),
  desiredOutcome: z.string().trim().min(1).max(120),
  timeline: z.string().trim().min(1).max(120),
});

/**
 * Stores the five post-payment answers. Gated on the lead handle AND a
 * server-verified payment, so it can never be used to enrich an unpaid lead.
 */
export const saveQualificationDetails = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => detailsSchema.parse(input))
  .handler(async ({ data }) =>
    persistQualificationDetails(data.leadId, data.accessToken, {
      businessType: data.businessType,
      whatYouSell: data.whatYouSell,
      marketingSpend: data.marketingSpend,
      desiredOutcome: data.desiredOutcome,
      timeline: data.timeline,
    }),
  );

/**
 * Honest scarcity — real Calendly availability only. Returns `{ available }`
 * when a genuine count is known, otherwise null so the UI shows the
 * qualitative line with no number. Never invents a count.
 */
export const getSessionAvailability = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionAvailabilityCount } = await import("./session-availability.server");
  const available = await getSessionAvailabilityCount();
  return available === null ? null : { available };
});
