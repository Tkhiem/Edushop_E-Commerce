import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: String,
    slug: String,
    price: Number,
    thumbnail: String,
    instructor: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paypal_order_id: {
      type: String,
      index: true,
    },
    payment_reference: {
      type: String,
      required: true,
      index: true,
    },
    payment_method: {
      type: String,
      enum: ["paypal", "vnpay"],
      default: "paypal",
    },
    transaction_id: {
      type: String,
    },
    status: {
      type: String,
      enum: ["created", "completed", "failed"],
      default: "created",
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    items: [orderItemSchema],
    capture_details: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user_id: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;

