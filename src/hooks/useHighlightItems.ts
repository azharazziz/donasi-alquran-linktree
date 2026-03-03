import { useState, useEffect, useCallback } from "react";
import { SPREADSHEET_ID, SHEET_NAMES } from "@/config";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HighlightItem {
  name: string;
  total: number;
  icon?: string;
  color?: string;
}

// ---------------------------------------------------------------------------
// Header flag parser
// ---------------------------------------------------------------------------

interface ParsedHeader {
  index: number;
  name: string;
  icon?: string;
  color?: string;
}

/**
 * Parses a header like "Al Quran [highlight] [icon:book] [color:#2E7D32]"
 * Returns null if the header doesn't contain [highlight].
 */
function parseHighlightHeader(label: string, index: number): ParsedHeader | null {
  if (!/\[highlight\]/i.test(label)) return null;

  // Extract name by stripping all [...] tags
  const name = label.replace(/\s*\[[^\]]*\]\s*/g, " ").trim();

  const iconMatch = label.match(/\[icon:([^\]]+)\]/i);
  const colorMatch = label.match(/\[color:([^\]]+)\]/i);

  return {
    index,
    name,
    icon: iconMatch?.[1]?.trim(),
    color: colorMatch?.[1]?.trim(),
  };
}

// ---------------------------------------------------------------------------
// GViz helpers (duplicated minimal set to avoid circular deps)
// ---------------------------------------------------------------------------

type GvizCell = { v: string | number | null; f?: string } | null;

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

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useHighlightItems(enabled = true) {
  const [items, setItems] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAMES.PENYALURAN)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = extractGvizJson(await res.text());
      if (!json?.table) throw new Error("Invalid response");

      const cols = json.table.cols ?? [];
      const rows = json.table.rows ?? [];
      const parsedNumHeaders = json.table.parsedNumHeaders ?? 1;

      // Determine actual headers — same logic as useGoogleSheetDynamic
      let headers: string[];
      let dataRows: { c: GvizCell[] }[];

      if (parsedNumHeaders > 0 && cols.some((c) => c.label?.trim())) {
        headers = cols.map((c) => c.label || "");
        dataRows = rows;
      } else {
        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(rows.length, 5); i++) {
          const cellValues = rows[i].c?.map((c) => c?.v?.toString() ?? "") ?? [];
          const nonEmpty = cellValues.filter((v) => v.length > 0);
          const hasDate = cellValues.some((v) => v.startsWith("Date("));
          if (nonEmpty.length >= 2 && !hasDate) {
            headerRowIndex = i;
            break;
          }
        }
        if (headerRowIndex >= 0) {
          headers = rows[headerRowIndex].c?.map((c) => c?.v?.toString()?.trim() ?? "") ?? [];
          dataRows = rows.slice(headerRowIndex + 1);
        } else {
          headers = cols.map((_, i) => `col_${i}`);
          dataRows = rows;
        }
      }

      // Find [highlight] columns
      const highlightCols = headers
        .map((h, i) => parseHighlightHeader(h, i))
        .filter((p): p is ParsedHeader => p !== null);

      // Sum each highlight column
      const result: HighlightItem[] = highlightCols.map(({ index, name, icon, color }) => {
        let total = 0;
        for (const row of dataRows) {
          const cell = row.c?.[index];
          if (cell?.v != null) {
            const num = typeof cell.v === "number"
              ? cell.v
              : parseFloat(String(cell.v).replace(/[^\d.-]/g, ""));
            if (!isNaN(num)) total += num;
          }
        }
        return { name, total, icon, color };
      });

      setItems(result);
    } catch (err) {
      console.error("Failed to fetch highlight items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { items, loading };
}
