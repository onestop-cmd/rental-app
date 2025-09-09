import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, getAuthHeaders } from "../utils/api";

export default function Dashboard() {
  const [data, setData] = useState({
    properties: [],
    tenants: [],
    expenses: [],
    rents: [],
  });
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard`, {
          headers: getAuthHeaders(),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Failed to fetch dashboard");
        setData(result);
      } catch (err) {
        console.error(err);
        logout();
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-lg font-bold mb-6">Rental Property Management</h2>
        <nav className="space-y-4">
          <a href="/" className="block text-blue-600 font-medium">
            Dashboard
          </a>
          <a href="/properties" className="block text-gray-600 hover:text-blue-600">
            Properties
          </a>
          <a href="/tenants" className="block text-gray-600 hover:text-blue-600">
            Tenants
          </a>
          <a href="/rents" className="block text-gray-600 hover:text-blue-600">
            Rent Schedule
          </a>
          <a href="/expenses" className="block text-gray-600 hover:text-blue-600">
            Expenses
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="text-red-600 font-medium hover:underline"
          >
            SignOut
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">Properties</p>
            <p className="text-2xl font-bold">{data.properties?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">Tenants</p>
            <p className="text-2xl font-bold">{data.tenants?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">Expenses</p>
            <p className="text-2xl font-bold">
              ${data.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0}
            </p>
          </div>
        </div>

        {/* Upcoming Rent */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Upcoming Rent Due</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="pb-2">Tenant</th>
                <th className="pb-2">Month</th>
                <th className="pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.rents && data.rents.length > 0 ? (
                data.rents.map((r) => (
                  <tr key={r._id} className="border-b">
                    <td className="py-2">{r.tenant?.name || "Unknown"}</td>
                    <td className="py-2">{r.month}</td>
                    <td className="py-2">${r.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-gray-500 py-4 text-center">
                    No upcoming rent found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
