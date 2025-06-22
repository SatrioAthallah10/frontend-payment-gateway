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
import { IconCircleCheck, IconCircleX, IconClock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function ReportPage() {
  const { transactions, currentUser } = usePayment(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (!currentUser) {
      notifications.show({
        title: 'Akses Ditolak',
        message: 'Anda harus login untuk melihat laporan ini.',
        color: 'red',
      });
      navigate('/');
    }
  }, [currentUser, navigate]);

  const userTransactionsToDisplay = transactions.filter(
    (trx) => trx.userId === currentUser?.id 
  );

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
                    <Text>{trx.items[0]?.description || 'N/A'}</Text>
                  </td>
                  <td>Rp {trx.totalAmount.toLocaleString('id-ID')}</td>
                  <td>
                    <Group spacing="xs" noWrap>
                      <ThemeIcon size="sm" radius="xl" color={
                        trx.status === 'Paid' ? 'teal' : 
                        trx.status === 'Pending' || trx.status === 'Initiated' ? 'blue' : 'gray' 
                      }>
                        {trx.status === 'Paid' ? <IconCircleCheck size={16} /> : 
                         trx.status === 'Pending' || trx.status === 'Initiated' ? <IconClock size={16} /> : <IconCircleX size={16} />}
                      </ThemeIcon>
                      <Text color={
                        trx.status === 'Paid' ? 'teal' : 
                        trx.status === 'Pending' || trx.status === 'Initiated' ? 'blue' : 'gray'
                      } weight={500} style={{ whiteSpace: 'nowrap' }}>
                        {trx.status || 'N/A'}
                      </Text>
                    </Group>
                  </td>
                  <td>
                    {trx.status === 'Initiated' || trx.status === 'Pending' ? (
                      <Anchor href={trx.redirect_url} target="_blank" rel="noopener noreferrer">
                        Lanjutkan Pembayaran
                      </Anchor>
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
