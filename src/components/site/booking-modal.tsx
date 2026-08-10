import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { useBooking } from "./booking-context";

const STEPS = 3;

export function BookingModal() {
  const { open, closeBooking } = useBooking();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (open) setStep(1);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBooking();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, closeBooking]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={closeBooking}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Booking journey"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-t-[16px] border border-border-strong bg-surface p-6 sm:rounded-[16px] sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-2 uppercase">
            Booking journey — architecture preview
          </p>
          <button
            type="button"
            onClick={closeBooking}
            aria-label="Close booking journey"
            className="rounded-[8px] border border-border p-1.5 text-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 flex gap-2" aria-hidden="true">
          {Array.from({ length: STEPS }).map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${i < step ? "bg-lime" : "bg-surface-2"}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="mt-6">
            <h3 className="text-[20px] font-bold tracking-[-0.02em] text-fg">
              Reserve your strategy call
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              Secure checkout will run through Razorpay. Not connected yet — this is the placeholder
              for the payment step.
            </p>
            <div className="mt-5 flex items-center justify-between rounded-[8px] border border-border bg-surface-2 px-4 py-3">
              <span className="text-[14px] text-fg">1:1 Growth Strategy Call</span>
              <span className="text-[16px] font-bold text-lime">₹9</span>
            </div>
            <div className="mt-3 rounded-[8px] border border-dashed border-border-strong px-4 py-6 text-center text-[12.5px] text-muted-2">
              Razorpay checkout renders here once payments are connected.
            </div>
            <button
              type="button"
              className="btn-primary mt-5 w-full"
              onClick={() => setStep(2)}
            >
              Continue to Payment (demo) →
            </button>
            <p className="mt-3 text-center text-[11.5px] text-muted-2">
              Demo only — no real payment is processed on this page.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6">
            <h3 className="text-[20px] font-bold tracking-[-0.02em] text-fg">
              Choose your call time
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              After payment is verified, you'll pick an available slot here via Calendly.
            </p>
            <div className="mt-5 rounded-[8px] border border-dashed border-border-strong px-4 py-10 text-center text-[12.5px] text-muted-2">
              Calendly scheduler embeds here once connected.
            </div>
            <button type="button" className="btn-primary mt-5 w-full" onClick={() => setStep(3)}>
              Continue (demo slot selected) →
            </button>
            <p className="mt-3 text-center text-[11.5px] text-muted-2">
              Demo only — no real calendar is connected yet.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lime text-lime-ink">
              <Check size={22} strokeWidth={3} />
            </span>
            <h3 className="mt-4 text-[20px] font-bold tracking-[-0.02em] text-fg">You're booked</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              Your appointment is confirmed. Join the WhatsApp community for reminders, resources
              and direct access before your call.
            </p>
            <button type="button" className="btn-primary mt-5 w-full" onClick={closeBooking}>
              Join WhatsApp Community →
            </button>
            <p className="mt-3 text-[11.5px] text-muted-2">
              WhatsApp link goes live at launch — placeholder for now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
