# CAN Bus Integration

> This document describes the future integration of the monitoring platform with the train's CAN Bus network.
> No implementation has been started.

## System Architecture

```
┌─────────────────┐
│   ECU 1         │  Engine Control Unit
│   (Fuel Cell)   │
└────────┬────────┘
         │
┌─────────────────┐
│   ECU 2         │  Battery Management System
│   (BMS)         │
└────────┬────────┘
         │
┌─────────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   ECU 3         │     │   CAN Bus    │     │   Gateway    │     │   Backend    │
│   (Motor)       │────▶│   250 kbps   │────▶│   Service    │────▶│   (API)      │
└────────┬────────┘     └──────────────┘     └──────────────┘     └──────────────┘
         │                                                            │
┌─────────────────┐                                                   │
│   ECU 4         │                                                   ▼
│   (Inverter)    │                                          ┌──────────────┐
└────────┬────────┘                                          │   Database   │
         │                                                   │              │
┌─────────────────┐                                          └──────────────┘
│   ECU 5         │
│   (Tank)        │
└─────────────────┘
```

## Components

### ECU (Electronic Control Unit)

Each subsystem has its own ECU that broadcasts CAN messages:

| ECU | Subsystem | Message Frequency |
|---|---|---|
| ECU 1 | Fuel Cell | 100 ms |
| ECU 2 | Battery (BMS) | 100 ms |
| ECU 3 | Motor Controller | 50 ms |
| ECU 4 | Inverter | 100 ms |
| ECU 5 | Hydrogen Tank | 500 ms |
| ECU 6 | Brake System | 100 ms |

### CAN Bus

| Property | Value |
|---|---|
| Protocol | CAN 2.0B (29-bit extended ID) |
| Baud Rate | 250 kbps |
| Termination | 120 Ω |
| Cable | Shielded twisted pair |

### DBC File Format

The DBC (CAN Database) file defines the mapping between raw CAN messages and physical values.

```
BO_ 100 FC_TEMPERATURE: 8 ECU1
 SG_ StackTemp : 0|16@1+ (0.1,50) [0|100] "°C" ECU1,FC
 SG_ CoolantTemp : 16|16@1+ (0.1,40) [0|100] "°C" ECU1,FC

BO_ 200 BATTERY_STATUS: 8 ECU2
 SG_ SOC : 0|16@1+ (0.01,0) [0|100] "%" ECU2,BMS
 SG_ Voltage : 16|16@1+ (0.1,0) [300|800] "V" ECU2,BMS
```

### Gateway Service

The Gateway Service runs on an embedded computer (e.g., Raspberry Pi, industrial PC) connected to the CAN Bus via a CAN interface (e.g., PCAN-USB, SocketCAN).

Responsibilities:
1. Read raw CAN frames from the bus
2. Decode frames using the DBC file
3. Normalize data into the standard data contract format
4. Publish to the backend via MQTT or HTTP

### Backend

The backend receives normalized telemetry, stores it in a time-series database, and streams it to the frontend via WebSocket.

## Data Contract

The CAN gateway produces data matching the same TypeScript interfaces defined in `src/shared/types/index.ts`. This ensures the frontend continues to work without any modifications.

```typescript
// The frontend receives this — from simulator or CAN, it doesn't matter
interface TelemetrySnapshot {
  timestamp: string;
  variables: Record<string, TelemetryVariable>;
  components: Record<ComponentId, ComponentMetrics>;
}
```

## Message Mapping

| CAN ID | Signal | Telemetry Variable | Type |
|---|---|---|---|
| 0x100 | StackTemp | fuel-cell-temp | float |
| 0x100 | CoolantTemp | — (future) | float |
| 0x200 | SOC | battery-soc | float |
| 0x200 | Voltage | battery-voltage | float |
| 0x300 | RPM | motor-rpm | uint16 |
| 0x300 | Torque | motor-torque | uint16 |

## Implementation Steps

1. Install SocketCAN interface on gateway hardware
2. Write DBC file for all CAN messages
3. Implement DBC parser/generator in gateway service
4. Set up MQTT bridge from gateway to backend
5. Replace simulator with live data stream in frontend (zero code changes)
6. Implement fallback to simulator when real data is unavailable

## Testing Strategy

| Phase | Description |
|---|---|
| 1 | Record CAN bus data from real train → replay in simulator mode |
| 2 | Hardware-in-the-loop: gateway connected to CAN simulator |
| 3 | Field test: gateway on actual train, data flowing to dev backend |
| 4 | Production: full pipeline end-to-end |
