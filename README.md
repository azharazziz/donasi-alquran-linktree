# 📖 Donasi Al-Qur'an

> **Platform donasi transparan untuk penyebaran Al-Qur'an** — Multi-year, themeable, real-time data dari Google Sheets.

Platform donasi berbasis web yang mendukung **konfigurasi per tahun** dengan tema warna dinamis, highlight cards otomatis, dan laporan transparan langsung dari Google Sheets. Dibangun dengan **React + TypeScript + Tailwind CSS**.

---

## ✨ Fitur Unggulan

| Fitur | Keterangan |
|---|---|
| 📅 **Multi-Year Support** | Konfigurasi independen per tahun (2024, 2025, 2026) dengan switcher animasi |
| 🎨 **Dynamic Theming** | Warna primer per tahun → seluruh palette (primary, secondary, accent, muted, dll.) di-generate otomatis via HSL |
| 📊 **Highlight Cards** | Kolom bertanda `[highlight]` di Google Sheets otomatis ditampilkan sebagai kartu ringkasan dengan total, ikon, dan warna kustom |
| 🏷️ **Flag System** | Kolom header mendukung flag `[hide]`, `[private]`, `[highlight]`, `[icon:name]`, `[color:#HEX]` — semua tersembunyi dari UI |
| 💰 **Total Donasi Terkumpul** | Dijumlahkan otomatis dari kolom `Nominal` sheet *Donasi Masuk* |
| 📤 **Total Donasi Tersalurkan** | Dijumlahkan otomatis dari kolom `Nominal` sheet *Realisasi* |
| 📈 **Laporan Donasi Interaktif** | Modal 3 tab: Donasi Masuk · Realisasi · Penyaluran — kolom menyesuaikan header Google Sheets |
| 🔍 **Detail Baris** | Modal detail per baris; kolom `Bukti` otomatis render preview Google Drive / Instagram / gambar |
| 👥 **Daftar Donatur** | Nama unik dari kolom `Donatur`; anonim ditampilkan sebagai *Hamba Allah* dengan counter |
| 🏦 **Transfer Bank & QRIS** | Info rekening & QR code dengan tombol unduh |
| 📝 **Konfirmasi Donasi** | Link Google Form |
| ❓ **FAQ & Cara Berdonasi** | Modal interaktif dengan langkah-langkah |
| 🎁 **Wujud Donasi** | Modal detail produk yang disalurkan (Al-Qur'an, Iqro, dll.) |
| 📱 **Media Sosial** | Modal link Instagram, Twitter, lokasi |
| 🚫 **Donation Status** | Otomatis sembunyikan tombol transfer/QRIS saat donasi ditutup |

---

## 🏗️ Arsitektur

### Multi-Year Configuration

Setiap tahun memiliki file konfigurasi independen di `src/config/years/`:

```
src/config/
├── types.ts              # YearlyConfig type definition
├── index.ts              # Aggregator + year selection logic
├── theme-generator.ts    # HSL color palette generator
└── years/
    ├── 2024.ts           # Konfigurasi tahun 2024
    ├── 2025.ts           # Konfigurasi tahun 2025
    └── 2026.ts           # Konfigurasi tahun 2026
```

**Menambah tahun baru:** Buat file `src/config/years/YYYY.ts` yang mengekspor objek `YearlyConfig`, lalu import di `src/config/index.ts`.

### Dynamic Theming

Cukup set `theme.primaryColor` (hex) di config tahun — seluruh palette di-generate otomatis:

```ts
// src/config/years/2026.ts
theme: { primaryColor: "#082e6e" }
```

`theme-generator.ts` menghasilkan 19 CSS variable HSL (primary, secondary, accent, background, card, muted, destructive, gold, dll.) yang di-apply ke `:root` via `ThemeProvider`.

### Flag System (`src/lib/flags.ts`)

Flag di header kolom Google Sheets mengontrol tampilan tanpa terlihat di UI:

| Flag | Efek |
|---|---|
| `[hide]` | Tersembunyi di tabel ringkasan, tampil di modal detail |
| `[private]` | Tersembunyi di semua tampilan |
| `[highlight]` | Kolom dijumlahkan & ditampilkan sebagai highlight card |
| `[icon:name]` | Ikon kustom untuk highlight card (book, gift, package, dll.) |
| `[color:#HEX]` | Warna kustom untuk highlight card |

Contoh header di Google Sheets:
```
Qty Al Quran [highlight] [icon:book] [color:#1E40AF]
Saldo [hide]
Internal Notes [private]
```

---

## 🗂️ Struktur Proyek

```
src/
├── App.tsx                           # Root: YearProvider → ThemeProvider → Router
├── pages/
│   └── Index.tsx                     # Halaman utama
├── contexts/
│   └── YearContext.tsx               # Global year state + localStorage persistence
├── config/
│   ├── types.ts                      # YearlyConfig interface
│   ├── index.ts                      # Config aggregator + year helpers
│   ├── theme-generator.ts            # Hex → HSL palette generator
│   └── years/                        # Per-year config files
├── hooks/
│   ├── useGoogleSheets.ts            # Hooks: useGoogleSheetDynamic, useDonasiTotal, useRealisasiTotal, useDonaturList
│   ├── useHighlightItems.ts          # Cross-sheet [highlight] aggregation
│   └── useYearConfig.ts              # Year config access hook
├── lib/
│   ├── flags.ts                      # Flag parsing: stripFlags, isHiddenColumn, isPrivateColumn, extractFlag, etc.
│   └── utils.ts                      # Tailwind merge utilities
├── components/
│   ├── ThemeProvider.tsx              # Applies CSS variables to :root
│   ├── YearSwitcher.tsx              # Animated segmented year control
│   ├── DonationHeader.tsx            # Hero: logo, judul, tagline
│   ├── DonationAmount.tsx            # Total donasi terkumpul
│   ├── RealisasiAmount.tsx           # Total donasi tersalurkan
│   ├── HighlightCards.tsx            # Kartu highlight [highlight] items
│   ├── LinkList.tsx                  # Daftar tombol aksi + modal orchestrator
│   ├── LinkCard.tsx                  # Komponen kartu tombol
│   ├── NiatDoa.tsx                   # Kotak niat donasi
│   ├── DonaturSection.tsx            # Daftar nama donatur
│   ├── Footer.tsx                    # Initiator logos, helpers, publishers, copyright
│   ├── DonationReportModal.tsx       # Modal laporan 3 tab
│   ├── DynamicDetailModal.tsx        # Modal detail baris
│   ├── QRISModal.tsx                 # Modal QR code
│   ├── TransferBankModal.tsx         # Modal info transfer bank
│   ├── SocialMediaModal.tsx          # Modal link media sosial
│   ├── FAQModal.tsx                  # Modal FAQ
│   ├── HowToDonateModal.tsx          # Modal cara berdonasi
│   ├── DonationProductsModal.tsx     # Modal wujud donasi
│   └── ui/                           # shadcn/ui components
└── assets/                           # Logo, gambar, pattern SVG
```

---

## 📊 Data Source — Google Sheets

Data diambil **real-time** via [Google Visualization API](https://developers.google.com/chart/interactive/docs/spreadsheets).

> ✅ **Tidak perlu API key** — spreadsheet harus publik / dapat dilihat siapapun yang punya link.

### Sheet yang Digunakan

| Sheet | Kolom Penting | Fungsi |
|---|---|---|
| **Donasi Masuk** | Tanggal, Donatur, Nominal, Saldo | Total terkumpul · Daftar donatur · Tab laporan |
| **Realisasi** | Tanggal, Keperluan, Quran Qty, Iqro Qty, Nominal | Total tersalurkan · Tab laporan |
| **Penyaluran Donasi** | Tanggal, Tempat, Qty Iqro, Qty Al Quran, Bukti | Tab laporan · Preview bukti |

### Rendering Kolom `Bukti`

| Tipe Konten | Tampilan |
|---|---|
| URL Google Drive | Preview Iframe + link |
| URL Instagram | Embed Instagram |
| URL Gambar (`.jpg`, `.png`) | Gambar inline |
| URL lainnya | Link teks |
| Teks biasa | Teks apa adanya |

---

## 🪝 Custom Hooks

| Hook | Return | Kegunaan |
|---|---|---|
| `useGoogleSheetDynamic(sheet, enabled?)` | `{ headers, rows, loading, error, refetch }` | Tabel dinamis — header & baris otomatis |
| `useDonasiTotal(enabled?)` | `{ total, loading, lastUpdate }` | Total Nominal dari *Donasi Masuk* + tanggal terbaru lintas sheet |
| `useRealisasiTotal(enabled?)` | `{ total, loading }` | Total Nominal dari *Realisasi* |
| `useDonaturList(enabled?)` | `{ names, anonCount, loading }` | Nama unik donatur + jumlah anonim |
| `useHighlightItems(enabled?)` | `{ items, loading }` | Agregasi [highlight] lintas semua sheet |

---

## ⚙️ Konfigurasi Per Tahun (`YearlyConfig`)

Setiap file konfigurasi tahun mengatur:

| Bagian | Isi |
|---|---|
| `theme.primaryColor` | Warna primer (hex) → palette otomatis |
| `backgroundImage` | Pattern SVG untuk background |
| `spreadsheetId` | ID Google Spreadsheet |
| `sheetNames` | Nama 3 sheet (Donasi Masuk, Realisasi, Penyaluran) |
| `columns` | Mapping nama kolom |
| `logo`, `headerText` | Logo & teks hero |
| `initiators`, `initiatorLogos` | Organisasi inisiator + logo |
| `publishers` | Penerbit yang bekerja sama |
| `helpers` | Nama-nama pembantu |
| `links` | Daftar tombol aksi (href atau action) |
| `bankAccounts`, `qrisConfig` | Info pembayaran |
| `donationStatus` | Buka/tutup donasi + pesan |
| `socialMediaLinks` | Link media sosial |
| `faq`, `howToDonate` | FAQ & panduan donasi |
| `donationProducts` | Detail produk yang disalurkan |
| `niatDonasi` | Teks niat donasi |

---

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Build produksi
bun run build
```

---

## 🛠️ Tech Stack

| Teknologi | Peran |
|---|---|
| **React 18** + **TypeScript** | UI framework + type safety |
| **Vite** | Build tool |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Komponen UI (Dialog, Tabs, Skeleton, dll.) |
| **Lucide React** | Ikon |
| **date-fns** | Format tanggal |
| **React Router** | Client-side routing |
| **TanStack React Query** | Query client |
| **Google Visualization API** | Real-time data dari Google Sheets |

---

## 📞 Kontak

- **Email**: azharazziz13[at]gmail.com
- **Instagram**: @kamarbacamgl
- **Twitter**: @kamarbacamgl

---

## 💖 Built with Love

Dikembangkan dengan ❤️ menggunakan **[Lovable](https://lovable.app)** oleh [Azhar Azziz](https://azharazziz.github.io).

© 2021 – 2026. Semua hak dilindungi.
