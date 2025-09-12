import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    property: "",
    rent: "",
    startDate: "",
  });

  // Load tenants
  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await axios.get("/api/tenants");
      setTenants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add tenant
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/tenants", form);
      setForm({ name: "", email: "", property: "", rent: "", startDate: "" });
      fetchTenants();
    } catch (err) {
      console.error(err);
    }
  };

  // Mark rent as paid
  const markPaid = async (tenantId, month) => {
    try {
      await axios.post(`/api/tenants/${tenantId}/pay`, { month });
      fetchTenants();
    } catch (err) {
      console.error(err);
    }
  };

  // Backfill rent
  const backfill = async (tenantId, months) => {
    try {
      await axios.post(`/api/tenants/${tenantId}/backfill`, { months });
      fetchTenants();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tenants</h2>

      {/* Add Tenant Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
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
          placeholder="Property"
          value={form.property}
          onChange={(e) => setForm({ ...form, property: e.target.value })}
        />
        <input
          placeholder="Monthly Rent"
          value={form.rent}
          onChange={(e) => setForm({ ...form, rent: e.target.value })}
        />
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
        <button type="submit">Add Tenant</button>
      </form>

      {/* Tenant List */}
      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Property</th>
            <th>Rent</th>
            <th>Rent Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant._id}>
              <td>{tenant.name}</td>
              <td>{tenant.email}</td>
              <td>{tenant.property}</td>
              <td>${tenant.rent}</td>
              <td>
                {tenant.overdue?.length > 0 ? (
                  <span style={{ color: "red" }}>
                    Overdue: {tenant.overdue.join(", ")}
                  </span>
                ) : (
                  <span style={{ color: "green" }}>All Paid</span>
                )}
              </td>
              <td>
                {tenant.overdue?.map((month) => (
                  <button
                    key={month}
                    onClick={() => markPaid(tenant._id, month)}
                    style={{ marginRight: "5px" }}
                  >
                    Mark {month} Paid
                  </button>
                ))}
                <button onClick={() => backfill(tenant._id, 6)}>
                  Backfill 6 Months
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
