/**
 * Config Adapter
 * Maps new multi-year config structure to legacy constants
 * Ensures backward compatibility with existing components
 */

import { getDefaultActiveYear, getYearConfig } from "@/config/index";

const defaultConfig = getYearConfig(getDefaultActiveYear());

/**
 * Legacy config constants (read-only exports for backward compatibility)
 * These are derived from the default/active year config
 */

export const SPREADSHEET_ID = defaultConfig.spreadsheetId;

export const SHEET_NAMES = {
  DONASI_MASUK: defaultConfig.sheetNames.donasiMasuk,
  REALISASI: defaultConfig.sheetNames.realisasi,
  PENYALURAN: defaultConfig.sheetNames.penyaluran,
} as const;

export const COLUMNS = {
  TANGGAL: defaultConfig.columns.tanggal,
  DONATUR: defaultConfig.columns.donatur,
  NOMINAL: defaultConfig.columns.nominal,
  SALDO: defaultConfig.columns.saldo,
  KEPERLUAN: defaultConfig.columns.keperluan,
  QURAN_QTY: defaultConfig.columns.quranQty,
  IQRO_QTY: defaultConfig.columns.iqroQty,
  TEMPAT: defaultConfig.columns.tempat,
  QTY_IQRO: defaultConfig.columns.qtyIqro,
  QTY_AL_QURAN: defaultConfig.columns.qtyAlQuran,
  BUKTI: defaultConfig.columns.bukti,
} as const;

export const ANONYMOUS_NAMES = new Set(defaultConfig.anonymousDonorNames);

export const ANONYMOUS_DISPLAY = defaultConfig.anonymousDonorDisplay;

export const INITIATORS = defaultConfig.initiators;

export const INITIATOR_LOGOS: Record<string, string> = {};
// Note: Logos are imported in yearly configs, but we'd need to handle this separately
// For now, components should import their own logos or get them from the active year config

export const HELPERS = defaultConfig.helpers;

export const LINKS = defaultConfig.links;

export const NIAT_DONASI = defaultConfig.niatDonasi;

export const QRIS_CONFIG = {
  title: defaultConfig.qrisConfig.title,
  description: defaultConfig.qrisConfig.description,
  image: "", // Image import not in config, keep empty
  imageAlt: "QRIS Code",
  nmid: defaultConfig.qrisConfig.nmid,
  merchantName: defaultConfig.qrisConfig.merchantName,
  scanInfo: defaultConfig.qrisConfig.scanInfo,
  downloadText: defaultConfig.qrisConfig.downloadText,
  downloadFilename: defaultConfig.qrisConfig.downloadFilename,
} as const;

export const BANK_ACCOUNTS = defaultConfig.bankAccounts;

export const DONATION_STATUS = defaultConfig.donationStatus;

export const SOCIAL_MEDIA_LINKS = defaultConfig.socialMediaLinks;

export type SheetName = (typeof SHEET_NAMES)[keyof typeof SHEET_NAMES];
