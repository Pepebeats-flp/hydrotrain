import { create } from "zustand";
import type { TelemetryVariable } from "@/shared/types";
import { monitoringService } from "@/services/monitoring.service";

interface MonitoringStore {
  variables: Record<string, TelemetryVariable>;
  loading: boolean;
  error: string | null;
  initialize: () => () => void;
}

export const useMonitoringStore = create<MonitoringStore>((set) => ({
  variables: {},
  loading: true,
  error: null,
  initialize: () => {
    const unsub = monitoringService.subscribe((variables) => {
      set({ variables, loading: false, error: null });
    });
    return unsub;
  },
}));
