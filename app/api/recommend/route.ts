import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/ai/prompt";
import { getMockRecommendation } from "@/lib/ai/mock-data";
import type { RecommendationRequest, RecommendationResponse } from "@/lib/types/wish";

export const runtime = "nodejs";
export const maxDuration = 30;

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
  summary: z.string().min(10).max(300),
  wishes: z.array(WISH_SCHEMA).min(1).max(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RecommendationRequest;
    const life = body.life ?? {
      age: 30,
      remainingWeeks: 2340,
      remainingYears: 45,
      lifeExpectancy: 78,
    };

    const apiKey = process.env.OPENAI_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL;
    const modelName = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

    if (!apiKey || !baseURL) {
      const mock = getMockRecommendation({ ...body, life });
      return NextResponse.json(mock);
    }

    const openai = createOpenAI({ apiKey, baseURL });
    const userPrompt = buildUserPrompt({ ...body, life });

    try {
      const result = await generateObject({
        model: openai(modelName),
        system: SYSTEM_PROMPT,
        prompt: userPrompt,
        schema: RESPONSE_SCHEMA,
        temperature: 0.8,
        maxRetries: 2,
      });

      const response: RecommendationResponse = {
        wishes: result.object.wishes as RecommendationResponse["wishes"],
        summary: result.object.summary,
        generatedAt: new Date().toISOString(),
        source: "ai",
        model: modelName,
      };

      return NextResponse.json(response);
    } catch (aiErr) {
      console.error("[recommend] AI call failed, falling back to mock:", aiErr);
      const mock = getMockRecommendation({ ...body, life });
      return NextResponse.json({
        ...mock,
        summary: `AI 调用失败（${
          aiErr instanceof Error ? aiErr.message.slice(0, 80) : "unknown"
        }），已用兜底数据。请检查 API key / baseURL / model 是否匹配。`,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
