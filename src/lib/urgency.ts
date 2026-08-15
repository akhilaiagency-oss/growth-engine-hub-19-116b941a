/**
 * Single source of truth for the ₹99 → ₹9 price anchor.
 *
 * Deliberately contains no scarcity counters and no countdown: the page
 * makes no claim about remaining slots or a closing window.
 */
export const URGENCY = {
  originalPrice: 99,
  offerPrice: 9,
} as const;
