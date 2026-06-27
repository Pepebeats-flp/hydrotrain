import {
  type TelemetrySnapshot,
  type TelemetryVariable,
  type ComponentMetrics,
  type ComponentId,
  type Alarm,
  type AlarmSeverity,
  type DashboardKPI,
  type DashboardData,
  type SimulationConfig,
} from "@/shared/types";
import { generateId, timestamp, clamp, lerp } from "@/shared/lib/utils";
import { SIMULATOR_CONFIG } from "@/utils/constants";

type Subscriber = (snapshot: TelemetrySnapshot) => void;
type AlarmSubscriber = (alarm: Alarm) => void;

interface SimState {
  h2Pressure: number;
  h2Level: number;
  h2FlowRate: number;
  h2Consumed: number;
  fuelCellTemp: number;
  fuelCellPower: number;
  fuelCellEfficiency: number;
  batterySoc: number;
  batteryTemp: number;
  batteryPower: number;
  inverterTemp: number;
  inverterPower: number;
  motorRpm: number;
  motorTorque: number;
  motorTemp: number;
  motorPower: number;
  wheelSpeed: number;
  wheelDist: number;
  wheelSlip: number;
  ambientTemp: number;
  loadDemand: number;
  loadTarget: number;
  systemUptime: number;
}

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export class Simulator {
  private subscribers = new Set<Subscriber>();
  private alarmSubscribers = new Set<AlarmSubscriber>();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private config: SimulationConfig;
  private alarmTimer = 0;

  private history: Map<string, { timestamp: string; value: number }[]> = new Map();
  private kpiHistory: { timestamp: string; kpis: DashboardKPI[] }[] = [];

  private state: SimState;

  constructor() {
    this.config = {
      tickInterval: SIMULATOR_CONFIG.TICK_INTERVAL_MS,
      enabled: false,
      speedMultiplier: 1,
      faultInjection: true,
    };

    this.state = this.initialState();
    this.initHistory();
  }

  private initialState(): SimState {
    return {
      h2Pressure: 700,
      h2Level: 85,
      h2FlowRate: 0.12,
      h2Consumed: 0,
      fuelCellTemp: 62,
      fuelCellPower: 180,
      fuelCellEfficiency: 0.58,
      batterySoc: 78,
      batteryTemp: 32,
      batteryPower: -20,
      inverterTemp: 38,
      inverterPower: 160,
      motorRpm: 2400,
      motorTorque: 420,
      motorTemp: 55,
      motorPower: 155,
      wheelSpeed: 72,
      wheelDist: 125000,
      wheelSlip: 0.02,
      ambientTemp: 22,
      loadDemand: 0.6,
      loadTarget: 0.6,
      systemUptime: 0,
    };
  }

  private initHistory(): void {
    const variableIds = [
      "fuel-cell-temp", "battery-soc", "motor-rpm", "motor-torque",
      "h2-pressure", "h2-flow", "battery-voltage", "motor-power",
      "inverter-temp", "wheel-speed", "system-power", "fuel-cell-power",
      "battery-power", "inverter-power", "motor-temp",
    ];
    for (const id of variableIds) {
      this.history.set(id, []);
    }
  }

  start(): void {
    if (this.intervalId) return;
    this.config.enabled = true;
    this.intervalId = setInterval(() => this.tick(), this.config.tickInterval);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.config.enabled = false;
  }

  reset(): void {
    this.stop();
    this.state = this.initialState();
    this.history.clear();
    this.initHistory();
    this.kpiHistory = [];
    this.alarmTimer = 0;
  }

  isRunning(): boolean {
    return this.config.enabled;
  }

  getConfig(): SimulationConfig {
    return { ...this.config };
  }

  updateConfig(partial: Partial<SimulationConfig>): void {
    Object.assign(this.config, partial);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => this.tick(), this.config.tickInterval);
    }
  }

  subscribe(cb: Subscriber): () => void {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  onAlarm(cb: AlarmSubscriber): () => void {
    this.alarmSubscribers.add(cb);
    return () => this.alarmSubscribers.delete(cb);
  }

  private getSnapshot(): TelemetrySnapshot {
    const s = this.state;
    const noise = (amp: number) => gaussianRandom() * amp;

    const variables: Record<string, TelemetryVariable> = {
      "fuel-cell-temp": this.makeVar("Fuel Cell Temperature", "°C", s.fuelCellTemp + noise(0.3), 55, 70),
      "battery-soc": this.makeVar("State of Charge", "%", s.batterySoc, 5, 100),
      "motor-rpm": this.makeVar("Motor RPM", "rpm", s.motorRpm + noise(5), 0, 6000),
      "motor-torque": this.makeVar("Motor Torque", "N·m", s.motorTorque + noise(2), 0, 800),
      "h2-pressure": this.makeVar("Hydrogen Pressure", "bar", s.h2Pressure + noise(0.5), 0, 700),
      "h2-flow": this.makeVar("Hydrogen Flow", "kg/h", s.h2FlowRate + noise(0.01), 0, 2),
      "battery-voltage": this.makeVar("Battery Voltage", "V", 650 + noise(1), 500, 750),
      "motor-power": this.makeVar("Motor Power", "kW", s.motorPower + noise(1), 0, 300),
      "inverter-temp": this.makeVar("Inverter Temperature", "°C", s.inverterTemp + noise(0.3), 20, 85),
      "wheel-speed": this.makeVar("Wheel Speed", "km/h", s.wheelSpeed + noise(0.2), 0, 140),
      "system-power": this.makeVar("System Power", "kW", s.fuelCellPower + s.batteryPower + noise(1), 0, 500),
      "fuel-cell-power": this.makeVar("Fuel Cell Power", "kW", s.fuelCellPower + noise(1), 0, 300),
      "battery-power": this.makeVar("Battery Power", "kW", s.batteryPower + noise(0.5), -150, 150),
      "inverter-power": this.makeVar("Inverter Power", "kW", s.inverterPower + noise(1), 0, 300),
      "motor-temp": this.makeVar("Motor Temperature", "°C", s.motorTemp + noise(0.3), 30, 120),
    };

    for (const [id, v] of Object.entries(variables)) {
      const hist = this.history.get(id) || [];
      hist.push({ timestamp: v.timestamp, value: v.value });
      if (hist.length > SIMULATOR_CONFIG.HISTORY_MAX_POINTS) hist.shift();
      this.history.set(id, hist);
    }

    const components: Record<ComponentId, ComponentMetrics> = {
      "hydrogen-tank": {
        temperature: s.ambientTemp + noise(0.2),
        voltage: 0, current: 0,
        power: 0, efficiency: 1,
        health: clamp(95 - (700 - s.h2Pressure) / 70, 60, 100),
      },
      "fuel-cell": {
        temperature: s.fuelCellTemp + noise(0.3),
        voltage: 48 + noise(0.1),
        current: s.fuelCellPower / 48 * 1000 + noise(1),
        power: s.fuelCellPower + noise(1),
        efficiency: s.fuelCellEfficiency + noise(0.002),
        health: clamp(92 - (s.fuelCellTemp - 55) * 0.3, 50, 100),
      },
      "battery": {
        temperature: s.batteryTemp + noise(0.2),
        voltage: 650 + noise(0.5),
        current: s.batteryPower / 650 * 1000 + noise(1),
        power: s.batteryPower + noise(0.5),
        efficiency: 0.95 + noise(0.002),
        health: clamp(s.batterySoc * 0.3 + 60 + noise(1), 40, 100),
      },
      "inverter": {
        temperature: s.inverterTemp + noise(0.3),
        voltage: 650 + noise(0.5),
        current: s.inverterPower / 650 * 1000 + noise(1),
        power: s.inverterPower + noise(1),
        efficiency: 0.97 + noise(0.001),
        health: clamp(90 - (s.inverterTemp - 20) * 0.2, 40, 100),
      },
      "traction-motor": {
        temperature: s.motorTemp + noise(0.3),
        voltage: 650 + noise(0.5),
        current: s.motorPower / 650 * 1000 + noise(2),
        power: s.motorPower + noise(1),
        efficiency: clamp(0.88 + noise(0.003), 0.7, 0.97),
        health: clamp(88 - (s.motorTemp - 30) * 0.2, 30, 100),
      },
      "wheels": {
        temperature: s.wheelSlip > 0.05 ? 45 + noise(1) : 30 + noise(0.5),
        voltage: 0, current: 0,
        power: s.motorPower * 0.98 + noise(0.5),
        efficiency: 0.98 + noise(0.001),
        health: clamp(95 - s.wheelDist / 100000, 50, 100),
      },
    };

    return {
      timestamp: timestamp(),
      variables,
      components,
    };
  }

  private makeVar(name: string, unit: string, value: number, min: number, max: number): TelemetryVariable {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    const hist = this.history.get(id) || [];
    return {
      id,
      name,
      unit,
      value: clamp(value, min, max),
      min,
      max,
      timestamp: timestamp(),
      alarmThreshold: {
        warning: min + (max - min) * 0.8,
        critical: min + (max - min) * 0.9,
      },
      history: hist.slice(-60),
    };
  }

  private tick(): void {
    const s = this.state;
    const dt = this.config.speedMultiplier * 0.1;
    const noise = (amp: number) => gaussianRandom() * amp;

    s.systemUptime += 0.1;

    s.loadTarget = clamp(s.loadTarget + noise(0.02), 0.1, 1.0);
    s.loadDemand = lerp(s.loadDemand, s.loadTarget, 0.05);

    s.h2FlowRate = clamp(0.05 + s.loadDemand * 0.25 + noise(0.01), 0, 0.5);
    s.h2Consumed += s.h2FlowRate * dt * 0.001;
    s.h2Pressure = clamp(s.h2Pressure - s.h2FlowRate * dt * 0.2 - 0.01, 10, 700);
    s.h2Level = clamp(s.h2Level - s.h2FlowRate * dt * 0.01, 0, 100);

    s.fuelCellPower = clamp(30 + s.loadDemand * 220 + noise(2), 0, 280);
    s.fuelCellTemp = clamp(
      55 + s.loadDemand * 12 + noise(0.5) + (s.fuelCellPower > 200 ? 2 : 0),
      20, 85,
    );
    s.fuelCellEfficiency = clamp(0.62 - s.loadDemand * 0.04 + noise(0.003), 0.3, 0.7);

    const powerDelta = s.fuelCellPower - s.motorPower;
    if (powerDelta > 10) {
      s.batteryPower = clamp(s.batteryPower + 1, -100, 100);
      s.batterySoc = clamp(s.batterySoc + 0.002, 0, 100);
    } else if (powerDelta < -10) {
      s.batteryPower = clamp(s.batteryPower - 1.5, -100, 100);
      s.batterySoc = clamp(s.batterySoc - 0.005 - s.loadDemand * 0.002, 0, 100);
    } else {
      s.batteryPower = lerp(s.batteryPower, 0, 0.02);
    }
    s.batteryTemp = clamp(28 + s.batterySoc * 0.05 + Math.abs(s.batteryPower) * 0.02 + noise(0.3), 15, 60);

    s.motorRpm = clamp(100 + s.loadDemand * 4800 + noise(10), 0, 6200);
    s.motorTorque = clamp(50 + s.loadDemand * 600 + noise(3), 0, 800);
    s.motorPower = clamp(s.motorRpm * s.motorTorque / 9549 + noise(1), 0, 300);
    s.motorTemp = clamp(40 + s.loadDemand * 40 + noise(0.5), 25, 130);

    s.inverterPower = clamp(s.motorPower * 1.03 + noise(1), 0, 310);
    s.inverterTemp = clamp(25 + s.loadDemand * 28 + noise(0.4), 15, 90);

    s.wheelSpeed = clamp(s.motorRpm * 0.03 + noise(0.1), 0, 160);
    s.wheelDist += s.wheelSpeed * dt * 0.1;
    s.wheelSlip = clamp(s.loadDemand > 0.8 ? 0.02 + noise(0.01) : 0.01 + noise(0.005), 0, 0.15);

    this.alarmTimer += this.config.tickInterval;
    if (this.config.faultInjection && this.alarmTimer > SIMULATOR_CONFIG.ALARM_INTERVAL_MS + Math.random() * SIMULATOR_CONFIG.ALARM_INTERVAL_VARIANCE) {
      this.alarmTimer = 0;
      this.maybeGenerateAlarm();
    }

    const snapshot = this.getSnapshot();
    for (const cb of this.subscribers) {
      cb(snapshot);
    }
  }

  private maybeGenerateAlarm(): void {
    const s = this.state;
    const r = Math.random();
    let alarm: Alarm | null = null;

    if (s.fuelCellTemp > 68 && r < 0.3) {
      alarm = this.createAlarm("critical", "Fuel Cell Overtemperature", `Temperature at ${s.fuelCellTemp.toFixed(1)}°C exceeds threshold`, "fuel-cell");
    } else if (s.batterySoc < 15 && r < 0.25) {
      alarm = this.createAlarm("warning", "Low Battery State of Charge", `SOC at ${s.batterySoc.toFixed(1)}%`, "battery");
    } else if (s.h2Pressure < 50 && r < 0.2) {
      alarm = this.createAlarm("critical", "Low Hydrogen Pressure", `Pressure at ${s.h2Pressure.toFixed(1)} bar`, "hydrogen-tank");
    } else if (s.motorTemp > 105 && r < 0.2) {
      alarm = this.createAlarm("critical", "Motor Overtemperature", `Motor temperature at ${s.motorTemp.toFixed(1)}°C`, "traction-motor");
    } else if (s.inverterTemp > 75 && r < 0.15) {
      alarm = this.createAlarm("warning", "Inverter Temperature High", `Inverter at ${s.inverterTemp.toFixed(1)}°C`, "inverter");
    } else if (s.wheelSlip > 0.08 && r < 0.2) {
      alarm = this.createAlarm("warning", "Excessive Wheel Slip", `Wheel slip at ${(s.wheelSlip * 100).toFixed(1)}%`, "wheels");
    } else if (r < 0.15) {
      alarm = this.createAlarm("info", "Routine Maintenance Advisory", `Scheduled maintenance approaching for fuel cell stack`, "fuel-cell");
    }

    if (alarm) {
      for (const cb of this.alarmSubscribers) {
        cb(alarm);
      }
    }
  }

  private createAlarm(severity: AlarmSeverity, title: string, description: string, componentId: ComponentId): Alarm {
    const componentNames: Record<ComponentId, string> = {
      "hydrogen-tank": "Hydrogen Tank",
      "fuel-cell": "Fuel Cell",
      "battery": "Battery",
      "inverter": "Inverter",
      "traction-motor": "Traction Motor",
      "wheels": "Wheels",
    };
    return {
      id: generateId(),
      timestamp: timestamp(),
      severity,
      title,
      description,
      componentId,
      componentName: componentNames[componentId],
      acknowledged: false,
      resolved: false,
    };
  }

  getDashboardData(): DashboardData {
    const s = this.state;
    const efficiency = s.fuelCellEfficiency * 100;
    const range = (s.h2Level / 100) * 800 * (s.batterySoc / 100) * 0.3;

    return {
      kpis: [
        {
          id: "total-power",
          label: "Total Power",
          value: s.fuelCellPower + s.batteryPower,
          unit: "kW",
          trend: s.loadDemand > 0.5 ? "up" : "down",
          trendValue: s.loadDemand * 100,
          status: "ok",
        },
        {
          id: "h2-consumption",
          label: "Hydrogen Consumption",
          value: s.h2FlowRate,
          unit: "kg/h",
          trend: s.h2FlowRate > 0.15 ? "up" : "down",
          trendValue: s.h2FlowRate * 10,
          status: s.h2Level < 20 ? "warning" : "ok",
        },
        {
          id: "estimated-range",
          label: "Estimated Range",
          value: range,
          unit: "km",
          trend: "down",
          trendValue: s.h2FlowRate * 0.5,
          status: range < 100 ? "warning" : "ok",
        },
        {
          id: "efficiency",
          label: "Efficiency",
          value: efficiency,
          unit: "%",
          trend: efficiency > 55 ? "up" : "down",
          trendValue: s.loadDemand * 2,
          status: efficiency < 45 ? "warning" : "ok",
        },
        {
          id: "avg-temp",
          label: "Avg Temperature",
          value: (s.fuelCellTemp + s.motorTemp + s.inverterTemp + s.batteryTemp) / 4,
          unit: "°C",
          trend: s.loadDemand > 0.6 ? "up" : "stable",
          trendValue: s.loadDemand * 3,
          status: s.fuelCellTemp > 68 ? "critical" : "ok",
        },
        {
          id: "system-status",
          label: "System Status",
          value: s.fuelCellTemp > 68 || s.motorTemp > 105 ? 0 : s.batterySoc < 15 || s.h2Level < 20 ? 1 : 2,
          unit: "",
          trend: "stable",
          trendValue: 0,
          status: s.fuelCellTemp > 68 ? "critical" : s.batterySoc < 15 ? "warning" : "ok",
        },
      ],
      systemStatus: s.fuelCellTemp > 68 ? "critical" : s.batterySoc < 15 ? "warning" : "operational",
      activeAlarms: this.alarmCount,
      uptime: s.systemUptime,
      currentPower: s.fuelCellPower + s.batteryPower,
      hydrogenLevel: s.h2Level,
      stateOfCharge: s.batterySoc,
    };
  }

  private alarmCount = 0;

  getTelemetryVariables(): Record<string, TelemetryVariable> {
    return this.getSnapshot().variables;
  }
}

export const simulator = new Simulator();
