# Flag System Documentation

## Overview

The Donasi Alquran system uses a **flag-based metadata system** to control column visibility, styling, and dashboard display without modifying the actual data structure. All flags are defined in Google Sheets column headers using bracket notation like `[flag]` or `[flag:value]`.

### Key Principle
**Flags control presentation logic, not data logic.** All data (including flagged columns) is always counted in totals and calculations.

---

## Flag Types

### 1. `[highlight]` - Dashboard Display

**Purpose:** Columns marked with `[highlight]` are displayed as cards in the dashboard highlight section.

**Usage:**
```
Quran Qty [highlight]
Iqro Qty [highlight] [icon:book] [color:#4F46E5]
```

**Behavior:**
- The column name (without flags) becomes the card label
- The numeric sum from all rows becomes the card value
- Scanned from all sheets and merged by name
- Can include additional flags for styling (`[icon:...]`, `[color:...]`)
- Always included in totals/calculations

**Example in Sheets:**
```
| Quran Qty [highlight] [icon:book] |
|-----|
| 10  |
| 15  |
| 25  |
```

Dashboard shows: **Quran Qty: 50**

---

### 2. `[hide]` - Summary Modal Visibility

**Purpose:** Columns marked with `[hide]` are hidden in the summary modal table but visible in the detail modal.

**Usage:**
```
Internal Notes [hide]
Reference ID [hide]
```

**Behavior:**
- Hidden from the summary table in Donation Report Modal
- **Visible** when clicking a row to view details
- All data still counted in totals/calculations
- Allows for sensitive/internal information

**View Behavior:**
- **Summary Modal**: Hidden
- **Detail Modal**: Shown
- **UI Display**: "Internal Notes" (flags stripped)

---

### 3. `[private]` - Complete Privacy

**Purpose:** Columns marked with `[private]` are completely hidden from all modal views.

**Usage:**
```
Secret Code [private]
Internal Status [private]
```

**Behavior:**
- Hidden from both summary and detail modals
- Data is still counted in totals/calculations
- For system-wide sensitive information
- Not visible to any user

**View Behavior:**
- **Summary Modal**: Hidden
- **Detail Modal**: Hidden
- **Dashboard**: Not used
- **Totals**: Still counted

---

### 4. `[icon:name]` - Custom Icons

**Purpose:** Specifies a custom Lucide icon for dashboard highlight cards.

**Usage:**
```
Quran Qty [highlight] [icon:book]
Gifts [highlight] [icon:gift]
```

**Available Icons:**
- `book`, `alquran` → BookOpen
- `gift`, `hadiah` → Gift
- `package` → Package
- `heart` → Heart
- `star` → Star
- `sparkles` → Sparkles

**Fallback Logic:**
If no icon specified, system auto-detects based on column name:
- Contains "quran" or "iqro" → BookOpen
- Contains "hadiah" or "gift" → Gift
- Otherwise → Package

---

### 5. `[color:#HEX]` - Custom Colors

**Purpose:** Specifies a custom hex color for dashboard highlight cards and styling.

**Usage:**
```
Quran Qty [highlight] [color:#4F46E5]
Books [highlight] [color:#FF6B35]
```

**Format:**
- Must be valid hex color: `#RRGGBB`
- Applied to card icon, number, and accent line
- Overrides default primary color

**Example:**
```
Iqro [highlight] [icon:book] [color:#10B981]
```

---

## System Architecture

### Data Flow

```
Google Sheets
       ↓
fetchSheetJson()
       ↓
useGoogleSheetDynamic()
   ├─ Retrieves ALL headers (with flags)
   ├─ Retrieves ALL rows (complete data)
   └─ Returns: { headers: [...], rows: [...] }
       ↓
┌─────────────────────────────────────┐
│     DonationReportModal             │
├─────────────────────────────────────┤
│                                     │
│  Summary View (Tab)                │
│  ├─ Use getSummaryHeaders()        │
│  │  └─ Exclude [hide] & [private] │
│  ├─ Display table with filtered   │
│  │  headers but full data rows     │
│  └─ Pass detail headers on click   │
│                                     │
│  Detail View (Modal on click)      │
│  ├─ Use getDetailHeaders()         │
│  │  └─ Include [hide]              │
│  │  └─ Exclude [private]           │
│  ├─ Display all non-private fields │
│  └─ Strip flags from names         │
│                                     │
└─────────────────────────────────────┘
       ↓
   UI Display (Flags Hidden)
```

### Component Responsibilities

#### `useGoogleSheetDynamic()`
- Fetches raw sheet data from Google Sheets
- **Preserves flags in headers** for filtering logic
- Returns complete rows with all data
- Handles both parsed and unparsed sheets

#### `DonationReportModal`
- Manages tab-based sheet navigation
- **Summary table**: Filters headers with `getSummaryHeaders()`
  - Hides [hide] and [private] columns
  - Shows all other columns
- **Detail modal**: Filters headers with `getDetailHeaders()`
  - Includes [hide] columns
  - Excludes [private] columns

#### `DynamicDetailModal`
- Displays detail view for a single row
- Iterates over provided headers
- **Strips flags** from header names for display
- Accesses row data using full header (with flags) as key
- Special handling for [Bukti] field (image/URL rendering)

#### `useHighlightItems()`
- Scans all sheets for [highlight] columns
- **Calculates totals** for each highlight item
- Extracts [icon:...] and [color:...] values
- Merges same-name items across different sheets

#### `HighlightCards`
- Displays dashboard cards from highlight items
- Uses custom icons and colors from flags
- Shows name and total quantity
- **All flags remain hidden** - only display name and number shown

---

## Flag Filtering Functions

Located in `src/lib/flags.ts`:

### Core Functions

```typescript
stripFlags(header: string) → string
  └─ Removes all flag patterns, returns clean name
  
isHiddenColumn(header: string) → boolean
  └─ Returns true if header contains [hide] OR [private]
  
isPrivateColumn(header: string) → boolean
  └─ Returns true if header contains [private] only
  
isHighlightColumn(header: string) → boolean
  └─ Returns true if header contains [highlight]
  
extractFlag(header: string, flagName: string) → string | undefined
  └─ Extracts keyed flag value, e.g., extractFlag(h, "icon")
```

### Helper Functions

```typescript
getSummaryHeaders(headers: string[]) → string[]
  └─ Returns headers excluding [hide] and [private]
  └─ Used by summary modal table
  
getDetailHeaders(headers: string[]) → string[]
  └─ Returns headers excluding [private] only
  └─ Used by detail modal for row view
```

---

## Common Use Cases

### Case 1: Hide Internal Column

**Sheets Configuration:**
```
| Item | Qty | Internal Notes [hide] |
|------|-----|----------------------|
| Book | 10  | Damaged items       |
| Book | 15  | Pending delivery    |
```

**Result:**
- **Summary Modal**: Shows "Item" and "Qty" columns, hides "Internal Notes"
- **Detail Modal**: Shows all three columns when clicking a row
- **Data**: All values counted in totals

---

### Case 2: Private System Field

**Sheets Configuration:**
```
| Donor | Amount | System ID [private] |
|-------|--------|-------------------|
| Ali   | 100    | SYS001           |
| Budi  | 250    | SYS002           |
```

**Result:**
- **Summary Modal**: Shows only "Donor" and "Amount"
- **Detail Modal**: Shows only "Donor" and "Amount" (ID hidden)
- **Data**: All values counted in totals

---

### Case 3: Styled Dashboard Highlight

**Sheets Configuration:**
```
| Quran Distributed [highlight] [icon:book] [color:#4F46E5] |
|-------|
| 25    |
| 30    |
| 20    |
```

**Result:**
- **Dashboard**: Card showing "Quran Distributed: 75" with BookOpen icon in blue color
- **Styling**: All flags hidden from display, only name and number shown
- **Responsive**: Merges this column across all sheets

---

## Extending the System

### Adding New Flags

The system automatically handles new flags. No code changes needed:

```
| Item | Qty [highlight] [mynewflag:value] |
```

**Important:** Ensure your code checks for custom flags where needed:

```typescript
// In your component
if (hasAnyFlag(header)) {
  const customValue = extractFlag(header, "mynewflag");
  // Handle custom flag logic
}
```

### Adding New Icons

Update `src/components/HighlightCards.tsx` ICON_MAP:

```typescript
const ICON_MAP: Record<string, LucideIcon> = {
  book: BookOpen,
  myicon: MyCustomIcon, // Add new entry
  // ...
};
```

### Adding New Sheets

No configuration needed! System automatically:
1. Detects new sheet in `SHEET_NAMES`
2. Fetches data dynamically
3. Processes flags in new columns
4. Merges highlight items from new sheet

---

## Data Integrity

### All Data is Preserved

Even hidden/private columns are:
- ✅ Fetched from Sheets
- ✅ Stored in row objects
- ✅ Counted in totals/calculations
- ✅ Available in detail view (except [private])
- ❌ Never displayed without permission

### Calculations Always Include All Data

```typescript
// Example: Highlight total calculation
let total = 0;
for (const row of dataRows) {
  const cell = row.c?.[colIndex];
  if (cell?.v != null) {
    // Adds ALL numeric values, regardless of flags
    const num = parseFloat(String(cell.v).replace(/[^\d.-]/g, ""));
    if (!isNaN(num)) total += num;
  }
}
```

---

## Troubleshooting

### Flags Not Functioning?

**Check:**
1. Header spelling matches criteria (case-insensitive but exact bracket syntax)
2. Column header ends with flag, e.g., `Name [hide]` ✓ vs `Name[hide]` ✗
3. Flag is properly closed with `]`
4. No typos in flag names

**Example:**
```
❌ [Hide]      (case matters for function matching, but flags are case-insensitive)
✓ [hide]       (correct)
❌ Name [hide (missing closing bracket)
✓ Name [hide]  (correct)
```

---

### Highlight Cards Not Appearing?

**Check:**
1. Column header contains `[highlight]` flag
2. Column contains numeric values
3. Sheet name matches `SHEET_NAMES` in config
4. At least one row has data

**Debug:**
- Open browser console
- Check `useHighlightItems` hook output
- Verify Google Sheets fetch succeeds

---

### Detail Modal Not Showing [hide] Columns?

**Check:**
1. `DonationReportModal` passes `getDetailHeaders()` result to modal
2. Column marked with `[hide]` not `[private]`
3. Row has data for the column

**Verify:**
- Click detail view on a row
- Look for section with stripped flag name

---

## Best Practices

1. **Use Consistent Spacing**
   ```
   ✓ "Name [highlight]"  (space before bracket)
   ```

2. **One Flag Per Type**
   ```
   ✓ "Item [highlight] [icon:book] [color:#FF5733]"
   ✓ "Item [highlight]"
   ❌ "Item [highlight] [highlight]" (unnecessary duplication)
   ```

3. **Meaningful Names**
   ```
   ✓ "Internal Notes [hide]"
   ❌ "X [hide]"
   ```

4. **Document Custom Icons/Colors**
   ```
   ✓ "Books [highlight] [icon:book] [color:#4F46E5]" + Comment
   ```

5. **Consider User Privacy**
   ```
   [hide]   - For internal/sensitive info
   [private] - For system-only fields
   ```

---

## API Reference

### `src/lib/flags.ts`

All functions are exported and available for import:

```typescript
import {
  stripFlags,
  isHiddenColumn,
  isPrivateColumn,
  isHighlightColumn,
  extractFlag,
  hasAnyFlag,
  getSummaryHeaders,
  getDetailHeaders,
} from "@/lib/flags";
```

---

## Summary

The flag system provides a powerful, flexible way to control data presentation without modifying the data itself. By using bracket notation in Google Sheets headers, you can:

- 🎨 Customize dashboard display (`[highlight]`, `[icon:...]`, `[color:...]`)
- 🔒 Control visibility across modals (`[hide]`, `[private]`)
- 🔄 Automatically handle new sheets and columns
- 📊 Ensure all data is included in calculations
- ✨ Keep the UI clean by hiding flag syntax

The system is extensible, meaning new flags can be added to sheets at any time and will be automatically recognized and processed by the application.
