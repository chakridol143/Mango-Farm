import axios from "axios";

import { getEnvValue } from "../config/env";

/**
 * Mirrors a placed order into the Google Sheet (manual fulfilment log) via the
 * Apps Script Web App. Best-effort: never throws, never blocks the order.
 * Configure with ORDERS_SHEET_WEBHOOK_URL (the /exec URL) and
 * SHEET_WEBHOOK_TOKEN (must match SHARED_SECRET in the Apps Script).
 */
export interface OrderSheetRow {
  orderId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  items: string;
  subtotal: number;
  discount: number;
  total: number;
  coupon: string;
  paymentMethod: string;
  status: string;
}

export async function postOrderToSheet(row: OrderSheetRow): Promise<void> {
  const url = getEnvValue("ORDERS_SHEET_WEBHOOK_URL");
  if (!url) return; // not configured — silently skip so orders still work

  const token = getEnvValue("SHEET_WEBHOOK_TOKEN");
  try {
    await axios.post(
      url,
      { type: "order", token, ...row },
      { timeout: 8000, maxRedirects: 5 }
    );
  } catch (err: any) {
    // Sheet logging must never break checkout — just record the failure.
    console.error("ORDERS SHEET WEBHOOK ERROR:", err?.message || err);
  }
}
