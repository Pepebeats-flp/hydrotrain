"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, AlertCircle, Info, CheckCircle, XCircle, Trash2, Filter } from "lucide-react";
import { GlassPanel } from "@/shared/components/GlassPanel";
import { PageHeader } from "@/shared/components/PageHeader";
import { cn } from "@/shared/lib/utils";
import { useAlarmStore } from "@/store/alarm.store";
import { formatDateTime } from "@/utils/formatters";

const SEVERITY_CONFIG = {
  critical: {
    icon: AlertTriangle,
    color: "text-[var(--color-destructive)]",
    bg: "bg-[var(--color-destructive)]/10",
    border: "border-l-[var(--color-destructive)]",
    label: "Crítica",
  },
  warning: {
    icon: AlertCircle,
    color: "text-[var(--color-warning)]",
    bg: "bg-[var(--color-warning)]/10",
    border: "border-l-[var(--color-warning)]",
    label: "Advertencia",
  },
  info: {
    icon: Info,
    color: "text-[var(--color-info)]",
    bg: "bg-[var(--color-info)]/10",
    border: "border-l-[var(--color-info)]",
    label: "Info",
  },
};

export default function AlarmsPage() {
  const {
    alarms,
    filter,
    unreadCount,
    acknowledge,
    resolve,
    clearAll,
    setFilter,
  } = useAlarmStore();

  const filteredAlarms = useMemo(() => {
    return alarms.filter((a) => {
      if (filter.severity !== "all" && a.severity !== filter.severity) return false;
      if (filter.acknowledged === "unacknowledged" && a.acknowledged) return false;
      if (filter.acknowledged === "acknowledged" && !a.acknowledged) return false;
      return true;
    });
  }, [alarms, filter]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        title="Alertas"
        description="Centro de monitoreo de alertas"
        actions={
          alarms.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-muted)] border border-[var(--color-glass-border)] hover:bg-[var(--color-sidebar-hover)] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpiar Todo
            </button>
          )
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
          <Filter className="w-3.5 h-3.5" />
          <span>Severidad:</span>
        </div>
        {["all", "critical", "warning", "info"].map((sev) => {
          const sevLabels: Record<string, string> = { all: "Todas", critical: "Crítica", warning: "Advertencia", info: "Info" };
          return (
            <button
              key={sev}
              onClick={() => setFilter({ ...filter, severity: sev })}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-medium transition-all",
                filter.severity === sev
                  ? "bg-[var(--color-primary-muted)] text-primary border border-[var(--color-primary)]/30"
                  : "text-[var(--color-muted)] border border-[var(--color-glass-border)] hover:bg-[var(--color-sidebar-hover)]",
              )}
            >
              {sevLabels[sev]}
            </button>
          );
        })}
        <div className="w-px h-5 bg-[var(--color-glass-border)] mx-1" />
        <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
          <span>Estado:</span>
        </div>
        {["all", "unacknowledged", "acknowledged"].map((ack) => {
          const ackLabels: Record<string, string> = { all: "Todos", unacknowledged: "No Reconocidas", acknowledged: "Reconocidas" };
          return (
            <button
              key={ack}
              onClick={() => setFilter({ ...filter, acknowledged: ack })}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-medium transition-all",
                filter.acknowledged === ack
                  ? "bg-[var(--color-primary-muted)] text-primary border border-[var(--color-primary)]/30"
                  : "text-[var(--color-muted)] border border-[var(--color-glass-border)] hover:bg-[var(--color-sidebar-hover)]",
              )}
            >
              {ackLabels[ack]}
            </button>
          );
        })}
        {unreadCount > 0 && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--color-destructive)]/20 text-[var(--color-destructive)]">
            {unreadCount} no leídas
          </span>
        )}
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {filteredAlarms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--color-muted)]">
              <CheckCircle className="w-8 h-8 mb-2" />
              <span className="text-sm">Sin alertas</span>
            </div>
          ) : (
            filteredAlarms.map((alarm) => {
              const sevConfig = SEVERITY_CONFIG[alarm.severity];
              const SevIcon = sevConfig.icon;
              return (
                <motion.div
                  key={alarm.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <GlassPanel
                    className={cn(
                      "border-l-2 px-4 py-3",
                      sevConfig.border,
                      alarm.acknowledged && "opacity-60",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("p-1.5 rounded-lg mt-0.5", sevConfig.bg)}>
                        <SevIcon className={cn("w-4 h-4", sevConfig.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-foreground">{alarm.title}</span>
                          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", sevConfig.bg, sevConfig.color)}>
                            {sevConfig.label}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-muted)] mb-1">{alarm.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-[var(--color-muted)]">
                          <span>{formatDateTime(alarm.timestamp)}</span>
                          <span>{alarm.componentName}</span>
                          {alarm.acknowledged && <span className="text-[var(--color-info)]">Reconocida</span>}
                          {alarm.resolved && <span className="text-[var(--color-success)]">Resuelta</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!alarm.acknowledged && (
                          <button
                            onClick={() => acknowledge(alarm.id)}
                            className="p-1.5 rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-info)] transition-colors"
                            title="Reconocer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {!alarm.resolved && alarm.acknowledged && (
                          <button
                            onClick={() => resolve(alarm.id)}
                            className="p-1.5 rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-success)] transition-colors"
                            title="Resolver"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
