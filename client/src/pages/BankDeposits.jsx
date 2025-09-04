import React, { useEffect, useState } from 'react';
import api from '../api';
export default function BankDeposits(){
  const [list,setList]=useState([]); const [form,setForm]=useState({});
  useEffect(()=>{ api.get('/api/bank-deposits').then(r=>setList(r.data)).catch(console.error); },[]);
  const add = async e => {
    e.preventDefault();
    await api.post('/api/bank-deposits', form);
    const r = await api.get('/api/bank-deposits'); setList(r.data);
  }
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Bank Deposits</h1>
      <form onSubmit={add} className="mb-4 grid grid-cols-4 gap-2">
        <input onChange={e=>setForm({...form, property:e.target.value})} placeholder="Property ID" className="p-2 border" />
        <input onChange={e=>setForm({...form, depositedBy:e.target.value})} placeholder="Deposited By (User ID)" className="p-2 border" />
        <input onChange={e=>setForm({...form, depositMonth:e.target.value})} placeholder="YYYY-MM" className="p-2 border" />
        <input onChange={e=>setForm({...form, amount:parseFloat(e.target.value)||0})} placeholder="Amount" className="p-2 border" />
        <button className="col-span-4 mt-2 bg-blue-600 text-white p-2">Add Deposit</button>
      </form>
      <div className="grid gap-2">
        {list.map(d=> <div key={d._id} className="p-3 bg-white rounded shadow">{d.description || 'Deposit'} — ${d.amount}</div>)}
      </div>
    </div>
  )
}
