# Multi-Year Config - Quick Reference

## 🚀 Quick Start

### Use the Hook
```typescript
import { useYearConfig } from "@/hooks/useYearConfig";

const { activeYear, config, availableYears, setActiveYear } = useYearConfig();
```

### Add Year Switcher
```typescript
import { YearSwitcher } from "@/components/YearSwitcher";

<YearSwitcher variant="buttons" />    // or "select"
```

### Access Config
```typescript
config.links          // Array of donation links
config.columns        // Spreadsheet column names
config.spreadsheetId  // Google Sheets ID
config.bankAccounts   // Bank transfer info
config.donationStatus // Is donations open?
```

---

## 🎨 Theme System

### Available CSS Variables
```css
--primary              /* Main color */
--primary-foreground   /* Text on primary */
--secondary            /* Complementary color */
--accent              /* Accent color */
--background          /* Page background */
--foreground           /* Main text */
--card                /* Card background */
--card-foreground     /* Card text */
--muted               /* Muted background */
--muted-foreground    /* Muted text */
--border              /* Border color */
--input               /* Input background */
--ring                /* Focus ring color */
```

### Use in CSS
```css
.my-card {
  background: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
}
```

### Use in Tailwind
```html
<div class="bg-card text-card-foreground border border-border">
  Card with theme colors
</div>
```

---

## 📁 File Structure

```
src/config/
├── types.ts              # Type definitions
├── theme-generator.ts    # Color generation
├── index.ts              # Main exports
└── years/
    ├── 2024.ts          # Purple
    ├── 2025.ts          # Green
    └── 2026.ts          # Blue

src/hooks/
└── useYearConfig.ts      # State management

src/components/
├── ThemeProvider.tsx     # Apply theme
└── YearSwitcher.tsx      # UI component

src/config-adapter.ts     # Backward compat
```

---

## 🔧 Add a New Year

1. Copy `2026.ts` → `2027.ts`
2. Change `primaryColor: "#xxxxx"`
3. Export in `config/index.ts`:
   ```typescript
   import config2027 from "./years/2027";
   export const CONFIG_BY_YEAR = {
     // ...
     2027: config2027,
   };
   ```

---

## 💾 Storage

**Key:** `donation-site-active-year`  
**Value:** Year number (2024, 2025, 2026)  
**Auto-managed:** By useYearConfig hook

---

## 🧩 Component Locations

| What | Where | Export |
|------|-------|--------|
| Theme Provider | `src/components/ThemeProvider.tsx` | `ThemeProvider` |
| Year Switcher | `src/components/YearSwitcher.tsx` | `YearSwitcher` |
| useYearConfig | `src/hooks/useYearConfig.ts` | `useYearConfig` |
| Config Index | `src/config/index.ts` | All functions |
| Type Defs | `src/config/types.ts` | `YearlyConfig` |

---

## 🎯 Common Tasks

### Get Current Year Config
```typescript
const { config } = useYearConfig();
// config.links, config.bankAccounts, etc.
```

### Change Year Programmatically
```typescript
const { setActiveYear } = useYearConfig();
setActiveYear(2025);
```

### Get All Available Years
```typescript
const { availableYears } = useYearConfig();
// [2026, 2025, 2024]
```

### Generate Color Palette
```typescript
import { generateColorPalette } from "@/config/theme-generator";
const palette = generateColorPalette("#3b82f6");
```

### Get CSS Variables
```typescript
const { themeVariables } = useYearConfig();
// { "--primary": "hsl(...)", ... }
```

---

## ⚠️ Important Notes

- ✅ ThemeProvider must wrap entire app
- ✅ YearSwitcher can go anywhere in UI
- ✅ CSS variables auto-update on year change
- ✅ localStorage persists selection
- ✅ Type-safe year selection
- ❌ Don't modify config.ts (original legacy file)
- ❌ Don't import from @/config directly (use @/config/index)

---

## 🐛 Debug

```javascript
// Check theme variables
getComputedStyle(document.documentElement).getPropertyValue('--primary')

// Check localStorage
localStorage.getItem('donation-site-active-year')

// Check active config
import { getYearConfig } from '@/config/index';
console.log(getYearConfig(2026))
```

---

## 📚 Full Documentation

See: **CONFIG_SYSTEM.md** and **IMPLEMENTATION_SUMMARY.md**
