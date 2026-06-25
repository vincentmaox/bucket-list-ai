"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, RefreshCw, AlertCircle, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard, GlowText } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { WishCard } from "@/components/wishes/wish-card";
import { useUserStore } from "@/lib/store/user-store";
import { useWishesStore } from "@/lib/store/wishes-store";
import { calcLife } from "@/lib/life-expectancy";
import { fetchRecommendation as requestRecommendation } from "@/lib/ai/client";
import type { RecommendationResponse } from "@/lib/types/wish";

export default function WishesPage() {
  const profile = useUserStore((s) => s.profile);
  const setWishesData = useWishesStore((s) => s.setData);
  const persistedWishes = useWishesStore((s) => s.data);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RecommendationResponse | null>(null);

  useEffect(() => {
    setMounted(true);
    if (persistedWishes) {
      setData(persistedWishes);
    }
  }, [persistedWishes]);

  const hasProfile = mounted && profile.onboardingCompletedAt && profile.birthDate && profile.country;

  async function fetchRecommendation() {
    if (!profile.birthDate || !profile.country) return;
    setLoading(true);
    setError(null);
    try {
      const life = calcLife(
        new Date(profile.birthDate),
        profile.country,
        profile.gender
      );
      const json = await requestRecommendation({
        profile: {
          birthDate: profile.birthDate,
          gender: profile.gender,
          bloodType: profile.bloodType,
          mbti: profile.mbti,
          annualIncome: profile.annualIncome,
          country: profile.country,
        },
        life: {
          age: life.age,
          remainingWeeks: life.remainingWeeks,
          remainingYears: life.remainingWeeks / 52.1775,
          lifeExpectancy: life.lifeExpectancy,
        },
      });
      setData(json);
      setWishesData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "未知错误");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasProfile && !data && !loading) {
      fetchRecommendation();
    }
  }, [hasProfile]);

  if (!mounted) {
    return (
      <AppShell>
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <Skeleton className="h-12 w-64 mb-6" />
          <Skeleton className="h-32 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </section>
      </AppShell>
    );
  }

  if (!hasProfile) {
    return (
      <AppShell>
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
          <GlassCard strong className="p-10">
            <div className="inline-flex items-center justify-center rounded-2xl border-glow-amber bg-amber/10 p-4 mb-6">
              <Sparkles className="h-8 w-8 text-amber" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
              <span className="text-starlight">先让老赫</span>{" "}
              <GlowText variant="amber" className="text-amber">认识你</GlowText>
            </h1>
            <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
              AI 推荐需要你的性格画像（MBTI + 星座 + 生肖 + 收入）才能生成只属于你的清单。
              1 分钟搞定，数据只在你的浏览器。
            </p>
            <Button
              size="lg"
              nativeButton={false}
              className="gradient-aurora text-background font-semibold"
              render={<Link href="/onboarding" />}
            >
              <Sparkles className="h-4 w-4" />
              开始引导
              <ArrowRight className="h-4 w-4" />
            </Button>
          </GlassCard>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <Badge
              variant="outline"
              className="glass-panel text-aurora border-aurora/30 mb-3"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {data?.source === "ai" ? `AI 推荐 · ${data.model}` : "Mock 数据 · 接入 API key 后启用真 AI"}
            </Badge>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold">
              <span className="text-starlight">老赫给你的</span>
              <br />
              <GlowText variant="amber" className="text-amber">
                人生清单
              </GlowText>
            </h1>
            {data?.summary && (
              <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed">
                {data.summary}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            onClick={fetchRecommendation}
            disabled={loading}
            className="glass-panel border-white/15 hover:border-amber/40"
          >
            <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            {loading ? "AI 思考中..." : "重新生成"}
          </Button>
        </div>

        {error && (
          <GlassCard className="p-4 mb-6 border-destructive/40">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>生成失败：{error}</span>
              <Button size="sm" variant="ghost" onClick={fetchRecommendation} className="ml-auto">
                重试
              </Button>
            </div>
          </GlassCard>
        )}

        {loading && !data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        )}

        {data && data.wishes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {data.wishes.map((wish) => (
              <WishCard key={wish.id} wish={wish} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
