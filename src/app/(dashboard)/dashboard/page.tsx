"use client";

import { useDashboardStore } from "@/store/dashboard.store";
import { KpiCard } from "@/shared/components/KpiCard";
import { PageHeader } from "@/shared/components/PageHeader";
import { GlassPanel } from "@/shared/components/GlassPanel";
import { StatusBadge } from "@/shared/components/StatusBadge";
import {
  Zap,
  Droplets,
  Gauge,
  Thermometer,
  Activity,
  Cpu,
} from "lucide-react";
import { formatPower, formatNumber, formatPercentage, formatTemperature } from "@/shared/lib/utils";
import { formatDuration } from "@/utils/formatters";

export default function DashboardPage() {
  const { data, loading } = useDashboardStore();

  if (loading || !data) {
    return (
      <div className="p-6 space-y-6">
        <PageHeader title="Dashboard" description="System Overview" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const kpiIcons: Record<string, React.ReactNode> = {
    "total-power": <Zap className="w-4 h-4" />,
    "h2-consumption": <Droplets className="w-4 h-4" />,
    "estimated-range": <Gauge className="w-4 h-4" />,
    "efficiency": <Activity className="w-4 h-4" />,
    "avg-temp": <Thermometer className="w-4 h-4" />,
    "system-status": <Cpu className="w-4 h-4" />,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Dashboard" description="System Overview" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {data.kpis.map((kpi) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={
              kpi.id === "system-status"
                ? ["Critical", "Warning", "Operational"][kpi.value] || "Unknown"
                : kpi.id === "avg-temp"
                  ? formatTemperature(kpi.value)
                  : kpi.id === "efficiency"
                    ? formatPercentage(kpi.value)
                    : kpi.id === "total-power"
                      ? formatPower(kpi.value)
                      : kpi.id === "estimated-range"
                        ? `${kpi.value.toFixed(0)}`
                        : formatNumber(kpi.value)
            }
            unit={kpi.unit}
            trend={kpi.trend}
            trendValue={kpi.trendValue}
            status={kpi.status}
            icon={kpiIcons[kpi.id]}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassPanel className="lg:col-span-2 p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">System Overview</h3>
          <div className="flex flex-col gap-3">
            <StatusRow label="System Status" value={<StatusBadge status={data.systemStatus} />} />
            <StatusRow label="Uptime" value={formatDuration(data.uptime)} />
            <StatusRow
              label="Current Power"
              value={formatPower(data.currentPower)}
            />
            <StatusRow
              label="Hydrogen Level"
              value={formatPercentage(data.hydrogenLevel)}
              indicator={
                <div className="w-full bg-[var(--color-secondary)] rounded-full h-2 mt-1">
                  <div
                    className="bg-[var(--color-info)] rounded-full h-2 transition-all duration-300"
                    style={{ width: `${data.hydrogenLevel}%` }}
                  />
                </div>
              }
            />
            <StatusRow
              label="Battery SOC"
              value={formatPercentage(data.stateOfCharge)}
              indicator={
                <div className="w-full bg-[var(--color-secondary)] rounded-full h-2 mt-1">
                  <div
                    className="bg-[var(--color-success)] rounded-full h-2 transition-all duration-300"
                    style={{ width: `${data.stateOfCharge}%` }}
                  />
                </div>
              }
            />
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Quick Stats</h3>
          <div className="flex flex-col gap-3">
            <MiniStat label="Fuel Cell Temp" value={formatTemperature(data.kpis[4]?.value ?? 0)} />
            <MiniStat label="Active Alarms" value={String(data.activeAlarms)} color="text-[var(--color-warning)]" />
            <MiniStat label="Hydrogen Remaining" value={formatPercentage(data.hydrogenLevel)} />
            <MiniStat label="Battery SOC" value={formatPercentage(data.stateOfCharge)} />
            <MiniStat label="Efficiency" value={formatPercentage(data.kpis[3]?.value ?? 0)} />
          </div>
        </GlassPanel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassPanel className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Power Distribution</h3>
          <div className="space-y-2">
            <BarRow label="Fuel Cell" value={65} color="#3b82f6" />
            <BarRow label="Battery" value={25} color="#22c55e" />
            <BarRow label="Recovery" value={10} color="#06b6d4" />
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">System Health</h3>
          <div className="space-y-2">
            <BarRow label="Hydrogen Tank" value={85} color="#14b8a6" />
            <BarRow label="Fuel Cell" value={72} color="#3b82f6" />
            <BarRow label="Battery" value={68} color="#22c55e" />
            <BarRow label="Inverter" value={91} color="#a855f7" />
            <BarRow label="Motor" value={78} color="#f59e0b" />
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
  indicator,
}: {
  label: string;
  value: React.ReactNode;
  indicator?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[var(--color-card-border)] last:border-0">
      <span className="text-sm text-[var(--color-muted)]">{label}</span>
      <div className="text-right">
        <span className="text-sm font-semibold text-foreground">{value}</span>
        {indicator}
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[var(--color-card-border)] last:border-0">
      <span className="text-xs text-[var(--color-muted)]">{label}</span>
      <span className={`text-sm font-semibold ${color || "text-foreground"}`}>{value}</span>
    </div>
  );
}

function BarRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--color-muted)] w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-[var(--color-secondary)] rounded-full h-2">
        <div
          className="rounded-full h-2 transition-all duration-300"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-mono text-foreground w-10 text-right">{value}%</span>
    </div>
  );
}
