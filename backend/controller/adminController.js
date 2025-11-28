import Course from "../models/Course.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
export const getStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalUser = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueAgg = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const totalRevenue = (revenueAgg[0] && revenueAgg[0].total) || 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const stats = [
      {
        label: "Tổng khoá học",
        value: totalCourses.toString(),
        icon: "BookOpen",
        color: "bg-blue-500",
        change: null,
      },
      {
        label: "Người dùng",
        value: totalUser.toString(),
        icon: "Users",
        color: "bg-green-500",
        change: null,
      },
      {
        label: "Đơn hàng",
        value: totalOrders.toString(),
        icon: "ShoppingCart",
        color: "bg-purple-500",
        change: null,
      },
      {
        label: "Doanh thu",
        value: `$${Number(totalRevenue).toLocaleString()}`,
        icon: "DollarSign",
        color: "bg-red-500",
        change: null,
      },
    ];

    const recent = [
      ...recentOrders.map((o) => ({
        type: "order",
        title: `Đơn hàng #${o._id}`,
        subtitle: `${o.total} - ${new Date(o.createdAt).toLocaleString()}`,
      })),

      ...recentUsers.map((u) => ({
        type: "user",
        title: `Người dùng mới: ${u.full_name || u.email}`,
        subtitle: `${new Date(u.createdAt).toLocaleString()}`,
      })),
    ].slice(0, 6);

    res.json({ stats, recent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
// GET /api/admin/transactions
// query params: page, limit, q, status
export const getTransaction = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const skip = (page - 1) * limit;
    const q = req.query.q ? String(req.query.q).trim() : null;
    const statusFilter = req.query.status ? String(req.query.status) : null;

    // support frontend sending friendly statuses
    const statusMap = {
      pending: "created",
      cancelled: "failed",
      completed: "completed",
    };
    const dbStatus = statusMap[statusFilter] || statusFilter || null;
    const filter = {};
    if (dbStatus) {
      filter["status"] = dbStatus;
    }
    if (q) {
      // search by payment-ref, paypal_order_id or _id
      const or = [];
      or.push({ payment_reference: { $regex: q, $options: "i" } });
      or.push({ payment_reference: { $regex: q, $options: "i" } });
      if (mongoose.Types.ObjectId.isValid(q)) {
        or.push({ _id: mongoose.Types.ObjectId(q) });
      }
      filter["$or"] = or;
    }
    const [total, items] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user_id", "full_name email")
        .lean(),
    ]);
    // normalize items for frontend
    const normalized = items.map((o) => ({
      _id: o._id,
      orderId: o.payment_reference || o.paypal_order_id || String(o._id),
      user: {
        full_name:
          o.user_id?.fullName ||
          o.user_id?.full_name ||
          o.user_id?.name ||
          // o.user_id?.email ||
          "Khách",
        email: o.user_id?.email || "",
      },
      items: (o.items || []).map((it) => ({
        courseId: it.course,
        title: it.title,
        price: it.price,
      })),
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      raw: o,
    }));
    res.json({
      page,
      total,
      pages: Math.ceil(total / limit),
      items: normalized,
    });
  } catch (err) {
    console.error("getTransaction error", err);
    res.status(500).json({ message: "Lỗi server khi lấy đơn hàng" });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id không hợp lệ" });
    }
    const order = await Order.findById(id)
      .populate("user_id", "fullName email")
      .lean();
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    const normalized = {
      _id: order._id,
      orderId:
        order.payment_reference || order.paypal_order_id || String(order._id),
      user: {
        full_name:
          order.user_id?.fullName ||
          order.user_id?.full_name ||
          order.user_id?.email ||
          "Khách",
        email: order.user_id?.email || "",
      },
      items: (order.items || []).map((it) => ({
        courseId: it.course,
        title: it.title,
        price: it.price,
      })),
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      raw: order,
    };

    res.json(normalized);
  } catch (err) {
    console.error("getTransactionById error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
export const updateTransactionStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body; // expect 'created'|'completed'|'failed' or friendly 'pending'|'cancelled'|'completed'
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id không hợp lệ" });
    }
    const allowed = ["created", "completed", "failed"];
    const friendlyToDb = {
      pending: "created",
      cancelled: "failed",
      completed: "completed",
    };
    const newStatus = friendlyToDb[status] || status;
    if (!allowed.includes(newStatus)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const order = await Order.findById(id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    order.status = newStatus;
    await order.save();

    res.json({ message: "Cập nhật trạng thái thành công", order });
  } catch (err) {
    console.error("updateTransactionStatus error:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái" });
  }
};
