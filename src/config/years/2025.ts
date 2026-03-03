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

const config2025: YearlyConfig = {
  theme: {
    primaryColor: "#10b981", // Emerald/Green
  },

  spreadsheetId: "16-BQVDuCcsKixvTynVXVIOcYTwCcq-Tkz3rdajJIHis",

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

  initiators: [
    { name: "Kamar Baca Magelang", initials: "KBM" },
    { name: "Fotoin Project", initials: "FP" },
    { name: "SKS Foundation", initials: "SKS" },
    { name: "Mie Ayam Cap 2 Jago", initials: "MAC2J" },
    { name: "Bubur Kijang", initials: "BK" },
  ],

  helpers: [
    "Jazimatul Nurkhamidah",
    "Mila Nuraeni",
  ],

  links: [
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
  ],

  niatDonasi: {
    label: "Niat Donasi",
    text: "Saya niat berdonasi Al-Qur'an karena Allah Ta'ala, semoga menjadi amal jariyah yang terus mengalir pahalanya.",
  },

  qrisConfig: {
    title: "Donasi via QRIS",
    description: "Silakan pindai QRIS berikut menggunakan aplikasi pembayaran Anda",
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
    {
      bankName: "Bank Syariah Indonesia (BSI)",
      accountNumber: "732 453 0732",
      accountHolder: "Azhar A",
    },
  ],

  donationStatus: {
    isOpen: true,
    closedMessage: "Periode donasi telah ditutup. Terima kasih atas perhatian Anda. Hubungi kami untuk informasi lebih lanjut.",
  },

  socialMediaLinks: [
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
  ],
};

export default config2025;
