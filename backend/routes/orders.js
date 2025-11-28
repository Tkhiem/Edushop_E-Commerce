import express from "express";
import fetch from "node-fetch"; // ⚠️ Cần cài đặt: npm install node-fetch
import dotenv from "dotenv";
import crypto from "crypto";
import Order from "../models/Order.js";
import Course from "../models/Course.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import { authenticate, isAdmin } from "../middleware/auth.js";
import moment from "moment-timezone";
import dateFormat from "dateformat";
import { create } from "domain";
import qs from "qs";
dotenv.config();

const router = express.Router();

const getVnpayConfig = () => ({
  tmnCode: process.env.VNP_TMN_CODE,
  hashSecret: process.env.VNP_HASH_SECRET,
  paymentUrl:
    process.env.VNP_PAYMENT_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  returnUrl:
    process.env.VNP_RETURN_URL ||
    `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/vnpay-return`,
});

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const buildQueryString = (params = {}) =>
  Object.entries(params)
    .map(
      ([key, value]) => `${key}=${encodeURIComponent(value != null ? value : "")}`
    )
    .join("&");

    const getClientIp = (req) => {
      const ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.connection?.socket?.remoteAddress;
      if (Array.isArray(ipAddr)) {
        return ipAddr[0];
      }
      if (typeof ipAddr === "string") {
        return ipAddr.replace("::ffff:", "");
      }
      return "127.0.0.1";
    };

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
  // console.log("acc", tokenResponse);
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
      // payment_source: {
      //   paypal: {
      //     experience_context: {
      //       payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
      //       brand_name: "EduShop",
      //       locale: "en-US",
      //       landing_page: "LOGIN",
      //       user_action: "PAY_NOW",
      //       return_url: `${process.env.FRONTEND_URL}/payment/success`,
      //       cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      //     },
      //   },
      // },
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
// POST /api/orders/vnpay/create-payment
// Tạo link thanh toán VNPay
// ===========================
router.post("/vnpay/create-payment", authenticate, async (req, res, next) => {
  try {
    const config = getVnpayConfig();
    console.log("config", config);
    if (!config.tmnCode || !config.hashSecret) {
      return res.status(500).json({
        success: false,

        message:
          "Thiếu cấu hình VNPay. Vui lòng bổ sung VNP_TMN_CODE và VNP_HASH_SECRET.",
      });
    }
    
    const {
      amountVnd,
      amountUsd,
      orderInfo = "Thanh toán khóa học EduShop",
      locale = "vn",
    } = req.body;

    if (!amountVnd || Number(amountVnd) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Số tiền VNPay không hợp lệ",
      });
    }
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();
    // console.log("date", date);
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    // const txnRef = dateFormat(date,"HHmmss")
    let txnRef= moment(date).format('DDHHmmss');
    // const expireDate = new Date(createDate.getTime() + 15 * 60 * 1000);
    // const expireDate = dateFormat(new Date(date.getTime() + 15 * 60 * 1000), 'yyyymmddHHmmss');
    const ipAddr = getClientIp(req); // ?

    const vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: config.tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: "VND",
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: "other",
      vnp_Amount: amountVnd*100,
      vnp_ReturnUrl: config.returnUrl,
      vnp_IpAddr: "127.0.0.1",
      vnp_CreateDate: createDate,
    // vnp_ExpireDate: moment().tz("Asia/Ho_Chi_Minh").add(15, "minutes").format("YYYYMMDDHHmmss"),
    };
    var bankCode = req.body.bankCode;
    if (bankCode) {
      vnpParams.vnp_BankCode = bankCode;
    }
    console.log("createDate", vnpParams.vnp_CreateDate);
    console.log("expireDate", vnpParams.vnp_ExpireDate);
    const sortedParams = sortObject(vnpParams);
    let querystring = qs;
    const signData = querystring.stringify(sortedParams, { encode: false });
    const secureHash = crypto
      .createHmac("sha512", config.hashSecret)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    const paymentUrl = `${config.paymentUrl}?${signData}&vnp_SecureHash=${secureHash}`;
    console.log("paymentUrl", paymentUrl);
    res.json({
      success: true,
      data: {
        paymentUrl,
        reference: txnRef,
        amountVnd: Number(amountVnd),
        amountUsd: amountUsd ? Number(amountUsd) : undefined,
      },
    });
    // res.redirect(paymentUrl);
  } catch (error) {
    console.error("❌ Error creating VNPay payment:", error);
    next(error);
  }
});

// ===========================
// GET /api/orders/vnpay/verify
// Xác minh callback từ VNPay
// ===========================
router.get("/vnpay/verify", async (req, res, next) => {
  try {
    const config = getVnpayConfig();
    // console.log("hảo");
    if (!config.hashSecret) {
      return res.status(500).json({
        success: false,
        message: "Thiếu cấu hình VNPay",
      });
    }
    // console.log("haha");
    const query = { ...req.query };
    const secureHash = query.vnp_SecureHash;
    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;

    const sortedParams = sortObject(query);
    let querystring = qs;
    const signData = querystring.stringify(sortedParams, {encode: false});
    const calculatedHash = crypto
      .createHmac("sha512", config.hashSecret)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    const isValid = secureHash && calculatedHash === secureHash;
    const responseCode = query.vnp_ResponseCode;

    res.json({
      success: isValid && responseCode === "00",
      data: {
        ...sortedParams,
        secureHash,
        calculatedHash,
        isValid,
        responseCode,
      },
      message:
        responseCode === "00"
          ? "Thanh toán VNPay thành công"
          : "Giao dịch VNPay chưa hoàn tất",
    });
  } catch (error) {
    console.error("❌ Error verifying VNPay payment:", error);
    next(error);
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
// POST /api/orders/complete
// Lưu đơn hàng và mở khóa khóa học
// ===========================
router.post("/complete", authenticate, async (req, res, next) => {
  try {
    const {
      orderId,
      currency = "USD",
      total,
      items = [],
      cartItems = [],
      paypalData,
      vnpayData,
      paymentMethod = "paypal",
      paymentReference,
      transactionId,
    } = req.body;

    const resolvedPaymentMethod =
      paymentMethod === "vnpay" ? "vnpay" : "paypal";
    const resolvedOrderId = paymentReference || orderId;

    if (!resolvedOrderId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu mã giao dịch",
      });
    }

    const rawItems =
      Array.isArray(cartItems) && cartItems.length ? cartItems : items;

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin khóa học đã thanh toán",
      });
    }

    const normalizedItems = rawItems
      .map((item) => ({
        courseId: item.courseId || item.course_id || item.id || item._id,
        title: item.title,
        price: item.price,
      }))
      .filter((item) => !!item.courseId);

    const courseIds = [
      ...new Set(normalizedItems.map((item) => item.courseId.toString())),
    ];

    if (courseIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không thể xác định khóa học đã mua",
      });
    }

    const courses = await Course.find({
      _id: { $in: courseIds },
    });

    if (courses.length !== courseIds.length) {
      return res.status(404).json({
        success: false,
        message: "Một số khóa học không còn tồn tại",
      });
    }

    const orderItems = courses.map((course) => ({
      course: course._id,
      title: course.title,
      slug: course.slug,
      price: course.price,
      thumbnail: course.thumbnail,
      instructor: course.instructor,
    }));

    const orderTotal =
      typeof total === "number"
        ? total
        : orderItems.reduce((sum, item) => sum + (item.price || 0), 0);

    let order = await Order.findOne({
      payment_reference: resolvedOrderId,
      user_id: req.user._id,
    });

    if (order) {
      order.status = "completed";
      order.total = orderTotal;
      order.currency = currency;
      order.items = orderItems;
      order.payment_method = resolvedPaymentMethod;
      order.payment_reference = resolvedOrderId;
      if (resolvedPaymentMethod === "paypal") {
        order.paypal_order_id = resolvedOrderId;
      }
      order.transaction_id =
        transactionId ||
        (resolvedPaymentMethod === "vnpay"
          ? vnpayData?.vnp_TransactionNo || vnpayData?.vnp_TransactionStatus
          : paypalData?.purchase_units?.[0]?.payments?.captures?.[0]?.id) ||
        order.transaction_id;
      if (paypalData || vnpayData) {
        order.capture_details = paypalData || vnpayData;
      }
      await order.save();
    } else {
      order = await Order.create({
        user_id: req.user._id,
        paypal_order_id:
          resolvedPaymentMethod === "paypal" ? resolvedOrderId : undefined,
        payment_reference: resolvedOrderId,
        payment_method: resolvedPaymentMethod,
        transaction_id:
          transactionId ||
          (resolvedPaymentMethod === "vnpay"
            ? vnpayData?.vnp_TransactionNo || vnpayData?.vnp_TransactionStatus
            : paypalData?.purchase_units?.[0]?.payments?.captures?.[0]?.id),
        status: "completed",
        total: orderTotal,
        currency,
        items: orderItems,
        capture_details: paypalData || vnpayData,
      });
    }

    const ownedCourseIds = [
      ...new Map(
        orderItems.map((item) => [item.course.toString(), item.course])
      ).values(),
    ];

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {
        owned_courses: {
          $each: ownedCourseIds,
        },
      },
    });

    await Cart.findOneAndUpdate(
      { user_id: req.user._id },
      { $pull: { items: { course_id: { $in: ownedCourseIds } } } }
    );

    res.json({
      success: true,
      message: "Đã ghi nhận thanh toán và mở khóa khóa học",
      data: {
        order,
        ownedCourseIds: ownedCourseIds.map((id) => id.toString()),
      },
    });
  } catch (error) {
    console.error("❌ Error completing order:", error);
    next(error);
  }
});

// ===========================
// GET /api/orders (admin)
// ===========================
router.get("/", authenticate, isAdmin, async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user_id", "full_name email");

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    next(error);
  }
});

// ===========================
// GET /api/orders/my
// ===========================
router.get("/my", authenticate, async (req, res, next) => {
  try {
    const orders = await Order.find({ user_id: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    next(error);
  }
});

// ===========================
// GET /api/orders/my-courses
// ===========================
router.get("/my-courses", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("owned_courses");

    res.json({
      success: true,
      data: user?.owned_courses || [],
    });
  } catch (error) {
    console.error("❌ Error fetching user courses:", error);
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
