import express from "express";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validate, transactionSchema } from "../validations/validator.js";

const router = express.Router();

// 🔐 All transaction routes are protected
router.post("/", authMiddleware, validate(transactionSchema), createTransaction);
router.get("/", authMiddleware, getTransactions);
router.put("/:id", authMiddleware, validate(transactionSchema), updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);

export default router;