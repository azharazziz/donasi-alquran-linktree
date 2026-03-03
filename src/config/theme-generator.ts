/**
 * Theme Color Generator
 * Generates a complete color palette from a primary color using HSL manipulation.
 * No external libraries - pure JavaScript HSL manipulation.
 */

export interface ColorPalette {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

/**
 * Parse hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): HSLColor {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to string value (for CSS variables)
 * Returns format: "220 60% 22%" (without hsl() function)
 * This is used with Tailwind which wraps it: hsl(var(--primary))
 */
function hslToString(hsl: HSLColor): string {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}

/**
 * Create HSL color with adjusted lightness
 */
function adjustLightness(hsl: HSLColor, adjustment: number): HSLColor {
  return {
    h: hsl.h,
    s: hsl.s,
    l: Math.max(0, Math.min(100, hsl.l + adjustment)),
  };
}

/**
 * Create HSL color with adjusted saturation
 */
function adjustSaturation(hsl: HSLColor, adjustment: number): HSLColor {
  return {
    h: hsl.h,
    s: Math.max(0, Math.min(100, hsl.s + adjustment)),
    l: hsl.l,
  };
}

/**
 * Create HSL color with adjusted hue
 */
function adjustHue(hsl: HSLColor, adjustment: number): HSLColor {
  return {
    h: (hsl.h + adjustment + 360) % 360,
    s: hsl.s,
    l: hsl.l,
  };
}

/**
 * Generate a complete color palette from a primary hex color
 */
export function generateColorPalette(primaryHex: string): ColorPalette {
  const rgb = hexToRgb(primaryHex);
  if (!rgb) {
    throw new Error(`Invalid hex color: ${primaryHex}`);
  }

  const primary = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Primary variations
  const primaryLight = adjustLightness(primary, 45); // Light version for backgrounds
  const primaryDark = adjustLightness(primary, -15); // Darker version for better contrast

  // Secondary color (complementary, opposite hue)
  const secondary = adjustHue(primary, 180);
  const secondaryLight = adjustLightness(secondary, 50);

  // Accent color (analogous, 60 degrees offset)
  const accent = adjustHue(primary, 60);
  const accentBright = adjustLightness(accent, 35);

  // Muted versions (desaturated)
  const muted = adjustSaturation(primary, -50);
  const mutedLight = adjustLightness(muted, 80);

  // Neutral/Background colors
  const background: HSLColor = { h: primary.h, s: 0, l: 98 }; // Very light neutral
  const card: HSLColor = { h: primary.h, s: 0, l: 100 }; // Pure white
  const border: HSLColor = { h: primary.h, s: 5, l: 90 }; // Subtle border
  const popover: HSLColor = { h: primary.h, s: 0, l: 100 }; // Same as card
  
  // Destructive color (red)
  const destructive: HSLColor = { h: 0, s: 84, l: 60 }; // Standard red color

  return {
    primary: hslToString(primary),
    primaryForeground: "0 0% 100%", // White text on primary

    secondary: hslToString(secondary),
    secondaryForeground: "0 0% 100%", // White text on secondary

    accent: hslToString(accentBright),
    accentForeground: "0 0% 100%", // White text on accent

    background: hslToString(background),
    foreground: "0 0% 3%", // Near black for text

    card: hslToString(card),
    cardForeground: "0 0% 3%", // Near black for card text
    
    popover: hslToString(popover),
    popoverForeground: "0 0% 3%", // Near black for popover text

    muted: hslToString(mutedLight),
    mutedForeground: "0 0% 45%", // Gray text

    destructive: hslToString(destructive),
    destructiveForeground: "210 40% 98%", // Light text on destructive

    border: hslToString(border),
    input: "0 0% 100%", // White input

    ring: hslToString(primaryDark), // Focus ring color
  };
}

/**
 * Convert palette object to CSS variables string for :root
 */
export function paletteToCssVariables(
  palette: ColorPalette
): Record<string, string> {
  return {
    "--primary": palette.primary,
    "--primary-foreground": palette.primaryForeground,
    "--secondary": palette.secondary,
    "--secondary-foreground": palette.secondaryForeground,
    "--accent": palette.accent,
    "--accent-foreground": palette.accentForeground,
    "--background": palette.background,
    "--foreground": palette.foreground,
    "--card": palette.card,
    "--card-foreground": palette.cardForeground,
    "--popover": palette.popover,
    "--popover-foreground": palette.popoverForeground,
    "--muted": palette.muted,
    "--muted-foreground": palette.mutedForeground,
    "--destructive": palette.destructive,
    "--destructive-foreground": palette.destructiveForeground,
    "--border": palette.border,
    "--input": palette.input,
    "--ring": palette.ring,
  };
}
