import { saveQualificationDetails, submitLead } from "@/lib/strategy-call.functions";

export interface QualificationAnswers {
  name: string;
  email: string;
  phone: string;
  businessType: string;
  whatYouSell: string;
  marketingSpend: string;
  desiredOutcome: string;
  timeline: string;
}

export type QualificationField = keyof QualificationAnswers;

/** The three fields collected before payment. */
export type ContactField = "name" | "email" | "phone";
/** The five fields collected after payment, before the calendar. */
export type DetailField = Exclude<QualificationField, ContactField>;

export type DetailAnswers = Record<DetailField, string>;

export const EMPTY_ANSWERS: QualificationAnswers = {
  name: "",
  email: "",
  phone: "",
  businessType: "",
  whatYouSell: "",
  marketingSpend: "",
  desiredOutcome: "",
  timeline: "",
};

export const EMPTY_DETAILS: DetailAnswers = {
  businessType: "",
  whatYouSell: "",
  marketingSpend: "",
  desiredOutcome: "",
  timeline: "",
};

export const STORAGE_KEY = "gma-qualification";
export const DETAILS_STORAGE_KEY = "gma-qualification-details";


interface BaseQuestion {
  field: QualificationField;
  label: string;
  helper?: string;
  error: string;
  reviewLabel: string;
}

export interface TextQuestion extends BaseQuestion {
  kind: "text";
  inputType: "text" | "email" | "tel";
  autoComplete: string;
  inputMode?: "email" | "tel";
}

export interface TextareaQuestion extends BaseQuestion {
  kind: "textarea";
  rows: number;
  minLength: number;
  maxLength: number;
}

export interface ChoiceQuestion extends BaseQuestion {
  kind: "choice";
  options: string[];
}

export type Question = TextQuestion | TextareaQuestion | ChoiceQuestion;

export const QUESTIONS: Question[] = [
  {
    kind: "text",
    field: "name",
    label: "What's your name?",
    inputType: "text",
    autoComplete: "name",
    error: "Please enter your name.",
    reviewLabel: "Name",
  },
  {
    kind: "text",
    field: "email",
    label: "What's your email?",
    helper: "We'll send your booking confirmation here.",
    inputType: "email",
    autoComplete: "email",
    inputMode: "email",
    error: "Please enter a valid email address.",
    reviewLabel: "Email",
  },
  {
    kind: "text",
    field: "phone",
    label: "Phone or WhatsApp number",
    helper: "Used for call reminders and community access.",
    inputType: "tel",
    autoComplete: "tel",
    inputMode: "tel",
    error: "Please enter a valid phone number.",
    reviewLabel: "Phone / WhatsApp",
  },
  {
    kind: "choice",
    field: "businessType",
    label: "What kind of business is this?",
    options: [
      "Real estate",
      "Coaching or consulting",
      "Clinic or healthcare practice",
      "Professional services",
      "E-commerce or D2C",
      "Education or training",
      "Something else",
    ],
    error: "Please choose one.",
    reviewLabel: "Business type",
  },
  {
    kind: "textarea",
    field: "whatYouSell",
    label: "What do you sell?",
    helper: "A sentence is plenty — what someone is actually buying from you.",
    rows: 4,
    minLength: 10,
    maxLength: 300,
    error: "Tell us in a few words what you sell.",
    reviewLabel: "What you sell",
  },
  {
    kind: "choice",
    field: "marketingSpend",
    label: "What are you currently investing in marketing each month?",
    helper: "Ballpark is fine — it tells us what's realistic to recommend.",
    options: [
      "Not spending yet",
      "Under ₹25,000",
      "₹25,000 – ₹75,000",
      "₹75,000 – ₹2,00,000",
      "₹2,00,000+",
      "Prefer not to say",
    ],
    error: "Please choose one.",
    reviewLabel: "Monthly marketing investment",
  },
  {
    kind: "choice",
    field: "desiredOutcome",
    label: "What would make this worth your time?",
    options: [
      "More qualified leads",
      "More booked appointments",
      "Better lead quality",
      "Faster follow-up",
      "A full acquisition system rebuild",
      "Something else",
    ],
    error: "Please choose one.",
    reviewLabel: "Desired outcome",
  },
  {
    kind: "choice",
    field: "timeline",
    label: "When would you want to start?",
    options: ["Immediately", "Within 30 days", "In 1–3 months", "Just exploring for now"],
    error: "Please choose one.",
    reviewLabel: "Timeline",
  },
];

export function validateAnswer(question: Question, value: string): string | null {
  const v = value.trim();
  if (question.kind === "choice") return v ? null : question.error;
  if (question.kind === "textarea") {
    return v.length >= question.minLength ? null : question.error;
  }
  switch (question.field) {
    case "name":
      return v.length >= 2 ? null : question.error;
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : question.error;
    case "phone": {
      const cleaned = v.replace(/[\s\-()]/g, "");
      return /^\+?\d{8,15}$/.test(cleaned) ? null : question.error;
    }
    default:
      return v ? null : question.error;
  }
}

export const LEAD_HANDLE_KEY = "gma-lead-handle";

export interface LeadHandle {
  leadId: string;
  accessToken: string;
}

/**
 * THE ONE PLACE THE BACKEND IS WIRED.
 * Stores the qualified lead server-side and returns an opaque handle that
 * payment and booking are attached to. The handle carries no payment state.
 */
export async function submitQualification(answers: QualificationAnswers): Promise<LeadHandle> {
  const handle = await submitLead({
    data: {
      ...answers,
      sourcePage: typeof window === "undefined" ? "/qualify" : window.location.pathname,
    },
  });
  if (typeof window !== "undefined") {
    sessionStorage.setItem(LEAD_HANDLE_KEY, JSON.stringify(handle));
  }
  return handle;
}

export function readLeadHandle(): LeadHandle | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(LEAD_HANDLE_KEY);
    return raw ? (JSON.parse(raw) as LeadHandle) : null;
  } catch {
    return null;
  }
}
