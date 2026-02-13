/**
 * Simple theme constants for the white-based refined design.
 */
export const theme = {
  colors: {
    background: "#FFFFFF",
    surface: "#F8FAFC",
    border: "#E2E8F0",
    text: "#0F172A",
    textSecondary: "#64748B",
    brand: "#6366F1",
    brandLight: "#EDE9FE",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    priorityHigh: "#EF4444",
    priorityMedium: "#F59E0B",
    priorityLow: "#22C55E",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
} as const;
