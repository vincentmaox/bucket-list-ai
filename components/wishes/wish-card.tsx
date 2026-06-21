"use client";

import { useRouter } from "next/navigation";
import { MapPin, Clock, Wallet, Sparkles, ListChecks, Globe2 } from "lucide-react";
import { GlassCard } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Wish } from "@/lib/types/wish";

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

export function WishCard({ wish }: { wish: Wish }) {
  const router = useRouter();
  const categoryColor = CATEGORY_COLOR[wish.category] ?? "border-white/20";

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
        {wish.prerequisites && wish.prerequisites.length > 0 && (
          <details className="group flex-1">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-amber flex items-center gap-1 list-none">
              <ListChecks className="h-3 w-3" />
              <span>准备 {wish.prerequisites.length}</span>
            </summary>
            <ul className="mt-2 space-y-1 pl-4 absolute z-10 glass-panel-strong rounded-lg p-3 max-w-xs">
              {wish.prerequisites.map((p, i) => (
                <li key={i} className="text-[11px] text-muted-foreground leading-relaxed">
                  · {p}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </GlassCard>
  );
}
