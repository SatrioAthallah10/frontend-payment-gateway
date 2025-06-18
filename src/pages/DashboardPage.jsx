import React from 'react';
import { useNavigate } from 'react-router-dom';
import { currentUser } from '../data/dummyData';
import { usePayment } from '../context/PaymentContext';
import {
  Paper,    // Wadah dengan shadow dan radius
  Title,    // Judul
  Text,     // Teks
  Button,   // Tombol
  Group,    // Untuk mengatur elemen secara horizontal
  Stack     // Untuk mengatur elemen secara vertikal
} from '@mantine/core'; // Import komponen Mantine

function DashboardPage() {
  const navigate = useNavigate();
  const { cartItems } = usePayment();
  const loggedInUser = currentUser;

  React.useEffect(() => {
    if (!loggedInUser) {
      navigate('/');
    }
  }, [loggedInUser, navigate]);

  const handleSPPClick = () => {
    navigate('/payments/spp');
  };

  const handleNonSPPClick = () => {
    navigate('/payments/non-spp');
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  const handleViewReports = () => {
    navigate('/reports');
  };

  if (!loggedInUser) {
    return <Text align="center" mt="xl">Memuat...</Text>;
  }

  return (
    // Paper adalah kontainer utama yang memberikan styling seperti kartu
    <Paper shadow="xl" radius="md" p="xl" style={{ maxWidth: 800, margin: '50px auto', textAlign: 'center' }}>
      <Stack align="center" spacing="xl"> {/* Stack untuk vertikal alignment */}
        <Title order={1}>Selamat Datang, {loggedInUser.name}!</Title> {/* Title Mantine */}
        <Text size="lg" color="dimmed">
          Ini adalah Dashboard Anda. Silakan pilih opsi pembayaran di bawah.
        </Text>

        {/* Grup tombol untuk pembayaran SPP/Non-SPP */}
        <Group spacing="md" position="center" mt="lg"> {/* Group untuk horizontal alignment */}
          <Button size="lg" onClick={handleSPPClick}>
            Pembayaran SPP
          </Button>
          <Button size="lg" onClick={handleNonSPPClick}>
            Pembayaran Non-SPP
          </Button>
        </Group>

        {/* Grup tombol untuk keranjang dan laporan */}
        <Group spacing="md" position="center" mt="md">
          <Button variant="outline" size="md" onClick={handleViewCart}>
            Lihat Keranjang ({cartItems.length} item)
          </Button>
          <Button variant="outline" size="md" onClick={handleViewReports}>
            Lihat Laporan
          </Button>
        </Group>
        
        {/* Nanti kita bisa tambahkan lebih banyak konten, seperti informasi tagihan mendesak, dll. */}
      </Stack>
    </Paper>
  );
}

export default DashboardPage;
