import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { MantineProvider } from '@mantine/core'; // Import MantineProvider
import { Notifications } from '@mantine/notifications'; // Import Notifications
import '@mantine/core/styles.css'; // Import gaya dasar Mantine
import '@mantine/notifications/styles.css'; // Import gaya notifikasi Mantine
import { PaymentProvider } from './context/PaymentContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="light"> {/* Tambahkan MantineProvider */}
      <Notifications />
      <PaymentProvider>
        <App />
      </PaymentProvider>
    </MantineProvider>
  </React.StrictMode>,
);