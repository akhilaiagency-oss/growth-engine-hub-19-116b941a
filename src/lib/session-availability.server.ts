/**
 * Honest availability — the ONLY source of the number shown next to the CTA.
 *
 * Reads genuinely available Calendly slots for the configured event type over
 * the next 7 days, through the connector gateway. If anything is missing,
 * fails or returns nothing, this returns `null` and the UI degrades to the
 * qualitative line with no number. A count is never fabricated.
 *
 * Cached in-process for 10 minutes so the endpoint isn't hammered.
 */

import { calendlyGet, getCalendlyUserUri, getSchedulingUrl } from "./calendly.server";

const CACHE_MS = 10 * 60 * 1000;
const WINDOW_DAYS = 7;
const MAX_SHOWN = 20;

let cache: { at: number; value: number | null } | null = null;
let cachedEventTypeUri: string | null = null;

interface EventType {
  uri?: string | null;
  active?: boolean | null;
  scheduling_url?: string | null;
}

async function resolveEventTypeUri(): Promise<string | null> {
  if (cachedEventTypeUri) return cachedEventTypeUri;
  const userUri = await getCalendlyUserUri();
  if (!userUri) return null;

  const data = await calendlyGet<{ collection?: EventType[] }>(
    `/event_types?user=${encodeURIComponent(userUri)}&count=50`,
  );
  const all = (data?.collection ?? []).filter((e) => e.active !== false && e.uri);
  if (all.length === 0) return null;

  const target = getSchedulingUrl()?.replace(/\/+$/, "").toLowerCase();
  const matched = target
    ? all.find((e) => (e.scheduling_url ?? "").replace(/\/+$/, "").toLowerCase() === target)
    : undefined;

  cachedEventTypeUri = (matched ?? all[0])?.uri ?? null;
  return cachedEventTypeUri;
}

/** Real open slots in the next 7 days, or null when it cannot be determined. */
export async function getSessionAvailabilityCount(): Promise<number | null> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) return cache.value;

  let value: number | null = null;
  try {
    const eventType = await resolveEventTypeUri();
    if (eventType) {
      // Calendly requires start_time strictly in the future.
      const start = new Date(now + 2 * 60 * 1000).toISOString();
      const end = new Date(now + WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
      const data = await calendlyGet<{ collection?: { status?: string | null }[] }>(
        `/event_type_available_times?event_type=${encodeURIComponent(eventType)}` +
          `&start_time=${encodeURIComponent(start)}&end_time=${encodeURIComponent(end)}`,
      );
      const slots = data?.collection;
      if (Array.isArray(slots)) {
        const open = slots.filter((s) => (s.status ?? "available") === "available").length;
        // Only surface a number when it is genuinely limited. A large count
        // (or a paging cap) is real but says nothing — degrade to the
        // qualitative line rather than printing a meaningless figure.
        value = open > 0 && open <= MAX_SHOWN ? open : null;
      }
    }
  } catch {
    value = null;
  }

  cache = { at: now, value };
  return value;
}
