// src/pages/ReportPage.jsx
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
  Anchor,
  List,
  ThemeIcon,
  Loader // Tambahkan Loader
} from '@mantine/core';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';

function ReportPage() {
  const { transactions, currentUser } = usePayment(); // Dapatkan currentUser dari context
  const navigate = useNavigate();

  // Arahkan ke login jika tidak ada user yang login
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Filter transaksi hanya untuk user yang sedang login
  const userTransactions = transactions.filter(
    (transaction) => transaction.userId === currentUser?.id
  );

  if (!currentUser) {
    return (
      <Group position="center" style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
        <Text>Memuat sesi...</Text>
      </Group>
    );
  }

  return (
    <Paper shadow="xl" radius="md" p="xl" style={{ maxWidth: 1000, margin: '50px auto' }}>
      <Stack spacing="xl">
        <Group position="apart">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>&larr; Kembali ke Dashboard</Button>
          <Title order={2}>Laporan Riwayat Pembayaran</Title>
          <div></div>
        </Group>

        {userTransactions.length === 0 ? (
          <Text align="center" size="lg" color="dimmed" mt="md">
            Belum ada transaksi pembayaran yang tercatat untuk Anda.
          </Text>
        ) : (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Tanggal</th>
                <th>Deskripsi Pembayaran</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userTransactions.map((trx) => (
                <tr key={trx.id}>
                  <td>{trx.id}</td>
                  <td>{new Date(trx.date).toLocaleDateString('id-ID', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}</td>
                  <td>
                    <List spacing="xs" size="sm" center>
                      {trx.items.map((item, index) => (
                        <List.Item key={index}>
                          <Text>{item.name} (Rp {item.amount.toLocaleString('id-ID')})</Text>
                        </List.Item>
                      ))}
                    </List>
                  </td>
                  <td>
                    <Text weight={500}>Rp {trx.totalAmount.toLocaleString('id-ID')}</Text>
                  </td>
                  <td>
                    <Group spacing="xs" noWrap>
                      <ThemeIcon size="sm" radius="xl" color={trx.status === 'Paid' ? 'teal' : 'red'}>
                        {trx.status === 'Paid' ? <IconCircleCheck size={16} /> : <IconCircleX size={16} />}
                      </ThemeIcon>
                      <Text color={trx.status === 'Paid' ? 'teal' : 'red'} weight={500}>
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
