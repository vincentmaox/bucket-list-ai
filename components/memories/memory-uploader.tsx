"use client";

import { useState } from "react";
import { ImagePlus, PenLine, Send, X, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMemoryStore } from "@/lib/store/memory-store";
import { useWishesStore } from "@/lib/store/wishes-store";
import { compressImage } from "@/lib/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Wish } from "@/lib/types/wish";

const EMPTY_WISHES: Wish[] = [];

export function MemoryUploader() {
  const addMemory = useMemoryStore((s) => s.addMemory);
  const wishes = useWishesStore((s) => s.data?.wishes ?? EMPTY_WISHES);

  const [photoData, setPhotoData] = useState<string | null>(null);
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoWishId, setPhotoWishId] = useState("");
  const [compressing, setCompressing] = useState(false);
  const [submittingPhoto, setSubmittingPhoto] = useState(false);

  const [textContent, setTextContent] = useState("");
  const [textCaption, setTextCaption] = useState("");
  const [textWishId, setTextWishId] = useState("");
  const [submittingText, setSubmittingText] = useState(false);

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressing(true);
    try {
      const compressed = await compressImage(file);
      setPhotoData(compressed);
    } catch (err) {
      toast(err instanceof Error ? err.message : "压缩失败");
    } finally {
      setCompressing(false);
    }
  }

  async function submitPhoto() {
    if (!photoData) {
      toast("请先选一张照片");
      return;
    }
    setSubmittingPhoto(true);
    await new Promise((r) => setTimeout(r, 400));
    addMemory({
      type: "photo",
      mediaUrl: photoData,
      caption: photoCaption || undefined,
      wishId: photoWishId || undefined,
    });
    setPhotoData(null);
    setPhotoCaption("");
    setPhotoWishId("");
    setSubmittingPhoto(false);
    toast("记录已封存", {
      description: photoCaption || "一张新的人生碎片",
    });
  }

  async function submitText() {
    if (!textContent.trim()) {
      toast("写点什么吧");
      return;
    }
    setSubmittingText(true);
    await new Promise((r) => setTimeout(r, 300));
    addMemory({
      type: "text",
      text: textContent.trim(),
      caption: textCaption || undefined,
      wishId: textWishId || undefined,
    });
    setTextContent("");
    setTextCaption("");
    setTextWishId("");
    setSubmittingText(false);
    toast("记录已封存", {
      description: textCaption || "一段新的人生碎片",
    });
  }

  return (
    <GlassCard strong className="p-5 sm:p-6">
      <Tabs defaultValue="photo">
        <TabsList className="grid w-full grid-cols-2 glass-panel">
          <TabsTrigger value="photo" className="data-[state=active]:text-amber">
            <ImagePlus className="h-3.5 w-3.5 mr-1.5" />
            照片
          </TabsTrigger>
          <TabsTrigger value="text" className="data-[state=active]:text-aurora">
            <PenLine className="h-3.5 w-3.5 mr-1.5" />
            文字
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photo" className="mt-4 space-y-3">
          {photoData ? (
            <div className="relative">
              <img
                src={photoData}
                alt="预览"
                className="w-full max-h-72 object-cover rounded-xl glass-panel"
              />
              <button
                onClick={() => setPhotoData(null)}
                className="absolute top-2 right-2 rounded-full p-1.5 glass-panel-strong hover:text-amber"
                aria-label="移除"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label
              className={cn(
                "flex flex-col items-center justify-center gap-2",
                "h-40 rounded-xl border-2 border-dashed border-white/15",
                "hover:border-amber/50 hover:bg-amber/5 cursor-pointer transition-all",
                compressing && "opacity-50 pointer-events-none"
              )}
            >
              <ImagePlus className="h-8 w-8 text-amber" />
              <span className="text-sm text-muted-foreground">
                {compressing ? "压缩中..." : "点击选一张照片"}
              </span>
              <span className="text-[10px] text-muted-foreground/60 font-mono">
                自动压缩到 800px · ~200KB
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={onPickFile}
                className="hidden"
              />
            </label>
          )}

          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">标题（可选）</Label>
            <Input
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              placeholder="比如：清晨的极光"
              className="glass-panel border-white/15 text-sm"
            />
          </div>

          {wishes.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">关联愿望（可选）</Label>
              <select
                value={photoWishId}
                onChange={(e) => setPhotoWishId(e.target.value)}
                className="w-full glass-panel border border-white/15 rounded-lg px-3 py-2 text-sm bg-transparent"
              >
                <option value="" className="bg-space-deep">不关联</option>
                {wishes.map((w) => (
                  <option key={w.id} value={w.id} className="bg-space-deep">
                    {w.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            onClick={submitPhoto}
            disabled={!photoData || submittingPhoto}
            className="w-full gradient-aurora text-background font-semibold"
          >
            {submittingPhoto ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                封存中...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                封存这张碎片
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="text" className="mt-4 space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">写下此刻</Label>
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="今天明白了什么？感受到了什么？"
              className="glass-panel border-white/15 min-h-[120px] text-sm"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">标题（可选）</Label>
            <Input
              value={textCaption}
              onChange={(e) => setTextCaption(e.target.value)}
              placeholder="比如：35 岁生日那天"
              className="glass-panel border-white/15 text-sm"
            />
          </div>

          {wishes.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">关联愿望（可选）</Label>
              <select
                value={textWishId}
                onChange={(e) => setTextWishId(e.target.value)}
                className="w-full glass-panel border border-white/15 rounded-lg px-3 py-2 text-sm bg-transparent"
              >
                <option value="" className="bg-space-deep">不关联</option>
                {wishes.map((w) => (
                  <option key={w.id} value={w.id} className="bg-space-deep">
                    {w.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            onClick={submitText}
            disabled={!textContent.trim() || submittingText}
            className="w-full gradient-aurora text-background font-semibold"
          >
            {submittingText ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                封存中...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                封存这段心绪
              </>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
}
