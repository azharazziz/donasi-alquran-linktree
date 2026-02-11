import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";

const SPREADSHEET_ID = "16-BQVDuCcsKixvTynVXVIOcYTwCcq-Tkz3rdajJIHis";

// Sheet names mapped to their gid values
const SHEET_CONFIG = {
  "Donasi Masuk": 0,
  "Realisasi": 1,
  "Penyaluran Donasi": 2,
} as const;

export type SheetName = keyof typeof SHEET_CONFIG;

// --- Existing typed interfaces (kept for backward compatibility) ---

export interface DonasiMasukRow {
  tanggal: string;
  donatur: string;
  nominal: string;
  saldo: string;
}

export interface RealisasiRow {
  tanggal: string;
  keperluan: string;
  quranQty: string;
  iqroQty: string;
  nominal: string;
  saldo: string;
}

export interface PenyaluranRow {
  tanggal: string;
  tempat: string;
  qtyIqro: string;
  qtyAlQuran: string;
  bukti: string;
}

// --- Date parsing helper ---

function parseDateValue(cell: { v: string | number | null; f?: string } | null): string {
  if (!cell) return "";

  const vStr = cell.v?.toString() ?? "";

  // Try to parse Google's Date(y,m,d) format
  const dateMatch = vStr.match(/^Date\((\d+),(\d+),(\d+)\)$/);
  if (dateMatch) {
    const year = parseInt(dateMatch[1]);
    const month = parseInt(dateMatch[2]); // 0-indexed
    const day = parseInt(dateMatch[3]);
    try {
      return format(new Date(year, month, day), "d MMM yyyy");
    } catch {
      // fallback to formatted value
    }
  }

  // Use formatted value if available
  if (cell.f) return cell.f;

  return vStr;
}

function parseCellValue(cell: { v: string | number | null; f?: string } | null): string {
  if (!cell) return "";

  const vStr = cell.v?.toString() ?? "";

  // Check if it's a date value
  if (vStr.startsWith("Date(")) {
    return parseDateValue(cell);
  }

  // Use formatted value if available, otherwise raw value
  return cell.f ?? vStr;
}

// --- Legacy parser (kept for backward compatibility) ---

function parseGvizResponse(text: string): Record<string, string>[] {
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) return [];

  try {
    const json = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
    const cols: { label: string }[] = json.table?.cols || [];
    const rows: { c: ({ v: string | number | null; f?: string } | null)[] }[] =
      json.table?.rows || [];

    const headers = cols.map((c) => c.label || "");

    return rows.map((row) => {
      const obj: Record<string, string> = {};
      row.c?.forEach((cell, i) => {
        const key = headers[i] || `col_${i}`;
        obj[key] = parseCellValue(cell);
      });
      return obj;
    });
  } catch (err) {
    console.error("Failed to parse Google Sheets response:", err);
    return [];
  }
}

// --- Dynamic parser ---

interface GvizJson {
  table?: {
    cols?: { label: string; type?: string }[];
    rows?: { c: ({ v: string | number | null; f?: string } | null)[] }[];
    parsedNumHeaders?: number;
  };
}

function extractGvizJson(text: string): GvizJson | null {
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) return null;
  try {
    return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
  } catch {
    return null;
  }
}

function cleanHeaderLabel(label: string): string {
  // Remove common sheet title prefixes like "Laporan Donasi Al Quran 2026"
  // These appear when headers get merged with the sheet title
  let cleaned = label.trim();

  // If the label contains a known column keyword at the end, extract it
  const knownKeywords = [
    "Tanggal", "Donatur", "Nominal", "Saldo", "Keperluan",
    "Quran Qty", "Iqro Qty", "Tempat", "Qty Iqro", "Qty Al Quran", "Bukti",
  ];

  for (const kw of knownKeywords) {
    if (cleaned.endsWith(kw) && cleaned.length > kw.length) {
      return kw;
    }
  }

  return cleaned;
}

export interface DynamicSheetData {
  headers: string[];
  rows: Record<string, string>[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGoogleSheetDynamic(sheetName: SheetName, enabled = true): DynamicSheetData {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const json = extractGvizJson(text);
      if (!json?.table) throw new Error("Invalid response format");

      const cols = json.table.cols || [];
      const rawRows = json.table.rows || [];
      const parsedNumHeaders = json.table.parsedNumHeaders ?? 1;

      let extractedHeaders: string[];
      let dataRows: { c: ({ v: string | number | null; f?: string } | null)[] }[];

      if (parsedNumHeaders > 0 && cols.some((c) => c.label && c.label.trim() !== "")) {
        // Headers from column labels
        extractedHeaders = cols.map((c) => cleanHeaderLabel(c.label || `col_${cols.indexOf(c)}`));
        dataRows = rawRows;
      } else {
        // Headers not parsed (e.g. Penyaluran) — detect from data rows
        // Find the first row where most cells have non-empty string values (the header row)
        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(rawRows.length, 5); i++) {
          const row = rawRows[i];
          const cellValues = row.c?.map((cell) => cell?.v?.toString() ?? "") ?? [];
          const nonEmpty = cellValues.filter((v) => v.length > 0);
          // A header row typically has mostly text, not dates/numbers
          const hasDateValues = cellValues.some((v) => v.startsWith("Date("));
          if (nonEmpty.length >= 2 && !hasDateValues) {
            headerRowIndex = i;
            break;
          }
        }

        if (headerRowIndex >= 0) {
          extractedHeaders = rawRows[headerRowIndex].c?.map(
            (cell) => cell?.v?.toString()?.trim() ?? ""
          ) ?? [];
          dataRows = rawRows.slice(headerRowIndex + 1);
        } else {
          // Fallback: use col indices
          extractedHeaders = cols.map((_, i) => `col_${i}`);
          dataRows = rawRows;
        }
      }

      // Filter out empty headers
      const validIndices = extractedHeaders
        .map((h, i) => ({ header: h, index: i }))
        .filter((item) => item.header.length > 0);

      const finalHeaders = validIndices.map((item) => item.header);

      // Map rows
      const mappedRows = dataRows
        .filter((row) => {
          // Skip completely empty rows
          const cells = row.c ?? [];
          return validIndices.some((item) => {
            const cell = cells[item.index];
            return cell && (cell.v !== null && cell.v !== undefined && cell.v !== "");
          });
        })
        .map((row) => {
          const obj: Record<string, string> = {};
          validIndices.forEach((item) => {
            const cell = row.c?.[item.index] ?? null;
            obj[item.header] = parseCellValue(cell);
          });
          return obj;
        });

      setHeaders(finalHeaders);
      setRows(mappedRows);
    } catch (err) {
      console.error(`Failed to fetch ${sheetName}:`, err);
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [sheetName, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { headers, rows, loading, error, refetch: fetchData };
}

// --- Donation total hook ---

export function useDonasiTotal(enabled = true) {
  const [total, setTotal] = useState<string>("Rp0");
  const [loading, setLoading] = useState(false);

  const fetchTotal = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent("Donasi Masuk")}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const json = extractGvizJson(text);
      if (!json?.table) throw new Error("Invalid response");

      const cols = json.table.cols || [];
      const rows = json.table.rows || [];

      // Find the Nominal column index
      let nominalIndex = -1;
      for (let i = 0; i < cols.length; i++) {
        const label = cleanHeaderLabel(cols[i].label || "");
        if (label === "Nominal") {
          nominalIndex = i;
          break;
        }
      }

      if (nominalIndex === -1) {
        setTotal("Rp0");
        return;
      }

      // Sum numeric values
      let sum = 0;
      for (const row of rows) {
        const cell = row.c?.[nominalIndex];
        if (cell?.v != null) {
          const num = typeof cell.v === "number" ? cell.v : parseFloat(String(cell.v).replace(/[^\d.-]/g, ""));
          if (!isNaN(num)) {
            sum += num;
          }
        }
      }

      setTotal("Rp" + sum.toLocaleString("id-ID"));
    } catch (err) {
      console.error("Failed to fetch donation total:", err);
      setTotal("Rp0");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchTotal();
  }, [fetchTotal]);

  return { total, loading };
}

// --- Realisasi total hook ---

export function useRealisasiTotal(enabled = true) {
  const [total, setTotal] = useState<string>("Rp0");
  const [loading, setLoading] = useState(false);

  const fetchTotal = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent("Realisasi")}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const json = extractGvizJson(text);
      if (!json?.table) throw new Error("Invalid response");

      const cols = json.table.cols || [];
      const rows = json.table.rows || [];

      let nominalIndex = -1;
      for (let i = 0; i < cols.length; i++) {
        const label = cleanHeaderLabel(cols[i].label || "");
        if (label === "Nominal") {
          nominalIndex = i;
          break;
        }
      }

      if (nominalIndex === -1) {
        setTotal("Rp0");
        return;
      }

      let sum = 0;
      for (const row of rows) {
        const cell = row.c?.[nominalIndex];
        if (cell?.v != null) {
          const num = typeof cell.v === "number" ? cell.v : parseFloat(String(cell.v).replace(/[^\d.-]/g, ""));
          if (!isNaN(num)) {
            sum += num;
          }
        }
      }

      setTotal("Rp" + sum.toLocaleString("id-ID"));
    } catch (err) {
      console.error("Failed to fetch realisasi total:", err);
      setTotal("Rp0");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchTotal();
  }, [fetchTotal]);

  return { total, loading };
}

// --- Donatur list hook ---

export function useDonaturList(enabled = true) {
  const [names, setNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const ANON = new Set(["nn", "anonim", "anonymous", ""]);

  const fetchNames = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent("Donasi Masuk")}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const json = extractGvizJson(text);
      if (!json?.table) throw new Error("Invalid response");

      const cols = json.table.cols || [];
      const rows = json.table.rows || [];

      let donaturIndex = -1;
      for (let i = 0; i < cols.length; i++) {
        const label = cleanHeaderLabel(cols[i].label || "");
        if (label === "Donatur") { donaturIndex = i; break; }
      }

      if (donaturIndex === -1) { setNames([]); return; }

      const seen = new Set<string>();
      const result: string[] = [];
      for (const row of rows) {
        const cell = row.c?.[donaturIndex];
        const raw = (cell?.v?.toString() ?? "").trim();
        const display = ANON.has(raw.toLowerCase()) ? "Hamba Allah" : raw;
        if (display && !seen.has(display)) {
          seen.add(display);
          result.push(display);
        }
      }
      setNames(result);
    } catch (err) {
      console.error("Failed to fetch donatur list:", err);
      setNames([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => { fetchNames(); }, [fetchNames]);

  return { names, loading };
}

// --- Legacy typed hooks (kept for backward compatibility) ---

function mapDonasiMasuk(raw: Record<string, string>[]): DonasiMasukRow[] {
  return raw
    .filter((r) => r["Tanggal"] || r["Donatur"] || r["Nominal"])
    .map((r) => ({
      tanggal: r["Tanggal"] || "",
      donatur: r["Donatur"] || "",
      nominal: r["Nominal"] || "",
      saldo: r["Saldo"] || "",
    }));
}

function mapRealisasi(raw: Record<string, string>[]): RealisasiRow[] {
  return raw
    .filter((r) => r["Tanggal"] || r["Keperluan"] || r["Nominal"])
    .map((r) => ({
      tanggal: r["Tanggal"] || "",
      keperluan: r["Keperluan"] || "",
      quranQty: r["Quran Qty"] || "",
      iqroQty: r["Iqro Qty"] || "",
      nominal: r["Nominal"] || "",
      saldo: r["Saldo"] || "",
    }));
}

function mapPenyaluran(raw: Record<string, string>[]): PenyaluranRow[] {
  return raw
    .filter((r) => r["Tanggal"] || r["Tempat"])
    .map((r) => ({
      tanggal: r["Tanggal"] || "",
      tempat: r["Tempat"] || "",
      qtyIqro: r["QTY IQRO"] || "",
      qtyAlQuran: r["QTY AL QURAN"] || "",
      bukti: r["Bukti"] || "",
    }));
}

export function useGoogleSheet<T>(
  sheetName: SheetName,
  mapper: (raw: Record<string, string>[]) => T[],
  enabled = true
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const raw = parseGvizResponse(text);
      setData(mapper(raw));
    } catch (err) {
      console.error(`Failed to fetch ${sheetName}:`, err);
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [sheetName, mapper, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useDonasiMasuk(enabled = true) {
  return useGoogleSheet("Donasi Masuk", mapDonasiMasuk, enabled);
}

export function useRealisasi(enabled = true) {
  return useGoogleSheet("Realisasi", mapRealisasi, enabled);
}

export function usePenyaluran(enabled = true) {
  return useGoogleSheet("Penyaluran Donasi", mapPenyaluran, enabled);
}
