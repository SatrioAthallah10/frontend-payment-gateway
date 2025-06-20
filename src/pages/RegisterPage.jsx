// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Anchor,
  Stack,
  Loader // Mantine Loader untuk feedback loading
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { API_BASE_URL } from '../config/api';
import { usePayment } from '../context/PaymentContext'; // Untuk menggunakan fungsi login setelah registrasi

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = usePayment(); // Dapatkan fungsi login dari context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    // Jika backend membutuhkan password_confirmation, tambahkan juga di sini
    // formData.append('password_confirmation', password); // Ini jika backend butuh konfirmasi password

    try {
      const response = await fetch(`${API_BASE_URL}/register`, { // Panggil endpoint register
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json(); // Parse respons JSON

      if (response.ok) { // Status 200 OK atau 201 Created
        // Asumsi backend mengembalikan user data dan token setelah registrasi
        const user = data.user;
        const apiToken = data.token;

        login(user, apiToken); // Panggil fungsi login dari context untuk menyimpan sesi

        notifications.show({
          title: 'Registrasi Berhasil!',
          message: `Akun ${user?.name || email} berhasil dibuat. Anda sekarang login.`,
          color: 'green',
        });
        navigate('/dashboard'); // Arahkan ke dashboard setelah registrasi dan login
      } else { // Status error (4xx, 5xx)
        notifications.show({
          title: 'Registrasi Gagal',
          message: data.message || 'Terjadi kesalahan saat registrasi.',
          color: 'red',
        });
        console.error('Registration Error:', data);
      }
    } catch (error) {
      notifications.show({
        title: 'Error Koneksi',
        message: 'Tidak dapat terhubung ke server. Pastikan backend berjalan.',
        color: 'red',
      });
      console.error('Network or Parse Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper shadow="xl" radius="md" p="xl" style={{ maxWidth: 400, margin: '50px auto', textAlign: 'center' }}>
      <Stack align="center" spacing="lg">
        <Title order={2}>Daftar Akun Baru</Title>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Stack spacing="md">
            <TextInput
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap Anda"
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
              required
              size="md"
            />
            <TextInput
              label="Email"
              placeholder="Masukkan alamat email Anda"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              required
              type="email"
              size="md"
            />
            <PasswordInput
              label="Password"
              placeholder="Buat password Anda"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              required
              size="md"
            />
            {/* Jika backend Anda membutuhkan password_confirmation, tambahkan ini:
            <PasswordInput
              label="Konfirmasi Password"
              placeholder="Ulangi password Anda"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.currentTarget.value)}
              required
              size="md"
            />
            */}
            <Button type="submit" size="md" fullWidth mt="md" loading={loading}>
              Daftar
            </Button>
          </Stack>
        </form>
        <Text size="sm">
          Sudah punya akun?{' '}
          <Anchor component="button" size="sm" onClick={() => navigate('/')}>
            Login di sini
          </Anchor>
        </Text>
      </Stack>
    </Paper>
  );
}

export default RegisterPage;
