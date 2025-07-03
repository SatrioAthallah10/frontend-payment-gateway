import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import {
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

  // Fungsi untuk mengambil nama depan dari string lengkap
  const getFirstName = (fullNameString) => {
    if (!fullNameString) return '';
    // Memisahkan NPM dan nama, lalu mengambil bagian nama
    const parts = fullNameString.split(' - ');
    const namePart = parts.length > 1 ? parts[1] : fullNameString;
    // Mengambil kata pertama dari nama
    const nameWords = namePart.trim().split(' ');
    const firstName = nameWords[0];

    if (!firstName) return '';
    // Mengubah format menjadi Kapital (misal: SATRIO -> Satrio)
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
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
  const displayName = getFirstName(currentUser.name);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: '20px' }}>
      <Stack align="center" spacing="xl">
        {/* --- PERUBAHAN DI SINI --- */}
        <Title order={1}>Selamat Datang, {displayName || currentUser.email}!</Title>

        <Text size="lg" color="dimmed">
          Ini adalah Dashboard Anda. Silakan pilih opsi pembayaran atau manajemen di bawah.
        </Text>

        <Group spacing="md" position="center" mt="lg">
          <Button size="lg" onClick={() => navigate('/payments/spp')}>
            Pembayaran SPP
          </Button>
          <Button size="lg" onClick={() => navigate('/payments/non-spp')}>
            Pembayaran Non-SPP
          </Button>
        </Group>

        <Group spacing="md" position="center" mt="md">
          <Button variant="outline" size="md" onClick={() => navigate('/cart')}>
            Lihat Keranjang ({cartItems.length} item)
          </Button>
          <Button variant="outline" size="md" onClick={() => navigate('/reports')}>
            Lihat Laporan
          </Button>
        </Group>

        {isAdmin && (
          <>
            <Divider my="md" size="md" style={{ width: '100%' }} label="Panel Admin" labelPosition="center" />
            <Group spacing="md" position="center">
              <Button variant="filled" color="grape" size="md" onClick={() => navigate('/admin/debts')}>
                Kelola Kategori Pembayaran
              </Button>
              <Button variant="filled" color="grape" size="md" onClick={() => navigate('/admin/billings')}>
                Kelola Semua Tagihan
              </Button>
              <Button variant="filled" color="grape" size="md" onClick={() => navigate('/admin/users')}>
                Kelola Pengguna
              </Button>
            </Group>
          </>
        )}

        <Button variant="light" color="red" size="md" mt="xl" onClick={logout}>
          Logout
        </Button>
      </Stack>
    </div>
  );
}

export default DashboardPage;
