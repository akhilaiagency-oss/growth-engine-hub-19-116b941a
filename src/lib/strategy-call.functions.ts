import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createLead, readFunnelStatus } from "./strategy-call.server";

const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(8).max(20),
  businessType: z.string().trim().min(1).max(120),
  whatYouSell: z.string().trim().min(10).max(300),
  marketingSpend: z.string().trim().min(1).max(120),
  desiredOutcome: z.string().trim().min(1).max(120),
  timeline: z.string().trim().min(1).max(120),
  sourcePage: z.string().trim().max(200).optional(),
});

const handleSchema = z.object({
  leadId: z.string().uuid(),
  accessToken: z.string().uuid(),
});

/** Public: stores a qualified lead. No secrets ever reach the browser. */
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }) => createLead(data));

/** Public but unguessable: requires the lead id AND its opaque access token. */
export const getFunnelStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => handleSchema.parse(input))
  .handler(async ({ data }) => readFunnelStatus(data.leadId, data.accessToken));
