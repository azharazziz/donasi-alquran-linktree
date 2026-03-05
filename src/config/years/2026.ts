/**
 * 2026 Yearly Configuration
 * 
 * This configuration follows the YearlyConfig type shape exactly.
 * Only define theme.primaryColor here - all other colors are auto-generated.
 */

import {
  Landmark,
  QrCode,
  Globe,
  MessageCircle,
  HelpCircle,
  FileText,
  Instagram,
  BarChart3,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Mail,
  MapPinCheck,
  BookOpen,
  Gift,
} from "lucide-react";
import type { YearlyConfig } from "../types";
import Logo from "@/assets/logo.png";
import BuburKijangLogo from "@/assets/bubur-kijang.png";
import CapDuaJagoLogo from "@/assets/cap-dua-jago.png";
import FotoinProjectLogo from "@/assets/fotoin-project.png";
import KamarBacaMagelangLogo from "@/assets/kamar-baca-magelang.png";
import SKSFoundationLogo from "@/assets/sks-foundation.png";
import QRISImage from "@/assets/qris-code.png";
import Quran2025 from "@/assets/quran 2025.png";
import BackgroundImage2026 from "@/assets/islamic-pattern.svg";
import alQosbah from "@/assets/al qosbah.png";

const config2026: YearlyConfig = {
  theme: {
    primaryColor: "#082e6e", // Blue
  },

  backgroundImage: BackgroundImage2026,

  spreadsheetId: "16-BQVDuCcsKixvTynVXVIOcYTwCcq-Tkz3rdajJIHis",

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
    title: "Donasi Al-Qur'an 2026",
    tagline: "Jadikan ramadhanmu penuh cahaya iman yang menghidupkan harapan dan menumbuhkan keberkahan",
    description: "Mari bersama-sama kita wujudkan impian untuk menyebarkan cahaya Al-Qur'an. Dengan donasi Anda, kita dapat memberikan Al-Qur'an kepada mereka yang membutuhkan, memperkuat iman, dan menumbuhkan keberkahan di bulan suci Ramadhan ini.",
  },

  initiators: [
    { name: "Kamar Baca Magelang", initials: "KBM" },
    { name: "Fotoin Project", initials: "FP" },
    { name: "SKS Foundation", initials: "SKS" },
    { name: "Mie Ayam Cap 2 Jago", initials: "MAC2J" },
    { name: "Bubur Kijang", initials: "BK" },
  ],

  initiatorLogos: {
    "Kamar Baca Magelang": KamarBacaMagelangLogo,
    "Fotoin Project": FotoinProjectLogo,
    "SKS Foundation": SKSFoundationLogo,
    "Mie Ayam Cap 2 Jago": CapDuaJagoLogo,
    "Bubur Kijang": BuburKijangLogo,
  },

  publishers: [
    { name: "Al Qosbah", logo: alQosbah },
  ],

  helpers: [
    "Jazimatul Nurkhamidah",
    "Mila Nuraeni",
  ],

  links: [
    {
      icon: Gift,
      title: "Wujud Donasi",
      subtitle: "Informasi tentang Wujud Donasi yang disalurkan",
      action: "donationProducts",
    },
    {
      icon: BookOpen,
      title: "Cara Berdonasi",
      subtitle: "Panduan langkah demi langkah",
      action: "howToDonate",
    },
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
      icon: HelpCircle,
      title: "FAQ",
      subtitle: "Pertanyaan yang sering diajukan",
      action: "faq",
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
    {
      bankName: "Bank Syariah Indonesia (BSI)",
      accountNumber: "732 453 0732",
      accountHolder: "Azhar A",
    },
  ],

  donationStatus: {
    isOpen: false,
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

  faq: [
    {
      question: "Berapa minimal donasi yang dapat diberikan?",
      answer: "Tidak terdapat batas minimal donasi. Namun, kami menyarankan agar nominal donasi disesuaikan dengan tujuan penyaluran. Sebagai gambaran, donasi untuk 1 (satu) mushaf Al-Qur’an dimulai dari Rp50.000 beserta kelipatannya.",
    },
    {
      question: "Saya telah melakukan transfer. Bagaimana cara mengirimkan bukti donasi?",
      answer: "Setelah melakukan pembayaran, silakan unggah bukti transfer melalui tautan berikut: https://donasi-alquran.vercel.app/",
    },
    {
      question: "Di mana saya dapat melihat laporan keuangan donasi?",
      answer: "Laporan keuangan donasi dapat diakses secara transparan melalui tautan berikut: https://donasi-alquran.vercel.app/",
    },
    {
      question: "Apakah bisa berdonasi dengan kirim barang?",
      answer: "Mohon maaf, saat ini donasi hanya kami terima dalam bentuk uang melalui transfer. Hal ini dilakukan untuk menyeragamkan bentuk donasi yang disalurkan serta menghindari perbedaan nilai donasi antar lokasi.",
    },
    {
      question: "Kapan donasi akan mulai disalurkan kepada penerima?",
      answer: "Donasi direncanakan mulai disalurkan pada minggu ke-2 atau ke-3 bulan Ramadhan.",
    },
    {
      question: "Kapan donasi ini akan ditutup?",
      answer: "Donasi direncanakan akan ditutup pada 6 Maret 2026. Namun demikian, donasi dapat ditutup lebih awal apabila kuota donasi yang dibutuhkan telah terpenuhi.",
    },
  ],

  howToDonate: {
    title: "CARA BERDONASI",
    description: "Ikuti langkah-langkah sederhana berikut untuk melakukan donasi",
    steps: [
      {
        number: 1,
        title: "Tentukan nominal donasi yang akan diberikan.",
        description: "Donasi dapat diberikan dengan jumlah berapa pun.",
      },
      {
        number: 2,
        title: "Lakukan transfer donasi melalui bank atau melalui QRIS Kamar Baca Magelang.",
        description: "",
      },
      {
        number: 3,
        title: "Simpan bukti pembayaran berupa foto atau tangkapan layar.",
        description: "",
      },
      {
        number: 4,
        title: "Lakukan konfirmasi donasi dengan mengakses https://donasi-alquran.vercel.app",
        description: "Kemudian lengkapi data dan unggah bukti transfer.",
      },
      {
        number: 5,
        title: "Terima kasih atas partisipasi dan kepercayaan Anda.",
        description: "Semoga Allah membalas dengan keberkahan dan kebaikan yang berlipat.",
      },
    ],
  },

  donationProducts: [
    {
      title: "Al-Qur'an Al-Mubayyin Tematik Multicode",
      image: Quran2025,
      description: "Al-Qur'an Al-Mubayyin Tematik Multicode adalah mushaf ukuran A5 dengan hard cover lux, kertas HVS premium, cetak dual colour, dan 617 halaman yang dirancang untuk memudahkan pembaca memahami Al-Qur'an secara tematik, lengkap dengan terjemah per kata, transliterasi latin, kode tajwid, serta QR Code video bacaan",
      advantages: [
        "Terjemah per kata untuk membantu memahami makna ayat secara mendalam.",
        "Transliterasi latin memudahkan pembaca yang belum lancar membaca huruf Arab.",
        "Dilengkapi tanda waqaf jeda dan terus untuk panduan berhenti dan melanjutkan bacaan.",
        "Blok tematik pilihan yang mengelompokkan ayat berdasarkan tema tertentu.",
        "Kode baca tajwid berbasis warna atau simbol untuk membantu membaca dengan tartil.",
        "QR Code yang terhubung ke 604 video bacaan Al-Qur'an sebagai referensi bacaan yang benar.",
      ],
      reasons: [
        "Membantu memahami Al-Qur'an secara tematik dan sistematis.",
        "Cocok untuk belajar tajwid secara mandiri.",
        "Mempermudah memahami arti ayat melalui terjemah per kata.",
        "Praktis dibawa dan digunakan untuk belajar harian.",
      ],
    },
  ],
};

export default config2026;
