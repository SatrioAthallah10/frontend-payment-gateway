// src/pages/PaymentListPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyPaymentItems, currentUser } from '../data/dummyData';
import { usePayment } from '../context/PaymentContext';
import {
  Paper,        // Wadah dengan shadow dan radius
  Title,        // Judul
  Text,         // Teks
  Button,       // Tombol
  Table,        // Komponen tabel Mantine
  Group,        // Untuk mengatur elemen horizontal
  Stack,        // Untuk mengatur elemen vertikal
  Loader        // Indikator loading
} from '@mantine/core';
import { notifications } from '@mantine/notifications'; // Untuk notifikasi

function PaymentListPage() {
  const { type } = useParams(); // Ambil parameter 'type' dari URL (spp atau non-spp)
  const navigate = useNavigate();
  const { addToCart } = usePayment(); // Dapatkan fungsi addToCart dari context
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [loading, setLoading] = useState(true); // State untuk loading

  useEffect(() => {
    setLoading(true); // Mulai loading
    if (!currentUser) {
      // Jika tidak ada user yang login, arahkan kembali ke login dan beri notifikasi
      notifications.show({
        title: 'Sesi Habis',
        message: 'Anda harus login untuk mengakses halaman ini.',
        color: 'red',
      });
      navigate('/');
      return;
    }

    const currentNim = currentUser.nim;
    const paymentType = type.toUpperCase(); // Ubah ke uppercase (SPP, NON-SPP)

    // Simulasi penundaan pengambilan data
    setTimeout(() => {
      // Filter dummy payment items berdasarkan tipe dan NIM mahasiswa yang login
      const items = dummyPaymentItems.filter(
        (item) => item.type === paymentType && item.nim_target === currentNim
      );
      setFilteredPayments(items);

      // Atur judul halaman
      setPageTitle(paymentType === 'SPP' ? 'Daftar Tagihan SPP' : 'Daftar Tagihan Non-SPP');
      setLoading(false); // Selesai loading
    }, 500); // Penundaan 500ms

  }, [type, navigate, currentUser]); // Tambahkan currentUser sebagai dependency

  const handleGoBack = () => {
    navigate('/dashboard'); // Kembali ke dashboard
  };

  const handleSelectPayment = (item) => {
    addToCart(item.id); // Tambahkan item ke keranjang melalui context
    // Optionally update item status in UI if needed, but context handles it.
    notifications.show({
      title: 'Item Ditambahkan!',
      message: `${item.name} berhasil ditambahkan ke keranjang.`,
      color: 'blue',
      autoClose: 2000,
    });
  };

  if (!currentUser) {
    return <Loader style={{ margin: 'auto', display: 'block', marginTop: '100px' }} />; // Tampilkan loader jika tidak ada user
  }

  return (
    <Paper shadow="xl" radius="md" p="xl" style={{ maxWidth: 900, margin: '50px auto' }}>
      <Stack spacing="xl">
        <Group position="apart">
          <Button variant="outline" onClick={handleGoBack}>&larr; Kembali ke Dashboard</Button>
          <Title order={2}>{pageTitle}</Title>
          <div></div> {/* Placeholder untuk menjaga layout apart */}
        </Group>

        {loading ? (
          <Group position="center" style={{ minHeight: 200 }}>
            <Loader size="lg" />
            <Text>Memuat tagihan...</Text>
          </Group>
        ) : filteredPayments.length === 0 ? (
          <Text align="center" size="lg" color="dimmed" mt="md">
            Tidak ada tagihan {type.toUpperCase()} yang tersedia untuk Anda.
          </Text>
        ) : (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <thead>
              <tr>
                <th>Nama Tagihan</th>
                <th>Jumlah</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>Rp {item.amount.toLocaleString('id-ID')}</td>
                  <td>
                    <Text color={item.status === 'Paid' ? 'green' : 'orange'} weight={500}>
                      {item.status}
                    </Text>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      onClick={() => handleSelectPayment(item)}
                      disabled={item.status === 'Paid'} // Nonaktifkan jika sudah dibayar
                      variant={item.status === 'Paid' ? 'light' : 'filled'}
                      color={item.status === 'Paid' ? 'gray' : 'green'}
                    >
                      {item.status === 'Paid' ? 'Sudah Dibayar' : 'Pilih'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Stack>
    </Paper>
  );
}

export default PaymentListPage;
