import { useEffect, useState } from "react";
import {
  SLOT_START_HOUR,
  SLOT_START_MIN,
  LAST_SLOT_HOUR,
  LAST_SLOT_MIN,
  SLOT_STEP_MINUTES,
  BOOKING_NOTICE_MINUTES,
} from "@/data/capacity";

export interface NextSlot {
  hours: string;
  minutes: string;
  seconds: string;
  /** e.g. "6:00 PM IST" */
  slotLabel: string;
}

/** Wall-clock "now" shifted into IST, regardless of the visitor's timezone. */
function istNow(now: Date = new Date()): Date {
  return new Date(now.getTime() + (330 + now.getTimezoneOffset()) * 60000);
}

function label(minutesOfDay: number): string {
  const hour24 = Math.floor((minutesOfDay % 1440) / 60);
  const minute = minutesOfDay % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const h12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${h12}:${String(minute).padStart(2, "0")} ${suffix} IST`;
}

export function computeNextSlot(now: Date = new Date()): NextSlot {
  const ist = istNow(now);
  const earliest = new Date(ist.getTime() + BOOKING_NOTICE_MINUTES * 60000);

  const firstBoundary = SLOT_START_HOUR * 60 + SLOT_START_MIN; // 930
  const lastBoundary = LAST_SLOT_HOUR * 60 + LAST_SLOT_MIN; // 1380

  // minutes-of-day for `earliest`, allowing rollover past midnight
  const dayDiff = Math.round(
    (new Date(earliest).setHours(0, 0, 0, 0) - new Date(ist).setHours(0, 0, 0, 0)) / 86400000,
  );
  const earliestMinutes =
    dayDiff * 1440 + earliest.getHours() * 60 + earliest.getMinutes() + (earliest.getSeconds() > 0 ? 1 : 0);

  let boundary: number;
  if (earliestMinutes <= firstBoundary) {
    boundary = firstBoundary;
  } else if (earliestMinutes <= lastBoundary) {
    boundary =
      firstBoundary +
      Math.ceil((earliestMinutes - firstBoundary) / SLOT_STEP_MINUTES) * SLOT_STEP_MINUTES;
  } else {
    boundary = firstBoundary + 1440; // tomorrow
  }

  const startOfDay = new Date(ist);
  startOfDay.setHours(0, 0, 0, 0);
  const targetMs = startOfDay.getTime() + boundary * 60000;
  const totalSeconds = Math.max(0, Math.floor((targetMs - ist.getTime()) / 1000));

  const pad = (n: number) => String(n).padStart(2, "0");

  return {
    hours: pad(Math.floor(totalSeconds / 3600)),
    minutes: pad(Math.floor((totalSeconds % 3600) / 60)),
    seconds: pad(totalSeconds % 60),
    slotLabel: label(boundary),
  };
}

/** Ticks every second; always derived from the clock, never a stored start time. */
export function useNextSlot(): NextSlot | null {
  const [value, setValue] = useState<NextSlot | null>(null);

  useEffect(() => {
    const tick = () => setValue(computeNextSlot());
    tick();
    const id = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);

  return value;
}
