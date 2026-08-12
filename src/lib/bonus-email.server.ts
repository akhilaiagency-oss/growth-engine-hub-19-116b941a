/**
 * "Your three documents" email — server only.
 *
 * Sent exactly once, at the moment a booking first becomes confirmed. The
 * once-only guarantee is a single atomic claim on
 * `strategy_call_entitlements.sent_bonus_email_at`: the row is stamped BEFORE
 * anything is delivered, and only the update that actually flipped the NULL
 * proceeds. A retry, a reconciliation run, or two concurrent confirmations
 * therefore cannot produce a second send.
 *
 * Delivery failures are swallowed by the caller — an email must never fail or
 * roll back a booking confirmation.
 */
import {
  EMAIL_EXPIRY_SECONDS,
  signBonusDocuments,
  type BonusDocument,
} from "./bonus-documents.server";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const BONUS_EMAIL_SUBJECT =
  "Your ₹9 session is confirmed — and here are your three documents";

export const BONUS_EMAIL_SENDER_NAME = "Growth Multiplier AI";

function firstName(name: string): string {
  const first = name.trim().split(/\s+/)[0];
  return first && first.length > 0 ? first : "there";
}

/** Plain-text body. Warm, no marketing padding. */
export function renderBonusEmailText(name: string, docs: BonusDocument[]): string {
  const list = docs
    .map((d) => `${d.title}\n${d.description}\nDownload: ${d.url}`)
    .join("\n\n");

  return [
    `Hi ${firstName(name)},`,
    "",
    "Your strategy session is confirmed. You'll get a calendar invite with the meeting link separately.",
    "",
    "Here are the three documents that come with your session. They're yours to keep whether or not we end up working together:",
    "",
    list,
    "",
    "If you can, fill in the Follow-Up Speed Scorecard before we speak. Real numbers turn a general conversation into a specific one, and it's the fastest way to find which stage of your funnel is costing you the most.",
    "",
    "These download links expire in 7 days — save the files somewhere safe.",
    "",
    "See you on the call.",
    "Akhil Srivastava",
    "Founder, Growth Multiplier AI",
  ].join("\n");
}

export type BonusEmailResult =
  | { status: "sent" }
  | { status: "already_sent" }
  | { status: "no_documents" }
  | { status: "not_configured" }
  | { status: "no_recipient" };

/**
 * Claim + send. Returns a status rather than throwing; the caller still wraps
 * this in try/catch so nothing here can ever break booking confirmation.
 */
export async function sendBonusDocumentsEmail(leadId: string): Promise<BonusEmailResult> {
  const db = await admin();

  const { data: lead } = await db
    .from("strategy_call_leads")
    .select("id, name, email")
    .eq("id", leadId)
    .maybeSingle();
  if (!lead?.email) return { status: "no_recipient" };

  const docs = await signBonusDocuments(EMAIL_EXPIRY_SECONDS);
  if (docs.length === 0) return { status: "no_documents" };

  // ATOMIC ONCE-ONLY CLAIM. `.is(..., null)` means only one caller can ever
  // flip this column; everyone else gets zero rows back and stops here.
  const { data: claimed } = await db
    .from("strategy_call_entitlements")
    .update({ sent_bonus_email_at: new Date().toISOString() })
    .eq("lead_id", leadId)
    .is("sent_bonus_email_at", null)
    .select("id");
  if (!claimed || claimed.length === 0) return { status: "already_sent" };

  try {
    const delivered = await deliver(lead.email, lead.name ?? "", docs);
    if (!delivered) {
      // Nothing left the building — release the claim so a later confirmation
      // or reconciliation can try again.
      await db
        .from("strategy_call_entitlements")
        .update({ sent_bonus_email_at: null })
        .eq("lead_id", leadId);
      return { status: "not_configured" };
    }
  } catch (error) {
    await db
      .from("strategy_call_entitlements")
      .update({ sent_bonus_email_at: null })
      .eq("lead_id", leadId);
    throw error;
  }

  return { status: "sent" };
}

/**
 * Delivery seam. Sends through the project's managed email infrastructure.
 * Returns false only when sending is not configured, in which case the caller
 * releases the once-only claim untouched.
 */
async function deliver(to: string, name: string, docs: BonusDocument[]): Promise<boolean> {
  if (!process.env["LOVABLE_API_KEY"]) return false;

  const { sendTemplateEmail } = await import("./email-templates/send-email");

  const result = await sendTemplateEmail("bonus-documents", to, {
    templateData: {
      firstName: firstName(name),
      documents: docs.map((d) => ({
        title: d.title,
        description: d.description,
        url: d.url,
      })),
    },
  });

  // A suppressed recipient is a final outcome, not a retryable failure — the
  // claim stays stamped so we never loop on it.
  return result.sent || result.reason === "recipient_suppressed";
}
