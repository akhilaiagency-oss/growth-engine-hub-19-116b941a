import { useEffect, useState } from "react";

/**
 * Single source of truth for every urgency / price-anchor element on the site.
 *
 * To move to genuinely honest scarcity later:
 *  - set `SLOTS_LEFT` from a real weekly cap (or render <SessionAvailability /> again)
 *  - set `OFFER_DEADLINE_ISO` to a fixed campaign end instead of a per-visitor window
 */
export const URGENCY = {
  originalPrice: 99,
  offerPrice: 9,
  slotsLeft: 5,
  /** Per-visitor offer window, in hours. */
  windowHours: 3,
  /** Set to an ISO string to use one fixed deadline for everyone instead. */
  fixedDeadlineIso: null as string | null,
} as const;

const STORAGE_KEY = "gma_offer_deadline";

function resolveDeadline(): number {
  if (URGENCY.fixedDeadlineIso) return new Date(URGENCY.fixedDeadlineIso).getTime();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? Number(stored) : NaN;
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  } catch {
    /* storage unavailable — fall through to a fresh window */
  }
  const deadline = Date.now() + URGENCY.windowHours * 60 * 60 * 1000;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(deadline));
  } catch {
    /* ignore */
  }
  return deadline;
}

function pad(n: number) {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

export interface Countdown {
  /** false until hydration, so SSR and the first client render match. */
  ready: boolean;
  expired: boolean;
  label: string;
}

/** Ticking countdown to the visitor's offer deadline. */
export function useCountdown(): Countdown {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const deadline = resolveDeadline();
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (remaining === null) return { ready: false, expired: false, label: "--:--:--" };

  const total = Math.floor(remaining / 1000);
  return {
    ready: true,
    expired: remaining <= 0,
    label: `${pad(total / 3600)}:${pad((total % 3600) / 60)}:${pad(total % 60)}`,
  };
}
