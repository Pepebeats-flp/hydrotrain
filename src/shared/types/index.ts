export type ComponentId =
  | "hydrogen-tank"
  | "fuel-cell"
  | "battery"
  | "inverter"
  | "traction-motor"
  | "wheels";

export type ComponentStatus = "operational" | "warning" | "critical" | "offline" | "maintenance";

export type AlarmSeverity = "critical" | "warning" | "info";

export interface TrainComponent {
  id: ComponentId;
  name: string;
  status: ComponentStatus;
  metrics: ComponentMetrics;
  position: { x: number; y: number };
}

export interface ComponentMetrics {
  temperature: number;
  voltage: number;
  current: number;
  power: number;
  efficiency: number;
  health: number;
}

export interface HydrogenTankMetrics extends ComponentMetrics {
  pressure: number;
  level: number;
  flowRate: number;
  hydrogenRemaining: number;
  totalCapacity: number;
}

export interface FuelCellMetrics extends ComponentMetrics {
  hydrogenConsumption: number;
  oxygenLevel: number;
  coolantTemperature: number;
  stackVoltage: number;
  stackCurrent: number;
}

export interface BatteryMetrics extends ComponentMetrics {
  stateOfCharge: number;
  stateOfHealth: number;
  cellVoltageMin: number;
  cellVoltageMax: number;
  cellTemperature: number;
  cyclesCompleted: number;
}

export interface InverterMetrics extends ComponentMetrics {
  inputVoltage: number;
  outputVoltage: number;
  inputCurrent: number;
  outputCurrent: number;
  switchingFrequency: number;
  modulationIndex: number;
}

export interface MotorMetrics extends ComponentMetrics {
  rpm: number;
  torque: number;
  mechanicalPower: number;
  statorTemperature: number;
  windingTemperature: number;
  vibrationLevel: number;
}

export interface WheelsMetrics extends ComponentMetrics {
  speed: number;
  tractionForce: number;
  wheelSlip: number;
  brakeTemperature: number;
  distanceTraveled: number;
}

export interface TelemetryPoint {
  timestamp: string;
  value: number;
}

export interface TelemetryVariable {
  id: string;
  name: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  timestamp: string;
  alarmThreshold: { warning: number; critical: number };
  history: TelemetryPoint[];
}

export interface TelemetrySnapshot {
  timestamp: string;
  variables: Record<string, TelemetryVariable>;
  components: Record<ComponentId, ComponentMetrics>;
}

export interface Alarm {
  id: string;
  timestamp: string;
  severity: AlarmSeverity;
  title: string;
  description: string;
  componentId: ComponentId;
  componentName: string;
  acknowledged: boolean;
  resolved: boolean;
  resolvedAt?: string;
}

export interface DashboardKPI {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
  status: "ok" | "warning" | "critical";
}

export interface DashboardData {
  kpis: DashboardKPI[];
  systemStatus: ComponentStatus;
  activeAlarms: number;
  uptime: number;
  currentPower: number;
  hydrogenLevel: number;
  stateOfCharge: number;
}

export interface SimulationConfig {
  tickInterval: number;
  enabled: boolean;
  speedMultiplier: number;
  faultInjection: boolean;
}

export interface HistoryQuery {
  variable: string;
  startTime: string;
  endTime: string;
  aggregation: "raw" | "1m" | "5m" | "15m" | "1h";
}

export interface HistoricalData {
  variable: string;
  data: TelemetryPoint[];
}

export interface ServiceResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}
