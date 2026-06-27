import type { DashboardData, ServiceResponse } from "@/shared/types";
import { timestamp } from "@/shared/lib/utils";
import { simulator } from "@/features/simulation/simulator";

class DashboardService {
  async getKPIs(): Promise<ServiceResponse<DashboardData>> {
    try {
      const data = simulator.getDashboardData();
      return { success: true, data, timestamp: timestamp() };
    } catch (error) {
      return {
        success: false,
        data: null as unknown as DashboardData,
        error: error instanceof Error ? error.message : "Failed to fetch dashboard data",
        timestamp: timestamp(),
      };
    }
  }
}

export const dashboardService = new DashboardService();
