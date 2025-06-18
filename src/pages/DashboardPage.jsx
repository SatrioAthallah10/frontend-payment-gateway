import React from 'react';
import { useNavigate } from 'react-router-dom';
import { currentUser } from '../data/dummyData';
import { usePayment } from '../context/PaymentContext';

function DashboardPage() {
  const navigate = useNavigate();
  const { cartItems } = usePayment();
  const loggedInUser = currentUser;

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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Selamat Datang, {loggedInUser ? loggedInUser.name : 'Mahasiswa'}!</h1>
      <p style={styles.subtitle}>Ini adalah Dashboard Anda. Silakan pilih opsi pembayaran di bawah.</p>
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={handleSPPClick}>Pembayaran SPP</button>
        <button style={styles.button} onClick={handleNonSPPClick}>Pembayaran Non-SPP</button>
      </div>
      <div style={styles.buttonGroup}> 
        <button
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={handleViewCart}
        >
          Lihat Keranjang ({cartItems.length} item)
        </button>
        <button
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={handleViewReports}
        >
          Lihat Laporan
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#e9eff6',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '15px',
  },
  subtitle: {
    color: '#34495e',
    marginBottom: '30px',
    fontSize: '1.1em',
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
  },
  button: {
    padding: '15px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    transform: 'translateY(-2px)',
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
    marginBottom: '25px',
  },
  viewCartButton: {
    backgroundColor: '#17a2b8',
    '&:hover': {
      backgroundColor: '#138496',
    },
  },
  secondaryButton: {
    backgroundColor: '#17a2b8',
    '&:hover': {
      backgroundColor: '#138496',
    },
  },
};

export default DashboardPage;