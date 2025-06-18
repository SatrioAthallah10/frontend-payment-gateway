// src/pages/ReportPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import { currentUser } from '../data/dummyData';
import {
  Paper,    // Wadah dengan shadow dan radius
  Title,    // Judul
  Text,     // Teks
  Button,   // Tombol
  Table,    // Komponen tabel Mantine
  Group,    // Untuk mengatur elemen horizontal
  Stack,    // Untuk mengatur elemen vertikal
  Anchor,   // Tautan Mantine
  List,     // Komponen daftar Mantine
  ThemeIcon // Untuk ikon di list
} from '@mantine/core';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react'; // Ikon untuk status

function ReportPage() {
  const { transactions } = usePayment();
  const navigate = useNavigate();

  // Filter transaksi hanya untuk user yang sedang login
  const userTransactions = transactions.filter(
    (transaction) => transaction.userId === currentUser?.id
  );

  return (
    <Paper shadow="xl" radius="md" p="xl" style={{ maxWidth: 1000, margin: '50px auto' }}>
      <Stack spacing="xl">
        <Group position="apart">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>&larr; Kembali ke Dashboard</Button>
          <Title order={2}>Laporan Riwayat Pembayaran</Title>
          <div></div> {/* Placeholder untuk menjaga layout apart */}
        </Group>

        {!currentUser ? (
          <Text align="center" size="lg" color="dimmed" mt="md">
            Anda harus login untuk melihat laporan ini.{' '}
            <Anchor component="button" onClick={() => navigate('/')}>
              Login sekarang
            </Anchor>
          </Text>
        ) : userTransactions.length === 0 ? (
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
