import { useEffect, useState } from "react";
import API from "../api";

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

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await API.get("/goals");
      setGoals(res.data);
    } catch {
      setError("Failed to load goals");
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

    if (!form.title || !form.targetAmount || form.targetAmount <= 0) {
      setError("Title and positive target amount required");
      return;
    }

    try {
      await API.post("/goals", form);
      setForm({
        title: "",
        targetAmount: "",
        savedAmount: 0,
        deadline: "",
      });
      fetchGoals();
    } catch {
      setError("Failed to add goal");
    }
  };

  const updateGoal = async (id, updates) => {
    try {
      await API.put(`/goals/${id}`, updates);
      fetchGoals();
    } catch {
      setError("Failed to update goal");
    }
  };

  const deleteGoal = async (id) => {
    try {
      await API.delete(`/goals/${id}`);
      fetchGoals();
    } catch {
      setError("Failed to delete goal");
    }
  };

  const progress = (goal) => {
    return Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
  };

  return (
    <div className="p-6">
      <h1>Financial Goals</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={submit} className="mb-4">
        <input
          className="border p-2 m-1"
          placeholder="Goal Title (e.g., Car Purchase)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="border p-2 m-1"
          type="number"
          step="0.01"
          placeholder="Target Amount (₹)"
          value={form.targetAmount}
          onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
          required
        />
        <input
          className="border p-2 m-1"
          type="number"
          step="0.01"
          placeholder="Saved Amount (₹)"
          value={form.savedAmount}
          onChange={(e) => setForm({ ...form, savedAmount: e.target.value })}
        />
        <input
          className="border p-2 m-1"
          type="date"
          placeholder="Deadline"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          required
        />
        <button className="bg-blue-500 text-white p-2 m-1">Add Goal</button>
      </form>

      {loading ? (
        <p>Loading goals...</p>
      ) : (
        <div>
          <h2>Your Goals</h2>
          {goals.map((goal) => (
            <div key={goal._id} className="border p-4 m-2">
              <h3>{goal.title}</h3>
              <p>Target: ₹{goal.targetAmount}</p>
              <p>Saved: ₹{goal.savedAmount}</p>
              <p>Progress: {progress(goal).toFixed(1)}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${progress(goal)}%` }}
                ></div>
              </div>
              {goal.deadline && <p>Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>}
              <input
                className="border p-1 ml-2 mt-2"
                type="number"
                step="0.01"
                placeholder="Add to saved amount (₹)"
                onBlur={(e) => updateGoal(goal._id, { savedAmount: parseFloat(goal.savedAmount) + parseFloat(e.target.value || 0) })}
              />
              <button
                onClick={() => deleteGoal(goal._id)}
                className="bg-red-500 text-white p-2 ml-2 mt-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}