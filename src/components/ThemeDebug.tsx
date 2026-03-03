/**
 * Theme Debug Component
 * Shows current year, theme colors, and CSS variables for debugging
 */

import { useYearConfig } from "@/hooks/useYearConfig";

export function ThemeDebug() {
  const { activeYear, themeVariables } = useYearConfig();

  // Get computed CSS variables from document
  const rootStyles = getComputedStyle(document.documentElement);
  const primaryColor = rootStyles.getPropertyValue("--primary").trim();
  const backgroundColor = rootStyles.getPropertyValue("--background").trim();
  const cardColor = rootStyles.getPropertyValue("--card").trim();

  return (
    <div
      className="fixed bottom-4 right-4 p-3 rounded-lg bg-card border border-border shadow-lg text-xs"
      style={{ maxWidth: "300px", zIndex: 999 }}
    >
      <div className="space-y-1 max-h-64 overflow-auto">
        <div className="font-bold text-sm mb-2">🎨 Theme Debug</div>
        <div>
          <strong>Active Year:</strong> {activeYear}
        </div>
        <div>
          <strong>Computed Variables:</strong>
        </div>
        <div className="ml-2 space-y-0.5">
          <div>--primary: {primaryColor}</div>
          <div>--background: {backgroundColor}</div>
          <div>--card: {cardColor}</div>
        </div>
        <div>
          <strong>All Variables:</strong>
        </div>
        <div className="ml-2 bg-muted p-1 rounded text-[10px] max-h-40 overflow-auto font-mono">
          {Object.entries(themeVariables)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n")}
        </div>
      </div>
    </div>
  );
}
