# Architecture

## Current Architecture (Frontend MVP)

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                  │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────┐ │
│  │ Services  │──▶│ Zustand  │──▶│   React          │ │
│  │ Layer     │   │ Stores   │   │   Components     │ │
│  └─────┬────┘   └──────────┘   └──────────────────┘ │
│        │                                              │
│  ┌─────▼────┐                                        │
│  │Simulator │                                        │
│  │Engine    │                                        │
│  └──────────┘                                        │
└─────────────────────────────────────────────────────┘
```

### Layers

| Layer | Responsibility | Future Change |
|---|---|---|
| **Simulator Engine** | Generates realistic telemetry data, models hydrogen consumption, temperature dynamics, battery cycles, alarm conditions | Replaced by external data source |
| **Services Layer** | Wraps data sources (simulator or REST API). Components never import the simulator directly. | Swap implementations |
| **Zustand Stores** | Manages application state, exposes typed hooks | Same interface |
| **React Components** | Pure UI rendering, consume from stores | No changes needed |

## Future Architecture (Production)

```
┌──────────┐    ┌──────────┐    ┌───────────┐    ┌──────────┐    ┌──────────┐
│   ECU    │───▶│ CAN Bus  │───▶│  Gateway  │───▶│ Backend  │───▶│ Database │
│ (Train)  │    │          │    │  Service  │    │ (API)    │    │ (PG)     │
└──────────┘    └──────────┘    └───────────┘    └────┬─────┘    └──────────┘
                                                       │
                                            ┌──────────▼──────────┐
                                            │   REST API / WS      │
                                            │   (FastAPI / NestJS)  │
                                            └──────────┬──────────┘
                                                       │
                                            ┌──────────▼──────────┐
                                            │     Frontend         │
                                            │   (unchanged)        │
                                            └─────────────────────┘
```

## Why the Frontend Never Depends on the Data Source

### The Services Layer Pattern

Every data access goes through a **service class**. Each service has the exact same interface regardless of whether it reads from the simulator, a REST API, or a WebSocket.

```typescript
// Current — simulator-backed
class DashboardService {
  async getKPIs(): Promise<ServiceResponse<DashboardData>> {
    return simulator.getDashboardData();
  }
}

// Future — REST-backed (same interface, same return type)
class DashboardService {
  async getKPIs(): Promise<ServiceResponse<DashboardData>> {
    return fetch("/api/dashboard/kpis").then(r => r.json());
  }
}
```

### Data Contracts

All data flowing through the system conforms to strict TypeScript interfaces defined in `src/shared/types/index.ts`. The simulator, the future backend, and the CAN gateway will all produce data matching these same contracts.

### Benefits

- **Testability** — Swap the simulator for a mock service in tests
- **Parallel development** — Frontend and backend teams work independently
- **Future-proofing** — CAN Bus integration requires zero frontend changes
- **Type safety** — The shared types act as a living contract across the entire system

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **Feature-first architecture** | Groups all domain logic (components, hooks, types) by feature |
| **Services over direct store access** | Allows swapping data sources without touching components |
| **Simulator as a class** | Encapsulated, testable, configurable |
| **Zustand over Redux** | Minimal boilerplate, TypeScript-native, excellent DX |
| **React Flow for Digital Twin** | Extensible; can be replaced by Three.js for 3D without changing component architecture |
