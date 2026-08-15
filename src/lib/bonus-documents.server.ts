/**
 * Bonus documents for confirmed ₹9 Strategy Call customers — server only.
 *
 * The three PDFs live in the PRIVATE `strategy-call-bonuses` bucket. RLS on
 * storage.objects denies anon and authenticated entirely for that bucket, so
 * the files are only ever reachable through short-lived signed URLs minted
 * here, after re-validating the lead on every single call.
 *
 * Object keys are declared ONCE, in BONUS_DOCUMENTS below.
 */

export const BONUS_BUCKET = "strategy-call-bonuses";

export interface BonusDocumentDef {
  key: string;
  title: string;
  description: string;
}

/** The single source of truth for filenames, titles and descriptions. */
export const BONUS_DOCUMENTS: readonly BonusDocumentDef[] = [
  {
    key: "01-landing-page-audit-checklist.pdf",
    title: "The Landing Page Audit Checklist",
    description:
      "25 checks for finding what your page is losing, before you spend more on traffic.",
  },
  {
    key: "02-what-to-say-on-a-sales-call.pdf",
    title: 'The "What To Say On A Sales Call" Cheat Sheet',
    description:
      "A running order for the first call — what to ask, and what to say at the four moments most calls go wrong.",
  },
  {
    key: "03-why-leads-dont-convert.pdf",
    title: 'The "Why Leads Don\'t Convert" Checklist',
    description:
      "The 12 places an enquiry quietly dies between the form and the sale, and the one-line fix for each.",
  },
] as const;

export interface BonusDocument {
  title: string;
  description: string;
  url: string;
}

/** Signed URL lifetime for links rendered on /book. */
export const WEB_EXPIRY_SECONDS = 3600;
/** Signed URL lifetime for links inside email — people open email later. */
export const EMAIL_EXPIRY_SECONDS = 60 * 60 * 24 * 7;

const CONFIRMED_STATUSES = ["confirmed", "scheduled", "rescheduled"];

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/**
 * Same gate as `claimWhatsappAccess`: verified payment AND a confirmed booking.
 * Payment alone is never enough. Returns the lead row, or null when locked.
 */
async function authorise(leadId: string, accessToken: string) {
  const db = await admin();

  const { data: lead } = await db
    .from("strategy_call_leads")
    .select("id, name, email")
    .eq("id", leadId)
    .eq("access_token", accessToken)
    .maybeSingle();
  if (!lead) return null;

  const { data: unlocked } = await db.rpc("strategy_call_booking_unlocked", {
    _lead_id: lead.id,
  });
  if (unlocked !== true) return null;

  const { data: booking } = await db
    .from("strategy_call_bookings")
    .select("status")
    .eq("lead_id", lead.id)
    .maybeSingle();
  if (!booking || !CONFIRMED_STATUSES.includes(booking.status)) return null;

  return lead;
}

/**
 * Mints signed URLs for whichever documents actually exist in the bucket.
 * A missing object is skipped silently so the other two still deliver.
 */
export async function signBonusDocuments(expiresIn: number): Promise<BonusDocument[]> {
  const db = await admin();
  const storage = db.storage.from(BONUS_BUCKET);

  const signed = await Promise.all(
    BONUS_DOCUMENTS.map(async (doc) => {
      try {
        const { data, error } = await storage.createSignedUrl(doc.key, expiresIn);
        if (error || !data?.signedUrl) return null;
        return { title: doc.title, description: doc.description, url: data.signedUrl };
      } catch {
        return null;
      }
    }),
  );

  return signed.filter((d): d is BonusDocument => d !== null);
}

/**
 * Public entry point. Returns an empty array for any lead that is not both
 * paid+verified and confirmed-booked. The bucket name, object keys and signed
 * URLs never appear in a payload for an unauthorised lead.
 */
export async function getBonusDocuments(
  leadId: string,
  accessToken: string,
): Promise<BonusDocument[]> {
  const lead = await authorise(leadId, accessToken);
  if (!lead) return [];
  return signBonusDocuments(WEB_EXPIRY_SECONDS);
}
