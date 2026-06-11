import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCounterStore = create(
  persist(
    (set) => ({
      items: [],

      addItem: (item:any) =>
        set((state:any) => {
          const existingItem = state.items.find(
            (product:any) => product._id === item._id
          );

          if (existingItem) {
            return {
              items: state.items.map((product:any) =>
                product._id === item._id ? item : product
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),

      removeItem: (id:any) =>
        set((state:any) => ({
          items: state.items.filter((item:any) => item._id !== id),
        })),

      clearCart: () =>
        set({
          items: [],
        }),
    }),
    {
      name: "counter-storage",
    }
  )
);