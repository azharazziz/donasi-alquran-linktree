import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { stripFlags } from "@/lib/flags";
import { useYearContext } from "@/contexts/YearContext";

export type SheetName = "Donasi Masuk" | "Realisasi" | "Penyaluran Donasi";

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

/**
 * Normalize column names by removing sheet prefixes while PRESERVING flags.
 * Used internally for column matching (finding TANGGAL, NOMINAL, etc.)
 * Does NOT strip flags - use stripFlags() separately for display.
 */
function normalizeHeaderForMatching(label: string, columns: Record<string, string>): string {
  const trimmed = label.trim();
  // Remove common sheet prefixes like "Donasi Masuk " from "Donasi Masuk Nominal [hide]"
  // But preserve the flags
  for (const kw of Object.values(columns)) {
    // Check if the label contains this keyword (potentially with flags after it)
    const pattern = new RegExp(`\\b${kw}\\b`, "i");
    if (pattern.test(stripFlags(trimmed))) {
      // Return the label as-is to preserve flags
      return trimmed;
    }
  }
  return trimmed;
}

/**
 * For column matching only - strips flags and sheet prefixes.
 * Used internally in column detection logic only.
 */
function cleanHeaderLabel(label: string, columns: Record<string, string>): string {
  const cleaned = stripFlags(label.trim());
  for (const kw of Object.values(columns)) {
    if (cleaned.endsWith(kw) && cleaned.length > kw.length) return kw;
  }
  return cleaned;
}

// ---------------------------------------------------------------------------
// Generic fetch helper
// ---------------------------------------------------------------------------

async function fetchSheetJson(spreadsheetId: string, sheetName: SheetName): Promise<GvizJson> {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = extractGvizJson(await res.text());
  if (!json?.table) throw new Error("Invalid response format");
  return json;
}

// ---------------------------------------------------------------------------
// useGoogleSheetDynamic — dynamic headers + rows for the report modal
// ---------------------------------------------------------------------------

/**
 * Represents sheet data with complete headers and rows for report modals.
 *
 * **Data Integrity:**
 * - headers: Column names WITH flags intact (for filtering logic)
 * - rows: Complete data objects with all columns (including [hide] and [private])
 *
 * **How Flags Are Used:**
 * - Component code calls getSummaryHeaders() / getDetailHeaders() on headers
 * - These functions filter based on [hide] and [private] flags
 * - Row data remains complete for all use cases
 * - UI only displays what's allowed by the flag rules
 *
 * @property headers - Column names with flags preserved, e.g., ["Name", "Nominal [hide]", "Secret [private]"]
 * @property rows - Data rows with keys matching headers
 * @property loading - Fetch operation in progress
 * @property error - Error message if fetch failed
 * @property refetch - Function to manually retry the fetch
 */
export interface DynamicSheetData {
  headers: string[];
  rows: Record<string, string>[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * React hook that fetches a single sheet's data with complete headers and rows.
 *
 * **Purpose:** Provides complete, unfiltered sheet data for report modals.
 *
 * **Key Behaviors:**
 * 1. Fetches ALL columns and rows from the specified sheet
 * 2. Preserves flags in header names for filtering logic ([hide], [private], etc.)
 * 3. Returns complete row data (including flagged columns)
 * 4. Handles both Google Sheets with parsed headers and unparsed sheets
 * 5. Automatically detects header row if not explicitly parsed
 *
 * **Data Preservation:**
 * - All data is fetched and returned (no filtering at fetch time)
 * - Flags in headers are used by downstream components to decide visibility
 * - Row objects have keys matching the full header names (with flags)
 * - Components call getSummaryHeaders() / getDetailHeaders() to filter for display
 *
 * **Modal Flow:**
 * 1. DonationReportModal receives this hook for each sheet
 * 2. Summary table calls getSummaryHeaders(headers) to get visible columns
 * 3. Table displays rows using only visible headers
 * 4. When user clicks a row, getDetailHeaders(headers) is called
 * 5. Detail modal receives headers and full row data
 * 6. Detail modal filters which columns to show based on received headers
 *
 * **Error Handling:**
 * - Returns empty headers/rows on fetch failure
 * - Provides error message for UI feedback
 * - Provides refetch() function for manual retry
 *
 * @param sheetName - Name of the sheet to fetch (from SHEET_NAMES)
 * @param enabled - Whether to fetch data (default: true). When false, does nothing.
 * @returns DynamicSheetData with headers (with flags), complete rows, loading, error, refetch
 *
 * @example
 * const { headers, rows, loading, error, refetch } = useGoogleSheetDynamic("Donasi Masuk");
 *
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error} onRetry={refetch} />;
 *
 * // Summary table - show non-hidden columns
 * const summaryHeaders = getSummaryHeaders(headers);
 * <Table headers={summaryHeaders} rows={rows} />
 *
 * // On row click - show detail with non-private columns
 * const detailHeaders = getDetailHeaders(headers);
 * <DetailModal headers={detailHeaders} row={rows[index]} />
 */
export function useGoogleSheetDynamic(sheetName: SheetName, enabled = true): DynamicSheetData {
  const { config } = useYearContext();
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const json = await fetchSheetJson(config.spreadsheetId, sheetName);
      const cols = json.table!.cols ?? [];
      const rawRows = json.table!.rows ?? [];
      const parsedNumHeaders = json.table!.parsedNumHeaders ?? 1;

      let extractedHeaders: string[];
      let dataRows: { c: GvizCell[] }[];

      if (parsedNumHeaders > 0 && cols.some((c) => c.label?.trim())) {
        // Preserve raw headers WITH flags for filtering
        extractedHeaders = cols.map((c, i) => c.label?.trim() || `col_${i}`);
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

      // Return headers AS-IS with flags preserved for filtering logic
      setHeaders(validIndices.map((item) => item.header));
      setRows(mappedRows);
    } catch (err) {
      console.error(`Failed to fetch ${sheetName}:`, err);
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [sheetName, enabled, config.spreadsheetId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { headers, rows, loading, error, refetch: fetchData };
}

// ---------------------------------------------------------------------------
// Helper: extract latest date from any sheet's rows
// ---------------------------------------------------------------------------

function extractLatestDate(cols: { label: string; type?: string }[], rows: { c: GvizCell[] }[], tanggalColumn: string): Date | null {
  const dateIndex = cols.findIndex(
    (c) => cleanHeaderLabel(c.label || "", { tanggal: tanggalColumn }) === tanggalColumn || c.type === "date"
  );
  if (dateIndex === -1) return null;

  let latest: Date | null = null;
  for (const row of rows) {
    const dateCell = row.c?.[dateIndex];
    const dateStr = dateCell?.v?.toString() ?? "";
    const dateMatch = dateStr.match(/^Date\((\d+),(\d+),(\d+)\)$/);
    if (dateMatch) {
      const [, y, m, d] = dateMatch.map(Number);
      const date = new Date(y, m, d);
      if (!latest || date > latest) latest = date;
    }
  }
  return latest;
}

// ---------------------------------------------------------------------------
// useDonasiTotal — sum of Nominal column from "Donasi Masuk"
// ---------------------------------------------------------------------------

export function useDonasiTotal(enabled = true) {
  const { config } = useYearContext();
  const [total, setTotal] = useState("Rp0");
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTotal = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      // Fetch all sheets in parallel
      const sheetNamesDonasi = config.sheetNames;
      const [donasiJson, realisasiJson, penyaluranJson] = await Promise.all([
        fetchSheetJson(config.spreadsheetId, sheetNamesDonasi.donasiMasuk),
        fetchSheetJson(config.spreadsheetId, sheetNamesDonasi.realisasi).catch(() => null),
        fetchSheetJson(config.spreadsheetId, sheetNamesDonasi.penyaluran).catch(() => null),
      ]);

      const cols = donasiJson.table!.cols ?? [];
      const rows = donasiJson.table!.rows ?? [];

      const nominalIndex = cols.findIndex(
        (c) => cleanHeaderLabel(c.label || "", config.columns) === config.columns.nominal
      );
      if (nominalIndex === -1) { setTotal("Rp0"); return; }

      let sum = 0;
      for (const row of rows) {
        const cell = row.c?.[nominalIndex];
        if (cell?.v != null) {
          const num = typeof cell.v === "number" ? cell.v : parseFloat(String(cell.v).replace(/[^\d.-]/g, ""));
          if (!isNaN(num)) sum += num;
        }
      }

      // Find latest date across all sheets
      const dates = [
        extractLatestDate(cols, rows, config.columns.tanggal),
        realisasiJson ? extractLatestDate(realisasiJson.table!.cols ?? [], realisasiJson.table!.rows ?? [], config.columns.tanggal) : null,
        penyaluranJson ? extractLatestDate(penyaluranJson.table!.cols ?? [], penyaluranJson.table!.rows ?? [], config.columns.tanggal) : null,
      ].filter((d): d is Date => d !== null);

      const latestDate = dates.length > 0 ? dates.reduce((a, b) => (a > b ? a : b)) : null;

      setTotal("Rp" + sum.toLocaleString("id-ID"));
      setLastUpdate(latestDate ? format(latestDate, "d MMM yyyy") : null);
    } catch (err) {
      console.error("Failed to fetch donation total:", err);
      setTotal("Rp0");
    } finally {
      setLoading(false);
    }
  }, [enabled, config]);

  useEffect(() => { fetchTotal(); }, [fetchTotal]);
  return { total, loading, lastUpdate };
}

// ---------------------------------------------------------------------------
// useRealisasiTotal — sum of Nominal column from "Realisasi"
// ---------------------------------------------------------------------------

export function useRealisasiTotal(enabled = true) {
  const { config } = useYearContext();
  const [total, setTotal] = useState("Rp0");
  const [loading, setLoading] = useState(false);

  const fetchTotal = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const json = await fetchSheetJson(config.spreadsheetId, config.sheetNames.realisasi);
      const cols = json.table!.cols ?? [];
      const rows = json.table!.rows ?? [];

      const nominalIndex = cols.findIndex(
        (c) => cleanHeaderLabel(c.label || "", config.columns) === config.columns.nominal
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
  }, [enabled, config]);

  useEffect(() => { fetchTotal(); }, [fetchTotal]);
  return { total, loading };
}

// ---------------------------------------------------------------------------
// useDonaturList — unique donor names from "Donasi Masuk"
// ---------------------------------------------------------------------------

export function useDonaturList(enabled = true) {
  const { config } = useYearContext();
  const [names, setNames] = useState<string[]>([]);
  const [anonCount, setAnonCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNames = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const json = await fetchSheetJson(config.spreadsheetId, config.sheetNames.donasiMasuk);
      const cols = json.table!.cols ?? [];
      const rows = json.table!.rows ?? [];

      const donaturIndex = cols.findIndex(
        (c) => cleanHeaderLabel(c.label || "", config.columns) === config.columns.donatur
      );
      if (donaturIndex === -1) { setNames([]); setAnonCount(0); return; }

      const anonymousSet = new Set(config.anonymousDonorNames.map(n => n.toLowerCase()));
      const seen = new Set<string>();
      const result: string[] = [];
      let anonCount = 0;
      
      for (const row of rows) {
        const raw = (row.c?.[donaturIndex]?.v?.toString() ?? "").trim();
        const isAnonymous = anonymousSet.has(raw.toLowerCase());
        
        if (isAnonymous) {
          anonCount++;
        } else if (raw && !seen.has(raw)) {
          seen.add(raw);
          result.push(raw);
        }
      }
      
      setNames(result);
      setAnonCount(anonCount);
    } catch (err) {
      console.error("Failed to fetch donatur list:", err);
      setNames([]);
      setAnonCount(0);
    } finally {
      setLoading(false);
    }
  }, [enabled, config]);

  useEffect(() => { fetchNames(); }, [fetchNames]);
  return { names, anonCount, loading };
}
