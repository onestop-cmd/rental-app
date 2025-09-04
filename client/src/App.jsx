import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import Tenants from './pages/Tenants'
import RentSchedule from './pages/RentSchedule'
import Expenses from './pages/Expenses'
import BankDeposits from './pages/BankDeposits'
import Reconciliation from './pages/Reconciliation'
import Sidebar from './components/Sidebar'

function App(){
  const token = localStorage.getItem('token');
  if(!token){
    return <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  }
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/properties" element={<Properties/>} />
          <Route path="/tenants" element={<Tenants/>} />
          <Route path="/rents" element={<RentSchedule/>} />
          <Route path="/expenses" element={<Expenses/>} />
          <Route path="/deposits" element={<BankDeposits/>} />
          <Route path="/reconciliation" element={<Reconciliation/>} />
        </Routes>
      </div>
    </div>
  )
}
export default App
