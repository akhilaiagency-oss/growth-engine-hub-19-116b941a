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
