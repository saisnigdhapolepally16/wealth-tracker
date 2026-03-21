import express from "express";
import {
  createIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
} from "../controllers/incomeController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 Protected routes
router.post("/", authMiddleware, createIncome);
router.get("/", authMiddleware, getIncomes);
router.put("/:id", authMiddleware, updateIncome);
router.delete("/:id", authMiddleware, deleteIncome);

export default router;