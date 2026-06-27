import { create } from "zustand";
import type { DashboardData } from "@/shared/types";
import { dashboardService } from "@/services/dashboard.service";

interface DashboardStore {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  data: null,
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    const response = await dashboardService.getKPIs();
    if (response.success) {
      set({ data: response.data, loading: false });
    } else {
      set({ error: response.error ?? "Unknown error", loading: false });
    }
  },
}));
