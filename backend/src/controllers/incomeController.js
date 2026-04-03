import Income from "../models/income.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

// CREATE
export const createIncome = async (req, res) => {
  try {
    const { source, amount, date, notes } = req.body;

    const income = await Income.create({
      userId: req.user,
      source,
      amount,
      date,
      notes,
    });

    sendSuccess(res, income, "Income added successfully", 201);
  } catch (error) {
    sendError(res, error.message || "Failed to create income", 500);
  }
};

// GET
export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user }).sort({ date: -1 });
    sendSuccess(res, incomes, "Incomes retrieved successfully");
  } catch (error) {
    sendError(res, error.message || "Failed to fetch incomes", 500);
  }
};

// UPDATE
export const updateIncome = async (req, res) => {
  try {
    const { source, amount, date, notes } = req.body;

    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { source, amount, date, notes },
      { new: true }
    );

    if (!income) {
      return sendError(res, "Income not found", 404);
    }

    sendSuccess(res, income, "Income updated successfully");
  } catch (error) {
    sendError(res, error.message || "Failed to update income", 500);
  }
};

// DELETE
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.user,
    });

    if (!income) {
      return sendError(res, "Income not found", 404);
    }

    sendSuccess(res, {}, "Income deleted successfully");
  } catch (error) {
    sendError(res, error.message || "Failed to delete income", 500);
  }
};