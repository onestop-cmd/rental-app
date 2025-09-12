import { useEffect, useState } from "react";
import { API_URL, getAuthHeaders } from "../utils/api";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({ name: "", address: "" });

  const fetchProperties = async () => {
    const res = await fetch(`${API_URL}/api/properties`, { headers: getAuthHeaders() });
    const data = await res.json();
    setProperties(data);
  };

  const addProperty = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/properties`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(form),
    });
    setForm({ name: "", address: "" });
    fetchProperties();
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Properties</h1>
      <form onSubmit={addProperty} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <button type="submit">Add Property</button>
      </form>

      <ul>
        {properties.map((p) => (
          <li key={p._id}>
            <strong>{p.name}</strong> - {p.address}
          </li>
        ))}
      </ul>
    </div>
  );
}
