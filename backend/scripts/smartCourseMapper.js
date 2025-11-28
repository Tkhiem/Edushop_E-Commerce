/**
 * =============================================
 * SMART COURSE MAPPER - FIX THUMBNAILS & LABELS
 * =============================================
 */

// ✅ Category-specific images from real Udemy courses
export const CATEGORY_IMAGE_MAP = {
  "Business Finance": [
    "https://img-c.udemycdn.com/course/480x270/1070968_5e8f_2.jpg",
    "https://img-c.udemycdn.com/course/480x270/476268_d8ec_8.jpg",
    "https://img-c.udemycdn.com/course/480x270/975046_32b4.jpg",
    "https://img-c.udemycdn.com/course/480x270/449532_926c_8.jpg",
  ],
  "Web Development": [
    "https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg",
    "https://img-c.udemycdn.com/course/480x270/764164_de03_5.jpg",
    "https://img-c.udemycdn.com/course/480x270/1565838_e54e_18.jpg",
    "https://img-c.udemycdn.com/course/480x270/1362070_b9a1_2.jpg",
  ],
  "Graphic Design": [
    "https://img-c.udemycdn.com/course/480x270/914296_25d6.jpg",
    "https://img-c.udemycdn.com/course/480x270/859932_b13f_3.jpg",
    "https://img-c.udemycdn.com/course/480x270/1535612_51d2.jpg",
    "https://img-c.udemycdn.com/course/480x270/2565840_38e5_4.jpg",
  ],
  "Musical Instruments": [
    "https://img-c.udemycdn.com/course/480x270/799786_ba49_2.jpg",
    "https://img-c.udemycdn.com/course/480x270/149728_e2f1_3.jpg",
    "https://img-c.udemycdn.com/course/480x270/577058_8aa2_3.jpg",
    "https://img-c.udemycdn.com/course/480x270/365292_6e8a_2.jpg",
  ],
  "IT & Software": [
    "https://img-c.udemycdn.com/course/480x270/567828_67d0.jpg",
    "https://img-c.udemycdn.com/course/480x270/822444_a6db.jpg",
  ],
  Marketing: [
    "https://img-c.udemycdn.com/course/480x270/673636_f033.jpg",
    "https://img-c.udemycdn.com/course/480x270/959700_8bd2_3.jpg",
  ],
  "Photography & Video": [
    "https://img-c.udemycdn.com/course/480x270/312298_8a80_8.jpg",
    "https://img-c.udemycdn.com/course/480x270/435262_d503_4.jpg",
  ],
  "Personal Development": [
    "https://img-c.udemycdn.com/course/480x270/396876_cc92_7.jpg",
    "https://img-c.udemycdn.com/course/480x270/625204_436a_3.jpg",
  ],
  "Health & Fitness": [
    "https://img-c.udemycdn.com/course/480x270/331572_4f8b_4.jpg",
    "https://img-c.udemycdn.com/course/480x270/518196_2de2_4.jpg",
  ],
};

// ✅ Keyword-based image selection
export const IMAGE_KEYWORDS = {
  trading: [
    "https://img-c.udemycdn.com/course/480x270/476268_d8ec_8.jpg",
    "https://img-c.udemycdn.com/course/480x270/975046_32b4.jpg",
  ],
  investment: ["https://img-c.udemycdn.com/course/480x270/1070968_5e8f_2.jpg"],
  "stock market": [
    "https://img-c.udemycdn.com/course/480x270/192870_c325_4.jpg",
  ],
  javascript: ["https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg"],
  react: ["https://img-c.udemycdn.com/course/480x270/1565838_e54e_18.jpg"],
  python: ["https://img-c.udemycdn.com/course/480x270/567828_67d0.jpg"],
  photoshop: ["https://img-c.udemycdn.com/course/480x270/859932_b13f_3.jpg"],
  guitar: ["https://img-c.udemycdn.com/course/480x270/799786_ba49_2.jpg"],
  piano: ["https://img-c.udemycdn.com/course/480x270/149728_e2f1_3.jpg"],
  photography: ["https://img-c.udemycdn.com/course/480x270/312298_8a80_8.jpg"],
  marketing: ["https://img-c.udemycdn.com/course/480x270/673636_f033.jpg"],
  yoga: ["https://img-c.udemycdn.com/course/480x270/331572_4f8b_4.jpg"],
};

// ✅ Category-specific instructors
export const CATEGORY_INSTRUCTORS = {
  "Business Finance": [
    "Warren E. Buffett",
    "Robert Kiyosaki",
    "Chris Haroun",
    "Phil Pustejovsky",
    "Wealthy Education Team",
  ],
  "Web Development": [
    "Jonas Schmedtmann",
    "Angela Yu",
    "Maximilian Schwarzmüller",
    "Colt Steele",
    "Brad Traversy",
  ],
  "Graphic Design": [
    "Lindsay Marsh",
    "Derrick Mitchell",
    "Martin Perhiniak",
    "Daniel Scott",
    "Chad Neuman",
  ],
  "Musical Instruments": [
    "Erich Andreas",
    "Yousician",
    "Steve Krenz",
    "Richard Clayderman",
    "David Wallimann",
  ],
  "IT & Software": [
    "Tim Buchalka",
    "Stephen Grider",
    "Andrew Ng",
    "Rob Percival",
  ],
  Marketing: ["Neil Patel", "Seth Godin", "Gary Vaynerchuk", "Phil Ebiner"],
  "Photography & Video": [
    "Phil Ebiner",
    "Peter McKinnon",
    "Brandon Li",
    "Daniel Schiffer",
  ],
  "Personal Development": [
    "Tony Robbins",
    "Dale Carnegie",
    "Robin Sharma",
    "Brian Tracy",
  ],
  "Health & Fitness": [
    "Adriene Mishler",
    "Jeff Cavaliere",
    "Kayla Itsines",
    "Joe Wicks",
  ],
};

// ✅ Vietnamese category names
export const CATEGORY_VIETNAMESE = {
  "Business Finance": "Kinh Doanh & Tài Chính",
  "Web Development": "Lập Trình Web",
  "Graphic Design": "Thiết Kế Đồ Họa",
  "Musical Instruments": "Nhạc Cụ",
  "Photography & Video": "Nhiếp Ảnh & Video",
  "IT & Software": "Công Nghệ Thông Tin",
  Marketing: "Marketing",
  "Personal Development": "Phát Triển Cá Nhân",
  "Health & Fitness": "Sức Khỏe & Thể Hình",
};

// ✅ Category icons
export const CATEGORY_ICONS = {
  "Business Finance": "💼",
  "Web Development": "💻",
  "Graphic Design": "🎨",
  "Musical Instruments": "🎸",
  "Photography & Video": "📷",
  "IT & Software": "⚙️",
  Marketing: "📊",
  "Personal Development": "🌟",
  "Health & Fitness": "💪",
};

/**
 * Get smart thumbnail based on title and category
 */
export function getSmartThumbnail(title, category) {
  if (!title || !category) {
    return "https://img-c.udemycdn.com/course/480x270/placeholder.jpg";
  }

  const titleLower = title.toLowerCase();

  // 1. Try keyword matching first
  for (const [keyword, images] of Object.entries(IMAGE_KEYWORDS)) {
    if (titleLower.includes(keyword)) {
      return images[Math.floor(Math.random() * images.length)];
    }
  }

  // 2. Fall back to category images
  const categoryImages = CATEGORY_IMAGE_MAP[category];
  if (categoryImages && categoryImages.length > 0) {
    return categoryImages[Math.floor(Math.random() * categoryImages.length)];
  }

  // 3. Default fallback
  return "https://img-c.udemycdn.com/course/480x270/placeholder.jpg";
}

/**
 * Get category-appropriate instructor
 */
export function getSmartInstructor(category) {
  const instructors = CATEGORY_INSTRUCTORS[category];
  if (instructors && instructors.length > 0) {
    return instructors[Math.floor(Math.random() * instructors.length)];
  }
  return "Expert Instructor";
}

/**
 * Get Vietnamese category name
 */
export function getVietnameseCategory(englishCategory) {
  return CATEGORY_VIETNAMESE[englishCategory] || englishCategory;
}

/**
 * Get category icon
 */
export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || "📚";
}
