import React, { useState, useEffect } from 'react';
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
  Anchor,
  List,
  ThemeIcon,
  Loader 
} from '@mantine/core';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { API_BASE_URL } from '../config/api';

function ReportPage() {
  const { transactions, currentUser, apiToken, isAuthLoading } = usePayment(); 
  const navigate = useNavigate();
  const [paidBillings, setPaidBillings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && (!currentUser || !apiToken)) {
      notifications.show({
        title: 'Sesi Habis',
        message: 'Anda harus login untuk melihat laporan ini.',
        color: 'red',
      });
      navigate('/');
    }
  }, [currentUser, navigate, apiToken, isAuthLoading]);

  const fetchPaidBillings = async () => {
    setLoading(true);
    if (!apiToken) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/v1/user/billings`, { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
      });

      const data = await response.json();
      console.log("Fetch Billings for Report Page Response:", data); 

      if (response.ok) {
        const paidItems = Array.isArray(data.data) 
                          ? data.data.filter(item => item.status === 'paid') 
                          : [];
        setPaidBillings(paidItems);
        notifications.show({
            title: 'Laporan Dimuat',
            message: 'Riwayat pembayaran berhasil diambil.',
            color: 'green',
            autoClose: 2000
        });
      } else {
        notifications.show({
          title: 'Gagal Memuat Laporan',
          message: data.message || 'Terjadi kesalahan saat mengambil laporan.',
          color: 'red',
        });
        console.error('Fetch Report Billings Error:', data);
        setPaidBillings([]);
      }
    } catch (error) {
      notifications.show({
        title: 'Error Koneksi',
        message: 'Tidak dapat terhubung ke server untuk mengambil laporan.',
        color: 'red',
      });
      console.error('Network Error during fetch report billings:', error);
      setPaidBillings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && currentUser && apiToken) { 
      fetchPaidBillings();
    }
  }, [apiToken, currentUser, isAuthLoading]); 

  if (isAuthLoading || !currentUser || loading) { 
    return (
      <Group position="center" style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
        <Text>Memuat laporan...</Text>
      </Group>
    );
  }

  const userTransactionsToDisplay = paidBillings;

  return (
    <Paper shadow="xl" radius="md" p="xl" style={{ maxWidth: 1000, margin: '50px auto' }}>
      <Stack spacing="xl">
        <Group position="apart">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>&larr; Kembali ke Dashboard</Button>
          <Title order={2}>Laporan Riwayat Pembayaran</Title>
          <div></div>
        </Group>

        {userTransactionsToDisplay.length === 0 ? (
          <Text align="center" size="lg" color="dimmed" mt="md">
            Belum ada transaksi pembayaran yang tercatat untuk Anda.
          </Text>
        ) : (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <thead>
              <tr>
                <th>ID</th>
                <th>Deskripsi Pembayaran</th>
                <th>Jumlah</th>
                <th>Bulan/Tahun</th> 
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userTransactionsToDisplay.map((trx) => (
                <tr key={trx.id}>
                  <td>{trx.id.substring(0, 8)}...</td>
                  <td>
                    <Text>{trx.description}</Text> 
                  </td>
                  <td>Rp {trx.amount.toLocaleString('id-ID')}</td> 
                  <td>{trx.month}/{trx.year}</td> 
                  <td>
                    <Group spacing="xs" noWrap>
                      <ThemeIcon size="sm" radius="xl" color={trx.status === 'paid' ? 'teal' : 'red'}>
                        {trx.status === 'paid' ? <IconCircleCheck size={16} /> : <IconCircleX size={16} />}
                      </ThemeIcon>
                      <Text color={trx.status === 'paid' ? 'teal' : 'red'} weight={500}>
                        {trx.status}
                      </Text>
                    </Group>
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

export default ReportPage;
