import mongoose from "mongoose";
import dotenv from "dotenv";
import Review from "../models/Review.js";

dotenv.config();

async function cleanupReviews() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // 1. Drop and recreate indexes
    console.log("🔄 Dropping old indexes...");
    await Review.collection.dropIndexes();
    console.log("✅ Indexes dropped");

    // 2. Find and remove reviews with null/missing course_id
    console.log("🔍 Finding reviews with missing course_id...");
    const nullCourseReviews = await Review.find({ course_id: null });
    if (nullCourseReviews.length > 0) {
      console.log(`❌ Found ${nullCourseReviews.length} reviews with null course_id`);
      await Review.deleteMany({ course_id: null });
      console.log("✅ Deleted reviews with null course_id");
    } else {
      console.log("✅ No reviews with null course_id");
    }

    // 3. Recreate indexes
    console.log("🔄 Recreating indexes...");
    await Review.collection.createIndex({ user_id: 1, course_id: 1 }, { unique: true });
    console.log("✅ Unique index recreated: { user_id: 1, course_id: 1 }");

    // 4. Show summary
    const totalReviews = await Review.countDocuments();
    console.log(`\n📊 Summary:`);
    console.log(`   Total reviews in database: ${totalReviews}`);

    console.log("\n✅ Cleanup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during cleanup:", error.message);
    process.exit(1);
  }
}

cleanupReviews();
