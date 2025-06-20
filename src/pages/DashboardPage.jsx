// src/pages/DashboardPage.jsx
import React, { useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext'; // Import usePayment
import {
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Loader // Tambahkan Loader
} from '@mantine/core';

function DashboardPage() {
  const navigate = useNavigate();
  const { cartItems, currentUser, logout } = usePayment(); // Dapatkan currentUser dan logout dari context

  // Arahkan ke login jika tidak ada user yang login
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

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

  const handleLogout = () => { // Fungsi baru untuk logout
    logout(); // Panggil fungsi logout dari context
    navigate('/'); // Arahkan ke halaman login setelah logout
  };

  // Tampilkan loader jika currentUser masih null dan belum diarahkan
  if (!currentUser) {
    return (
      <Group position="center" style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
        <Text>Memuat sesi...</Text>
      </Group>
    );
  }

  return (
    <Paper shadow="xl" radius="md" p="xl" style={{ maxWidth: 800, margin: '50px auto', textAlign: 'center' }}>
      <Stack align="center" spacing="xl">
        <Title order={1}>Selamat Datang, {currentUser.name || currentUser.email}!</Title> {/* Gunakan currentUser dari context */}
        <Text size="lg" color="dimmed">
          Ini adalah Dashboard Anda. Silakan pilih opsi pembayaran di bawah.
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

        <Button variant="light" color="red" size="md" mt="xl" onClick={handleLogout}> {/* Tombol logout baru */}
          Logout
        </Button>
      </Stack>
    </Paper>
  );
}

export default DashboardPage;
