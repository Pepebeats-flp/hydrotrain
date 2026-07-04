"use client";

import { useEffect } from "react";
import { Sidebar } from "@/shared/components/Sidebar";
import { useDashboardStore } from "@/store/dashboard.store";
import { useAlarmStore } from "@/store/alarm.store";
import { useMonitoringStore } from "@/store/monitoring.store";
import { useSimulationStore } from "@/store/simulation.store";
import { useSidebarStore } from "@/store/sidebar.store";
import { Menu } from "lucide-react";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const openMobile = useSidebarStore((s) => s.openMobile);
  const fetchDashboard = useDashboardStore((s) => s.fetch);
  const initializeAlarms = useAlarmStore((s) => s.initialize);
  const initializeMonitoring = useMonitoringStore((s) => s.initialize);
  const running = useSimulationStore((s) => s.running);
  const toggle = useSimulationStore((s) => s.toggle);

  useEffect(() => {
    if (!running) {
      toggle();
    }

    fetchDashboard();
    const unsubAlarms = initializeAlarms();
    const unsubMonitoring = initializeMonitoring();

    const dashboardInterval = setInterval(() => {
      fetchDashboard(true);
    }, 500);

    return () => {
      clearInterval(dashboardInterval);
      unsubAlarms();
      unsubMonitoring();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen bg-[var(--color-background)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <div className="md:hidden flex items-center h-12 px-4 border-b border-[var(--color-sidebar-border)] bg-[var(--color-sidebar)]">
          <button onClick={openMobile} className="p-2 -ml-2 rounded-lg text-[var(--color-muted)] hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-2 text-sm font-semibold text-foreground">HydroTrain</span>
        </div>
        {children}
      </main>
    </div>
  );
}
