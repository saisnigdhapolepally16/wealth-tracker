import { useEffect, useState } from "react";
import API from "../api";
import { handleApiError } from "../utils/errorHandler";

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    source: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/income");
      setIncomes(res.data.data || res.data);
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.source.trim()) {
      setError("Please enter income source");
      return;
    }

    if (!form.amount || form.amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      await API.post("/income", {
        ...form,
        amount: Number(form.amount),
      });

      setForm({
        source: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        notes: "",
      });
      setSuccess("Income added successfully!");
      fetchIncomes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add income");
    }
  };

  const deleteIncome = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;

    try {
      await API.delete(`/income/${id}`);
      setSuccess("Income deleted successfully!");
      fetchIncomes();
    } catch (error) {
      handleApiError(error, setError);
    }
  };

  const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.amount), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your income data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💰 Income Tracker</h1>
          <p className="text-gray-600">Track all your income sources and amounts</p>
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

        {/* Total Income Summary */}
        <div className="bg-green-100 border border-green-400 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-green-800">Total Income</h2>
          <p className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
        </div>

        {/* Add Income Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">➕ Add New Income</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Income Source *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Salary, Freelance, Business"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
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
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition duration-200"
            >
              Add Income
            </button>
          </form>
        </div>

        {/* Income List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Your Income Records</h2>

          {incomes.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💸</div>
              <p className="text-gray-500 text-lg">No income records yet</p>
              <p className="text-gray-400">Add your first income above to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomes.map((income) => (
                <div
                  key={income._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">₹</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{income.source}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(income.date).toLocaleDateString()}
                          {income.notes && ` • ${income.notes}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-green-600">
                      ₹{Number(income.amount).toLocaleString()}
                    </span>
                    <button
                      onClick={() => deleteIncome(income._id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition duration-200"
                      title="Delete income"
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