import { useEffect, useState } from "react";
import API from "../api";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    category: "Food",
    limit: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [error, setError] = useState("");

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await API.get("/budget");
      setBudgets(res.data);
    } catch {
      setError("Failed to load budgets");
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

    if (!form.limit || form.limit <= 0) {
      setError("Enter a positive limit");
      return;
    }

    try {
      await API.post("/budget", form);
      setForm({ ...form, limit: "" });
      fetchBudgets();
    } catch {
      setError("Failed to add budget");
    }
  };

  const updateBudget = async (id, newLimit) => {
    try {
      await API.put(`/budget/${id}`, { limit: newLimit });
      fetchBudgets();
    } catch {
      setError("Failed to update budget");
    }
  };

  const deleteBudget = async (id) => {
    try {
      await API.delete(`/budget/${id}`);
      fetchBudgets();
    } catch {
      setError("Failed to delete budget");
    }
  };

  return (
    <div className="p-6">
      <h1>Budgets</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={submit} className="mb-4">
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 m-1"
        >
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Rent">Rent</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Other">Other</option>
        </select>
        <input
          className="border p-2 m-1"
          type="number"
          step="0.01"
          placeholder="Limit"
          value={form.limit}
          onChange={(e) => setForm({ ...form, limit: e.target.value })}
          required
        />
        <input
          className="border p-2 m-1"
          type="number"
          placeholder="Month"
          value={form.month}
          onChange={(e) => setForm({ ...form, month: e.target.value })}
          min="1"
          max="12"
          required
        />
        <input
          className="border p-2 m-1"
          type="number"
          placeholder="Year"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          required
        />
        <button className="bg-blue-500 text-white p-2 m-1">Add Budget</button>
      </form>

      {loading ? (
        <p>Loading budgets...</p>
      ) : (
        <div>
          <h2>Your Budgets</h2>
          {budgets.map((b) => (
            <div key={b._id} className="border p-2 m-1">
              {b.category} - ₹{b.limit} ({b.month}/{b.year})
              <input
                className="border p-1 ml-2"
                type="number"
                step="0.01"
                placeholder="New limit"
                onBlur={(e) => updateBudget(b._id, e.target.value)}
              />
              <button
                onClick={() => deleteBudget(b._id)}
                className="bg-red-500 text-white p-2 ml-2"
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