import express from "express";
import {
  createIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
} from "../controllers/incomeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validate, incomeSchema } from "../validations/validator.js";

const router = express.Router();

// 🔐 Protected routes
router.post("/", authMiddleware, validate(incomeSchema), createIncome);
router.get("/", authMiddleware, getIncomes);
router.put("/:id", authMiddleware, validate(incomeSchema), updateIncome);
router.delete("/:id", authMiddleware, deleteIncome);

export default router;