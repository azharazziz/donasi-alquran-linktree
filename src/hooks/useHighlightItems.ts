import { useState, useEffect, useCallback } from "react";
import { isHighlightColumn, extractFlag, stripFlags } from "@/lib/flags";
import { useYearContext } from "@/contexts/YearContext";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Represents a highlighted item for dashboard display.
 *
 * Highlight items are columns marked with [highlight] flag across all sheets.
 * The total is calculated by summing all numeric values in that column.
 *
 * @property name - Clean column name (with flags stripped)
 * @property total - Sum of all numeric values in the column across all rows
 * @property icon - Custom icon name from [icon:name] flag, e.g., "book"
 * @property color - Custom hex color from [color:#HEX] flag, e.g., "#4F46E5"
 *
 * @example
 * {
 *   name: "Quran Distributed",
 *   total: 75,
 *   icon: "book",
 *   color: "#4F46E5"
 * }
 */
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

async function fetchSheetJson(spreadsheetId: string, sheetName: string): Promise<GvizJson> {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
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

/**
 * Scans a sheet's headers for [highlight] flags and calculates totals.
 *
 * For each column marked with [highlight]:
 * 1. Extract the clean name (without flags)
 * 2. Extract custom icon from [icon:name] if present
 * 3. Extract custom color from [color:#HEX] if present
 * 4. Sum all numeric values in that column
 *
 * All numeric values are included in the sum, regardless of whether
 * they're in rows with other [hide] or [private] flags. The total
 * represents the complete aggregate.
 *
 * @param headers - Column headers (with flags intact for detection)
 * @param dataRows - Raw data rows from the sheet
 * @returns Array of HighlightItem with name, total, and optional styling
 *
 * @example
 * Headers: ["Item", "Qty [highlight] [icon:book]", "Notes [hide]"]
 * Rows with Qty values: [10, 15, 25]
 * Result: [
 *   { name: "Qty", total: 50, icon: "book" }
 * ]
 */
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

/**
 * React hook that scans all sheets in the spreadsheet for [highlight] columns
 * and returns aggregated highlight items for dashboard display.
 *
 * **Process Flow:**
 * 1. Fetches all sheets in parallel (Donasi Masuk, Realisasi, Penyaluran, etc.)
 * 2. Detects columns marked with [highlight] flag
 * 3. For each highlight column, sums all numeric values across all rows
 * 4. Merges items with the same name (case-insensitive) across multiple sheets
 *   - If same item appears in multiple sheets, totals are combined
 *   - Custom styling (icon, color) is preserved from first occurrence
 * 5. Returns array of HighlightItem sorted by appearance
 *
 * **Data Integrity:**
 * - All numeric values are included in calculations
 * - [hide] and [private] flags don't affect calculations
 * - Totals are complete aggregates across all sheets and rows
 *
 * **Error Handling:**
 * - Gracefully handles missing sheets
 * - Returns empty array on fetch failure
 * - Logs errors to console for debugging
 *
 * **Auto-Update:**
 * - Re-fetches when enabled status changes
 * - Does not auto-refresh on interval (manual refetch only)
 * - Use loading state to show skeleton while fetching
 *
 * @param enabled - Whether to fetch data (default: true)
 * @returns Object with:
 *   - items: Array of HighlightItem with name, total, optional icon/color
 *   - loading: Boolean indicating fetch in progress
 *
 * @example
 * const { items, loading } = useHighlightItems();
 *
 * if (loading) return <SkeletonLoader />;
 * if (items.length === 0) return <p>No highlights</p>;
 *
 * return items.map(item => (
 *   <HighlightCard
 *     key={item.name}
 *     name={item.name}
 *     total={item.total}
 *     icon={item.icon}
 *     color={item.color}
 *   />
 * ));
 */
export function useHighlightItems(enabled = true) {
  const { config } = useYearContext();
  const [items, setItems] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const allSheets = Object.values(config.sheetNames);
      const jsonResults = await Promise.all(
        allSheets.map((name) => fetchSheetJson(config.spreadsheetId, name).catch(() => null))
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
  }, [enabled, config]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { items, loading };
}
