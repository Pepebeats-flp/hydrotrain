import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatTemperature(value: number): string {
  return `${value.toFixed(1)}°C`;
}

export function formatPower(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(2)} MW`;
  return `${value.toFixed(1)} kW`;
}

export function formatPressure(value: number): string {
  return `${value.toFixed(1)} bar`;
}

export function formatVoltage(value: number): string {
  return `${value.toFixed(1)} V`;
}

export function formatCurrent(value: number): string {
  return `${value.toFixed(1)} A`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function timestamp(): string {
  return new Date().toISOString();
}

export function getSeverityColor(severity: "critical" | "warning" | "info"): string {
  switch (severity) {
    case "critical": return "status-critical";
    case "warning": return "status-warning";
    case "info": return "status-ok";
  }
}
