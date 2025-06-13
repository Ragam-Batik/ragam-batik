# Ragam Batik 🧵👘
> **Preserving Indonesian Heritage Through AI Innovation**

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/Platform-Web%20App-blue?style=for-the-badge" alt="Platform"/>
  <img src="https://img.shields.io/badge/AI-Machine%20Learning-orange?style=for-the-badge" alt="AI"/>
  <img src="https://img.shields.io/badge/License-Open%20Source-yellow?style=for-the-badge" alt="License"/>
</div>
<br>
Selamat datang di <b>Ragam Batik</b>, sebuah platform nirlaba yang didedikasikan untuk mendukung pelestarian warisan budaya Indonesia. Misi kami adalah mempermudah masyarakat dalam mengenali beragam motif batik serta asal daerahnya melalui teknologi machine learning, sehingga budaya batik dapat lebih dikenal, dipelajari, dan dilestarikan oleh generasi masa kini dan yang akan datang.

---
## 🎯 **Visi & Dampak**

### Misi Kami
Memberdayakan masyarakat, khususnya generasi muda, untuk mengenal, mempelajari, dan melestarikan budaya batik Indonesia melalui platform cerdas yang secara otomatis mengidentifikasi motif batik dan asal daerahnya.

### Mengapa Ini Penting
- **Pelestarian Budaya**: Menjaga warisan batik Indonesia yang diakui UNESCO
- **Edukasi**: Membuat pengetahuan tradisional mudah diakses melalui teknologi
- **Dampak Ekonomi**: Mendukung pengrajin lokal dan industri batik
- **Jangkauan Global**: Memperkenalkan budaya Indonesia ke dunia

---
## 🧵 Cara Kerja

1. **Daftar & Masuk:** Buat akun atau login ke platform untuk mulai menggunakan fitur klasifikasi batik.
   
2. **Unggah Gambar Batik:** Unggah foto batik dari galeri atau kamera Anda.

3. **Deteksi Otomatis:** Sistem memproses gambar dan menampilkan jenis motif serta daerah asalnya.

4. **Pelajari Budayanya:** Lihat informasi lengkap tentang filosofi, sejarah, rekomendasi penggunaannya dan ciri khas motif tersebut.


## 🛠 Fitur

- **Antarmuka Ramah Pengguna:** Navigasi yang mudah dan intuitif.

- **Klasifikasi Otomatis:** Didukung model machine learning yang akurat dan terus ditingkatkan.

- **Informasi Edukatif:** Detail tentang makna, sejarah, dan penggunaan di setiap motif batik yang dikenali.

- **Basis Data Berkembang:** Dukungan berbagai motif dari berbagai daerah Indonesia.

## 🤝 Ayo Terlibat

- **Gunakan Aplikasinya:** Coba sistem klasifikasi batik dan eksplorasi budaya Nusantara.

- **Kontribusi Data:** Kirim gambar batik yang belum dikenali untuk membantu pengembangan sistem.

- **Sebarkan Budaya:** Bagikan platform ini dan ajak orang lain untuk ikut melestarikan batik

## 📬 Hubungi Kami  
Untuk pertanyaan, saran, atau kerja sama:  
📧 [support@ragambatik.id](mailto:support@ragambatik.id)

## 🙏 Dukung Misi Kami  
Mari lestarikan kekayaan budaya Indonesia. Gunakan, dukung, dan sebarkan **Ragam Batik** demi batik yang semakin dikenal dunia.

🔗 [Coba Sekarang](https://ragambatik.app)

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

Performa model ditingkatkan dengan menerapkan beberapa teknik utama:

1.  **Transfer Learning & Fine-Tuning**: Kami menggunakan model **MobileNetV2** yang telah dilatih pada dataset ImageNet sebagai dasar. Seluruh lapisan pada model dasar ini "dibuka" kembali (_unfreeze_) dan dilatih ulang (_fine-tuning_) pada dataset batik untuk menyesuaikan kemampuannya secara spesifik dalam mengenali pola-pola unik batik.
    
2.  **Augmentasi Data**: Untuk meningkatkan generalisasi model dan mengurangi risiko _overfitting_, kami menerapkan augmentasi data secara ekstensif pada set pelatihan. Teknik yang digunakan meliputi:
    
    -   Rotasi (`rotation_range=20`)
    -   Pergeseran lebar & tinggi (`width_shift_range=0.1`, `height_shift_range=0.1`)
    -   Zoom (`zoom_range=0.15`)
    -   Geser (`shear_range=0.15`)
    -   Balik horizontal (`horizontal_flip=True`)
    -   Penyesuaian kecerahan (`brightness_range=[0.8, 1.2]`)

3.  **Penanganan Ketidakseimbangan Kelas**: Dataset yang digunakan memiliki jumlah gambar yang tidak merata antar kelas. Untuk mengatasi ini, kami menggunakan `class_weight='balanced'` selama pelatihan agar model tidak bias terhadap kelas mayoritas.
    
### Arsitektur Model

Model ini terdiri dari **MobileNetV2** sebagai *base model* dan beberapa lapisan kustom (*custom head*) sebagai klasifikator akhir.

| **Lapisan (Tipe)**           | **Output Shape**   | **Keterangan**                                      |
|-----------------------------|--------------------|-----------------------------------------------------|
| **MobileNetV2 (Base Model)**| (None, 7, 7, 1280)  | Pengekstrak fitur utama. Seluruhnya *trainable*.    |
| GlobalAveragePooling2D      | (None, 1280)        | Meringkas fitur menjadi vektor.                     |
| BatchNormalization          | (None, 1280)        | Menstabilkan pelatihan.                             |
| Dense / Dropout             | (None, 256)         | Lapisan terhubung penuh dengan regularisasi.        |
| Dense / Dropout             | (None, 128)         | Lapisan terhubung penuh dengan regularisasi.        |
| Dense / Dropout             | (None, 128)         | Lapisan terhubung penuh dengan regularisasi.        |
| **Dense (Output)**          | **(None, 23)**      | Lapisan akhir untuk 23 kelas batik.                 |

**Ringkasan Parameter:**

| **Tipe Parameter**     | **Jumlah**   |
|------------------------|--------------|
| **Total Params**       | 2,643,415    |
| **Trainable Params**   | 2,606,743    |
| **Non-trainable Params** | 36,672     |

### Hasil Pelatihan & Evaluasi

Model dilatih dengan _optimizer_ Adam dan beberapa _callbacks_ seperti `EarlyStopping` dan `ReduceLROnPlateau` untuk mendapatkan hasil yang optimal.

![Training History](https://ragam-assets.s3.ap-southeast-2.amazonaws.com/Visual.jpg)

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

# 💻 Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge" height="45" alt="javascript logo"/>
  <img src="https://img.shields.io/badge/Webpack-8DD6F9?logo=webpack&logoColor=black&style=for-the-badge" height="45" alt="webpack logo"/>
  <img src="https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7" height="45" alt="netlify logo"/>
  <img src="https://img.shields.io/badge/Hapi.js-%23f06e00?style=for-the-badge&logo=hapi.js&logoColor=white" height="45" alt="hapi logo"/>
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=black&style=for-the-badge" height="45" alt="supabase logo"/>
  <img src="https://img.shields.io/badge/Amazon AWS-232F3E?logo=amazonwebservices&logoColor=FF9900&style=for-the-badge" height="45" alt="aws logo"/>
  <img src="https://img.shields.io/badge/Amazon%20S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white" height="45" alt="aws logo"/>
  <img src="https://img.shields.io/badge/NumPy-013243?logo=numpy&logoColor=white&style=for-the-badge" height="45" alt="numpy logo"/>
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?logo=tensorflow&logoColor=black&style=for-the-badge" height="45" alt="tensorflow logo"/>
  <img src="https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white&style=for-the-badge" height="45" alt="figma logo"/>
</div>

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

## 🎬 **Demo**

### **Video Demonstrasi**
🎥 **Segera Hadir** - Panduan lengkap aplikasi dan showcase fitur

---

## 🙏 **Ucapan Terima Kasih**

Terima kasih khusus kepada:
- Pengrajin batik dan ahli budaya Indonesia
- Advisor proyek capstone
- Beta tester dan early adopter

---

<div align="center">

### **🌟 Dukung Warisan Budaya Indonesia**

**Rasakan keindahan batik melalui teknologi**

[![Coba Sekarang](https://img.shields.io/badge/🚀-Coba%20Ragam%20Batik%20Sekarang-success?style=for-the-badge&logo=rocket)](https://ragambatik.app)

---

*Dibuat dengan ❤️ untuk pelestarian budaya Indonesia*

</div>
