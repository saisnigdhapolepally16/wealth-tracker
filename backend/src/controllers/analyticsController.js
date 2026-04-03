import Income from "../models/income.js";
import Transaction from "../models/transaction.js";
import Budget from "../models/Budget.js";
import Goal from "../models/Goals.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

export const getSummary = async (req, res) => {
  try {
    const userId = req.user;

    // Get current month/year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Total Income (from Income collection)
    const totalIncomeFromIncome = await Income.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const incomeFromIncome = totalIncomeFromIncome[0]?.total || 0;

    // Total Income from transactions
    const totalIncomeFromTransactions = await Transaction.aggregate([
      { $match: { userId, type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const incomeFromTransactions = totalIncomeFromTransactions[0]?.total || 0;

    const incomeTotal = incomeFromIncome + incomeFromTransactions;

    // Total Expenses (all time)
    const totalExpenses = await Transaction.aggregate([
      { $match: { userId, type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const expenseTotal = totalExpenses[0]?.total || 0;

    // Current Month Income
    const monthlyIncome = await Income.aggregate([
      { $match: { userId, $expr: { $and: [
        { $eq: [{ $month: "$date" }, currentMonth] },
        { $eq: [{ $year: "$date" }, currentYear] }
      ]} } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const monthlyIncomeTotal = monthlyIncome[0]?.total || 0;

    // Current Month Expenses
    const monthlyExpenses = await Transaction.aggregate([
      { $match: { userId, type: "expense", $expr: { $and: [
        { $eq: [{ $month: "$date" }, currentMonth] },
        { $eq: [{ $year: "$date" }, currentYear] }
      ]} } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const monthlyExpenseTotal = monthlyExpenses[0]?.total || 0;

    // Balance
    const balance = incomeTotal - expenseTotal;

    // Savings Rate
    const savingsRate = incomeTotal > 0 ? parseFloat(((incomeTotal - expenseTotal) / incomeTotal * 100).toFixed(2)) : 0;

    // Category Spending (current month)
    const categorySpending = await Transaction.aggregate([
      { $match: { userId, type: "expense", $expr: { $and: [
        { $eq: [{ $month: "$date" }, currentMonth] },
        { $eq: [{ $year: "$date" }, currentYear] }
      ]} } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]);

    // Get budgets for current month
    const budgets = await Budget.find({
      userId,
      month: currentMonth,
      year: currentYear
    });

    // Get goals
    const goals = await Goal.find({ userId });

    const allTimeStats = {
      totalIncome: incomeTotal,
      totalExpenses: expenseTotal,
      balance,
      savingsRate,
    };

    const monthlyStats = {
      currentMonth,
      currentYear,
      income: monthlyIncomeTotal,
      expenses: monthlyExpenseTotal,
      netCash: monthlyIncomeTotal - monthlyExpenseTotal,
      categorySpending,
    };

    const budgetInfo = budgets.map(b => ({
      category: b.category,
      limit: b.limit,
      spent: categorySpending.find(cs => cs._id === b.category)?.total || 0,
      remaining: b.limit - (categorySpending.find(cs => cs._id === b.category)?.total || 0),
    }));

    const goalInfo = goals.map(g => ({
      id: g._id,
      title: g.title,
      targetAmount: g.targetAmount,
      savedAmount: g.savedAmount,
      progress: parseFloat(((g.savedAmount / g.targetAmount) * 100).toFixed(2)),
      deadline: g.deadline,
    }));

    sendSuccess(res, {
      summary: allTimeStats,
      monthly: monthlyStats,
      budgets: budgetInfo,
      goals: goalInfo,
    }, "Analytics summary retrieved successfully");
  } catch (error) {
    console.error("Analytics error:", error);
    sendError(res, error.message || "Failed to fetch analytics", 500);
  }
};