# Data Model

## Entities

### Train

```typescript
interface Train {
  id: string;
  name: string;
  status: ComponentStatus;
  uptime: number;
  totalDistance: number;
  totalHydrogenConsumed: number;
  components: TrainComponent[];
}
```

### TrainComponent

```typescript
interface TrainComponent {
  id: ComponentId;
  name: string;
  status: ComponentStatus;
  metrics: ComponentMetrics;
  position: { x: number; y: number };
}
```

### ComponentMetrics

```typescript
interface ComponentMetrics {
  temperature: number;   // °C
  voltage: number;       // V
  current: number;       // A
  power: number;         // kW
  efficiency: number;    // 0-1
  health: number;        // 0-100%
}
```

### Subsystem-Specific Metrics

#### HydrogenTank

```typescript
interface HydrogenTankMetrics extends ComponentMetrics {
  pressure: number;         // bar
  level: number;            // %
  flowRate: number;         // kg/h
  hydrogenRemaining: number; // kg
  totalCapacity: number;    // kg
}
```

#### FuelCell

```typescript
interface FuelCellMetrics extends ComponentMetrics {
  hydrogenConsumption: number; // kg/h
  oxygenLevel: number;         // %
  coolantTemperature: number;  // °C
  stackVoltage: number;        // V
  stackCurrent: number;        // A
}
```

#### Battery

```typescript
interface BatteryMetrics extends ComponentMetrics {
  stateOfCharge: number;     // %
  stateOfHealth: number;     // %
  cellVoltageMin: number;    // V
  cellVoltageMax: number;    // V
  cellTemperature: number;   // °C
  cyclesCompleted: number;
}
```

#### Inverter

```typescript
interface InverterMetrics extends ComponentMetrics {
  inputVoltage: number;      // V
  outputVoltage: number;     // V
  inputCurrent: number;      // A
  outputCurrent: number;     // A
  switchingFrequency: number; // Hz
  modulationIndex: number;
}
```

#### Motor

```typescript
interface MotorMetrics extends ComponentMetrics {
  rpm: number;
  torque: number;            // N·m
  mechanicalPower: number;   // kW
  statorTemperature: number; // °C
  windingTemperature: number; // °C
  vibrationLevel: number;    // mm/s
}
```

#### Wheels

```typescript
interface WheelsMetrics extends ComponentMetrics {
  speed: number;             // km/h
  tractionForce: number;     // kN
  wheelSlip: number;         // 0-1
  brakeTemperature: number;  // °C
  distanceTraveled: number;  // m
}
```

### Telemetry

```typescript
interface TelemetryVariable {
  id: string;
  name: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  alarmThreshold: {
    warning: number;
    critical: number;
  };
  history: TelemetryPoint[];
}

interface TelemetryPoint {
  timestamp: string;  // ISO 8601
  value: number;
}

interface TelemetrySnapshot {
  timestamp: string;
  variables: Record<string, TelemetryVariable>;
  components: Record<ComponentId, ComponentMetrics>;
}
```

### Alarm

```typescript
interface Alarm {
  id: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  componentId: ComponentId;
  componentName: string;
  acknowledged: boolean;
  resolved: boolean;
  resolvedAt?: string;
}
```

### Dashboard KPI

```typescript
interface DashboardKPI {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  status: 'ok' | 'warning' | 'critical';
}

interface DashboardData {
  kpis: DashboardKPI[];
  systemStatus: ComponentStatus;
  activeAlarms: number;
  uptime: number;
  currentPower: number;
  hydrogenLevel: number;
  stateOfCharge: number;
}
```

### Service Response (Generic)

```typescript
interface ServiceResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}
```

## Enums

### ComponentId

```typescript
type ComponentId =
  | 'hydrogen-tank'
  | 'fuel-cell'
  | 'battery'
  | 'inverter'
  | 'traction-motor'
  | 'wheels';
```

### ComponentStatus

```typescript
type ComponentStatus =
  | 'operational'
  | 'warning'
  | 'critical'
  | 'offline'
  | 'maintenance';
```

### AlarmSeverity

```typescript
type AlarmSeverity = 'critical' | 'warning' | 'info';
```

## Data Flow

```
[Simulator Engine] ──publishes──► [Services Layer]
                                      │
                                      ▼
                                [Zustand Stores]
                                      │
                                      ▼
                              [React Components]
```

All components consume data through typed interfaces. The data source is irrelevant to the UI layer.
