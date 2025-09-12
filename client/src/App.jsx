import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Tenants from "./pages/Tenants";
import Expenses from "./pages/Expenses";
import Deposits from "./pages/Deposits";
import Login from "./pages/Login";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", background: "#f5f5f5", marginBottom: "20px" }}>
      <Link to="/" style={{ marginRight: "15px" }}>Dashboard</Link>
      <Link to="/properties" style={{ marginRight: "15px" }}>Properties</Link>
      <Link to="/tenants" style={{ marginRight: "15px" }}>Tenants</Link>
      <Link to="/expenses" style={{ marginRight: "15px" }}>Expenses</Link>
      <Link to="/deposits" style={{ marginRight: "15px" }}>Bank Deposits</Link>
      <button onClick={logout} style={{ marginLeft: "20px" }}>Logout</button>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <div>
              <Navbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/tenants" element={<Tenants />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/deposits" element={<Deposits />} />
                <Route path="*" element={<div>Page Not Found</div>} />
              </Routes>
            </div>
          }
        />
      </Routes>
    </>
  );
}
