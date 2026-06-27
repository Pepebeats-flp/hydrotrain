import { create } from "zustand";
import type { SimulationConfig } from "@/shared/types";
import { simulationService } from "@/services/simulation.service";

interface SimulationStore {
  running: boolean;
  config: SimulationConfig;
  toggle: () => void;
  reset: () => void;
  updateConfig: (config: Partial<SimulationConfig>) => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  running: simulationService.isRunning(),
  config: simulationService.getConfig(),
  toggle: () => {
    const { running } = get();
    if (running) {
      simulationService.stop();
    } else {
      simulationService.start();
    }
    set({ running: !running });
  },
  reset: () => {
    simulationService.reset();
    set({ running: false, config: simulationService.getConfig() });
  },
  updateConfig: (partial) => {
    simulationService.updateConfig(partial);
    set({ config: simulationService.getConfig() });
  },
}));
