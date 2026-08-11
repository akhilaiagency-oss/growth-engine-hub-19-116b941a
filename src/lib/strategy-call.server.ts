/**
 * Server-only helpers for the ₹9 Strategy Call funnel.
 *
 * This file is never bundled into the client (the `.server.ts` extension is
 * blocked from client graphs). All database access uses the service-role
 * client, because the four `strategy_call_*` tables are fully locked down at
 * the row-level-security layer — no browser role can read or write them.
 *
 * Razorpay and Calendly are intentionally NOT implemented yet. The write
 * helpers below are the single points where those providers will plug in.
 */

export interface LeadInput {
  name: string;
  email: string;
  phone: string;
  sourcePage?: string | undefined;
}

/** The five answers collected after payment, before the calendar. */
export interface QualificationDetails {
  businessType: string;
  whatYouSell: string;
  marketingSpend: string;
  desiredOutcome: string;
  timeline: string;
}

export interface LeadHandle {
  leadId: string;
  accessToken: string;
}

export interface FunnelStatus {
  stage: string;
  payment: {
    status: string;
    verificationStatus: string;
    amountPaise: number;
    currency: string;
  } | null;
  booking: {
    status: string;
    scheduledAt: string | null;
    joinUrl: string | null;
  } | null;
  whatsappStatus: string;
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/** Persists a qualified lead and returns an opaque handle the browser can hold. */
export async function createLead(input: LeadInput): Promise<LeadHandle> {
  const db = await admin();
  const { data, error } = await db
    .from("strategy_call_leads")
    .insert({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      // The remaining five answers are collected after payment.

      answers: { ...input },
      stage: "qualified",
      source_page: input.sourcePage ?? null,
    })
    .select("id, access_token")
    .single();

  if (error) throw new Error(error.message);

  // Entitlement row is created up-front so WhatsApp access can be flipped
  // server-side later without a second lookup path.
  await db
    .from("strategy_call_entitlements")
    .insert({ lead_id: data.id, whatsapp_phone: input.phone.trim() });

  return { leadId: data.id, accessToken: data.access_token };
}

/** Read-back for the funnel UI. Requires BOTH the id and the opaque token. */
export async function readFunnelStatus(
  leadId: string,
  accessToken: string,
): Promise<FunnelStatus | null> {
  const db = await admin();
  const { data: lead } = await db
    .from("strategy_call_leads")
    .select("id, stage")
    .eq("id", leadId)
    .eq("access_token", accessToken)
    .maybeSingle();

  if (!lead) return null;

  const [{ data: payment }, { data: booking }, { data: entitlement }] = await Promise.all([
    db
      .from("strategy_call_payments")
      .select("status, verification_status, amount_paise, currency")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    db
      .from("strategy_call_bookings")
      .select("status, scheduled_at, join_url")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    db
      .from("strategy_call_entitlements")
      .select("whatsapp_status")
      .eq("lead_id", lead.id)
      .maybeSingle(),
  ]);

  return {
    stage: lead.stage,
    payment: payment
      ? {
          status: payment.status,
          verificationStatus: payment.verification_status,
          amountPaise: payment.amount_paise,
          currency: payment.currency,
        }
      : null,
    booking: booking
      ? {
          status: booking.status,
          scheduledAt: booking.scheduled_at,
          joinUrl: booking.join_url,
        }
      : null,
    whatsappStatus: entitlement?.whatsapp_status ?? "not_granted",
  };
}

const DETAIL_COLUMNS =
  "business_type, what_you_sell, marketing_spend, desired_outcome, timeline" as const;

export interface DetailRow {
  business_type: string | null;
  what_you_sell: string | null;
  marketing_spend: string | null;
  desired_outcome: string | null;
  timeline: string | null;
}

/** Qualification is complete when all five post-payment answers are present. */
export function isQualificationComplete(row: DetailRow | null | undefined): boolean {
  if (!row) return false;
  return [
    row.business_type,
    row.what_you_sell,
    row.marketing_spend,
    row.desired_outcome,
    row.timeline,
  ].every((v) => typeof v === "string" && v.trim().length > 0);
}

/** Existing answers, so a returning lead resumes on the first unanswered one. */
export async function readQualificationDetails(
  leadId: string,
  accessToken: string,
): Promise<QualificationDetails | null> {
  const db = await admin();
  const { data } = await db
    .from("strategy_call_leads")
    .select(DETAIL_COLUMNS)
    .eq("id", leadId)
    .eq("access_token", accessToken)
    .maybeSingle();
  if (!data) return null;
  return {
    businessType: data.business_type ?? "",
    whatYouSell: data.what_you_sell ?? "",
    marketingSpend: data.marketing_spend ?? "",
    desiredOutcome: data.desired_outcome ?? "",
    timeline: data.timeline ?? "",
  };
}

/**
 * Writes the five post-payment answers. Requires BOTH the lead handle and a
 * server-verified payment — the same gate that unlocks booking. Never widens
 * access: it cannot create a lead, and it cannot touch payment or booking rows.
 */
export async function saveQualificationDetails(
  leadId: string,
  accessToken: string,
  details: QualificationDetails,
): Promise<{ saved: boolean }> {
  const db = await admin();
  const { data: lead } = await db
    .from("strategy_call_leads")
    .select("id")
    .eq("id", leadId)
    .eq("access_token", accessToken)
    .maybeSingle();
  if (!lead) return { saved: false };

  const { data: unlocked } = await db.rpc("strategy_call_booking_unlocked", {
    _lead_id: lead.id,
  });
  if (unlocked !== true) return { saved: false };

  const { data: existing } = await db
    .from("strategy_call_leads")
    .select("answers")
    .eq("id", lead.id)
    .maybeSingle();
  const previous = (existing?.answers ?? {}) as Record<string, unknown>;

  const { error } = await db
    .from("strategy_call_leads")
    .update({
      business_type: details.businessType,
      what_you_sell: details.whatYouSell.trim(),
      marketing_spend: details.marketingSpend,
      desired_outcome: details.desiredOutcome,
      timeline: details.timeline,
      answers: { ...previous, ...details },
    })
    .eq("id", lead.id);
  if (error) throw new Error(error.message);

  return { saved: true };
}
