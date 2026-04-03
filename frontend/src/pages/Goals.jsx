import { useEffect, useState } from "react";
import API from "../api";
import { handleApiError } from "../utils/errorHandler";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    savedAmount: 0,
    deadline: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/goals");
      setGoals(res.data?.data || []);
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Please enter a goal title");
      return;
    }

    if (!form.targetAmount || Number(form.targetAmount) <= 0) {
      setError("Please enter a valid target amount");
      return;
    }

    if (!form.deadline) {
      setError("Please select a deadline");
      return;
    }

    try {
      await API.post("/goals", {
        ...form,
        targetAmount: Number(form.targetAmount),
        savedAmount: Number(form.savedAmount),
      });

      setForm({
        title: "",
        targetAmount: "",
        savedAmount: 0,
        deadline: "",
      });
      setSuccess("Goal created successfully!");
      fetchGoals();
    } catch (error) {
      handleApiError(error, setError);
    }
  };

  const updateSavedAmount = async (id, additionalAmount) => {
    if (!additionalAmount || additionalAmount <= 0) return;

    try {
      setError("");
      const goal = goals.find(g => g._id === id);
      const newSavedAmount = Number(goal.savedAmount) + Number(additionalAmount);

      await API.put(`/goals/${id}`, { savedAmount: newSavedAmount });
      setSuccess("Progress updated successfully!");
      fetchGoals();
    } catch (error) {
      handleApiError(error, setError);
    }
  };

  const deleteGoal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;

    try {
      await API.delete(`/goals/${id}`);
      setSuccess("Goal deleted successfully!");
      fetchGoals();
    } catch (error) {
      handleApiError(error, setError);
    }
  };

  const getProgress = (goal) => {
    return Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
  };

  const getDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Financial Goals</h1>
          <p className="text-gray-600">Set and track your savings goals</p>
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

        {/* Add Goal Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">➕ Create New Goal</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., New Car, Vacation, Emergency Fund"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount (₹) *
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.targetAmount}
                  onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                  step="0.01"
                  min="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Savings (₹)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.savedAmount}
                  onChange={(e) => setForm({ ...form, savedAmount: e.target.value })}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date *
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition duration-200"
            >
              Create Goal
            </button>
          </form>
        </div>

        {/* Goals List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Your Goals</h2>

          {goals.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-500 text-lg">No goals set yet</p>
              <p className="text-gray-400">Create your first financial goal to start tracking your progress</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = getProgress(goal);
                const daysLeft = getDaysLeft(goal.deadline);
                const isOverdue = daysLeft < 0;
                const isCompleted = progress >= 100;

                return (
                  <div
                    key={goal._id}
                    className={`p-6 border rounded-lg ${
                      isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          <span className={`text-2xl ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                            {isCompleted ? '✅' : '🎯'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                          <p className="text-sm text-gray-500">
                            Target: ₹{Number(goal.targetAmount).toLocaleString()} •
                            Saved: ₹{Number(goal.savedAmount).toLocaleString()} •
                            Remaining: ₹{Number(goal.targetAmount - goal.savedAmount).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteGoal(goal._id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition duration-200"
                        title="Delete goal"
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-green-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Deadline and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                          {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                        </span>
                        <span className="text-gray-500 ml-2">
                          ({new Date(goal.deadline).toLocaleDateString()})
                        </span>
                      </div>

                      {!isCompleted && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            placeholder="Add ₹"
                            step="0.01"
                            min="0.01"
                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                updateSavedAmount(goal._id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                          <button
                            onClick={(e) => {
                              const input = e.target.previousElementSibling;
                              updateSavedAmount(goal._id, input.value);
                              input.value = '';
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition duration-200"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}