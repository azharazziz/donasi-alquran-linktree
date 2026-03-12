/**
 * 2025 Yearly Configuration
 * Uses a green/emerald primary color theme
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
  Twitter,
  MapPinCheck,
  BookOpen,
  Gift,
} from "lucide-react";
import type { YearlyConfig } from "../types";
import Logo from "@/assets/logo 2024.png";
import alQuran2024 from "@/assets/Al Quran.png";
import BuburKijangLogo from "@/assets/bubur-kijang.png";
import CapDuaJagoLogo from "@/assets/cap-dua-jago.png";
import FotoinProjectLogo from "@/assets/fotoin-project.png";
import KamarBacaMagelangLogo from "@/assets/kamar-baca-magelang.png";
import SKSFoundationLogo from "@/assets/sks-foundation.png";
import QRISImage from "@/assets/qris-code.png";
import BackgroundImage2024 from "@/assets/islamic-pattern-4.svg";
import AlMubarok from "@/assets/al mubarok.png";

const config2024: YearlyConfig = {
  theme: {
    primaryColor: "#47736d", // Emerald/Green
  },

  backgroundImage: BackgroundImage2024,
  backgroundImageSize: "100px",

  spreadsheetId: "1gQgeowsKnFXgw3xf7DtcqY8uCqG9o3IKsMxlyAQeAFY",

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
    title: "Donasi Al-Qur'an 2024",
    tagline: "Rahasia kebahagiaan adalah dengan memperbanyak berbagi",
    description: "Mari bersama-sama menebar manfaat dengan berdonasi Al-Qur'an untuk mereka yang membutuhkan. Setiap donasi Anda akan menjadi amal jariyah yang terus mengalir pahalanya. Terima kasih atas dukungan dan kebaikan hati Anda.",
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

  publishers: [
    { name: "Al Mubarok", logo: AlMubarok },
  ],

  helpers: [
    "Setya Handayani",
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
      subtitle: "Bank UOB",
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
      href: "#",
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
      href: "#",
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
    isOpen: false,
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
      answer: "Donasi direncanakan akan ditutup pada 20 Maret 2024. Namun demikian, donasi dapat ditutup lebih awal apabila kuota donasi yang dibutuhkan telah terpenuhi.",
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
      title: "HAFAZAN 8 PERKATA LATIN 2 WARNA “AL-MUBAROK”",
      image: alQuran2024,
      description: "Al-Qur’an Hafazan 8 Perkata Latin 2 Warna “Al-Mubarok” adalah mushaf hafalan berformat A5 dengan sistem 8 blok warna per halaman, dilengkapi transliterasi latin terpisah, terjemah perkata standar Kemenag RI, kolom awal dan nomor ayat, serta tanda waqaf untuk memudahkan membaca, memahami, dan menghafal Al-Qur’an secara terstruktur.",
      advantages: [
        "Sistem 8 blok warna per halaman memudahkan visualisasi dan pembagian hafalan.",
        "Transliterasi latin terpisah membantu yang belum lancar membaca huruf Arab.",
        "Menggunakan Rasm Utsmani Standar Indonesia.",
        "Dilengkapi terjemah perkata standar Kemenag RI.",
        "Tersedia kolom awal ayat dan nomor ayat untuk memudahkan mengingat posisi ayat.",
        "Memiliki pedoman transliterasi Arab-Latin.",
        "Dilengkapi tanda waqaf dan ibtida (jeda/terus).",
        "Disertai doa khatam Al-Qur’an dan Asmaul Husna.",
      ],
      reasons: [
        "Memudahkan proses menghafal secara terstruktur dan sistematis.",
        "Membantu menjaga konsistensi hafalan per blok.",
        "Cocok untuk pemula hingga program tahfidz lanjutan.",
        "Mendukung hafalan sekaligus pemahaman makna ayat.",
        "Ideal digunakan di sekolah, pesantren, maupun pembelajaran di rumah.",
      ],
    },
  ],
};

export default config2024;
