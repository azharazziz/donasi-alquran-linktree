/**
 * Central Config Index
 * Aggregates all yearly configurations and provides default year selection logic
 */

import config2024 from "./years/2024";
import config2025 from "./years/2025";
import config2026 from "./years/2026";
import type { YearlyConfig } from "./types";
import { generateColorPalette } from "./theme-generator";

/**
 * All available yearly configurations
 */
export const CONFIG_BY_YEAR = {
  2024: config2024,
  2025: config2025,
  2026: config2026,
} as const;

export type AvailableYear = keyof typeof CONFIG_BY_YEAR;

/**
 * Determine the active year with fallback logic:
 * - Use current year (new Date().getFullYear()) if available
 * - Fallback to the closest previous available year
 * - Never fallback to a future year
 */
export function getDefaultActiveYear(): AvailableYear {
  const currentYear = new Date().getFullYear() as AvailableYear;
  const availableYears = Object.keys(CONFIG_BY_YEAR)
    .map(Number)
    .sort((a, b) => b - a) as AvailableYear[];

  // If current year exists, use it
  if (CONFIG_BY_YEAR[currentYear]) {
    return currentYear;
  }

  // Find the closest previous year
  const previousYear = availableYears.find((year) => year < currentYear);
  if (previousYear) {
    return previousYear;
  }

  // Fallback to the most recent available year
  return availableYears[0];
}

/**
 * Get the configuration for a specific year
 */
export function getYearConfig(year: AvailableYear): YearlyConfig {
  if (!CONFIG_BY_YEAR[year]) {
    throw new Error(`Configuration not available for year ${year}`);
  }
  return CONFIG_BY_YEAR[year];
}

/**
 * Get the generated color palette for a specific year
 */
export function getYearTheme(year: AvailableYear) {
  const config = getYearConfig(year);
  return generateColorPalette(config.theme.primaryColor);
}

/**
 * Get all available years sorted in descending order
 */
export function getAvailableYears(): AvailableYear[] {
  return Object.keys(CONFIG_BY_YEAR)
    .map(Number)
    .sort((a, b) => b - a) as AvailableYear[];
}
