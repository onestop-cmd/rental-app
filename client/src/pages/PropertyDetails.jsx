// client/src/pages/PropertyDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL, getAuthHeaders } from "../utils/api";

export default function PropertyDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/properties/${id}`, {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error loading property details:", err));
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{data.property.name}</h1>
      <p>
        <strong>Address:</strong> {data.property.address}
      </p>
      <p>
        <strong>Units:</strong> {data.property.units.join(", ")}
      </p>

      {/* Tenants */}
      <section style={{ marginTop: "20px" }}>
        <h2>Tenants</h2>
        <ul>
          {data.tenants.map((t) => (
            <li key={t._id}>
              {t.name} – Unit: {t.unit || "N/A"}
            </li>
          ))}
        </ul>
        <button onClick={() => alert("Add Tenant")}>Add Tenant</button>
      </section>

      {/* Rents */}
      <section style={{ marginTop: "20px" }}>
        <h2>Rents</h2>
        <ul>
          {data.rents.map((r) => (
            <li key={r._id}>
              Tenant: {r.tenant?.name || "Unknown"} | Amount: ${r.amount} | Due:{" "}
              {new Date(r.dueDate).toLocaleDateString()} |{" "}
              {r.paid ? (
                <span style={{ color: "green" }}>Paid</span>
              ) : (
                <button
                  onClick={() => markPaid(r._id)}
                  style={{ color: "red", marginLeft: "10px" }}
                >
                  Mark Paid
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Expenses */}
      <section style={{ marginTop: "20px" }}>
        <h2>Expenses</h2>
        <ul>
          {data.expenses.map((e) => (
            <li key={e._id}>
              {e.description} – ${e.amount} – {new Date(e.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
        <button onClick={() => alert("Add Expense")}>Add Expense</button>
      </section>

      {/* Bank Deposits */}
      <section style={{ marginTop: "20px" }}>
        <h2>Bank Deposits</h2>
        <ul>
          {data.deposits.map((d) => (
            <li key={d._id}>
              ${d.amount} – {d.depositedBy} –{" "}
              {new Date(d.depositDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
        <button onClick={() => alert("Add Deposit")}>Add Deposit</button>
      </section>
    </div>
  );

  // Mark rent as paid
  async function markPaid(rentId) {
    await fetch(`${API_URL}/api/rents/${rentId}/mark-paid`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });
    window.location.reload();
  }
}
