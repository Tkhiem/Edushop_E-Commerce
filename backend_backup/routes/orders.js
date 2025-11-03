import express from "express";
import fetch from "node-fetch"; // ⚠️ Cần cài đặt: npm install node-fetch
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ===========================
// PayPal Helper Function
// ===========================
const callPayPalApi = async (endpoint, method = "GET", body = null) => {
  const baseURL =
    process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  // Get Access Token
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const tokenResponse = await fetch(`${baseURL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const { access_token } = await tokenResponse.json();

  // Call API
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${baseURL}${endpoint}`, options);
  return response.json();
};

// ===========================
// POST /api/orders/create-order
// Tạo PayPal order
// ===========================
router.post("/create-order", async (req, res, next) => {
  try {
    const { amount = "100.00", currency = "USD" } = req.body;

    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            brand_name: "EduShop",
            locale: "en-US",
            landing_page: "LOGIN",
            user_action: "PAY_NOW",
            return_url: `${process.env.FRONTEND_URL}/payment/success`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
          },
        },
      },
    };

    const data = await callPayPalApi("/v2/checkout/orders", "POST", order);

    res.json({
      success: true,
      orderId: data.id,
      data,
    });
  } catch (error) {
    console.error("❌ Error creating PayPal order:", error);
    next(error); // Gửi đến errorHandler
  }
});

// ===========================
// POST /api/orders/capture-order/:orderId
// Capture payment sau khi user approve
// ===========================
router.post("/capture-order/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu orderId",
      });
    }

    const data = await callPayPalApi(
      `/v2/checkout/orders/${orderId}/capture`,
      "POST"
    );

    res.json({
      success: true,
      message: "Payment captured successfully",
      data,
    });
  } catch (error) {
    console.error("❌ Error capturing PayPal order:", error);
    next(error);
  }
});

// ===========================
// GET /api/orders/:orderId
// Lấy thông tin order
// ===========================
router.get("/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const data = await callPayPalApi(`/v2/checkout/orders/${orderId}`, "GET");

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("❌ Error fetching PayPal order:", error);
    next(error);
  }
});

export default router;
