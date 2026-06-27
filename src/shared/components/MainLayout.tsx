"use client";

import { useEffect } from "react";
import { Sidebar } from "@/shared/components/Sidebar";
import { useDashboardStore } from "@/store/dashboard.store";
import { useAlarmStore } from "@/store/alarm.store";
import { useMonitoringStore } from "@/store/monitoring.store";
import { useDigitalTwinStore } from "@/store/digital-twin.store";
import { useSimulationStore } from "@/store/simulation.store";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const fetchDashboard = useDashboardStore((s) => s.fetch);
  const initializeAlarms = useAlarmStore((s) => s.initialize);
  const initializeMonitoring = useMonitoringStore((s) => s.initialize);
  const fetchComponents = useDigitalTwinStore((s) => s.fetchComponents);
  const running = useSimulationStore((s) => s.running);
  const toggle = useSimulationStore((s) => s.toggle);

  useEffect(() => {
    fetchDashboard();
    fetchComponents();
    const unsubAlarms = initializeAlarms();
    const unsubMonitoring = initializeMonitoring();

    if (!running) {
      toggle();
    }

    const dashboardInterval = setInterval(() => {
      fetchDashboard();
      fetchComponents();
    }, 500);

    return () => {
      clearInterval(dashboardInterval);
      unsubAlarms();
      unsubMonitoring();
    };
    // Zustand selectors return stable references - safe to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen bg-[var(--color-background)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {children}
      </main>
    </div>
  );
}
