"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishPreparation } from "@/lib/types/wish";

export type PrepDimension = "behavior" | "skill" | "culture";

export type PrepKey = `${string}.${PrepDimension}.${number}`;

function buildKey(wishId: string, dim: PrepDimension, idx: number): PrepKey {
  return `${wishId}.${dim}.${idx}`;
}

type DimensionProgress = { done: number; total: number; pct: number };
export type WishProgress = {
  behavior: DimensionProgress;
  skill: DimensionProgress;
  culture: DimensionProgress;
  done: number;
  total: number;
  pct: number;
};

type PreparationProgressStore = {
  done: Record<string, boolean>;
  toggle: (wishId: string, dim: PrepDimension, idx: number) => void;
  isDone: (wishId: string, dim: PrepDimension, idx: number) => boolean;
  getDimensionProgress: (
    wishId: string,
    dim: PrepDimension,
    items: string[]
  ) => DimensionProgress;
  getWishProgress: (
    wishId: string,
    prep: WishPreparation | undefined
  ) => WishProgress;
  resetWish: (wishId: string) => void;
  reset: () => void;
};

const ZERO_DIM: DimensionProgress = { done: 0, total: 0, pct: 0 };

function computeDim(
  doneMap: Record<string, boolean>,
  wishId: string,
  dim: PrepDimension,
  items: string[]
): DimensionProgress {
  if (!items || items.length === 0) return ZERO_DIM;
  let done = 0;
  for (let i = 0; i < items.length; i++) {
    if (doneMap[buildKey(wishId, dim, i)]) done++;
  }
  return {
    done,
    total: items.length,
    pct: Math.round((done / items.length) * 100),
  };
}

export const usePreparationProgressStore = create<PreparationProgressStore>()(
  persist(
    (set, get) => ({
      done: {},
      toggle: (wishId, dim, idx) => {
        const key = buildKey(wishId, dim, idx);
        set((state) => {
          const next = { ...state.done, [key]: !state.done[key] };
          if (!next[key]) delete next[key];
          return { done: next };
        });
      },
      isDone: (wishId, dim, idx) => !!get().done[buildKey(wishId, dim, idx)],
      getDimensionProgress: (wishId, dim, items) =>
        computeDim(get().done, wishId, dim, items),
      getWishProgress: (wishId, prep) => {
        if (!prep) {
          return {
            behavior: ZERO_DIM,
            skill: ZERO_DIM,
            culture: ZERO_DIM,
            done: 0,
            total: 0,
            pct: 0,
          };
        }
        const behavior = computeDim(get().done, wishId, "behavior", prep.behavior);
        const skill = computeDim(get().done, wishId, "skill", prep.skill);
        const culture = computeDim(get().done, wishId, "culture", prep.culture);
        const done = behavior.done + skill.done + culture.done;
        const total = behavior.total + skill.total + culture.total;
        return {
          behavior,
          skill,
          culture,
          done,
          total,
          pct: total > 0 ? Math.round((done / total) * 100) : 0,
        };
      },
      resetWish: (wishId) => {
        const prefix = `${wishId}.`;
        set((state) => {
          const next: Record<string, boolean> = {};
          for (const k of Object.keys(state.done)) {
            if (!k.startsWith(prefix)) next[k] = state.done[k];
          }
          return { done: next };
        });
      },
      reset: () => set({ done: {} }),
    }),
    {
      name: "bucket-list-ai-prep-progress",
      version: 1,
    }
  )
);
