"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Sparkles, Compass } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard, GlowText } from "@/components/brand";
import {
  WorldGlobe,
  type WishPoint,
  type FocusPoint,
} from "@/components/globe/world-globe";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useWishesStore } from "@/lib/store/wishes-store";
import type { Wish } from "@/lib/types/wish";

const DEMO_POINTS: WishPoint[] = [
  { lat: 64.1466, lng: -21.9426, name: "冰岛 · 维克黑沙滩", country: "Iceland", status: "dream", category: "极光", description: "天幕极光，玄武岩柱沉默如远古祭坛。" },
  { lat: 35.0279, lng: 135.7944, name: "京都 · 哲学之道", country: "Japan", status: "done", category: "禅意", description: "2 公里樱隧道，花瓣飘落琵琶湖水。" },
  { lat: 28.0025, lng: 86.8528, name: "尼泊尔 · EBC", country: "Nepal", status: "dream", category: "极限", description: "世界之巅脚下重新校准人生尺度。" },
  { lat: 48.86, lng: 2.3266, name: "巴黎 · 奥赛", country: "France", status: "dream", category: "艺术", description: "莫奈、雷诺阿、德加、梵高原作。" },
  { lat: 39.9042, lng: 116.4074, name: "北京", country: "China", status: "done", category: "故土", description: "重新校准灵魂频率的地方。" },
];

function wishToPoint(w: Wish): WishPoint | null {
  if (!w.location) return null;
  return {
    lat: w.location.lat,
    lng: w.location.lng,
    name: w.location.name,
    country: w.location.country,
    status: "dream",
    category: w.category,
    description: w.description,
    budget: `¥${w.estimatedCost.min.toLocaleString("en-US")}-${w.estimatedCost.max.toLocaleString("en-US")}`,
    wishId: w.id,
  };
}

function MapContent() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get("focus");
  const wishesData = useWishesStore((s) => s.data);
  const getWish = useWishesStore((s) => s.getWish);
  const [selected, setSelected] = useState<WishPoint | null>(null);
  const [focusPoint, setFocusPoint] = useState<FocusPoint | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const points: WishPoint[] = useMemo(() => {
    if (!wishesData?.wishes) return DEMO_POINTS;
    return wishesData.wishes
      .map(wishToPoint)
      .filter((p): p is WishPoint => p !== null);
  }, [wishesData]);

  // URL focus 触发定位
  useEffect(() => {
    if (!focusId || !mounted) return;
    const wish = getWish(focusId);
    if (wish?.location) {
      setFocusPoint({
        lat: wish.location.lat,
        lng: wish.location.lng,
        altitude: 1.2,
      });
      toast(`定位到：${wish.location.name}`, {
        description: wish.title,
      });
    }
  }, [focusId, mounted, getWish]);

  const dreamCount = points.filter((p) => p.status === "dream").length;
  const doneCount = points.filter((p) => p.status === "done").length;
  const isFromAI = !!wishesData?.wishes.length;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <Badge
            variant="outline"
            className="glass-panel text-aurora border-aurora/30 mb-3"
          >
            <MapPin className="h-3 w-3 mr-1" />
            3D 世界地图 · {isFromAI ? "来自你的 AI 推荐" : "示例点位"}
          </Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">
            <span className="text-starlight">想去的地方</span>
            <br />
            <GlowText variant="amber" className="text-amber">
              都在这颗星球上
            </GlowText>
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl">
            琥珀光点是未完成的梦想，极光绿是已抵达的远方。点击任意光点看故事。
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-amber text-glow-amber">
              {dreamCount}
            </div>
            <div className="text-xs text-muted-foreground">想去的</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-aurora text-glow-aurora">
              {doneCount}
            </div>
            <div className="text-xs text-muted-foreground">已完成</div>
          </div>
        </div>
      </div>

      <GlassCard strong className="overflow-hidden p-0">
        {mounted ? (
          <WorldGlobe
            points={points}
            height={620}
            focusPoint={focusPoint}
            onPointClick={(point) => {
              setSelected(point);
              toast(`${point.status === "done" ? "已抵达" : "梦想中"} · ${point.name}`, {
                description: point.category,
              });
            }}
          />
        ) : (
          <Skeleton className="h-[620px] w-full rounded-2xl" />
        )}
      </GlassCard>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-mono">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-amber shadow-[0_0_8px_#FFB547]" />
          想去的地方
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-aurora shadow-[0_0_8px_#7FFFD4]" />
          已完成的愿望
        </span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">拖动旋转 · 滚轮缩放</span>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="glass-panel-strong border-white/15 max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="outline"
                className={
                  selected?.status === "done"
                    ? "border-aurora/40 text-aurora"
                    : "border-amber/40 text-amber"
                }
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {selected?.status === "done" ? "已抵达" : "梦想中"}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                {selected?.country} · {selected?.category}
              </span>
            </div>
            <DialogTitle className="font-serif text-2xl">
              {selected?.name}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed pt-2 text-muted-foreground">
              {selected?.description}
            </DialogDescription>
          </DialogHeader>
          {selected?.budget && (
            <div className="mt-2 flex items-center justify-between rounded-xl glass-panel px-4 py-3">
              <span className="text-xs text-muted-foreground">预估预算</span>
              <span className="font-mono font-semibold text-amber text-glow-amber">
                {selected.budget}
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default function MapPage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-[620px] w-full rounded-2xl" />
          </section>
        }
      >
        <MapContent />
      </Suspense>
    </AppShell>
  );
}
