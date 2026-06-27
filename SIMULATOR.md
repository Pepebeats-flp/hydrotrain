# Simulator

## Overview

The simulator engine (`src/features/simulation/simulator.ts`) generates realistic telemetry data for all train subsystems. It runs as a singleton class inside the browser, driven by `setInterval`.

## Architecture

```
Simulator (class)
├── State: SimState (internal state machine)
├── Subscribers: Set<(snapshot: TelemetrySnapshot) => void>
├── Alarm Subscribers: Set<(alarm: Alarm) => void>
└── Tick: setInterval @ 100ms default
```

## Data Generation

### Physics Model

The simulator models the following interactions:

```
Load Demand ──► Fuel Cell Power ──► H₂ Consumption
     │                                  │
     │                                  ▼
     ├──► Motor RPM/Torque         H₂ Pressure ↓
     │                                  │
     └──► Battery SOC ◄──── Power Surplus/Deficit
```

### State Variables

| Variable | Range | Behavior |
|---|---|---|
| h2Pressure | 700 → 10 bar | Slowly decreases proportional to flow rate |
| h2Level | 85 → 0% | Decreases with consumption |
| h2FlowRate | 0.05 – 0.5 kg/h | Proportional to load demand |
| fuelCellTemp | 55 – 70°C | Follows load demand + random noise |
| fuelCellPower | 30 – 280 kW | Proportional to load demand |
| batterySoc | 0 – 100% | Decreases when power deficit, charges when surplus |
| motorRpm | 0 – 6200 RPM | Proportional to load demand |
| motorTorque | 50 – 800 N·m | Proportional to load demand |
| motorPower | 0 – 300 kW | Calculated from RPM × Torque |
| wheelSpeed | 0 – 160 km/h | Derived from RPM |
| inverterPower/temp | mirrored from motor | Heat proportional to power throughput |

### Noise Model

Every variable includes Gaussian noise proportional to its expected variance:

```typescript
const noise = (amplitude: number) => gaussianRandom() * amplitude;
```

### Load Demand Cycle

The load demand follows a smooth random walk:

1. Target load is randomly adjusted every tick (±0.02)
2. Actual load smoothly interpolates toward target (0.05 lerp factor)
3. This simulates natural acceleration/deceleration cycles

### Battery SOC Dynamics

| Condition | SOC Change |
|---|---|
| Fuel Cell power > Motor power + 10 | +0.002% per tick (charging) |
| Motor power > Fuel Cell power + 10 | -0.005% to -0.007% per tick (discharging) |
| Power balanced | No net change |

## Alarm Generation

The simulator injects random fault conditions based on:

| Probability per ~30s | Alarm |
|---|---|
| ~30% | Fuel Cell overtemperature (>68°C) |
| ~25% | Low battery SOC (<15%) |
| ~20% | Low H₂ pressure (<50 bar) |
| ~20% | Motor overtemperature (>105°C) |
| ~15% | Inverter temperature high (>75°C) |
| ~20% | Excessive wheel slip (>8%) |
| ~15% | Routine maintenance advisory |

## Configuration

| Parameter | Default | Range | Description |
|---|---|---|---|
| tickInterval | 100ms | 20-500ms | How often the simulation updates |
| speedMultiplier | 1x | 0.1-10x | Multiplier for all state changes |
| faultInjection | true | — | Enable/disable random alarm generation |

## Future

In production, the simulator will be replaced by a backend service that:

1. Reads real ECU data from CAN Bus
2. Stores it in a time-series database
3. Streams it to the frontend via WebSocket

The frontend will continue to consume data through the same **Services Layer** — no component changes needed.
