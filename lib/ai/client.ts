"use client";

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/ai/prompt";
import { getMockRecommendation } from "@/lib/ai/mock-data";
import { getZodiacSign } from "@/lib/astro";
import { getChineseZodiac } from "@/lib/zodiac";
import type { RecommendationRequest, RecommendationResponse } from "@/lib/types/wish";

const WISH_SCHEMA = z.object({
  id: z.string(),
  title: z.string().min(5).max(60),
  description: z.string().min(20).max(300),
  category: z.enum([
    "旅行", "体验", "学习", "关系", "创造",
    "健康", "冒险", "灵性", "事业",
  ]),
  reason: z.string().min(20).max(300),
  personalityFitScore: z.number().min(0).max(100),
  estimatedCost: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    currency: z.literal("CNY"),
  }),
  estimatedDuration: z.string(),
  timeWindow: z.string(),
  location: z
    .object({
      name: z.string(),
      country: z.string(),
      countryCode: z.string().optional(),
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  prerequisites: z.array(z.string()).optional(),
});

const RESPONSE_SCHEMA = z.object({
  summary: z.string().min(10).max(400),
  wishes: z.array(WISH_SCHEMA).min(1).max(10),
});

export async function fetchRecommendation(
  req: RecommendationRequest
): Promise<RecommendationResponse> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const baseURL = process.env.NEXT_PUBLIC_OPENAI_BASE_URL;
  const modelName = process.env.NEXT_PUBLIC_OPENAI_MODEL ?? "deepseek-chat";

  if (!apiKey || !baseURL) {
    return getMockRecommendation(req);
  }

  const profileMeta = req.profile.birthDate
    ? (() => {
        const d = new Date(req.profile.birthDate);
        const z = getZodiacSign(d.getMonth() + 1, d.getDate());
        const cz = getChineseZodiac(d.getFullYear());
        return { zodiac: z.sign, zodiacElement: z.element, animal: cz.animal };
      })()
    : {};

  const userPrompt = buildUserPrompt(req, profileMeta);

  try {
    const openai = createOpenAI({
      apiKey,
      baseURL,
    });

    const result = await generateText({
      model: openai.chat(modelName),
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
      temperature: 0.8,
      maxRetries: 2,
    });

    const cleaned = result.text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    const raw = JSON.parse(cleaned);

    const parsed = RESPONSE_SCHEMA.safeParse(raw);
    if (!parsed.success) {
      throw new Error(
        `Schema validation failed: ${parsed.error.issues.slice(0, 3).map((i) => i.path.join(".") + " " + i.message).join("; ")}`
      );
    }

    return {
      wishes: parsed.data.wishes as RecommendationResponse["wishes"],
      summary: parsed.data.summary,
      generatedAt: new Date().toISOString(),
      source: "ai",
      model: modelName,
    };
  } catch (aiErr) {
    console.error("[client-recommend] AI call failed, falling back to mock:", aiErr);
    const mock = getMockRecommendation(req);
    return {
      ...mock,
      summary: `AI 调用失败（${
        aiErr instanceof Error ? aiErr.message.slice(0, 80) : "unknown"
      }），已用兜底数据。请检查 API key / baseURL / model 是否匹配。`,
    };
  }
}
