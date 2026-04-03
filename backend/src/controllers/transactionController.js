import * as transactionService from "../services/transactionService.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

export const createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction({
      ...req.body,
      userId: req.user,
    });

    sendSuccess(res, transaction, "Transaction created successfully", 201);
  } catch (err) {
    sendError(res, err.message || "Failed to create transaction", 500);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionService.getTransactions(
      req.user,
      req.query
    );

    sendSuccess(res, transactions, "Transactions retrieved successfully");
  } catch (err) {
    sendError(res, err.message || "Failed to fetch transactions", 500);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const updated = await transactionService.updateTransaction(
      req.params.id,
      req.user,
      req.body
    );

    sendSuccess(res, updated, "Transaction updated successfully");
  } catch (err) {
    if (err.message === "Transaction not found") {
      return sendError(res, "Transaction not found", 404);
    }
    sendError(res, err.message || "Failed to update transaction", 500);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    await transactionService.deleteTransaction(
      req.params.id,
      req.user
    );

    sendSuccess(res, {}, "Transaction deleted successfully");
  } catch (err) {
    if (err.message === "Transaction not found") {
      return sendError(res, "Transaction not found", 404);
    }
    sendError(res, err.message || "Failed to delete transaction", 500);
  }
};