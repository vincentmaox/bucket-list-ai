"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AIProvider } from "@/lib/ai/presets";
import { getPreset } from "@/lib/ai/presets";

export type AISettings = {
  provider: AIProvider;
  baseURL: string;
  model: string;
  apiKey: string;
};

type AISettingsStore = {
  settings: AISettings;
  setProvider: (provider: AIProvider) => void;
  setField: <K extends keyof AISettings>(key: K, value: AISettings[K]) => void;
  reset: () => void;
};

function detectProvider(envBase: string): AIProvider {
  if (envBase.includes("deepseek.com")) return "deepseek";
  if (envBase.includes("volces.com")) return "doubao";
  if (envBase.includes("openai.com")) return "openai";
  if (envBase.includes("dashscope")) return "qwen";
  if (envBase.includes("moonshot")) return "moonshot";
  return "custom";
}

function buildEnvDefaults(): AISettings {
  const envBase = process.env.NEXT_PUBLIC_OPENAI_BASE_URL ?? "";
  const envModel = process.env.NEXT_PUBLIC_OPENAI_MODEL ?? "deepseek-chat";
  const envKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? "";
  return {
    provider: detectProvider(envBase),
    baseURL: envBase,
    model: envModel,
    apiKey: envKey,
  };
}

const ENV_DEFAULTS = buildEnvDefaults();

export const useAISettingsStore = create<AISettingsStore>()(
  persist(
    (set) => ({
      settings: ENV_DEFAULTS,
      setProvider: (provider) => {
        const preset = getPreset(provider);
        set((state) => ({
          settings: {
            ...state.settings,
            provider,
            baseURL: preset.baseURL,
            model: preset.model,
          },
        }));
      },
      setField: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),
      reset: () => set({ settings: ENV_DEFAULTS }),
    }),
    {
      name: "bucket-list-ai-ai-settings",
      version: 1,
    }
  )
);
