import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

async function testUsersEndpoint() {
  try {
    console.log("\n🧪 TEST USERS ENDPOINT\n");
    console.log("=".repeat(70));

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Đã kết nối MongoDB\n");

    // Get all users
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });

    console.log(`📊 Tổng số users: ${users.length}\n`);
    console.log("📋 DANH SÁCH USERS:\n");

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.full_name || "N/A"}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Created: ${new Date(user.createdAt).toLocaleString("vi-VN")}\n`);
    });

    console.log("=".repeat(70));
    console.log("\n📝 EXPECTED API RESPONSE FORMAT:");
    console.log(JSON.stringify({
      success: true,
      data: users.map(u => ({
        _id: u._id,
        full_name: u.full_name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt
      })),
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalUsers: users.length,
        limit: 50
      }
    }, null, 2));

    console.log("\n✅ Test hoàn tất!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ LỖI:", error.message);
    console.error(error);
    process.exit(1);
  }
}

testUsersEndpoint();
