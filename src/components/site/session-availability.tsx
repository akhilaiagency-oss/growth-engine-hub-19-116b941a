import { useEffect, useState } from "react";
import { getSessionAvailability } from "@/lib/strategy-call.functions";

/**
 * Honest scarcity. The number is shown ONLY when the live Calendly API
 * returns one; otherwise the qualitative line stands alone. Calm and muted —
 * never urgent, never a countdown.
 */
export function SessionAvailability({ className = "" }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    void getSessionAvailability()
      .then((result) => {
        if (active && result && typeof result.available === "number") setCount(result.available);
      })
      .catch(() => {
        /* degrade to the qualitative line */
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={className}>
      <p className="text-[13px] leading-relaxed text-muted">
        {count === null ? (
          "Limited strategy sessions available."
        ) : (
          <>
            Limited strategy sessions available — <strong className="font-semibold text-fg">{count}</strong>{" "}
            open in the next 7 days.
          </>
        )}
      </p>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-2">
        Sessions are intentionally limited so each one can focus on your business, your acquisition
        funnel and your growth bottlenecks rather than becoming a generic sales call.
      </p>
    </div>
  );
}
