/**
 * Centralized application configuration.
 *
 * All app-wide constants and settings are defined here.
 * To update the Google Sheets data source, change SPREADSHEET_ID below.
 */

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
