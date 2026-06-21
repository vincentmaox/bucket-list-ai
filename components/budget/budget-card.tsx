"use client";

import { useState } from "react";
import { Calendar, Clock, Wallet, Check } from "lucide-react";
import { GlassCard } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatMoney, formatDateCN, type WishBudget } from "@/lib/budget";

type Props = {
  data: WishBudget;
  onSavedChange: (wishId: string, amount: number) => void;
};

export function BudgetCard({ data, onSavedChange }: Props) {
  const { wish, target, saved, remaining, progress, monthlyShare, estimatedDate } = data;
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(saved ? String(saved) : "");

  const isDone = progress >= 100;

  function commitSave() {
    const n = Number(inputValue) || 0;
    onSavedChange(wish.id, n);
    setEditing(false);
  }

  return (
    <GlassCard
      interactive
      glow={isDone ? "aurora" : "none"}
      className="p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px]",
                isDone ? "border-aurora/40 text-aurora" : "border-amber/40 text-amber"
              )}
            >
              {wish.category}
            </Badge>
            {isDone && (
              <Badge variant="outline" className="text-[10px] border-aurora/40 text-aurora">
                <Check className="h-2.5 w-2.5 mr-0.5" />
                已攒齐
              </Badge>
            )}
          </div>
          <h3 className="font-serif text-base sm:text-lg font-semibold leading-snug text-starlight">
            {wish.title}
          </h3>
        </div>
        <div className="text-right">
          <div className={cn(
            "text-2xl font-mono font-bold",
            isDone ? "text-aurora text-glow-aurora" : "text-amber"
          )}>
            {Math.round(progress)}%
          </div>
          <div className="text-[10px] text-muted-foreground">进度</div>
        </div>
      </div>

      <Progress
        value={progress}
        className="h-1.5 mb-3 bg-white/5 progress-aurora"
      />

      <div className="grid grid-cols-3 gap-2 text-xs mb-3">
        <div>
          <div className="text-[10px] text-muted-foreground">目标</div>
          <div className="font-mono text-starlight">{formatMoney(target)}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">已攒</div>
          <div className={cn(
            "font-mono",
            saved > 0 ? "text-amber" : "text-muted-foreground"
          )}>
            {saved > 0 ? formatMoney(saved) : "—"}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">还差</div>
          <div className="font-mono text-amber">
            {remaining > 0 ? formatMoney(remaining) : "✓"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Wallet className="h-3 w-3 text-amber" />
            月供 {formatMoney(monthlyShare)}
          </span>
          {estimatedDate && remaining > 0 && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-aurora" />
              {formatDateCN(estimatedDate)}
            </span>
          )}
        </div>

        {editing ? (
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              inputMode="numeric"
              placeholder={String(target)}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-7 w-24 text-xs glass-panel border-amber/30 font-mono"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") commitSave();
                if (e.key === "Escape") setEditing(false);
              }}
            />
            <Button
              size="sm"
              onClick={commitSave}
              className="h-7 px-2 text-xs gradient-aurora text-background"
            >
              <Check className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setInputValue(saved ? String(saved) : "");
              setEditing(true);
            }}
            className="h-7 text-xs glass-panel border-white/15 hover:border-amber/40"
          >
            {saved > 0 ? "更新已攒" : "标记已攒"}
          </Button>
        )}
      </div>
    </GlassCard>
  );
}
