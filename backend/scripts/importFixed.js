import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import csv from "csv-parser";
import Course from "../models/Course.js";
import Category from "../models/Category.js";

dotenv.config();

const DEFAULT_IMAGE = "https://via.placeholder.com/640x360?text=Course+Image";

// Level mapping
const normalizeLevel = (level) => {
  // ✅ Remove duplicate "Level"
  if (!level) return "all levels";

  const levelLower = level.toLowerCase().trim();

  if (levelLower.includes("beginner") || levelLower.includes("all")) {
    return "beginner";
  }
  if (levelLower.includes("intermediate")) {
    return "intermediate";
  }
  if (levelLower.includes("advanced") || levelLower.includes("expert")) {
    return "advanced";
  }

  return "all levels";
};

// Generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 100);
};

const importCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected\n");

    const csvPath = "./data/udemy_online_education_courses_dataset.csv";

    if (!fs.existsSync(csvPath)) {
      console.error("❌ CSV file not found:", csvPath);
      process.exit(1);
    }

    const courses = [];
    const categories = new Set();

    // Read CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => {
          courses.push(row);
          if (row.category) {
            categories.add(row.category.trim());
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log(`📊 Found ${courses.length} courses in CSV`);
    console.log(`📊 Found ${categories.size} unique categories\n`);

    // Create categories
    console.log("📁 Creating categories...");
    for (const categoryName of categories) {
      await Category.findOneAndUpdate(
        { name: categoryName },
        {
          name: categoryName,
          slug: generateSlug(categoryName),
        },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Created ${categories.size} categories\n`);

    // Import courses
    console.log("📚 Importing courses...");
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < courses.length; i++) {
      const row = courses[i];

      try {
        const price = parseFloat(row.price) || 0;
        const discountedPrice = parseFloat(row.discounted_price) || price;
        const discountPercent =
          price > 0 ? Math.round(((price - discountedPrice) / price) * 100) : 0;

        const courseData = {
          title: row.title || `Course ${i + 1}`,
          slug: generateSlug(row.title || `course-${i + 1}`),
          description: row.description || `Learn ${row.title || "new skills"}`,
          thumbnail: row.image_url || DEFAULT_IMAGE,
          price: discountedPrice,
          originalPrice: price,
          discountedPrice: discountedPrice,
          discountPercentage: discountPercent,
          category: row.category?.trim() || "Uncategorized", // ✅ STRING
          instructor: row.instructor || "Unknown Instructor", // ✅ REQUIRED
          rating: parseFloat(row.rating) || 0,
          students: parseInt(row.num_subscribers) || 0,
          reviews: parseInt(row.num_reviews) || 0,
          level: normalizeLevel(row.level), // ✅ NORMALIZED
          language: "English",
          duration: 0,
          lectures: parseInt(row.num_lectures) || 0,
          isBestseller: false,
          isNew: false,
          tags: [],
        };

        await Course.create(courseData);
        successCount++;

        if (successCount % 50 === 0) {
          console.log(
            `⏳ Imported ${successCount}/${courses.length} courses...`
          );
        }
      } catch (error) {
        console.error(
          `❌ Error importing course "${row.title}":`,
          error.message
        );
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`✅ Successfully imported: ${successCount} courses`);
    console.log(`❌ Errors: ${errorCount} courses`);
    console.log("=".repeat(50) + "\n");

    // Show distribution
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

    console.log("📊 Category Distribution:");
    distribution.forEach((cat, i) => {
      console.log(
        `${(i + 1).toString().padStart(2, "0")}. ${cat._id.padEnd(30)} - ${
          cat.count
        } courses`
      );
    });

    console.log("\n✅ Import complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal Error:", error);
    process.exit(1);
  }
};

importCourses();
