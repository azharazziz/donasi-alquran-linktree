# Donasi Al-Qur'an 2026

Halaman donasi berbasis web untuk program penyebaran Al-Qur'an. Dibangun dengan React + TypeScript, menggunakan Google Sheets sebagai sumber data *read-only* untuk transparansi dan kemudahan pengelolaan.

---

## Fitur

| Fitur | Keterangan |
|---|---|
| **Total Donasi Terkumpul** | Dijumlahkan otomatis dari kolom `Nominal` sheet *Donasi Masuk* |
| **Total Donasi Tersalurkan** | Dijumlahkan otomatis dari kolom `Nominal` sheet *Realisasi* |
| **Laporan Donasi (Modal)** | Tabel dinamis 3 tab: Donasi Masuk · Realisasi · Penyaluran — kolom menyesuaikan header Google Sheets |
| **Detail Baris** | Modal detail per baris; kolom `Bukti` otomatis render preview Google Drive / Instagram / gambar langsung |
| **Para Donatur** | Daftar nama unik dari kolom `Donatur`; anonim ditampilkan sebagai *Hamba Allah* |
| **Donasi via Transfer Bank** | Info rekening BSI & UOB |
| **Donasi via QRIS** | Tampil QR code + tombol unduh |
| **Konfirmasi Donasi** | Link ke Google Form |
| **Proposal Program** | Link unduh PDF via Google Drive |
| **Media Sosial** | Link Twitter, Instagram, dan lokasi |

---

## Struktur Proyek

```
src/
├── config.ts                   # ← Semua konfigurasi terpusat di sini
├── hooks/
│   └── useGoogleSheets.ts      # Semua hook fetch data Google Sheets
├── pages/
│   └── Index.tsx               # Halaman utama
└── components/
    ├── DonationHeader.tsx       # Hero header (logo, judul, tagline)
    ├── DonationAmount.tsx       # Total donasi terkumpul
    ├── RealisasiAmount.tsx      # Total donasi tersalurkan
    ├── LinkList.tsx             # Daftar tombol aksi (donasi, laporan, dll)
    ├── LinkCard.tsx             # Komponen satu kartu tombol
    ├── NiatDoa.tsx              # Kotak niat donasi
    ├── DonaturSection.tsx       # Daftar nama donatur
    ├── Footer.tsx               # Logo inisiator + quote + copyright
    ├── DonationReportModal.tsx  # Modal laporan 3 tab (tabel dinamis)
    ├── DynamicDetailModal.tsx   # Modal detail baris (semua sheet)
    ├── QRISModal.tsx            # Modal QR code donasi
    ├── TransferBankModal.tsx    # Modal info transfer bank
    └── SocialMediaModal.tsx     # Modal link media sosial
```

---

## Konfigurasi (`src/config.ts`)

> **Satu file untuk semua pengaturan.** Ganti nilai di sini — tidak perlu menyentuh file lain.

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

## Data Source — Google Sheets

Data diambil *real-time* via [Google Visualization API](https://developers.google.com/chart/interactive/docs/spreadsheets) (tidak memerlukan API key — spreadsheet harus **publik / dapat dilihat siapapun yang punya link**).

### Sheet yang digunakan

| Sheet | Kolom penting | Dipakai untuk |
|---|---|---|
| `Donasi Masuk` | Tanggal, Donatur, Nominal, Saldo | Total terkumpul · Daftar donatur · Tab laporan |
| `Realisasi` | Tanggal, Keperluan, Quran Qty, Iqro Qty, Nominal, Saldo | Total tersalurkan · Tab laporan |
| `Penyaluran Donasi` | Tanggal, Tempat, Qty Iqro, Qty Al Quran, Bukti | Tab laporan · Preview bukti |

### Fitur kolom `[hide]`

Tambahkan `[hide]` di nama header Google Sheets untuk menyembunyikan kolom dari tampilan tabel, tetapi tetap ditampilkan di modal detail.

```
Contoh: "Saldo [hide]"
→ Tabel: kolom Saldo tidak ditampilkan
→ Detail: "Saldo" tampil (marker dihapus otomatis)
```

### Rendering kolom `Bukti`

| Nilai di cell | Tampilan |
|---|---|
| URL Google Drive | Iframe preview + link "Buka di Google Drive" |
| URL Instagram post/reel | Iframe embed Instagram + link |
| URL gambar langsung (`.jpg`, `.png`, dll) | `<img>` inline + link "Buka di tab baru" |
| URL lainnya | Link teks "Lihat bukti" |
| Bukan URL | Teks biasa |

---

## Hooks (`src/hooks/useGoogleSheets.ts`)

| Hook | Kembali | Keterangan |
|---|---|---|
| `useGoogleSheetDynamic(sheetName, enabled?)` | `{ headers, rows, loading, error, refetch }` | Tabel dinamis — header dan baris dari sheet |
| `useDonasiTotal(enabled?)` | `{ total, loading }` | Jumlah Nominal dari *Donasi Masuk* |
| `useRealisasiTotal(enabled?)` | `{ total, loading }` | Jumlah Nominal dari *Realisasi* |
| `useDonaturList(enabled?)` | `{ names, loading }` | Nama unik dari kolom Donatur |

---

## Menjalankan Lokal

```bash
# Install dependencies
bun install

# Jalankan dev server
bun run dev

# Build produksi
bun run build
```

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** — styling
- **shadcn/ui** — komponen UI (Dialog, Tabs, Skeleton, dll)
- **Lucide React** — ikon
- **date-fns** — format tanggal
- **Google Visualization API** — sumber data Google Sheets (read-only, tanpa API key)

---

## Menambah Sheet Baru

1. Tambah nama sheet ke `SHEET_NAMES` di `src/config.ts`
2. Gunakan hook `useGoogleSheetDynamic(SHEET_NAMES.NAMA_BARU)` di komponen

Tidak ada perubahan lain yang diperlukan — tabel dan detail modal akan otomatis menyesuaikan header dari sheet baru.

---

## Inisiator Program

- Kamar Baca Magelang
- Fotoin Project
- SKS Foundation
- Mie Ayam Cap 2 Jago
- Bubur Kijang
