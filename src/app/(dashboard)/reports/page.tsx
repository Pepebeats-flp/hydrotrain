"use client";

import { FileText } from "lucide-react";
import { GlassPanel } from "@/shared/components/GlassPanel";
import { PageHeader } from "@/shared/components/PageHeader";

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Reports" description="Generate and view system reports" />

      <div className="flex flex-col items-center justify-center py-20 text-[var(--color-muted)]">
        <div className="p-4 rounded-full bg-[var(--color-primary-muted)] mb-4">
          <FileText className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Reports Coming Soon</h3>
        <p className="text-sm text-[var(--color-muted)] text-center max-w-md">
          The reports module will allow you to generate detailed system reports,
          export telemetry data, and create custom analysis documents.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-2xl">
          <GlassPanel className="p-4 text-center">
            <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase mb-1">Daily</h4>
            <p className="text-xs text-[var(--color-muted)]">System performance summaries</p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center">
            <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase mb-1">Weekly</h4>
            <p className="text-xs text-[var(--color-muted)]">Trend analysis & anomalies</p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center">
            <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase mb-1">Monthly</h4>
            <p className="text-xs text-[var(--color-muted)]">Fleet-wide operational reports</p>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
