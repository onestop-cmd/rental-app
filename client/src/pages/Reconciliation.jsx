import React, { useEffect, useState } from 'react';
import api from '../api';
export default function Reconciliation(){
  const [month,setMonth]=useState(new Date().toISOString().slice(0,7));
  const [data,setData]=useState(null);
  const run = async () => {
    const r = await api.get(`/api/reconciliation/${month}`);
    setData(r.data);
  }
  useEffect(()=>{ run(); },[]);
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Reconciliation</h1>
      <div className="mb-4">
        <input value={month} onChange={e=>setMonth(e.target.value)} className="p-2 border" />
        <button onClick={run} className="ml-2 p-2 bg-blue-600 text-white">Run</button>
      </div>
      {data && <div className="bg-white p-4 rounded shadow">
        <div>Month: {data.month}</div>
        <div>Rent Collected: ${data.rentCollected}</div>
        <div>Expenses: ${data.expenseTotal}</div>
        <div>Deposits: ${data.depositTotal}</div>
        <div>Net: ${data.net}</div>
        <div>Difference (deposits - rent): ${data.diff}</div>
      </div>}
    </div>
  )
}
