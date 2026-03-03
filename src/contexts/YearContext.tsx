/**
 * YearContext
 * Provides global year state management for the entire app
 * Ensures all components see the same active year and theme
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
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

interface YearContextType {
  activeYear: AvailableYear;
  config: YearlyConfig;
  availableYears: AvailableYear[];
  themeVariables: Record<string, string>;
  setActiveYear: (year: AvailableYear) => void;
}

const YearContextValue = createContext<YearContextType | undefined>(undefined);

export function YearProvider({ children }: { children: React.ReactNode }) {
  // Initialize year from localStorage or use default
  const getInitialYear = (): AvailableYear => {
    try {
      const savedYear = localStorage.getItem(YEAR_STORAGE_KEY);
      if (savedYear) {
        const yearNum = parseInt(savedYear, 10) as AvailableYear;
        if (CONFIG_BY_YEAR[yearNum]) {
          console.log(`[YearContext] Restoring year from localStorage: ${yearNum}`);
          return yearNum;
        }
      }
    } catch (e) {
      console.warn("[YearContext] localStorage access failed:", e);
    }
    const defaultYear = getDefaultActiveYear();
    console.log(`[YearContext] Using default year: ${defaultYear}`);
    return defaultYear;
  };

  const [activeYear, setActiveYearState] = useState<AvailableYear>(getInitialYear());

  // Handle year change
  const setActiveYear = useCallback((year: AvailableYear) => {
    if (!CONFIG_BY_YEAR[year]) {
      console.error(`[YearContext] Year ${year} is not configured`);
      return;
    }
    console.log(`[YearContext] Changing year: ${activeYear} → ${year}`);
    setActiveYearState(year);
  }, [activeYear]);

  // Persist to localStorage whenever year changes
  useEffect(() => {
    localStorage.setItem(YEAR_STORAGE_KEY, String(activeYear));
    console.log(`[YearContext] Saved year to localStorage: ${activeYear}`);
  }, [activeYear]);

  // Get current config and theme
  const config = getYearConfig(activeYear);
  const theme = getYearTheme(activeYear);
  const themeVariables = paletteToCssVariables(theme);
  const availableYears = getAvailableYears();

  console.log(`[YearContext] Providing year: ${activeYear}, primary color: ${themeVariables["--primary"]}`);

  const value: YearContextType = {
    activeYear,
    config,
    availableYears,
    themeVariables,
    setActiveYear,
  };

  return <YearContextValue.Provider value={value}>{children}</YearContextValue.Provider>;
}

/**
 * Hook to use year context
 * Must be called within YearProvider
 */
export function useYearContext(): YearContextType {
  const context = useContext(YearContextValue);
  if (context === undefined) {
    throw new Error("useYearContext must be used within a YearProvider");
  }
  return context;
}
