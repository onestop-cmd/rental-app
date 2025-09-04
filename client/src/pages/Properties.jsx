import React, { useEffect, useState } from 'react';
import api from '../api';
export default function Properties(){
  const [list,setList]=useState([]);
  const [form,setForm]=useState({});
  useEffect(()=>{ api.get('/api/properties').then(r=>setList(r.data)).catch(console.error); },[]);
  const add = async e => {
    e.preventDefault();
    await api.post('/api/properties', form);
    const r = await api.get('/api/properties'); setList(r.data);
  }
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Properties</h1>
      <form onSubmit={add} className="mb-4 grid grid-cols-4 gap-2">
        <input onChange={e=>setForm({...form, builderName:e.target.value})} placeholder="Builder" className="p-2 border" />
        <input onChange={e=>setForm({...form, buildingNumber:e.target.value})} placeholder="Building #" className="p-2 border" />
        <input onChange={e=>setForm({...form, unitNumber:e.target.value})} placeholder="Unit #" className="p-2 border" />
        <input onChange={e=>setForm({...form, address:e.target.value})} placeholder="Address" className="p-2 border" />
        <button className="col-span-4 mt-2 bg-blue-600 text-white p-2">Add</button>
      </form>
      <div className="grid gap-2">
        {list.map(p=> <div key={p._id} className="p-3 bg-white rounded shadow">{p.builderName} — {p.address}</div>)}
      </div>
    </div>
  )
}
