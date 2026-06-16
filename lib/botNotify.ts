/**
 * Best-effort notification to zbvn-bot. Never throws — notification failures
 * must not break order/payment flows.
 */
async function postBot(path: string, payload: unknown): Promise<void> {
  const base = process.env.ZBVN_BOT_URL;
  const secret = process.env.INTERNAL_SECRET;
  if (!base || !secret) {
    console.log("[botNotify] skipped (ZBVN_BOT_URL/INTERNAL_SECRET not set)");
    return;
  }
  try {
    await fetch(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-internal-secret": secret },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error(`[botNotify] ${path} failed:`, err instanceof Error ? err.message : err);
  }
}

export function notifyOrder(payload: {
  orderId: number;
  ownerId: number;
  buyerName: string;
  buyerPhone: string;
  amount: number;
  commission: number;
}): Promise<void> {
  return postBot("/internal/notify-order", payload);
}

export function notifyPaymentVerified(payload: { ownerId: number; amount?: number }): Promise<void> {
  return postBot("/internal/payment-verified", payload);
}
