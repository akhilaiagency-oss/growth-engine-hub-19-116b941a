/** Risk-reversal line that sits directly beneath every primary CTA. */
export function RefundNote({ className = "" }: { className?: string }) {
  return (
    <p className={`mt-2 text-center text-[12px] text-muted-2 ${className}`}>
      <span aria-hidden="true">↩ </span>
      <span className="font-semibold text-lime">Refundable on request</span> · no reason needed
    </p>
  );
}
