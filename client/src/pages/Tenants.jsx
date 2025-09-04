import React, { useEffect, useState } from 'react';
import api from '../api';
export default function Tenants(){
  const [list,setList]=useState([]); const [form,setForm]=useState({});
  useEffect(()=>{ api.get('/api/tenants').then(r=>setList(r.data)).catch(console.error); },[]);
  const add = async e => {
    e.preventDefault();
    await api.post('/api/tenants', form);
    const r = await api.get('/api/tenants'); setList(r.data);
  }
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Tenants</h1>
      <form onSubmit={add} className="mb-4 grid grid-cols-4 gap-2">
        <input onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" className="p-2 border" />
        <input onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" className="p-2 border" />
        <input onChange={e=>setForm({...form, phone:e.target.value})} placeholder="Phone" className="p-2 border" />
        <input onChange={e=>setForm({...form, rent:parseFloat(e.target.value)||0})} placeholder="Rent" className="p-2 border" />
        <button className="col-span-4 mt-2 bg-blue-600 text-white p-2">Add Tenant</button>
      </form>
      <div className="grid gap-2">
        {list.map(t=> <div key={t._id} className="p-3 bg-white rounded shadow">{t.name} — ${t.rent}</div>)}
      </div>
    </div>
  )
}
