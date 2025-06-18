import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import { currentUser } from '../data/dummyData';
function CartPage() {
  const { cartItems, removeFromCart, checkout } = usePayment();
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce((sum, item) => sum + item.amount, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Keranjang Anda kosong. Silakan pilih tagihan terlebih dahulu.');
      return;
    }

    if (!currentUser) {
      alert('Anda harus login untuk melakukan checkout.');
      navigate('/');
      return;
    }

    const transaction = checkout(currentUser.id);
    if (transaction) {
      alert('Pembayaran berhasil! Mengarahkan ke halaman laporan.');
      navigate('/reports');
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate('/dashboard')}>&larr; Kembali ke Dashboard</button>
      <h1 style={styles.title}>Keranjang Pembayaran Anda</h1>

      {cartItems.length === 0 ? (
        <p style={styles.emptyCartMessage}>Keranjang Anda kosong. Silakan pilih tagihan dari halaman SPP/Non-SPP.</p>
      ) : (
        <div style={styles.cartContent}>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nama Tagihan</th>
                  <th style={styles.th}>Jumlah</th>
                  <th style={styles.th}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} style={styles.tr}>
                    <td style={styles.td}>{item.name}</td>
                    <td style={styles.td}>Rp {item.amount.toLocaleString('id-ID')}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.removeButton}
                        onClick={() => removeFromCart(item.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Total Pembayaran:</h2>
            <p style={styles.totalAmount}>Rp {totalAmount.toLocaleString('id-ID')}</p>
            <button
              style={styles.checkoutButton}
              onClick={handleCheckout}
            >
              Bayar Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: '20px',
    padding: '10px 15px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  title: {
    color: '#333',
    marginBottom: '30px',
  },
  emptyCartMessage: {
    color: '#777',
    fontSize: '1.2em',
    marginTop: '50px',
    textAlign: 'center',
  },
  cartContent: {
    width: '90%',
    maxWidth: '800px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '30px',
  },
  tableContainer: {
    overflowX: 'auto',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '15px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
    backgroundColor: '#007bff',
    color: 'white',
  },
  td: {
    padding: '15px',
    borderBottom: '1px solid #eee',
    textAlign: 'left',
    color: '#555',
  },
  tr: {
    '&:nth-child(even)': {
      backgroundColor: '#f9f9f9',
    },
  },
  removeButton: {
    padding: '8px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#c82333',
    },
  },
  summary: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
    textAlign: 'right',
  },
  summaryTitle: {
    color: '#333',
    marginBottom: '10px',
  },
  totalAmount: {
    fontSize: '1.8em',
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: '20px',
  },
  checkoutButton: {
    padding: '15px 30px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.2em',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    '&:hover': {
      backgroundColor: '#218838',
      transform: 'translateY(-2px)',
    },
  },
};

export default CartPage;