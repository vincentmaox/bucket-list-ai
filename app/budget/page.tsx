"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Wallet, Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard, GlowText } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BudgetSummary } from "@/components/budget/budget-summary";
import { BudgetCard } from "@/components/budget/budget-card";
import { useUserStore } from "@/lib/store/user-store";
import { useWishesStore } from "@/lib/store/wishes-store";
import { useBudgetStore } from "@/lib/store/budget-store";
import {
  calcBudgetSummary,
  calcWishBudget,
  type WishBudget,
} from "@/lib/budget";

export default function BudgetPage() {
  const profile = useUserStore((s) => s.profile);
  const wishesData = useWishesStore((s) => s.data);
  const savedByWish = useBudgetStore((s) => s.savedByWish);
  const disposableRatio = useBudgetStore((s) => s.disposableRatio);
  const setSaved = useBudgetStore((s) => s.setSaved);
  const setRatio = useBudgetStore((s) => s.setDisposableRatio);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const hasProfile = mounted && profile.onboardingCompletedAt;
  const hasWishes = mounted && !!wishesData?.wishes.length;
  const annualIncome = profile.annualIncome ?? 0;

  const summary = useMemo(() => {
    if (!hasWishes || annualIncome <= 0) return null;
    const wishes = wishesData!.wishes;
    return calcBudgetSummary(
      annualIncome,
      disposableRatio,
      wishes,
      savedByWish
    );
  }, [hasWishes, annualIncome, disposableRatio, wishesData, savedByWish]);

  const wishBudgets: WishBudget[] = useMemo(() => {
    if (!hasWishes || !summary) return [];
    const wishes = wishesData!.wishes.filter((w) => w.estimatedCost);
    const perWish =
      summary.monthlyDisposable / Math.max(1, wishes.length);
    return wishes
      .map((w) =>
        calcWishBudget(w, savedByWish[w.id] ?? 0, perWish)
      )
      .sort((a, b) => b.progress - a.progress);
  }, [hasWishes, summary, wishesData, savedByWish]);

  if (!mounted) {
    return (
      <AppShell>
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="h-48 glass-panel-strong rounded-2xl animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 glass-panel rounded-2xl animate-pulse" />
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
              <Wallet className="h-8 w-8 text-amber" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
              <span className="text-starlight">先让老赫</span>{" "}
              <GlowText variant="amber" className="text-amber">认识你</GlowText>
            </h1>
            <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
              资金账本需要你的年收入数据才能算出攒钱节奏。1 分钟搞定，数据只在你的浏览器。
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

  if (!hasWishes) {
    return (
      <AppShell>
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
          <GlassCard strong className="p-10">
            <div className="inline-flex items-center justify-center rounded-2xl border-glow-aurora bg-aurora/10 p-4 mb-6">
              <Sparkles className="h-8 w-8 text-aurora" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
              <span className="text-starlight">先让 AI</span>{" "}
              <GlowText variant="amber" className="text-amber">给你推荐清单</GlowText>
            </h1>
            <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
              账本基于你的愿望清单计算攒钱节奏。
            </p>
            <Button
              size="lg"
              nativeButton={false}
              className="gradient-aurora text-background font-semibold"
              render={<Link href="/wishes" />}
            >
              <Sparkles className="h-4 w-4" />
              去看清单
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
        <div className="mb-6">
          <Badge
            variant="outline"
            className="glass-panel text-aurora border-aurora/30 mb-3"
          >
            <Wallet className="h-3 w-3 mr-1" />
            资金账本 · 让梦想可落地
          </Badge>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            <span className="text-starlight">把梦想</span>{" "}
            <GlowText variant="amber" className="text-amber">
              翻译成月供
            </GlowText>
          </h1>
        </div>

        {summary && (
          <div className="mb-8">
            <BudgetSummary summary={summary} onRatioChange={setRatio} />
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-starlight">
            愿望资金分配
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            按进度排序 · 共 {wishBudgets.length} 个
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishBudgets.map((wb) => (
            <BudgetCard
              key={wb.wish.id}
              data={wb}
              onSavedChange={setSaved}
            />
          ))}
        </div>

        <GlassCard className="mt-8 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-aurora mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-starlight font-medium">老赫的计算逻辑：</span>
              <br />
              月可支配 = 年收入 / 12 × 可支配比例；每个愿望平摊月供 = 月可支配 / 愿望数；
              达成日期 = 从今天起按月供攒到目标金额。所有数据仅存于你浏览器。
            </div>
          </div>
        </GlassCard>
      </section>
    </AppShell>
  );
}
