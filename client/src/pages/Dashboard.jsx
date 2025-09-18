import React, { useEffect, useState } from "react";
import { getAuthHeaders } from "../utils/auth";

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [currentMonthStats, setCurrentMonthStats] = useState({});
  const [previousMonthStats, setPreviousMonthStats] = useState({});
  const [overdueTenants, setOverdueTenants] = useState([]);

  // Fetch data on load
  useEffect(() => {
    fetchProperties();
    fetchDashboardStats();
    fetchOverdueTenants();
  }, []);

  // Fetch properties
  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties", {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) setProperties(data);
    } catch (err) {
      console.error("Error fetching properties", err);
    }
  };

  // Fetch stats
  const fetchDashboardStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats", {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentMonthStats(data.currentMonth || {});
        setPreviousMonthStats(data.previousMonth || {});
      }
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  // Fetch overdue tenants
  const fetchOverdueTenants = async () => {
    try {
      const res = await fetch("/api/tenants/overdue", {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) setOverdueTenants(data);
    } catch (err) {
      console.error("Error fetching overdue tenants", err);
    }
  };

  // Mark overdue rent as paid
  const markAsPaid = async (rentId) => {
    try {
      const res = await fetch(`/api/rents/${rentId}/mark-paid`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        fetchOverdueTenants();
        fetchDashboardStats();
      }
    } catch (err) {
      console.error("Error marking rent as paid", err);
    }
  };

  // Add new property
  const addProperty = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newProperty = {
      builderName: form.builderName.value,
      buildingNumber: form.buildingNumber.value,
      unitNumber: form.unitNumber.value,
      address: form.address.value,
    };
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(newProperty),
      });
      const data = await res.json();
      if (res.ok) {
        setProperties((prev) => [data, ...prev]);
        form.reset();
      } else {
        alert(data.message || "Failed to add property");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding property");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      {/* Current Month Stats */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Current Month</h2>
        <div style={{ display: "flex", gap: "20px" }}>
          <div className="card">Rent Collected: ${currentMonthStats.rent || 0}</div>
          <div className="card">Expenses: ${currentMonthStats.expenses || 0}</div>
          <div className="card">Bank Deposits: ${currentMonthStats.deposits || 0}</div>
        </div>
      </section>

      {/* Previous Month Stats */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Previous Month</h2>
        <div style={{ display: "flex", gap: "20px" }}>
          <div className="card">Rent Collected: ${previousMonthStats.rent || 0}</div>
          <div className="card">Expenses: ${previousMonthStats.expenses || 0}</div>
          <div className="card">Bank Deposits: ${previousMonthStats.deposits || 0}</div>
        </div>
      </section>

      {/* Properties */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Properties</h2>

        {/* Add Property Form */}
        <form onSubmit={addProperty} style={{ marginBottom: "20px" }}>
          <input name="builderName" placeholder="Builder Name" required />
          <input name="buildingNumber" placeholder="Building #" required />
          <input name="unitNumber" placeholder="Unit #" required />
          <input name="address" placeholder="Address" required />
          <button type="submit">Add Property</button>
        </form>

        {/* Properties List */}
        <ul>
          {properties.map((p) => (
            <li key={p._id}>
              <strong>{p.builderName}</strong> - {p.buildingNumber}/{p.unitNumber},{" "}
              {p.address}
            </li>
          ))}
        </ul>
      </section>

      {/* Overdue Tenants */}
      <section>
        <h2>Overdue Tenants</h2>
        {overdueTenants.length === 0 ? (
          <p>No overdue tenants 🎉</p>
        ) : (
          <ul>
            {overdueTenants.map((t) => (
              <li key={t._id}>
                {t.name} - {t.unit} (${t.rentDue}){" "}
                <button onClick={() => markAsPaid(t.rentId)}>Mark as Paid</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
