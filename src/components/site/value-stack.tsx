const ROWS = [
  { label: "30-minute 1:1 session with Akhil", value: "₹5,000" },
  { label: "Your personalised funnel blueprint", value: "₹3,000" },
  { label: "The three working documents", value: "₹2,000" },
];

/** What the session would cost if bought separately. Anchors the ₹9. */
export function ValueStack() {
  return (
    <div className="mx-auto w-full max-w-[560px]">
      <p className="text-center text-[12px] font-semibold tracking-[0.16em] text-muted-2 uppercase">
        What these cost separately
      </p>

      <ul className="mt-4">
        {ROWS.map((r) => (
          <li
            key={r.label}
            className="flex items-baseline justify-between gap-[12px] border-b border-border py-[12px]"
          >
            <span className="text-[13px] leading-snug text-muted min-[414px]:text-[15px]">
              {r.label}
            </span>
            <span className="shrink-0 whitespace-nowrap text-[13px] font-semibold text-fg tabular-nums min-[414px]:text-[15px]">
              {r.value}
            </span>
          </li>
        ))}
        <li className="flex items-baseline justify-between gap-[12px] py-[12px]">
          <span className="text-[13px] font-bold text-fg min-[414px]:text-[15px]">Total</span>
          <span className="shrink-0 whitespace-nowrap text-[13px] font-bold text-muted-2 line-through tabular-nums min-[414px]:text-[15px]">
            ₹10,000
          </span>
        </li>
      </ul>


      <p className="text-center text-[12px] text-muted-2">
        Based on Akhil's standard consulting rate of ₹XX,XXX per hour. Ask on the call and you'll
        get the same figure.
      </p>
    </div>
  );
}
