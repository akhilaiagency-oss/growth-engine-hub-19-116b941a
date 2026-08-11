import { URGENCY } from "@/lib/urgency";

/** ₹99 struck through, ₹9 as today's rate. */
export function PriceAnchor({
  size = "md",
  suffix = "today",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  suffix?: string;
  className?: string;
}) {
  const scale =
    size === "lg"
      ? { old: "text-[16px]", now: "text-[30px]", note: "text-[13px]" }
      : size === "sm"
        ? { old: "text-[12.5px]", now: "text-[14px]", note: "text-[12px]" }
        : { old: "text-[14px]", now: "text-[19px]", note: "text-[12.5px]" };

  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={`${scale.old} text-muted-2 line-through`}>₹{URGENCY.originalPrice}</span>
      <span className={`${scale.now} font-bold text-lime`}>₹{URGENCY.offerPrice}</span>
      {suffix ? <span className={`${scale.note} text-muted`}>{suffix}</span> : null}
    </span>
  );
}
