import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";
import Category from "../models/Category.js";

dotenv.config();

async function checkDatabase() {
  try {
    console.log("\n🔍 CHECKING DATABASE STATUS\n");
    console.log("=" .repeat(60));

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected\n");

    // Check categories
    const categoryCount = await Category.countDocuments();
    console.log(`📂 Categories: ${categoryCount}`);

    if (categoryCount > 0) {
      const categories = await Category.find().select("name slug").lean();
      categories.forEach((cat, i) => {
        console.log(`   ${i + 1}. ${cat.name} (${cat.slug})`);
      });
    }

    console.log("");

    // Check courses
    const courseCount = await Course.countDocuments();
    console.log(`📚 Courses: ${courseCount}`);

    if (courseCount === 0) {
      console.log("\n⚠️  NO COURSES FOUND IN DATABASE!");
      console.log("\n💡 To import data, run:");
      console.log("   node scripts/ResetDatabase.js");
      console.log("   node scripts/importKaggleWithImages.js");
    } else {
      console.log("\n📊 Courses by Category:");

      const distribution = await Course.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            avgPrice: { $avg: "$price" },
            avgRating: { $avg: "$rating" },
          },
        },
        { $sort: { count: -1 } },
      ]);

      distribution.forEach((cat, i) => {
        console.log(
          `   ${(i + 1).toString().padStart(2, "0")}. ${cat._id.padEnd(
            30
          )} | ${cat.count.toString().padStart(4)} courses | $${cat.avgPrice
            .toFixed(2)
            .padStart(6)} | ⭐${cat.avgRating.toFixed(1)}`
        );
      });

      // Show sample course
      const sampleCourse = await Course.findOne().lean();
      console.log("\n📸 Sample Course:");
      console.log("=" .repeat(60));
      console.log("ID:        ", sampleCourse._id);
      console.log("Title:     ", sampleCourse.title);
      console.log("Slug:      ", sampleCourse.slug);
      console.log("Category:  ", sampleCourse.category);
      console.log("Instructor:", sampleCourse.instructor);
      console.log("Price:     $", sampleCourse.price);
      console.log("Rating:    ", sampleCourse.rating, "⭐");
      console.log("Students:  ", sampleCourse.students.toLocaleString());
      console.log("Thumbnail: ", sampleCourse.thumbnail?.substring(0, 80) + "...");
      console.log("=" .repeat(60));
    }

    console.log("\n✅ Database check complete!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

checkDatabase();