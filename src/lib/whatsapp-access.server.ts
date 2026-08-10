/**
 * WhatsApp Community access — server only.
 *
 * The community URL lives in `WHATSAPP_COMMUNITY_URL` and is read here and
 * nowhere else. It is never returned in page payloads: only `claimAccess`
 * returns it, and only after re-validating the lead, the verified payment and
 * a confirmed booking.
 */
async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const CONFIRMED_STATUSES = ["confirmed", "scheduled", "rescheduled"];

/** The only reader of WHATSAPP_COMMUNITY_URL. Returns null when unusable. */
export function getWhatsappCommunityUrl(): string | null {
  const raw = process.env["WHATSAPP_COMMUNITY_URL"]?.trim();
  if (!raw || !raw.startsWith("https://")) return null;
  return raw;
}

export type ClaimResult = { status: "locked" } | { status: "ok"; url: string };

export async function claimWhatsappAccess(
  leadId: string,
  accessToken: string,
): Promise<ClaimResult> {
  const db = await admin();

  const { data: lead } = await db
    .from("strategy_call_leads")
    .select("id")
    .eq("id", leadId)
    .eq("access_token", accessToken)
    .maybeSingle();
  if (!lead) return { status: "locked" };

  const { data: unlocked } = await db.rpc("strategy_call_booking_unlocked", {
    _lead_id: lead.id,
  });
  if (unlocked !== true) return { status: "locked" };

  const { data: booking } = await db
    .from("strategy_call_bookings")
    .select("status")
    .eq("lead_id", lead.id)
    .maybeSingle();
  if (!booking || !CONFIRMED_STATUSES.includes(booking.status)) return { status: "locked" };

  const url = getWhatsappCommunityUrl();
  if (!url) return { status: "locked" };

  // Stamp `joined` once — repeat clicks must not overwrite the first join.
  await db
    .from("strategy_call_entitlements")
    .update({ whatsapp_status: "joined", joined_at: new Date().toISOString() })
    .eq("lead_id", lead.id)
    .neq("whatsapp_status", "joined");

  return { status: "ok", url };
}
