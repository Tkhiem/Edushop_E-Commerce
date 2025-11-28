import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
      default: "https://via.placeholder.com/640x360?text=Course+Image",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: function () {
        return this.price;
      },
    },
    discountedPrice: {
      type: Number,
      default: function () {
        return this.price;
      },
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      default: "Uncategorized",
    },
    instructor: {
      type: String,
      required: [true, "Instructor is required"],
      default: "Unknown Instructor",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    students: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: String,
      enum: {
        values: ["beginner", "intermediate", "advanced", "all levels"],
        message: "{VALUE} is not a valid level",
      },
      default: "all levels",
      lowercase: true,
    },
    language: {
      type: String,
      default: "English",
    },
    duration: {
      type: Number,
      default: 0,
    },
    lectures: {
      type: Number,
      default: 0,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    udemy_id: {
      type: String,
      sparse: true,
      unique: true,
    },
    url: String,
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true, // ✅ Suppress isNew warning
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
courseSchema.index({ title: 1 });
courseSchema.index({ description: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ rating: -1 });
courseSchema.index({ price: 1 });

const Course = mongoose.model("Course", courseSchema);

export default Course;
