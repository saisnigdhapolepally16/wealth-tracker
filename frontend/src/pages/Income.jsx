import { useEffect, useState } from "react";
import API from "../api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
    if (!incomes?.length) return;
    const rows = [["Source", "Amount", "Date", "Notes"]];
    incomes.forEach((inc) => {
      rows.push([inc.source, inc.amount, new Date(inc.date).toLocaleDateString(), inc.notes || ""]);
    });
    const csvString = rows.map((row) => row.map(toCsvValue).join(",")).join("\r\n");
    downloadFile("incomes.csv", csvString, "text/csv;charset=utf-8;");
  };

  const exportJson = () => {
    const jsonString = JSON.stringify(incomes, null, 2);
    downloadFile("incomes.json", jsonString, "application/json;charset=utf-8;");
  };

  const getIncomeChartData = () => {
    const monthMap = {};
    const sourceMap = {};

    incomes.forEach((inc) => {
      const date = new Date(inc.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthMap[monthKey] = (monthMap[monthKey] || 0) + Number(inc.amount);
      sourceMap[inc.source || "Uncategorized"] = (sourceMap[inc.source || "Uncategorized"] || 0) + Number(inc.amount);
    });

    const monthlyData = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }));

    const sourceData = Object.entries(sourceMap)
      .sort(([, a], [, b]) => b - a)
      .map(([source, amount]) => ({ source, amount }));

    return { monthlyData, sourceData };
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

  const { monthlyData, sourceData } = getIncomeChartData();

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/income");
      setIncomes(res.data);
    } catch {
      setError("Failed to load incomes");
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

    if (!form.source || !form.amount || form.amount <= 0) {
      setError("Source and positive amount required");
      return;
    }

    try {
      await API.post("/income", form);
      setForm({
        source: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        notes: "",
      });
      fetchIncomes();
    } catch {
      setError("Failed to add income");
    }
  };

  const updateIncome = async (id, updates) => {
    try {
      await API.put(`/income/${id}`, updates);
      fetchIncomes();
    } catch {
      setError("Failed to update income");
    }
  };

  const deleteIncome = async (id) => {
    try {
      await API.delete(`/income/${id}`);
      fetchIncomes();
    } catch {
      setError("Failed to delete income");
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between">
        <h1>Income Management</h1>
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
          placeholder="Source (e.g., Salary)"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
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
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <input
          className="border p-2 m-1"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button className="bg-green-500 text-white p-2 m-1">Add Income</button>
      </form>

      {loading ? (
        <p>Loading incomes...</p>
      ) : chartMode ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h2 className="text-xl font-semibold">Income Charts</h2>
            <div className="space-x-2">
              <button
                className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                onClick={() => exportChartSvg("income-month-chart", "income-month-chart.svg")}
              >
                Monthly SVG
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => exportChartPng("income-month-chart", "income-month-chart.png")}
              >
                Monthly PNG
              </button>
            </div>
          </div>

          <div id="income-month-chart" className="bg-white p-4 border rounded-lg shadow">
            <h3 className="font-medium mb-2">Income by Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#10b981" name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h2 className="text-xl font-semibold">Source Breakdown</h2>
            <div className="space-x-2">
              <button
                className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                onClick={() => exportChartSvg("income-source-chart", "income-source-chart.svg")}
              >
                Source SVG
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => exportChartPng("income-source-chart", "income-source-chart.png")}
              >
                Source PNG
              </button>
            </div>
          </div>

          <div id="income-source-chart" className="bg-white p-4 border rounded-lg shadow">
            <h3 className="font-medium mb-2">Income by Source</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#3b82f6" name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div>
          <h2>Your Incomes</h2>
          {incomes.map((inc) => (
            <div key={inc._id} className="border p-2 m-1">
              <strong>{inc.source}</strong> - ₹{inc.amount} on {new Date(inc.date).toLocaleDateString()}
              {inc.notes && <p>Notes: {inc.notes}</p>}
              <input
                className="border p-1 ml-2"
                type="number"
                step="0.01"
                placeholder="New amount (₹)"
                onBlur={(e) => updateIncome(inc._id, { amount: e.target.value })}
              />
              <button
                onClick={() => deleteIncome(inc._id)}
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