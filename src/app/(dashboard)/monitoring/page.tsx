"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Thermometer, Zap, Activity, Droplets, Gauge, Battery, Cpu, Ruler } from "lucide-react";
import { GlassPanel } from "@/shared/components/GlassPanel";
import { PageHeader } from "@/shared/components/PageHeader";
import { cn, formatNumber } from "@/shared/lib/utils";
import { useMonitoringStore } from "@/store/monitoring.store";

const VARIABLE_GROUPS = [
  {
    label: "Temperatura",
    color: "border-l-[var(--color-destructive)]",
    variables: ["fuel-cell-temp", "inverter-temp", "motor-temp"],
  },
  {
    label: "Potencia y Energía",
    color: "border-l-[var(--color-info)]",
    variables: ["system-power", "fuel-cell-power", "inverter-power", "motor-power"],
  },
  {
    label: "Hidrógeno",
    color: "border-l-[var(--color-accent)]",
    variables: ["h2-pressure", "h2-flow"],
  },
  {
    label: "Batería",
    color: "border-l-[var(--color-primary)]",
    variables: ["battery-soc", "battery-voltage", "battery-power"],
  },
  {
    label: "Mecánico",
    color: "border-l-[var(--color-warning)]",
    variables: ["motor-rpm", "motor-torque", "wheel-speed"],
  },
];

const variableIcons: Record<string, React.ReactNode> = {
  "fuel-cell-temp": <Thermometer className="w-4 h-4 text-[var(--color-destructive)]" />,
  "inverter-temp": <Thermometer className="w-4 h-4 text-[var(--color-destructive)]" />,
  "motor-temp": <Thermometer className="w-4 h-4 text-[var(--color-destructive)]" />,
  "system-power": <Zap className="w-4 h-4 text-[var(--color-info)]" />,
  "fuel-cell-power": <Zap className="w-4 h-4 text-[var(--color-info)]" />,
  "inverter-power": <Cpu className="w-4 h-4 text-[var(--color-info)]" />,
  "motor-power": <Zap className="w-4 h-4 text-[var(--color-info)]" />,
  "h2-pressure": <Gauge className="w-4 h-4 text-[var(--color-accent)]" />,
  "h2-flow": <Droplets className="w-4 h-4 text-[var(--color-accent)]" />,
  "battery-voltage": <Activity className="w-4 h-4 text-[var(--color-primary)]" />,
  "battery-power": <Battery className="w-4 h-4 text-[var(--color-primary)]" />,
  "battery-soc": <Battery className="w-4 h-4 text-[var(--color-primary)]" />,
  "motor-rpm": <Ruler className="w-4 h-4 text-[var(--color-warning)]" />,
  "motor-torque": <Ruler className="w-4 h-4 text-[var(--color-warning)]" />,
  "wheel-speed": <Gauge className="w-4 h-4 text-[var(--color-warning)]" />,
};

export default function MonitoringPage() {
  const { variables, loading } = useMonitoringStore();

  const groupedVariables = useMemo(() => {
    if (loading || Object.keys(variables).length === 0) return [];
    return VARIABLE_GROUPS.map((group) => ({
      ...group,
      items: group.variables
        .map((id) => variables[id])
        .filter(Boolean),
    })).filter((g) => g.items.length > 0);
  }, [variables, loading]);

  if (loading) {
    return (
    <div className="p-4 md:p-6 space-y-6">
        <PageHeader title="Monitoreo en Vivo" description="Datos de telemetría en tiempo real" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Monitoreo en Vivo"
        description="Datos de telemetría en tiempo real"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groupedVariables.map((group, gi) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.05 }}
          >
            <GlassPanel className={cn("border-l-2 p-4", group.color)}>
              <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">
                {group.label}
              </h3>
              <div className="space-y-2">
                {group.items.map((variable) => (
                  <div
                    key={variable.id}
                    className="flex items-center justify-between py-1.5 border-b border-[var(--color-card-border)] last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      {variableIcons[variable.id]}
                      <span className="text-xs text-[var(--color-muted)]">{variable.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-semibold text-foreground">
                        {formatNumber(variable.value)}
                      </span>
                      <span className="text-[10px] text-[var(--color-muted)]">{variable.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
