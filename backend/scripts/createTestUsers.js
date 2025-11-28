import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

async function createTestUsers() {
  try {
    console.log("\n🔧 TẠO TÀI KHOẢN TEST\n");
    console.log("=".repeat(70));

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Đã kết nối MongoDB\n");

    const testUsers = [
      {
        full_name: "Admin Test",
        email: "admin@edushop.com",
        password: "admin123",
        role: "admin",
      },
      {
        full_name: "Nguyễn Văn A",
        email: "customer1@test.com",
        password: "123456",
        role: "customer",
      },
      {
        full_name: "Trần Thị B",
        email: "customer2@test.com",
        password: "123456",
        role: "customer",
      },
    ];

    console.log("🔐 Đang tạo tài khoản...\n");

    for (const userData of testUsers) {
      // Check if user exists
      const existingUser = await User.findOne({
        email: userData.email.toLowerCase(),
      });

      if (existingUser) {
        console.log(`⚠️  Đã tồn tại: ${userData.email}`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      const user = await User.create({
        full_name: userData.full_name,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        role: userData.role,
      });

      console.log(`✅ Đã tạo: ${userData.email}`);
      console.log(`   Họ tên: ${userData.full_name}`);
      console.log(`   Vai trò: ${userData.role}`);
      console.log(`   Mật khẩu: ${userData.password}`);
      console.log("");
    }

    console.log("=".repeat(70));
    console.log("\n📋 THÔNG TIN TÀI KHOẢN TEST:\n");
    console.log("1. Admin:");
    console.log("   Email: admin@edushop.com");
    console.log("   Mật khẩu: admin123");
    console.log("");
    console.log("2. Customer 1:");
    console.log("   Email: customer1@test.com");
    console.log("   Mật khẩu: 123456");
    console.log("");
    console.log("3. Customer 2:");
    console.log("   Email: customer2@test.com");
    console.log("   Mật khẩu: 123456");
    console.log("\n=".repeat(70));
    console.log("\n✅ Hoàn tất tạo tài khoản test!\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Lỗi:", error.message);
    process.exit(1);
  }
}

createTestUsers();
