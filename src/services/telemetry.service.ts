import type { TelemetrySnapshot, ServiceResponse } from "@/shared/types";
import { timestamp } from "@/shared/lib/utils";
import { simulator } from "@/features/simulation/simulator";

class TelemetryService {
  subscribe(callback: (snapshot: TelemetrySnapshot) => void): () => void {
    return simulator.subscribe(callback);
  }

  async getCurrentSnapshot(): Promise<ServiceResponse<TelemetrySnapshot>> {
    try {
      const snapshot = simulator["getSnapshot"]();
      return { success: true, data: snapshot, timestamp: timestamp() };
    } catch (error) {
      return {
        success: false,
        data: null as unknown as TelemetrySnapshot,
        error: error instanceof Error ? error.message : "Failed to get telemetry snapshot",
        timestamp: timestamp(),
      };
    }
  }
}

export const telemetryService = new TelemetryService();
