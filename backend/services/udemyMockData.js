/**
 * Mock data khớp 100% với schema SQL của EduShop
 * Dựa trên cấu trúc Udemy nhưng mapping đúng tên cột DB
 */

export function getUdemyCategories() {
  return [
    {
      name: "Development",
      slug: "development",
      description:
        "Web development, programming languages, mobile apps, game development, databases, and software testing",
      udemy_category_id: "udemy_dev_001",
    },
    {
      name: "Business",
      slug: "business",
      description:
        "Entrepreneurship, communication, management, sales, business strategy, operations, and project management",
      udemy_category_id: "udemy_biz_002",
    },
    {
      name: "IT & Software",
      slug: "it-software",
      description:
        "IT certifications, network & security, hardware, operating systems, and other IT & software topics",
      udemy_category_id: "udemy_it_003",
    },
    {
      name: "Design",
      slug: "design",
      description:
        "Web design, graphic design & illustration, design tools, user experience design, game design, and 3D & animation",
      udemy_category_id: "udemy_design_004",
    },
    {
      name: "Marketing",
      slug: "marketing",
      description:
        "Digital marketing, search engine optimization, social media marketing, branding, marketing fundamentals, and analytics",
      udemy_category_id: "udemy_mkt_005",
    },
    {
      name: "Personal Development",
      slug: "personal-development",
      description:
        "Personal productivity, leadership, personal finance, career development, parenting & relationships, and happiness",
      udemy_category_id: "udemy_personal_006",
    },
    {
      name: "Photography & Video",
      slug: "photography-video",
      description:
        "Digital photography, video design, commercial photography, video production, photography tools",
      udemy_category_id: "udemy_photo_007",
    },
    {
      name: "Health & Fitness",
      slug: "health-fitness",
      description:
        "Fitness, general health, sports, nutrition & diet, yoga, mental health, dieting, self defense, safety & first aid",
      udemy_category_id: "udemy_health_008",
    },
  ];
}

export function getMockInstructors() {
  return [
    {
      full_name: "Jonas Schmedtmann",
      email: "jonas@udemy-mock.com",
      password: "$2b$10$dummyhash123", // Dummy hash (không dùng)
      avatar_url: "https://img-c.udemycdn.com/user/100x100/7838524_f1d7_7.jpg",
      bio: "Web Developer, Designer, and Teacher. Passionate about teaching JavaScript and modern web development.",
      udemy_instructor_id: "udemy_inst_7838524",
      role_id: 2, // admin/instructor
    },
    {
      full_name: "Jose Portilla",
      email: "jose@udemy-mock.com",
      password: "$2b$10$dummyhash123",
      avatar_url: "https://img-c.udemycdn.com/user/100x100/4387876_78bc_4.jpg",
      bio: "Head of Data Science, Pierian Data Inc. Expert in Python, Machine Learning, and Data Science.",
      udemy_instructor_id: "udemy_inst_4387876",
      role_id: 2,
    },
    {
      full_name: "Maximilian Schwarzmüller",
      email: "max@udemy-mock.com",
      password: "$2b$10$dummyhash123",
      avatar_url: "https://img-c.udemycdn.com/user/100x100/13952972_e853.jpg",
      bio: "Professional Web Developer. Teaching React, Angular, Vue, Node.js and more.",
      udemy_instructor_id: "udemy_inst_13952972",
      role_id: 2,
    },
    {
      full_name: "Colt Steele",
      email: "colt@udemy-mock.com",
      password: "$2b$10$dummyhash123",
      avatar_url: "https://img-c.udemycdn.com/user/100x100/1558632_7f4d_7.jpg",
      bio: "Developer and Bootcamp Instructor. Creator of best-selling web development courses.",
      udemy_instructor_id: "udemy_inst_1558632",
      role_id: 2,
    },
    {
      full_name: "Dr. Angela Yu",
      email: "angela@udemy-mock.com",
      password: "$2b$10$dummyhash123",
      avatar_url: "https://img-c.udemycdn.com/user/100x100/10320238_d426_8.jpg",
      bio: "Developer and Lead Instructor. Founder of The App Brewery. Teaching iOS, Web Development, and more.",
      udemy_instructor_id: "udemy_inst_10320238",
      role_id: 2,
    },
  ];
}

export function getMockCourses() {
  // Mỗi course khớp CHÍNH XÁC với schema SQL
  return {
    development: [
      {
        title: "The Complete JavaScript Course 2024: From Zero to Expert!",
        slug: "complete-javascript-2024",
        description:
          "The modern JavaScript course for everyone! Master JavaScript with projects, challenges and theory. Many courses in one!",
        long_description:
          "JavaScript is the most popular programming language in the world. It powers the entire modern web. It provides millions of high-paying jobs all over the world. That's why you want to learn JavaScript too. And you came to the right place!\n\nWhy is this the right JavaScript course for you?\n\nThis is the most complete JavaScript course on Udemy. It's an all-in-one package that will take you from the very fundamentals of JavaScript, all the way to building modern and complex applications.",
        thumbnail_url:
          "https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg",
        price: 84.99,
        discounted_price: 13.99,
        level: "all",
        language: "English",
        duration_minutes: 4140, // 69 hours
        instructor_email: "jonas@udemy-mock.com",
        category_slug: "development",
        udemy_course_id: "udemy_1565838",
        is_from_udemy: 1,
        is_published: 1,
        avg_rating: 4.7,
        total_reviews: 180000,
        total_students: 850000,
      },
      {
        title: "The Complete Python Bootcamp From Zero to Hero in Python",
        slug: "complete-python-bootcamp",
        description:
          "Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games",
        long_description:
          "Become a Python Programmer and learn one of employer's most requested skills of 2024!\n\nThis is the most comprehensive, yet straight-forward, course for the Python programming language on Udemy! Whether you have never programmed before, already know basic syntax, or want to learn about the advanced features of Python, this course is for you! In this course we will teach you Python 3.",
        thumbnail_url:
          "https://img-c.udemycdn.com/course/480x270/567828_67d0.jpg",
        price: 84.99,
        discounted_price: 13.99,
        level: "beginner",
        language: "English",
        duration_minutes: 1320, // 22 hours
        instructor_email: "jose@udemy-mock.com",
        category_slug: "development",
        udemy_course_id: "udemy_1565840",
        is_from_udemy: 1,
        is_published: 1,
        avg_rating: 4.6,
        total_reviews: 150000,
        total_students: 780000,
      },
      {
        title: "React - The Complete Guide 2024 (incl. Next.js, Redux)",
        slug: "react-complete-guide-2024",
        description:
          "Dive in and learn React.js from scratch! Learn React, Hooks, Redux, React Router, Next.js, Best Practices and way more!",
        long_description:
          "Join this bestselling React course to learn React from the ground up. You'll learn React step by step, with hands-on examples, all the way from the basics (what is React?) to advanced concepts like Next.js. You'll learn both, the modern, up-to-date React as well as the older React syntax & patterns.",
        thumbnail_url:
          "https://img-c.udemycdn.com/course/480x270/1362070_b9a1_2.jpg",
        price: 89.99,
        discounted_price: 13.99,
        level: "intermediate",
        language: "English",
        duration_minutes: 2940, // 49 hours
        instructor_email: "max@udemy-mock.com",
        category_slug: "development",
        udemy_course_id: "udemy_1565842",
        is_from_udemy: 1,
        is_published: 1,
        avg_rating: 4.6,
        total_reviews: 95000,
        total_students: 520000,
      },
      {
        title: "The Web Developer Bootcamp 2024",
        slug: "web-developer-bootcamp-2024",
        description:
          "Learn HTML, CSS, JavaScript, Node, React, PostgreSQL, Web3 and DApps! Build a portfolio of 10 projects.",
        long_description:
          "This course was just completely revamped to prepare students for the 2024 job market, with over 60 hours of brand new content. This is the only course you need to learn web development. There are a lot of options for online developer training, but this course is without a doubt the most comprehensive and effective on the market.",
        thumbnail_url:
          "https://img-c.udemycdn.com/course/480x270/625204_436a_3.jpg",
        price: 79.99,
        discounted_price: 13.99,
        level: "beginner",
        language: "English",
        duration_minutes: 4260, // 71 hours
        instructor_email: "colt@udemy-mock.com",
        category_slug: "development",
        udemy_course_id: "udemy_1565846",
        is_from_udemy: 1,
        is_published: 1,
        avg_rating: 4.7,
        total_reviews: 88000,
        total_students: 420000,
      },
      {
        title: "The Complete 2024 Web Development Bootcamp",
        slug: "complete-2024-web-development-bootcamp",
        description:
          "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps",
        long_description:
          "Welcome to the Complete Web Development Bootcamp, the only course you need to learn to code and become a full-stack web developer. With 150,000+ ratings and a 4.8 average, my Web Development course is one of the HIGHEST RATED courses in the history of Udemy!",
        thumbnail_url:
          "https://img-c.udemycdn.com/course/480x270/1565838_e54e_12.jpg",
        price: 84.99,
        discounted_price: 13.99,
        level: "beginner",
        language: "English",
        duration_minutes: 3720, // 62 hours
        instructor_email: "angela@udemy-mock.com",
        category_slug: "development",
        udemy_course_id: "udemy_1565854",
        is_from_udemy: 1,
        is_published: 1,
        avg_rating: 4.7,
        total_reviews: 110000,
        total_students: 620000,
      },
    ],
    business: [
      {
        title: "An Entire MBA in 1 Course: Award Winning Business School Prof",
        slug: "mba-in-1-course",
        description:
          "Everything You Need to Know About Business from Start-up to IPO: Finance, Strategy, Accounting, and More!",
        long_description:
          "This is the only business course that you will ever need! Covering 50+ business topics, this is the most comprehensive business course available anywhere. Learn everything about business from start-up to IPO: Finance, Strategy, Marketing, Accounting, and more!",
        thumbnail_url:
          "https://img-c.udemycdn.com/course/480x270/625204_436a_3.jpg",
        price: 84.99,
        discounted_price: 13.99,
        level: "all",
        language: "English",
        duration_minutes: 1920, // 32 hours
        instructor_email: "jonas@udemy-mock.com",
        category_slug: "business",
        udemy_course_id: "udemy_2565838",
        is_from_udemy: 1,
        is_published: 1,
        avg_rating: 4.5,
        total_reviews: 48000,
        total_students: 220000,
      },
      {
        title: "The Complete Business Plan Course (Includes 50 Templates)",
        slug: "complete-business-plan-course",
        description:
          "This Course Will Show You Step-By-Step How to Create a Business Plan & So Much More!",
        long_description:
          "Over 800,000 students have enrolled in my Udemy courses and all of them are extremely satisfied. You will be too. Check out all of the Five Star Reviews!",
        thumbnail_url:
          "https://img-c.udemycdn.com/course/480x270/449532_926c_8.jpg",
        price: 79.99,
        discounted_price: 13.99,
        level: "beginner",
        language: "English",
        duration_minutes: 900, // 15 hours
        instructor_email: "jose@udemy-mock.com",
        category_slug: "business",
        udemy_course_id: "udemy_2565840",
        is_from_udemy: 1,
        is_published: 1,
        avg_rating: 4.5,
        total_reviews: 32000,
        total_students: 180000,
      },
    ],
    "it-software": [
      {
        title: "AWS Certified Solutions Architect - Associate 2024",
        slug: "aws-certified-solutions-architect-2024",
        description:
          "Prepare for the AWS Certified Solutions Architect - Associate SAA-C03 Exam. Pass the exam with confidence!",
        long_description:
          "Learn Amazon Web Services (AWS) from an AWS Certified Solutions Architect. This course will prepare you for the AWS Certified Solutions Architect - Associate exam (SAA-C03). Get ready to pass the AWS Certified Solutions Architect Associate exam!",
        thumbnail_url:
          "https://img-c.udemycdn.com/course/480x270/1281028_e6a4.jpg",
        price: 99.99,
        discounted_price: 13.99,
        level: "intermediate",
        language: "English",
        duration_minutes: 1620, // 27 hours
        instructor_email: "max@udemy-mock.com",
        category_slug: "it-software",
        udemy_course_id: "udemy_3565838",
        is_from_udemy: 1,
        is_published: 1,
        avg_rating: 4.7,
        total_reviews: 85000,
        total_students: 420000,
      },
    ],
    design: [
      {
        title: "Graphic Design Masterclass - Learn GREAT Design",
        slug: "graphic-design-masterclass",
        description:
          "Adobe Photoshop, Illustrator, InDesign - Learn Graphic Design Theory & Principles. Typography, Logos, Branding",
        long_description:
          "Master Graphic Design and become a PRO with this comprehensive course. Learn Adobe Photoshop, Illustrator, InDesign. Master Graphic Design Theory. Learn Logo Design, Typography, and Branding. Build an Amazing Portfolio!",
        thumbnail_url:
          "https://img-c.udemycdn.com/course/480x270/914296_25d6.jpg",
        price: 84.99,
        discounted_price: 13.99,
        level: "beginner",
        language: "English",
        duration_minutes: 1260, // 21 hours
        instructor_email: "colt@udemy-mock.com",
        category_slug: "design",
        udemy_course_id: "udemy_4565838",
        is_from_udemy: 1,
        is_published: 1,
        avg_rating: 4.6,
        total_reviews: 58000,
        total_students: 285000,
      },
    ],
    marketing: [
      {
        title: "The Complete Digital Marketing Course - 12 Courses in 1",
        slug: "complete-digital-marketing-course",
        description:
          "Master Digital Marketing Strategy, SEO, YouTube, Instagram, TikTok, Facebook, Google Ads, Affiliate Marketing & More!",
        long_description:
          "This Digital Marketing Course is the only one you need to learn the digital marketing basics and start your own business or career as a digital marketing professional.",
        thumbnail_url:
          "https://img-c.udemycdn.com/course/480x270/1362070_b9a1_2.jpg",
        price: 84.99,
        discounted_price: 13.99,
        level: "beginner",
        language: "English",
        duration_minutes: 1380, // 23 hours
        instructor_email: "angela@udemy-mock.com",
        category_slug: "marketing",
        udemy_course_id: "udemy_5565838",
        is_from_udemy: 1,
        is_published: 1,
        avg_rating: 4.5,
        total_reviews: 62000,
        total_students: 310000,
      },
    ],
    "personal-development": [
      {
        title: "Productivity Masterclass: Create a Habit System That Sticks",
        slug: "productivity-masterclass",
        description:
          "Master Productivity! Build habits that stick. Time management, focus, energy & goal setting for peak performance",
        long_description:
          "Learn to be more productive with proven techniques from experts. This course will teach you productivity, time management, goal setting, and how to build habits that stick!",
        thumbnail_url:
          "https://img-c.udemycdn.com/course/480x270/951753_fgh0.jpg",
        price: 69.99,
        discounted_price: 13.99,
        level: "all",
        language: "English",
        duration_minutes: 600, // 10 hours
        instructor_email: "jonas@udemy-mock.com",
        category_slug: "personal-development",
        udemy_course_id: "udemy_6565838",
        is_from_udemy: 1,
        is_published: 1,
        avg_rating: 4.6,
        total_reviews: 38000,
        total_students: 190000,
      },
    ],
    "photography-video": [
      {
        title: "Photography Masterclass: A Complete Guide to Photography",
        slug: "photography-masterclass",
        description:
          "Master Photography! Learn Digital Photography, Lighting, DSLR Camera Settings, Portrait, Landscape & Wedding Photography",
        long_description:
          "The Photography Masterclass is your one-stop-shop to learn all the essentials you need to know to take your photography from basic snapshots to beautiful professional looking images!",
        thumbnail_url:
          "https://img-c.udemycdn.com/course/480x270/photography_masterclass.jpg",
        price: 79.99,
        discounted_price: 13.99,
        level: "beginner",
        language: "English",
        duration_minutes: 1800, // 30 hours
        instructor_email: "jose@udemy-mock.com",
        category_slug: "photography-video",
        udemy_course_id: "udemy_7565838",
        is_from_udemy: 1,
        is_published: 1,
        avg_rating: 4.7,
        total_reviews: 42000,
        total_students: 210000,
      },
    ],
    "health-fitness": [
      {
        title: "Complete Yoga: Go from Beginner to Advanced",
        slug: "complete-yoga-beginner-advanced",
        description:
          "Master Yoga! From basics to advanced poses. Increase flexibility, strength, and mindfulness.",
        long_description:
          "Learn yoga from scratch and advance to challenging poses. Perfect for beginners and those looking to deepen their practice. Includes mindfulness and meditation techniques.",
        thumbnail_url:
          "https://img-c.udemycdn.com/course/480x270/yoga_complete.jpg",
        price: 74.99,
        discounted_price: 13.99,
        level: "all",
        language: "English",
        duration_minutes: 900, // 15 hours
        instructor_email: "max@udemy-mock.com",
        category_slug: "health-fitness",
        udemy_course_id: "udemy_8565838",
        is_from_udemy: 1,
        is_published: 1,
        avg_rating: 4.8,
        total_reviews: 35000,
        total_students: 175000,
      },
    ],
  };
}
