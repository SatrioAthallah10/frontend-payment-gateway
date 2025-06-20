// src/pages/PaymentListPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext'; // Import usePayment
import {
  Paper,
  Title,
  Text,
  Button,
  Table,
  Group,
  Stack,
  Loader
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { API_BASE_URL } from '../config/api'; // Import API_BASE_URL

function PaymentListPage() {
  const { type } = useParams(); // Ambil parameter 'type' dari URL (spp atau non-spp)
  const navigate = useNavigate();
  const { addToCart, currentUser, apiToken } = usePayment(); // Dapatkan addToCart, currentUser, dan apiToken dari context
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillings = async () => {
      setLoading(true); // Mulai loading

      if (!currentUser || !apiToken) {
        notifications.show({
          title: 'Sesi Habis',
          message: 'Anda harus login untuk mengakses halaman ini.',
          color: 'red',
        });
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/v1/user/billings`, { // Panggil endpoint billing
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiToken}` // Kirim Bearer Token
          },
        });

        const data = await response.json();

        if (response.ok) {
          // Asumsi backend mengembalikan array of billing objects di data.data
          // Filter data dari backend berdasarkan type (SPP/Non-SPP)
          // Asumsi item dari backend memiliki property 'type' seperti dummy data kita,
          // atau kita perlu mapping jika nama propertynya berbeda (misal 'jenis_tagihan')
          const paymentType = type.toLowerCase(); // Convert ke lowercase untuk perbandingan
          const itemsFromBackend = data.data.filter(
            (item) => item.description.toLowerCase().includes(paymentType) // Filter berdasarkan deskripsi, atau tambahkan 'type' di backend
          );
          setFilteredPayments(itemsFromBackend);
          setPageTitle(type.toUpperCase() === 'SPP' ? 'Daftar Tagihan SPP' : 'Daftar Tagihan Non-SPP');
        } else {
          notifications.show({
            title: 'Gagal Mengambil Tagihan',
            message: data.message || 'Terjadi kesalahan saat mengambil data tagihan.',
            color: 'red',
          });
          console.error('Fetch Billings Error:', data);
          setFilteredPayments([]); // Kosongkan daftar jika gagal
        }
      } catch (error) {
        notifications.show({
          title: 'Error Koneksi',
          message: 'Tidak dapat terhubung ke server untuk mengambil tagihan. Pastikan backend berjalan.',
          color: 'red',
        });
        console.error('Network Error during fetch billings:', error);
        setFilteredPayments([]);
      } finally {
        setLoading(false); // Selesai loading
      }
    };

    fetchBillings();
  }, [type, navigate, currentUser, apiToken]); // Tambahkan apiToken sebagai dependency

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleSelectPayment = (item) => {
    // Di sini kita akan menambahkan item ke keranjang.
    // Perhatikan: item yang ditambahkan ke keranjang harus memiliki struktur yang sama
    // dengan yang diharapkan oleh cartItems (id, name, amount, status, etc.)
    // Pastikan item dari backend memiliki properti yang relevan
    addToCart(item.id); // Asumsi item.id dari backend sama
    notifications.show({
      title: 'Item Ditambahkan!',
      message: `${item.description} berhasil ditambahkan ke keranjang.`, // Gunakan description dari backend
      color: 'blue',
      autoClose: 2000,
    });
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
          <Button variant="outline" onClick={handleGoBack}>&larr; Kembali ke Dashboard</Button>
          <Title order={2}>{pageTitle}</Title>
          <div></div>
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
                <th>ID</th> {/* Tambahkan kolom ID jika perlu */}
                <th>Deskripsi Tagihan</th>
                <th>Jumlah</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((item) => (
                <tr key={item.id}>
                  <td>{item.id.substring(0, 8)}...</td> {/* Tampilkan sebagian ID */}
                  <td>{item.description}</td>
                  <td>Rp {item.amount.toLocaleString('id-ID')}</td>
                  <td>
                    <Text color={item.status === 'paid' ? 'green' : 'orange'} weight={500}> {/* Pastikan status dari backend lowercase */}
                      {item.status}
                    </Text>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      onClick={() => handleSelectPayment(item)}
                      disabled={item.status === 'paid'} // Nonaktifkan jika sudah dibayar
                      variant={item.status === 'paid' ? 'light' : 'filled'}
                      color={item.status === 'paid' ? 'gray' : 'green'}
                    >
                      {item.status === 'paid' ? 'Sudah Dibayar' : 'Pilih'}
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
