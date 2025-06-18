// src/data/dummyData.js

export const dummyUsers = [
  {
    id: 'MHS001',
    nim: '2022001',
    username: 'mahasiswa1',
    password: 'password123', // Hanya untuk simulasi frontend
    name: 'Budi Santoso',
    role: 'mahasiswa'
  },
  {
    id: 'ADM001',
    nim: 'ADMIN001', // Contoh NIM untuk admin
    username: 'admin1',
    password: 'adminpassword',
    name: 'Dewi Admin',
    role: 'admin'
  }
];

export const dummyPaymentItems = [
  // SPP Items
  {
    id: 'SPP001',
    name: 'SPP Semester Ganjil 2024/2025',
    amount: 3500000,
    type: 'SPP',
    status: 'Unpaid', // Status default
    nim_target: '2022001' // Target mahasiswa
  },
  {
    id: 'SPP002',
    name: 'SPP Semester Genap 2024/2025',
    amount: 3500000,
    type: 'SPP',
    status: 'Unpaid',
    nim_target: '2022001'
  },
  // Non-SPP Items
  {
    id: 'NSPP001',
    name: 'Dana Pengembangan Studi',
    amount: 1500000,
    type: 'Non-SPP',
    status: 'Unpaid',
    nim_target: '2022001'
  },
  {
    id: 'NSPP002',
    name: 'Iuran Kegiatan Mahasiswa',
    amount: 250000,
    type: 'Non-SPP',
    status: 'Unpaid',
    nim_target: '2022001'
  },
  {
    id: 'NSPP003',
    name: 'Ujian Susulan Matematika',
    amount: 100000,
    type: 'Non-SPP',
    status: 'Unpaid',
    nim_target: '2022001'
  },
  {
    id: 'NSPP004',
    name: 'Denda Keterlambatan Pembayaran SPP',
    amount: 50000,
    type: 'Non-SPP',
    status: 'Unpaid',
    nim_target: '2022001'
  }
];

z
export let currentUser = null;

export const setCurrentUser = (user) => {
  currentUser = user;
};