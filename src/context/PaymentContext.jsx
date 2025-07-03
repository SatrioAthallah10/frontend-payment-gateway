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
  const [transactions, setTransactions] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [apiToken, setApiToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const loadAuthSession = () => {
      const storedToken = localStorage.getItem('api_token');
      let storedUserString = localStorage.getItem('current_user');
      const storedTransactions = localStorage.getItem('transactions');

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
          if (storedTransactions) {
            const parsedTransactions = JSON.parse(storedTransactions);
            const validatedTransactions = parsedTransactions.map(t => ({
                ...t,
                totalAmount: typeof t.totalAmount === 'number' ? t.totalAmount : 0,
                items: Array.isArray(t.items) ? t.items : []
            }));
            setTransactions(validatedTransactions);
            console.log("Auth useEffect: Loaded transactions from localStorage:", validatedTransactions);
          } else {
            setTransactions([]);
            console.log("Auth useEffect: No transactions found in localStorage, initializing empty array.");
          }

        } catch (error) {
          notifications.show({
            title: 'Sesi Rusak',
            message: 'Sesi Anda tidak valid. Silakan login kembali.',
            color: 'orange',
          });
          localStorage.removeItem('api_token');
          localStorage.removeItem('current_user');
          localStorage.removeItem('transactions');
          console.error("Auth useEffect: Failed to parse stored user or transactions from localStorage, cleared.", error);
        }
      } else {
        setTransactions([]);
        console.log("Auth useEffect: No user session, initializing empty transactions array.");
      }
      setIsAuthLoading(false);
      console.log("Auth useEffect: Auth loading finished.");
    };

    loadAuthSession();
  }, []);

  useEffect(() => {
    if (transactions !== null) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
      console.log("Transactions useEffect: Transactions saved to localStorage:", transactions);
    }
  }, [transactions]);


  const login = (user, token) => {
    setCurrentUser(user);
    setApiToken(token);
    localStorage.setItem('api_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));
    console.log("Login function: User stored in localStorage.");
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
    localStorage.removeItem('transactions');
    setCartItems([]);
    setTransactions([]);
    console.log("Logout function: Sesi and transactions cleared from localStorage.");
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
                    status: 'Initiated',
                    snap_token: snap_token,
                    redirect_url: redirect_url,
                    billing_id: itemToPay.id,
                    order_id: billing.order_id
                };
                setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
                setCartItems([]);

                notifications.show({
                    title: 'Pembayaran Diinisiasi!',
                    message: `Mengarahkan Anda ke halaman pembayaran Midtrans untuk ${itemToPay.description}...`,
                    color: 'blue',
                    autoClose: 3000,
                });

                window.open(redirect_url, '_blank');
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
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  return useContext(PaymentContext);
};
