/**
 * YearSwitcher Component
 * Animated Premium Segmented Control (No External Package)
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useYearContext } from "@/contexts/YearContext";

interface YearSwitcherProps {
  variant?: "buttons" | "select";
}

export function YearSwitcher({ variant = "buttons" }: YearSwitcherProps) {
  const { activeYear, availableYears, setActiveYear } = useYearContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
  });

  // Update sliding indicator position
  useEffect(() => {
    const activeButton = containerRef.current?.querySelector(
      `[data-year="${activeYear}"]`
    ) as HTMLElement | null;

    if (activeButton) {
      setIndicatorStyle({
        width: activeButton.offsetWidth,
        left: activeButton.offsetLeft,
      });
    }
  }, [activeYear, availableYears]);

  // Select Variant
  if (variant === "select") {
    return (
      <select
        value={String(activeYear)}
        onChange={(e) =>
          setActiveYear(parseInt(e.target.value, 10) as any)
        }
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

  // Animated Buttons Variant
  return (
    <div className="flex justify-center">
      <div
        ref={containerRef}
        className="relative inline-flex p-1 rounded-xl bg-muted/70 backdrop-blur-md"
      >
        {/* Sliding Background */}
        <div
          className="absolute top-1 bottom-1 rounded-lg bg-primary shadow-md
                     transition-all duration-500 ease-[cubic-bezier(.25,.8,.25,1)]"
          style={{
            width: indicatorStyle.width,
            left: indicatorStyle.left,
          }}
        />

        {/* Soft Glow */}
        <div
          className="absolute top-1 bottom-1 rounded-lg bg-primary blur-xl opacity-30
                     transition-all duration-500 ease-[cubic-bezier(.25,.8,.25,1)]
                     pointer-events-none"
          style={{
            width: indicatorStyle.width,
            left: indicatorStyle.left,
          }}
        />

        {/* Buttons */}
        {availableYears.map((year) => {
          const isActive = activeYear === year;

          return (
            <button
              key={year}
              data-year={year}
              onClick={() => setActiveYear(year)}
              className={`
                relative z-10 px-5 py-2.5 rounded-lg text-sm font-semibold
                transition-all duration-300
                ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }
                hover:-translate-y-[1px]
              `}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
}