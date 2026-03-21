import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createBudget,
  getBudgets,
  getBudgetByMonth,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController.js";

const router = express.Router();

router.post("/", auth, createBudget);
router.get("/", auth, getBudgets);
router.get("/:month/:year", auth, getBudgetByMonth);
router.put("/:id", auth, updateBudget);
router.delete("/:id", auth, deleteBudget);

export default router;