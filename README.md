# 📚 GedeBook: Sistem Review Buku

GedeBook adalah aplikasi web sederhana yang memungkinkan pengguna untuk **mendaftar**, **login**, **melihat daftar buku**, dan **memberikan ulasan (review)** terhadap buku. Aplikasi ini juga dilengkapi dengan **panel administrasi** untuk pengelolaan data.

---

## 🚀 Fitur Utama

Sistem ini dirancang untuk mendukung fungsionalitas utama berikut:

### 🔐 Autentikasi Pengguna
* Pendaftaran pengguna baru (`signup.html`)
* Login pengguna (`login.html`)

### 👤 Manajemen Profil
* Halaman profil pengguna (`profile.html`)

### 📚 Daftar Buku
* Menampilkan daftar buku utama (`index.html`)

### ✍️ Sistem Review
* Memungkinkan pengguna memberikan ulasan buku (diindikasikan oleh skema database `sistem_review_buku_e_8.sql`)

### 🛠️ Panel Administrasi
* Halaman khusus administrator untuk mengelola konten dan pengguna (`admin.html`)

---

## 🧰 Teknologi yang Digunakan

| Kategori | Teknologi |
| :--- | :--- |
| Frontend | HTML, CSS, JavaScript |
| Backend | PHP |
| Database | MySQL (melalui file `.sql`) |

---

## 📦 Instalasi

Untuk menjalankan proyek ini secara lokal, diperlukan web server yang mendukung **PHP** dan **MySQL**, seperti **XAMPP**, **Laragon**, atau **WAMP**.

### Langkah 1: Kloning Repositori
`https://github.com/ZackDoingAnything/GedeBook.git`
### Langkah 2: Pengaturan Database

1.  Buat database baru di MySQL.
    > Nama database: `sistem_review_buku_e_8`.
2.  Impor skema database menggunakan file:
    `sistem_review_buku_e_8.sql`

### Langkah 3: Konfigurasi Koneksi Database

1.  Buka file koneksi database:
    `db_connect.php`
2.  Sesuaikan kredensial database dengan konfigurasi lokal Anda:
    * Host database
    * Username database
    * Password database
    * Nama database

### Langkah 4: Menjalankan Aplikasi

1.  Pastikan Apache dan MySQL sudah berjalan.
2.  Akses aplikasi melalui browser:
    * **Halaman Utama**
        `http://localhost/path/to/GedeBook/index.html`
    * **Halaman Admin**
        `http://localhost/path/to/GedeBook/admin.html`

---

## 👨‍💻 Kontributor

Terima kasih kepada seluruh kontributor yang telah berpartisipasi dalam pengembangan GedeBook.

* Yonatan Adi Cahyoningrat
* Gracia Putri A.
* Saskia Pippi R. K.
* Gretelia Faustine
* Velin Ceria R.
