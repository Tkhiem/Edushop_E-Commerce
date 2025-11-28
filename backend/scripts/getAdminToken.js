import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

dotenv.config();

async function getAdminToken() {
  try {
    console.log("\n🔑 LẤY JWT TOKEN CHO ADMIN\n");
    console.log("=".repeat(70));

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Đã kết nối MongoDB\n");

    const email = "admin@edushop.com";

    // Find admin user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("❌ KHÔNG TÌM THẤY ADMIN USER");
      console.log("\n📋 Tất cả users trong database:");
      const allUsers = await User.find({}).select("email full_name role");
      console.table(
        allUsers.map((u) => ({
          Email: u.email,
          "Full Name": u.full_name,
          Role: u.role,
        }))
      );
      process.exit(1);
    }

    console.log("✅ Tìm thấy admin user:");
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.full_name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   ID: ${user._id}\n`);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("🎫 JWT TOKEN (expires in 7 days):");
    console.log("=".repeat(70));
    console.log(token);
    console.log("=".repeat(70));

    console.log("\n📖 HƯỚNG DẪN SỬ DỤNG TRÊN SWAGGER UI:");
    console.log("=".repeat(70));
    console.log("1. Mở Swagger UI: http://localhost:5000/api-docs");
    console.log("2. Click nút 🔓 'Authorize' ở góc trên bên phải");
    console.log("3. Nhập token vào ô 'Value' (KHÔNG cần thêm 'Bearer'):");
    console.log(`   ${token}`);
    console.log("4. Click 'Authorize' và 'Close'");
    console.log("5. Giờ bạn có thể test các API endpoint cần authentication");
    console.log("=".repeat(70));

    console.log("\n📖 HƯỚNG DẪN SỬ DỤNG VỚI POSTMAN/CURL:");
    console.log("=".repeat(70));
    console.log("Header: Authorization");
    console.log(`Value: Bearer ${token}`);
    console.log("=".repeat(70));

    console.log("\n✅ Script hoàn tất!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ LỖI:", error.message);
    console.error(error);
    process.exit(1);
  }
}

getAdminToken();
