// src/routes/Routes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PaymentListPage from '../pages/PaymentListPage';
import CartPage from '../pages/CartPage';
import ReportPage from '../pages/ReportPage';
import RegisterPage from '../pages/RegisterPage'; // Import RegisterPage

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> {/* Rute untuk halaman registrasi */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/payments/:type" element={<PaymentListPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/reports" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;