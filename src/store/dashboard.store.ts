import { create } from "zustand";
import type { DashboardData } from "@/shared/types";
import { dashboardService } from "@/services/dashboard.service";

interface DashboardStore {
  data: DashboardData | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  fetch: (refresh?: boolean) => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  data: null,
  loading: false,
  initialized: false,
  error: null,
  fetch: async (refresh = false) => {
    if (!refresh) set({ loading: true, error: null });
    const response = await dashboardService.getKPIs();
    if (response.success) {
      set({ data: response.data, loading: false, initialized: true });
    } else {
      set({ error: response.error ?? "Unknown error", loading: false, initialized: true });
    }
  },
}));
