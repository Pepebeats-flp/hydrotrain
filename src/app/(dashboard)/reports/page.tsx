"use client";

import { FileText } from "lucide-react";
import { GlassPanel } from "@/shared/components/GlassPanel";
import { PageHeader } from "@/shared/components/PageHeader";

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title="Reportes" description="Generar y ver reportes del sistema" />

      <div className="flex flex-col items-center justify-center py-20 text-[var(--color-muted)]">
        <div className="p-4 rounded-full bg-[var(--color-primary-muted)] mb-4">
          <FileText className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Reportes Próximamente</h3>
        <p className="text-sm text-[var(--color-muted)] text-center max-w-md">
          El módulo de reportes permitirá generar reportes detallados del sistema,
          exportar datos de telemetría y crear documentos de análisis personalizados.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-2xl">
          <GlassPanel className="p-4 text-center">
            <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase mb-1">Diario</h4>
            <p className="text-xs text-[var(--color-muted)]">Resúmenes de rendimiento del sistema</p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center">
            <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase mb-1">Semanal</h4>
            <p className="text-xs text-[var(--color-muted)]">Análisis de tendencias y anomalías</p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center">
            <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase mb-1">Mensual</h4>
            <p className="text-xs text-[var(--color-muted)]">Reportes operativos de toda la flota</p>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
