import logo from "@/assets/growth-multiplier-ai-logo.png";

type BrandLockupProps = {
  size?: "nav" | "footer";
  /** Stack the mark above the name and centre it (used on /qualify). */
  stacked?: boolean;
  /** Show the founder tagline under the brand name (nav only). */
  withTagline?: boolean;
};

const RING = "shadow-[0_0_0_1px_rgba(255,255,255,0.10)]";

export function BrandLockup({
  size = "nav",
  stacked = false,
  withTagline = false,
}: BrandLockupProps) {
  const isFooter = size === "footer";

  const imgClass = isFooter
    ? `h-10 w-10 shrink-0 rounded-full object-contain ${RING}`
    : `h-[38px] w-[38px] shrink-0 rounded-full object-contain md:h-11 md:w-11 ${RING}`;

  const nameClass = isFooter
    ? "text-[16px] font-bold tracking-[-0.01em] leading-[1.15] text-fg"
    : "text-[15.5px] font-bold tracking-[-0.01em] leading-[1.15] text-fg md:text-[17px]";

  return (
    <span
      className={
        stacked
          ? "flex flex-col items-center gap-3"
          : "flex min-w-0 items-center gap-3"
      }
    >
      <img
        src={logo}
        alt="Growth Multiplier AI logo"
        width={isFooter ? 40 : 44}
        height={isFooter ? 40 : 44}
        className={imgClass}
      />
      <span className="flex min-w-0 flex-col gap-[2px] leading-tight">
        <span className={nameClass}>Growth Multiplier AI</span>
        {withTagline && (
          <span className="hidden text-[12px] leading-[1.2] text-muted min-[480px]:block">
            Founder: Akhil Srivastava
          </span>
        )}
      </span>
    </span>
  );
}
