"use client";

import { Trash2, Clock, Link2 } from "lucide-react";
import { GlassCard } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpatialPhoto } from "@/components/memories/spatial-photo";
import { useWishesStore } from "@/lib/store/wishes-store";
import type { Memory } from "@/lib/types/memory";

type Props = {
  memory: Memory;
  onDelete: (id: string) => void;
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function MemoryCard({ memory, onDelete }: Props) {
  const wish = useWishesStore((s) =>
    memory.wishId ? s.byId[memory.wishId] : undefined
  );

  return (
    <GlassCard interactive className="p-3 sm:p-4 break-inside-avoid mb-4">
      {memory.type === "photo" && memory.mediaUrl && (
        <div className="mb-3">
          <SpatialPhoto
            src={memory.mediaUrl}
            alt={memory.caption ?? "memory"}
            className="w-full"
          />
        </div>
      )}

      {memory.type === "text" && memory.text && (
        <div className="glass-panel rounded-lg p-4 mb-3 border-l-2 border-aurora/40">
          <p className="text-sm text-starlight leading-relaxed whitespace-pre-wrap">
            {memory.text}
          </p>
        </div>
      )}

      {memory.caption && (
        <div className="text-sm font-medium text-starlight mb-2 leading-snug">
          {memory.caption}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground font-mono">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          {formatTime(memory.capturedAt)}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(memory.id)}
          className="h-6 px-2 text-[11px] text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {wish && (
        <div className="mt-2">
          <Badge variant="outline" className="text-[10px] border-aurora/40 text-aurora">
            <Link2 className="h-2.5 w-2.5 mr-0.5" />
            {wish.title.length > 20 ? wish.title.slice(0, 20) + "..." : wish.title}
          </Badge>
        </div>
      )}
    </GlassCard>
  );
}
