import Transaction from "../models/transaction.js";
import { NotFoundError } from "../utils/errors.js";

export const createTransaction = async (data) => {
  return await Transaction.create(data);
};

export const getTransactions = async (userId, filters) => {
  const query = { userId };

  if (filters.type) query.type = filters.type;

  let q = Transaction.find(query).sort({ date: -1 });

  if (filters.limit) {
    q = q.limit(Number(filters.limit));
  }

  return await q;
};

export const updateTransaction = async (id, userId, data) => {
  const updated = await Transaction.findOneAndUpdate(
    { _id: id, userId },
    data,
    { new: true }
  );

  if (!updated) {
    throw new NotFoundError("Transaction not found");
  }

  return updated;
};

export const deleteTransaction = async (id, userId) => {
  const deleted = await Transaction.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!deleted) {
    throw new NotFoundError("Transaction not found");
  }

  return deleted;
};