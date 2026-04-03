import { useEffect, useState } from "react";
import API from "../api";
import { handleApiError } from "../utils/errorHandler";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    category: "",
    limit: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    "Food", "Travel", "Rent", "Shopping", "Bills", "Entertainment",
    "Transportation", "Healthcare", "Education", "Utilities", "Other"
  ];

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/budget");
      setBudgets(res.data?.data || []);
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.category.trim()) {
      setError("Please select a category");
      return;
    }

    if (!form.limit || Number(form.limit) <= 0) {
      setError("Please enter a valid budget limit");
      return;
    }

    try {
      await API.post("/budget", {
        ...form,
        limit: Number(form.limit),
      });

      setForm({
        category: "",
        limit: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      setSuccess("Budget added successfully!");
      fetchBudgets();
    } catch (error) {
      handleApiError(error, setError);
    }
  };

  const deleteBudget = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;

    try {
      await API.delete(`/budget/${id}`);
      setSuccess("Budget deleted successfully!");
      fetchBudgets();
    } catch (error) {
      handleApiError(error, setError);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your budgets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Budget Manager</h1>
          <p className="text-gray-600">Set spending limits for different categories</p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Add Budget Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">➕ Create New Budget</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Limit (₹) *
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.limit}
                  onChange={(e) => setForm({ ...form, limit: e.target.value })}
                  step="0.01"
                  min="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <select
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {new Date(2024, month - 1, 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  min="2020"
                  max="2030"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition duration-200"
            >
              Create Budget
            </button>
          </form>
        </div>

        {/* Budgets List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Your Budgets</h2>

          {budgets.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-500 text-lg">No budgets created yet</p>
              <p className="text-gray-400">Set spending limits to stay on track with your finances</p>
            </div>
          ) : (
            <div className="space-y-3">
              {budgets.map((budget) => (
                <div
                  key={budget._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">🎯</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{budget.category}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(2024, budget.month - 1, 1).toLocaleString('default', { month: 'long' })} {budget.year}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-blue-600">
                      ₹{Number(budget.limit).toLocaleString()}
                    </span>
                    <button
                      onClick={() => deleteBudget(budget._id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition duration-200"
                      title="Delete budget"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}