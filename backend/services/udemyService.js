import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const UDEMY_BASE_URL =
  process.env.UDEMY_BASE_URL || "https://www.udemy.com/api-2.0";

/**
 * Tạo Udemy API client (Public API - không cần authentication)
 */
function createUdemyClient() {
  return axios.create({
    baseURL: UDEMY_BASE_URL,
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    timeout: 15000,
  });
}

/**
 * Danh sách categories (hardcode vì Public API không hỗ trợ fetch categories)
 */
export function getUdemyCategories() {
  return [
    {
      name: "Development",
      slug: "development",
      description:
        "Web development, programming languages, mobile apps, game development, databases, and software testing",
      keywords: [
        "python",
        "javascript",
        "web development",
        "react",
        "nodejs",
        "java",
        "c#",
      ],
    },
    {
      name: "Business",
      slug: "business",
      description:
        "Entrepreneurship, communication, management, sales, business strategy, operations, and project management",
      keywords: [
        "entrepreneurship",
        "business strategy",
        "management",
        "startup",
        "finance",
        "leadership",
      ],
    },
    {
      name: "IT & Software",
      slug: "it-software",
      description:
        "IT certifications, network & security, hardware, operating systems, and other IT & software topics",
      keywords: [
        "aws",
        "cloud computing",
        "cybersecurity",
        "linux",
        "cisco",
        "docker",
        "kubernetes",
      ],
    },
    {
      name: "Design",
      slug: "design",
      description:
        "Web design, graphic design & illustration, design tools, user experience design, game design, and 3D & animation",
      keywords: [
        "graphic design",
        "ui ux",
        "figma",
        "adobe photoshop",
        "web design",
        "canva",
        "illustrator",
      ],
    },
    {
      name: "Marketing",
      slug: "marketing",
      description:
        "Digital marketing, search engine optimization, social media marketing, branding, marketing fundamentals, and analytics",
      keywords: [
        "digital marketing",
        "seo",
        "social media marketing",
        "content marketing",
        "email marketing",
        "google ads",
      ],
    },
    {
      name: "Personal Development",
      slug: "personal-development",
      description:
        "Personal productivity, leadership, personal finance, career development, parenting & relationships, and happiness",
      keywords: [
        "productivity",
        "leadership",
        "time management",
        "career development",
        "communication skills",
      ],
    },
    {
      name: "Photography & Video",
      slug: "photography-video",
      description:
        "Digital photography, video design, commercial photography, video production, photography tools, and other topics",
      keywords: [
        "photography",
        "video editing",
        "adobe premiere",
        "final cut pro",
        "videography",
      ],
    },
    {
      name: "Health & Fitness",
      slug: "health-fitness",
      description:
        "Fitness, general health, sports, nutrition & diet, yoga, mental health, dieting, self defense, safety & first aid",
      keywords: [
        "yoga",
        "fitness",
        "nutrition",
        "meditation",
        "weight loss",
        "bodybuilding",
      ],
    },
  ];
}

/**
 * Fetch courses từ Udemy Public API
 * @param {string} keyword - Từ khóa tìm kiếm
 * @param {number} pageSize - Số lượng courses (max 20 cho Public API)
 * @returns {Promise<Array>} Danh sách courses
 */
export async function fetchUdemyCourses(keyword, pageSize = 10) {
  try {
    const client = createUdemyClient();
    console.log(`🔍 Fetching ${pageSize} courses for: "${keyword}"...`);

    const response = await client.get("/courses/", {
      params: {
        search: keyword,
        page_size: Math.min(pageSize, 20), // Public API limit: 20
        ordering: "relevance",
        "fields[course]":
          "title,headline,price,discount,image_480x270,visible_instructors,avg_rating,num_reviews,num_subscribers,content_info,locale,instructional_level",
      },
    });

    const count = response.data.results?.length || 0;
    console.log(`✅ Fetched ${count} courses`);
    return response.data.results || [];
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error("❌ Timeout - Udemy API not responding");
    } else if (error.response?.status === 429) {
      console.error("❌ Rate limit exceeded - wait 1 hour");
    } else if (error.response?.status === 403) {
      console.error("❌ Forbidden - Check API access");
    } else {
      console.error(`❌ Error: ${error.message}`);
    }
    return [];
  }
}

/**
 * Fetch courses cho tất cả categories
 * @param {number} coursesPerKeyword - Số course mỗi keyword
 * @returns {Promise<Array>} Array of { category, courses }
 */
export async function fetchAllCategories(coursesPerKeyword = 10) {
  const categories = getUdemyCategories();
  const results = [];

  console.log(`📚 Fetching courses for ${categories.length} categories...\n`);

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    console.log(`[${i + 1}/${categories.length}] Processing: ${category.name}`);

    // Lấy random keyword từ mỗi category
    const keyword =
      category.keywords[Math.floor(Math.random() * category.keywords.length)];
    const courses = await fetchUdemyCourses(keyword, coursesPerKeyword);

    results.push({ category, courses });

    // Delay để tránh rate limit
    if (i < categories.length - 1) {
      console.log("⏳ Waiting 3 seconds...\n");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  const totalCourses = results.reduce((sum, r) => sum + r.courses.length, 0);
  console.log(`\n✅ Total courses fetched: ${totalCourses}\n`);

  return results;
}

export default {
  fetchUdemyCourses,
  fetchAllCategories,
  getUdemyCategories,
};
