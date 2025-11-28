import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";

dotenv.config();

const checkCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    // Find all unique category values (including invalid ones)
    const allCategories = await Course.distinct("category");

    console.log("\n📊 All Categories in Database:");
    console.log("Total unique categories:", allCategories.length);

    // Check for invalid categories
    const invalid = allCategories.filter(
      (cat) => !cat || typeof cat !== "string" || cat.trim() === ""
    );

    if (invalid.length > 0) {
      console.log("\n⚠️  Invalid Categories Found:", invalid);

      // Count courses with invalid categories
      const invalidCount = await Course.countDocuments({
        $or: [
          { category: { $exists: false } },
          { category: null },
          { category: "" },
          { category: { $type: "number" } },
        ],
      });

      console.log("Courses with invalid categories:", invalidCount);
    } else {
      console.log("\n✅ All categories are valid strings");
    }

    // Show category distribution
    const distribution = await Course.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 20,
      },
    ]);

    console.log("\n📈 Top 20 Categories:");
    distribution.forEach((cat, i) => {
      console.log(
        `${(i + 1).toString().padStart(2, "0")}. ${String(cat._id).padEnd(
          30
        )} - ${cat.count} courses`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkCategories();
