import { useEffect, useState } from "react";
import { API_URL, getAuthHeaders } from "../utils/api";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({ description: "", amount: "", property: "" });

  const fetchExpenses = async () => {
    const res = await fetch(`${API_URL}/api/expenses`, { headers: getAuthHeaders() });
    const data = await res.json();
    setExpenses(data);
  };

  const fetchProperties = async () => {
    const res = await fetch(`${API_URL}/api/properties`, { headers: getAuthHeaders() });
    const data = await res.json();
    setProperties(data);
  };

  const addExpense = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/expenses`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(form),
    });
    setForm({ description: "", amount: "", property: "" });
    fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
    fetchProperties();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Expenses</h1>
      <form onSubmit={addExpense} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <select
          value={form.property}
          onChange={(e) => setForm({ ...form, property: e.target.value })}
        >
          <option value="">Select Property</option>
          {properties.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Expense</button>
      </form>

      <ul>
        {expenses.map((e) => (
          <li key={e._id}>
            {e.description} - ${e.amount} ({e.property?.name || "N/A"})
          </li>
        ))}
      </ul>
    </div>
  );
}
