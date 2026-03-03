/**
 * YearSwitcher Component
 * Displays available years and allows switching between them
 */

import { useYearConfig } from "@/hooks/useYearConfig";

interface YearSwitcherProps {
  variant?: "buttons" | "select";
}

/**
 * YearSwitcher with button layout
 */
export function YearSwitcher({ variant = "buttons" }: YearSwitcherProps) {
  const { activeYear, availableYears, setActiveYear } = useYearConfig();

  if (variant === "select") {
    return (
      <select
        value={String(activeYear)}
        onChange={(e) => setActiveYear(parseInt(e.target.value, 10) as any)}
        className="px-3 py-2 rounded-lg border border-border bg-card text-foreground"
      >
        {availableYears.map((year) => (
          <option key={year} value={String(year)}>
            {year}
          </option>
        ))}
      </select>
    );
  }

  // Buttons variant (default)
  return (
    <div className="flex gap-2">
      {availableYears.map((year) => (
        <button
          key={year}
          onClick={() => {
            console.log("🔘 Clicked year button:", year);
            setActiveYear(year);
          }}
          className={`
            px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm cursor-pointer
            ${
              activeYear === year
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border text-foreground hover:bg-muted"
            }
          `}
        >
          {year}
        </button>
      ))}
    </div>
  );
}
