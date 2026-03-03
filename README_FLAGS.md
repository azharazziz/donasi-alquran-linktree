# Donasi Alquran - Flag System Implementation Guide

## 📚 Documentation Files

### For First-Time Users / Administrators
**Start here:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- 60-second introduction to flags
- Common patterns and examples
- Quick flag reference table
- Troubleshooting tips

### For System Administrators
**Detailed guide:** [FLAG_SYSTEM.md](./FLAG_SYSTEM.md)
- Complete system documentation
- How the system works
- All flag types explained
- Data flow diagrams
- Use case examples
- Best practices

### For Developers
**Implementation details:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- What was implemented
- Technical architecture
- Code changes made
- Requirements fulfillment
- Quality assurance details

---

## 📁 File Structure

### Core Implementation Files

```
src/
├── lib/
│   └── flags.ts ........................ Flag detection & filtering utilities
│       ├── stripFlags()
│       ├── isHiddenColumn()
│       ├── isPrivateColumn()
│       ├── isHighlightColumn()
│       ├── extractFlag()
│       ├── hasAnyFlag()
│       ├── getSummaryHeaders()
│       └── getDetailHeaders()
│
├── hooks/
│   ├── useGoogleSheets.ts ............ Fetches sheet data with complete headers
│   │   └── useGoogleSheetDynamic()  (Returns headers with flags preserved)
│   │
│   └── useHighlightItems.ts ......... Processes [highlight] columns
│       └── useHighlightItems()      (Aggregates across all sheets)
│
└── components/
    ├── HighlightCards.tsx ........... Dashboard card display
    │   └── Uses useHighlightItems()
    │
    ├── DonationReportModal.tsx ....... Summary & detail modals
    │   ├── Summary view: getSummaryHeaders()
    │   ├── Detail modal: getDetailHeaders()
    │   └── Uses useGoogleSheetDynamic()
    │
    └── DynamicDetailModal.tsx ........ Detail row display
        └── stripFlags() for display
```

---

## 🔄 Data Flow

### 1. Dashboard Highlight Cards Flow
```
Google Sheets
    ↓
useHighlightItems()
  ├─ Fetches all sheets
  ├─ Finds [highlight] columns
  ├─ Sums values
  ├─ Extracts [icon:...] and [color:...]
  └─ Merges same items across sheets
    ↓
HighlightCards Component
  ├─ Displays cards
  ├─ Uses icons and colors
  └─ Hides all flags from UI
    ↓
Dashboard Display ✨
```

### 2. Report Modal Flow
```
Google Sheets
    ↓
useGoogleSheetDynamic() [For each sheet]
  ├─ Fetches all columns WITH flags
  ├─ Fetches all data rows
  └─ Returns complete headers & rows
    ↓
DonationReportModal
  ├─ Summary View:
  │  ├─ getSummaryHeaders() excludes [hide] & [private]
  │  ├─ Table displays visible columns
  │  └─ User clicks row
  │
  └─ Detail Modal on Click:
     ├─ getDetailHeaders() excludes [private] only
     ├─ DynamicDetailModal receives headers & row data
     ├─ stripFlags() for display
     └─ Shows all non-private columns
```

---

## 🎯 Key Features Overview

### ✅ Task 1: Highlight Cards
- **Component:** `HighlightCards.tsx` + `useHighlightItems.ts`
- **What it does:**
  - Scans ALL sheets for `[highlight]` columns
  - Calculates totals by summing numeric values
  - Displays as aesthetic dashboard cards
  - Merges same-name items across sheets
  - Supports `[icon:name]` and `[color:#HEX]`
- **How to use:** Just add `[highlight]` to a column header in Google Sheets

### ✅ Task 2: Donation Report Modals
- **Component:** `DonationReportModal.tsx` + `DynamicDetailModal.tsx`
- **What it does:**
  - Summary Modal: Shows all non-[hide] columns
  - Detail Modal: Shows all non-[private] columns
  - Proper flag-based filtering
  - Complete data preservation
- **How to use:** Click Laporan Donasi button in footer

### ✅ Task 3: Global Flag Handling
- **Location:** `src/lib/flags.ts`
- **What it does:**
  - Automatic sheet detection
  - Automatic column parsing
  - Future-proof flag system
  - All data included in calculations
- **How to use:** System handles everything automatically

---

## 🚀 Quick Start

### For Administrators

1. **Open Google Sheets**
   - Edit column header
   - Add flag in brackets: `Name [highlight]`
   - Press Enter

2. **See the result**
   - App refreshes automatically
   - Dashboard shows new card
   - Or click refresh in modal

### For Developers

1. **Understanding the system**
   - Read: `IMPLEMENTATION_SUMMARY.md`
   - Review: `src/lib/flags.ts` (core utilities)

2. **Adding features**
   - All existing functionality works unchanged
   - System extensible for new flags
   - See documentation for extending

3. **Testing**
   - Add new flags to Google Sheets headers
   - Verify they work as expected
   - Check console for any errors

---

## 📋 Flag Reference

| Flag | Summary | Detail | Purpose |
|------|---------|--------|---------|
| `[highlight]` | ✓ Card | In row | Show on dashboard |
| `[hide]` | ✗ Hidden | ✓ Shown | Internal data |
| `[private]` | ✗ Hidden | ✗ Hidden | System data |
| `[icon:NAME]` | With hl | - | Card icon |
| `[color:#HEX]` | With hl | - | Card color |

---

## 💡 Common Examples

### Example 1: Dashboard Item
```
Header: "Quran Books [highlight]"
Values: 10, 15, 25
Result: Dashboard card "Quran Books: 50"
```

### Example 2: Hidden Column
```
Header: "Internal Notes [hide]"
Result: Hidden in summary, shown in detail modal
```

### Example 3: Styled Card
```
Header: "Books [highlight] [icon:book] [color:#4F46E5]"
Result: Styled card with custom icon and color
```

---

## 🔍 File Locations

### Documentation
- `FLAG_SYSTEM.md` - Complete guide (800+ lines)
- `QUICK_REFERENCE.md` - Quick start guide
- `IMPLEMENTATION_SUMMARY.md` - Technical details

### Core Code
- `src/lib/flags.ts` - All flag utilities
- `src/hooks/useGoogleSheets.ts` - Sheet data fetching
- `src/hooks/useHighlightItems.ts` - Highlight processing
- `src/components/HighlightCards.tsx` - Card display
- `src/components/DonationReportModal.tsx` - Modals
- `src/components/DynamicDetailModal.tsx` - Detail view

### Configuration
- `src/config.ts` - Sheet names and columns

---

## ✨ Features

### Auto-Detection
✅ New sheets automatically included
✅ New columns automatically processed
✅ New flags automatically recognized

### Data Integrity
✅ Complete data fetched from all sheets
✅ No data lost during flag processing
✅ All values included in calculations
✅ Flags control UI visibility only

### User Experience
✅ Automatic UI updates when sheets change
✅ Clean, readable display (flags hidden)
✅ Intuitive modal navigation
✅ Graceful error handling

### Developer Experience
✅ Well-documented code
✅ Clear file organization
✅ Extensible architecture
✅ Type-safe implementations

---

## 📞 Support

### Getting Help

1. **Quick questions about flags?**
   - See `QUICK_REFERENCE.md`

2. **How the system works?**
   - See `FLAG_SYSTEM.md`

3. **Technical implementation?**
   - See `IMPLEMENTATION_SUMMARY.md`

4. **Specific features?**
   - Check inline code comments
   - Review JSDoc documentation

---

## ✅ Implementation Checklist

### Task 1: Highlight Cards
- ✅ Process [highlight] flags
- ✅ Calculate totals
- ✅ Display cards with icons/colors
- ✅ Auto-update on data change
- ✅ Hide flags from UI

### Task 2: Donation Report Modals
- ✅ Process all sheets and columns
- ✅ Handle all flag types
- ✅ Summary: exclude [hide] & [private]
- ✅ Detail: exclude [private] only
- ✅ Hide flags from UI
- ✅ Include all data in calculations

### Task 3: Global Flag Handling
- ✅ Handle new sheets automatically
- ✅ Handle new columns automatically
- ✅ Handle future flags automatically
- ✅ Never display flags in UI

---

## 🎉 You're All Set!

The flag system is fully implemented and ready to use. 

**To get started:**
1. Read `QUICK_REFERENCE.md` for immediate understanding
2. Open Google Sheets
3. Add flags to your column headers
4. Watch the dashboard and modals update automatically!

Enjoy! 🚀
