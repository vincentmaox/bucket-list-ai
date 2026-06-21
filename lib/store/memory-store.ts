"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Memory } from "@/lib/types/memory";

type MemoryStore = {
  memories: Memory[];
  addMemory: (m: Omit<Memory, "id" | "capturedAt">) => Memory;
  removeMemory: (id: string) => void;
  clearAll: () => void;
};

export const useMemoryStore = create<MemoryStore>()(
  persist(
    (set) => ({
      memories: [],
      addMemory: (input) => {
        const memory: Memory = {
          ...input,
          id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          capturedAt: new Date().toISOString(),
        };
        set((state) => ({ memories: [memory, ...state.memories] }));
        return memory;
      },
      removeMemory: (id) =>
        set((state) => ({
          memories: state.memories.filter((m) => m.id !== id),
        })),
      clearAll: () => set({ memories: [] }),
    }),
    {
      name: "bucket-list-ai-memories",
      version: 1,
    }
  )
);
