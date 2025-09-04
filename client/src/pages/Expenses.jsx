import React, { useEffect, useState } from 'react';
import api from '../api';
export default function Expenses(){
  const [list,setList]=useState([]); const [form,setForm]=useState({});
  useEffect(()=>{ api.get('/api/expenses').then(r=>setList(r.data)).catch(console.error); },[]);
  const add = async e => {
    e.preventDefault();
    await api.post('/api/expenses', form);
    const r = await api.get('/api/expenses'); setList(r.data);
  }
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Expenses</h1>
      <form onSubmit={add} className="mb-4 grid grid-cols-3 gap-2">
        <input onChange={e=>setForm({...form, description:e.target.value})} placeholder="Description" className="p-2 border" />
        <input onChange={e=>setForm({...form, amount:parseFloat(e.target.value)||0})} placeholder="Amount" className="p-2 border" />
        <button className="col-span-3 mt-2 bg-blue-600 text-white p-2">Add Expense</button>
      </form>
      <div className="grid gap-2">
        {list.map(x=> <div key={x._id} className="p-3 bg-white rounded shadow">{x.description} — ${x.amount}</div>)}
      </div>
    </div>
  )
}
