"use client";

import { motion } from "framer-motion";
import { Play, Square, RotateCcw, SlidersHorizontal } from "lucide-react";
import { GlassPanel } from "@/shared/components/GlassPanel";
import { PageHeader } from "@/shared/components/PageHeader";
import { cn } from "@/shared/lib/utils";
import { useSimulationStore } from "@/store/simulation.store";

export default function SimulationPage() {
  const { running, config, toggle, reset, updateConfig } = useSimulationStore();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title="Simulación" description="Controles de simulación de datos" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassPanel className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Controles</h3>
          <div className="flex items-center gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggle}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                running
                  ? "bg-[var(--color-destructive)]/20 text-[var(--color-destructive)] border border-[var(--color-destructive)]/30"
                  : "bg-[var(--color-primary-muted)] text-primary border border-[var(--color-primary)]/30",
              )}
            >
              {running ? (
                <><Square className="w-4 h-4" /> Detener Simulación</>
              ) : (
                <><Play className="w-4 h-4" /> Iniciar Simulación</>
              )}
            </motion.button>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-muted)] border border-[var(--color-glass-border)] hover:bg-[var(--color-sidebar-hover)] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </button>
          </div>

          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium",
            running
              ? "bg-[var(--color-success)]/20 text-[var(--color-success)]"
              : "bg-[var(--color-secondary)] text-[var(--color-muted)]",
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", running ? "bg-[var(--color-success)] animate-pulse" : "bg-[var(--color-muted)]")} />
            {running ? "Simulación Activa" : "Simulación Detenida"}
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Configuración</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between text-xs text-[var(--color-muted)] mb-2">
                <span>Intervalo</span>
                <span className="font-mono text-foreground">{config.tickInterval}ms</span>
              </label>
              <input
                type="range"
                min={20}
                max={500}
                value={config.tickInterval}
                onChange={(e) => updateConfig({ tickInterval: Number(e.target.value) })}
                className="w-full h-1.5 bg-[var(--color-secondary)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
            <div>
              <label className="flex items-center justify-between text-xs text-[var(--color-muted)] mb-2">
                <span>Multiplicador de Velocidad</span>
                <span className="font-mono text-foreground">{config.speedMultiplier}x</span>
              </label>
              <input
                type="range"
                min={0.1}
                max={10}
                step={0.1}
                value={config.speedMultiplier}
                onChange={(e) => updateConfig({ speedMultiplier: Number(e.target.value) })}
                className="w-full h-1.5 bg-[var(--color-secondary)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-card-border)]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[var(--color-muted)]" />
                <span className="text-xs text-[var(--color-muted)]">Inyección de Fallos</span>
              </div>
              <button
                onClick={() => updateConfig({ faultInjection: !config.faultInjection })}
                className={cn(
                  "relative w-10 h-5 rounded-full transition-colors",
                  config.faultInjection ? "bg-[var(--color-primary)]" : "bg-[var(--color-secondary)]",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                    config.faultInjection && "translate-x-5",
                  )}
                />
              </button>
            </div>
          </div>
        </GlassPanel>
      </div>

      <GlassPanel className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Información de la Simulación</h3>
        <p className="text-xs text-[var(--color-muted)] leading-relaxed">
          El simulador genera continuamente datos de telemetría realistas para todos los subsistemas del tren.
          Modela el consumo de hidrógeno, la dinámica de temperatura de la celda de combustible,
          los ciclos de carga/descarga de la batería, las variaciones de RPM y torque del motor,
          y condiciones de fallo ocasionales para una generación realista de alertas.
          Cuando el backend esté integrado, este simulador será reemplazado por datos en vivo del gateway CAN Bus.
        </p>
      </GlassPanel>
    </div>
  );
}
