import { useState, useEffect, useCallback } from "react";

const SPREADSHEET_ID = "16-BQVDuCcsKixvTynVXVIOcYTwCcq-Tkz3rdajJIHis";

// Sheet names mapped to their gid values
const SHEET_CONFIG = {
  "Donasi Masuk": 0,
  "Realisasi": 1,
  "Penyaluran Donasi": 2,
} as const;

export type SheetName = keyof typeof SHEET_CONFIG;

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

function parseGvizResponse(text: string): Record<string, string>[] {
  // The response is wrapped in google.visualization.Query.setResponse({...})
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
        obj[key] = cell?.f ?? cell?.v?.toString() ?? "";
      });
      return obj;
    });
  } catch (err) {
    console.error("Failed to parse Google Sheets response:", err);
    return [];
  }
}

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
