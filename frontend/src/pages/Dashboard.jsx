import { useEffect, useState } from "react";
import API from "../api";

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch {
      setError("Failed to load transactions");
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

    if (!form.category.trim() || !form.amount || form.amount <= 0) {
      setError("Category and positive amount required");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/transactions", {
        ...form,
        amount: Number(form.amount),
      });

      setForm({ type: "expense", category: "", amount: "", notes: "" });
      fetchData();
    } catch {
      setError("Failed to add transaction");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTx = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchData();
    } catch {
      setError("Failed to delete transaction");
    }
  };

  return (
    <div className="p-6">
      <h1>Dashboard</h1>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        className="bg-red-500 text-white p-2 mb-4"
      >
        Logout
      </button>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={submit} className="mb-4">
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border p-2 m-1"
          required
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          className="border p-2 m-1"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          className="border p-2 m-1"
          type="number"
          step="0.01"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          className="border p-2 m-1"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button
          className="bg-blue-500 text-white p-2 m-1"
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add Transaction"}
        </button>
      </form>

      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <div>
          <h2>Transactions</h2>
          {transactions.map((t) => (
            <div key={t._id} className="border p-2 m-1">
              {t.type} - {t.category} - ₹{t.amount} - {t.notes}
              <button
                onClick={() => deleteTx(t._id)}
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