const fetch = require("node-fetch");

require("dotenv").config();

const base = process.env.PAYPAL_BASE_URL;

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
    body: "grant_type=client_credentials", // báo cho paypal biết dùng oauth2.0 client credentials
  });

  const data = await response.json();
  return data.access_token;
}
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

  const data = await response.json();
  return data;
}
module.exports = { callPayPalApi };
