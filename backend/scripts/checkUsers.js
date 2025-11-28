import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

async function checkUsers() {
  try {
    console.log("\n🔍 KIỂM TRA TÀI KHOẢN USERS\n");
    console.log("=".repeat(70));

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Đã kết nối MongoDB\n");

    // Count users
    const userCount = await User.countDocuments();
    console.log(`👥 Tổng số tài khoản: ${userCount}\n`);

    if (userCount === 0) {
      console.log("❌ CHƯA CÓ TÀI KHOẢN NÀO TRONG HỆ THỐNG!");
      console.log("\n💡 Để tạo tài khoản test, bạn có thể:");
      console.log("   1. Đăng ký qua giao diện web: http://localhost:5173/register");
      console.log("   2. Hoặc chạy script: node scripts/createTestUsers.js");
      console.log("=".repeat(70));
      process.exit(0);
    }

    // Get all users
    const users = await User.find()
      .select("full_name email role createdAt")
      .sort({ createdAt: -1 })
      .lean();

    console.log("📋 DANH SÁCH TÀI KHOẢN:\n");
    console.log("=".repeat(70));

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Email: ${user.email}`);
      console.log(`   Họ tên: ${user.full_name}`);
      console.log(`   Vai trò: ${user.role === "admin" ? "🔑 Admin" : "👤 Customer"}`);
      console.log(`   Ngày tạo: ${user.createdAt ? new Date(user.createdAt).toLocaleString("vi-VN") : "N/A"}`);
    });

    console.log("\n" + "=".repeat(70));

    // Count by role
    const adminCount = await User.countDocuments({ role: "admin" });
    const customerCount = await User.countDocuments({ role: "customer" });

    console.log("\n📊 THỐNG KÊ THEO VAI TRÒ:");
    console.log(`   🔑 Admin: ${adminCount}`);
    console.log(`   👤 Customer: ${customerCount}`);
    console.log(`   📈 Tổng: ${userCount}`);

    console.log("\n✅ Hoàn tất kiểm tra!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Lỗi:", error.message);
    process.exit(1);
  }
}

checkUsers();
