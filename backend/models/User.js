import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar_url: {
      type: String,
      default:
        "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff",
    },
    bio: String,
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    owned_courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    udemy_instructor_id: String,
  },
  {
    timestamps: true,
  }
);

// ✅ Export với tên 'User'
const User = mongoose.model("User", userSchema);
export default User;
