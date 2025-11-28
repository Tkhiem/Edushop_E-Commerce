import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import csv from "csv-parser";
import Course from "../models/Course.js";
import Category from "../models/Category.js";
import {
  getSmartThumbnail,
  getSmartInstructor,
  getVietnameseCategory,
  getCategoryIcon,
} from "./smartCourseMapper.js";

dotenv.config();

// Level mapping
const LEVEL_MAPPING = {
  "All Levels": "all levels",
  "Beginner Level": "beginner",
  "Intermediate Level": "intermediate",
  "Advanced Level": "advanced",
  "Expert Level": "advanced",
};

const normalizeLevel = (level) => {
  if (!level) return "all levels";
  return LEVEL_MAPPING[level] || "all levels";
};

const parseDuration = (durationStr) => {
  if (!durationStr) return 0;
  const hours = parseFloat(durationStr);
  return isNaN(hours) ? 0 : Math.round(hours * 60);
};

const generateSlug = (title) => {
  if (!title || typeof title !== "string") {
    return `course-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  let slug = title
    .toLowerCase()
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);

  if (!slug || slug.length < 3) {
    slug = `course-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  return slug;
};

const importCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected\n");

    const csvPath = "./data/udemy_online_education_courses_dataset.csv";

    if (!fs.existsSync(csvPath)) {
      console.error("❌ CSV not found:", csvPath);
      process.exit(1);
    }

    const courses = [];
    const categories = new Set();

    console.log("📖 Reading CSV...");
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => {
          courses.push(row);
          if (row.subject) {
            categories.add(row.subject.trim());
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log(`📊 Found ${courses.length} courses`);
    console.log(`📊 Found ${categories.size} categories\n`);

    // Create categories with Vietnamese names
    console.log("📁 Creating categories...");
    for (const categoryName of categories) {
      const vietnameseName = getVietnameseCategory(categoryName);
      const icon = getCategoryIcon(categoryName);

      await Category.findOneAndUpdate(
        { name: vietnameseName },
        {
          name: vietnameseName,
          slug: generateSlug(vietnameseName),
          icon: icon,
        },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Created ${categories.size} categories\n`);

    console.log("📚 Importing courses...");
    let successCount = 0;
    let errorCount = 0;
    const slugs = new Set();

    for (let i = 0; i < courses.length; i++) {
      const row = courses[i];

      try {
        const isPaid = row.is_paid?.toLowerCase() === "true";
        const price = parseFloat(row.price) || 0;
        const finalPrice = isPaid ? price : 0;

        const englishCategory = row.subject?.trim() || "Business Finance";
        const vietnameseCategory = getVietnameseCategory(englishCategory);
        const title = row.course_title?.trim() || `Course ${i + 1}`;

        // Generate unique slug
        let slug = generateSlug(title);
        let slugAttempt = 0;
        while (slugs.has(slug) && slugAttempt < 10) {
          slug = `${generateSlug(title)}-${Date.now()}-${slugAttempt}`;
          slugAttempt++;
        }
        slugs.add(slug);

        // ✅ Get smart thumbnail based on title & category
        const thumbnail = getSmartThumbnail(title, englishCategory);

        // ✅ Get category-appropriate instructor
        const instructor = getSmartInstructor(englishCategory);

        const courseData = {
          title: title,
          slug: slug,
          description: `Học ${title}. Khóa học chất lượng với nội dung cập nhật và giảng viên chuyên nghiệp.`,
          thumbnail: thumbnail,
          price: finalPrice,
          originalPrice: price,
          discountedPrice: finalPrice,
          discountPercentage:
            price > 0 ? Math.round(((price - finalPrice) / price) * 100) : 0,
          category: vietnameseCategory,
          instructor: instructor,
          rating: parseFloat(row.rating) || 4.5,
          students: parseInt(row.num_subscribers) || 0,
          reviews: parseInt(row.num_reviews) || 0,
          level: normalizeLevel(row.level),
          language: "English",
          duration: parseDuration(row.content_duration),
          lectures: parseInt(row.num_lectures) || 0,
          isBestseller: parseInt(row.num_subscribers) > 10000,
          isNew: false,
          tags: [vietnameseCategory, normalizeLevel(row.level)],
          url: row.url || "",
          publishedDate: row.published_timestamp
            ? new Date(row.published_timestamp)
            : new Date(),
        };

        await Course.create(courseData);
        successCount++;

        if (successCount % 100 === 0) {
          console.log(
            `⏳ Imported ${successCount}/${courses.length} courses...`
          );
        }
      } catch (error) {
        errorCount++;
        if (errorCount <= 5) {
          console.error(`❌ Error at row ${i}:`, error.message);
        }
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`✅ Import completed!`);
    console.log(`📊 Success: ${successCount} courses`);
    console.log(`❌ Errors: ${errorCount} courses`);
    console.log("=".repeat(60) + "\n");

    // Show statistics
    const distribution = await Course.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalStudents: { $sum: "$students" },
          avgRating: { $avg: "$rating" },
          avgPrice: { $avg: "$price" },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    console.log("📊 Thống kê theo danh mục:");
    console.table(
      distribution.map((cat, i) => ({
        "#": i + 1,
        Category: cat._id,
        Courses: cat.count,
        Students: cat.totalStudents.toLocaleString(),
        "Avg Rating": cat.avgRating.toFixed(1),
        "Avg Price": `$${cat.avgPrice.toFixed(0)}`,
      }))
    );

    // Show sample courses per category
    console.log("\n📸 Sample courses:");
    for (const cat of distribution.slice(0, 3)) {
      const sample = await Course.findOne({ category: cat._id }).lean();
      if (sample) {
        console.log(`\n${cat._id}:`);
        console.log(`  Title: ${sample.title}`);
        console.log(`  Instructor: ${sample.instructor}`);
        console.log(`  Image: ${sample.thumbnail.substring(0, 60)}...`);
        console.log(`  Price: $${sample.price}`);
        console.log(`  Rating: ${sample.rating}⭐`);
      }
    }

    console.log("\n✅ All done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error:", error);
    console.error(error.stack);
    process.exit(1);
  }
};

importCourses();
