/**
 * useYearConfig Hook
 * Manages year selection, theme generation, and localStorage persistence
 */

import { useState, useEffect } from "react";
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
  // Initialize from localStorage or use default
  const [activeYear, setActiveYearState] = useState<AvailableYear>(() => {
    const savedYear = localStorage.getItem(YEAR_STORAGE_KEY);
    if (savedYear) {
      const yearNum = parseInt(savedYear, 10) as AvailableYear;
      if (CONFIG_BY_YEAR[yearNum]) {
        console.log("🎨 Loaded year from localStorage:", yearNum);
        return yearNum;
      }
    }
    const defaultYear = getDefaultActiveYear();
    console.log("🎨 Using default year:", defaultYear);
    return defaultYear;
  });

  // Simple setter - just update state
  const setActiveYear = (year: AvailableYear) => {
    if (!CONFIG_BY_YEAR[year]) {
      console.error(`❌ Year ${year} is not configured`);
      return;
    }
    console.log("🎨 Switching to year:", year);
    setActiveYearState(year);
  };

  // Persist year change to localStorage
  useEffect(() => {
    localStorage.setItem(YEAR_STORAGE_KEY, String(activeYear));
    console.log("💾 Saved year to localStorage:", activeYear);
  }, [activeYear]);

  // Get current config and theme
  const config = getYearConfig(activeYear);
  const theme = getYearTheme(activeYear);
  const themeVariables = paletteToCssVariables(theme);
  const availableYears = getAvailableYears();

  console.log("🎨 useYearConfig:", {
    activeYear,
    themeVariables,
    availableYears,
  });

  return {
    activeYear,
    config,
    availableYears,
    setActiveYear,
    themeVariables,
  };
}
