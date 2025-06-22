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
  Loader,
  Modal,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { API_BASE_URL } from '../config/api';
import { IconEdit, IconTrash, IconPlus, IconSearch } from '@tabler/icons-react';

function DebtManagementPage() {
  const navigate = useNavigate();
  const { currentUser, apiToken, isAuthLoading } = usePayment();
  const [allDebts, setAllDebts] = useState([]);
  const [filteredDebts, setFilteredDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debtName, setDebtName] = useState('');
  const [debtDescription, setDebtDescription] = useState('');

  useEffect(() => {
    if (!isAuthLoading && (!currentUser || currentUser.role !== 'superadmin')) {
      notifications.show({
        title: 'Akses Ditolak',
        message: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
        color: 'red',
      });
      navigate('/dashboard');
    }
  }, [currentUser, navigate, isAuthLoading]);

  const fetchDebts = async () => {
    setLoading(true);
    if (!apiToken) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/v1/debts`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
      });

      const data = await response.json();
      console.log("Fetch Debts Response:", data);

      if (response.ok) {
        const fetchedDebts = Array.isArray(data.data.debts) ? data.data.debts : [];
        setAllDebts(fetchedDebts);
        notifications.show({
            title: 'Data Berhasil Dimuat',
            message: 'Daftar kategori pembayaran berhasil diambil.',
            color: 'green',
            autoClose: 2000
        });
      } else {
        notifications.show({
          title: 'Gagal Memuat Debt',
          message: data.message || 'Terjadi kesalahan saat mengambil data kategori pembayaran.',
          color: 'red',
        });
        console.error('Fetch Debts Error:', data);
        setAllDebts([]);
      }
    } catch (error) {
      notifications.show({
        title: 'Error Koneksi',
        message: 'Tidak dapat terhubung ke server untuk mengambil kategori pembayaran.',
        color: 'red',
      });
      console.error('Network Error during fetch debts:', error);
      setAllDebts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && currentUser && currentUser.role === 'superadmin') {
      fetchDebts();
    }
  }, [apiToken, currentUser, isAuthLoading]);

  useEffect(() => {
    let currentFiltered = allDebts;

    if (searchTerm) {
      currentFiltered = currentFiltered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDebts(currentFiltered);
  }, [allDebts, searchTerm]);


  const handleSaveDebt = async () => {
    if (!debtName || !debtDescription) {
      notifications.show({
        title: 'Input Tidak Lengkap',
        message: 'Nama dan Deskripsi kategori pembayaran harus diisi.',
        color: 'orange',
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', debtName);
    formData.append('description', debtDescription);

    let url = `${API_BASE_URL}/v1/debts`;
    let method = 'POST';

    if (editingDebt) {
      url = `${API_BASE_URL}/v1/debts/${editingDebt.id}`;
      method = 'POST';
      formData.append('_method', 'PUT');
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Save Debt Response:", data);

      if (response.ok) {
        notifications.show({
          title: editingDebt ? 'Berhasil Diperbarui' : 'Berhasil Ditambahkan',
          message: `Kategori pembayaran ${debtName} berhasil ${editingDebt ? 'diperbarui' : 'ditambahkan'}.`,
          color: 'green',
        });
        setModalOpened(false);
        setEditingDebt(null);
        setDebtName('');
        setDebtDescription('');
        fetchDebts();
      } else {
        notifications.show({
          title: 'Gagal Menyimpan',
          message: data.message || `Terjadi kesalahan saat ${editingDebt ? 'memperbarui' : 'menambah'} kategori pembayaran.`,
          color: 'red',
        });
        console.error('Save Debt Error:', data);
      }
    } catch (error) {
      notifications.show({
        title: 'Error Koneksi',
        message: 'Tidak dapat terhubung ke server untuk menyimpan kategori pembayaran.',
        color: 'red',
      });
      console.error('Network Error during save debt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDebt = async (debtId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kategori pembayaran ini?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/debts/${debtId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
      });

      const data = await response.json();
      console.log("Delete Debt Response:", data);

      if (response.ok) {
        notifications.show({
          title: 'Berhasil Dihapus',
          message: 'Kategori pembayaran berhasil dihapus.',
          color: 'green',
        });
        fetchDebts();
      } else {
        notifications.show({
          title: 'Gagal Menghapus',
          message: data.message || 'Terjadi kesalahan saat menghapus kategori pembayaran.',
          color: 'red',
        });
        console.error('Delete Debt Error:', data);
      }
    } catch (error) {
      notifications.show({
        title: 'Error Koneksi',
        message: 'Tidak dapat terhubung ke server untuk menghapus kategori pembayaran.',
        color: 'red',
      });
      console.error('Network Error during delete debt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (debt) => {
    setEditingDebt(debt);
    setDebtName(debt.name);
    setDebtDescription(debt.description);
    setModalOpened(true);
  };

  if (isAuthLoading || !currentUser || currentUser.role !== 'superadmin') {
    return (
      <Group position="center" style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
        <Text>Memuat halaman manajemen...</Text>
      </Group>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
      <Stack spacing="xl">
        <Group position="apart">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>&larr; Kembali ke Dashboard</Button>
          <Title order={2}>Kelola Kategori Pembayaran</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={() => { setEditingDebt(null); setDebtName(''); setDebtDescription(''); setModalOpened(true); }}>
            Tambah Baru
          </Button>
        </Group>

        <TextInput
          placeholder="ITATS"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          clearable
          mt="md"
        />

        {loading ? (
          <Group position="center" style={{ minHeight: 200 }}>
            <Loader size="lg" />
            <Text>Memuat kategori pembayaran...</Text>
          </Group>
        ) : filteredDebts.length === 0 ? (
          <Text align="center" size="lg" color="dimmed" mt="md">
            Tidak ada kategori pembayaran yang tersedia dengan filter saat ini.
          </Text>
        ) : (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredDebts.map((debt) => (
                <tr key={debt.id}>
                  <td>{debt.name}</td>
                  <td>{debt.description}</td>
                  <td>
                    <Group spacing="xs">
                      <Button size="sm" variant="light" color="blue" onClick={() => handleEditClick(debt)} leftSection={<IconEdit size={14} />}>
                        Edit
                      </Button>
                      <Button size="sm" variant="light" color="red" onClick={() => handleDeleteDebt(debt.id)} leftSection={<IconTrash size={14} />}>
                        Hapus
                      </Button>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Stack>

      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title={editingDebt ? "Edit Kategori Pembayaran" : "Tambah Kategori Pembayaran"}>
        <Stack spacing="md">
          <TextInput
            label="Nama Kategori"
            placeholder="Contoh: SPP, Non-SPP"
            value={debtName}
            onChange={(event) => setDebtName(event.currentTarget.value)}
            required
          />
          <TextInput
            label="Deskripsi Kategori"
            placeholder="Contoh: Biaya Penyelenggaraan Pendidikan"
            value={debtDescription}
            onChange={(event) => setDebtDescription(event.currentTarget.value)}
            required
          />
          <Button onClick={handleSaveDebt} loading={loading}>
            {editingDebt ? 'Simpan Perubahan' : 'Tambah Kategori'}
          </Button>
        </Stack>
      </Modal>
    </div>
  );
}

export default DebtManagementPage;
