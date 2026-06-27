# UI Guide

## Dashboard (`/dashboard`)

### Purpose
Real-time system overview with key performance indicators.

### Components

1. **KPI Cards** (6 cards in a responsive grid)
   - Total Power (kW) — current power output with trend indicator
   - Hydrogen Consumption (kg/h) — current H₂ flow rate
   - Estimated Range (km) — remaining distance based on H₂ and battery
   - Efficiency (%) — fuel cell efficiency
   - Average Temperature (°C) — mean of all subsystem temperatures
   - System Status — operational/warning/critical label
   - Each card shows: label, value, unit, trend arrow, trend percentage
   - Color-coded left border (green/amber/red)

2. **System Overview** (2-column layout)
   - Left panel: System status, uptime, current power, hydrogen level bar, SOC bar
   - Right panel: Quick stats (fuel cell temp, active alarms, H₂ remaining, SOC, efficiency)

3. **Power Distribution & System Health** (2-column layout)
   - Bar charts showing power split and component health percentages

### Interactions
- Cards animate in on load
- Progress bars update in real-time
- Data refreshes every 500ms

---

## Digital Twin (`/digital-twin`)

### Purpose
Interactive system diagram for subsystem visualization and inspection.

### Components

1. **React Flow Canvas**
   - 6 component nodes arranged left-to-right: Hydrogen Tank → Fuel Cell → Inverter → Motor → Wheels
   - Battery positioned below Fuel Cell
   - Animated edges showing power flow direction
   - Custom node components showing icon, name, power, temperature, health bar
   - Color-coded node borders based on health status
   - Background grid, minimap, zoom controls

2. **Component Inspection Panel** (slides in from right)
   - Shows when a component node is clicked
   - Component name, icon, status badge
   - Full metrics table (temperature, voltage, current, power, efficiency, health)
   - Events section (placeholder for future)
   - Close button to dismiss

### Interactions
- Click any node → right panel opens with component details
- Click × or another node → panel updates/closes
- Drag to pan, scroll to zoom
- Minimap for navigation

---

## Live Monitoring (`/monitoring`)

### Purpose
Real-time telemetry data display grouped by category.

### Components

1. **Category Cards** (6 groups)
   - Temperature: Fuel Cell, Inverter, Motor temps
   - Power & Energy: System, Fuel Cell, Battery, Inverter, Motor power
   - Hydrogen: Pressure, Flow rate
   - Electrical: Battery voltage
   - Mechanical: Motor RPM, Torque, Wheel speed
   - Battery: State of Charge
   - Each card color-coded left border matching its category

2. **Variable Display**
   - Icon + name on left
   - Value + unit on right
   - Monospace font for values
   - Real-time updates via subscription

---

## History (`/history`)

### Purpose
Historical trend analysis for key variables.

### Components

1. **Chart Selector** (horizontal pill buttons)
   - Power, Temperature, Voltage, Pressure, SOC, Motor RPM
   - Active state highlighted in blue

2. **Main Chart** (AreaChart)
   - Full-size chart with gradient fill
   - Time on X-axis, value on Y-axis
   - Grid lines, tooltip on hover
   - Auto-scaling axes
   - Displays last 300 data points

3. **Mini Charts** (2-column grid below)
   - Small preview charts for remaining categories
   - Click switches the main chart
   - Shows last 30 data points

---

## Alarms (`/alarms`)

### Purpose
Alarm management and monitoring center.

### Components

1. **Filter Bar**
   - Severity filter: All, Critical, Warning, Info
   - Status filter: All, Unacknowledged, Acknowledged
   - Unread count badge
   - Clear All button

2. **Alarm List** (stacked cards)
   - Each alarm shows:
     - Severity icon in colored background
     - Title (bold)
     - Severity badge
     - Description
     - Timestamp + component name
     - Acknowledge/Resolve action buttons
   - Acknowledged alarms appear faded
   - Animated entry/exit

### Interactions
- Click acknowledge → marks as acknowledged
- Click resolve → marks as resolved with timestamp
- Severity/status filtering
- New alarms appear at the top with animation

---

## Reports (`/reports`)

### Purpose
Future report generation module.

### Current State
Placeholder page with:
- "Coming Soon" message
- Feature preview cards (Daily, Weekly, Monthly reports)
- No functional implementation

---

## Simulation (`/simulation`)

### Purpose
Control panel for the data simulator.

### Components

1. **Controls Panel**
   - Start/Stop toggle button (green/red)
   - Reset button
   - Running status indicator with pulse animation

2. **Configuration Panel**
   - Tick Interval slider (20-500ms)
   - Speed Multiplier slider (0.1x-10x)
   - Fault Injection toggle switch

3. **Information Panel**
   - Description of the simulation engine
   - Note about future backend integration

---

## Settings (`/settings`)

### Purpose
Application configuration and about information.

### Components

1. **Settings Groups** (2-column grid)
   - Display: Theme, sidebar, chart preferences
   - Notifications: Alarm notification toggles
   - Telemetry: Polling interval, history buffer, precision
   - Theme: Accent color, status colors, animation speed

2. **About Section**
   - Version info
   - Technology stack
   - Description

### Current State
Read-only display. Controls are visual only — no functional settings persistence.
