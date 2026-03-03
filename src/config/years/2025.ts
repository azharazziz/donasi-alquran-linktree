/**
 * 2025 Yearly Configuration
 * Uses a green/emerald primary color theme
 */

import {
  Landmark,
  QrCode,
  Globe,
  MessageCircle,
  FileText,
  Instagram,
  BarChart3,
  Twitter,
  MapPinCheck,
} from "lucide-react";
import type { YearlyConfig } from "../types";
import Logo from "@/assets/logo-2025.png";
import BuburKijangLogo from "@/assets/bubur-kijang.png";
import CapDuaJagoLogo from "@/assets/cap-dua-jago.png";
import FotoinProjectLogo from "@/assets/fotoin-project.png";
import KamarBacaMagelangLogo from "@/assets/kamar-baca-magelang.png";
import SKSFoundationLogo from "@/assets/sks-foundation.png";
import QRISImage from "@/assets/qris-code.png";

const config2025: YearlyConfig = {
  theme: {
    primaryColor: "#164c67", // Emerald/Green
  },

  spreadsheetId: "1q__tKYjR_SDgzul8NPiiclYdne7iE2jH42UUjbOcxTI",

  logo: Logo,

  sheetNames: {
    donasiMasuk: "Donasi Masuk",
    realisasi: "Realisasi",
    penyaluran: "Penyaluran Donasi",
  },

  columns: {
    tanggal: "Tanggal",
    donatur: "Donatur",
    nominal: "Nominal",
    saldo: "Saldo",
    keperluan: "Keperluan",
    quranQty: "Quran Qty",
    iqroQty: "Iqro Qty",
    tempat: "Tempat",
    qtyIqro: "Qty Iqro",
    qtyAlQuran: "Qty Al Quran",
    bukti: "Bukti",
  },

  anonymousDonorNames: ["nn", "anonim", "anonymous", ""],
  anonymousDonorDisplay: "Hamba Allah",

  headerText: {
    title: "Donasi Al-Qur'an 2025",
    tagline: "Rahasia kebahagiaan adalah dengan memperbanyak berbagi",
    description: "Setiap lembar Al-Qur’an yang kita baca, setiap doa yang kita panjatkan, adalah jejak perjalanan kita menuju-Nya. Di Ramadhan ini, mari kita hadirkan kembali kenangan indah dengan berbagi Al-Qur’an untuk TPA & masjid yang membutuhkan.",
  },

  initiators: [
    { name: "Kamar Baca Magelang", initials: "KBM" },
    { name: "Fotoin Project", initials: "FP" },
    { name: "SKS Foundation", initials: "SKS" },
  ],

  initiatorLogos: {
    "Kamar Baca Magelang": KamarBacaMagelangLogo,
    "Fotoin Project": FotoinProjectLogo,
    "SKS Foundation": SKSFoundationLogo,
  },

  helpers: [
    "Mila Nuraeni",
  ],

  links: [
    {
      icon: Landmark,
      title: "Donasi via Transfer Bank",
      subtitle: "Bank BSI",
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
  ],

  niatDonasi: {
    label: "Niat Donasi",
    text: "Saya niat berdonasi Al-Qur'an karena Allah Ta'ala, semoga menjadi amal jariyah yang terus mengalir pahalanya.",
  },

  qrisConfig: {
    title: "Donasi via QRIS",
    description: "Silakan pindai QRIS berikut menggunakan aplikasi pembayaran Anda",
    image: QRISImage,
    nmid: "ID1023262543904",
    merchantName: "Kamar Baca Magelang Warehouse",
    scanInfo: "Scan menggunakan GoPay, OVO, DANA, ShopeePay, LinkAja, atau aplikasi perbankan Anda",
    downloadText: "Simpan Gambar QRIS",
    downloadFilename: "qris-code.png",
  },

  bankAccounts: [
    {
      bankName: "United Overseas Bank (UOB)",
      accountNumber: "727 313 5875",
      accountHolder: "Azhar A",
    },
  ],

  donationStatus: {
    isOpen: true,
    closedMessage: "Periode donasi telah ditutup. Terima kasih atas perhatian Anda. Hubungi kami untuk informasi lebih lanjut.",
  },

  socialMediaLinks: [
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
  ],
};

export default config2025;
