"use client";

import { Settings2, Monitor, Bell, Activity, Palette } from "lucide-react";
import { GlassPanel } from "@/shared/components/GlassPanel";
import { PageHeader } from "@/shared/components/PageHeader";

const SETTINGS_GROUPS = [
  {
    icon: Monitor,
    title: "Display",
    description: "Theme, layout, chart preferences",
    options: ["Dark Theme (Fixed)", "Sidebar: Collapsible", "Chart Refresh: 500ms"],
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Alarm notification preferences",
    options: ["Critical Alarms: Enabled", "Warning Alarms: Enabled", "Info Alarms: Disabled"],
  },
  {
    icon: Activity,
    title: "Telemetry",
    description: "Data polling and display settings",
    options: ["Polling Interval: 100ms", "History Buffer: 300 points", "Decimal Precision: 1"],
  },
  {
    icon: Palette,
    title: "Theme",
    description: "Color scheme and appearance",
    options: ["Accent Color: Blue", "Status Colors: Default", "Animation Speed: Normal"],
  },
];

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Settings" description="Application configuration" />

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
          <h3 className="text-sm font-semibold text-foreground">About HydroTrain Monitor</h3>
        </div>
        <p className="text-xs text-[var(--color-muted)] leading-relaxed">
          Version 0.1.0 · Frontend MVP · Built with Next.js, React, TypeScript, TailwindCSS
        </p>
        <p className="text-xs text-[var(--color-muted)] leading-relaxed mt-1">
          Industrial monitoring platform for Hydrogen-powered Train systems.
        </p>
      </GlassPanel>
    </div>
  );
}
