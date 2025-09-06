import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, getAuthHeaders } from '../utils/api';

export default function Dashboard() {
  const [data, setData] = useState({
    properties: [],
    tenants: [],
    expenses: [],
    deposits: [],
  });
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard`, {
          headers: getAuthHeaders(),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to fetch dashboard');

        // Expect backend to return arrays: properties, tenants, expenses, deposits
        setData(result);
      } catch (err) {
        console.error(err);
        logout();
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <button onClick={logout} style={{ marginBottom: '20px' }}>
        Logout
      </button>

      {/* Properties */}
      <section>
        <h2>Properties</h2>
        <button onClick={() => alert('Add Property')}>Add Property</button>
        <ul>
          {data.properties.map((p) => (
            <li key={p._id}>
              {p.builderName} - {p.buildingNumber}/{p.unitNumber}, {p.address}
            </li>
          ))}
        </ul>
      </section>

      {/* Tenants */}
      <section>
        <h2>Tenants</h2>
        <button onClick={() => alert('Add Tenant')}>Add Tenant</button>
        <ul>
          {data.tenants.map((t) => (
            <li key={t._id}>
              {t.name} - Property: {t.property?.builderName || t.property}
            </li>
          ))}
        </ul>
      </section>

      {/* Expenses */}
      <section>
        <h2>Expenses</h2>
        <button onClick={() => alert('Add Expense')}>Add Expense</button>
        <ul>
          {data.expenses.map((e) => (
            <li key={e._id}>
              {e.description} - ${e.amount} - Property: {e.property?.builderName || e.property}
            </li>
          ))}
        </ul>
      </section>

      {/* Bank Deposits */}
      <section>
        <h2>Bank Deposits</h2>
        <button onClick={() => alert('Add Deposit')}>Add Deposit</button>
        <ul>
          {data.deposits.map((d) => (
            <li key={d._id}>
              ${d.amount} - Property: {d.property?.builderName || d.property} - Deposited By: {d.depositedBy}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
