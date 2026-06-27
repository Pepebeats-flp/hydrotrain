# Future REST API

> This document describes the planned REST API for the backend service.
> Not yet implemented.

## Base URL

```
https://api.hydrotrain.io/v1
```

## Authentication

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Dashboard

```http
GET /api/dashboard
```

Response:

```json
{
  "success": true,
  "data": {
    "kpis": [
      { "id": "total-power", "label": "Total Power", "value": 175.3, "unit": "kW", "trend": "up", "trendValue": 12.5, "status": "ok" }
    ],
    "systemStatus": "operational",
    "activeAlarms": 2,
    "uptime": 3600,
    "currentPower": 175.3,
    "hydrogenLevel": 72.4,
    "stateOfCharge": 68.2
  }
}
```

### Components

```http
GET /api/components
```

Returns all train components with current metrics.

```http
GET /api/components/:id
```

Returns specific component details.

### Telemetry

```http
GET /api/telemetry
```

Returns current telemetry snapshot.

```http
GET /api/telemetry/:variable
```

Returns specific variable data.

```http
GET /api/telemetry/:variable/history?start=ISO&end=ISO&aggregation=1m
```

Returns historical data for a variable with configurable aggregation.

### Alarms

```http
GET /api/alarms?severity=critical&acknowledged=false
```

Returns filtered alarm list.

```http
PUT /api/alarms/:id/acknowledge
```

Acknowledge an alarm.

```http
PUT /api/alarms/:id/resolve
```

Resolve an alarm.

### History

```http
GET /api/history?variables=power,temperature&start=ISO&end=ISO&aggregation=5m
```

Returns historical data for multiple variables.

### Simulation

```http
POST /api/simulation/start
POST /api/simulation/stop
POST /api/simulation/reset
PUT /api/simulation/config
```

### WebSocket

```http
ws://api.hydrotrain.io/v1/ws?token=<jwt>
```

Push updates for real-time telemetry.

Events:

```json
{ "type": "telemetry", "data": { ... } }
{ "type": "alarm", "data": { ... } }
{ "type": "component_status", "data": { ... } }
```

## Error Response

```json
{
  "success": false,
  "error": "string",
  "code": "ERROR_CODE",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Rate Limiting

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 3600
```

## Status Codes

| Code | Description |
|---|---|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
