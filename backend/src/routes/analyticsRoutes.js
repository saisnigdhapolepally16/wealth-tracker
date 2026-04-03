import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getSummary } from "../controllers/analyticsController.js";

const router = express.Router();

// 🔐 Protected route
router.get("/summary", auth, getSummary);

export default router;