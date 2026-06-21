"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RecommendationResponse, Wish } from "@/lib/types/wish";

type WishesStore = {
  data: RecommendationResponse | null;
  byId: Record<string, Wish>;
  setData: (data: RecommendationResponse) => void;
  getWish: (id: string) => Wish | undefined;
  clear: () => void;
};

export const useWishesStore = create<WishesStore>()(
  persist(
    (set, get) => ({
      data: null,
      byId: {},
      setData: (data) => {
        const byId: Record<string, Wish> = {};
        for (const w of data.wishes) {
          byId[w.id] = w;
        }
        set({ data, byId });
      },
      getWish: (id) => get().byId[id],
      clear: () => set({ data: null, byId: {} }),
    }),
    {
      name: "bucket-list-ai-wishes",
      version: 1,
    }
  )
);
