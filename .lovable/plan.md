

# Plan: Extend Donation Report with Dynamic Tables and Fixes

## Summary

Fix date display, make tables fully dynamic from Google Sheets headers, add `[hide]` column support, improve detail modals, handle Bukti image previews, and calculate total donation amount from live data.

---

## Changes Overview

### 1. Refactor `useGoogleSheets.ts` - Add Dynamic Data Hook

**Problem**: The current hook uses hardcoded mappers and column names. The Google Sheets API returns messy headers (merged with sheet titles) and Penyaluran has no parsed headers at all.

**Solution**: Add a new `useGoogleSheetDynamic` hook alongside the existing ones that:
- Extracts clean column headers dynamically from the API response
- Handles the edge case where `parsedNumHeaders` is 0 (Penyaluran) by detecting headers from data rows
- Cleans merged title text from column labels (e.g. strips "Laporan Donasi Al Quran 2026" prefix from "Tanggal")
- Parses `Date(year,month,day)` values into readable `dd MMM yyyy` format using the `date-fns` library (already installed)
- Returns `{ headers: string[], rows: Record<string, string>[], loading, error, refetch }`
- Keeps existing typed hooks (`useDonasiMasuk`, etc.) intact for backward compatibility

**Date parsing logic**: The Google Visualization API returns dates as `"Date(2026,1,8)"` in the `v` field and `"2/8/2026"` in the `f` field. We will prefer the `f` (formatted) value, and additionally parse `Date()` values into `dd MMM yyyy` format for better readability.

**Add a `useDonasiTotal` hook** that fetches "Donasi Masuk" data and sums all numeric `Nominal` values, returning a formatted Rupiah string.

### 2. Update `DonationReportModal.tsx` - Dynamic Tables

**Problem**: Table columns are hardcoded (`["Tanggal", "Donatur", "Nominal"]`, etc.) and row rendering uses fixed field accessors.

**Solution**:
- Replace the hardcoded `SheetTable` usage with a new `DynamicSheetTable` component
- Columns are derived from the sheet headers returned by the dynamic hook
- Support for `[hide]` marker: columns whose header contains `[hide]` are excluded from the table view
- The `[hide]` text is stripped from display labels everywhere
- Each row is clickable and opens a detail modal, passing the full row data (including hidden columns)
- The table auto-adapts grid columns based on the number of visible headers

### 3. Unified Dynamic Detail Modal

**Problem**: Three separate detail modals (`DonasiMasukDetail`, `RealisasiDetail`, `PenyaluranDetail`) are all hardcoded with specific fields.

**Solution**: Create a single `DynamicDetailModal` component that:
- Receives a `Record<string, string>` row and the full `headers` array
- Renders ALL fields dynamically (including those marked `[hide]` in the table)
- Strips `[hide]` from labels in the modal display
- Detects the "Bukti" column and renders it with image preview logic:
  - Google Drive links: convert to thumbnail URL (`drive.google.com/thumbnail?id=...`)
  - Instagram links: attempt embed/preview, fallback to clickable link
  - Direct image URLs: render `<img>` with error fallback
  - Non-image URLs: render as clickable external link
- Uses appropriate icons per field name (Calendar for Tanggal, User for Donatur, Banknote for Nominal, etc.) with a fallback icon for unknown fields
- The existing three detail components (`DonasiMasukDetail.tsx`, `RealisasiDetail.tsx`, `PenyaluranDetail.tsx`) will be replaced by this unified component

### 4. Update `DonationAmount.tsx` and `Index.tsx` - Live Total

**Problem**: The donation amount is hardcoded as `"Rp0"` in `Index.tsx`.

**Solution**:
- Update `DonationAmount` to accept an optional loading state
- In `Index.tsx`, use the new `useDonasiTotal` hook to fetch and sum the Nominal column from "Donasi Masuk"
- Pass the calculated total to `DonationAmount`
- Show a subtle loading skeleton while data is being fetched
- The total auto-updates when the Google Sheets data changes (on page load/refresh)

### 5. Bukti Column Rendering in Detail Modal

**Rendering logic for the Bukti field:**
- Check if value is a URL
- If Google Drive link: extract file ID, render as `drive.google.com/thumbnail?id=FILE_ID&sz=w800`
- If Instagram link: render as clickable link with Instagram icon (direct image embedding from Instagram is unreliable due to CORS)
- If direct image URL (`.jpg`, `.png`, `.webp`, etc.): render inline `<img>`
- All cases include a "Buka di tab baru" fallback link
- Image preview includes `onError` handler that falls back to link-only display

---

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/useGoogleSheets.ts` | Modify | Add `useGoogleSheetDynamic`, `useDonasiTotal`, improve date parsing |
| `src/components/DonationReportModal.tsx` | Modify | Replace hardcoded tables with dynamic columns, use unified detail modal |
| `src/components/DynamicDetailModal.tsx` | Create | New unified detail modal rendering all fields dynamically with Bukti preview |
| `src/components/DonationAmount.tsx` | Modify | Accept loading prop, show skeleton state |
| `src/pages/Index.tsx` | Modify | Use `useDonasiTotal` hook, pass live amount to `DonationAmount` |
| `src/components/DonasiMasukDetail.tsx` | Remove | Replaced by `DynamicDetailModal` |
| `src/components/RealisasiDetail.tsx` | Remove | Replaced by `DynamicDetailModal` |
| `src/components/PenyaluranDetail.tsx` | Remove | Replaced by `DynamicDetailModal` |

---

## Technical Details

### Date Parsing Helper

```text
Input from API:  { v: "Date(2026,1,8)", f: "2/8/2026" }
Output:          "8 Feb 2026"

Logic:
1. If cell has 'f' value, use it as base
2. Parse "Date(y,m,d)" from 'v' field
3. Note: Google months are 0-indexed (1 = February)
4. Format using date-fns: format(new Date(2026, 1, 8), 'dd MMM yyyy')
```

### [hide] Column Logic

```text
Header in sheet:  "Saldo [hide]"
In table view:    Column is hidden (not rendered)
In detail modal:  Shown as "Saldo" (marker stripped)
```

### Donation Total Calculation

```text
Source: "Donasi Masuk" sheet, "Nominal" column
Each cell: { v: 50000, f: "Rp50.000" }
Sum all numeric 'v' values
Format result: "Rp" + total.toLocaleString('id-ID')
```

### Dynamic Header Extraction

```text
For sheets with parsedNumHeaders > 0:
  - Use column labels from API
  - Strip sheet title prefix (detect common prefix across labels)
  - If label contains "Tanggal" at the end, extract just "Tanggal"

For Penyaluran (parsedNumHeaders = 0):
  - Scan data rows to find the header row
  - Use that row's values as column headers
  - Exclude that row and any title rows from data
```

