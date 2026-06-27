# HydroTrain Monitor

> Industrial monitoring platform for Hydrogen-powered Train systems.

![HydroTrain Monitor Dashboard](public/screenshots/dashboard.png)

## Overview

HydroTrain Monitor is a modern, real-time monitoring platform designed for a hydrogen-powered train. It provides comprehensive telemetry visualization, interactive system diagrams, alarm management, and historical data analysis.

Built with a **data-source-agnostic architecture**, the frontend is completely decoupled from how data is generated — whether from a simulation engine, a REST API, or a CAN Bus gateway.

## Features

- **Dashboard** — Real-time KPI cards (power, hydrogen consumption, efficiency, range, temperature, system status)
- **Digital Twin** — Interactive 2D system diagram built with React Flow; click any component to inspect metrics, health, and events
- **Live Monitoring** — Real-time telemetry table with all system variables
- **Historical Charts** — Trend analysis for power, voltage, temperature, pressure, SOC, and motor RPM
- **Alarm Center** — Filterable alarm management with severity levels (critical, warning, info)
- **Simulation Controls** — Configurable data simulator with speed multiplier and fault injection
- **Settings** — Application configuration (future: user preferences)

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│  Simulator  │────▶│   Services   │────▶│  Zustand      │
│  Engine     │     │   Layer      │     │  Stores       │
└─────────────┘     └──────────────┘     └───────┬───────┘
                                                  │
                                                  ▼
                                          ┌───────────────┐
                                          │  React        │
                                          │  Components   │
                                          └───────────────┘
```

The **Services Layer** is the key abstraction. Today it wraps the simulator. Tomorrow it wraps REST API calls — without changing a single component.

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | TailwindCSS v4 |
| UI Components | shadcn/ui |
| State Management | Zustand |
| Charts | Recharts |
| Diagram | React Flow |
| Icons | Lucide React |
| Animations | Framer Motion |
| Code Quality | ESLint, Prettier |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

The application runs at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── features/               # Feature-first modules
│   ├── dashboard/
│   ├── digital-twin/
│   ├── monitoring/
│   ├── alarms/
│   ├── reports/
│   ├── simulation/
│   └── settings/
├── shared/                 # Reusable components, hooks, types, utilities
├── services/               # Data abstraction layer
├── store/                  # Zustand state management
└── utils/                  # Constants, formatters, colors
```

## Documentation

| Document | Description |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture (current & future) |
| [ROADMAP.md](ROADMAP.md) | Development roadmap |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [DATA_MODEL.md](DATA_MODEL.md) | Entity definitions |
| [COMPONENTS.md](COMPONENTS.md) | Train subsystem documentation |
| [SIMULATOR.md](SIMULATOR.md) | Simulation engine |
| [API.md](API.md) | Future REST API |
| [CAN_INTEGRATION.md](CAN_INTEGRATION.md) | Future CAN Bus integration |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | UI design tokens |
| [UI_GUIDE.md](UI_GUIDE.md) | Screen-by-screen guide |
| [REQUIREMENTS.md](REQUIREMENTS.md) | Functional & non-functional requirements |

## Roadmap

### Phase 1 — Frontend MVP (Current)
- [x] Interactive dashboard with KPI cards
- [x] Digital Twin with React Flow
- [x] Real-time monitoring
- [x] Historical charting
- [x] Alarm management
- [x] Simulation engine
- [x] Data abstraction layer

### Phase 2 — Backend
- [ ] REST API implementation
- [ ] WebSocket for real-time data
- [ ] PostgreSQL database
- [ ] Authentication & authorization

### Phase 3 — CAN Integration
- [ ] CAN Bus gateway service
- [ ] DBC file decoder
- [ ] Real ECU telemetry
- [ ] Hardware-in-the-loop testing

### Phase 4 — Production
- [ ] Containerization (Docker)
- [ ] CI/CD pipeline
- [ ] Monitoring & alerting
- [ ] Load testing

### Phase 5 — AI & Advanced
- [ ] Predictive maintenance
- [ ] Anomaly detection
- [ ] Fleet monitoring
- [ ] Multi-tenant support

## License

MIT License — see [LICENSE](LICENSE) for details.
