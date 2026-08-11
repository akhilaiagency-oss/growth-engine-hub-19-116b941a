/**
 * Calendly server-only adapter — REST API v2 via the Lovable connector gateway.
 *
 * The Calendly App connector supplies `CALENDLY_API_KEY` (a gateway connection
 * key, NOT a raw Calendly token). The gateway transparently refreshes OAuth
 * tokens, so this file never manages refresh logic. Direct calls to
 * `api.calendly.com` will fail.
 *
 * The `.server.ts` extension keeps this out of every client bundle.
 * `CALENDLY_API_KEY` and `LOVABLE_API_KEY` are read inside functions, are never
 * returned to the browser and are never logged. Only the public scheduling URL
 * is ever sent to the client.
 */

const GATEWAY_URL = "https://connector-gateway.lovable.dev/calendly";

function getLovableApiKey(): string | null {
  const key = process.env["LOVABLE_API_KEY"];
  return key && key.trim().length > 20 ? key.trim() : null;
}

function getCalendlyApiKey(): string | null {
  const key = process.env["CALENDLY_API_KEY"];
  return key && key.trim().length > 10 ? key.trim() : null;
}

export function getSchedulingUrl(): string | null {
  const url = process.env["CALENDLY_SCHEDULING_URL"];
  return url && url.startsWith("https://") ? url : null;
}

export function isCalendlyApiConfigured(): boolean {
  return getLovableApiKey() !== null && getCalendlyApiKey() !== null;
}

async function calendlyGateway<T>(path: string): Promise<T | null> {
  const lovableKey = getLovableApiKey();
  const calendlyKey = getCalendlyApiKey();
  if (!lovableKey || !calendlyKey) return null;

  const response = await fetch(`${GATEWAY_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": calendlyKey,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // Never include the keys or Authorization header in a log line.
    console.error(`[Calendly] GET ${path} failed with ${response.status}`);
    return null;
  }
  return (await response.json()) as T;
}

/** Read-only gateway GET, for other server-only modules (availability, etc). */
export async function calendlyGet<T>(path: string): Promise<T | null> {
  return calendlyGateway<T>(path);
}

/** Resolved once per server instance — the PAT maps to a single Calendly user. */
let cachedUserUri: string | null = null;

export async function getCalendlyUserUri(): Promise<string | null> {
  if (cachedUserUri) return cachedUserUri;
  const data = await calendlyGateway<{ resource?: { uri?: string } }>("/users/me");
  cachedUserUri = data?.resource?.uri ?? null;
  return cachedUserUri;
}

export interface CalendlyEvent {
  uri: string;
  name?: string | null;
  status?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  /** When the event was CREATED (not when it starts) — the authoritative gate. */
  created_at?: string | null;
  updated_at?: string | null;
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

const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Safely extract the UUID from an UNTRUSTED `scheduled_events/<uuid>` URI.
 * Anything that isn't a well-formed Calendly HTTPS URL with a UUID last
 * segment returns null — the value is never concatenated into a request path
 * without passing this gate.
 */
export function parseScheduledEventUuid(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== "string" || raw.length > 300) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.hostname !== "api.calendly.com") return null;
  const parts = url.pathname.split("/").filter(Boolean);
  // Accept /scheduled_events/<uuid> and /scheduled_events/<uuid>/invitees/<uuid>
  if (parts[0] !== "scheduled_events") return null;
  const uuid = parts[1];
  if (!uuid || !UUID_RE.test(uuid)) return null;
  return uuid.toLowerCase();
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

  const data = await calendlyGateway<{ collection?: CalendlyEvent[] }>(
    `/scheduled_events?${params.toString()}`,
  );
  return data?.collection ?? [];
}

export async function getScheduledEvent(uuid: string): Promise<CalendlyEvent | null> {
  const data = await calendlyGateway<{ resource?: CalendlyEvent }>(`/scheduled_events/${uuid}`);
  return data?.resource ?? null;
}

export async function listEventInvitees(uuid: string): Promise<CalendlyInvitee[]> {
  const data = await calendlyGateway<{ collection?: CalendlyInvitee[] }>(
    `/scheduled_events/${uuid}/invitees?count=10`,
  );
  return data?.collection ?? [];
}

/** Exact, case-insensitive, trimmed email match. Never fuzzy-match a person. */
export function sameEmail(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}
