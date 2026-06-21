"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Camera, Sparkles, ArrowRight, Filter, Trash } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard, GlowText } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemoryUploader } from "@/components/memories/memory-uploader";
import { MemoryCard } from "@/components/memories/memory-card";
import { useMemoryStore } from "@/lib/store/memory-store";
import type { MemoryType } from "@/lib/types/memory";
import { cn } from "@/lib/utils";

type Filter = "all" | MemoryType;

export default function MemoriesPage() {
  const memories = useMemoryStore((s) => s.memories);
  const removeMemory = useMemoryStore((s) => s.removeMemory);
  const clearAll = useMemoryStore((s) => s.clearAll);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => setMounted(true), []);

  const filtered = useMemo(() => {
    const sorted = [...memories].sort(
      (a, b) =>
        new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime()
    );
    if (filter === "all") return sorted;
    return sorted.filter((m) => m.type === filter);
  }, [memories, filter]);

  const photoCount = memories.filter((m) => m.type === "photo").length;
  const textCount = memories.filter((m) => m.type === "text").length;

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <Badge
              variant="outline"
              className="glass-panel text-aurora border-aurora/30 mb-3"
            >
              <Camera className="h-3 w-3 mr-1" />
              人生记录 · 把碎片封存成河
            </Badge>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold">
              <span className="text-starlight">你这辈子的</span>{" "}
              <GlowText variant="amber" className="text-amber">
                人生碎片
              </GlowText>
            </h1>
            <p className="text-sm text-muted-foreground mt-3 max-w-xl">
              照片、文字、心情，按时间倒序铺成一条河。
              关联愿望的记录会让清单上的点变成极光绿。
            </p>
          </div>
          {mounted && memories.length > 0 && (
            <div className="flex gap-4">
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-amber text-glow-amber">
                  {photoCount}
                </div>
                <div className="text-xs text-muted-foreground">照片</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-aurora">
                  {textCount}
                </div>
                <div className="text-xs text-muted-foreground">文字</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
          {/* 左：上传 */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <MemoryUploader />
            {mounted && memories.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => {
                  if (confirm("确定要清空所有记录吗？此操作不可撤销。")) {
                    clearAll();
                  }
                }}
                className="mt-3 w-full text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash className="h-3 w-3" />
                清空所有记录
              </Button>
            )}
          </div>

          {/* 右：记录河 */}
          <div>
            {mounted && memories.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                {(["all", "photo", "text"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs transition-all",
                      filter === f
                        ? "glass-panel-strong text-amber"
                        : "glass-panel text-muted-foreground hover:text-starlight"
                    )}
                  >
                    {f === "all" ? "全部" : f === "photo" ? "照片" : "文字"}
                  </button>
                ))}
                <span className="ml-auto text-xs text-muted-foreground font-mono">
                  {filtered.length} 条
                </span>
              </div>
            )}

            {!mounted ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                唤醒记忆中...
              </div>
            ) : memories.length === 0 ? (
              <GlassCard strong className="p-10 text-center">
                <div className="inline-flex items-center justify-center rounded-2xl border-glow-aurora bg-aurora/10 p-4 mb-4">
                  <Camera className="h-8 w-8 text-aurora" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2 text-starlight">
                  还没有记录
                </h3>
                <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
                  去完成第一件事，然后回来封存它。
                  或者随手记录此刻的心绪——这都是你人生的重要碎片。
                </p>
                <Button
                  size="sm"
                  nativeButton={false}
                  variant="outline"
                  className="glass-panel border-amber/30 hover:border-amber/60"
                  render={<Link href="/wishes" />}
                >
                  <Sparkles className="h-3 w-3" />
                  先看愿望清单
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </GlassCard>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                该筛选下没有记录
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 xl:columns-3 gap-4">
                {filtered.map((m) => (
                  <MemoryCard
                    key={m.id}
                    memory={m}
                    onDelete={removeMemory}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
