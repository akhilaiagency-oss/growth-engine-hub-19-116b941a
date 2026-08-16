/** Shared microcopy that sits directly beneath every primary CTA. */
export function CtaNote({ className = "" }: { className?: string }) {
  return (
    <p className={`text-center text-[12px] text-muted-2 ${className}`}>
      ₹9 • Limited strategy-session capacity • No obligation to continue
    </p>
  );
}
