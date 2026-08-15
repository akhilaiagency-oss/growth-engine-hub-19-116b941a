import { useEffect, useState } from "react";
import { getSessionAvailability } from "@/lib/strategy-call.functions";

/**
 * Live session availability. Returns null while loading and whenever the
 * live source cannot give a number — callers must hide their UI in that
 * case rather than render a guess.
 */
export function useSessionsLeft(): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    void getSessionAvailability()
      .then((result) => {
        if (active && result && typeof result.available === "number") setCount(result.available);
      })
      .catch(() => {
        /* stays null — the box is hidden */
      });
    return () => {
      active = false;
    };
  }, []);

  return count;
}
