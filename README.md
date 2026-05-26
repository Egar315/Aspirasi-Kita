# 🏆 Aspirasi-Kita
> **Portal Pengaduan Sosial & Fasilitas Publik Inklusif**
> 
> *Subtema: Digital Platform for Social Awareness & Accessible Web Design*  
> *Penyelarasan Tema CROWD IT 2026: "Design for the Future: Create Solutions for the Actual Problems"*

---

## 📸 VISUAL HOOK & RINGKASAN PROYEK

Aspirasi-Kita adalah portal pengaduan warga inklusif murni yang dirancang untuk menjembatani suara seluruh lapisan masyarakat—termasuk penyandang disabilitas kognitif dan fisik serta lansia—dengan instansi dinas perkotaan secara transparan, akuntabel, dan bebas hambatan aksesibilitas.

```text
       ┌────────────────────────────────────────────────────────┐
       │                  Aspirasi.Kita Portal                  │
       ├────────────────────────────────────────────────────────┤
       │  [ Kategori ]  [ Upvotes ]  [ Screen Reader (TTS) ]    │
       │  [ Jarak Teks ] [ Kontras ]  [ Garis Bantu Baca ]      │
       └────────────────────────────────────────────────────────┘
```

---

## 🛠️ TECH STACK

Aplikasi ini dibangun menggunakan arsitektur web murni tanpa kerangka kerja (framework) berat guna memastikan performa pemuatan instan (*instant load*), keringanan konsumsi data seluler, serta kepatuhan aksesibilitas murni tingkat tinggi:

- **Struktur:** **HTML5 Semantik** untuk memastikan pembaca layar (screen reader) dapat membaca dokumen secara terstruktur dan teratur.
- **Tampilan:** **Tailwind CSS (Play CDN)** & **Vanilla CSS3 Custom Variables** untuk transisi visual yang halus serta pengelolaan kelas aksesibilitas dinamis secara efisien.
- **Logika:** **Vanilla JavaScript (ES6+)** tanpa ketergantungan (dependencies) pustaka pihak ketiga untuk menjamin kecepatan performa rendering murni di sisi klien.
- **Aksesibilitas Suara:** **Web Speech API (`SpeechSynthesis`)** bawaan penjelajah web untuk asisten pembaca suara (TTS) bahasa Indonesia yang andal.

---

## 📂 STRUKTUR FOLDER MODULAR

Pasca-refaktorisasi modular, proyek ini mengadopsi pola pemuatan dinamis asinkron dengan struktur file sebagai berikut:

```text
Aspirasi-Kita/
│
├── index.html                    # Berkas jangkar utama & tata letak global
├── README.md                     # Informasi repositori GitHub (berkas ini)
├── DOCUMENTATION.md              # Panduan teknis mendalam & analisis produk
│
└── assets/
    ├── components/               # Potongan HTML Modular (Dynamic Fetching)
    │   ├── header.html           # Komponen navigasi & tombol aksesibilitas
    │   ├── hero.html             # Komponen banner utama & ilustrasi SVG
    │   ├── filter.html           # Komponen penyaring kategori
    │   ├── accessibility-panel.html # Panel kendali inklusivitas cerdas
    │   └── footer.html           # Komponen kaki halaman
    │
    ├── css/
    │   └── styles.css            # Kustom CSS untuk visual hooks aksesibilitas
    │
    └── js/
        ├── main.js               # Pengelola Core System & inisialisasi Fetch
        └── accessibility.js      # Pengendali Mesin Aksesibilitas Cerdas
```

---

## ✨ FITUR UNGGULAN

### 1. Core System Fungsionalitas
- **Filter Kategori Instan:** Penyaringan aduan (*Infrastruktur, Lingkungan, Fasilitas Publik, Layanan Sosial*) secara real-time berbasis manipulasi DOM tanpa memuat ulang halaman (*zero reload*).
- **Single-Upvote via LocalStorage:** Mekanisme dukung aduan warga secara unik berbasis enkapsulasi data per browser pengguna.
- **Validasi Formulir Interaktif:** Deteksi masukan wajib secara langsung dengan penyuntikan pesan kesalahan dinamis tepat di bawah input tanpa mengganggu layout.

### 2. Engine Aksesibilitas Cerdas (WCAG 2.1 Level AA)
- **Profil Aksesibilitas Cerdas:** Otomatisasi pengaturan visual untuk profil *ADHD, Low Vision, Disabilitas Kognitif (Disleksia),* dan *Disabilitas Motorik*.
- **Text Resizer:** Skala ukuran huruf global (100% hingga 140%) untuk kenyamanan mata pengguna lansia.
- **Penyesuaian Konten:** Pilihan perenggangan jarak huruf, penyorot visual semua tautan web, serta peredam gerakan/animasi visual.
- **Kendali Kontras:** Pilihan mode visual Kontras Tinggi (*High Contrast*) serta Filter Hitam Putih (*Monochrome*) tanpa mode gelap.
- **Alat Bantu Membaca:** Garis bantu horizontal pelacak kursor, kursor berukuran besar berbasis data SVG, serta pembaca layar otomatis (TTS) bahasa Indonesia murni pada event hover mouse dan fokus keyboard.

---

## 🚀 PANDUAN MENJALANKAN APLIKASI SECARA LOKAL

> [!IMPORTANT]
> **Pemuatan Komponen Modular via Fetch API**
> Untuk mencegah pemblokiran CORS (*Cross-Origin Resource Sharing*) oleh browser saat memuat komponen HTML modular secara dinamis, aplikasi **tidak boleh** dibuka secara langsung melalui double-click file `index.html` (protokol `file:///`). Anda harus menjalankannya menggunakan server web lokal.

### **Langkah Eksekusi Server Python:**
1. Pastikan Anda memiliki Python yang terinstal di komputer.
2. Buka Terminal / Command Prompt / PowerShell di direktori `Aspirasi-Kita`.
3. Jalankan perintah server lokal berikut:
   ```bash
   python -m http.server 8000
   ```
4. Buka penjelajah web (browser) Anda dan akses URL berikut:
   ```text
   http://localhost:8000
   ```

---

*Dikembangkan oleh Tim Pengembang Aspirasi-Kita untuk memukau juri CROWD IT 2026. Hak Cipta Dilindungi.*
