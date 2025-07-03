import { Container, Title, Text, Button, SimpleGrid, ThemeIcon, Group, Stack } from '@mantine/core';
import { IconUsers, IconReceipt2, IconReportAnalytics } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: <IconUsers size={28} />,
    title: 'Manajemen Data Terpusat',
    description: 'Kelola data mahasiswa dan petugas dengan mudah dalam satu platform yang terintegrasi dan aman.',
  },
  {
    icon: <IconReceipt2 size={28} />,
    title: 'Transaksi Pembayaran BPP',
    description: 'Proses pembayaran BPP menjadi lebih cepat dan efisien. Lakukan transaksi secara online dan tercatat otomatis.',
  },
  {
    icon: <IconReportAnalytics size={28} />,
    title: 'Laporan & Riwayat Transaksi',
    description: 'Akses riwayat pembayaran lengkap dan unduh laporan transaksi kapan saja untuk keperluan administrasi.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius="md"
        variant="gradient"
        gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
      >
        {feature.icon}
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <Container size="lg" py="xl">
      <Stack align="center" spacing="xl" style={{ textAlign: 'center' }}>
        <Title order={1} style={{ fontSize: '2.5rem' }}>
          Selamat Datang di Portal <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>Pembayaran</Text>
        </Title>

        <Text c="dimmed" style={{ maxWidth: '600px' }}>
          Solusi modern untuk mengelola dan membayar iuran universitas. Cepat, mudah, dan aman.
        </Text>

        <Group position="center" mt="md">
          <Button
            size="xl"
            variant="gradient"
            gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </Group>
      </Stack>

      <SimpleGrid
        cols={3}
        spacing="xl"
        mt={80}
        breakpoints={[{ maxWidth: 'md', cols: 1 }]}
      >
        {items}
      </SimpleGrid>
    </Container>
  );
}
