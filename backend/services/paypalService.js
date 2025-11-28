import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const base = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";

/**
 * Generate PayPal Access Token
 */
async function generateAccessToken() {
  const auth = Buffer.from(
    process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
  ).toString("base64");

  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

/**
 * Call PayPal API
 */
async function callPayPalApi(endpoint, method, body) {
  const accessToken = await generateAccessToken();

  const response = await fetch(`${base}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return await response.json();
}

/**
 * Create PayPal Order
 */
async function createPayPalOrder(amount, currency = "USD") {
  return callPayPalApi("/v2/checkout/orders", "POST", {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
      },
    ],
  });
}

/**
 * Capture PayPal Order
 */
async function capturePayPalOrder(orderId) {
  return callPayPalApi(`/v2/checkout/orders/${orderId}/capture`, "POST");
}

export {
  generateAccessToken,
  callPayPalApi,
  createPayPalOrder,
  capturePayPalOrder,
};
