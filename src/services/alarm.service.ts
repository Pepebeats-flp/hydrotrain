import type { Alarm, ServiceResponse } from "@/shared/types";
import { timestamp } from "@/shared/lib/utils";
import { simulator } from "@/features/simulation/simulator";

class AlarmService {
  private alarms: Alarm[] = [];

  constructor() {
    simulator.onAlarm((alarm) => {
      this.alarms.unshift(alarm);
    });
  }

  async getAlarms(): Promise<ServiceResponse<Alarm[]>> {
    return {
      success: true,
      data: [...this.alarms],
      timestamp: timestamp(),
    };
  }

  async acknowledgeAlarm(alarmId: string): Promise<ServiceResponse<Alarm>> {
    const alarm = this.alarms.find((a) => a.id === alarmId);
    if (alarm) {
      alarm.acknowledged = true;
      return { success: true, data: alarm, timestamp: timestamp() };
    }
    return {
      success: false,
      data: null as unknown as Alarm,
      error: "Alarm not found",
      timestamp: timestamp(),
    };
  }

  async resolveAlarm(alarmId: string): Promise<ServiceResponse<Alarm>> {
    const alarm = this.alarms.find((a) => a.id === alarmId);
    if (alarm) {
      alarm.resolved = true;
      alarm.resolvedAt = timestamp();
      return { success: true, data: alarm, timestamp: timestamp() };
    }
    return {
      success: false,
      data: null as unknown as Alarm,
      error: "Alarm not found",
      timestamp: timestamp(),
    };
  }

  async clearAlarms(): Promise<ServiceResponse<void>> {
    this.alarms = [];
    return { success: true, data: undefined as unknown as void, timestamp: timestamp() };
  }

  subscribe(callback: (alarm: Alarm) => void): () => void {
    return simulator.onAlarm(callback);
  }
}

export const alarmService = new AlarmService();
