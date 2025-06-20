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

// Buat Context baru
const PaymentContext = createContext();

// Buat Provider untuk Context ini
export const PaymentProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [apiToken, setApiToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('api_token');
    let storedUserString = localStorage.getItem('current_user');

    console.log("Auth useEffect: Reading localStorage..."); // DEBUGGING
    console.log("Auth useEffect: storedToken =", storedToken); // DEBUGGING
    console.log("Auth useEffect: storedUserString (before check) =", storedUserString); // DEBUGGING

    if (storedUserString === "undefined" || storedUserString === null || storedUserString === "") {
        console.warn("Auth useEffect: Found invalid or empty string for 'current_user' in localStorage. Clearing it.");
        localStorage.removeItem('current_user');
        storedUserString = null;
    }

    if (storedToken && storedUserString) {
      try {
        console.log("Auth useEffect: Attempting JSON.parse on:", storedUserString); // DEBUGGING
        const parsedUser = JSON.parse(storedUserString);
        console.log("Auth useEffect: Successfully parsed user:", parsedUser); // DEBUGGING
        setApiToken(storedToken);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Auth useEffect: Failed to parse stored user from localStorage (corrupted JSON or other issue):", error);
        localStorage.removeItem('api_token');
        localStorage.removeItem('current_user');
        notifications.show({
          title: 'Sesi Rusak',
          message: 'Sesi Anda tidak valid. Silakan login kembali.',
          color: 'orange',
        });
      }
    }
    setIsAuthLoading(false);
    console.log("Auth useEffect: Auth loading finished. isAuthLoading set to false."); // DEBUGGING
  }, []);

  const login = (user, token) => {
    setCurrentUser(user);
    setApiToken(token);
    localStorage.setItem('api_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));
    console.log("Login function: User stored in localStorage:", JSON.stringify(user)); // DEBUGGING
  };

  const logout = async () => {
    // ... (kode logout tidak berubah) ...
    setCurrentUser(null);
    setApiToken(null);
    localStorage.removeItem('api_token');
    localStorage.removeItem('current_user');
    setCartItems([]);
    setTransactions([]);
    console.log("Logout function: Sesi cleared from localStorage."); // DEBUGGING
  };

  // ... (addToCart, removeFromCart, checkout tidak berubah) ...

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
      checkout
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  return useContext(PaymentContext);
};
