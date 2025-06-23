import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import {
  Paper,
  Title,
  Text,
  Button,
  Table,
  Group,
  Stack,
  Loader,
  TextInput,
  Select
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { API_BASE_URL } from '../config/api';
import { IconSearch } from '@tabler/icons-react';

function PaymentListPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { addToCart, currentUser, apiToken, isAuthLoading } = usePayment();
  const [allBillings, setAllBillings] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (isAuthLoading) {
        setLoading(true);
        return;
    }

    if (!currentUser || currentUser.role !== 'user' || !apiToken) {
        notifications.show({
            title: 'Akses Ditolak',
            message: 'Halaman ini hanya untuk pengguna mahasiswa.',
            color: 'red',
        });
        setLoading(false);
        navigate('/dashboard');
        return;
    }

    const fetchBillings = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/v1/user/billings`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiToken}`
          },
        });

        const data = await response.json();
        console.log("Fetch Billings Response (PaymentListPage):", data);

        if (response.ok) {
          const fetchedBillings = Array.isArray(data.data) ? data.data : [];
          setAllBillings(fetchedBillings);
          setPageTitle(type.toUpperCase() === 'SPP' ? 'Daftar Tagihan SPP' : 'Daftar Tagihan Non-SPP');
        } else {
          notifications.show({
            title: 'Gagal Mengambil Tagihan',
            message: data.message || 'Terjadi kesalahan saat mengambil data tagihan.',
            color: 'red',
          });
          console.error('Fetch Billings Error:', data);
          setAllBillings([]);
        }
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
  }, [type, navigate, currentUser, apiToken, isAuthLoading]);

  useEffect(() => {
    let currentFiltered = allBillings;

    if (searchTerm) {
      currentFiltered = currentFiltered.filter(item =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      currentFiltered = currentFiltered.filter(item => item.status === filterStatus);
    }

    setFilteredPayments(currentFiltered);
  }, [allBillings, searchTerm, filterStatus]);


  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleSelectPayment = (item) => { 
    addToCart(item);
  };

  if (loading) {
    return (
      <Group position="center" style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
        <Text>Memuat tagihan...</Text>
      </Group>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px' }}>
      <Stack spacing="xl">
        <Group position="apart">
          <Button variant="outline" onClick={handleGoBack}>&larr; Kembali ke Dashboard</Button>
          <Title order={2}>{pageTitle}</Title>
          <div></div>
        </Group>

        <Group grow spacing="md" mt="md">
          <TextInput
            placeholder="ITATS"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            clearable
          />
          <Select
            placeholder="Filter berdasarkan status"
            data={[
              { value: 'all', label: 'Semua Status' },
              { value: 'unpaid', label: 'Belum Lunas' },
              { value: 'paid', label: 'Lunas' },
            ]}
            value={filterStatus}
            onChange={setFilterStatus}
          />
        </Group>

        {filteredPayments.length === 0 ? (
          <Text align="center" size="lg" color="dimmed" mt="md">
            Tidak ada tagihan {type.toUpperCase()} yang tersedia untuk Anda dengan filter saat ini.
          </Text>
        ) : (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <thead>
              <tr>
                <th>ID</th>
                <th>Deskripsi Tagihan</th>
                <th>Jumlah</th>
                <th>Bulan/Tahun</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((item) => (
                <tr key={item.id}>
                  <td>{item.id.substring(0, 8)}...</td>
                  <td>{item.description}</td>
                  <td>Rp {parseInt(item.amount).toLocaleString('id-ID')}</td>
                  <td>{item.month}/{item.year}</td>
                  <td>
                    <Text color={item.status === 'paid' ? 'green' : 'orange'} weight={500}>
                      {item.status}
                    </Text>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      onClick={() => handleSelectPayment(item)}
                      disabled={item.status === 'paid'}
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
    </div>
  );
}

export default PaymentListPage;
