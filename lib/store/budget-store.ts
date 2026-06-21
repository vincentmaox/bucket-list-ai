"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type BudgetStore = {
  savedByWish: Record<string, number>;
  disposableRatio: number;
  setSaved: (wishId: string, amount: number) => void;
  setDisposableRatio: (ratio: number) => void;
  reset: () => void;
};

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      savedByWish: {},
      disposableRatio: 0.3,
      setSaved: (wishId, amount) =>
        set((state) => ({
          savedByWish: {
            ...state.savedByWish,
            [wishId]: Math.max(0, Math.floor(amount)),
          },
        })),
      setDisposableRatio: (ratio) =>
        set({ disposableRatio: Math.max(0.05, Math.min(0.8, ratio)) }),
      reset: () => set({ savedByWish: {}, disposableRatio: 0.3 }),
    }),
    {
      name: "bucket-list-ai-budget",
      version: 1,
    }
  )
);
