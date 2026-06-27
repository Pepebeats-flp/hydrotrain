# Train Subsystems (Components)

## 1. Hydrogen Tank

| Property | Description |
|---|---|
| **ID** | `hydrogen-tank` |
| **Type** | Type IV composite tank |
| **Capacity** | 35 kg H₂ at 700 bar |
| **Working Pressure** | 700 bar |

### Variables

| Variable | Range | Unit |
|---|---|---|
| Temperature | -40 to 85 | °C |
| Pressure | 0 to 700 | bar |
| Level | 0 to 100 | % |
| Flow Rate | 0 to 2 | kg/h |
| Remaining | 0 to 35 | kg |

### States

| State | Condition |
|---|---|
| Operational | Pressure > 50 bar |
| Warning | Pressure 20-50 bar or Level < 20% |
| Critical | Pressure < 20 bar |

### Alarms

| Alarm | Condition |
|---|---|
| Low Pressure | Pressure < 50 bar |
| Empty | Level < 5% |
| Leak Detected | Pressure drop rate exceeds threshold |

---

## 2. Fuel Cell

| Property | Description |
|---|---|
| **ID** | `fuel-cell` |
| **Type** | PEM Fuel Cell |
| **Power** | 280 kW max |
| **Efficiency** | 45-62% |

### Variables

| Variable | Range | Unit |
|---|---|---|
| Stack Temperature | 55 to 70 | °C |
| Coolant Temperature | 40 to 65 | °C |
| Output Voltage | 400 to 600 | V |
| Output Current | 0 to 600 | A |
| H₂ Consumption | 0 to 0.5 | kg/h |
| Power Output | 0 to 280 | kW |
| Efficiency | 30 to 70 | % |

### States

| State | Condition |
|---|---|
| Operational | Temp 55-65°C, Normal operation |
| Warning | Temp 65-70°C |
| Critical | Temp > 70°C |

### Alarms

| Alarm | Condition |
|---|---|
| Overtemperature | Temp > 68°C |
| Low Efficiency | Efficiency < 40% |
| Stack Degradation | Health < 60% |

### Future Sensors

- Individual cell voltage monitoring
- Membrane humidity sensors
- Hydrogen leak detectors
- Air compressor status

---

## 3. Battery

| Property | Description |
|---|---|
| **ID** | `battery` |
| **Type** | Li-ion NMC |
| **Nominal Voltage** | 650 V |
| **Capacity** | 100 kWh |

### Variables

| Variable | Range | Unit |
|---|---|---|
| State of Charge | 5 to 100 | % |
| State of Health | 40 to 100 | % |
| Temperature | 15 to 60 | °C |
| Terminal Voltage | 500 to 750 | V |
| Current | -150 to 150 | kW (power) |
| Cell Voltage Min | 3.0 to 4.2 | V |
| Cell Voltage Max | 3.0 to 4.2 | V |
| Cycles Completed | 0 to 5000 | |

### States

| State | Condition |
|---|---|
| Charging | Power > 10 kW |
| Discharging | Power < -10 kW |
| Idle | Power -10 to 10 kW |
| Critical | SOC < 10% or Temp > 55°C |

### Alarms

| Alarm | Condition |
|---|---|
| Low SOC | SOC < 15% |
| High Temperature | Temp > 55°C |
| Cell Imbalance | Cell voltage delta > 0.3V |

### Future Sensors

- Individual cell temperature monitoring
- Cooling system flow rate
- Insulation resistance

---

## 4. Inverter

| Property | Description |
|---|---|
| **ID** | `inverter` |
| **Type** | IGBT-based VFD |
| **Switching Freq** | 2-8 kHz |

### Variables

| Variable | Range | Unit |
|---|---|---|
| Temperature | 15 to 90 | °C |
| Input Voltage | 500 to 750 | V |
| Output Voltage | 0 to 650 | V |
| Input Current | 0 to 500 | A |
| Output Current | 0 to 500 | A |
| Switching Frequency | 2 to 8 | kHz |
| Modulation Index | 0 to 1 | |

### States

| State | Condition |
|---|---|
| Operational | Temp < 75°C |
| Warning | Temp 75-85°C |
| Critical | Temp > 85°C or fault detected |

### Alarms

| Alarm | Condition |
|---|---|
| Overtemperature | Temp > 80°C |
| Overcurrent | Current exceeds threshold |
| DC Bus Fault | Voltage out of range |

---

## 5. Traction Motor

| Property | Description |
|---|---|
| **ID** | `traction-motor` |
| **Type** | Permanent Magnet Synchronous |
| **Max Power** | 300 kW |
| **Max Torque** | 800 N·m |
| **Max RPM** | 6000 |

### Variables

| Variable | Range | Unit |
|---|---|---|
| RPM | 0 to 6000 | rpm |
| Torque | 0 to 800 | N·m |
| Mechanical Power | 0 to 300 | kW |
| Stator Temperature | 25 to 130 | °C |
| Winding Temperature | 25 to 140 | °C |
| Vibration | 0 to 20 | mm/s |

### States

| State | Condition |
|---|---|
| Stopped | RPM = 0 |
| Accelerating | RPM increasing |
| Cruising | RPM stable, Torque < 100 N·m |
| Full Power | RPM > 4000 or Torque > 600 N·m |
| Critical | Temp > 120°C or Vibration > 15 mm/s |

### Alarms

| Alarm | Condition |
|---|---|
| Overtemperature | Stator > 120°C |
| Over-RPM | RPM > 6000 |
| Excessive Vibration | Vibration > 15 mm/s |
| Bearing Wear | Vibration pattern indicates bearing fault |

### Future Sensors

- Bearing temperature sensors
- Phase current sensors
- Rotor position encoder
- Cooling system sensors

---

## 6. Wheels

| Property | Description |
|---|---|
| **ID** | `wheels` |
| **Type** | Rail wheelset |

### Variables

| Variable | Range | Unit |
|---|---|---|
| Speed | 0 to 160 | km/h |
| Traction Force | 0 to 100 | kN |
| Wheel Slip | 0 to 0.15 | ratio |
| Brake Temperature | 20 to 200 | °C |
| Distance Traveled | 0 to ∞ | m |

### States

| State | Condition |
|---|---|
| Stationary | Speed = 0 |
| Normal Operation | Speed > 0, Slip < 0.05 |
| Slipping | Slip > 0.08 |
| Braking | Brake temp increasing |

### Alarms

| Alarm | Condition |
|---|---|
| Excessive Slip | Slip > 0.10 |
| Brake Overtemperature | Brake temp > 150°C |
| Wheel Flat | Vibration pattern |
