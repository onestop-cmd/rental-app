import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, getAuthHeaders } from '../utils/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/dashboard`, {
        headers: getAuthHeaders(),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to fetch dashboard');
      setData(result);
    } catch (err) {
      console.error(err);
      logout();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <button onClick={logout} style={{ marginBottom: '20px' }}>Logout</button>

      <section>
        <h2>Overview</h2>
        <p>Total Properties: {data.totalProperties}</p>
        <p>Total Tenants: {data.totalTenants}</p>
        <p>Total Expenses: {data.totalExpenses}</p>
        <p>Total Deposits: {data.totalDeposits}</p>
        <h3>Monthly Totals</h3>
        <p>Rent Collected: ${data.monthlyTotals.rentCollected}</p>
        <p>Expenses: ${data.monthlyTotals.monthlyExpenses}</p>
        <p>Deposits: ${data.monthlyTotals.monthlyDeposits}</p>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2>Overdue Tenants</h2>
        {data.overdueTenants.length > 0 ? (
          <ul>
            {data.overdueTenants.map((t) => (
              <li key={t._id} style={{ marginBottom: '10px' }}>
                {t.name} – {t.propertyName} – Rent Due: ${t.monthlyRent} for {t.overdueMonths.join(', ')}
                <button
                  onClick={async () => {
                    await fetch(`${API_URL}/api/rents/${t._id}/mark-paid`, {
                      method: "POST",
                      headers: getAuthHeaders(),
                    });
                    fetchData();
                  }}
                  style={{ marginLeft: '10px', padding: '4px 8px', backgroundColor: 'green', color: 'white' }}
                >
                  Mark Paid
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No overdue tenants 🎉</p>
        )}
      </section>
    </div>
  );
}
