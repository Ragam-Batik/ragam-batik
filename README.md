# Ragam Batik

### Welcome to Ragam Batik 👘

Sistem klasifikasi citra batik berbasis machine learning yang mampu mengenali jenis batik dan asal daerahnya secara otomatis melalui gambar. Proyek ini merupakan bagian dari capstone project DBS Coding Camp.

---

## 👥 Our Team

**Team ID: CC25-CF258**

| Name                     | Student ID     | Learning Path            | GitHub Link                                      |
|--------------------------|----------------|---------------------------|--------------------------------------------------|
| Maulidina Rahmawati      | MC009D5X2352   | Machine Learning          | [GitHub](https://github.com/mauliidna)          |
| Mohamad Farrel Aryansyah| MC009D5Y2453   | Machine Learning          | [GitHub](https://github.com/farrelaryansyah)    |
| Khansa Fakhirah Rifli    | MC009D5X2458   | Machine Learning          | [GitHub](https://github.com/Khansafr)           |
| Ramdhini Novita Sari     | FC009D5X2478   | Front-End & Back-End      | [GitHub](https://github.com/ramdhini)           |
| Soultan Amirul Mukminin  | FC156D5Y2082   | Front-End & Back-End      | [GitHub](https://github.com/soul222)            |
| Rahmat Angga Saputra     | FC009D5Y2482   | Front-End & Back-End      | [GitHub](https://github.com/Rahmade271)         |

---

## 📄 Project Documentation

### Machine Learning (ML)

Kami telah meningkatkan performa model **EfficientNet-B0** yang telah dilatih sebelumnya dengan menerapkan teknik augmentasi data dan mengintegrasikannya ke dalam arsitektur khusus yang disesuaikan dengan dataset dan tujuan spesifik kami. Model ini mampu meningkatkan akurasi klasifikasi dan mengurangi risiko overfitting.

### Model Architecture

| Layer (type)                                | Output Shape     | Parameters |
|---------------------------------------------|------------------|------------|
| mobilenetv2_1.00_224 (Functional)           | (None, 7, 7, 1280)| 2,257,984  |
| global_average_pooling2d_1                  | (None, 1280)     | 0          |
| dense_2                                     | (None, 128)      | 163,968    |
| dropout_1                                   | (None, 128)      | 0          |
| dense_3                                     | (None, 6)        | 774        |
| **Total Params**                            |                  | 2,422,726  |
| **Trainable Params**                        |                  | 164,742    |
| **Non-trainable Params**                    |                  | 2,257,984  |

![Training History](https://ragam-assets.s3.ap-southeast-2.amazonaws.com/Screenshot+2025-06-05+204539.jpg)

---

## 💻 Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge" height="45" alt="javascript logo"/>
  <img src="https://img.shields.io/badge/Webpack-8DD6F9?logo=webpack&logoColor=black&style=for-the-badge" height="45" alt="webpack logo"/>
  <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?logo=tailwindcss&logoColor=black&style=for-the-badge" height="45" alt="tailwindcss logo"/>
  <img src="https://img.shields.io/badge/Hapi.js-%23f06e00?style=for-the-badge&logo=hapi.js&logoColor=white" height="45" alt="hapi logo"/>
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=black&style=for-the-badge" height="45" alt="supabase logo"/>
  <img src="https://img.shields.io/badge/Amazon AWS-232F3E?logo=amazonwebservices&logoColor=FF9900&style=for-the-badge" height="45" alt="aws logo"/>
  <img src="https://img.shields.io/badge/NumPy-013243?logo=numpy&logoColor=white&style=for-the-badge" height="45" alt="numpy logo"/>
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?logo=tensorflow&logoColor=black&style=for-the-badge" height="45" alt="tensorflow logo"/>
  <img src="https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white&style=for-the-badge" height="45" alt="figma logo"/>
</div>

---

## 🖥️ Front-End & Back-End Overview

### Front-End
- Dibangun dengan **JavaScript**, dan **Module Bundler Webpack**
- Fokus pada tampilan responsif dan UI/UX ramah pengguna
- Menggunakan Figma sebagai tools utama untuk desain antarmuka
- Melakukan pemanggilan api dengan RestfullApi

### Back-End
- Menggunakan framework **Hapi.js**
- Autentikasi dan otorisasi pengguna
- API untuk interaksi dengan model machine learning
- Database disimpan melalui **Supabase**
- Integrasi penyimpanan menggunakan **Amazon S3 (AWS)**

## 🔗 Prototype

Kunjungi prototipe antarmuka aplikasi kami di Figma:
<a href="https://www.figma.com/proto/PhZxHOX9Sn2vgI3ryprj7Q/RagamBatik-Capstone?node-id=1058-120&starting-point-node-id=1058%3A120&t=cohs85TAtF1uewDD-1" target="_blank">👉 Klik untuk melihat prototype di Figma</a>

* Penjelasan front-end dan back-end
* Logo **Figma** dan **JavaScript**
* Link ke prototype (gantilah link Figma sesuai kebutuhan)
* Perbaikan struktur dan konsistensi Markdown

## ▶️ How to Use This App?

Sebelum memulai, pastikan Anda telah menginstal perangkat lunak berikut di komputer Anda:

  * [Node.js](https://nodejs.org/) (yang akan menyertakan `npm`)
  * Code Editor pilihan Anda (misalnya [Visual Studio Code](https://code.visualstudio.com/))
  * Web Browser (misalnya Chrome, Firefox, atau lainnya)

## Instalasi

Ikuti langkah-langkah berikut untuk menyiapkan dan menjalankan proyek di lingkungan lokal Anda.

1.  **Download File Proyek**
    Unduh file proyek dalam format ZIP dengan nama `Ragam-Batik-App.zip`.

2.  **Ekstrak File**
    Ekstrak konten dari file `Ragam-Batik-App.zip` ke direktori atau folder pilihan Anda.

3.  **Buka di Code Editor**
    Buka folder proyek yang telah diekstrak menggunakan code editor seperti Visual Studio Code.

4.  **Buka Terminal**
    Buka terminal terintegrasi di dalam code editor Anda. Di VS Code, Anda bisa membukanya melalui menu `Terminal` \> `New Terminal` atau dengan shortcut \`Ctrl+\`\`.

5.  **Install Dependencies**
    Jalankan perintah berikut di terminal untuk menginstal semua paket yang dibutuhkan oleh proyek:

    npm install

6.  **Build Aplikasi**
    Setelah instalasi selesai, jalankan perintah berikut untuk membangun (build) aplikasi:
 
    npm run build

7.  **Selesai**
    Sekarang aplikasi siap untuk dijalankan. Anda dapat melanjutkan ke langkah berikutnya untuk membuat akun.

## Membuat Akun & Login

Untuk dapat mengakses fitur lengkap dari aplikasi, Anda perlu membuat akun terlebih dahulu.

1.  **Pilih Menu Signup**
    Pada halaman utama aplikasi, cari dan klik tombol atau link **"Signup"** yang biasanya terdapat di bagian header atau navigasi.

2.  **Isi Formulir Pendaftaran**
    Lengkapi semua kolom yang tersedia pada formulir pendaftaran dengan data diri Anda.

3.  **Cek Email Konfirmasi**
    Buka kotak masuk dari alamat email yang Anda daftarkan. Cari email konfirmasi dari Ragam Batik App.

4.  **Klik Link Konfirmasi**
    Di dalam email tersebut, Anda akan menemukan link dengan tulisan seperti **"Confirm your mail"**. Klik link tersebut untuk memverifikasi akun Anda.

5.  **Lakukan Sign In Kembali**
    Setelah akun terverifikasi, kembali ke halaman aplikasi dan lakukan **Sign In** menggunakan email dan password yang telah Anda daftarkan.

6.  **Berhasil**
    Anda sekarang berhasil login dan dapat menikmati seluruh fitur di Ragam Batik App.

## Catatan Penting

Terkadang, proses pengiriman email konfirmasi dapat memakan waktu lebih lama dari yang diharapkan. Jika Anda ingin mencoba aplikasi tanpa harus menunggu email konfirmasi, Anda dapat menggunakan akun yang sudah kami siapkan dan verifikasi di bawah ini:

  * **Email**: `ridelaproject@gmail.com`
  * **Password**: `12345678`

dengan menggunakan email tersebut, anda sudah bisa mulai menjelajah perjalanan mu!.

-----

### Demo Video

**Coming Soon 🎥**
