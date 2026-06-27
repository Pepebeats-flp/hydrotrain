"use client";

import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: number;
  status?: "ok" | "warning" | "critical";
  icon?: React.ReactNode;
  className?: string;
}

export function KpiCard({
  label,
  value,
  unit,
  trend,
  trendValue,
  status = "ok",
  icon,
  className,
}: KpiCardProps) {
  const trendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
  };
  const TrendIcon = trend ? trendIcon[trend] : null;

  const statusColors = {
    ok: "border-l-[var(--color-success)]",
    warning: "border-l-[var(--color-warning)]",
    critical: "border-l-[var(--color-destructive)]",
  };

  const statusGlow = {
    ok: "shadow-[0_0_15px_rgba(34,197,94,0.1)]",
    warning: "shadow-[0_0_15px_rgba(245,158,11,0.1)]",
    critical: "shadow-[0_0_15px_rgba(239,68,68,0.1)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-card relative overflow-hidden group",
        "border-l-2",
        statusColors[status],
        statusGlow[status],
        className,
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
            {label}
          </span>
          {icon && <span className="text-[var(--color-muted)]">{icon}</span>}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-foreground tracking-tight">{value}</span>
          {unit && (
            <span className="text-sm text-[var(--color-muted)] font-medium">{unit}</span>
          )}
        </div>
        {trend && TrendIcon && (
          <div className="flex items-center gap-1 mt-2">
            <TrendIcon
              className={cn(
                "w-3.5 h-3.5",
                trend === "up" && "text-[var(--color-success)]",
                trend === "down" && "text-[var(--color-destructive)]",
                trend === "stable" && "text-[var(--color-muted)]",
              )}
            />
            {trendValue !== undefined && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend === "up" && "text-[var(--color-success)]",
                  trend === "down" && "text-[var(--color-destructive)]",
                  trend === "stable" && "text-[var(--color-muted)]",
                )}
              >
                {trendValue.toFixed(1)}
                {trend === "up" ? "% ↑" : trend === "down" ? "% ↓" : ""}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-primary-muted)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}
