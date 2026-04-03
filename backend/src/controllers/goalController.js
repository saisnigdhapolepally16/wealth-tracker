import Goal from "../models/Goals.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

// CREATE
export const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;

    if (new Date(deadline) <= new Date()) {
      return sendError(res, "Deadline must be in the future", 400);
    }

    const goal = await Goal.create({
      userId: req.user,
      title,
      targetAmount,
      deadline,
    });

    sendSuccess(res, goal, "Goal created successfully", 201);
  } catch (error) {
    sendError(res, error.message || "Failed to create goal", 500);
  }
};

// GET ALL
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user }).sort({ deadline: 1 });
    sendSuccess(res, goals, "Goals retrieved successfully");
  } catch (error) {
    sendError(res, error.message || "Failed to fetch goals", 500);
  }
};

// UPDATE
export const updateGoal = async (req, res) => {
  try {
    const { savedAmount } = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { savedAmount },
      { new: true }
    );

    if (!goal) {
      return sendError(res, "Goal not found", 404);
    }

    sendSuccess(res, goal, "Goal updated successfully");
  } catch (error) {
    sendError(res, error.message || "Failed to update goal", 500);
  }
};

// DELETE
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user,
    });

    if (!goal) {
      return sendError(res, "Goal not found", 404);
    }

    sendSuccess(res, {}, "Goal deleted successfully");
  } catch (error) {
    sendError(res, error.message || "Failed to delete goal", 500);
  }
};