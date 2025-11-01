const express = require("express");
const router = express.Router();
const { callPayPalApi } = require("../paypalClient");

// create order
router.post("/create-order", async (req, res) => {
  try {
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "100.00", // hoặc req.body.amount nếu bạn gửi từ frontend
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            brand_name: "My Store",
            locale: "en-US",
            landing_page: "LOGIN",
            user_action: "PAY_NOW",

            // ⚠️ App Switch configuration
            return_url: "https://your-frontend-url.com/paypal-return",
            cancel_url: "https://your-frontend-url.com/paypal-cancel",
          },
        },
      },
    };
    const data = await callPayPalApi("/v2/checkout/orders", "POST", order);
    res.json({ id: data.id });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
});
// capture order
router.post("/capture-order", async (req, res) => {
  try {
    const { orderId } = req.params;
    const data = await callPayPalApi(
      `/v2/checkout/orders/${orderId}/capture`,
      "POST"
    );
    res.json(data);
  } catch (err) {
    console.error("Error capturing order:", err);
    res.status(500).json({ error: "Failed to capture PayPal order" });
  }
});
module.exports = router;
