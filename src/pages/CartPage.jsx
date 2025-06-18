// src/pages/CartPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import { currentUser } from '../data/dummyData'; // Untuk user ID saat checkout
import {
  Paper,        // Wadah dengan shadow dan radius
  Title,        // Judul
  Text,         // Teks
  Button,       // Tombol
  Table,        // Komponen tabel Mantine
  Group,        // Untuk mengatur elemen horizontal
  Stack,        // Untuk mengatur elemen vertikal
  Divider,      // Garis pemisah
} from '@mantine/core';
import { notifications } from '@mantine/notifications'; // Untuk notifikasi

function CartPage() {
  const { cartItems, removeFromCart, checkout } = usePayment();
  const navigate = useNavigate();

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

    const transaction = checkout(currentUser.id); // Lakukan simulasi checkout
    if (transaction) {
      notifications.show({
        title: 'Pembayaran Berhasil!',
        message: `Transaksi Rp ${transaction.totalAmount.toLocaleString('id-ID')} berhasil dicatat.`,
        color: 'green',
      });
      navigate('/reports'); // Arahkan ke halaman laporan
    } else {
      // Ini akan dieksekusi jika cartItems kosong sebelum checkout dipanggil
      // Walaupun sudah ada guard di atas, ini sebagai fallback
      notifications.show({
        title: 'Checkout Gagal',
        message: 'Terjadi masalah saat proses checkout. Coba lagi.',
        color: 'red',
      });
    }
  };

  return (
    <Paper shadow="xl" radius="md" p="xl" style={{ maxWidth: 900, margin: '50px auto' }}>
      <Stack spacing="xl">
        <Group position="apart">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>&larr; Kembali ke Dashboard</Button>
          <Title order={2}>Keranjang Pembayaran Anda</Title>
          <div></div> {/* Placeholder untuk menjaga layout apart */}
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

            <Divider my="sm" /> {/* Garis pemisah Mantine */}

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
