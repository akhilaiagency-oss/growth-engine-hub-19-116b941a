/**
 * Calendly server-only adapter — REST API v2 (works on the FREE plan with a
 * Personal Access Token). Webhooks are a paid feature and are NOT used.
 *
 * The `.server.ts` extension keeps this out of every client bundle.
 * CALENDLY_PERSONAL_ACCESS_TOKEN is read inside functions, is never returned
 * to the browser and is never logged. Only the public scheduling URL is ever
 * sent to the client.
 */

const API = "https://api.calendly.com";

export function getSchedulingUrl(): string | null {
  const url = process.env["CALENDLY_SCHEDULING_URL"];
  return url && url.startsWith("https://") ? url : null;
}

function getToken(): string | null {
  const token = process.env["CALENDLY_PERSONAL_ACCESS_TOKEN"];
  return token && token.trim().length > 20 ? token.trim() : null;
}

export function isCalendlyApiConfigured(): boolean {
  return getToken() !== null;
}

async function calendlyGet<T>(path: string): Promise<T | null> {
  const token = getToken();
  if (!token) return null;

  const response = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });

  if (!response.ok) {
    // Never include the token or the Authorization header in a log line.
    console.error(`[Calendly] GET ${path} failed with ${response.status}`);
    return null;
  }
  return (await response.json()) as T;
}

/** Resolved once per server instance — the PAT maps to a single Calendly user. */
let cachedUserUri: string | null = null;

export async function getCalendlyUserUri(): Promise<string | null> {
  if (cachedUserUri) return cachedUserUri;
  const data = await calendlyGet<{ resource?: { uri?: string } }>("/users/me");
  cachedUserUri = data?.resource?.uri ?? null;
  return cachedUserUri;
}

export interface CalendlyEvent {
  uri: string;
  name?: string | null;
  status?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  location?: { join_url?: string | null; type?: string | null; location?: string | null } | null;
}

export interface CalendlyInvitee {
  uri: string;
  email?: string | null;
  name?: string | null;
  timezone?: string | null;
  status?: string | null;
  cancel_url?: string | null;
  reschedule_url?: string | null;
}

export function eventUuid(eventUri: string): string {
  return eventUri.split("/").filter(Boolean).pop() ?? eventUri;
}

/** Active scheduled events for this invitee email, starting after `minStartTime`. */
export async function listScheduledEvents(input: {
  inviteeEmail: string;
  minStartTime?: string | null;
  status?: "active" | "canceled";
}): Promise<CalendlyEvent[]> {
  const userUri = await getCalendlyUserUri();
  if (!userUri) return [];

  const params = new URLSearchParams({
    user: userUri,
    invitee_email: input.inviteeEmail.trim().toLowerCase(),
    status: input.status ?? "active",
    count: "10",
  });
  if (input.minStartTime) params.set("min_start_time", input.minStartTime);

  const data = await calendlyGet<{ collection?: CalendlyEvent[] }>(
    `/scheduled_events?${params.toString()}`,
  );
  return data?.collection ?? [];
}

export async function getScheduledEvent(uuid: string): Promise<CalendlyEvent | null> {
  const data = await calendlyGet<{ resource?: CalendlyEvent }>(`/scheduled_events/${uuid}`);
  return data?.resource ?? null;
}

export async function listEventInvitees(uuid: string): Promise<CalendlyInvitee[]> {
  const data = await calendlyGet<{ collection?: CalendlyInvitee[] }>(
    `/scheduled_events/${uuid}/invitees?count=10`,
  );
  return data?.collection ?? [];
}

/** Exact, case-insensitive, trimmed email match. Never fuzzy-match a person. */
export function sameEmail(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}
