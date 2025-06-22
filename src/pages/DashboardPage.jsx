// src/pages/DashboardPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import {
  // Paper, // Pastikan ini dihapus
  Title,
  Text,
  Button,
  Group,
  Stack,
  Loader,
  Divider
} from '@mantine/core';

function DashboardPage() {
  const navigate = useNavigate();
  const { cartItems, currentUser, logout, isAuthLoading } = usePayment();

  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate, isAuthLoading]);

  // Pastikan semua handle functions didefinisikan di sini
  const handleSPPClick = () => {
    navigate('/payments/spp');
  };

  const handleNonSPPClick = () => {
    navigate('/payments/non-spp');
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  const handleViewReports = () => {
    navigate('/reports');
  };

  const handleManageDebts = () => {
    navigate('/admin/debts');
  };

  const handleManageBillings = () => {
    navigate('/admin/billings');
  };

  const handleManageUsers = () => {
    navigate('/admin/users');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isAuthLoading || !currentUser) {
    return (
      <Group position="center" style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
        <Text>Memuat sesi...</Text>
      </Group>
    );
  }

  const isAdmin = currentUser.role === 'superadmin';

  return (
    // Pastikan ada div wrapper dengan styling untuk layout
    <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: '20px' }}>
      <Stack align="center" spacing="xl">
        <Title order={1}>Selamat Datang, {currentUser.name || currentUser.email}!</Title>
        <Text size="lg" color="dimmed">
          Ini adalah Dashboard Anda. Silakan pilih opsi pembayaran atau manajemen di bawah.
        </Text>

        <Group spacing="md" position="center" mt="lg">
          <Button size="lg" onClick={handleSPPClick}>
            Pembayaran SPP
          </Button>
          <Button size="lg" onClick={handleNonSPPClick}>
            Pembayaran Non-SPP
          </Button>
        </Group>

        <Group spacing="md" position="center" mt="md">
          <Button variant="outline" size="md" onClick={handleViewCart}>
            Lihat Keranjang ({cartItems.length} item)
          </Button>
          <Button variant="outline" size="md" onClick={handleViewReports}>
            Lihat Laporan
          </Button>
        </Group>

        {isAdmin && (
          <>
            <Divider my="md" size="md" style={{ width: '100%' }} label="Panel Admin" labelPosition="center" />
            <Group spacing="md" position="center">
              <Button variant="filled" color="grape" size="md" onClick={handleManageDebts}>
                Kelola Kategori Pembayaran
              </Button>
              <Button variant="filled" color="grape" size="md" onClick={handleManageBillings}>
                Kelola Semua Tagihan
              </Button>
              <Button variant="filled" color="grape" size="md" onClick={handleManageUsers}>
                Kelola Pengguna
              </Button>
            </Group>
          </>
        )}

        <Button variant="light" color="red" size="md" mt="xl" onClick={handleLogout}>
          Logout
        </Button>
      </Stack>
    </div>
  );
}

export default DashboardPage;
