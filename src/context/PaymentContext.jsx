import React, { createContext, useState, useContext } from 'react';
import { dummyPaymentItems } from '../data/dummyData';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const addToCart = (itemId) => {
    const itemToAdd = dummyPaymentItems.find(item => item.id === itemId);
    if (itemToAdd && !cartItems.some(item => item.id === itemId)) {
      setCartItems((prevItems) => [...prevItems, { ...itemToAdd, quantity: 1 }]);
    } else if (itemToAdd && cartItems.some(item => item.id === itemId)) {
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
  };

  const checkout = (userId) => {
    if (cartItems.length === 0) {
      return false;
    }

    const newTransaction = {
      id: `TRX${Date.now()}`,
      userId: userId,
      items: cartItems.map(item => ({ id: item.id, name: item.name, amount: item.amount })),
      totalAmount: cartItems.reduce((sum, item) => sum + item.amount, 0),
      date: new Date().toISOString(),
      status: 'Paid',
    };

    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);

    cartItems.forEach(cartItem => {
      const originalItem = dummyPaymentItems.find(item => item.id === cartItem.id);
      if (originalItem) {
        originalItem.status = 'Paid';
      }
    });

    setCartItems([]); 
    return newTransaction;
  };

  return (
    <PaymentContext.Provider value={{ cartItems, transactions, addToCart, removeFromCart, checkout }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  return useContext(PaymentContext);
};