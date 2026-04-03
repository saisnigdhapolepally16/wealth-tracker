import Budget from "../models/Budget.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

// CREATE
export const createBudget = async (req, res) => {
  try {
    const { category, limit, month, year } = req.body;

    const budget = await Budget.create({
      userId: req.user,
      category,
      limit,
      month,
      year,
    });

    sendSuccess(res, budget, "Budget created successfully", 201);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, "Budget for this category in this month already exists", 400);
    }
    sendError(res, error.message || "Failed to create budget", 500);
  }
};

// GET ALL
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user }).sort({ year: -1, month: -1 });
    sendSuccess(res, budgets, "Budgets retrieved successfully");
  } catch (error) {
    sendError(res, error.message || "Failed to fetch budgets", 500);
  }
};

// GET BY MONTH
export const getBudgetByMonth = async (req, res) => {
  try {
    const { month, year } = req.params;
    const budgets = await Budget.find({
      userId: req.user,
      month: parseInt(month),
      year: parseInt(year),
    });
    sendSuccess(res, budgets, "Monthly budgets retrieved successfully");
  } catch (error) {
    sendError(res, error.message || "Failed to fetch budgets", 500);
  }
};

// UPDATE
export const updateBudget = async (req, res) => {
  try {
    const { limit } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { limit },
      { new: true }
    );

    if (!budget) {
      return sendError(res, "Budget not found", 404);
    }

    sendSuccess(res, budget, "Budget updated successfully");
  } catch (error) {
    sendError(res, error.message || "Failed to update budget", 500);
  }
};

// DELETE
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user,
    });

    if (!budget) {
      return sendError(res, "Budget not found", 404);
    }

    sendSuccess(res, {}, "Budget deleted successfully");
  } catch (error) {
    sendError(res, error.message || "Failed to delete budget", 500);
  }
};