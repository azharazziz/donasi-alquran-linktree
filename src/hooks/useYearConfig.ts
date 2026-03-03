/**
 * useYearConfig Hook
 * Manages year selection, theme generation, and localStorage persistence
 */

import { useState, useEffect, useCallback } from "react";
import type { YearlyConfig } from "@/config/types";
import { 
  CONFIG_BY_YEAR, 
  getDefaultActiveYear, 
  getYearConfig, 
  getYearTheme,  
  getAvailableYears,
  type AvailableYear,
} from "@/config/index";
import { paletteToCssVariables } from "@/config/theme-generator";

const YEAR_STORAGE_KEY = "donation-site-active-year";

interface UseYearConfigReturn {
  activeYear: AvailableYear;
  config: YearlyConfig;
  availableYears: AvailableYear[];
  setActiveYear: (year: AvailableYear) => void;
  themeVariables: Record<string, string>;
}

/**
 * Hook to manage year selection and theme
 * Persists year selection to localStorage
 */
export function useYearConfig(): UseYearConfigReturn {
  // Get initial year from localStorage or use default
  const getInitialYear = (): AvailableYear => {
    const savedYear = localStorage.getItem(YEAR_STORAGE_KEY);
    if (savedYear) {
      const yearNum = parseInt(savedYear, 10) as AvailableYear;
      if (CONFIG_BY_YEAR[yearNum]) {
        return yearNum;
      }
    }
    return getDefaultActiveYear();
  };

  const [activeYear, setActiveYearState] = useState<AvailableYear>(getInitialYear());

  // Handle year change
  const setActiveYear = useCallback((year: AvailableYear) => {
    if (!CONFIG_BY_YEAR[year]) {
      console.error(`Year ${year} is not configured`);
      return;
    }
    console.log(`[useYearConfig] Changing year from ${activeYear} to ${year}`);
    setActiveYearState(year);
    localStorage.setItem(YEAR_STORAGE_KEY, String(year));
  }, [activeYear]);

  // Get current config and theme (recalculate whenever activeYear changes)
  const config = getYearConfig(activeYear);
  const theme = getYearTheme(activeYear);
  const themeVariables = paletteToCssVariables(theme);
  const availableYears = getAvailableYears();

  console.log(`[useYearConfig] Hook rendered with year: ${activeYear}, theme primary: ${themeVariables['--primary']}`);

  // Sync to localStorage whenever activeYear changes
  useEffect(() => {
    localStorage.setItem(YEAR_STORAGE_KEY, String(activeYear));
  }, [activeYear]);

  return {
    activeYear,
    config,
    availableYears,
    setActiveYear,
    themeVariables,
  };
}
