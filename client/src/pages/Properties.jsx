// client/src/pages/Properties.jsx
import { useEffect, useState } from "react";
import { API_URL, getAuthHeaders } from "../utils/api";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [units, setUnits] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    fetch(`${API_URL}/api/properties`, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then(setProperties)
      .catch((err) => console.error("Error fetching properties:", err));
  }, []);

  const addProperty = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          name,
          address,
          units: units.split(",").map((u) => u.trim()),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProperties([...properties, data]);
      setName("");
      setAddress("");
      setUnits("");
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      const res = await fetch(`${API_URL}/api/properties/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProperties(properties.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Properties</h1>

      <form onSubmit={addProperty} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Property Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Property Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Units (comma separated)"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
        />
        <button type="submit">Add Property</button>
      </form>

      <ul>
        {properties.map((p) => (
          <li key={p._id} style={{ marginBottom: "10px" }}>
            <strong>{p.name}</strong> - {p.address}  
            <br />
            Units: {p.units.join(", ")}
            <br />
            {user?.role === "admin" && (
              <button onClick={() => deleteProperty(p._id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
