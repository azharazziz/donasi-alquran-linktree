# Integration Guide - Using Multi-Year Config in Components

## Overview

This guide shows practical examples of how to use the multi-year configuration system in your React components.

---

## Basic Hook Usage

### Simple Component with Year Config

```typescript
import { useYearConfig } from "@/hooks/useYearConfig";

export function DashboardPage() {
  const { activeYear, config } = useYearConfig();

  return (
    <div>
      <h1>Donation Dashboard {activeYear}</h1>
      <p>Campaign ID: {config.spreadsheetId}</p>
      
      {config.donationStatus.isOpen ? (
        <button>Donate Now</button>
      ) : (
        <p className="text-destructive">
          {config.donationStatus.closedMessage}
        </p>
      )}
    </div>
  );
}
```

---

## Accessing Config Data

### Getting Links
```typescript
function LinkList() {
  const { config } = useYearConfig();

  return (
    <div className="space-y-2">
      {config.links.map((link) => (
        <a key={link.title} href={link.href || "#"}>
          {link.title}
        </a>
      ))}
    </div>
  );
}
```

### Getting Bank Accounts
```typescript
function BankTransferInfo() {
  const { config } = useYearConfig();

  return (
    <div>
      {config.bankAccounts.map((account) => (
        <div key={account.accountNumber}>
          <p><strong>{account.bankName}</strong></p>
          <p>No: {account.accountNumber}</p>
          <p>A/N: {account.accountHolder}</p>
        </div>
      ))}
    </div>
  );
}
```

### Getting Spreadsheet Info
```typescript
function DataSync() {
  const { config } = useYearConfig();

  const columns = {
    date: config.columns.tanggal,
    donor: config.columns.donatur,
    amount: config.columns.nominal,
  };

  // Use in spreadsheet API calls
  const fetchData = async () => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}`;
    // ...
  };

  return <div>Data source: {config.spreadsheetId}</div>;
}
```

---

## Year-Dependent Data Loading

### Load Data for Active Year

```typescript
import { useQuery } from "@tanstack/react-query";
import { useYearConfig } from "@/hooks/useYearConfig";

export function DonationReport() {
  const { activeYear, config } = useYearConfig();

  // Refetch whenever active year changes
  const { data: donations, isLoading } = useQuery({
    queryKey: [activeYear, "donations"], // activeYear in key = auto-refetch
    queryFn: async () => {
      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${config.spreadsheetId}/export?format=csv`
      );
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Donations for {activeYear}</h2>
      {/* Display donations */}
    </div>
  );
}
```

---

## Year Switching

### Year Switcher in Header

```typescript
import { YearSwitcher } from "@/components/YearSwitcher";

export function AppHeader() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>Donasi Alquran</h1>
      
      {/* Year switcher with buttons */}
      <YearSwitcher variant="buttons" />
      
      {/* Or dropdown */}
      {/* <YearSwitcher variant="select" /> */}
    </header>
  );
}
```

### Custom Year Switcher

```typescript
import { useYearConfig } from "@/hooks/useYearConfig";
import { Button } from "@/components/ui/button";

export function CustomYearSwitcher() {
  const { activeYear, availableYears, setActiveYear } = useYearConfig();

  return (
    <div className="flex gap-2">
      {availableYears.map((year) => (
        <Button
          key={year}
          onClick={() => setActiveYear(year)}
          variant={activeYear === year ? "default" : "outline"}
        >
          {year}
          {year === new Date().getFullYear() && " (Now)"}
        </Button>
      ))}
    </div>
  );
}
```

---

## Theme Variables Usage

### Using CSS Variables in Components

```typescript
// Component with theme-aware styling
export function ThemedCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--card)",
        color: "var(--card-foreground)",
        border: "1px solid var(--border)",
        padding: "1rem",
        borderRadius: "0.75rem",
      }}
    >
      {children}
    </div>
  );
}
```

### Using Tailwind with CSS Variables

```typescript
export function ButtonPrimary({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="px-4 py-2 rounded-lg
                 bg-primary text-primary-foreground
                 hover:opacity-90
                 transition-opacity"
    >
      {children}
    </button>
  );
}
```

---

## Configuration-Driven UI

### Conditional Rendering Based on Config

```typescript
export function PaymentMethods() {
  const { config } = useYearConfig();

  return (
    <div className="space-y-4">
      {!config.donationStatus.isOpen && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {config.donationStatus.closedMessage}
        </div>
      )}

      {config.donationStatus.isOpen && (
        <>
          <BankTransferSection />
          <QRISSection />
        </>
      )}
    </div>
  );
}
```

### Dynamic Social Media Links

```typescript
export function SocialLinks() {
  const { config } = useYearConfig();

  return (
    <div className="flex gap-4">
      {config.socialMediaLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a key={social.name} href={social.url} title={social.name}>
            <Icon className={`w-6 h-6 ${social.color}`} />
          </a>
        );
      })}
    </div>
  );
}
```

---

## Advanced Patterns

### Multi-Year Comparison Component

```typescript
import { useYearConfig } from "@/hooks/useYearConfig";
import { CONFIG_BY_YEAR } from "@/config/index";

export function YearComparison() {
  const { availableYears } = useYearConfig();

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Metric</th>
          {availableYears.map((year) => (
            <th key={year}>{year}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Primary Color</td>
          {availableYears.map((year) => (
            <td key={year}>
              <div
                style={{
                  background: CONFIG_BY_YEAR[year].theme.primaryColor,
                  width: "20px",
                  height: "20px",
                }}
                title={CONFIG_BY_YEAR[year].theme.primaryColor}
              />
            </td>
          ))}
        </tr>
        {/* Add more rows */}
      </tbody>
    </table>
  );
}
```

### Theme Preview

```typescript
import { generateColorPalette } from "@/config/theme-generator";
import { useYearConfig } from "@/hooks/useYearConfig";
import { CONFIG_BY_YEAR } from "@/config/index";

export function ThemePreview() {
  const { availableYears } = useYearConfig();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {availableYears.map((year) => {
        const config = CONFIG_BY_YEAR[year];
        const palette = generateColorPalette(config.theme.primaryColor);

        return (
          <div key={year} className="p-4 border rounded-lg">
            <h3 className="font-bold mb-3">{year}</h3>
            <div className="space-y-2">
              <div
                style={{ background: palette.primary }}
                className="h-8 rounded text-white flex items-center px-2"
              >
                Primary
              </div>
              <div
                style={{ background: palette.secondary }}
                className="h-8 rounded text-white flex items-center px-2"
              >
                Secondary
              </div>
              <div
                style={{ background: palette.accent }}
                className="h-8 rounded text-white flex items-center px-2"
              >
                Accent
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

### Configuration Debug Component

```typescript
export function ConfigDebug() {
  const { activeYear, config, themeVariables, availableYears } = useYearConfig();

  const [expanded, setExpanded] = React.useState(false);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed bottom-4 right-4 p-2 bg-muted rounded-lg text-xs"
      >
        🔧 Config
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-card border rounded-lg p-4 max-h-96 overflow-auto w-80 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <strong>Debug Info</strong>
        <button onClick={() => setExpanded(false)}>×</button>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <strong>Active Year:</strong> {activeYear}
        </div>
        <div>
          <strong>Available:</strong> {availableYears.join(", ")}
        </div>
        <div>
          <strong>Spreadsheet ID:</strong> {config.spreadsheetId.slice(0, 10)}...
        </div>
        <div>
          <strong>Theme Variables:</strong> {Object.keys(themeVariables).length}
        </div>
        <details>
          <summary>CSS Variables</summary>
          <pre className="bg-muted p-2 rounded text-[10px] overflow-auto max-h-40">
            {JSON.stringify(themeVariables, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
```

---

## Error Handling

### Safe Year Switching

```typescript
export function SafeYearSwitcher() {
  const { availableYears, setActiveYear } = useYearConfig();

  const handleYearChange = (year: number) => {
    try {
      // TypeScript won't allow invalid years, but handle runtime just in case
      setActiveYear(year as any);
    } catch (error) {
      console.error(`Failed to switch to year ${year}:`, error);
      // Fallback logic
    }
  };

  return (
    <div>
      {availableYears.map((year) => (
        <button key={year} onClick={() => handleYearChange(year)}>
          {year}
        </button>
      ))}
    </div>
  );
}
```

---

## Migration from Old Config

### Old Way → New Way

```typescript
// OLD
import { LINKS, COLUMNS } from "@/config";
function OldComponent() {
  return <div>{LINKS[0].title}</div>;
}

// NEW
import { useYearConfig } from "@/hooks/useYearConfig";
function NewComponent() {
  const { config } = useYearConfig();
  return <div>{config.links[0].title}</div>;
}

// Old way still works! (via config-adapter.ts)
// But new way is preferred for multi-year support
```

---

## Best Practices

### ✅ DO

```typescript
// ✅ Use hook in components
const { config } = useYearConfig();

// ✅ Use activeYear in query keys
queryKey: [activeYear, "donations"]

// ✅ Use CSS variables for styling
className: "bg-primary text-primary-foreground"

// ✅ Type-safe year selection
setActiveYear(2025) // ✅ OK
setActiveYear(2099) // ❌ TypeScript error
```

### ❌ DON'T

```typescript
// ❌ Don't hardcode colors
style={{ background: "#3b82f6" }}

// ❌ Don't ignore activeYear in queries
queryKey: ["donations"] // Should include activeYear

// ❌ Don't access config outside React
const config = getYearConfig(2025); // Wrong way

// ❌ Don't manually update localStorage
localStorage.setItem("active-year", "2025") // Use hook instead
```

---

## Testing Components with Config

### Mock useYearConfig for Tests

```typescript
import { render, screen } from "@testing-library/react";
import { useYearConfig } from "@/hooks/useYearConfig";

jest.mock("@/hooks/useYearConfig");

describe("DashboardPage", () => {
  it("displays year from config", () => {
    (useYearConfig as jest.Mock).mockReturnValue({
      activeYear: 2025,
      config: {
        links: [{ title: "Donate", href: "#" }],
        // ...rest of config
      },
      availableYears: [2025, 2024],
      setActiveYear: jest.fn(),
      themeVariables: {},
    });

    render(<DashboardPage />);
    expect(screen.getByText("2025")).toBeInTheDocument();
  });
});
```

---

## Performance Tips

### 1. Memoize Expensive Computations

```typescript
import { useMemo } from "react";

export function ExpensiveComponent() {
  const { config, activeYear } = useYearConfig();

  const processedLinks = useMemo(() => {
    return config.links.filter(link => link.action).map(link => ({
      ...link,
      computed: expensiveComputation(link)
    }));
  }, [config.links, activeYear]);

  return <div>{/* Use processedLinks */}</div>;
}
```

### 2. Use Query Key Arrays

```typescript
// Good - refetches on year change
queryKey: [activeYear, "donations"]

// Bad - doesn't refetch
queryKey: ["donations"]
```

### 3. Avoid Unnecessary Re-renders

```typescript
// Only extract what you need
const { config } = useYearConfig(); // ✅ Specific
const yearConfig = useYearConfig();  // ❌ Overkill
```

---

## Deployment Checklist

Before deploying:

- [ ] YearSwitcher placed in UI
- [ ] Test year switching works
- [ ] localStorage persists year
- [ ] Theme colors apply correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Dark mode compatible
- [ ] All docs reviewed

---

## Support & Troubleshooting

### Common Issues

**Q: Year not persisting after reload?**
```typescript
// Check localStorage
localStorage.getItem("donation-site-active-year")

// Clear if corrupted
localStorage.removeItem("donation-site-active-year")
```

**Q: Theme not applying?**
```typescript
// Verify ThemeProvider wraps app
// Check CSS variables
getComputedStyle(document.documentElement).getPropertyValue("--primary")
```

**Q: Data reloading on year change?**
```typescript
// YES - this is correct! Use activeYear in queryKey
queryKey: [activeYear, "data"] // Refetches on change
```

---

## More Examples

See:
- **CONFIG_SYSTEM.md** - Comprehensive API
- **QUICK_REFERENCE.md** - Quick lookups
- **IMPLEMENTATION_SUMMARY.md** - Architecture overview
