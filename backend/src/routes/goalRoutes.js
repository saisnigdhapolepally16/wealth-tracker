import express from "express";
import auth from "../middleware/authMiddleware.js";
import { validate, goalSchema, goalUpdateSchema } from "../validations/validator.js";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";

const router = express.Router();

router.post("/", auth, validate(goalSchema), createGoal);
router.get("/", auth, getGoals);
router.put("/:id", auth, validate(goalUpdateSchema), updateGoal);
router.delete("/:id", auth, deleteGoal);

export default router;