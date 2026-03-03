/**
 * Yearly Configuration Type Definition
 * All yearly config files MUST export an object following this exact shape
 */

import type { LucideIcon } from "lucide-react";
import type { ColorPalette } from "./theme-generator";

export interface YearlyConfig {
  // Theme
  theme: {
    primaryColor: string; // Hex color code
  };

  // Google Sheets
  spreadsheetId: string;
  sheetNames: {
    donasiMasuk: string;
    realisasi: string;
    penyaluran: string;
  };
  columns: {
    tanggal: string;
    donatur: string;
    nominal: string;
    saldo: string;
    keperluan: string;
    quranQty: string;
    iqroQty: string;
    tempat: string;
    qtyIqro: string;
    qtyAlQuran: string;
    bukti: string;
  };

  // Anonymous Donor Settings
  anonymousDonorNames: string[];
  anonymousDonorDisplay: string;

  // Content
  initiators: Array<{
    name: string;
    initials: string;
  }>;
  helpers: string[];

  // Links
  links: Array<{
    icon: LucideIcon;
    title: string;
    subtitle?: string;
    href?: string;
    action?: string;
  }>;

  // Common Content
  niatDonasi: {
    label: string;
    text: string;
  };

  // Modal Configurations
  qrisConfig: {
    title: string;
    description: string;
    nmid: string;
    merchantName: string;
    scanInfo: string;
    downloadText: string;
    downloadFilename: string;
  };

  bankAccounts: Array<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }>;

  // Donation Status
  donationStatus: {
    isOpen: boolean;
    closedMessage: string;
  };

  // Social Media
  socialMediaLinks: Array<{
    name: string;
    icon: LucideIcon;
    url: string;
    color: string;
    bgColor: string;
  }>;
}
