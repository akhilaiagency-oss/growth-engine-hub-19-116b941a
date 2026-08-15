import { useEffect, useState } from "react";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Milliseconds remaining until the coming Sunday 23:59:59 IST.
 * Always computed from the wall clock — never from a stored start time —
 * so refreshing, reopening or returning tomorrow all show the correct value.
 */
export function msUntilWeekEndIst(nowMs: number = Date.now()): number {
  const ist = new Date(nowMs + IST_OFFSET_MS);
  const daysUntilSunday = (7 - ist.getUTCDay()) % 7;
  const endIstMs = Date.UTC(
    ist.getUTCFullYear(),
    ist.getUTCMonth(),
    ist.getUTCDate() + daysUntilSunday,
    23,
    59,
    59,
    999,
  );
  let remaining = endIstMs - IST_OFFSET_MS - nowMs;
  if (remaining <= 0) remaining += 7 * 24 * 60 * 60 * 1000;
  return remaining;
}

function split(ms: number): Remaining {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** Ticks every second, recomputed from the clock on every tick. */
export function useWeeklyCountdown(): Remaining | null {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(split(msUntilWeekEndIst()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return remaining;
}
