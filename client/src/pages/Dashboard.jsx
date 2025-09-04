import React, { useEffect, useState } from 'react';
import api from '../api';
export default function Dashboard(){
  const [data,setData]=useState({});
  useEffect(()=>{ api.get('/api/dashboard').then(r=>setData(r.data)).catch(console.error); },[]);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">Properties<br/><strong>{data.properties||0}</strong></div>
        <div className="p-4 bg-white rounded shadow">Tenants<br/><strong>{data.tenants||0}</strong></div>
        <div className="p-4 bg-white rounded shadow">Expenses<br/><strong>{data.expenses||0}</strong></div>
        <div className="p-4 bg-white rounded shadow">Deposits<br/><strong>{data.deposits||0}</strong></div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Upcoming Rent Due</h3>
        <p>Use Rent Schedule page to view and mark paid/unpaid.</p>
      </div>
    </div>
  )
}
