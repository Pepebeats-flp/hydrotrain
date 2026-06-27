# Requirements

## Functional Requirements

### F1 — Dashboard
- F1.1 System shall display real-time KPI cards for total power, hydrogen consumption, estimated range, efficiency, average temperature, and system status
- F1.2 KPIs shall update automatically at a configurable interval
- F1.3 Each KPI shall show trend direction and magnitude
- F1.4 System status shall be color-coded (green=ok, amber=warning, red=critical)

### F2 — Digital Twin
- F2.1 System shall display an interactive component diagram using React Flow
- F2.2 Diagram shall show all six subsystems: hydrogen tank, fuel cell, battery, inverter, traction motor, wheels
- F2.3 Components shall be connected by animated edges representing power flow
- F2.4 Clicking a component shall open an inspection panel with metrics, health, and events
- F2.5 Component health shall be shown as a progress bar
- F2.6 The architecture shall support future replacement of 2D diagram with 3D visualization

### F3 — Live Monitoring
- F3.1 System shall display all telemetry variables in real-time
- F3.2 Variables shall be grouped by category (temperature, power, hydrogen, electrical, mechanical, battery)
- F3.3 Each variable shall show current value, unit, and name
- F3.4 Values shall update automatically via subscription

### F4 — Historical Charts
- F4.1 System shall display historical trends for power, voltage, temperature, pressure, SOC, and motor RPM
- F4.2 Charts shall use Recharts AreaChart with gradient fills
- F4.3 User shall be able to select which variable to view in the main chart
- F4.4 Mini chart previews shall be shown for other variables
- F4.5 Charts shall display the last 300 data points

### F5 — Alarms
- F5.1 System shall display alarms with severity, timestamp, description, and affected component
- F5.2 User shall be able to filter alarms by severity (critical, warning, info)
- F5.3 User shall be able to filter by acknowledgment status
- F5.4 User shall be able to acknowledge and resolve alarms
- F5.5 New alarms shall appear with animation at the top of the list

### F6 — Simulation
- F6.1 System shall include a data simulator generating realistic telemetry
- F6.2 User shall be able to start and stop the simulation
- F6.3 User shall be able to adjust tick interval and speed multiplier
- F6.4 User shall be able to enable/disable fault injection
- F6.5 User shall be able to reset the simulation state

### F7 — Data Architecture
- F7.1 All data shall flow through a services layer, not directly to components
- F7.2 Services shall be swappable between simulator and REST API without component changes
- F7.3 All data contracts shall be defined as TypeScript interfaces
- F7.4 All components shall receive typed data

## Non-Functional Requirements

### NFR1 — Performance
- NFR1.1 UI shall respond to user interactions within 100ms
- NFR1.2 Telemetry updates shall render within 16ms (60fps)
- NFR1.3 Application shall handle 300+ data points per chart without jank

### NFR2 — Maintainability
- NFR2.1 Codebase shall follow feature-first architecture
- NFR2.2 Components shall be reusable and composable
- NFR2.3 No duplicated code (DRY principle)
- NFR2.4 Strict TypeScript with no `any` types

### NFR3 — Scalability
- NFR3.1 Architecture shall support future multi-train management
- NFR3.2 Services layer shall support multiple data sources
- NFR3.3 State management shall support future real-time WebSocket connections

### NFR4 — Reliability
- NFR4.1 Services shall handle errors gracefully with typed error responses
- NFR4.2 Application shall display loading states during data fetch
- NFR4.3 Application shall handle missing data without crashing

### NFR5 — Security
- NFR5.1 No authentication in MVP (future requirement)
- NFR5.2 No secrets or credentials in frontend code
- NFR5.3 Future: JWT-based authentication

### NFR6 — Compatibility
- NFR6.1 Application shall work on modern browsers (Chrome, Firefox, Edge, Safari)
- NFR6.2 Minimum screen resolution: 1280×720
- NFR6.3 Responsive down to 1024px width

## Future Requirements

### FR1 — Backend
- FR1.1 REST API for all data endpoints
- FR1.2 WebSocket for real-time data streaming
- FR1.3 PostgreSQL database for persistence
- FR1.4 User authentication and authorization

### FR2 — CAN Integration
- FR2.1 CAN Bus gateway service
- FR2.2 DBC file decoder
- FR2.3 Real ECU telemetry ingestion

### FR3 — AI & Analytics
- FR3.1 Predictive maintenance models
- FR3.2 Anomaly detection
- FR3.3 Remaining useful life estimation

### FR4 — Fleet Management
- FR4.1 Multi-train support
- FR4.2 Fleet-level dashboard
- FR4.3 Comparative analytics

### FR5 — Advanced Visualization
- FR5.1 3D digital twin using Three.js
- FR5.2 Augmented reality overlay
- FR5.3 Real-time video feed integration
