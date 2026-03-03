# Quick Reference: Flag System

## Get Started in 60 Seconds

### What Are Flags?
Metadata annotations in column headers that control how data is displayed:
```
"Column Name [flag-here]"   ← Flags go in brackets
```

---

## Common Flag Patterns

### Display Item in Dashboard
```
[highlight]  ← Shows as dashboard card with total quantity
```

**Example:**
```
Header: "Quran Books [highlight]"
Values: 10, 15, 25
Result: Dashboard shows "Quran Books: 50"
```

---

### Customize Dashboard Card Style

**Add Icon:**
```
[highlight] [icon:book]
[highlight] [icon:gift]
[highlight] [icon:heart]
```

**Add Color:**
```
[highlight] [color:#4F46E5]    ← Blue
[highlight] [color:#FF6B35]    ← Orange
[highlight] [color:#10B981]    ← Green
```

**Complete Example:**
```
"Quran Books [highlight] [icon:book] [color:#4F46E5]"
```

---

### Hide Column in Summary, Show in Detail

```
[hide]  ← Appears in detail modal, not in summary table
```

**When to use:** Internal notes, references, intermediate calculations

**Example:**
```
"Internal Notes [hide]"  → Hidden in summary, visible when clicking row
```

---

### Hide from Everything

```
[private]  ← Hidden in both summary and detail modal
```

**When to use:** System IDs, sensitive data, temporary fields

**Example:**
```
"System ID [private]"  → Never shown to user
```

---

## Complete Examples

### Example 1: Item Distribution Tracking

Your sheets have columns:
```
Columns:
- Item Name
- Quantity Distributed [highlight]
- Date
- Location
- Internal Notes [hide]
- Donor ID [private]
```

**Result in App:**
- **Dashboard:** Shows "Quantity Distributed" card with total
- **Summary Modal:** Shows Name, Quantity, Date, Location
- **Detail Modal:** Shows Name, Quantity, Date, Location, Internal Notes
- **Never Shows:** Donor ID

---

### Example 2: Multi-Sheet Aggregation

You have sheets:
- "Donasi Masuk" with "Quran Qty [highlight] [icon:book]"
- "Realisasi" with "Quran Qty [highlight] [icon:book]"
- "Penyaluran" with "Quran Qty [highlight] [icon:book]"

**Result in App:**
- **Dashboard:** Single card "Quran Qty" = sum of ALL three sheets
- All quantities automatically merged and displayed

---

### Example 3: Styled Dashboard Cards

```
Headers:
- "Quran [highlight] [icon:book] [color:#4F46E5]"
- "Iqro [highlight] [icon:book] [color:#10B981]"
- "Gifts [highlight] [icon:gift] [color:#FF6B35]"

Values (sum of all rows):
- Quran: 150
- Iqro: 200
- Gifts: 75

Result: 3 beauttifully styled cards with custom icons and colors
```

---

## Flag Reference

| Flag | Summary | Detail | Used For |
|------|---------|--------|----------|
| `[highlight]` | ✓ Shows as card | Shows in row | Dashboard cards |
| `[hide]` | ✗ Hidden | ✓ Shown | Internal/misc info |
| `[private]` | ✗ Hidden | ✗ Hidden | System fields |
| `[icon:name]` | With highlight | - | Card icon (optional) |
| `[color:#HEX]` | With highlight | - | Card color (optional) |

---

## Available Icons

Use with `[icon:name]`:

```
book, alquran      → 📚 BookOpen
gift, hadiah       → 🎁 Gift
package            → 📦 Package
heart              → ❤️  Heart
star               → ⭐ Star
sparkles           → ✨ Sparkles
```

Auto-detection is smart - if no icon specified:
- Contains "quran" or "iqro" → book icon
- Contains "hadiah" or "gift" → gift icon
- Otherwise → package icon

---

## Color Format

Use with `[color:#HEX]`:

Format: `#RRGGBB` (standard hex colors)

**Examples:**
```
[color:#FF0000]    ← Red
[color:#00FF00]    ← Green
[color:#0000FF]    ← Blue
[color:#FFA500]    ← Orange
[color:#800080]    ← Purple
```

---

## Do's & Don'ts

### ✅ DO

```
✓ "Item Name [highlight]"          (space before bracket)
✓ "Item [highlight] [icon:book]"   (multiple flags)
✓ "Amount [color:#FF0000]"         (hex format)
✓ "Notes [hide]"                   (meaningful names)
```

### ❌ DON'T

```
✗ "Item[highlight]"                (no space)
✗ "Item [HIGHLIGHT]"               (use lowercase)
✗ "Item [highlight"                (missing bracket)
✗ "Item [highlight] [highlight]"   (duplication)
✗ "[highlight]"                    (no header name)
```

---

## Adding to Google Sheets

### Step 1: Open Your Sheet
```
Go to: Google Sheets → Your Spreadsheet
```

### Step 2: Edit Column Header
```
Double-click column header to edit
```

### Step 3: Add Flag
```
Change: "Quantity"
To:     "Quantity [highlight]"
```

### Step 4: Save
```
Press Enter or click outside
```

### Step 5: Refresh App
```
App automatically detects change within seconds
Or click Refresh button in export modal
```

---

## Troubleshooting

### Flag Not Working?

**Check:**
1. [ ] Spelling is correct
2. [ ] Brackets are closed `[flag]` not `[flag`
3. [ ] Space before bracket `Name [flag]` not `Name[flag]`
4. [ ] Column has numeric data (for [highlight])

**Debug:**
1. Open browser console (F12)
2. Check for errors
3. Try manual refresh in modal

---

### Highlight Card Not Showing?

**Check:**
1. [ ] Header has `[highlight]` flag
2. [ ] Column contains numbers
3. [ ] At least one row has data
4. [ ] No sheet name issues

---

### Detail Modal Missing [hide] Column?

**Check:**
1. [ ] Column marked `[hide]` not `[private]`
2. [ ] Row contains data for that column
3. [ ] Click detail modal (not shown in table)

---

## Data Safety

### Important: All Data is Preserved

Even with flags, ALL data is:
- ✅ Fetched from Sheets
- ✅ Stored completely
- ✅ Counted in calculations
- ✅ Available for [hide] columns

**Flags control UI visibility only, never data storage.**

---

## Common Patterns

### Pattern 1: Track Items Distributed

**Setup:**
```
Sheet: "Realisasi"
Columns:
- Item Name
- Qty Distributed [highlight]
- Date
- Notes [hide]
- Verification ID [private]
```

**Usage:**
- Dashboard shows total distributed for each item
- Summary table shows items, qty, date
- Detail shows all info except verification ID

---

### Pattern 2: Donation Record Keeping

**Setup:**
```
Sheet: "Donasi Masuk"
Columns:
- Tanggal
- Donatur
- Nominal
- Bukti
- Catatan Intern [hide]
- System ID [private]
```

**Usage:**
- Summary shows donor, date, amount
- Detail shows all including notes
- System ID never exposed

---

### Pattern 3: Multi-Item Dashboard

**Setup:**
```
Sheet: "Penyaluran"
Columns:
- Quran [highlight] [icon:book] [color:#4F46E5]
- Iqro [highlight] [icon:book] [color:#10B981]
- Hadiah [highlight] [icon:gift] [color:#FF6B35]
- Catatan [hide]
```

**Usage:**
- Dashboard shows 3 styled cards
- 3 different icons and colors
- Summary hides notes, detail shows

---

## Need More Help?

### Full Documentation
See `FLAG_SYSTEM.md` for:
- Detailed system architecture
- Advanced use cases
- Best practices
- Complete API reference

### For Developers
See `IMPLEMENTATION_SUMMARY.md` for:
- Technical implementation details
- Code structure
- Extension guidelines
- File modifications

---

## Summary

1. **Add `[highlight]` → Dashboard card**
2. **Add `[hide]` → Summary hidden, detail shown**
3. **Add `[private]` → Everywhere hidden**
4. **Add `[icon:name]` → Custom card icon**
5. **Add `[color:#HEX]` → Custom card color**
6. **All data preserved** → Flags control UI only
7. **No coding needed** → Just edit header text!

That's it! Enjoy! 🎉
