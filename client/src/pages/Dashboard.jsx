// client/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { API_URL, getAuthHeaders } from "../utils/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/dashboard/stats`, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then(setStats)
      .catch((err) => console.error("Error loading dashboard:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      {stats.length === 0 && <p>No properties found.</p>}

      {stats.map((s) => (
        <div
          key={s.property.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "8px",
          }}
        >
          <h2>{s.property.name}</h2>
          <p>
            <strong>Address:</strong> {s.property.address}
          </p>
          <p>
            <strong>Units:</strong> {s.property.units.join(", ")}
          </p>

          <div style={{ display: "flex", gap: "40px" }}>
            <div>
              <h3>Current Month</h3>
              <p>Rent Collected: ${s.current.rent}</p>
              <p>Expenses: ${s.current.expenses}</p>
              <p>Deposits: ${s.current.deposits}</p>
            </div>
            <div>
              <h3>Previous Month</h3>
              <p>Rent Collected: ${s.previous.rent}</p>
              <p>Expenses: ${s.previous.expenses}</p>
              <p>Deposits: ${s.previous.deposits}</p>
            </div>
          </div>

          <Link to={`/properties/${s.property.id}`}>
            <button style={{ marginTop: "10px" }}>View Details</button>
          </Link>
        </div>
      ))}
    </div>
  );
}
