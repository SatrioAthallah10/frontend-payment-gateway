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
import moment from 'moment';
function CartPage() {
  const { cartItems, removeFromCart, checkout, currentUser, isAuthLoading } = usePayment();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate, isAuthLoading]);

  const totalAmount = cartItems.reduce((sum, item) => parseInt(sum) + (parseInt(item.amount) || 0), 0);
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

    const checkoutSuccess = await checkout(currentUser.id, cartItems); 
    
    if (checkoutSuccess) {
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
                    <td style={{ textAlign: 'center' }}>{item.debt.name} {moment(item.year + '-' + item.month + '-01').locale('id').format('MMMM YYYY')}</td>
                    <td style={{ textAlign: 'center' }}>Rp {(parseInt(item.amount) || 0).toLocaleString('id-ID')}</td>
                    <td style={{ textAlign: 'center' }}>
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
