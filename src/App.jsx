// src/App.jsx
import React from 'react';
import { AppShell } from '@mantine/core';
import AppRoutes from './routes/Routes';
// import Navbar from './components/Navbar'; // HAPUS IMPOR INI
// import { usePayment } from './context/PaymentContext'; // HAPUS IMPOR INI jika tidak digunakan lagi di App.jsx

function App() {
  // const { currentUser } = usePayment(); // HAPUS ATAU KOMENTARI INI jika tidak digunakan lagi di App.jsx

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      {/* Navbar tidak lagi dirender di sini. Akan dirender di AppRoutes.jsx */}
      {/* {currentUser && <Navbar />} */}

      <AppShell.Main>
        <AppRoutes /> {/* AppRoutes akan mengelola rendering Navbar */}
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
