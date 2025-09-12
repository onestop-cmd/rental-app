import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState({
    properties: [],
    tenants: [],
    expenses: [],
    deposits: [],
    totals: { rent: 0, expenses: 0, deposits: 0 },
    overdueTenants: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("/api/dashboard");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markPaid = async (tenantId, month) => {
    try {
      await axios.post(`/api/tenants/${tenantId}/pay`, { month });
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      {/* Monthly Totals */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div
          style={{
            flex: 1,
            background: "#e0ffe0",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Total Rent Collected</h3>
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
            ${data.totals.rent}
          </p>
        </div>
        <div
          style={{
            flex: 1,
            background: "#ffe0e0",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Total Expenses</h3>
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
            ${data.totals.expenses}
          </p>
        </div>
        <div
          style={{
            flex: 1,
            background: "#e0e0ff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Total Bank Deposits</h3>
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
            ${data.totals.deposits}
          </p>
        </div>
      </div>

      {/* Overdue Tenants */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Overdue Tenants</h2>
        {data.overdueTenants.length === 0 ? (
          <p style={{ color: "green" }}>✅ No overdue tenants</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "15px",
            }}
          >
            {data.overdueTenants.map((tenant) => (
              <div
                key={tenant._id}
                style={{
                  border: "1px solid red",
                  padding: "15px",
                  borderRadius: "8px",
                  background: "#ffe5e5",
                }}
              >
                <h4>{tenant.name}</h4>
                <p>
                  Property: <b>{tenant.property}</b>
                </p>
                <p style={{ color: "red" }}>
                  Overdue: {tenant.overdue.join(", ")}
                </p>
                {tenant.overdue.map((month) => (
                  <button
                    key={month}
                    onClick={() => markPaid(tenant._id, month)}
                    style={{
                      marginTop: "5px",
                      padding: "5px 10px",
                      background: "white",
                      border: "1px solid red",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Mark {month} Paid
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Properties */}
      <section>
        <h2>Properties</h2>
        <ul>
          {data.properties.map((p) => (
            <li key={p._id}>
              {p.builderName} - {p.buildingNumber}/{p.unitNumber}, {p.address}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
