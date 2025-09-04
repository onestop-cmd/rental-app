import React from 'react'
import { NavLink } from 'react-router-dom'
export default function Sidebar(){
  return (
    <aside className="w-56 bg-white border-r p-4">
      <h2 className="font-bold mb-4">Salim Reza PM</h2>
      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={({isActive})=>isActive?'font-semibold':'hover:underline'}>Dashboard</NavLink>
        <NavLink to="/properties" className={({isActive})=>isActive?'font-semibold':'hover:underline'}>Properties</NavLink>
        <NavLink to="/tenants" className={({isActive})=>isActive?'font-semibold':'hover:underline'}>Tenants</NavLink>
        <NavLink to="/rents" className={({isActive})=>isActive?'font-semibold':'hover:underline'}>Rent Schedule</NavLink>
        <NavLink to="/expenses" className={({isActive})=>isActive?'font-semibold':'hover:underline'}>Expenses</NavLink>
        <NavLink to="/deposits" className={({isActive})=>isActive?'font-semibold':'hover:underline'}>Bank Deposits</NavLink>
        <NavLink to="/reconciliation" className={({isActive})=>isActive?'font-semibold':'hover:underline'}>Reconciliation</NavLink>
        <button onClick={()=>{ localStorage.clear(); window.location='/login'; }} className="mt-4 text-sm text-red-600">Logout</button>
      </nav>
    </aside>
  )
}
