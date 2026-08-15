import { useEffect, useState } from "react";
import { SLOT_START_HOUR, SLOT_MINUTES, TOTAL_SLOTS_PER_DAY } from "@/data/capacity";

export interface NextSlot {
  hours: string;
  minutes: string;
  seconds: string;
  slotsLeftToday: number;
  nextSlotLabel: string;
}

/** Wall-clock "now" shifted into IST, regardless of the visitor's timezone. */
function istNow(now: Date = new Date()): Date {
  return new Date(now.getTime() + (330 + now.getTimezoneOffset()) * 60000);
}

function label(hour24: number, minute: number): string {
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const h12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${h12}:${String(minute).padStart(2, "0")} ${suffix} IST`;
}

export function computeNextSlot(now: Date = new Date()): NextSlot {
  const ist = istNow(now);
  const minutesOfDay = ist.getHours() * 60 + ist.getMinutes();
  const firstBoundary = SLOT_START_HOUR * 60; // 900
  const lastBoundary = firstBoundary + (TOTAL_SLOTS_PER_DAY - 1) * SLOT_MINUTES; // 1350 = 22:30

  let nextBoundary: number; // minutes from start of the IST day (may exceed 1440)
  if (minutesOfDay < firstBoundary) {
    nextBoundary = firstBoundary;
  } else if (minutesOfDay < lastBoundary) {
    nextBoundary = Math.floor(minutesOfDay / SLOT_MINUTES) * SLOT_MINUTES + SLOT_MINUTES;
  } else {
    nextBoundary = firstBoundary + 1440; // tomorrow at 15:00
  }

  const slotsLeftToday =
    minutesOfDay < firstBoundary
      ? TOTAL_SLOTS_PER_DAY
      : minutesOfDay >= lastBoundary
        ? 0
        : Math.floor((lastBoundary - Math.floor(minutesOfDay / SLOT_MINUTES) * SLOT_MINUTES) / SLOT_MINUTES);

  const startOfDay = new Date(ist);
  startOfDay.setHours(0, 0, 0, 0);
  const targetMs = startOfDay.getTime() + nextBoundary * 60000;
  const totalSeconds = Math.max(0, Math.floor((targetMs - ist.getTime()) / 1000));

  const pad = (n: number) => String(n).padStart(2, "0");
  const boundaryHour = Math.floor((nextBoundary % 1440) / 60);
  const boundaryMinute = nextBoundary % 60;

  return {
    hours: pad(Math.floor(totalSeconds / 3600)),
    minutes: pad(Math.floor((totalSeconds % 3600) / 60)),
    seconds: pad(totalSeconds % 60),
    slotsLeftToday,
    nextSlotLabel: label(boundaryHour, boundaryMinute),
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
