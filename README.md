# GedeBook: Sistem Review Buku

GedeBook adalah aplikasi web sederhana yang memungkinkan pengguna untuk **mendaftar**, **login**, **melihat daftar buku**, dan **memberikan ulasan (review)** terhadap buku.  
Aplikasi ini juga dilengkapi dengan **panel administrasi** untuk pengelolaan data.

---

## 🚀 Fitur Utama

Sistem ini dirancang untuk mendukung fungsionalitas utama berikut:

### 🔐 Autentikasi Pengguna
- Pendaftaran pengguna baru (`signup.html`)
- Login pengguna (`login.html`)

### 👤 Manajemen Profil
- Halaman profil pengguna (`profile.html`)

### 📚 Daftar Buku
- Menampilkan daftar buku utama (`index.html`)

### ✍️ Sistem Review
- Memungkinkan pengguna memberikan ulasan buku  
  (diindikasikan oleh skema database `sistem_review_buku_e_8.sql`)

### 🛠️ Panel Administrasi
- Halaman khusus administrator untuk mengelola konten dan pengguna (`admin.html`)

---

## 🧰 Teknologi yang Digunakan

Proyek ini menggunakan tumpukan teknologi berikut:

| Kategori   | Teknologi                     | Persentase Kode |
|-----------|-------------------------------|-----------------|
| Frontend  | HTML, CSS, JavaScript          | 79.5%           |
| Backend   | PHP                            | 20.5%           |
| Database  | MySQL (melalui file `.sql`)    | -               |

---

## 📦 Instalasi

Untuk menjalankan proyek ini secara lokal, diperlukan web server yang mendukung **PHP** dan **MySQL**, seperti **XAMPP**, **Laragon**, atau **WAMP**.

### Langkah 1: Kloning Repositori

```bash
git clone https://github.com/ZackDoingAnything/GedeBook.git
cd GedeBook
