import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import {
  AppShell,
  Group,
  Button,
  Text,
  rem,
  useMantineTheme,
  ActionIcon,
  Title
} from '@mantine/core';
import { IconLogout, IconDashboard, IconShoppingCart, IconReport, IconUsers, IconCreditCard, IconListDetails } from '@tabler/icons-react';

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = usePayment();
  const theme = useMantineTheme();

  // Fungsi untuk mengambil nama depan dari string lengkap
  const getFirstName = (fullNameString) => {
    if (!fullNameString) return '';
    const parts = fullNameString.split(' - ');
    const namePart = parts.length > 1 ? parts[1] : fullNameString;
    const nameWords = namePart.trim().split(' ');
    const firstName = nameWords[0];

    if (!firstName) return '';
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };

  if (!currentUser) {
    return null;
  }

  const isAdmin = currentUser.role === 'superadmin';
  const displayName = getFirstName(currentUser.name);

  return (
    <AppShell.Header style={{ height: rem(60), padding: `0 ${rem(20)}` }}>
      <Group h="100%" justify="space-between">
        <Group>
          <Title order={3} style={{ color: theme.colors.blue[6] }}>
            INSTITUT TEKNOLOGI ADHI TAMA SURABAYA
          </Title>
        </Group>

        <Group spacing="md">
          <Button variant="subtle" leftSection={<IconDashboard size={18} />} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>

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

          <Group spacing="xs">
            {/* --- PERUBAHAN DI SINI --- */}
            <Text size="sm" c="dimmed">
              {displayName || currentUser.email}
            </Text>
            <ActionIcon variant="light" color="red" size="lg" radius="xl" onClick={logout}>
              <IconLogout size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </Group>
    </AppShell.Header>
  );
}

export default Navbar;
