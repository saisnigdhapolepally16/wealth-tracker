import { useState } from "react";
import API from "../api"; // Fixed import

export default function TransactionForm({ refresh }) {
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    notes: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/transactions", form);
    refresh();
  };

  return (
    <form onSubmit={submit}>
      <select onChange={(e) => setForm({ ...form, type: e.target.value })}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input placeholder="Category" onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <input placeholder="Amount" onChange={(e) => setForm({ ...form, amount: e.target.value })} />
      <button>Add</button>
    </form>
  );
}