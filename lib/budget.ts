import type { Wish } from "@/lib/types/wish";

export type BudgetSummary = {
  annualIncome: number;
  monthlyIncome: number;
  disposableRatio: number;
  monthlyDisposable: number;
  totalSaved: number;
  totalTarget: number;
  totalRemaining: number;
  totalProgress: number;
  activeWishCount: number;
  estimatedMonthsAll: number;
  estimatedDateAll: Date;
};

export type WishBudget = {
  wish: Wish;
  target: number;
  saved: number;
  remaining: number;
  progress: number;
  monthlyShare: number;
  estimatedMonths: number;
  estimatedDate: Date;
};

export function calcBudgetSummary(
  annualIncome: number,
  disposableRatio: number,
  wishes: Wish[],
  savedByWish: Record<string, number>
): BudgetSummary {
  const monthlyIncome = annualIncome / 12;
  const monthlyDisposable = monthlyIncome * disposableRatio;
  const activeWishes = wishes.filter((w) => w.estimatedCost);
  const activeWishCount = activeWishes.length || 1;

  let totalSaved = 0;
  let totalTarget = 0;
  for (const w of activeWishes) {
    const target = avgCost(w);
    totalTarget += target;
    totalSaved += savedByWish[w.id] ?? 0;
  }
  const totalRemaining = Math.max(0, totalTarget - totalSaved);
  const totalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const monthlyAllIn = monthlyDisposable;
  const estimatedMonthsAll =
    totalRemaining > 0 ? Math.ceil(totalRemaining / monthlyAllIn) : 0;
  const estimatedDateAll = new Date();
  estimatedDateAll.setMonth(
    estimatedDateAll.getMonth() + estimatedMonthsAll
  );

  return {
    annualIncome,
    monthlyIncome,
    disposableRatio,
    monthlyDisposable,
    totalSaved,
    totalTarget,
    totalRemaining,
    totalProgress,
    activeWishCount: activeWishes.length,
    estimatedMonthsAll,
    estimatedDateAll,
  };
}

export function calcWishBudget(
  wish: Wish,
  saved: number,
  monthlyShare: number
): WishBudget {
  const target = avgCost(wish);
  const remaining = Math.max(0, target - saved);
  const progress = target > 0 ? Math.min(100, (saved / target) * 100) : 0;
  const estimatedMonths =
    remaining > 0 && monthlyShare > 0 ? Math.ceil(remaining / monthlyShare) : 0;
  const estimatedDate = new Date();
  estimatedDate.setMonth(estimatedDate.getMonth() + estimatedMonths);

  return {
    wish,
    target,
    saved,
    remaining,
    progress,
    monthlyShare,
    estimatedMonths,
    estimatedDate,
  };
}

export function avgCost(wish: Wish): number {
  const { min, max } = wish.estimatedCost;
  return Math.round((min + max) / 2);
}

export function formatMoney(n: number): string {
  if (n >= 10000) {
    return `¥${(n / 10000).toFixed(n >= 100000 ? 0 : 1)}万`;
  }
  return `¥${n.toLocaleString("en-US")}`;
}

export function formatDateCN(d: Date): string {
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;
}
