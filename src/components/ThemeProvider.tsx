/**
 * ThemeProvider Component
 * Applies CSS variables from the active year's theme to :root
 */

import React, { useEffect } from "react";
import { useYearConfig } from "@/hooks/useYearConfig";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { themeVariables } = useYearConfig();

  useEffect(() => {
    console.log("🎨 ThemeProvider: Applying theme variables", themeVariables);
    // Apply theme variables to :root
    const rootElement = document.documentElement;
    Object.entries(themeVariables).forEach(([key, value]) => {
      rootElement.style.setProperty(key, value);
      console.log(`  ✓ Set ${key} = ${value}`);
    });
    console.log("✅ Theme variables applied to :root");
  }, [themeVariables]);

  return <>{children}</>;
}
