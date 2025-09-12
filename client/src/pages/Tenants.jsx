import { useEffect, useState } from "react";
import { API_URL, getAuthHeaders } from "../utils/api";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", monthlyRent: "", property: "" });

  const fetchTenants = async () => {
    const res = await fetch(`${API_URL}/api/tenants`, { headers: getAuthHeaders() });
    const data = await res.json();
    setTenants(data);
  };

  const fetchProperties = async () => {
    const res = await fetch(`${API_URL}/api/properties`, { headers: getAuthHeaders() });
    const data = await res.json();
    setProperties(data);
  };

  const addTenant = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/tenants`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(form),
    });
    setForm({ name: "", email: "", monthlyRent: "", property: "" });
    fetchTenants();
  };

  useEffect(() => {
    fetchTenants();
    fetchProperties();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tenants</h1>
      <form onSubmit={addTenant} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="number"
          placeholder="Monthly Rent"
          value={form.monthlyRent}
          onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })}
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
        <button type="submit">Add Tenant</button>
      </form>

      <ul>
        {tenants.map((t) => (
          <li key={t._id}>
            <strong>{t.name}</strong> ({t.email}) - Rent: ${t.monthlyRent} - Property:{" "}
            {t.property?.name || "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
}
