// ---------------------------------------------------------------------------
// Flag utilities — centralised logic for parsing & stripping header flags
//
// Flags are metadata annotations in column headers that control display and
// behavior without appearing in the UI. All flag patterns are case-insensitive.
//
// Examples:
//   "Item Name [highlight]"              ← Item shown in dashboard highlights
//   "Internal Notes [hide]"              ← Hidden in summary, shown in detail
//   "Secret Code [private]"              ← Hidden in both summary and detail
//   "Icon Field [icon:book]"            ← Use custom icon in UI
//   "Amount [color:#FF6B35]"            ← Use custom color for styling
//
// Flag Types:
//   [highlight]  - Item quantity displayed in dashboard cards
//   [hide]       - Column hidden in summary modal, shown in detail modal
//   [private]    - Column hidden in both summary and detail modals
//   [icon:name]  - Custom icon for rendering (e.g., icon:book, icon:gift)
//   [color:#HEX] - Custom color hex code for styling (e.g., color:#FF6B35)
//   Future flags can be added anytime and are automatically handled
// ---------------------------------------------------------------------------

/**
 * Strips ALL bracket flags (e.g. [hide], [highlight], [icon:book], [color:#FFF])
 * from a header string, returning a clean display name.
 *
 * @param header - Header string potentially containing flags
 * @returns Clean header name with all flags removed
 *
 * @example
 * stripFlags("Item Name [highlight] [icon:book]") // "Item Name"
 * stripFlags("Nominal [hide]") // "Nominal"
 */
export function stripFlags(header: string): string {
  return header.replace(/\s*\[[^\]]*\]\s*/g, " ").trim();
}

/**
 * Checks if a column should be hidden in the summary modal.
 * Returns true for headers containing [hide] OR [private] flags.
 * These columns are hidden from the summary table view.
 *
 * @param header - Column header to check
 * @returns true if column is hidden in summary ([hide] or [private])
 *
 * @example
 * isHiddenColumn("Internal [hide]") // true
 * isHiddenColumn("Secret [private]") // true
 * isHiddenColumn("Normal Field") // false
 */
export function isHiddenColumn(header: string): boolean {
  return /\[(hide|private)\]/i.test(header);
}

/**
 * Checks if a column should be completely private and hidden from all views.
 * Returns true for headers containing [private] flag only.
 * These columns are hidden from both summary and detail modals.
 *
 * @param header - Column header to check
 * @returns true if column is private ([private])
 *
 * @example
 * isPrivateColumn("Secret [private]") // true
 * isPrivateColumn("Internal [hide]") // false
 * isPrivateColumn("Normal Field") // false
 */
export function isPrivateColumn(header: string): boolean {
  return /\[private\]/i.test(header);
}

/**
 * Checks if this column represents a [highlight] item for dashboard display.
 * Highlight columns have numeric quantities that are summed and displayed
 * as dashboard cards with icon and color styling.
 *
 * @param header - Column header to check
 * @returns true if column is marked for highlighting ([highlight])
 *
 * @example
 * isHighlightColumn("Quran Qty [highlight]") // true
 * isHighlightColumn("Iqro [highlight] [icon:book]") // true
 * isHighlightColumn("Name") // false
 */
export function isHighlightColumn(header: string): boolean {
  return /\[highlight\]/i.test(header);
}

/**
 * Extracts a keyed flag value in the format [flagName:value].
 * Flag names and values are case-insensitive, returns trimmed value.
 *
 * @param header - Column header to search
 * @param flagName - Name of the flag to extract (e.g., "icon", "color")
 * @returns The extracted value, or undefined if flag not found
 *
 * @example
 * extractFlag("Item [icon:book]", "icon") // "book"
 * extractFlag("Amount [color:#FF6B35]", "color") // "#FF6B35"
 * extractFlag("Name [hide]", "icon") // undefined (flag not present)
 */
export function extractFlag(header: string, flagName: string): string | undefined {
  const re = new RegExp(`\\[${flagName}:([^\\]]+)\\]`, "i");
  const match = header.match(re);
  return match?.[1]?.trim();
}

/**
 * Checks if a header contains any flag by looking for bracket patterns.
 * Useful for identifying headers that have metadata attached.
 *
 * @param header - Header to check
 * @returns true if header contains any bracket flag
 *
 * @example
 * hasAnyFlag("Item [highlight]") // true
 * hasAnyFlag("Item [icon:book] [color:#FF]") // true
 * hasAnyFlag("Plain Header") // false
 */
export function hasAnyFlag(header: string): boolean {
  return /\[[^\]]+\]/.test(header);
}

/**
 * Filters headers for summary modal view.
 * Excludes both [hide] and [private] columns.
 *
 * @param headers - All headers including flagged ones
 * @returns Headers visible in summary modal
 *
 * @example
 * getSummaryHeaders(["Name", "Nominal [hide]", "Secret [private]"])
 * // Returns: ["Name"]
 */
export function getSummaryHeaders(headers: string[]): string[] {
  return headers.filter((h) => !isHiddenColumn(h));
}

/**
 * Filters headers for detail modal view.
 * Excludes [private] columns but includes [hide] columns.
 *
 * @param headers - All headers including flagged ones
 * @returns Headers visible in detail modal
 *
 * @example
 * getDetailHeaders(["Name", "Nominal [hide]", "Secret [private]"])
 * // Returns: ["Name", "Nominal [hide]"]
 */
export function getDetailHeaders(headers: string[]): string[] {
  return headers.filter((h) => !isPrivateColumn(h));
}
