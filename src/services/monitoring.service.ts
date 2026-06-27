import type { TelemetryVariable, ServiceResponse } from "@/shared/types";
import { timestamp } from "@/shared/lib/utils";
import { simulator } from "@/features/simulation/simulator";

class MonitoringService {
  async getTelemetryVariables(): Promise<ServiceResponse<Record<string, TelemetryVariable>>> {
    try {
      const variables = simulator.getTelemetryVariables();
      return { success: true, data: variables, timestamp: timestamp() };
    } catch (error) {
      return {
        success: false,
        data: null as unknown as Record<string, TelemetryVariable>,
        error: error instanceof Error ? error.message : "Failed to fetch telemetry",
        timestamp: timestamp(),
      };
    }
  }

  subscribe(callback: (variables: Record<string, TelemetryVariable>) => void): () => void {
    return simulator.subscribe((snapshot) => {
      callback(snapshot.variables);
    });
  }
}

export const monitoringService = new MonitoringService();
