"use client";

import { cn } from "@/shared/lib/utils";
import type { ComponentStatus } from "@/shared/types";

interface StatusBadgeProps {
  status: ComponentStatus;
  className?: string;
}

const STATUS_CONFIG: Record<ComponentStatus, { label: string; color: string }> = {
  operational: {
    label: "Operacional",
    color: "bg-[var(--color-success)] shadow-[0_0_8px_rgba(34,197,94,0.3)]",
  },
  warning: {
    label: "Advertencia",
    color: "bg-[var(--color-warning)] shadow-[0_0_8px_rgba(245,158,11,0.3)]",
  },
  critical: {
    label: "Crítico",
    color: "bg-[var(--color-destructive)] shadow-[0_0_8px_rgba(239,68,68,0.3)]",
  },
  offline: {
    label: "Desconectado",
    color: "bg-[var(--color-muted)]",
  },
  maintenance: {
    label: "Mantenimiento",
    color: "bg-[var(--color-info)] shadow-[0_0_8px_rgba(59,130,246,0.3)]",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("w-2 h-2 rounded-full animate-pulse", config.color)} />
      <span className="text-xs font-medium text-[var(--color-muted)]">{config.label}</span>
    </div>
  );
}
