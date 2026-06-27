"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { GlassPanel } from "@/shared/components/GlassPanel";
import { PageHeader } from "@/shared/components/PageHeader";
import { useMonitoringStore } from "@/store/monitoring.store";
import { cn } from "@/shared/lib/utils";
import { CHART_COLORS } from "@/utils/colors";

type ChartKey = "power" | "temperature" | "voltage" | "pressure" | "soc" | "rpm";

const CHART_CONFIG: Record<ChartKey, { title: string; color: string; variables: string[]; unit: string }> = {
  power: { title: "Power", color: CHART_COLORS.power, variables: ["system-power", "fuel-cell-power", "battery-power"], unit: "kW" },
  temperature: { title: "Temperature", color: CHART_COLORS.temperature, variables: ["fuel-cell-temp", "inverter-temp", "motor-temp"], unit: "°C" },
  voltage: { title: "Voltage", color: CHART_COLORS.voltage, variables: ["battery-voltage"], unit: "V" },
  pressure: { title: "Pressure", color: CHART_COLORS.pressure, variables: ["h2-pressure"], unit: "bar" },
  soc: { title: "State of Charge", color: CHART_COLORS.soc, variables: ["battery-soc"], unit: "%" },
  rpm: { title: "Motor RPM", color: CHART_COLORS.rpm, variables: ["motor-rpm"], unit: "RPM" },
};

export default function HistoryPage() {
  const { variables } = useMonitoringStore();
  const [selectedChart, setSelectedChart] = useState<ChartKey>("power");

  const chartData = useMemo(() => {
    const config = CHART_CONFIG[selectedChart];
    if (!variables[config.variables[0]]?.history) return [];

    const allHistories = config.variables.map((v) => variables[v]?.history || []);
    const maxLen = Math.max(...allHistories.map((h) => h.length));
    if (maxLen === 0) return [];

    const timestamps = allHistories.find((h) => h.length > 0)?.map((p) => p.timestamp) || [];
    return timestamps.map((ts, i) => {
      const point: Record<string, string | number> = { time: new Date(ts).toLocaleTimeString() };
      config.variables.forEach((v) => {
        const hist = variables[v]?.history || [];
        point[v] = hist[i]?.value ?? 0;
      });
      return point;
    });
  }, [variables, selectedChart]);

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="History" description="Historical telemetry charts" />

      <div className="flex flex-wrap gap-2 mb-2">
        {(Object.entries(CHART_CONFIG) as [ChartKey, typeof CHART_CONFIG[ChartKey]][]).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedChart(key)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
              selectedChart === key
                ? "bg-[var(--color-primary-muted)] text-primary border border-[var(--color-primary)]/30"
                : "text-[var(--color-muted)] border border-[var(--color-glass-border)] hover:bg-[var(--color-sidebar-hover)]",
            )}
          >
            {config.title}
          </button>
        ))}
      </div>

      <motion.div
        key={selectedChart}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassPanel className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              {CHART_CONFIG[selectedChart].title}
            </h3>
            <span className="text-xs text-[var(--color-muted)]">
              Last {variables[CHART_CONFIG[selectedChart].variables[0]]?.history.length ?? 0} samples
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  {CHART_CONFIG[selectedChart].variables.map((v) => (
                    <linearGradient key={v} id={`gradient-${v}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[selectedChart] || CHART_CONFIG[selectedChart].color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS[selectedChart] || CHART_CONFIG[selectedChart].color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.08)" />
                <XAxis
                  dataKey="time"
                  stroke="rgba(136, 146, 168, 0.5)"
                  tick={{ fill: "rgba(136, 146, 168, 0.7)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(136, 146, 168, 0.5)"
                  tick={{ fill: "rgba(136, 146, 168, 0.7)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                    borderRadius: "8px",
                    color: "#e8edf5",
                    fontSize: "12px",
                  }}
                />
                {CHART_CONFIG[selectedChart].variables.map((v, i) => (
                  <Area
                    key={v}
                    type="monotone"
                    dataKey={v}
                    stroke={i === 0 ? CHART_CONFIG[selectedChart].color : [CHART_COLORS.soc, CHART_COLORS.rpm, CHART_COLORS.torque][i - 1]}
                    fillOpacity={1}
                    fill={`url(#gradient-${v})`}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.entries(CHART_CONFIG) as [ChartKey, typeof CHART_CONFIG[ChartKey]][]).filter(([k]) => k !== selectedChart).map(([key, config], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassPanel className="p-4 cursor-pointer hover:border-[var(--color-primary)]/30 transition-all" onClick={() => setSelectedChart(key)}>
              <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase mb-2">{config.title}</h3>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.slice(-30)}>
                    <defs>
                      <linearGradient id={`minigrad-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={config.color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey={config.variables[0]}
                      stroke={config.color}
                      fill={`url(#minigrad-${key})`}
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
