export const ROUTES = {
  DASHBOARD: "/dashboard",
  DIGITAL_TWIN: "/digital-twin",
  MONITORING: "/monitoring",
  HISTORY: "/history",
  ALARMS: "/alarms",
  REPORTS: "/reports",
  SIMULATION: "/simulation",
  SETTINGS: "/settings",
} as const;

export const COMPONENT_IDS = {
  HYDROGEN_TANK: "hydrogen-tank",
  FUEL_CELL: "fuel-cell",
  BATTERY: "battery",
  INVERTER: "inverter",
  MOTOR: "traction-motor",
  WHEELS: "wheels",
} as const;

export const SIMULATOR_CONFIG = {
  TICK_INTERVAL_MS: 100,
  HISTORY_MAX_POINTS: 300,
  ALARM_INTERVAL_MS: 30000,
  ALARM_INTERVAL_VARIANCE: 20000,
} as const;

export const STATUS_LABELS = {
  OPERATIONAL: "Operational",
  WARNING: "Warning",
  CRITICAL: "Critical",
  OFFLINE: "Offline",
  MAINTENANCE: "Maintenance",
} as const;
