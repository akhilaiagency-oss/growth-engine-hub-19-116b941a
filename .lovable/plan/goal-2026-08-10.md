Add Razorpay Test Mode Configuration

## Goal
Make it explicit and safe to run the ₹9 Strategy Call funnel against Razorpay's test environment, with clear UI feedback and setup instructions so test transactions are never mistaken for live ones.

## Current State
The Razorpay integration already accepts either `rzp_test_...` or `rzp_live_...` key IDs. There is no explicit "mode" flag, no UI banner when test keys are in use, and no user-facing instructions for where to get test credentials or how to register the test webhook.

## Proposed Changes

### 1. Derive and expose Razorpay mode
- In `src/lib/razorpay.server.ts`, add `getRazorpayMode()` that returns `"test" | "live"` based on the `RAZORPAY_KEY_ID` prefix.
- Return `mode` from `getRazorpayCreds()` and from the `createStrategyCallOrder` server function so the frontend can know which environment is active.
- Update `OrderForCheckout` and the checkout response types to include `mode`.

### 2. UI feedback when in test mode
- In `src/routes/qualify.tsx`, read `order.mode` in the payment step.
- Render a non-dismissible test-mode banner above the checkout button when `mode === "test"`:
  - Text: "Test mode — no real money will be charged. Use Razorpay test card details."
  - Style: amber/yellow warning treatment that stands out from the lime primary accent.
- Keep the existing "Secure payment" line; the banner is additive.

### 3. Helpful test-card hint
- When in test mode, show the standard Razorpay test card below the banner:
  - Card number: `5267 3181 8797 5449`
  - Expiry: any future date
  - CVV: any 3 digits
  - OTP: `1234`
- This removes friction for the user when validating the flow end-to-end.

### 4. Webhook setup instructions
- Add a new small section in the payment step (visible only to the builder/admin or in test mode) that displays:
  - Webhook URL to paste into Razorpay dashboard: `https://<published-domain>/api/public/webhooks/razorpay`
  - Events to subscribe to: `payment.captured`, `order.paid`, `payment.failed`
  - The secret name: `RAZORPAY_WEBHOOK_SECRET`
- Gate this behind `mode === "test"` so it does not clutter the live buyer experience. It is meant to help the user complete test-mode setup.

### 5. Server-side safety
- Ensure `verifyCheckoutSignature` and `verifyWebhookSignature` still work identically for test and live keys (they already do).
- Add a one-line log in `createRazorpayOrder` indicating the mode when an order is created, to aid debugging.

### 6. Documentation / setup guide
- Add a concise comment block at the top of `src/lib/razorpay.server.ts` explaining how to switch between test and live:
  - Test keys: `RAZORPAY_KEY_ID=rzp_test_...`, matching key secret, and a webhook secret from the Razorpay test dashboard.
  - Live keys: `RAZORPAY_KEY_ID=rzp_live_...`.
- No new environment variables are introduced; mode is inferred from the key ID prefix.

## Out of Scope
- No changes to payment states, booking unlock logic, or webhook verification.
- No Calendly or WhatsApp wiring.
- No migration changes.

## Acceptance Criteria
- With `rzp_test_...` keys configured, the `/qualify` payment step shows the test-mode banner and test-card hint.
- With `rzp_live_...` keys configured, no test-mode UI appears.
- A test payment using Razorpay's test card successfully unlocks booking (same as today).
- Typecheck and build pass.
