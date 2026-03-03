// ---------------------------------------------------------------------------
// Flag utilities — centralised logic for parsing & stripping header flags
// ---------------------------------------------------------------------------

/**
 * Strips ALL bracket flags (e.g. [hide], [highlight], [icon:book], [color:#FFF])
 * from a header string, returning a clean display name.
 */
export function stripFlags(header: string): string {
  return header.replace(/\s*\[[^\]]*\]\s*/g, " ").trim();
}

/** Returns true if the header contains `[hide]` or `[private]`. */
export function isHiddenColumn(header: string): boolean {
  return /\[(hide|private)\]/i.test(header);
}

/** Returns true if the header contains `[private]`. */
export function isPrivateColumn(header: string): boolean {
  return /\[private\]/i.test(header);
}

/** Returns true if the header contains `[highlight]`. */
export function isHighlightColumn(header: string): boolean {
  return /\[highlight\]/i.test(header);
}

/** Extracts a keyed flag value like `[icon:book]` → `"book"`. Returns undefined if not found. */
export function extractFlag(header: string, flagName: string): string | undefined {
  const re = new RegExp(`\\[${flagName}:([^\\]]+)\\]`, "i");
  const match = header.match(re);
  return match?.[1]?.trim();
}
