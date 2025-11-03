import crypto from "crypto";
import pool from "../config/database.js";

/**
 * Insert category vào database
 */
export async function insertCategory(categoryData) {
  try {
    const [existing] = await pool.query(
      "SELECT category_id FROM categories WHERE slug = ?",
      [categoryData.slug]
    );

    if (existing.length > 0) {
      console.log(
        `  ⏭️  Category exists: ${categoryData.name} (ID: ${existing[0].category_id})`
      );
      return existing[0].category_id;
    }

    const [result] = await pool.query(
      "INSERT INTO categories (name, slug, description, udemy_category_id) VALUES (?, ?, ?, ?)",
      [
        categoryData.name,
        categoryData.slug,
        categoryData.description,
        categoryData.slug,
      ]
    );

    console.log(
      `  ✅ Category inserted: ${categoryData.name} (ID: ${result.insertId})`
    );
    return result.insertId;
  } catch (error) {
    console.error("❌ Error inserting category:", error.message);
    throw error;
  }
}

/**
 * Insert teacher (instructor) vào database
 */
export async function insertTeacher(instructorData) {
  try {
    const displayName =
      instructorData?.display_name ||
      instructorData?.title ||
      "Udemy Instructor";
    const udemyId =
      instructorData?.id?.toString() || crypto.randomBytes(8).toString("hex");

    const [existing] = await pool.query(
      "SELECT user_id FROM users WHERE udemy_instructor_id = ?",
      [udemyId]
    );

    if (existing.length > 0) {
      return existing[0].user_id;
    }

    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password, avatar_url, bio, role_id, udemy_instructor_id) VALUES (?, ?, ?, ?, ?, 2, ?)",
      [
        displayName,
        `instructor_${udemyId}@udemy.com`,
        "$2a$10$dummy.hash.for.demo.purposes.only",
        instructorData?.image_100x100 ||
          `https://i.pravatar.cc/150?u=${udemyId}`,
        instructorData?.job_title || "Expert Instructor from Udemy",
        udemyId,
      ]
    );

    return result.insertId;
  } catch (error) {
    console.error("❌ Error inserting teacher:", error.message);
    return null;
  }
}

/**
 * Transform Udemy course data sang format database
 */
export function transformUdemyCourse(udemyCourse, categoryId, teacherId) {
  const USD_TO_VND = 25000;
  let price = 0;
  let discountedPrice = null;

  // Parse price (Udemy trả về dạng "$19.99" hoặc object)
  if (udemyCourse.price) {
    const priceString = udemyCourse.price.toString().replace(/[^0-9.]/g, "");
    const priceNum = parseFloat(priceString || "0");
    if (priceNum > 0) {
      price = Math.round(priceNum * USD_TO_VND);
    }
  }

  // Parse discount price
  if (udemyCourse.discount?.price) {
    const discountString = udemyCourse.discount.price
      .toString()
      .replace(/[^0-9.]/g, "");
    const discountNum = parseFloat(discountString || "0");
    if (discountNum > 0) {
      discountedPrice = Math.round(discountNum * USD_TO_VND);
    }
  }

  // Nếu không có giá, tạo giá random
  if (price === 0) {
    price = Math.floor(Math.random() * (500000 - 150000) + 150000);
  }

  // Parse level
  const levelMap = {
    all: "All Levels",
    beginner: "Beginner",
    intermediate: "Intermediate",
    expert: "Advanced",
  };
  const level = levelMap[udemyCourse.instructional_level] || "All Levels";

  // Generate slug
  const slug =
    (udemyCourse.title || "untitled-course")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 100) +
    `-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // Parse duration (từ content_info: "5.5 total hours")
  let durationMinutes = 0;
  if (udemyCourse.content_info) {
    const match = udemyCourse.content_info.match(
      /(\d+(?:\.\d+)?)\s*(?:total\s*)?hours?/i
    );
    if (match) {
      durationMinutes = Math.round(parseFloat(match[1]) * 60);
    }
  }
  if (durationMinutes === 0) {
    durationMinutes = Math.floor(Math.random() * (180 - 30) + 30);
  }

  // Generate download info
  const downloadToken = crypto.randomBytes(16).toString("hex");
  const fileName =
    (udemyCourse.title || "course")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .substring(0, 50) + ".pdf";
  const fileSize = `${Math.floor(Math.random() * (50 - 10) + 10)} MB`;

  return {
    title: (udemyCourse.title || "Untitled Course").substring(0, 255),
    slug,
    description: (
      udemyCourse.headline || "High quality online course from Udemy"
    ).substring(0, 500),
    long_description:
      udemyCourse.headline ||
      "Comprehensive course content with expert instruction",
    thumbnail_url:
      udemyCourse.image_480x270 || "https://via.placeholder.com/480x270",
    price,
    discounted_price: discountedPrice,
    level,
    language: udemyCourse.locale?.title || "English",
    duration_minutes: durationMinutes,
    teacher_id: teacherId,
    category_id: categoryId,
    is_published: true,
    udemy_course_id:
      udemyCourse.id?.toString() || crypto.randomBytes(8).toString("hex"),
    is_from_udemy: true,
    download_token: downloadToken,
    file_name: fileName,
    file_size: fileSize,
    file_type: "PDF",
    avg_rating: udemyCourse.avg_rating || 0,
    num_reviews: udemyCourse.num_reviews || 0,
    instructor: udemyCourse.visible_instructors?.[0],
  };
}

/**
 * Insert course vào database
 */
export async function insertCourse(courseData) {
  try {
    // Check xem course đã tồn tại chưa
    const [existing] = await pool.query(
      "SELECT course_id FROM courses WHERE udemy_course_id = ?",
      [courseData.udemy_course_id]
    );

    if (existing.length > 0) {
      console.log(
        `  ⏭️  Course exists: ${courseData.title.substring(0, 50)}...`
      );
      return existing[0].course_id;
    }

    const [result] = await pool.query(
      `INSERT INTO courses (
        title, slug, description, long_description, thumbnail_url,
        price, discounted_price, level, language, duration_minutes,
        teacher_id, category_id, is_published,
        udemy_course_id, is_from_udemy,
        download_token, file_name, file_size, file_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        courseData.title,
        courseData.slug,
        courseData.description,
        courseData.long_description,
        courseData.thumbnail_url,
        courseData.price,
        courseData.discounted_price,
        courseData.level,
        courseData.language,
        courseData.duration_minutes,
        courseData.teacher_id,
        courseData.category_id,
        courseData.is_published,
        courseData.udemy_course_id,
        courseData.is_from_udemy,
        courseData.download_token,
        courseData.file_name,
        courseData.file_size,
        courseData.file_type,
      ]
    );

    // Insert fake reviews
    if (courseData.avg_rating > 0 && courseData.num_reviews > 0) {
      await insertFakeReviews(
        result.insertId,
        courseData.avg_rating,
        Math.min(courseData.num_reviews, 5)
      );
    }

    return result.insertId;
  } catch (error) {
    console.error("❌ Error inserting course:", error.message);
    throw error;
  }
}

/**
 * Insert fake reviews cho course
 */
async function insertFakeReviews(courseId, avgRating, numReviews) {
  const reviewTexts = [
    "Khóa học rất hay và chi tiết, giảng viên giải thích dễ hiểu!",
    "Nội dung phong phú, đáng đồng tiền bát gạo. Highly recommended!",
    "Rất hài lòng với khóa học này, recommend cho mọi người!",
    "Giảng viên nhiệt tình, support tốt. 5 sao không chê được gì!",
    "Chất lượng tốt, giá cả hợp lý. Đã học xong và áp dụng được ngay.",
  ];

  for (let i = 0; i < Math.min(numReviews, 5); i++) {
    const rating = Math.max(
      3,
      Math.min(5, avgRating + (Math.random() - 0.5) * 1.5)
    );
    const comment = reviewTexts[i % reviewTexts.length];

    try {
      await pool.query(
        "INSERT INTO review (course_id, rating, comment, user_name) VALUES (?, ?, ?, ?)",
        [courseId, parseFloat(rating.toFixed(1)), comment, `User ${i + 1}`]
      );
    } catch (error) {
      // Ignore duplicate review errors
    }
  }
}
