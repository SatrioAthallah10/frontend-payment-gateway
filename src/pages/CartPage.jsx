// src/pages/CartPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import {
  Title,
  Text,
  Button,
  Table,
  Group,
  Stack,
  Divider,
  Loader
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

function CartPage() {
  const { cartItems, removeFromCart, checkout, currentUser, isAuthLoading } = usePayment();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate, isAuthLoading]);

  // Hitung total pembayaran
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  const handleCheckout = async () => {
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

    // Panggil fungsi checkout dari context yang sekarang sudah terintegrasi Midtrans
    // Kirimkan array cartItems sebagai parameter kedua
    const checkoutSuccess = await checkout(currentUser.id, cartItems); 
    
    // Redirect setelah user kembali dari Midtrans, status akan diupdate via check-status
    if (checkoutSuccess) {
      // Kita tidak redirect langsung ke /reports lagi, karena window.location.href sudah mengarahkan ke Midtrans
      // Namun, jika ada kasus redirect gagal, kita bisa ke dashboard
      // notifications.show({
      //   title: 'Pembayaran Diinisiasi',
      //   message: 'Silakan selesaikan pembayaran di Midtrans.',
      //   color: 'blue',
      // });
      // navigate('/dashboard'); // Atau ke halaman lain yang sesuai
    } else {
        console.log("Checkout process did not fully succeed, staying on cart page.");
    }
  };

  if (isAuthLoading || !currentUser) {
    return (
      <Group position="center" style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
        <Text>Memuat sesi...</Text>
      </Group>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px' }}>
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
                    <td>{item.description}</td>
                    <td>Rp {(item.amount || 0).toLocaleString('id-ID')}</td> 
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
              <Button size="lg" onClick={handleCheckout} loading={isAuthLoading}>
                Bayar Sekarang
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </div>
  );
}

export default CartPage;
