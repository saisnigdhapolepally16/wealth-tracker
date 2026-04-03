import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { MongoMemoryServer } from "mongodb-memory-server";

import transactionRoutes from "./routes/transactionRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();


// ======================
// SECURITY MIDDLEWARE
// ======================
app.use(helmet());

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5178",
  "http://localhost:5178",
  "http://localhost:5179",
  "http://localhost:5173",
  "http://localhost:3001"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin ${origin}`));
    }
  },
  credentials: true,
}));


// ======================
// RATE LIMITING
// ======================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests; try again later",
    });
  },
});

app.use(limiter);


// ======================
// BODY PARSER
// ======================
app.use(express.json());


// ======================
// DATABASE CONNECTION
// ======================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected (Atlas)");
    return;
  } catch (error) {
    console.error("DB Connection Failed (Atlas):", error.message);
    console.log("Attempting fallback to in-memory MongoDB...");
  }

  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected (Memory)");
  } catch (fallbackError) {
    console.error("DB Connection Failed (Memory):", fallbackError.message);
    console.log("⚠️  Server continuing without database - API calls will fail");
  }
};

connectDB();


// ======================
// ROUTES
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/analytics", analyticsRoutes);


// ======================
// HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.send("Wealth Tracker API Running");
});


// ======================
// 404 HANDLER (IMPORTANT)
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// ======================
// GLOBAL ERROR HANDLER
// ======================
app.use(errorHandler);


// ======================
// SERVER START
// ======================
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});