# 📖 Donasi Al-Qur'an 2026

> **Platform donasi transparan untuk penyebaran Al-Qur'an** — Dibangun dengan teknologi modern, data real-time terintegrasi dengan Google Sheets.

Halaman donasi berbasis web yang memungkinkan masyarakat berkontribusi dalam program mulia penyebaran Al-Qur'an. Teknologi yang digunakan: **React + TypeScript**, dengan Google Sheets sebagai sumber data *read-only* untuk transparansi maksimal dan kemudahan manajemen data.

---

## ✨ Fitur Unggulan

| Fitur | Keterangan |
|---|---|
| 💰 **Total Donasi Terkumpul** | Dijumlahkan otomatis dari kolom `Nominal` sheet *Donasi Masuk* |
| 📤 **Total Donasi Tersalurkan** | Dijumlahkan otomatis dari kolom `Nominal` sheet *Realisasi* |
| 📊 **Laporan Donasi Interaktif** | Tabel dinamis dengan 3 tab: Donasi Masuk · Realisasi · Penyaluran — kolom menyesuaikan header Google Sheets |
| 🔍 **Detail Baris** | Modal detail lengkap per baris; kolom `Bukti` otomatis render preview Google Drive / Instagram / gambar langsung |
| 👥 **Daftar Para Donatur** | Daftar nama unik dari kolom `Donatur`; donatur anonim ditampilkan sebagai *Hamba Allah* |
| 🏦 **Transfer Bank** | Informasi rekening BSI & UOB tersedia |
| 📱 **Donasi via QRIS** | QR code + tombol unduh untuk kemudahan pembayaran |
| 📝 **Konfirmasi Donasi** | Akses langsung ke Google Form untuk konfirmasi pembayaran |
| 📄 **Proposal Program** | Link unduh PDF proposal via Google Drive |
| 📲 **Hubungi Kami** | Tautan Twitter, Instagram, dan lokasi untuk koneksi lebih lanjut |

---

## 🗂️ Struktur Proyek

Organisasi folder yang rapi untuk kemudahan navigasi dan maintenance:

```
src/
├── config.ts                      # ⚙️ Pusat konfigurasi (edit di sini saja!)
├── hooks/
│   └── useGoogleSheets.ts         # 🪝 Hook fetch data Google Sheets
├── pages/
│   └── Index.tsx                  # 🏠 Halaman utama aplikasi
└── components/
    ├── DonationHeader.tsx         # 🎨 Hero header (logo, judul, tagline)
    ├── DonationAmount.tsx         # 💵 Total donasi terkumpul
    ├── RealisasiAmount.tsx        # ✅ Total donasi tersalurkan
    ├── LinkList.tsx               # 🔗 Daftar tombol aksi (donasi, laporan, dll)
    ├── LinkCard.tsx               # 🔘 Komponen satu kartu tombol
    ├── NiatDoa.tsx                # 🕌 Kotak niat donasi
    ├── DonaturSection.tsx         # 📋 Daftar nama donatur
    ├── Footer.tsx                 # 🔚 Logo inisiator + quote + copyright
    ├── DonationReportModal.tsx    # 📈 Modal laporan 3 tab (tabel dinamis)
    ├── DynamicDetailModal.tsx     # 🔎 Modal detail baris (semua sheet)
    ├── QRISModal.tsx              # 📲 Modal QR code donasi
    ├── TransferBankModal.tsx      # 🏦 Modal info transfer bank
    └── SocialMediaModal.tsx       # 📱 Modal link media sosial
```

---

## ⚙️ Konfigurasi Mudah (`src/config.ts`)

**Semua pengaturan terpusat di satu file.** Tidak perlu menyentuh file lain — hanya ganti nilai di `config.ts` dan aplikasi akan langsung terupdate!

```ts
// Ganti ID spreadsheet jika sumber data berpindah
export const SPREADSHEET_ID = "16-BQVDuCcsKixvTynVXVIOcYTwCcq-Tkz3rdajJIHis";

// Nama sheet — sesuaikan jika sheet di-rename
export const SHEET_NAMES = {
  DONASI_MASUK: "Donasi Masuk",
  REALISASI:    "Realisasi",
  PENYALURAN:   "Penyaluran Donasi",
};

// Nama kolom — sesuaikan jika header di Google Sheets diubah
export const COLUMNS = {
  TANGGAL:      "Tanggal",
  DONATUR:      "Donatur",
  NOMINAL:      "Nominal",
  SALDO:        "Saldo",
  KEPERLUAN:    "Keperluan",
  QURAN_QTY:    "Quran Qty",
  IQRO_QTY:     "Iqro Qty",
  TEMPAT:       "Tempat",
  QTY_IQRO:     "Qty Iqro",
  QTY_AL_QURAN: "Qty Al Quran",
  BUKTI:        "Bukti",
};

// Nama yang dianggap anonim
export const ANONYMOUS_NAMES = new Set(["nn", "anonim", "anonymous", ""]);
export const ANONYMOUS_DISPLAY = "Hamba Allah";
```

---

## 📊 Data Source — Google Sheets

Data diambil **real-time** langsung dari Google Sheets menggunakan [Google Visualization API](https://developers.google.com/chart/interactive/docs/spreadsheets) yang aman dan terpercaya.

> ✅ **Tidak perlu API key** — spreadsheet harus **publik / dapat dilihat siapapun yang punya link**

### Sheet yang Digunakan

| Sheet | Kolom Penting | Fungsi |
|---|---|---|
| **Donasi Masuk** | Tanggal, Donatur, Nominal, Saldo | Hitung total terkumpul · Daftar donatur · Tab laporan |
| **Realisasi** | Tanggal, Keperluan, Quran Qty, Iqro Qty, Nominal, Saldo | Hitung total tersalurkan · Tab laporan |
| **Penyaluran Donasi** | Tanggal, Tempat, Qty Iqro, Qty Al Quran, Bukti | Tab laporan · Preview bukti/dokumentasi |

### 🎯 Fitur Kolom `[hide]`

Gunakan marker `[hide]` di nama header Google Sheets untuk menyembunyikan kolom dari tabel, namun tetap ditampilkan di modal detail:

```
Contoh: "Saldo [hide]"
→ Tabel utama: kolom Saldo disembunyikan
→ Modal detail: kolom "Saldo" tetap muncul (marker [hide] hilang otomatis)
```

### 🖼️ Rendering Kolom `Bukti` (Otomatis)

| Tipe Konten | Tampilan | Perlakuan |
|---|---|---|
| **URL Google Drive** | Preview Iframe | + Link "Buka di Google Drive" |
| **URL Instagram post/reel** | Embed Instagram | + Link langsung |
| **URL Gambar** (`.jpg`, `.png`, dll) | Gambar inline | + Link "Buka di tab baru" |
| **URL lainnya** | Link teks | "Lihat bukti" |
| **Teks biasa** | Teks biasa | Tampil apa adanya |

---

## 🪝 Hooks untuk Fetch Data (`src/hooks/useGoogleSheets.ts`)

Koleksi hook custom yang memudahkan akses data Google Sheets di komponen React:

| Hook | Return Type | Kegunaan |
|---|---|---|
| `useGoogleSheetDynamic(sheetName, enabled?)` | `{ headers, rows, loading, error, refetch }` | Ambil tabel dinamis — header & baris otomatis dari sheet |
| `useDonasiTotal(enabled?)` | `{ total, loading }` | Hitung total Nominal dari sheet *Donasi Masuk* |
| `useRealisasiTotal(enabled?)` | `{ total, loading }` | Hitung total Nominal dari sheet *Realisasi* |
| `useDonaturList(enabled?)` | `{ names, loading }` | Ambil nama unik dari kolom Donatur |

---

## 🚀 Quick Start — Menjalankan Lokal

Siap untuk mengembangkan? Ikuti langkah-langkah berikut:

```bash
# 1. Install dependencies
bun install

# 2. Jalankan development server
bun run dev

# 3. Build untuk produksi
bun run build
```

Aplikasi akan membuka di `http://localhost:5173` (atau port lain jika 5173 sudah terpakai).

---

## 🛠️ Tech Stack — Teknologi yang Digunakan

| Teknologi | Peran |
|---|---|
| **React 18** + **TypeScript** | Library UI & tipe aman |
| **Vite** | Build tool super cepat |
| **Tailwind CSS** | Styling utility-first yang elegan |
| **shadcn/ui** | Komponen UI siap pakai (Dialog, Tabs, Skeleton, dll) |
| **Lucide React** | Ikon modern & konsisten |
| **date-fns** | Format & manipulasi tanggal |
| **Google Visualization API** | Koneksi real-time ke Google Sheets (tanpa API key) |

---

## 📝 Menambah Sheet Baru? Caranya Mudah!

Kolaborasi dan skalabilitas adalah prioritas. Berikut cara menambah sheet baru:

1. **Buka `src/config.ts`** dan tambahkan nama sheet ke `SHEET_NAMES`:
   ```ts
   export const SHEET_NAMES = {
     DONASI_MASUK: "Donasi Masuk",
     REALISASI:    "Realisasi",
     PENYALURAN:   "Penyaluran Donasi",
     SHEET_BARU:   "Sheet Baru", // ← Tambah di sini
   };
   ```

2. **Gunakan hook di komponen:**
   ```tsx
   const { headers, rows, loading } = useGoogleSheetDynamic(SHEET_NAMES.SHEET_BARU);
   ```

**Itu saja!** Tabel dan modal detail akan otomatis menyesuaikan header dari sheet baru tanpa perubahan lain.

---

## 🤝 Inisiator & Mitra Program

Program ini adalah hasil kolaborasi dari:

- **Kamar Baca Magelang**
- **Fotoin Project**
- **SKS Foundation**
- **Mie Ayam Cap 2 Jago**
- **Bubur Kijang**

Terima kasih atas komitmen dan dedikasi dalam menyebarkan Al-Qur'an kepada masyarakat! 💚

---

## 📞 Pertanyaan atau Kontribusi?

Kami terbuka untuk saran, laporan bug, atau kontribusi dari komunitas. Silakan hubungi kami melalui:
- **Email**: azharazziz13[at]gmail.com
- **Instagram**: @kamarbacamgl
- **Twitter**: @kamarbacamgl

**Jazakallahu Khairun** atas dukungan Anda! 🙏

---

## 💖 Built with Love

Proyek ini dikembangkan dengan ❤️ menggunakan **[Lovable.app](https://lovable.app)** — AI-powered platform untuk membangun aplikasi dengan cepat dan mudah.

---
