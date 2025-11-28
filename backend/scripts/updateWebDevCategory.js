import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import Course from "../models/Course.js";

dotenv.config();

const updateWebDevelopmentCategory = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find "Lập Trình Web" category
    const webDevCategory = await Category.findOne({ name: "Lập Trình Web" });
    
    if (!webDevCategory) {
      console.log("❌ Category 'Lập Trình Web' not found");
      process.exit(1);
    }

    console.log(`📝 Found category: ${webDevCategory.name} (ID: ${webDevCategory._id})`);

    // Count courses using this category
    const courseCount = await Course.countDocuments({ category: "Lập Trình Web" });
    console.log(`📊 Found ${courseCount} courses using "Lập Trình Web" category`);

    // Update category name and slug
    webDevCategory.name = "Lập Trình";
    webDevCategory.slug = "lap-trinh";
    webDevCategory.description = "Các khóa học về lập trình và phát triển phần mềm";
    await webDevCategory.save();

    console.log(`✅ Updated category to: ${webDevCategory.name}`);

    // Update all courses using "Lập Trình Web" to "Lập Trình"
    const result = await Course.updateMany(
      { category: "Lập Trình Web" },
      { $set: { category: "Lập Trình" } }
    );

    console.log(`✅ Updated ${result.modifiedCount} courses from "Lập Trình Web" to "Lập Trình"`);

    // Verify
    const updatedCount = await Course.countDocuments({ category: "Lập Trình" });
    console.log(`✅ Verified: ${updatedCount} courses now use "Lập Trình" category`);

    console.log("\n🎉 Migration completed successfully!");
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("👋 Disconnected from MongoDB");
  }
};

updateWebDevelopmentCategory();
