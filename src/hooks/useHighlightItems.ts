import { useState, useEffect, useCallback } from "react";
import { SPREADSHEET_ID, SHEET_NAMES } from "@/config";
import { isHighlightColumn, extractFlag, stripFlags } from "@/lib/flags";

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
// GViz helpers (minimal set to avoid circular deps)
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

async function fetchSheetJson(sheetName: string): Promise<GvizJson> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = extractGvizJson(await res.text());
  if (!json?.table) throw new Error("Invalid response");
  return json;
}

// ---------------------------------------------------------------------------
// Resolve headers + data rows from a sheet (handles both parsed & unparsed)
// ---------------------------------------------------------------------------

interface SheetParsed {
  headers: string[];
  dataRows: { c: GvizCell[] }[];
}

function resolveHeadersAndRows(json: GvizJson): SheetParsed {
  const cols = json.table!.cols ?? [];
  const rows = json.table!.rows ?? [];
  const parsedNumHeaders = json.table!.parsedNumHeaders ?? 1;

  if (parsedNumHeaders > 0 && cols.some((c) => c.label?.trim())) {
    return { headers: cols.map((c) => c.label || ""), dataRows: rows };
  }

  // Detect header row from data
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    const vals = rows[i].c?.map((c) => c?.v?.toString() ?? "") ?? [];
    const nonEmpty = vals.filter((v) => v.length > 0);
    const hasDate = vals.some((v) => v.startsWith("Date("));
    if (nonEmpty.length >= 2 && !hasDate) {
      const headers = rows[i].c?.map((c) => c?.v?.toString()?.trim() ?? "") ?? [];
      return { headers, dataRows: rows.slice(i + 1) };
    }
  }

  return { headers: cols.map((_, i) => `col_${i}`), dataRows: rows };
}

// ---------------------------------------------------------------------------
// Sum highlight columns from one sheet
// ---------------------------------------------------------------------------

function sumHighlightColumns(headers: string[], dataRows: { c: GvizCell[] }[]): HighlightItem[] {
  const results: HighlightItem[] = [];

  headers.forEach((h, colIndex) => {
    if (!isHighlightColumn(h)) return;

    const name = stripFlags(h);
    const icon = extractFlag(h, "icon");
    const color = extractFlag(h, "color");

    let total = 0;
    for (const row of dataRows) {
      const cell = row.c?.[colIndex];
      if (cell?.v != null) {
        const num = typeof cell.v === "number"
          ? cell.v
          : parseFloat(String(cell.v).replace(/[^\d.-]/g, ""));
        if (!isNaN(num)) total += num;
      }
    }

    results.push({ name, total, icon, color });
  });

  return results;
}

// ---------------------------------------------------------------------------
// Hook — scans ALL sheets for [highlight] columns
// ---------------------------------------------------------------------------

export function useHighlightItems(enabled = true) {
  const [items, setItems] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const allSheets = Object.values(SHEET_NAMES);
      const jsonResults = await Promise.all(
        allSheets.map((name) => fetchSheetJson(name).catch(() => null))
      );

      const allItems: HighlightItem[] = [];
      const seenNames = new Map<string, number>(); // merge same-name items across sheets

      for (const json of jsonResults) {
        if (!json) continue;
        const { headers, dataRows } = resolveHeadersAndRows(json);
        const sheetItems = sumHighlightColumns(headers, dataRows);

        for (const item of sheetItems) {
          const key = item.name.toLowerCase();
          if (seenNames.has(key)) {
            // Merge totals for same item name across sheets
            const idx = seenNames.get(key)!;
            allItems[idx].total += item.total;
            // Keep icon/color from whichever defines it
            if (item.icon && !allItems[idx].icon) allItems[idx].icon = item.icon;
            if (item.color && !allItems[idx].color) allItems[idx].color = item.color;
          } else {
            seenNames.set(key, allItems.length);
            allItems.push({ ...item });
          }
        }
      }

      setItems(allItems);
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
