import { useEffect, useState } from "react";
import API from "../api";
import { handleApiError } from "../utils/errorHandler";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    const errors = {};

    if (!form.category.trim()) {
      errors.category = "Please enter a category";
    }

    if (!form.amount || Number(form.amount) <= 0) {
      errors.amount = "Please enter a valid amount";
    }

    return errors;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/transactions");
      setTransactions(res.data.data || res.data);
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/transactions", {
        ...form,
        amount: Number(form.amount),
      });

      setForm({ type: "expense", category: "", amount: "", notes: "" });
      setSuccess("Transaction added successfully!");
      fetchData();
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTx = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await API.delete(`/transactions/${id}`);
      setSuccess("Transaction deleted successfully!");
      fetchData();
    } catch (error) {
      handleApiError(error, setError);
    }
  };

  const totalIncome = transactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpenses = transactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const balance = totalIncome - totalExpenses;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💳 Transaction Manager</h1>
          <p className="text-gray-600">Track your income and expenses easily</p>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 border border-green-400 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
          </div>

          <div className="bg-red-100 border border-red-400 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-800">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p>
          </div>

          <div className={`border rounded-lg p-4 ${balance >= 0 ? 'bg-blue-100 border-blue-400' : 'bg-red-100 border-red-400'}`}>
            <h3 className={`text-lg font-semibold ${balance >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
              Net Balance
            </h3>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              ₹{balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Add Transaction Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">➕ Add New Transaction</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="expense">💸 Expense</option>
                  <option value="income">💰 Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Food, Transport, Salary"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  step="0.01"
                  min="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Additional details..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition duration-200 disabled:bg-blue-400"
            >
              {submitting ? "Adding..." : "Add Transaction"}
            </button>
          </form>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Recent Transactions</h2>

          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">No transactions yet</p>
              <p className="text-gray-400">Add your first transaction above to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Notes</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.slice(0, 10).map((tx) => (
                    <tr key={tx._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tx.type === "income"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {tx.type === "income" ? "💰 Income" : "💸 Expense"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{tx.category}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        ₹{Number(tx.amount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{tx.notes || "-"}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteTx(tx._id)}
                          className="text-red-500 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition duration-200 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {transactions.length > 10 && (
                <div className="text-center mt-4">
                  <p className="text-gray-500">Showing 10 most recent transactions</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}