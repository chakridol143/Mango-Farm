import Razorpay from "razorpay";
import { getEnvValue } from "./env";

let razorpayClient: Razorpay | null = null;

export const getRazorpayClient = (): Razorpay => {
  // Read through getEnvValue so literal surrounding quotes added by some hosts
  // (e.g. Railway) are stripped — otherwise Razorpay rejects the credentials
  // with a 401 "Authentication failed".
  const keyId = getEnvValue("RAZORPAY_KEY_ID");
  const keySecret = getEnvValue("RAZORPAY_KEY_SECRET");

  if (!keyId || !keySecret) {
    throw new Error("Razorpay is not configured. Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET");
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayClient;
};

export default getRazorpayClient;
