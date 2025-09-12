import { useEffect, useState } from "react";
import { API_URL, getAuthHeaders } from "../utils/api";

export default function Deposits() {
  const [deposits, setDeposits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({ depositedBy: "", amount: "", property: "", month: "" });

  const fetchDeposits = async () => {
    const res = await fetch(`${API_URL}/api/deposits`, { headers: getAuthHeaders() });
    const data = await res.json();
    setDeposits(data);
  };

  const fetchProperties = async () => {
    const res = await fetch(`${API_URL}/api/properties`, { headers: getAuthHeaders() });
    const data = await res.json();
    setProperties(data);
  };

  const addDeposit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/deposits`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(form),
    });
    setForm({ depositedBy: "", amount: "", property: "", month: "" });
    fetchDeposits();
  };

  useEffect(() => {
    fetchDeposits();
    fetchProperties();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Bank Deposits</h1>
      <form onSubmit={addDeposit} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Deposited By"
          value={form.depositedBy}
          onChange={(e) => setForm({ ...form, depositedBy: e.target.value })}
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
        <input
          type="month"
          value={form.month}
          onChange={(e) => setForm({ ...form, month: e.target.value })}
        />
        <button type="submit">Add Deposit</button>
      </form>

      <ul>
        {deposits.map((d) => (
          <li key={d._id}>
            ${d.amount} - {d.depositedBy} ({d.property?.name || "N/A"}) - Month: {d.month}
          </li>
        ))}
      </ul>
    </div>
  );
}
