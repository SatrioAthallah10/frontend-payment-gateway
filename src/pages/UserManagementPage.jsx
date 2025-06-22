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
  Badge 
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { API_BASE_URL } from '../config/api';

function UserManagementPage() {
  const navigate = useNavigate();
  const { currentUser, apiToken, isAuthLoading } = usePayment();
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);

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

  const fetchUsers = async () => {
    setLoading(true);
    if (!apiToken) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/v1/superadmin/role/user`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
      });

      const data = await response.json();
      console.log("Fetch Users (Admin Page) Response:", data); 

      if (response.ok) {
        setUsers(Array.isArray(data.data.users) ? data.data.users : []);
        notifications.show({
            title: 'Data User Dimuat',
            message: 'Daftar pengguna berhasil diambil.',
            color: 'green',
            autoClose: 2000
        });
      } else {
        notifications.show({
          title: 'Gagal Memuat User',
          message: data.message || 'Terjadi kesalahan saat mengambil data pengguna.',
          color: 'red',
        });
        console.error('Fetch Users Error:', data);
        setUsers([]);
      }
    } catch (error) {
      notifications.show({
        title: 'Error Koneksi',
        message: 'Tidak dapat terhubung ke server untuk mengambil pengguna.',
        color: 'red',
      });
      console.error('Network Error during fetch users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && currentUser && currentUser.role === 'superadmin') {
      fetchUsers();
    }
  }, [apiToken, currentUser, isAuthLoading]);

  if (isAuthLoading || !currentUser || currentUser.role !== 'superadmin') {
    return (
      <Group position="center" style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
        <Text>Memuat halaman manajemen...</Text>
      </Group>
    );
  }

  return (
    <Paper shadow="xl" radius="md" p="xl" style={{ maxWidth: 1000, margin: '50px auto' }}>
      <Stack spacing="xl">
        <Group position="apart">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>&larr; Kembali ke Dashboard</Button>
          <Title order={2}>Kelola Pengguna (Mahasiswa)</Title>
        </Group>

        {loading ? (
          <Group position="center" style={{ minHeight: 200 }}>
            <Loader size="lg" />
            <Text>Memuat daftar pengguna...</Text>
          </Group>
        ) : users.length === 0 ? (
          <Text align="center" size="lg" color="dimmed" mt="md">
            Tidak ada pengguna terdaftar dengan role 'user' yang tersedia.
          </Text>
        ) : (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge color={user.role === 'superadmin' ? 'grape' : 'blue'}>
                      {user.role}
                    </Badge>
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

export default UserManagementPage;
