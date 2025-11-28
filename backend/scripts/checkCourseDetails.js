import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";

dotenv.config();

const checkCourseDetails = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get a few sample courses
    const courses = await Course.find().limit(5).lean();

    console.log("\n📚 Sample Course Details:");
    console.log("=".repeat(80));

    courses.forEach((course, index) => {
      console.log(`\n${index + 1}. ${course.title}`);
      console.log(`   ID: ${course._id}`);
      console.log(`   Slug: ${course.slug || "❌ MISSING SLUG"}`);
      console.log(`   Category: ${course.category}`);
      console.log(`   Price: $${course.price}`);
      console.log(`   Instructor: ${course.instructor}`);
      console.log(`   Rating: ${course.rating}`);
      console.log(`   Students: ${course.students}`);
    });

    console.log("\n" + "=".repeat(80));
    console.log(`✅ Total courses in database: ${await Course.countDocuments()}`);

    // Check if any courses are missing slug
    const missingSlug = await Course.countDocuments({ slug: { $exists: false } });
    if (missingSlug > 0) {
      console.log(`\n⚠️ WARNING: ${missingSlug} courses are missing slug field!`);
      console.log("   Run: node scripts/generateSlugs.js to fix this");
    } else {
      console.log(`\n✅ All courses have slug field`);
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n✅ Connection closed");
  }
};

checkCourseDetails();
