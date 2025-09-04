import React, { useEffect, useState } from 'react';
import api from '../api';
export default function RentSchedule(){
  const [list,setList]=useState([]); const [form,setForm]=useState({});
  useEffect(()=>{ api.get('/api/rents').then(r=>setList(r.data)).catch(console.error); },[]);
  const add = async e => {
    e.preventDefault();
    await api.post('/api/rents', form);
    const r = await api.get('/api/rents'); setList(r.data);
  }
  const markPaid = async id => {
    await api.put(`/api/rents/${id}/mark-paid`);
    const r = await api.get('/api/rents'); setList(r.data);
  }
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Rent Schedule</h1>
      <form onSubmit={add} className="mb-4 grid grid-cols-4 gap-2">
        <input onChange={e=>setForm({...form, tenant:e.target.value})} placeholder="Tenant ID" className="p-2 border" />
        <input onChange={e=>setForm({...form, month:e.target.value})} placeholder="Month YYYY-MM" className="p-2 border" />
        <input onChange={e=>setForm({...form, amount:parseFloat(e.target.value)||0})} placeholder="Amount" className="p-2 border" />
        <button className="col-span-4 mt-2 bg-blue-600 text-white p-2">Add Rent</button>
      </form>
      <div className="grid gap-2">
        {list.map(r=> <div key={r._id} className="p-3 bg-white rounded shadow">{r.tenant?.name||r.tenant} — {r.month} — {r.status} <button onClick={()=>markPaid(r._id)} className="ml-2 text-sm text-green-700">Mark paid</button></div>)}
      </div>
    </div>
  )
}
