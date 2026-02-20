import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
  SPREADSHEET_ID,
  SHEET_NAMES,
  COLUMNS,
  ANONYMOUS_NAMES,
  ANONYMOUS_DISPLAY,
  type SheetName,
} from "@/config";

export type { SheetName };

// ---------------------------------------------------------------------------
// Cell / response parsing
// ---------------------------------------------------------------------------

type GvizCell = { v: string | number | null; f?: string } | null;

function parseDateValue(cell: GvizCell): string {
  if (!cell) return "";
  const vStr = cell.v?.toString() ?? "";
  const dateMatch = vStr.match(/^Date\((\d+),(\d+),(\d+)\)$/);
  if (dateMatch) {
    const [, y, m, d] = dateMatch.map(Number);
    try {
      return format(new Date(y, m, d), "d MMM yyyy");
    } catch { /* fall through */ }
  }
  return cell.f ?? vStr;
}

function parseCellValue(cell: GvizCell): string {
  if (!cell) return "";
  const vStr = cell.v?.toString() ?? "";
  if (vStr.startsWith("Date(")) return parseDateValue(cell);
  return cell.f ?? vStr;
}

interface GvizJson {
  table?: {
    cols?: { label: string; type?: string }[];
    rows?: { c: GvizCell[] }[];
    parsedNumHeaders?: number;
  };
}

function extractGvizJson(text: string): GvizJson | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(text.substring(start, end + 1));
  } catch {
    return null;
  }
}

/** Strips sheet-title prefixes that Google merges into column labels. */
function cleanHeaderLabel(label: string): string {
  const cleaned = label.trim();
  for (const kw of Object.values(COLUMNS)) {
    if (cleaned.endsWith(kw) && cleaned.length > kw.length) return kw;
  }
  return cleaned;
}

// ---------------------------------------------------------------------------
// Generic fetch helper
// ---------------------------------------------------------------------------

async function fetchSheetJson(sheetName: SheetName): Promise<GvizJson> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = extractGvizJson(await res.text());
  if (!json?.table) throw new Error("Invalid response format");
  return json;
}

// ---------------------------------------------------------------------------
// useGoogleSheetDynamic — dynamic headers + rows for the report modal
// ---------------------------------------------------------------------------

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
      const json = await fetchSheetJson(sheetName);
      const cols = json.table!.cols ?? [];
      const rawRows = json.table!.rows ?? [];
      const parsedNumHeaders = json.table!.parsedNumHeaders ?? 1;

      let extractedHeaders: string[];
      let dataRows: { c: GvizCell[] }[];

      if (parsedNumHeaders > 0 && cols.some((c) => c.label?.trim())) {
        extractedHeaders = cols.map((c, i) => cleanHeaderLabel(c.label || `col_${i}`));
        dataRows = rawRows;
      } else {
        // Sheets like "Penyaluran" have no parsed headers — detect from data rows
        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(rawRows.length, 5); i++) {
          const cellValues = rawRows[i].c?.map((c) => c?.v?.toString() ?? "") ?? [];
          const nonEmpty = cellValues.filter((v) => v.length > 0);
          const hasDate = cellValues.some((v) => v.startsWith("Date("));
          if (nonEmpty.length >= 2 && !hasDate) { headerRowIndex = i; break; }
        }
        if (headerRowIndex >= 0) {
          extractedHeaders = rawRows[headerRowIndex].c?.map((c) => c?.v?.toString()?.trim() ?? "") ?? [];
          dataRows = rawRows.slice(headerRowIndex + 1);
        } else {
          extractedHeaders = cols.map((_, i) => `col_${i}`);
          dataRows = rawRows;
        }
      }

      const validIndices = extractedHeaders
        .map((h, i) => ({ header: h, index: i }))
        .filter((item) => item.header.length > 0);

      const mappedRows = dataRows
        .filter((row) =>
          validIndices.some(({ index }) => {
            const c = row.c?.[index];
            return c && c.v !== null && c.v !== undefined && c.v !== "";
          })
        )
        .map((row) => {
          const obj: Record<string, string> = {};
          validIndices.forEach(({ header, index }) => {
            obj[header] = parseCellValue(row.c?.[index] ?? null);
          });
          return obj;
        });

      setHeaders(validIndices.map((item) => item.header));
      setRows(mappedRows);
    } catch (err) {
      console.error(`Failed to fetch ${sheetName}:`, err);
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [sheetName, enabled]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { headers, rows, loading, error, refetch: fetchData };
}

// ---------------------------------------------------------------------------
// useDonasiTotal — sum of Nominal column from "Donasi Masuk"
// ---------------------------------------------------------------------------

export function useDonasiTotal(enabled = true) {
  const [total, setTotal] = useState("Rp0");
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTotal = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const json = await fetchSheetJson(SHEET_NAMES.DONASI_MASUK);
      const cols = json.table!.cols ?? [];
      const rows = json.table!.rows ?? [];

      const nominalIndex = cols.findIndex(
        (c) => cleanHeaderLabel(c.label || "") === COLUMNS.NOMINAL
      );
      if (nominalIndex === -1) { setTotal("Rp0"); return; }

      let sum = 0;
      let latestDate: Date | null = null;

      // Find the date column index
      const dateIndex = cols.findIndex(
        (c) => cleanHeaderLabel(c.label || "") === COLUMNS.TANGGAL || c.type === "date"
      );

      for (const row of rows) {
        const cell = row.c?.[nominalIndex];
        if (cell?.v != null) {
          const num = typeof cell.v === "number" ? cell.v : parseFloat(String(cell.v).replace(/[^\d.-]/g, ""));
          if (!isNaN(num)) sum += num;
        }

        // Track latest date
        if (dateIndex !== -1) {
          const dateCell = row.c?.[dateIndex];
          const dateStr = dateCell?.v?.toString() ?? "";
          const dateMatch = dateStr.match(/^Date\((\d+),(\d+),(\d+)\)$/);
          if (dateMatch) {
            const [, y, m, d] = dateMatch.map(Number);
            const date = new Date(y, m, d);
            if (!latestDate || date > latestDate) latestDate = date;
          }
        }
      }

      setTotal("Rp" + sum.toLocaleString("id-ID"));
      if (latestDate) {
        setLastUpdate(format(latestDate, "d MMM yyyy"));
      }
    } catch (err) {
      console.error("Failed to fetch donation total:", err);
      setTotal("Rp0");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => { fetchTotal(); }, [fetchTotal]);
  return { total, loading, lastUpdate };
}

// ---------------------------------------------------------------------------
// useRealisasiTotal — sum of Nominal column from "Realisasi"
// ---------------------------------------------------------------------------

export function useRealisasiTotal(enabled = true) {
  const [total, setTotal] = useState("Rp0");
  const [loading, setLoading] = useState(false);

  const fetchTotal = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const json = await fetchSheetJson(SHEET_NAMES.REALISASI);
      const cols = json.table!.cols ?? [];
      const rows = json.table!.rows ?? [];

      const nominalIndex = cols.findIndex(
        (c) => cleanHeaderLabel(c.label || "") === COLUMNS.NOMINAL
      );
      if (nominalIndex === -1) { setTotal("Rp0"); return; }

      const sum = rows.reduce((acc, row) => {
        const cell = row.c?.[nominalIndex];
        if (cell?.v == null) return acc;
        const num = typeof cell.v === "number" ? cell.v : parseFloat(String(cell.v).replace(/[^\d.-]/g, ""));
        return acc + (isNaN(num) ? 0 : num);
      }, 0);

      setTotal("Rp" + sum.toLocaleString("id-ID"));
    } catch (err) {
      console.error("Failed to fetch realisasi total:", err);
      setTotal("Rp0");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => { fetchTotal(); }, [fetchTotal]);
  return { total, loading };
}

// ---------------------------------------------------------------------------
// useDonaturList — unique donor names from "Donasi Masuk"
// ---------------------------------------------------------------------------

export function useDonaturList(enabled = true) {
  const [names, setNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNames = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const json = await fetchSheetJson(SHEET_NAMES.DONASI_MASUK);
      const cols = json.table!.cols ?? [];
      const rows = json.table!.rows ?? [];

      const donaturIndex = cols.findIndex(
        (c) => cleanHeaderLabel(c.label || "") === COLUMNS.DONATUR
      );
      if (donaturIndex === -1) { setNames([]); return; }

      const seen = new Set<string>();
      const result: string[] = [];
      for (const row of rows) {
        const raw = (row.c?.[donaturIndex]?.v?.toString() ?? "").trim();
        const display = ANONYMOUS_NAMES.has(raw.toLowerCase()) ? ANONYMOUS_DISPLAY : raw;
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
