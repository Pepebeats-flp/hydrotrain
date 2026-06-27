# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-06-26

### Added

- **Dashboard**: Real-time KPI cards for total power, hydrogen consumption, estimated range, efficiency, average temperature, and system status
- **Digital Twin**: Interactive system diagram using React Flow with custom component nodes and animated power flow edges
- **Component Inspection**: Right panel opens on component click showing metrics, health, and events
- **Live Monitoring**: Real-time telemetry display grouped by category (temperature, power, hydrogen, electrical, mechanical, battery)
- **Historical Charts**: Trend visualization for power, voltage, temperature, pressure, battery SOC, and motor RPM using Recharts
- **Alarm Center**: Filterable alarm management with severity levels (critical, warning, info), acknowledgment and resolution workflow
- **Simulation Controls**: Configurable data simulator with start/stop, speed multiplier, tick interval, and fault injection toggle
- **Reports**: Placeholder page for future report generation
- **Settings**: Application configuration page with display, notification, telemetry, and theme preferences
- **Sidebar**: Collapsible navigation with icons and labels, animated transitions

### Architecture

- Feature-first directory organization under `src/features/`
- Services layer providing data abstraction between simulator and components
- Zustand stores for state management
- Shared types defining the complete data contract for the platform
- Simulator engine generating realistic telemetry for all subsystems
- Dark theme with glassmorphism design system
- Strict TypeScript configuration
- Modular component hierarchy

### Documentation

- Architecture documentation (ARCHITECTURE.md)
- Development roadmap (ROADMAP.md)
- Data model definitions (DATA_MODEL.md)
- Component specifications (COMPONENTS.md)
- Simulator documentation (SIMULATOR.md)
- Future REST API design (API.md)
- CAN Bus integration plan (CAN_INTEGRATION.md)
- Design system documentation (DESIGN_SYSTEM.md)
- User interface guide (UI_GUIDE.md)
- Requirements specification (REQUIREMENTS.md)

### Project Infrastructure

- MIT License
- ESLint configuration
- Prettier configuration
- GitHub issue templates (bug report, feature request)
- GitHub Actions workflows (lint, build)
- Pull request template
- Contributing guidelines
