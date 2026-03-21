import Income from "../models/income.js";
import Transaction from "../models/transaction.js";

export const getSummary = async (req, res) => {
  try {
    const userId = req.user;

    // Get current month/year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Total Income (all time) from Income collection + `income` transactions
    const totalIncomeFromIncome = await Income.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const incomeFromIncome = totalIncomeFromIncome[0]?.total || 0;

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
    const savingsRate = incomeTotal > 0 ? ((incomeTotal - expenseTotal) / incomeTotal * 100).toFixed(2) : 0;

    // Category Spending (current month)
    const categorySpending = await Transaction.aggregate([
      { $match: { userId, type: "expense", $expr: { $and: [
        { $eq: [{ $month: "$date" }, currentMonth] },
        { $eq: [{ $year: "$date" }, currentYear] }
      ]} } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]);

    res.json({
      totalIncome: incomeTotal,
      incomeFromIncomeModel: incomeFromIncome,
      incomeFromTransactions: incomeFromTransactions,
      totalExpenses: expenseTotal,
      balance,
      savingsRate: parseFloat(savingsRate),
      monthlyIncome: monthlyIncomeTotal,
      monthlyExpenses: monthlyExpenseTotal,
      categorySpending
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};