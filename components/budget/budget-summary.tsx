"use client";

import { Wallet, TrendingUp, Calendar, Target } from "lucide-react";
import { GlassCard, GlowText, CountUp } from "@/components/brand";
import { Progress } from "@/components/ui/progress";
import {
  formatMoney,
  formatDateCN,
  type BudgetSummary as Summary,
} from "@/lib/budget";

type Props = {
  summary: Summary;
  onRatioChange: (ratio: number) => void;
};

export function BudgetSummary({ summary, onRatioChange }: Props) {
  const ratioPercent = Math.round(summary.disposableRatio * 100);

  return (
    <GlassCard strong className="p-6 sm:p-8">
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-1">
            <span className="text-starlight">你的弹药库</span>{" "}
            <GlowText variant="amber" className="text-amber">
              总进度
            </GlowText>
          </h2>
          <p className="text-xs text-muted-foreground">
            把模糊的「我想去」变成可执行的月度攒钱节奏。
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl sm:text-5xl font-mono font-bold text-amber text-glow-amber">
            <CountUp target={Math.round(summary.totalProgress)} />%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {formatMoney(summary.totalSaved)} / {formatMoney(summary.totalTarget)}
          </div>
        </div>
      </div>

      <Progress
        value={summary.totalProgress}
        className="h-2 bg-white/5 mb-5 progress-aurora"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard
          icon={Wallet}
          label="月可支配"
          value={formatMoney(summary.monthlyDisposable)}
          sub={`年收入 ${formatMoney(summary.annualIncome)}`}
          color="amber"
        />
        <StatCard
          icon={Target}
          label="总目标"
          value={formatMoney(summary.totalTarget)}
          sub={`${summary.activeWishCount} 个愿望`}
          color="aurora"
        />
        <StatCard
          icon={TrendingUp}
          label="剩余需攒"
          value={formatMoney(summary.totalRemaining)}
          sub={`月供 ${formatMoney(summary.monthlyDisposable)}`}
          color="amber"
        />
        <StatCard
          icon={Calendar}
          label="全部达成"
          value={
            summary.estimatedMonthsAll > 0
              ? `${summary.estimatedMonthsAll} 月`
              : "已达成"
          }
          sub={formatDateCN(summary.estimatedDateAll)}
          color="aurora"
        />
      </div>

      <div className="glass-panel rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-muted-foreground">
            月可支配比例
          </label>
          <span className="font-mono text-amber font-semibold">
            {ratioPercent}%
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={80}
          step={5}
          value={ratioPercent}
          onChange={(e) => onRatioChange(Number(e.target.value) / 100)}
          className="slider-amber w-full cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
          <span>5% 紧巴巴</span>
          <span>30% 健康</span>
          <span>80% 拼命攒</span>
        </div>
      </div>
    </GlassCard>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: "amber" | "aurora";
}) {
  return (
    <div className="glass-panel rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon
          className={
            color === "amber" ? "h-3 w-3 text-amber" : "h-3 w-3 text-aurora"
          }
        />
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
      <div
        className={
          color === "amber"
            ? "text-lg font-mono font-bold text-amber"
            : "text-lg font-mono font-bold text-aurora"
        }
      >
        {value}
      </div>
      {sub && (
        <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
      )}
    </div>
  );
}
