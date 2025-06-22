<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# API Payment Gateway Finance University

## 📋 Overview

**API Payment Gateway Finance University** adalah RESTful API, platform inovatif yang menghubungkan sistem keuangan universitas dengan berbagai metode pembayaran digital. Proyek ini dibangun dengan Laravel, menyediakan solusi yang aman, skalabel, dan mudah terintegrasi untuk pengelolaan transaksi keuangan akademik.

## ✨ Features

- **Integrasi Multi-Payment**: Mendukung berbagai virtual account QRIS, dan bank bank lainnya
- **Keamanan Berlapis**: Enkripsi end-to-end dan kepatuhan terhadap standar signature payment gateway
- **Webhook & Notifikasi**: Sistem notifikasi otomatis untuk status pembayaran secara real-time
- **Pembayaran Rekuren**: Untuk biaya kuliah baik BPP maupun Non BPP

## 🛠️ Prerequisites

### System Requirements

- **PHP 8.1 or higher**
- **Laravel 12.x**
- **MySQL 8.0+**
- **Composer 2.x**

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/christian1403/api_finance_univ.git

# Navigate to the project directory
cd api_finance_univ

# Composer install
composer install

# Copy from env.example into .env
cp .env.example .env

# Edit your config database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=finance_univ
DB_USERNAME=root
DB_PASSWORD=

# Generate New Key Laravel
php artisan key:generate
```
## 📘 Usage
Run the migration and seeder

```bash
php artisan migrate:refresh --seed
```

Run the project

```bash
php artisan serve
```

## 🛠️ How It Works

### Default User Admin

```bash
admin@admin.com
admin12345
```

### Default User

```bash
user@user.com
user12345
```

### Directory Structure

```bash
api_finance_univ/
├── app/
|    ├── Http/
|    |    ├── Controllers/      # Folder Controller
|    |    └── Resources/        # Folder Resource
|    └── Models/                # Folder Models
├── database/
|    ├── migrations/            # Folder Migrations
|    └── seeders/               # Folder Seeders
└── postman/                    # Folder Collections Postman
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

Developed by Kelompok 1 Institut Teknologi Adhi Tama Surabaya © 2025
