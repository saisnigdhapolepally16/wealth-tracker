import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"], // Added enum
      required: true,
    },
    category: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01, // Added min
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Add index for performance
transactionSchema.index({ userId: 1 });

export default mongoose.model("Transaction", transactionSchema);