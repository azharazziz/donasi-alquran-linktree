/**
 * Centralized application configuration.
 *
 * All app-wide constants and settings are defined here.
 * To update the Google Sheets data source, change SPREADSHEET_ID below.
 */

// Import logos of initiator organizations and QRIS image
import BuburKijangLogo from "@/assets/bubur-kijang.png";
import CapDuaJagoLogo from "@/assets/cap-dua-jago.png";
import FotoinProjectLogo from "@/assets/fotoin-project.png";
import KamarBacaMagelangLogo from "@/assets/kamar-baca-magelang.png";
import SKSFoundationLogo from "@/assets/sks-foundation.png";
import QRISImage from "@/assets/qris-code.png";

// Import icons for link list and social media
import {
  Landmark,
  QrCode,
  Globe,
  MessageCircle,
  FileText,
  Instagram,
  BarChart3,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Mail,
  MapPinCheck,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Google Sheets
// ---------------------------------------------------------------------------

/** The ID of the Google Spreadsheet used as the data source.
 *  Found in the spreadsheet URL:
 *  https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit
 */
export const SPREADSHEET_ID = "16-BQVDuCcsKixvTynVXVIOcYTwCcq-Tkz3rdajJIHis";

/** Sheet names and their corresponding gid values. */
export const SHEET_NAMES = {
  DONASI_MASUK: "Donasi Masuk",
  REALISASI: "Realisasi",
  PENYALURAN: "Penyaluran Donasi",
} as const;

export type SheetName = (typeof SHEET_NAMES)[keyof typeof SHEET_NAMES];

// ---------------------------------------------------------------------------
// Column names
// ---------------------------------------------------------------------------

/** Column header names used across sheets. Centralised here so a single
 *  rename in the spreadsheet only requires one change in this file. */
export const COLUMNS = {
  TANGGAL: "Tanggal",
  DONATUR: "Donatur",
  NOMINAL: "Nominal",
  SALDO: "Saldo",
  KEPERLUAN: "Keperluan",
  QURAN_QTY: "Quran Qty",
  IQRO_QTY: "Iqro Qty",
  TEMPAT: "Tempat",
  QTY_IQRO: "Qty Iqro",
  QTY_AL_QURAN: "Qty Al Quran",
  BUKTI: "Bukti",
} as const;

/** Donor names that should be displayed as "Hamba Allah". */
export const ANONYMOUS_NAMES = new Set(["nn", "anonim", "anonymous", ""]);

/** Display label for anonymous donors. */
export const ANONYMOUS_DISPLAY = "Hamba Allah";

// ---------------------------------------------------------------------------
// Initiators & Helpers
// ---------------------------------------------------------------------------

/** Organizations that initiated this project */
export const INITIATORS = [
  { name: "Kamar Baca Magelang", initials: "KBM" },
  { name: "Fotoin Project", initials: "FP" },
  { name: "SKS Foundation", initials: "SKS" },
  { name: "Mie Ayam Cap 2 Jago", initials: "MAC2J" },
  { name: "Bubur Kijang", initials: "BK" },
] as const;

/** Map initiator names to their logos */
export const INITIATOR_LOGOS: Record<string, string> = {
  "Kamar Baca Magelang": KamarBacaMagelangLogo,
  "Fotoin Project": FotoinProjectLogo,
  "SKS Foundation": SKSFoundationLogo,
  "Mie Ayam Cap 2 Jago": CapDuaJagoLogo,
  "Bubur Kijang": BuburKijangLogo,
};

/** People & organizations that helped with this project */
export const HELPERS = [
  "Jazimatul Nurkhamidah",
  "Mila Nuraeni",
] as const;

// ---------------------------------------------------------------------------
// Links Configuration
// ---------------------------------------------------------------------------

/** Link list items for the main section */
export const LINKS = [
  {
    icon: Landmark,
    title: "Donasi via Transfer Bank",
    subtitle: "Bank BSI dan UOB",
    action: "transfer",
  },
  {
    icon: QrCode,
    title: "Donasi via QRIS",
    subtitle: "Scan & bayar dari semua e-wallet",
    action: "qris",
  },
  {
    icon: Globe,
    title: "Konfirmasi Donasi",
    subtitle: "Isi form konfirmasi donasi Anda",
    href: "https://forms.gle/AVJgpsJNoYHFCjz66",
  },
  {
    icon: BarChart3,
    title: "Laporan Donasi",
    subtitle: "Lihat laporan donasi terkini",
    action: "report",
  },
  {
    icon: MessageCircle,
    title: "Pertanyaan dan Informasi",
    subtitle: "Hubungi kami via WhatsApp",
    href: "https://wa.me/6285155238000",
  },
  {
    icon: FileText,
    title: "Proposal Program",
    subtitle: "Unduh dokumen proposal lengkap",
    href: "https://drive.google.com/file/d/10uaohZ3cxUyyTtA7yRhAH2i2xbyIr993/view?usp=sharing",
  },
  {
    icon: Instagram,
    title: "Media Sosial",
    subtitle: "Twitter, Instagram, dan Lokasi",
    action: "social",
  },
] as const;

// ---------------------------------------------------------------------------
// Common Content
// ---------------------------------------------------------------------------

/** Niat Donasi (Donation Intention) - shared across modals */
export const NIAT_DONASI = {
  label: "Niat Donasi",
  text: "Saya niat berdonasi Al-Qur'an karena Allah Ta'ala, semoga menjadi amal jariyah yang terus mengalir pahalanya.",
} as const;

// ---------------------------------------------------------------------------
// Modal Configurations
// ---------------------------------------------------------------------------

/** QRIS Donation Configuration */
export const QRIS_CONFIG = {
  title: "Donasi via QRIS",
  description: "Silakan pindai QRIS berikut menggunakan aplikasi pembayaran Anda",
  image: QRISImage,
  imageAlt: "QRIS Code",
  nmid: "ID1023262543904",
  merchantName: "Kamar Baca Magelang Warehouse",
  scanInfo: "Scan menggunakan GoPay, OVO, DANA, ShopeePay, LinkAja, atau aplikasi perbankan Anda",
  downloadText: "Simpan Gambar QRIS",
  downloadFilename: "qris-code.png",
} as const;

/** Bank Transfer Accounts Configuration */
export const BANK_ACCOUNTS = [
  {
    bankName: "United Overseas Bank (UOB)",
    accountNumber: "727 313 5875",
    accountHolder: "Azhar A",
  },
  {
    bankName: "Bank Syariah Indonesia (BSI)",
    accountNumber: "732 453 0732",
    accountHolder: "Azhar A",
  },
] as const;

// ---------------------------------------------------------------------------
// Donation Status Configuration
// ---------------------------------------------------------------------------

/** Control whether donations are open or closed */
export const DONATION_STATUS = {
  isOpen: true, // Set to false to close donations and hide transfer/QRIS options
  closedMessage: "Periode donasi telah ditutup. Terima kasih atas perhatian Anda. Hubungi kami untuk informasi lebih lanjut.",
} as const;

/** Social Media Links Configuration */
export const SOCIAL_MEDIA_LINKS = [
  {
    name: "Bubur Kijang",
    icon: Instagram,
    url: "https://instagram.com/bubur_kijang",
    color: "hover:text-pink-500",
    bgColor: "hover:bg-pink-50",
  },
  {
    name: "Lokasi Bubur Kijang",
    icon: MapPinCheck,
    url: "https://share.google/mAVAKocMZpP8U5bd4",
    color: "hover:text-green-500",
    bgColor: "hover:bg-green-50",
  },
  {
    name: "Fotoin Project",
    icon: Instagram,
    url: "https://instagram.com/fotoin.project",
    color: "hover:text-pink-600",
    bgColor: "hover:bg-pink-50",
  },
  {
    name: "Kamar Baca Magelang",
    icon: Instagram,
    url: "https://instagram.com/kamarbacamgl",
    color: "hover:text-pink-500",
    bgColor: "hover:bg-pink-50",
  },
  {
    name: "Kamar Baca Magelang",
    icon: Twitter,
    url: "https://twitter.com/kamarbacamgl",
    color: "hover:text-black",
    bgColor: "hover:bg-gray-50",
  },
  {
    name: "Mie Ayam Cap 2 Jago",
    icon: Instagram,
    url: "https://instagram.com/capduajago",
    color: "hover:text-pink-500",
    bgColor: "hover:bg-pink-50",
  },
  {
    name: "Lokasi Mie Ayam Cap 2 Jago",
    icon: MapPinCheck,
    url: "https://share.google/B1duOw7KomBpI1igN",
    color: "hover:text-green-500",
    bgColor: "hover:bg-green-50",
  },
  {
    name: "Sickillshoes",
    icon: Twitter,
    url: "https://twitter.com/sickillshoes",
    color: "hover:text-black",
    bgColor: "hover:bg-gray-50",
  },
  {
    name: "Lokasi Sickillshoes",
    icon: MapPinCheck,
    url: "https://share.google/jLIgOpYnA4D6eJxUi",
    color: "hover:text-green-500",
    bgColor: "hover:bg-green-50",
  },
  {
    name: "SKS Foundation",
    icon: Instagram,
    url: "https://instagram.com/sksfound",
    color: "hover:text-pink-500",
    bgColor: "hover:bg-pink-50",
  },
] as const;
