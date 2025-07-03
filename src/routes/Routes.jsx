import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AppShell, Loader, Group, Text, Stack } from '@mantine/core';
import Navbar from '../components/Navbar';
import { usePayment } from '../context/PaymentContext';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PaymentListPage from '../pages/PaymentListPage';
import CartPage from '../pages/CartPage';
import ReportPage from '../pages/ReportPage';
import RegisterPage from '../pages/RegisterPage';
import DebtManagementPage from '../pages/DebtManagementPage';
import BillingManagementPage from '../pages/BillingManagementPage';
import UserManagementPage from '../pages/UserManagementPage';

function AppRoutes() {
  const { currentUser, isAuthLoading } = usePayment();

  const AuthenticatedLayout = ({ children }) => {
    const navigate = useNavigate();

    React.useEffect(() => {
      if (!isAuthLoading && !currentUser) {
        navigate('/login');
      }
    }, [isAuthLoading, currentUser, navigate]);

    if (isAuthLoading) {
      return (
        <Group position="center" style={{ minHeight: '100vh', width: '100%', backgroundColor: '#f0f2f5' }}>
          <Stack align="center">
            <Loader size="xl" />
            <Text size="lg" color="dimmed">Memuat sesi...</Text>
          </Stack>
        </Group>
      );
    }

    if (!currentUser) {
      return null;
    }

    return (
      <AppShell
        header={{ height: 60 }}
        padding="md"
      >
        <Navbar />
        <AppShell.Main>
          {children}
        </AppShell.Main>
      </AppShell>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<AuthenticatedLayout><DashboardPage /></AuthenticatedLayout>} />
        <Route path="/payments/:type" element={<AuthenticatedLayout><PaymentListPage /></AuthenticatedLayout>} />
        <Route path="/cart" element={<AuthenticatedLayout><CartPage /></AuthenticatedLayout>} />
        <Route path="/reports" element={<AuthenticatedLayout><ReportPage /></AuthenticatedLayout>} />
        <Route path="/admin/debts" element={<AuthenticatedLayout><DebtManagementPage /></AuthenticatedLayout>} />
        <Route path="/admin/billings" element={<AuthenticatedLayout><BillingManagementPage /></AuthenticatedLayout>} />
        <Route path="/admin/users" element={<AuthenticatedLayout><UserManagementPage /></AuthenticatedLayout>} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
