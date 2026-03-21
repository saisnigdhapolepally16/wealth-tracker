import { useEffect, useState } from "react";
import API from "../api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState("");
  const [chartMode, setChartMode] = useState(false);

  const toCsvValue = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const downloadFile = (filename, content, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    if (!expenses?.length) return;
    const rows = [["Description", "Category", "Amount", "Date"]];
    expenses.forEach((exp) => {
      rows.push([exp.description, exp.category, exp.amount, new Date(exp.date).toLocaleDateString()]);
    });
    const csvString = rows.map((row) => row.map(toCsvValue).join(",")).join("\r\n");
    downloadFile("expenses.csv", csvString, "text/csv;charset=utf-8;");
  };

  const exportJson = () => {
    const jsonString = JSON.stringify(expenses, null, 2);
    downloadFile("expenses.json", jsonString, "application/json;charset=utf-8;");
  };

  const getExpenseChartData = () => {
    const monthMap = {};
    const categoryMap = {};

    expenses.forEach((exp) => {
      const date = new Date(exp.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthMap[monthKey] = (monthMap[monthKey] || 0) + Number(exp.amount);
      categoryMap[exp.category || "Uncategorized"] = (categoryMap[exp.category || "Uncategorized"] || 0) + Number(exp.amount);
    });

    const monthlyData = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }));

    const categoryData = Object.entries(categoryMap)
      .sort(([, a], [, b]) => b - a)
      .map(([category, amount]) => ({ category, amount }));

    return { monthlyData, categoryData };
  };

  const exportChartSvg = (chartWrapperId, filename) => {
    const wrapper = document.getElementById(chartWrapperId);
    if (!wrapper) return;
    const svg = wrapper.querySelector("svg");
    if (!svg) return;
    let svgText = new XMLSerializer().serializeToString(svg);
    if (!svgText.includes("xmlns=")) {
      svgText = svgText.replace(
        /^<svg/,
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
      );
    }
    downloadFile(filename, svgText, "image/svg+xml;charset=utf-8;");
  };

  const exportChartPng = (chartWrapperId, filename) => {
    const wrapper = document.getElementById(chartWrapperId);
    if (!wrapper) return;
    const svgElem = wrapper.querySelector("svg");
    if (!svgElem) return;
    let svgText = new XMLSerializer().serializeToString(svgElem);
    if (!svgText.includes("xmlns=")) {
      svgText = svgText.replace(
        /^<svg/,
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
      );
    }

    const svgData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = svgElem.clientWidth || svgElem.getBoundingClientRect().width || 800;
      canvas.height = svgElem.clientHeight || svgElem.getBoundingClientRect().height || 400;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    img.src = svgData;
  };

  const { monthlyData, categoryData } = getExpenseChartData();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/transactions?type=expense");
      setExpenses(res.data);
    } catch {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.description || !form.amount || form.amount <= 0 || !form.category) {
      setError("Description, positive amount, and category required");
      return;
    }

    try {
      await API.post("/transactions", { ...form, type: "expense" });
      setForm({
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split('T')[0],
      });
      fetchExpenses();
    } catch {
      setError("Failed to add expense");
    }
  };

  const updateExpense = async (id, updates) => {
    try {
      await API.put(`/transactions/${id}`, updates);
      fetchExpenses();
    } catch {
      setError("Failed to update expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchExpenses();
    } catch {
      setError("Failed to delete expense");
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between">
        <h1>Expense Management</h1>
        <div className="space-x-2">
          <button
            className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
            onClick={exportCsv}
          >
            Export CSV
          </button>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={exportJson}
          >
            Export JSON
          </button>
          <button
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            onClick={() => setChartMode((prev) => !prev)}
          >
            {chartMode ? "Hide Chart" : "Chart Mode"}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={submit} className="mb-4">
        <input
          className="border p-2 m-1"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
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
          placeholder="Category (e.g., Food)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          className="border p-2 m-1"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <button className="bg-red-500 text-white p-2 m-1">Add Expense</button>
      </form>

      {loading ? (
        <p>Loading expenses...</p>
      ) : chartMode ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h2 className="text-xl font-semibold">Expenses Charts</h2>
            <div className="space-x-2">
              <button
                className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                onClick={() => exportChartSvg("expense-month-chart", "expense-month-chart.svg")}
              >
                Month SVG
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => exportChartPng("expense-month-chart", "expense-month-chart.png")}
              >
                Month PNG
              </button>
            </div>
          </div>

          <div id="expense-month-chart" className="bg-white p-4 border rounded-lg shadow">
            <h3 className="font-medium mb-2">Expenses by Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#ef4444" name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h2 className="text-xl font-semibold">Category Breakdown</h2>
            <div className="space-x-2">
              <button
                className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                onClick={() => exportChartSvg("expense-category-chart", "expense-category-chart.svg")}
              >
                Category SVG
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => exportChartPng("expense-category-chart", "expense-category-chart.png")}
              >
                Category PNG
              </button>
            </div>
          </div>

          <div id="expense-category-chart" className="bg-white p-4 border rounded-lg shadow">
            <h3 className="font-medium mb-2">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#f97316" name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div>
          <h2>Your Expenses</h2>
          {expenses.map((exp) => (
            <div key={exp._id} className="border p-2 m-1">
              <strong>{exp.description}</strong> - ₹{exp.amount} ({exp.category}) on {new Date(exp.date).toLocaleDateString()}
              <input
                className="border p-1 ml-2"
                type="number"
                step="0.01"
                placeholder="New amount (₹)"
                onBlur={(e) => updateExpense(exp._id, { amount: e.target.value })}
              />
              <button
                onClick={() => deleteExpense(exp._id)}
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