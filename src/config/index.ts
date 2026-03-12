/**
 * Central Config Index
 * Aggregates all yearly configurations and provides default year selection logic
 * Merges hardcoded configs with admin (localStorage) overrides
 */

import config2025 from "./years/2025";
import config2026 from "./years/2026";
import config2024 from "./years/2024";
import type { YearlyConfig } from "./types";
import { generateColorPalette } from "./theme-generator";
import { getAdminConfigs } from "./admin";
import { adminConfigToYearly } from "./config-converter";

/**
 * Hardcoded yearly configurations
 */
const HARDCODED_CONFIGS: Record<number, YearlyConfig> = {
  2024: config2024,
  2025: config2025,
  2026: config2026,
};

/**
 * Get all available yearly configurations (hardcoded + admin overrides)
 * Admin configs override hardcoded configs for the same year
 */
function getMergedConfigs(): Record<number, YearlyConfig> {
  const merged: Record<number, YearlyConfig> = { ...HARDCODED_CONFIGS };

  try {
    const adminConfigs = getAdminConfigs();
    for (const [yearStr, adminConfig] of Object.entries(adminConfigs)) {
      const year = parseInt(yearStr, 10);
      merged[year] = adminConfigToYearly(adminConfig);
    }
  } catch (e) {
    console.warn("[Config] Failed to load admin configs:", e);
  }

  return merged;
}

/**
 * All available yearly configurations (reactive getter)
 */
export const CONFIG_BY_YEAR = new Proxy({} as Record<number, YearlyConfig>, {
  get(_target, prop) {
    if (typeof prop === "symbol") return undefined;
    const configs = getMergedConfigs();
    if (prop === "toString" || prop === "valueOf") return () => configs;
    const year = parseInt(prop as string, 10);
    return configs[year];
  },
  ownKeys() {
    return Object.keys(getMergedConfigs());
  },
  getOwnPropertyDescriptor(_target, prop) {
    const configs = getMergedConfigs();
    const year = parseInt(prop as string, 10);
    if (configs[year]) {
      return { configurable: true, enumerable: true, value: configs[year] };
    }
    return undefined;
  },
  has(_target, prop) {
    const configs = getMergedConfigs();
    const year = parseInt(prop as string, 10);
    return year in configs;
  },
});

export type AvailableYear = number;

/**
 * Determine the active year with fallback logic
 */
export function getDefaultActiveYear(): AvailableYear {
  const currentYear = new Date().getFullYear();
  const configs = getMergedConfigs();
  const availableYears = Object.keys(configs)
    .map(Number)
    .sort((a, b) => b - a);

  if (configs[currentYear]) return currentYear;
  const previousYear = availableYears.find((year) => year < currentYear);
  if (previousYear) return previousYear;
  return availableYears[0];
}

/**
 * Get the configuration for a specific year
 */
export function getYearConfig(year: AvailableYear): YearlyConfig {
  const configs = getMergedConfigs();
  if (!configs[year]) {
    throw new Error(`Configuration not available for year ${year}`);
  }
  return configs[year];
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
  const configs = getMergedConfigs();
  return Object.keys(configs)
    .map(Number)
    .sort((a, b) => b - a);
}
