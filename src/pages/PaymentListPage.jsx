import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyPaymentItems, currentUser } from '../data/dummyData';
import { usePayment } from '../context/PaymentContext';

function PaymentListPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { addToCart } = usePayment();
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [pageTitle, setPageTitle] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const currentNim = currentUser.nim;
    const paymentType = type.toUpperCase();

    const items = dummyPaymentItems.filter(
      (item) => item.type === paymentType && item.nim_target === currentNim
    );
    setFilteredPayments(items);

    setPageTitle(paymentType === 'SPP' ? 'Daftar Tagihan SPP' : 'Daftar Tagihan Non-SPP');
  }, [type, navigate]);

  const handleGoBack = () => {
    navigate('/dashboard'); 
  };

  const handleSelectPayment = (paymentId) => {
  addToCart(paymentId);
};

  if (!currentUser) {
    return null;
  }

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={handleGoBack}>&larr; Kembali ke Dashboard</button>
      <h1 style={styles.title}>{pageTitle}</h1>

      {filteredPayments.length === 0 ? (
        <p style={styles.noData}>Tidak ada tagihan {type.toUpperCase()} yang tersedia untuk Anda.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nama Tagihan</th>
                <th style={styles.th}>Jumlah</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((item) => (
                <tr key={item.id} style={styles.tr}>
                  <td style={styles.td}>{item.name}</td>
                  <td style={styles.td}>Rp {item.amount.toLocaleString('id-ID')}</td>
                  <td style={styles.td}>{item.status}</td>
                  <td style={styles.td}>
                    <button
                        style={styles.selectButton}
                        onClick={() => handleSelectPayment(item.id)}
                        disabled={item.status === 'Paid'}
                        >
                        {item.status === 'Paid' ? 'Sudah Dibayar' : 'Pilih'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    marginBottom: '25px',
  },
  noData: {
    color: '#777',
    fontSize: '1.1em',
    marginTop: '30px',
  },
  tableContainer: {
    width: '90%',
    maxWidth: '800px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    overflowX: 'auto',
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
  selectButton: {
    padding: '8px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#218838',
    },
    '&:disabled': {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    }
  }
};

export default PaymentListPage;