"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CountryCode } from "@/lib/life-expectancy";

export type MBTIType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export type BloodType = "A" | "B" | "O" | "AB";

export type Gender = "male" | "female";

export type UserProfile = {
  name?: string;
  birthDate?: string;
  gender?: Gender;
  bloodType?: BloodType;
  mbti?: MBTIType;
  annualIncome?: number;
  country?: CountryCode;
  onboardingCompletedAt?: string;
};

type UserStore = {
  profile: UserProfile;
  setProfile: (data: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  reset: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: {},
      setProfile: (data) =>
        set((state) => ({ profile: { ...state.profile, ...data } })),
      completeOnboarding: () =>
        set((state) => ({
          profile: {
            ...state.profile,
            onboardingCompletedAt: new Date().toISOString(),
          },
        })),
      reset: () => set({ profile: {} }),
    }),
    {
      name: "bucket-list-ai-user",
      version: 1,
    }
  )
);
