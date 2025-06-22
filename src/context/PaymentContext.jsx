// src/context/PaymentContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { dummyPaymentItems } from '../data/dummyData';
import { notifications } from '@mantine/notifications';
import { API_BASE_URL } from '../config/api';
import {
  Loader,
  Group,
  Text,
  Stack
} from '@mantine/core';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [apiToken, setApiToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const loadAuthSession = () => {
      const storedToken = localStorage.getItem('api_token');
      let storedUserString = localStorage.getItem('current_user');

      if (
        storedUserString === "undefined" ||
        storedUserString === "null" ||
        storedUserString === null ||
        storedUserString === ""
      ) {
          localStorage.removeItem('current_user');
          storedUserString = null;
      }

      if (storedToken && storedUserString) {
        try {
          const parsedUser = JSON.parse(storedUserString);
          setApiToken(storedToken);
          setCurrentUser(parsedUser);
        } catch (error) {
          notifications.show({
            title: 'Sesi Rusak',
            message: 'Sesi Anda tidak valid. Silakan login kembali.',
            color: 'orange',
          });
          localStorage.removeItem('api_token');
          localStorage.removeItem('current_user');
        }
      }
      setIsAuthLoading(false);
    };

    loadAuthSession();
  }, []);

  const login = (user, token) => {
    setCurrentUser(user);
    setApiToken(token);
    localStorage.setItem('api_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));
  };

  const logout = async () => {
    if (apiToken) {
      try {
        const response = await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiToken}`
          }
        });
        if (!response.ok) {
          notifications.show({
            title: 'Logout Dengan Peringatan',
            message: 'Logout berhasil di frontend, namun ada masalah di backend.',
            color: 'yellow',
          });
        }
      } catch (error) {
        notifications.show({
          title: 'Error Logout',
          message: 'Tidak dapat terhubung ke server saat logout.',
          color: 'red',
        });
      }
    }

    setCurrentUser(null);
    setApiToken(null);
    localStorage.removeItem('api_token');
    localStorage.removeItem('current_user');
    setCartItems([]);
    setTransactions([]);
  };

  const addToCart = (billingItem) => {
    if (billingItem && !cartItems.some(item => item.id === billingItem.id)) {
      setCartItems((prevItems) => [...prevItems, { ...billingItem, quantity: 1 }]);
      notifications.show({
        title: 'Item Ditambahkan!',
        message: `${billingItem.description} berhasil ditambahkan ke keranjang.`,
        color: 'blue',
        autoClose: 2000,
      });
    } else if (billingItem && cartItems.some(item => item.id === billingItem.id)) {
      notifications.show({
        title: 'Sudah Ada di Keranjang',
        message: `${billingItem.description} sudah ada di keranjang.`,
        color: 'orange',
        autoClose: 2000,
      });
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    notifications.show({
      title: 'Item Dihapus',
      message: 'Item berhasil dihapus dari keranjang.',
      color: 'red',
      autoClose: 2000,
    });
  };

  // FUNGSI checkPaymentStatus YANG DIPERBAIKI DENGAN KONFIRMASI TERAKHIR
  const checkPaymentStatus = async (billingId) => { // Menerima billingId
    if (!apiToken || !currentUser) {
        notifications.show({
            title: 'Sesi Tidak Valid',
            message: 'Anda harus login untuk mengecek status pembayaran.',
            color: 'red',
        });
        return false;
    }

    if (!billingId) { // Pengecekan tambahan untuk billingId
        console.error("checkPaymentStatus: billingId is missing.");
        notifications.show({
            title: 'Error Cek Status',
            message: 'ID Tagihan tidak ditemukan untuk cek status.',
            color: 'red',
        });
        return false;
    }

    try {
        // SESUAI KONFIRMASI TERAKHIR: POST ke URL dengan billingId di path, TANPA body
        const response = await fetch(`${API_BASE_URL}/v1/user/billings/check-status/${billingId}`, {
            method: 'POST', // Metode POST
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
            // Tidak ada 'body' di sini
        });

        const data = await response.json();
        console.log("Check Status Response:", data);

        // PERBAIKAN: Gunakan billingId untuk notifikasi
        const displayId = billingId ? billingId.substring(0,8) + '...' : 'Tagihan';

        if (response.ok && data.status === true) {
            // Asumsi Christian mengirim transaction_status di data.data.transaction_status
            const transactionStatusFromBackend = data.data?.transaction_status || 'unknown';

            if (transactionStatusFromBackend === 'settlement') {
                // Perbarui transaksi di state frontend (jika ada)
                setTransactions(prev => prev.map(t => t.billing_id === billingId ? { ...t, status: 'Paid' } : t));
                notifications.show({
                    title: 'Pembayaran Berhasil Dikonfirmasi!',
                    message: `Tagihan ID ${displayId} telah LUNAS.`,
                    color: 'green',
                    autoClose: 5000,
                });
                return true;
            } else {
                notifications.show({
                    title: 'Status Pembayaran',
                    message: `Tagihan ID ${displayId} : ${transactionStatusFromBackend.toUpperCase()}`,
                    color: 'yellow',
                    autoClose: 5000,
                });
                return false;
            }
        } else {
            notifications.show({
                title: 'Gagal Cek Status',
                message: data.message || `Terjadi kesalahan saat cek status untuk ID ${displayId}.`,
                color: 'red',
                autoClose: 5000,
            });
            return false;
        }
    } catch (error) {
        notifications.show({
            title: 'Error Koneksi',
            message: `Tidak dapat terhubung ke server untuk cek status ID ${displayId}.`,
            color: 'red',
            autoClose: 5000,
        });
        console.error('Network Error during check status:', error);
        return false;
    }
  };


  const checkout = async (userId, selectedBillings) => {
    if (selectedBillings.length === 0) {
      notifications.show({
        title: 'Keranjang Kosong',
        message: 'Keranjang kosong, tidak ada yang bisa dibayar.',
        color: 'yellow',
      });
      return false;
    }

    if (!apiToken || !currentUser) {
        notifications.show({
            title: 'Sesi Tidak Valid',
            message: 'Anda harus login untuk melakukan pembayaran.',
            color: 'red',
        });
        return false;
    }

    const itemToPay = selectedBillings[0];

    if (!itemToPay) {
        notifications.show({
            title: 'Keranjang Kosong',
            message: 'Tidak ada item valid untuk dibayar.',
            color: 'yellow',
        });
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/v1/user/billings/checkout/${itemToPay.id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
        });

        const data = await response.json();
        console.log("Midtrans Checkout Response for single item:", data);

        if (response.ok) {
            const { redirect_url, snap_token, billing } = data;

            if (redirect_url && snap_token && billing?.order_id) {
                const newTransaction = {
                    id: `TRX${Date.now()}`,
                    userId: currentUser.id,
                    items: [{ id: itemToPay.id, description: itemToPay.description, amount: itemToPay.amount }],
                    totalAmount: itemToPay.amount,
                    date: new Date().toISOString(),
                    status: 'Pending',
                    snap_token: snap_token,
                    redirect_url: redirect_url,
                    billing_id: itemToPay.id, // Simpan ID billing
                    order_id: billing.order_id // Simpan order_id
                };
                setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
                setCartItems([]);

                notifications.show({
                    title: 'Pembayaran Diinisiasi!',
                    message: `Mengarahkan Anda ke halaman pembayaran Midtrans untuk ${itemToPay.description}...`,
                    color: 'blue',
                    autoClose: 3000,
                });

                window.location.href = redirect_url;
                return true;
            } else {
                notifications.show({
                    title: 'Checkout Gagal',
                    message: 'Respons Midtrans tidak lengkap: URL redirect, Snap Token, atau Order ID tidak ditemukan.',
                    color: 'red',
                });
                return false;
            }

        } else {
            notifications.show({
                title: 'Checkout Gagal',
                message: data.message || 'Terjadi kesalahan saat menginisiasi pembayaran. Pastikan item belum dibayar.',
                color: 'red',
            });
            console.error('Midtrans Checkout Error:', data);
            return false;
        }
    } catch (error) {
      notifications.show({
          title: 'Error Koneksi',
          message: 'Tidak dapat terhubung ke server untuk inisiasi pembayaran.',
          color: 'red',
      });
      console.error('Network Error during Midtrans checkout:', error);
      return false;
    }
  };

  if (isAuthLoading) {
    return (
      <Group position="center" style={{ minHeight: '100vh', width: '100%', backgroundColor: '#f0f2f5' }}>
        <Stack align="center">
          <Loader size="xl" />
          <Text size="lg" color="dimmed">Memuat sesi...</Text>
        </Stack>
      </Group>
    );
  }

  return (
    <PaymentContext.Provider value={{
      cartItems,
      transactions,
      currentUser,
      apiToken,
      login,
      logout,
      addToCart,
      removeFromCart,
      checkout,
      checkPaymentStatus
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  return useContext(PaymentContext);
};
