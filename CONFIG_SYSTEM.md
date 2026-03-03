# Multi-Year Configuration System

A scalable, production-ready configuration system supporting multiple years with automatic theme generation and persistent user preferences.

## Architecture

```
src/
├── config/
│   ├── types.ts                    # YearlyConfig type definition
│   ├── theme-generator.ts          # HSL-based color palette generation
│   ├── index.ts                    # Central config index & year selection logic
│   └── years/
│       ├── 2024.ts                 # Purple theme
│       ├── 2025.ts                 # Green/Emerald theme
│       └── 2026.ts                 # Blue theme
├── hooks/
│   └── useYearConfig.ts            # State management & localStorage persistence
├── components/
│   ├── ThemeProvider.tsx           # CSS variable injection
│   └── YearSwitcher.tsx            # UI for year selection (buttons/select)
└── config-adapter.ts               # Backward compatibility layer

```

## Features

### 1. Multi-Year Configuration
- Separate config files per year in `src/config/years/`
- Consistent structure across all years
- Easy to add new years

### 2. Automatic Theme Generation
- Define only `theme.primaryColor` in yearly configs
- Full color palette generated automatically using HSL manipulation
- No external libraries required
- Colors include: primary, secondary, accent, background, card, muted, border, etc.

### 3. Dynamic Year Selection
- Default year logic: Current year → fallback to closest previous year → most recent
- Year preference persisted to localStorage
- Automatic theme switching when year changes

### 4. CSS Variables Integration
- All colors injected as CSS variables to `:root`
- Components use `var(--primary)`, `var(--foreground)`, etc.
- Enables instant theme switching without page reload

### 5. Backward Compatibility
- Existing components continue using legacy constants
- `config-adapter.ts` maps old imports to new structure
- No breaking changes to component code

## Usage

### Adding a New Year

1. Create a new file: `src/config/years/2027.ts`
2. Follow the `YearlyConfig` type structure
3. Define `theme.primaryColor` (e.g., `"#ef4444"` for red)
4. Copy structure from existing years

```typescript
// src/config/years/2027.ts
import type { YearlyConfig } from "../types";

const config2027: YearlyConfig = {
  theme: {
    primaryColor: "#ef4444", // Only define this!
  },
  // ... copy other properties from 2026.ts
};

export default config2027;
```

5. Import in `src/config/index.ts`:

```typescript
import config2027 from "./years/2027";

export const CONFIG_BY_YEAR = {
  2024: config2024,
  2025: config2025,
  2026: config2026,
  2027: config2027,
};
```

### Using the Year Config Hook

```typescript
import { useYearConfig } from "@/hooks/useYearConfig";

function MyComponent() {
  const { activeYear, config, availableYears, setActiveYear } = useYearConfig();

  return (
    <div>
      <p>Active Year: {activeYear}</p>
      <p>Spreadsheet ID: {config.spreadsheetId}</p>
      <p>Available Years: {availableYears.join(", ")}</p>
      <button onClick={() => setActiveYear(2025)}>Switch to 2025</button>
    </div>
  );
}
```

### Year Switcher Component

#### Button Layout
```typescript
<YearSwitcher variant="buttons" />
```

#### Select Dropdown
```typescript
<YearSwitcher variant="select" />
```

### Accessing Config Programmatically

```typescript
import {
  CONFIG_BY_YEAR,
  getYearConfig,
  getYearTheme,
  getDefaultActiveYear,
  getAvailableYears,
} from "@/config";

// Get default year
const defaultYear = getDefaultActiveYear(); // 2026

// Get config for specific year
const config2025 = getYearConfig(2025);
console.log(config2025.links);

// Get generated theme
const theme2025 = getYearTheme(2025);
console.log(theme2025.primary); // "hsl(120 100% 37%)"

// Get all available years
const years = getAvailableYears(); // [2026, 2025, 2024]
```

### Theme Generation Explained

The `generateColorPalette()` function creates a complete color palette from a single hex primary color:

```typescript
import { generateColorPalette } from "@/config/theme-generator";

const palette = generateColorPalette("#3b82f6");
// Returns:
{
  primary: "hsl(217 98% 51%)",
  primaryForeground: "hsl(0 0% 100%)",
  secondary: "hsl(37 98% 51%)",     // Complementary color
  accent: "hsl(277 98% 51%)",       // Analogous color
  background: "hsl(217 0% 98%)",
  card: "hsl(0 0% 100%)",
  muted: "hsl(217 5% 80%)",
  border: "hsl(217 5% 90%)",
  // ... more colors
}
```

### CSS Variables at Runtime

Once the `ThemeProvider` is active, all components automatically get CSS variables:

```css
:root {
  --primary: hsl(217 98% 51%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(37 98% 51%);
  --background: hsl(217 0% 98%);
  --foreground: hsl(0 0% 3%);
  /* ... more variables */
}
```

Use in CSS:

```css
.card {
  background-color: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
}

.button-primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
}
```

Use in Tailwind:

```html
<div class="bg-card text-card-foreground border border-border">
  Card content
</div>
```

## Storage

### localStorage Key
- `donation-site-active-year`: Stores the active year number

Automatically managed by `useYearConfig()` hook.

## Default Year Selection Logic

```
Current Year: 2026

Check: Is 2026 configured? YES → Use 2026
If NO: Find closest previous year configured
If NO: Use most recent available year
```

Examples:
- Current: 2026 → Use 2026 (if exists) or 2025 (if 2026 doesn't exist)
- Current: 2027 → Use 2026 (if exists) or 2025
- Current: 2023 → Use 2024 (latest available)

## Backward Compatibility

The old `config.ts` still exists but is no longer used directly. All components can continue importing from it:

```typescript
// This still works (via config-adapter.ts)
import { LINKS, COLUMNS, DONATION_STATUS } from "@/config.ts";
```

But new code should prefer:

```typescript
// New way - dynamic per active year
const { config } = useYearConfig();
console.log(config.links);
```

## Production Checklist

- [ ] All yearly configs have valid `theme.primaryColor`
- [ ] All yearly configs follow `YearlyConfig` type exactly
- [ ] CSS variables properly injected via ThemeProvider
- [ ] localStorage keys don't conflict with other apps
- [ ] Year switcher placed in appropriate UI location
- [ ] All components tested with multiple years/themes

## Extending the System

### Custom Theme Values

To add custom properties beyond the default palette, extend `ColorPalette` type:

```typescript
// config/theme-generator.ts
export interface ColorPalette {
  // ... existing colors
  customColor1: string;
  customColor2: string;
}

export function generateColorPalette(primaryHex: string): ColorPalette {
  // ... generate existing colors
  return {
    // ... spread existing colors
    customColor1: hslToString(customColor1Hsl),
    customColor2: hslToString(customColor2Hsl),
  };
}
```

### Dynamic Config Switching

Currently requires page reload due to static imports. To enable live switching:

1. Convert yearly configs to API endpoints
2. Fetch on demand
3. Cache in React state
4. Trigger re-renders via context

For now, localStorage preference is applied on page load.

## Troubleshooting

### Theme not applying
- Ensure `ThemeProvider` wraps entire app in `App.tsx`
- Check browser DevTools → Computed Styles → verify CSS variables exist

### Year not persisting
- Check localStorage in DevTools
- Clear localStorage if corrupted: `localStorage.removeItem('donation-site-active-year')`

### Colors not matching expectation
- Test `generateColorPalette()` directly in console
- Verify HSL values are correct
- Consider adjusting primary color if palette is too light/dark

## Files Modified

- `src/App.tsx` - Added ThemeProvider wrapper
- `src/config.ts` - Keep as-is for backward compatibility (legacy)
