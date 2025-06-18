import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyUsers, setCurrentUser } from '../data/dummyData';
import {
  TextInput, // Input teks Mantine
  PasswordInput, // Input password Mantine
  Button, // Tombol Mantine
  Paper, // Wadah mirip kartu Mantine
  Title, // Judul Mantine
  Text, // Teks Mantine
  Anchor, // Tautan Mantine
  Stack, // Untuk mengatur elemen secara vertikal
  Group // Untuk mengatur elemen secara horizontal
} from '@mantine/core'; // Import komponen Mantine
import { notifications } from '@mantine/notifications'; // Untuk notifikasi

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const foundUser = dummyUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      // Ganti alert() dengan notifikasi Mantine
      notifications.show({
        title: 'Login Berhasil!',
        message: `Selamat datang, ${foundUser.name}.`,
        color: 'green',
      });
      navigate('/dashboard');
    } else {
      // Ganti alert() dengan notifikasi Mantine
      notifications.show({
        title: 'Login Gagal',
        message: 'Username atau Password salah!',
        color: 'red',
      });
    }
  };

  return (
    // Paper adalah komponen wadah dengan shadow dan rounded corners
    <Paper shadow="xl" radius="md" p="xl" style={{ maxWidth: 400, margin: '50px auto', textAlign: 'center' }}>
      <Stack align="center" spacing="lg"> {/* Stack untuk menyusun elemen secara vertikal */}
        <Title order={2}>Login Aplikasi SPP</Title> {/* Judul Mantine */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Stack spacing="md">
            <TextInput
              label="NIM / Username"
              placeholder="Masukkan NIM atau Username Anda"
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
              required
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
            <Button type="submit" size="md" fullWidth mt="md"> {/* Tombol Mantine */}
              Login
            </Button>
          </Stack>
        </form>
        <Text size="sm">
          Belum punya akun?{' '}
          <Anchor component="button" size="sm" onClick={() => console.log('Arahkan ke halaman daftar')}> {/* Tautan Mantine */}
            Daftar di sini
          </Anchor>
        </Text>
      </Stack>
    </Paper>
  );
}

export default LoginPage;