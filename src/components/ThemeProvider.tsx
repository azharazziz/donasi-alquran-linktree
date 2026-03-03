/**
 * ThemeProvider Component
 * Applies CSS variables from the active year's theme to :root
 */

import React, { useEffect } from "react";
import { useYearContext } from "@/contexts/YearContext";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { themeVariables } = useYearContext();

  useEffect(() => {
    // Apply theme variables to :root immediately
    const rootElement = document.documentElement;
    
    // Apply all theme variables
    Object.entries(themeVariables).forEach(([key, value]) => {
      rootElement.style.setProperty(key, value);
    });

    // Log for debugging
    console.log('Theme variables applied to :root:', {
      timestamp: new Date().toISOString(),
      variableCount: Object.keys(themeVariables).length,
      sample: themeVariables['--primary']
    });
  }, [themeVariables]);

  return <>{children}</>;
}
