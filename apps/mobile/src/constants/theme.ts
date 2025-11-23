/**
 * ShiftTally Design System
 *
 * Stripe-inspired + Apple Health aesthetic:
 * - Clean, calm, premium
 * - Medical blues + neutral grays
 * - Large tap targets (≥44pt)
 * - Generous spacing
 */

export const Colors = {
  light: {
    // Primary blues (medical/trust)
    primary: '#0A84FF',
    primaryLight: '#5AC8FA',
    primaryDark: '#0066CC',

    // Accent (checkmark/success)
    accent: '#34C759',
    accentLight: '#4CD964',

    // Backgrounds
    background: '#F2F2F7',
    backgroundElevated: '#FFFFFF',
    card: '#FFFFFF',

    // Text
    text: '#000000',
    textSecondary: '#8E8E93',
    textTertiary: '#C7C7CC',

    // Borders & Separators
    border: '#E5E5EA',
    separator: '#C6C6C8',

    // Status
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',

    // Input
    inputBackground: '#F2F2F7',
    inputBorder: '#E5E5EA',
    placeholder: '#C7C7CC',

    // Shadow for cards
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  dark: {
    // Primary blues
    primary: '#0A84FF',
    primaryLight: '#64D2FF',
    primaryDark: '#0066CC',

    // Accent
    accent: '#30D158',
    accentLight: '#63E6BE',

    // Backgrounds
    background: '#000000',
    backgroundElevated: '#1C1C1E',
    card: '#1C1C1E',

    // Text
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#48484A',

    // Borders & Separators
    border: '#38383A',
    separator: '#38383A',

    // Status
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',

    // Input
    inputBackground: '#1C1C1E',
    inputBorder: '#38383A',
    placeholder: '#636366',

    // Shadow for cards
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  // Large display (for Gross/Net amounts)
  displayLarge: {
    fontSize: 48,
    fontWeight: '700' as const,
    lineHeight: 56,
    letterSpacing: -1,
  },
  displayMedium: {
    fontSize: 36,
    fontWeight: '700' as const,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  // Headings
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  // Body
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  // Labels
  label: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  // Caption
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

// Minimum touch target size (Apple HIG)
export const MIN_TOUCH_TARGET = 44;

// Animation durations
export const Animation = {
  fast: 150,
  normal: 250,
  slow: 350,
};

export type ThemeColors = typeof Colors.light;
