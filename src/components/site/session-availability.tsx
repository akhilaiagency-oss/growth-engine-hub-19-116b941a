import { useSessionsLeft } from "@/hooks/use-sessions-left";

/**
 * Honest scarcity. The number is shown ONLY when the live source returns one;
 * otherwise the qualitative line stands alone. Calm and muted.
 */
export function SessionAvailability({ className = "" }: { className?: string }) {
  const count = useSessionsLeft();

  return (
    <div className={className}>
      <p className="text-[13px] text-muted">
        {count === null ? (
          "Limited strategy sessions available."
        ) : (
          <>
            Limited strategy sessions available —{" "}
            <strong className="font-semibold text-fg">{count}</strong> open in the next 7 days.
          </>
        )}
      </p>
      <p className="mt-1.5 text-[12px] text-muted-2">
        Sessions are intentionally limited so each one can focus on your business, your acquisition
        funnel and your growth bottlenecks rather than becoming a generic sales call.
      </p>
    </div>
  );
}
