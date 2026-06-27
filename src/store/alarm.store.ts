import { create } from "zustand";
import type { Alarm } from "@/shared/types";
import { alarmService } from "@/services/alarm.service";

interface AlarmStore {
  alarms: Alarm[];
  filter: { severity: string; acknowledged: string };
  unreadCount: number;
  initialize: () => () => void;
  acknowledge: (id: string) => void;
  resolve: (id: string) => void;
  clearAll: () => void;
  setFilter: (filter: { severity: string; acknowledged: string }) => void;
  getFilteredAlarms: () => Alarm[];
}

export const useAlarmStore = create<AlarmStore>((set, get) => ({
  alarms: [],
  filter: { severity: "all", acknowledged: "all" },
  unreadCount: 0,
  initialize: () => {
    const unsub = alarmService.subscribe((alarm) => {
      set((state) => ({
        alarms: [alarm, ...state.alarms],
        unreadCount: state.unreadCount + 1,
      }));
    });
    return unsub;
  },
  acknowledge: (id: string) => {
    alarmService.acknowledgeAlarm(id);
    set((state) => ({
      alarms: state.alarms.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    }));
  },
  resolve: (id: string) => {
    alarmService.resolveAlarm(id);
    set((state) => ({
      alarms: state.alarms.map((a) =>
        a.id === id ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a,
      ),
    }));
  },
  clearAll: () => {
    alarmService.clearAlarms();
    set({ alarms: [], unreadCount: 0 });
  },
  setFilter: (filter) => set({ filter }),
  getFilteredAlarms: () => {
    const { alarms, filter } = get();
    return alarms.filter((a) => {
      if (filter.severity !== "all" && a.severity !== filter.severity) return false;
      if (filter.acknowledged === "unacknowledged" && a.acknowledged) return false;
      if (filter.acknowledged === "acknowledged" && !a.acknowledged) return false;
      return true;
    });
  },
}));
