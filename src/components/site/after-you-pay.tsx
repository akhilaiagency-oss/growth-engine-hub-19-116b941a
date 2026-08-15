const STEPS = [
  {
    n: "01",
    kicker: "Secure your slot",
    title: "Pay ₹9",
    body: "Processed securely through Razorpay. Under a minute.",
  },
  {
    n: "02",
    kicker: "Pick your time",
    title: "Choose a slot",
    body: "You pick an available time and get the meeting link straight away.",
  },
  {
    n: "03",
    kicker: "Get connected",
    title: "Join the community",
    body: "Reminders, resources and direct access before we speak.",
  },
];

/** Three-step post-payment timeline with a lime rail behind the numerals. */
export function AfterYouPay() {
  return (
    <div>
      <p className="text-center text-[11.5px] font-semibold tracking-[0.16em] text-lime uppercase">
        After you pay — exactly what happens
      </p>

      <div className="relative mt-7">
        <span
          aria-hidden="true"
          className="absolute top-[26px] hidden h-px min-[900px]:block"
          style={{
            left: "12%",
            right: "12%",
            background:
              "linear-gradient(90deg, transparent, var(--lime) 18%, var(--lime) 82%, transparent)",
            opacity: 0.5,
          }}
        />

        <ol className="relative grid gap-8 min-[900px]:grid-cols-3 min-[900px]:gap-6">
          {STEPS.map((s) => (
            <li key={s.n} className="text-center">
              <span
                className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 text-[15px] font-bold text-lime"
                style={{ background: "var(--surface-2)", borderColor: "var(--lime)" }}
              >
                {s.n}
              </span>
              <p className="mt-4 text-[11.5px] font-semibold tracking-[0.16em] text-muted-2 uppercase">
                {s.kicker}
              </p>
              <h3 className="mt-1.5 text-[17px] font-bold tracking-[-0.015em] text-fg">
                {s.title}
              </h3>
              <p className="mx-auto mt-2 max-w-[300px] text-[13.5px] leading-[1.7] text-muted">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
