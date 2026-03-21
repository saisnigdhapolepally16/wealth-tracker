import { useEffect, useState } from "react";
import API from "../api";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCooldown, setRetryCooldown] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [analyticsRes, budgetsRes, goalsRes, transactionsRes] = await Promise.all([
        API.get("/analytics/summary"),
        API.get("/budget"),
        API.get("/goals"),
        API.get("/transactions?limit=5")
      ]);

      setAnalytics(analyticsRes.data);
      setBudgets(budgetsRes.data);
      setGoals(goalsRes.data);
      setRecentTransactions(transactionsRes.data);
    } catch (err) {
      const detail = err.response?.data?.message || err.message || "Failed to load analytics data";
      setError(`Failed to load analytics data: ${detail}`);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      if (err.response?.status === 429) {
        setRetryCooldown(30); // 30-second backoff
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (retryCooldown > 0) return;
    if (!loading) fetchData();
  };

  const toCsvValue = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const handleExportCsv = () => {
    if (!analytics) return;

    const rows = [];

    rows.push(["Section", "Name", "Value"]);
    rows.push(["Summary", "Total Income", analytics.totalIncome || 0]);
    rows.push(["Summary", "Monthly Income", analytics.monthlyIncome || 0]);
    rows.push(["Summary", "Income (model)", analytics.incomeFromIncomeModel || 0]);
    rows.push(["Summary", "Income (transactions)", analytics.incomeFromTransactions || 0]);
    rows.push(["Summary", "Total Expenses", analytics.totalExpenses || 0]);
    rows.push(["Summary", "Monthly Expenses", analytics.monthlyExpenses || 0]);
    rows.push(["Summary", "Balance", analytics.balance || 0]);
    rows.push(["Summary", "Savings Rate", `${analytics.savingsRate || 0}%`]);

    if (analytics.categorySpending?.length) {
      rows.push(["", "", ""]);
      rows.push(["Category Spending", "Category", "Amount"]);
      analytics.categorySpending.forEach((cat) => {
        rows.push(["Category Spending", cat._id, cat.total]);
      });
    }

    if (budgets.length) {
      rows.push(["", "", ""]);
      rows.push(["Budgets", "Category", "Limit"]);
      budgets.forEach((budget) => {
        rows.push(["Budgets", budget.category, budget.limit]);
      });
    }

    if (goals.length) {
      rows.push(["", "", ""]);
      rows.push(["Goals", "Title", "Progress"]);
      goals.forEach((goal) => {
        rows.push(["Goals", goal.title, `${goal.savedAmount} / ${goal.targetAmount}`]);
      });
    }

    if (recentTransactions.length) {
      rows.push(["", "", ""]);
      rows.push(["Recent Transactions", "Date", "Type","Category","Description","Amount"]);
      recentTransactions.forEach((tx) => {
        rows.push(["Recent Transactions", new Date(tx.date).toLocaleDateString(), tx.type, tx.category || "", tx.description || "", tx.amount]);
      });
    }

    const csvContent = rows
      .map((row) => row.map(toCsvValue).join(","))
      .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "wealth-tracker-analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!retryCooldown) return;

    const timer = setInterval(() => {
      setRetryCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [retryCooldown]);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading your financial overview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={handleRetry}
            disabled={loading || retryCooldown > 0}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Retrying..." : retryCooldown > 0 ? `Wait ${retryCooldown}s` : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Financial Analytics Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-green-800">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">₹{analytics?.totalIncome?.toLocaleString() || 0}</p>
          <p className="text-sm text-green-600">This Month: ₹{analytics?.monthlyIncome?.toLocaleString() || 0}</p>
          <p className="text-xs text-green-700 mt-1">Income model: ₹{analytics?.incomeFromIncomeModel?.toLocaleString() || 0}</p>
          <p className="text-xs text-green-700">Income transactions: ₹{analytics?.incomeFromTransactions?.toLocaleString() || 0}</p>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-red-800">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">₹{analytics?.totalExpenses?.toLocaleString() || 0}</p>
          <p className="text-sm text-red-600">This Month: ₹{analytics?.monthlyExpenses?.toLocaleString() || 0}</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-800">Net Balance</h3>
          <p className={`text-3xl font-bold ${analytics?.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ₹{analytics?.balance?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-blue-600">Savings Rate: {analytics?.savingsRate || 0}%</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-purple-800">Active Goals</h3>
          <p className="text-3xl font-bold text-purple-600">{goals.length}</p>
          <p className="text-sm text-purple-600">Budgets: {budgets.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending by Category */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">This Month's Spending</h2>
          {analytics?.categorySpending?.length > 0 ? (
            <div className="space-y-3">
              {analytics.categorySpending.map((category, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{category._id}</span>
                  <span className="font-bold text-red-600">₹{category.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No expenses this month</p>
          )}
        </div>

        {/* Budget Progress */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Budget Progress</h2>
          {budgets.length > 0 ? (
            <div className="space-y-4">
              {budgets.map((budget) => {
                const spent = analytics?.categorySpending?.find(cat => cat._id === budget.category)?.total || 0;
                const progress = (spent / budget.limit) * 100;
                const isOverBudget = progress > 100;

                return (
                  <div key={budget._id}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{budget.category}</span>
                      <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {progress.toFixed(1)}% used
                      {isOverBudget && ` (₹{(spent - budget.limit).toLocaleString()} over budget)`}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No budgets set</p>
          )}
        </div>

        {/* Goal Progress */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Goal Progress</h2>
          {goals.length > 0 ? (
            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = (goal.savedAmount / goal.targetAmount) * 100;

                return (
                  <div key={goal._id}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{goal.title}</span>
                      <span className="font-bold text-blue-600">
                        ₹{goal.savedAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {progress.toFixed(1)}% complete
                      {goal.deadline && ` • Due: ${new Date(goal.deadline).toLocaleDateString()}`}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No goals set</p>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{transaction.description || transaction.category}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.type} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No transactions yet</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => window.location.href = '/income'}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Add Income
          </button>
          <button
            onClick={() => window.location.href = '/expenses'}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Add Expense
          </button>
          <button
            onClick={() => window.location.href = '/budgets'}
            className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
          >
            Set Budget
          </button>
          <button
            onClick={() => window.location.href = '/goals'}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Add Goal
          </button>
          <button
            onClick={handleExportCsv}
            className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}