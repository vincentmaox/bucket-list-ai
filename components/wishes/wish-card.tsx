"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Clock, Wallet, Sparkles, ListChecks, Globe2, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Wish } from "@/lib/types/wish";
import { usePreparationProgressStore, type WishProgress } from "@/lib/store/preparation-progress-store";
import { PreparationSection } from "./preparation-section";

const CATEGORY_COLOR: Record<string, string> = {
  旅行: "border-amber/40 text-amber",
  体验: "border-amber/40 text-amber",
  学习: "border-aurora/40 text-aurora",
  关系: "border-aurora/40 text-aurora",
  创造: "border-aurora/40 text-aurora",
  健康: "border-aurora/40 text-aurora",
  冒险: "border-amber/40 text-amber",
  灵性: "border-aurora/40 text-aurora",
  事业: "border-amber/40 text-amber",
};

function fitColor(score: number): string {
  if (score >= 90) return "text-amber text-glow-amber";
  if (score >= 80) return "text-amber";
  if (score >= 70) return "text-aurora";
  return "text-muted-foreground";
}

function countPrepItems(wish: Wish): number {
  if (wish.preparation) {
    return (
      (wish.preparation.behavior?.length ?? 0) +
      (wish.preparation.skill?.length ?? 0) +
      (wish.preparation.culture?.length ?? 0)
    );
  }
  return wish.prerequisites?.length ?? 0;
}

export function WishCard({ wish }: { wish: Wish }) {
  const router = useRouter();
  const [prepOpen, setPrepOpen] = useState(false);
  const categoryColor = CATEGORY_COLOR[wish.category] ?? "border-white/20";
  const prepCount = countPrepItems(wish);
  const hasPrep = prepCount > 0;

  // 实时进度（订阅 store 让 Dialog 打开时也更新）
  const progress = usePreparationProgressStore((s) =>
    s.getWishProgress(wish.id, wish.preparation)
  );

  function viewOnMap() {
    if (wish.location) {
      router.push(`/map?focus=${wish.id}`);
    }
  }

  return (
    <GlassCard interactive glow={wish.personalityFitScore >= 90 ? "amber" : "none"} className="p-5 h-full flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <Badge variant="outline" className={cn("text-xs", categoryColor)}>
          {wish.category}
        </Badge>
        <div className="text-right">
          <div className={cn("text-2xl font-mono font-bold", fitColor(wish.personalityFitScore))}>
            {wish.personalityFitScore}
          </div>
          <div className="text-[10px] text-muted-foreground">契合度</div>
        </div>
      </div>

      <h3 className="font-serif text-lg sm:text-xl font-semibold leading-snug mb-2 text-starlight">
        {wish.title}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">
        {wish.description}
      </p>

      <div className="glass-panel rounded-lg p-2.5 mb-3 border-l-2 border-amber/40">
        <div className="flex items-start gap-1.5">
          <Sparkles className="h-3 w-3 text-amber mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed italic">
            {wish.reason}
          </p>
        </div>
      </div>

      {wish.location && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <MapPin className="h-3 w-3 text-amber" />
          <span>{wish.location.name}</span>
        </div>
      )}

      <div className="mt-auto pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <Wallet className="h-3 w-3 text-amber" />
          <span className="font-mono text-amber">
            ¥{wish.estimatedCost.min.toLocaleString("en-US")}-{wish.estimatedCost.max.toLocaleString("en-US")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-aurora" />
          <span className="text-muted-foreground">{wish.estimatedDuration}</span>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-muted-foreground/80">
        <span className="text-aurora/80">🗓</span> {wish.timeWindow}
      </div>

      <div className="mt-3 flex items-center gap-2">
        {wish.location && (
          <Button
            size="sm"
            variant="outline"
            onClick={viewOnMap}
            className="glass-panel border-amber/30 hover:border-amber/60 hover:text-amber h-7 text-xs"
          >
            <Globe2 className="h-3 w-3" />
            在地球上看看
          </Button>
        )}
        {hasPrep && (
          <Dialog open={prepOpen} onOpenChange={setPrepOpen}>
            <DialogTrigger
              render={
                <Button
                  size="sm"
                  variant="outline"
                  className="glass-panel border-aurora/30 hover:border-aurora/60 hover:text-aurora h-7 text-xs flex-1 relative"
                />
              }
            >
              <ListChecks className="h-3 w-3" />
              准备 {prepCount}
              {progress.total > 0 && (
                <span className="ml-1 text-[10px] font-mono text-aurora">
                  {progress.done}/{progress.total}
                </span>
              )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-lg text-starlight pr-6">
                  准备清单
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {wish.title}
                </DialogDescription>
              </DialogHeader>

              <PreparationDialogBody wish={wish} progress={progress} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </GlassCard>
  );
}

function PreparationDialogBody({
  wish,
  progress,
}: {
  wish: Wish;
  progress: WishProgress;
}) {
  const hasStructured = !!wish.preparation;
  const monthlySave = Math.max(
    1,
    Math.round(wish.estimatedCost.max / 12 / 1000) * 1000
  );
  const saveMonths = Math.max(
    1,
    Math.ceil(wish.estimatedCost.max / monthlySave)
  );

  return (
    <div className="space-y-3">
      {/* 总进度条 */}
      {hasStructured && progress.total > 0 && (
        <div className="glass-panel rounded-lg p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">总进度</span>
            <span className="font-mono text-aurora">
              {progress.done}/{progress.total} · {progress.pct}%
            </span>
          </div>
          <Progress
            value={progress.pct}
            className="h-1.5 bg-white/5 progress-aurora"
          />
        </div>
      )}

      {/* 资金储备（永远展示） */}
      <div className="rounded-lg border-l-2 border-amber/30 pl-3 py-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 text-amber" />
            <span className="text-xs font-medium text-starlight">资金储备</span>
          </div>
          <span className="text-[10px] font-mono text-amber">
            ¥{wish.estimatedCost.min.toLocaleString("en-US")}-{wish.estimatedCost.max.toLocaleString("en-US")}
          </span>
        </div>
        <div className="text-[11px] text-muted-foreground leading-relaxed">
          月存 <span className="text-amber font-mono">¥{monthlySave.toLocaleString("en-US")}</span>
          {" · "}
          储蓄周期约 <span className="text-amber font-mono">{saveMonths}</span> 个月
        </div>
        <Link
          href={`/budget${wish.id ? `?wish=${wish.id}` : ""}`}
          className="text-[10px] text-aurora hover:text-amber transition-colors inline-flex items-center gap-0.5 mt-1"
        >
          前往资金账本跟进
          <ChevronRight className="h-2.5 w-2.5" />
        </Link>
      </div>

      {/* 4 维准备 */}
      {hasStructured ? (
        <>
          <PreparationSection
            wishId={wish.id}
            dimension="behavior"
            title="🎯 行为准备"
            items={wish.preparation!.behavior}
          />
          <PreparationSection
            wishId={wish.id}
            dimension="skill"
            title="🧠 能力准备"
            items={wish.preparation!.skill}
          />
          <PreparationSection
            wishId={wish.id}
            dimension="culture"
            title="📚 文化储备"
            items={wish.preparation!.culture}
          />
        </>
      ) : (
        // 旧 mock 数据兜底：prerequisites 平铺
        wish.prerequisites && wish.prerequisites.length > 0 && (
          <div className="rounded-lg border-l-2 border-aurora/30 pl-3 py-2">
            <div className="text-xs font-medium text-starlight mb-1.5">📌 准备事项</div>
            <ul className="space-y-1.5">
              {wish.prerequisites.map((p, i) => (
                <li key={i} className="text-[11px] text-muted-foreground leading-relaxed">
                  · {p}
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}
