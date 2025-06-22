// src/pages/BillingManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import {
  Title,
  Text,
  Button,
  Table,
  Group,
  Stack,
  Loader,
  Modal,
  TextInput,
  NumberInput,
  Select,
  Badge
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { API_BASE_URL } from '../config/api';
import { IconEdit, IconTrash, IconPlus, IconSearch } from '@tabler/icons-react';

function BillingManagementPage() {
  const navigate = useNavigate();
  const { currentUser, apiToken, isAuthLoading } = usePayment();
  const [allBillings, setAllBillings] = useState([]);
  const [filteredBillings, setFilteredBillings] = useState([]);
  const [debts, setDebts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingBilling, setEditingBilling] = useState(null);

  // State untuk pencarian dan filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDebtId, setFilterDebtId] = useState('all');
  const [filterUserId, setFilterUserId] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form states (untuk modal tambah/edit)
  const [billingAmount, setBillingAmount] = useState('');
  const [billingDescription, setBillingDescription] = useState('');
  const [billingMonth, setBillingMonth] = useState(new Date().getMonth() + 1);
  const [billingYear, setBillingYear] = useState(new Date().getFullYear());
  const [billingDebtId, setBillingDebtId] = useState('');
  const [billingUserId, setBillingUserId] = useState('');
  const [billingStatus, setBillingStatus] = useState('unpaid');

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

  const fetchBillings = async () => {
    setLoading(true);
    if (!apiToken) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/v1/billings`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
      });

      const data = await response.json();
      console.log("Fetch Billings Response:", data);

      if (response.ok) {
        const fetchedBillings = Array.isArray(data.data) ? data.data : [];
        setAllBillings(fetchedBillings);
        notifications.show({
            title: 'Data Tagihan Dimuat',
            message: 'Daftar tagihan berhasil diambil.',
            color: 'green',
            autoClose: 2000
        });
      } else {
        notifications.show({
          title: 'Gagal Memuat Tagihan',
          message: data.message || 'Terjadi kesalahan saat mengambil data tagihan.',
          color: 'red',
        });
        console.error('Fetch Billings Error:', data);
        setAllBillings([]);
      }
    } catch (error) {
      notifications.show({
        title: 'Error Koneksi',
        message: 'Tidak dapat terhubung ke server untuk mengambil tagihan.',
        color: 'red',
      });
      console.error('Network Error during fetch billings:', error);
      setAllBillings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDebts = async () => {
    if (!apiToken) return;
    try {
      const response = await fetch(`${API_BASE_URL}/v1/debts`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data.data.debts)) {
        setDebts(data.data.debts.map(d => ({ value: d.id.toString(), label: d.name })));
      } else {
        console.error("Failed to fetch debts for dropdown:", data);
      }
    } catch (error) {
      console.error("Network error fetching debts for dropdown:", error);
    }
  };

  const fetchUsers = async () => {
    if (!apiToken) return;
    try {
      const response = await fetch(`${API_BASE_URL}/v1/superadmin/role/user`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data.data.users)) {
        setUsers(data.data.users.map(u => ({ value: u.id.toString(), label: `${u.name} (${u.email})` })));
      } else {
        console.error("Failed to fetch users for dropdown:", data);
      }
    } catch (error) {
      console.error("Network error fetching users for dropdown:", error);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && currentUser && currentUser.role === 'superadmin') {
      fetchBillings();
      fetchDebts();
      fetchUsers();
    }
  }, [apiToken, currentUser, isAuthLoading]);

  // useEffect untuk menerapkan pencarian dan filter
  useEffect(() => {
    let currentFiltered = allBillings;

    // Filter berdasarkan search term (deskripsi)
    if (searchTerm) {
      currentFiltered = currentFiltered.filter(item =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter berdasarkan debt_id
    if (filterDebtId !== 'all') {
      currentFiltered = currentFiltered.filter(item => item.debt_id?.toString() === filterDebtId);
    }

    // Filter berdasarkan user_id
    if (filterUserId !== 'all') {
      currentFiltered = currentFiltered.filter(item => item.user_id?.toString() === filterUserId);
    }

    // Filter berdasarkan status
    if (filterStatus !== 'all') {
      currentFiltered = currentFiltered.filter(item => item.status === filterStatus);
    }

    setFilteredBillings(currentFiltered);
  }, [allBillings, searchTerm, filterDebtId, filterUserId, filterStatus]);


  const handleSaveBilling = async () => {
    if (!billingAmount || !billingDescription || !billingDebtId || !billingUserId || !billingMonth || !billingYear) {
      notifications.show({
        title: 'Input Tidak Lengkap',
        message: 'Semua field harus diisi.',
        color: 'orange',
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('amount', billingAmount);
    formData.append('description', billingDescription);
    formData.append('month', billingMonth);
    formData.append('year', billingYear);
    formData.append('debt_id', billingDebtId);
    formData.append('user_id', billingUserId);
    formData.append('status', billingStatus);

    let url = `${API_BASE_URL}/v1/billings`;
    let method = 'POST';

    if (editingBilling) {
      url = `${API_BASE_URL}/v1/billings/${editingBilling.id}`;
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
      console.log("Save Billing Response:", data);

      if (response.ok) {
        notifications.show({
          title: editingBilling ? 'Berhasil Diperbarui' : 'Berhasil Ditambahkan',
          message: `Tagihan berhasil ${editingBilling ? 'diperbarui' : 'ditambahkan'}.`,
          color: 'green',
        });
        setModalOpened(false);
        setEditingBilling(null);
        // Reset form states
        setBillingAmount('');
        setBillingDescription('');
        setBillingMonth(new Date().getMonth() + 1);
        setBillingYear(new Date().getFullYear());
        setBillingDebtId('');
        setBillingUserId('');
        setBillingStatus('unpaid');
        fetchBillings(); // Refresh daftar billings
      } else {
        notifications.show({
          title: 'Gagal Menyimpan',
          message: data.message || `Terjadi kesalahan saat ${editingBilling ? 'memperbarui' : 'menambah'} tagihan.`,
          color: 'red',
        });
        console.error('Save Billing Error:', data);
      }
    } catch (error) {
      notifications.show({
        title: 'Error Koneksi',
        message: 'Tidak dapat terhubung ke server untuk menyimpan tagihan.',
        color: 'red',
      });
      console.error('Network Error during save billing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBilling = async (billingId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus tagihan ini?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/billings/${billingId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
      });

      const data = await response.json();
      console.log("Delete Billing Response:", data);

      if (response.ok) {
        notifications.show({
          title: 'Berhasil Dihapus',
          message: 'Tagihan berhasil dihapus.',
          color: 'green',
        });
        fetchBillings(); // Refresh daftar billings
      } else {
        notifications.show({
          title: 'Gagal Menghapus',
          message: data.message || 'Terjadi kesalahan saat menghapus tagihan.',
          color: 'red',
        });
        console.error('Delete Billing Error:', data);
      }
    } catch (error) {
      notifications.show({
        title: 'Error Koneksi',
        message: 'Tidak dapat terhubung ke server untuk menghapus tagihan.',
        color: 'red',
      });
      console.error('Network Error during delete billing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (billing) => {
    setEditingBilling(billing);
    setBillingAmount(billing.amount);
    setBillingDescription(billing.description);
    setBillingMonth(billing.month);
    setBillingYear(billing.year);
    setBillingDebtId(billing.debt_id ? billing.debt_id.toString() : '');
    setBillingUserId(billing.user_id ? billing.user_id.toString() : '');
    setBillingStatus(billing.status);
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
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <Stack spacing="xl">
        <Group position="apart">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>&larr; Kembali ke Dashboard</Button>
          <Title order={2}>Kelola Semua Tagihan</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={() => {
            setEditingBilling(null);
            setBillingAmount('');
            setBillingDescription('');
            setBillingMonth(new Date().getMonth() + 1);
            setBillingYear(new Date().getFullYear());
            setBillingDebtId('');
            setBillingUserId('');
            setBillingStatus('unpaid');
            setModalOpened(true);
          }}>
            Tambah Tagihan Baru
          </Button>
        </Group>

        {/* Search and Filter Inputs */}
        <Group grow spacing="md" mt="md">
          <TextInput
            placeholder="Cari berdasarkan deskripsi"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            clearable // Hapus ={true} karena prop clearable itu boolean
          />
          <Select
            placeholder="Filter Kategori"
            data={[{ value: 'all', label: 'Semua Kategori' }, ...debts]}
            value={filterDebtId}
            onChange={setFilterDebtId}
            clearable // Hapus ={true}
          />
          <Select
            placeholder="Filter Pengguna"
            data={[{ value: 'all', label: 'Semua Pengguna' }, ...users]}
            value={filterUserId}
            onChange={setFilterUserId}
            clearable // Hapus ={true}
          />
          <Select
            placeholder="Filter Status"
            data={[
              { value: 'all', label: 'Semua Status' },
              { value: 'unpaid', label: 'Belum Lunas' },
              { value: 'paid', label: 'Lunas' },
            ]}
            value={filterStatus}
            onChange={setFilterStatus}
            clearable // Hapus ={true}
          />
        </Group>

        {loading ? (
          <Group position="center" style={{ minHeight: 200 }}>
            <Loader size="lg" />
            <Text>Memuat daftar tagihan...</Text>
          </Group>
        ) : filteredBillings.length === 0 ? (
          <Text align="center" size="lg" color="dimmed" mt="md">
            Tidak ada tagihan yang tersedia dengan filter saat ini.
          </Text>
        ) : (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <thead>
              <tr>
                <th>ID</th>
                <th>Deskripsi</th>
                <th>Jumlah</th>
                <th>Bulan/Tahun</th>
                <th>Kategori (Debt)</th>
                <th>Untuk User</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* PERBAIKAN: Pastikan tidak ada whitespace di antara tag <td> di JSX */}
              {filteredBillings.map((billing) => (
                <tr key={billing.id}>
                  <td>{billing.id.substring(0, 8)}...</td>{/* Hapus spasi di sini */}
                  <td>{billing.description}</td>{/* Hapus spasi di sini */}
                  <td>Rp {billing.amount.toLocaleString('id-ID')}</td>{/* Hapus spasi di sini */}
                  <td>{billing.month}/{billing.year}</td>{/* Hapus spasi di sini */}
                  <td>{debts.find(d => d.value === billing.debt_id?.toString())?.label || 'Tidak Diketahui'}</td>{/* Hapus spasi di sini */}
                  <td>{users.find(u => u.value === billing.user_id?.toString())?.label || 'Tidak Diketahui'}</td>{/* Hapus spasi di sini */}
                  <td>
                    <Badge color={billing.status === 'paid' ? 'green' : billing.status === 'unpaid' ? 'orange' : 'gray'}>
                      {billing.status || 'Tidak Diketahui'}
                    </Badge>
                  </td>
                  <td>
                    <Group spacing="xs">
                      <Button size="sm" variant="light" color="blue" onClick={() => handleEditClick(billing)} leftSection={<IconEdit size={14} />}>
                        Edit
                      </Button>
                      <Button size="sm" variant="light" color="red" onClick={() => handleDeleteBilling(billing.id)} leftSection={<IconTrash size={14} />}>
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

      {/* Modal untuk Tambah/Edit Billing */}
      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title={editingBilling ? "Edit Tagihan" : "Tambah Tagihan Baru"}>
        <Stack spacing="md">
          <TextInput
            label="Deskripsi Tagihan"
            placeholder="Contoh: SPP Semester Ganjil 2024"
            value={billingDescription}
            onChange={(event) => setBillingDescription(event.currentTarget.value)}
            required
          />
          <NumberInput
            label="Jumlah (Amount)"
            placeholder="Contoh: 1500000"
            value={billingAmount}
            onChange={setBillingAmount}
            min={0}
            required
            hideControls
          />
          <Group grow>
            <NumberInput
              label="Bulan"
              placeholder="Bulan"
              value={billingMonth}
              onChange={setBillingMonth}
              min={1} max={12}
              required
            />
            <NumberInput
              label="Tahun"
              placeholder="Tahun"
              value={billingYear}
              onChange={setBillingYear}
              min={2000}
              required
            />
          </Group>
          <Select
            label="Kategori Pembayaran (Debt)"
            placeholder="Pilih Kategori"
            data={debts}
            value={billingDebtId}
            onChange={setBillingDebtId}
            required
            searchable
          />
          <Select
            label="Untuk Pengguna (User)"
            placeholder="Pilih Pengguna"
            data={users}
            value={billingUserId}
            onChange={setBillingUserId}
            required
            searchable
          />
          <Select
            label="Status Pembayaran"
            placeholder="Pilih Status"
            data={[
              { value: 'unpaid', label: 'Belum Lunas' },
              { value: 'paid', label: 'Lunas' },
            ]}
            value={billingStatus}
            onChange={setBillingStatus}
            required
          />
          <Button onClick={handleSaveBilling} loading={loading}>
            {editingBilling ? 'Simpan Perubahan' : 'Tambah Tagihan'}
          </Button>
        </Stack>
      </Modal>
    </div>
  );
}

export default BillingManagementPage;
