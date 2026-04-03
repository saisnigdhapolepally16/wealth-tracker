import { useEffect, useState } from "react";
import API from "../api";
import { handleApiError } from "../utils/errorHandler";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const results = await Promise.allSettled([
        API.get("/analytics/summary"),
        API.get("/budget"),
        API.get("/goals"),
        API.get("/transactions?limit=5")
      ]);

      const [analyticsRes, budgetsRes, goalsRes, transactionsRes] = results.map(result =>
        result.status === 'fulfilled' ? result.value : { data: result.status === 'rejected' && result.reason.response?.status === 404 ? [] : null }
      );

      setAnalytics(analyticsRes?.data || null);
      setBudgets(budgetsRes?.data || []);
      setGoals(goalsRes?.data || []);
      setRecentTransactions(transactionsRes?.data || []);
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Financial Analytics</h1>
          <p className="text-gray-600">Overview of your financial health</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-100 border border-green-400 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">
              ₹{(analytics?.totalIncome || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-red-100 border border-red-400 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-800">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">
              ₹{(analytics?.totalExpenses || 0).toLocaleString()}
            </p>
          </div>

          <div className={`border rounded-lg p-4 ${analytics?.balance >= 0 ? 'bg-blue-100 border-blue-400' : 'bg-red-100 border-red-400'}`}>
            <h3 className={`text-lg font-semibold ${analytics?.balance >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
              Net Balance
            </h3>
            <p className={`text-2xl font-bold ${analytics?.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              ₹{(analytics?.balance || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-purple-100 border border-purple-400 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-800">Active Items</h3>
            <p className="text-lg font-bold text-purple-600">
              {budgets.length} Budgets, {goals.length} Goals
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🕒 Recent Transactions</h2>
            {recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
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

          {/* Budgets Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Budget Overview</h2>
            {budgets.length > 0 ? (
              <div className="space-y-3">
                {budgets.slice(0, 3).map((budget) => (
                  <div key={budget._id} className="flex justify-between items-center">
                    <span className="font-medium">{budget.category}</span>
                    <span className="text-blue-600 font-bold">₹{budget.limit.toLocaleString()}</span>
                  </div>
                ))}
                {budgets.length > 3 && (
                  <p className="text-sm text-gray-500">+{budgets.length - 3} more budgets</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No budgets set</p>
            )}
          </div>
        </div>

        {/* Goals Overview */}
        {goals.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Goals Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.slice(0, 4).map((goal) => {
                const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
                return (
                  <div key={goal._id} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{goal.title}</h3>
                    <p className="text-sm text-gray-600">
                      ₹{goal.savedAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% complete</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">⚡ Quick Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.location.href = '/income'}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200 font-medium"
            >
              ➕ Add Income
            </button>
            <button
              onClick={() => window.location.href = '/expenses'}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-200 font-medium"
            >
              ➕ Add Expense
            </button>
            <button
              onClick={() => window.location.href = '/budgets'}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
            >
              🎯 Set Budget
            </button>
            <button
              onClick={() => window.location.href = '/goals'}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200 font-medium"
            >
              🎯 Add Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}