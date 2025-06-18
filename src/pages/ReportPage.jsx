import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import { currentUser } from '../data/dummyData';

function ReportPage() {
  const { transactions } = usePayment();
  const navigate = useNavigate();
  const userTransactions = transactions.filter(
    (transaction) => transaction.userId === currentUser?.id
  );

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate('/dashboard')}>&larr; Kembali ke Dashboard</button>
      <h1 style={styles.title}>Laporan Riwayat Pembayaran</h1>

      {!currentUser ? (
        <p style={styles.message}>Anda harus login untuk melihat laporan ini. <a href="/" style={styles.link}>Login sekarang</a></p>
      ) : userTransactions.length === 0 ? (
        <p style={styles.message}>Belum ada transaksi pembayaran yang tercatat untuk Anda.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID Transaksi</th>
                <th style={styles.th}>Tanggal</th>
                <th style={styles.th}>Deskripsi Pembayaran</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {userTransactions.map((trx) => (
                <tr key={trx.id} style={styles.tr}>
                  <td style={styles.td}>{trx.id}</td>
                  <td style={styles.td}>{new Date(trx.date).toLocaleDateString('id-ID')}</td>
                  <td style={styles.td}>
                    <ul>
                      {trx.items.map((item, index) => (
                        <li key={index}>{item.name} (Rp {item.amount.toLocaleString('id-ID')})</li>
                      ))}
                    </ul>
                  </td>
                  <td style={styles.td}>Rp {trx.totalAmount.toLocaleString('id-ID')}</td>
                  <td style={{ ...styles.td, color: trx.status === 'Paid' ? '#28a745' : '#dc3545' }}>
                    {trx.status}
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
    marginBottom: '30px',
  },
  message: {
    color: '#777',
    fontSize: '1.2em',
    marginTop: '50px',
    textAlign: 'center',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  tableContainer: {
    width: '90%',
    maxWidth: '900px',
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
    verticalAlign: 'top',
  },
  tr: {
    '&:nth-child(even)': {
      backgroundColor: '#f9f9f9',
    },
  },
};

export default ReportPage;