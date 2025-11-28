import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";

dotenv.config();

const checkCategoryCount = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const lapTrinhCount = await Course.countDocuments({ category: "Lập Trình" });
    const lapTrinhWebCount = await Course.countDocuments({ category: "Lập Trình Web" });

    console.log(`\n📊 Category Course Count:`);
    console.log(`   "Lập Trình": ${lapTrinhCount} khóa học`);
    console.log(`   "Lập Trình Web": ${lapTrinhWebCount} khóa học`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkCategoryCount();
