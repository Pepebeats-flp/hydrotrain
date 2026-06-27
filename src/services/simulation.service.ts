import type { SimulationConfig, ServiceResponse } from "@/shared/types";
import { timestamp } from "@/shared/lib/utils";
import { simulator } from "@/features/simulation/simulator";

class SimulationService {
  start(): void {
    simulator.start();
  }

  stop(): void {
    simulator.stop();
  }

  reset(): void {
    simulator.reset();
  }

  isRunning(): boolean {
    return simulator.isRunning();
  }

  getConfig(): SimulationConfig {
    return simulator.getConfig();
  }

  updateConfig(config: Partial<SimulationConfig>): void {
    simulator.updateConfig(config);
  }

  async getStatus(): Promise<ServiceResponse<{ running: boolean; config: SimulationConfig }>> {
    return {
      success: true,
      data: { running: this.isRunning(), config: this.getConfig() },
      timestamp: timestamp(),
    };
  }
}

export const simulationService = new SimulationService();
