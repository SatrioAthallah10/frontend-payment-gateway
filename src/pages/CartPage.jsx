// src/pages/CartPage.jsx
import React, { useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import {
  Paper,
  Title,
  Text,
  Button,
  Table,
  Group,
  Stack,
  Divider,
  Loader // Tambahkan Loader
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

function CartPage() {
  const { cartItems, removeFromCart, checkout, currentUser } = usePayment(); // Dapatkan currentUser dari context
  const navigate = useNavigate();

  // Arahkan ke login jika tidak ada user yang login
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Hitung total pembayaran
  const totalAmount = cartItems.reduce((sum, item) => sum + item.amount, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      notifications.show({
        title: 'Keranjang Kosong',
        message: 'Keranjang Anda kosong. Silakan pilih tagihan terlebih dahulu.',
        color: 'yellow',
      });
      return;
    }
    
    if (!currentUser) {
      notifications.show({
        title: 'Tidak Login',
        message: 'Anda harus login untuk melakukan checkout.',
        color: 'red',
      });
      navigate('/');
      return;
    }

    const transaction = checkout(currentUser.id); // Kirim currentUser.id ke checkout
    if (transaction) {
      notifications.show({
        title: 'Pembayaran Berhasil!',
        message: `Transaksi Rp ${transaction.totalAmount.toLocaleString('id-ID')} berhasil dicatat.`,
        color: 'green',
      });
      navigate('/reports');
    } else {
      notifications.show({
        title: 'Checkout Gagal',
        message: 'Terjadi masalah saat proses checkout. Coba lagi.',
        color: 'red',
      });
    }
  };

  if (!currentUser) {
    return (
      <Group position="center" style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
        <Text>Memuat sesi...</Text>
      </Group>
    );
  }

  return (
    <Paper shadow="xl" radius="md" p="xl" style={{ maxWidth: 900, margin: '50px auto' }}>
      <Stack spacing="xl">
        <Group position="apart">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>&larr; Kembali ke Dashboard</Button>
          <Title order={2}>Keranjang Pembayaran Anda</Title>
          <div></div>
        </Group>

        {cartItems.length === 0 ? (
          <Text align="center" size="lg" color="dimmed" mt="md">
            Keranjang Anda kosong. Silakan pilih tagihan dari halaman SPP/Non-SPP.
          </Text>
        ) : (
          <>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <thead>
                <tr>
                  <th>Nama Tagihan</th>
                  <th>Jumlah</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>Rp {item.amount.toLocaleString('id-ID')}</td>
                    <td>
                      <Button
                        size="sm"
                        color="red"
                        variant="light"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Divider my="sm" />

            <Group position="right" align="center" mt="md" spacing="lg">
              <Title order={3}>Total Pembayaran:</Title>
              <Title order={2} color="green">Rp {totalAmount.toLocaleString('id-ID')}</Title>
            </Group>

            <Group position="right" mt="xl">
              <Button size="lg" onClick={handleCheckout}>
                Bayar Sekarang
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Paper>
  );
}

export default CartPage;
