import { create } from "zustand";
import type { ComponentId, TrainComponent } from "@/shared/types";
import { componentService } from "@/services/component.service";

interface DigitalTwinStore {
  components: TrainComponent[];
  selectedComponentId: ComponentId | null;
  loading: boolean;
  error: string | null;
  selectComponent: (id: ComponentId | null) => void;
  fetchComponents: () => Promise<void>;
}

export const useDigitalTwinStore = create<DigitalTwinStore>((set) => ({
  components: [],
  selectedComponentId: null,
  loading: false,
  error: null,
  selectComponent: (id) => set({ selectedComponentId: id }),
  fetchComponents: async () => {
    set({ loading: true, error: null });
    const response = await componentService.getComponents();
    if (response.success) {
      set({ components: response.data, loading: false });
    } else {
      set({ error: response.error ?? "Unknown error", loading: false });
    }
  },
}));
