import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"], // Added validation
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Added min length
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);