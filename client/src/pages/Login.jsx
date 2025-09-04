import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
export default function Login(){
  const [email,setEmail]=useState('admin@salim.pm'); const [password,setPassword]=useState('admin123');
  const nav = useNavigate();
  const submit = async e => {
    e.preventDefault();
    const res = await api.post('/api/auth/login',{ email, password });
    localStorage.setItem('token', res.data.token);
    nav('/');
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-96">
        <h3 className="text-lg font-bold mb-4">Login</h3>
        <input className="w-full mb-2 p-2 border" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input className="w-full mb-2 p-2 border" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
        <button className="w-full bg-blue-600 text-white p-2">Login</button>
      </form>
    </div>
  )
}
