import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ChartDataLabels);

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const API_URL = "http://127.0.0.1:8000"; // Backend URL

function App() {
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState("");
  const [entryType, setEntryType] = useState(""); // "Income" or "Expense"
  const [category, setCategory] = useState(""); // Wants, Needs, Savings for Expense
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [insights, setInsights] = useState({});

  // Fetch entries from backend
  const fetchEntries = async () => {
    const res = await axios.get(`${API_URL}/entries/`, { params: { month } });
    setEntries(res.data);
  };

  // Fetch insights from backend
  const fetchInsights = async () => {
    try {
      const res = await axios.get(`${API_URL}/insights/${month}`);
      setInsights(res.data);
    } catch (err) {
      console.error("Error fetching insights:", err);
    }
  };

  // Add entry to backend
  const handleAdd = async () => {
    if (!date || !entryType || !amount) {
      alert("Please fill in all required fields.");
      return;
    }

    if (entryType === "Expense" && !category) {
      alert("Please select a category for the expense.");
      return;
    }

    try {
      await axios.post(`${API_URL}/entries/`, {
        date,
        entry_type: entryType,
        type: entryType === "Expense" ? category : null,
        amount: parseFloat(amount),
        description
      });
      resetForm();
      fetchEntries();
      fetchInsights();
    } catch (err) {
      alert(err.response?.data?.detail || "Error adding entry");
    }
  };

  // Delete entry by UUID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/entries/${id}`);
      fetchEntries();
      fetchInsights();
    } catch (err) {
      alert("Error deleting entry");
    }
  };

  // Reset input fields
  const resetForm = () => {
    setDate("");
    setEntryType("");
    setCategory("");
    setAmount("");
    setDescription("");
  };

  useEffect(() => {
    fetchEntries();
    fetchInsights();
  }, [month]);

  // Chart data
  const pieData = {
  labels: ["Wants", "Needs", "Savings"],
  datasets: [
    {
      data: [
        Number(insights.wants) || 0,
        Number(insights.needs) || 0,
        Number(insights.savings) || 0
        ],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
      }
    ]
  };

  const pieOptions = {
  plugins: {
    datalabels: {
      color: "#fff",
      font: { weight: "bold", size: 14 },
      formatter: (value) => value.toLocaleString()
      }
    }
  };

  const barData = {
  labels: ["Income", "Expense"],
  datasets: [
    {
      label: "Amount",
      data: [
        Number(insights.total_income) || 0,
        Number(insights.total_expense) || 0
        ],
      backgroundColor: ["#4CAF50", "#F44336"]
      }
    ]
  };

  const barOptions = {
  plugins: {
    datalabels: {
      anchor: "end",
      align: "top",
      color: "#000",
      font: { weight: "bold", size: 14 },
      formatter: (value) => value.toLocaleString()
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Expense Tracker</h1>

      {/* Month Selector */}
      <label>Select Month: </label>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      {/* Entry Form */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select value={entryType} onChange={(e) => setEntryType(e.target.value)}>
          <option value="">Select Type</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        {entryType === "Expense" && (
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="Wants">Wants</option>
            <option value="Needs">Needs</option>
            <option value="Savings">Savings</option>
          </select>
        )}

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={handleAdd}>Add</button>
      </div>

      {/* Table of Entries */}
      <h2 style={{ marginTop: "30px" }}>Entries</h2>
      <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {entries.length > 0 ? (
            entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.date}</td>
                <td>{entry.entry_type}</td>
                <td>{entry.type || "-"}</td>
                <td>{entry.amount}</td>
                <td>{entry.description || "-"}</td>
                <td>
                  <button onClick={() => handleDelete(entry.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No entries for this month
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Charts */}
      <div style={{ display: "flex", marginTop: "30px", gap: "40px" }}>
        <div>
          <h3>Category Breakdown</h3>
          <Pie data={pieData} options={pieOptions} />
        </div>
        <div>
          <h3>Income vs Expense</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}

export default App;
