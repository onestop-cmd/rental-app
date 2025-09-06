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

  useEffect(() => {
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
    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={logout}>Logout</button>
      {data ? (
        <>
          <p>Total Properties: {data.totalProperties}</p>
          <p>Total Tenants: {data.totalTenants}</p>
          <p>Total Expenses: ${data.totalExpenses}</p>
          <p>Total Deposits: ${data.totalDeposits}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
