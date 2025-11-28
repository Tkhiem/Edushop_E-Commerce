import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

async function checkAdminUser() {
  try {
    console.log("\n🔍 KIỂM TRA TÀI KHOẢN ADMIN\n");
    console.log("=".repeat(70));

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Đã kết nối MongoDB\n");

    const email = "admin@edushop.com";
    const testPassword = "admin123";

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("❌ KHÔNG TÌM THẤY USER VỚI EMAIL:", email);
      console.log("\n📋 Tất cả users trong database:");
      const allUsers = await User.find({}).select("email full_name role");
      console.table(
        allUsers.map((u) => ({
          Email: u.email,
          "Full Name": u.full_name,
          Role: u.role,
        }))
      );
    } else {
      console.log("✅ TÌM THẤY USER:");
      console.log("   Email:", user.email);
      console.log("   Full Name:", user.full_name);
      console.log("   Role:", user.role);
      console.log("   Password Hash:", user.password.substring(0, 30) + "...");

      // Test password
      console.log("\n🔐 KIỂM TRA MẬT KHẨU:");
      const isMatch = await bcrypt.compare(testPassword, user.password);
      console.log("   Mật khẩu test:", testPassword);
      console.log("   Kết quả:", isMatch ? "✅ ĐÚNG" : "❌ SAI");

      if (!isMatch) {
        console.log("\n⚠️  MẬT KHẨU KHÔNG KHỚP - ĐANG CẬP NHẬT...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(testPassword, salt);
        user.password = hashedPassword;
        await user.save();
        console.log("✅ Đã cập nhật mật khẩu mới!");

        // Test again
        const isMatchAfter = await bcrypt.compare(testPassword, user.password);
        console.log("   Kiểm tra lại:", isMatchAfter ? "✅ ĐÚNG" : "❌ SAI");
      }
    }

    console.log("\n" + "=".repeat(70));
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ LỖI:", error);
    process.exit(1);
  }
}

checkAdminUser();
