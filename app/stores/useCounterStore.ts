// stores/useCounterStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CounterState {
  items: any[];
  addItem: (newItem: any) => void;
  removeItem: (id: any) => void;
  clearItems: () => void;
}

export const useCounterStore = create<CounterState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (newItem) =>
        set((state) => ({
          items: [...state.items, newItem],
        })),

      // Use .filter() to create a new array without the target item
      removeItem: (id) =>
        set((state) => {
          const items = [...state.items];

          const index = items.findIndex((item) => item._id === id);

          if (index !== -1) {
            items.splice(index, 1);
          }

          return { items };
        }),

      clearItems: () => set({ items: [] }),
    }),
    
    {
      name: "counter-storage",
    },
  ),
);
