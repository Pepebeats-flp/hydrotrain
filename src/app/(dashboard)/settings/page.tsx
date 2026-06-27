"use client";

import { Settings2, Monitor, Bell, Activity, Palette } from "lucide-react";
import { GlassPanel } from "@/shared/components/GlassPanel";
import { PageHeader } from "@/shared/components/PageHeader";

const SETTINGS_GROUPS = [
  {
    icon: Monitor,
    title: "Pantalla",
    description: "Tema, diseño, preferencias de gráficos",
    options: ["Tema Oscuro: Fijo", "Barra Lateral: Colapsable", "Actualización Gráficos: 500ms"],
  },
  {
    icon: Bell,
    title: "Notificaciones",
    description: "Preferencias de notificaciones de alertas",
    options: ["Alertas Críticas: Activadas", "Alertas de Advertencia: Activadas", "Alertas Informativas: Desactivadas"],
  },
  {
    icon: Activity,
    title: "Telemetría",
    description: "Configuración de sondeo y visualización de datos",
    options: ["Intervalo de Sondeo: 100ms", "Buffer de Historial: 300 puntos", "Precisión Decimal: 1"],
  },
  {
    icon: Palette,
    title: "Tema",
    description: "Esquema de colores y apariencia",
    options: ["Color de Acento: Azul", "Colores de Estado: Por defecto", "Velocidad de Animación: Normal"],
  },
];

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader title="Configuración" description="Configuración de la aplicación" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SETTINGS_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <GlassPanel key={group.title} className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[var(--color-primary-muted)]">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
                  <p className="text-xs text-[var(--color-muted)]">{group.description}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {group.options.map((option) => (
                  <div key={option} className="flex items-center justify-between py-1">
                    <span className="text-xs text-[var(--color-muted)]">{option.split(":")[0]?.trim()}</span>
                    <span className="text-xs text-foreground font-medium">{option.split(":")[1]?.trim()}</span>
                  </div>
                ))}
              </div>
            </GlassPanel>
          );
        })}
      </div>

      <GlassPanel className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Settings2 className="w-4 h-4 text-[var(--color-muted)]" />
          <h3 className="text-sm font-semibold text-foreground">Acerca de HydroTrain Monitor</h3>
        </div>
        <p className="text-xs text-[var(--color-muted)] leading-relaxed">
          Versión 0.1.0 · Frontend MVP · Construido con Next.js, React, TypeScript, TailwindCSS
        </p>
        <p className="text-xs text-[var(--color-muted)] leading-relaxed mt-1">
          Plataforma de monitoreo industrial para sistemas de trenes impulsados por hidrógeno.
        </p>
      </GlassPanel>
    </div>
  );
}
