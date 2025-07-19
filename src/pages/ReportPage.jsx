import React, { useState, useEffect } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
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
import { IconCircleCheck, IconCircleX, IconClock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import axios from 'axios';
import { API_BASE_URL } from '../config/api';


function ReportPage() {
  const { apiToken } = usePayment();

  const { transactions, currentUser } = usePayment(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 
  const [allBillings, setAllBillings] = useState([]);

  const handlePayment = async (billingId) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/v1/user/billings/check-status/${billingId}`, {}, {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Accept': 'application/json',
        },
      });
      navigate('/payments/spp');

    } catch (error) {
      console.error('Error fetching transaction status:', error);
      notifications.show({
        title: 'Error',
        message: 'Tidak dapat memeriksa status transaksi. Silakan coba lagi nanti.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const redirectVendor = (url) => {
    if (!url) {
      notifications.show({
        title: 'Error',
        message: 'URL redirect tidak tersedia untuk transaksi ini.',
        color: 'red',
      });
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  useEffect(() => {
    if (!currentUser) {
      notifications.show({
        title: 'Akses Ditolak',
        message: 'Anda harus login untuk melihat laporan ini.',
        color: 'red',
      });
      navigate('/');
    }

    const fetchBillings = async () => {
          setLoading(true);
    
          try {
            const response = await axios.get(`${API_BASE_URL}/v1/user/billings`, {
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${apiToken}`,
              },
            });    
            const data = response?.data?.data;
            console.log("Fetch Billings Response (ReportPage):", data);
            setAllBillings(data || []);
          } catch (error) {
            notifications.show({
              title: 'Error Koneksi',
              message: 'Tidak dapat terhubung ke server untuk mengambil tagihan. Pastikan backend berjalan.',
              color: 'red',
            });
            console.error('Network Error during fetch billings:', error);
            setAllBillings([]);
          } finally {
            setLoading(false);
          }
        };
    
        fetchBillings();
      }, [currentUser, navigate, apiToken]);
      
      
    const userTransactionsToDisplay = allBillings.filter((trx) => {
      return (trx.response_data || trx.payment_status == 'pending') || trx.status == 'paid';
    });

  if (!currentUser) {
    return (
      <Group position="center" style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
        <Text>Memuat laporan...</Text>
      </Group>
    );
  }
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
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
                <th>ID Transaksi</th>
                <th>Deskripsi Pembayaran</th>
                <th>Jumlah</th>
                <th>Status</th>
                <th>Link Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              {userTransactionsToDisplay.map((trx) => (
                <tr key={trx.id}>
                  <td>{trx.id.substring(0, 8)}...</td>
                  <td>
                    <Text>{trx.description || 'N/A'}</Text>
                  </td>
                  <td>Rp {parseInt(trx.amount).toLocaleString('id-ID')}</td>
                  <td>
                    <Group spacing="xs" noWrap>
                      <ThemeIcon size="sm" radius="xl" color={
                        trx.status === 'Paid' ? 'teal' : 
                        trx.status === 'Pending' || trx.payment_status === 'pending' ? 'blue' : 'gray' 
                      }>
                        {trx.status === 'Paid' ? <IconCircleCheck size={16} /> : 
                         trx.status === 'Pending' || trx.payment_status === 'pending' ? <IconClock size={16} /> : <IconCircleX size={16} />}
                      </ThemeIcon>
                      <Text color={
                        trx.status === 'Paid' ? 'teal' : 
                        trx.status === 'Pending' || trx.payment_status === 'pending' ? 'blue' : 'gray'
                      } weight={500} style={{ whiteSpace: 'nowrap' }}>
                        {trx.status || 'N/A'}
                      </Text>
                    </Group>
                  </td>
                  <td>
                    {trx.payment_status === 'pending' || trx.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '1rem' }}>

                        <Button onClick={() => redirectVendor(trx?.response_data?.redirect_url)} rel="noopener noreferrer">
                          Lanjutkan Pembayaran
                        </Button>
                        <Button onClick={() => handlePayment(trx?.id)}>Check Status</Button>
                      </div>
                    ) : (
                      <Text c="dimmed">Selesai</Text>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Stack>
    </div>
  );
}

export default ReportPage;
