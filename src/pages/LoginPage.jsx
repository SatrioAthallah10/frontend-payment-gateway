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
  Group,
  Loader
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { API_BASE_URL } from '../config/api';
import { usePayment } from '../context/PaymentContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = usePayment();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const user = data.data?.user;
        const apiToken = data.data?.token || data.data?.user?.token;

        console.log("LOGIN SUCCESS! Received raw data object:", data);
        console.log("LOGIN SUCCESS! Received user object:", user);
        console.log("LOGIN SUCCESS! Received API Token:", apiToken);

        if (user && apiToken) { 
          login(user, apiToken);

          notifications.show({
            title: 'Login Berhasil!',
            message: `Selamat datang, ${user.name || user.email}.`,
            color: 'green',
          });
          navigate('/dashboard');
        } else {
          notifications.show({
            title: 'Login Gagal: Data Tidak Lengkap',
            message: 'Respons dari server tidak menyediakan data user atau token yang lengkap.',
            color: 'red',
          });
          console.error('Login Error: Missing user or token in response', data);
        }

      } else {
        notifications.show({
          title: 'Login Gagal',
          message: data.message || 'Terjadi kesalahan saat login. Cek kredensial Anda.',
          color: 'red',
        });
        console.error('Login Error:', data);
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
        <Title order={2}>Login Aplikasi SPP</Title>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Stack spacing="md">
            <TextInput
              label="Email"
              placeholder="Masukkan Email Anda"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              required
              type="email"
              size="md"
            />
            <PasswordInput
              label="Password"
              placeholder="Masukkan Password Anda"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              required
              size="md"
            />
            <Button type="submit" size="md" fullWidth mt="md" loading={loading}>
              Login
            </Button>
          </Stack>
        </form>
        <Text size="sm">
          Belum punya akun?{' '}
          <Anchor component="button" size="sm" onClick={() => console.log('Arahkan ke halaman daftar')}>
            Daftar di sini
          </Anchor>
        </Text>
      </Stack>
    </Paper>
  );
}

export default LoginPage;
