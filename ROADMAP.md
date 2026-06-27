# Roadmap

## Phase 1 — Frontend MVP (Current)

| Status | Component | Description |
|---|---|---|
| ✅ | Project Scaffold | Next.js, TypeScript, Tailwind, shadcn/ui |
| ✅ | Architecture | Feature-first, services layer, Zustand stores |
| ✅ | Design System | Dark theme, glassmorphism, CSS variables |
| ✅ | Dashboard | KPI cards, system overview |
| ✅ | Digital Twin | React Flow diagram, component inspection panel |
| ✅ | Monitoring | Real-time telemetry display |
| ✅ | History | Recharts historical charts |
| ✅ | Alarms | Alarm center with severity filtering |
| ✅ | Simulation | Configurable data simulator |
| ✅ | Documentation | Full suite of architectural docs |

## Phase 2 — Backend

- [ ] Design and implement REST API
- [ ] WebSocket endpoint for real-time data streaming
- [ ] PostgreSQL database schema
- [ ] Authentication and authorization (JWT)
- [ ] User management
- [ ] API rate limiting
- [ ] Data persistence and archival
- [ ] Health check and monitoring endpoints

## Phase 3 — Database

- [ ] Schema design for telemetry time-series data
- [ ] TimescaleDB or InfluxDB for efficient storage
- [ ] Data retention policies
- [ ] Historical data aggregation
- [ ] Backup and recovery procedures
- [ ] Database migration system

## Phase 4 — CAN Integration

- [ ] CAN Bus gateway service
- [ ] DBC file parser/decoder
- [ ] ECU communication protocol
- [ ] Real telemetry ingestion pipeline
- [ ] Hardware-in-the-loop testing
- [ ] Field trials

## Phase 5 — Production Hardening

- [ ] Docker containerization
- [ ] Docker Compose for local development
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Kubernetes deployment manifests
- [ ] Load testing and performance optimization
- [ ] Security audit
- [ ] Monitoring and alerting (Prometheus, Grafana)
- [ ] Multi-environment deployment (dev/staging/prod)

## Phase 6 — Artificial Intelligence

- [ ] Predictive maintenance models
  - [ ] Fuel cell degradation prediction
  - [ ] Battery health forecasting
  - [ ] Component failure prediction
- [ ] Anomaly detection on telemetry streams
- [ ] Optimized energy management recommendations
- [ ] Remaining useful life (RUL) estimation
- [ ] Automated report generation

## Phase 7 — Fleet Monitoring

- [ ] Multi-train support
- [ ] Fleet-level dashboard
- [ ] Comparative analytics across trains
- [ ] Centralized alarm management
- [ ] Fleet-wide reporting
- [ ] Geo-location tracking

## Milestones

| Milestone | Target | Deliverable |
|---|---|---|
| MVP Launch | Q1 2026 | Fully functional single-train monitoring |
| Backend Ready | Q2 2026 | REST API + WebSocket + Database |
| CAN Integration | Q3 2026 | Real ECU data ingestion |
| Production Release | Q4 2026 | Containerized, monitored, secured |
| AI Features | Q1 2027 | Predictive maintenance & anomaly detection |
| Fleet Support | Q2 2027 | Multi-train management |
