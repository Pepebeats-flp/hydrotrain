import type { ComponentId, TrainComponent, TelemetrySnapshot, ServiceResponse } from "@/shared/types";
import { timestamp } from "@/shared/lib/utils";
import { simulator } from "@/features/simulation/simulator";

const COMPONENT_METADATA: Record<ComponentId, Omit<TrainComponent, "metrics">> = {
  "hydrogen-tank": {
    id: "hydrogen-tank",
    name: "Hydrogen Tank",
    status: "operational",
    position: { x: 100, y: 250 },
  },
  "fuel-cell": {
    id: "fuel-cell",
    name: "Fuel Cell",
    status: "operational",
    position: { x: 350, y: 250 },
  },
  "battery": {
    id: "battery",
    name: "Battery",
    status: "operational",
    position: { x: 350, y: 450 },
  },
  "inverter": {
    id: "inverter",
    name: "Inverter",
    status: "operational",
    position: { x: 600, y: 250 },
  },
  "traction-motor": {
    id: "traction-motor",
    name: "Traction Motor",
    status: "operational",
    position: { x: 850, y: 250 },
  },
  "wheels": {
    id: "wheels",
    name: "Wheels",
    status: "operational",
    position: { x: 1100, y: 250 },
  },
};

class ComponentService {
  async getComponents(): Promise<ServiceResponse<TrainComponent[]>> {
    try {
      const snapshot = simulator["getSnapshot"]();
      const components: TrainComponent[] = Object.entries(COMPONENT_METADATA).map(
        ([id, meta]) => {
          const componentId = id as ComponentId;
          const metrics = snapshot.components[componentId] || {
            temperature: 0,
            voltage: 0,
            current: 0,
            power: 0,
            efficiency: 0,
            health: 100,
          };
          return {
            ...meta,
            id: componentId,
            status: this.determineStatus(componentId, metrics, snapshot),
            metrics,
          };
        },
      );
      return { success: true, data: components, timestamp: timestamp() };
    } catch (error) {
      return {
        success: false,
        data: null as unknown as TrainComponent[],
        error: error instanceof Error ? error.message : "Failed to fetch components",
        timestamp: timestamp(),
      };
    }
  }

  private determineStatus(
    componentId: ComponentId,
    metrics: TrainComponent["metrics"],
    snapshot: TelemetrySnapshot,
  ): TrainComponent["status"] {
    if (metrics.health < 40) return "critical";
    if (metrics.health < 70) return "warning";
    if (componentId === "hydrogen-tank" && snapshot.variables["h2-pressure"]?.value < 50) return "warning";
    return "operational";
  }
}

export const componentService = new ComponentService();
