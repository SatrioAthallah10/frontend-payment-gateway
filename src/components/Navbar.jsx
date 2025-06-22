// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import {
  AppShell,
  Burger,
  Group,
  Button,
  Text,
  rem,
  useMantineTheme,
  ActionIcon,
  Title // <<< --- TAMBAHKAN INI (Import komponen Title)
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconUserCircle, IconDashboard, IconShoppingCart, IconReport, IconUsers, IconCreditCard, IconListDetails } from '@tabler/icons-react';

function Navbar() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const { currentUser, logout } = usePayment();
  const theme = useMantineTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navbar tidak akan di-render jika tidak ada user, ini sudah di handle di AppRoutes
  if (!currentUser) {
    return null; 
  }

  const isAdmin = currentUser.role === 'superadmin';

  return (
    <AppShell.Header style={{ height: rem(60), padding: `0 ${rem(20)}` }}>
      <Group h="100%" justify="space-between">
        <Group>
          <Title order={3} style={{ color: theme.colors.blue[6] }}> {/* Baris 41 yang error */}
            INSTITUT TEKNOLOGI ADHI TAMA SURABAYA
          </Title>
        </Group>

        <Group spacing="md">
          {/* Tombol Navigasi Umum */}
          <Button variant="subtle" leftSection={<IconDashboard size={18} />} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>

          {/* Tombol Navigasi Mahasiswa */}
          {!isAdmin && (
            <>
              <Button variant="subtle" leftSection={<IconCreditCard size={18} />} onClick={() => navigate('/payments/spp')}>
                Pembayaran SPP
              </Button>
              <Button variant="subtle" leftSection={<IconCreditCard size={18} />} onClick={() => navigate('/payments/non-spp')}>
                Pembayaran Non-SPP
              </Button>
              <Button variant="subtle" leftSection={<IconShoppingCart size={18} />} onClick={() => navigate('/cart')}>
                Keranjang
              </Button>
              <Button variant="subtle" leftSection={<IconReport size={18} />} onClick={() => navigate('/reports')}>
                Laporan
              </Button>
            </>
          )}

          {/* Tombol Navigasi Admin */}
          {isAdmin && (
            <>
              <Button variant="subtle" leftSection={<IconListDetails size={18} />} onClick={() => navigate('/admin/debts')}>
                Kelola Kategori
              </Button>
              <Button variant="subtle" leftSection={<IconListDetails size={18} />} onClick={() => navigate('/admin/billings')}>
                Kelola Tagihan
              </Button>
              <Button variant="subtle" leftSection={<IconUsers size={18} />} onClick={() => navigate('/admin/users')}>
                Kelola Pengguna
              </Button>
            </>
          )}

          {/* User Info dan Logout */}
          <Group spacing="xs">
            <Text size="sm" c="dimmed" style={{ maxWidth: rem(120), overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser.name || currentUser.email}
            </Text>
            <ActionIcon variant="light" color="red" size="lg" radius="xl" onClick={handleLogout}>
              <IconLogout size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </Group>
    </AppShell.Header>
  );
}

export default Navbar;
