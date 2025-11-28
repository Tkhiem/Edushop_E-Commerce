import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";
import Category from "../models/Category.js";

dotenv.config();

const fixCategoryObjectIds = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected\n");

    // Get all courses with ObjectId categories
    const coursesWithObjectId = await Course.find({
      category: { $type: "objectId" },
    });

    console.log(
      `🔍 Found ${coursesWithObjectId.length} courses with ObjectId categories`
    );

    if (coursesWithObjectId.length === 0) {
      console.log("✅ No courses need fixing");
      process.exit(0);
    }

    let fixedCount = 0;
    let errorCount = 0;

    for (const course of coursesWithObjectId) {
      try {
        // Find the category by ID
        const category = await Category.findById(course.category);

        if (category && category.name) {
          // Update course with category name
          course.category = category.name;
          await course.save();
          fixedCount++;

          if (fixedCount % 10 === 0) {
            console.log(
              `⏳ Fixed ${fixedCount}/${coursesWithObjectId.length} courses...`
            );
          }
        } else {
          // Category not found, set to "Uncategorized"
          console.log(`⚠️  Category not found for course: ${course.title}`);
          course.category = "Uncategorized";
          await course.save();
          errorCount++;
        }
      } catch (error) {
        console.error(`❌ Error fixing course ${course._id}:`, error.message);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`✅ Fixed: ${fixedCount} courses`);
    console.log(`⚠️  Errors: ${errorCount} courses`);
    console.log("=".repeat(50) + "\n");

    // Show final distribution
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
    ]);

    console.log("📊 Final Category Distribution:");
    distribution.forEach((cat, i) => {
      console.log(
        `${(i + 1).toString().padStart(2, "0")}. ${String(cat._id).padEnd(
          30
        )} - ${cat.count} courses`
      );
    });

    console.log("\n✅ All categories fixed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal Error:", error);
    process.exit(1);
  }
};

fixCategoryObjectIds();
