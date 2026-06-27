export const COLORS = {
  primary: "#3b82f6",
  primaryHover: "#2563eb",
  accent: "#06b6d4",
  success: "#22c55e",
  warning: "#f59e0b",
  destructive: "#ef4444",
  info: "#3b82f6",
  muted: "#8892a8",
  background: "#0a0e17",
  card: "rgba(15, 23, 42, 0.8)",
  glass: "rgba(15, 23, 42, 0.6)",
  border: "rgba(59, 130, 246, 0.12)",
} as const;

export const CHART_COLORS = {
  power: "#3b82f6",
  voltage: "#22c55e",
  temperature: "#ef4444",
  pressure: "#f59e0b",
  soc: "#06b6d4",
  rpm: "#a855f7",
  hydrogen: "#14b8a6",
  torque: "#f97316",
  current: "#8b5cf6",
} as const;

export const STATUS_COLORS = {
  operational: COLORS.success,
  warning: COLORS.warning,
  critical: COLORS.destructive,
  offline: COLORS.muted,
  maintenance: COLORS.info,
} as const;

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
