"use client";

import { Check, Target, Brain, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreparationProgressStore, type PrepDimension } from "@/lib/store/preparation-progress-store";

type PreparationSectionProps = {
  wishId: string;
  dimension: PrepDimension;
  title: string;
  items: string[];
};

const DIM_META: Record<
  PrepDimension,
  { icon: typeof Target; color: "amber" | "aurora" }
> = {
  behavior: { icon: Target, color: "amber" },
  skill: { icon: Brain, color: "aurora" },
  culture: { icon: BookOpen, color: "aurora" },
};

export function PreparationSection({
  wishId,
  dimension,
  title,
  items,
}: PreparationSectionProps) {
  const done = usePreparationProgressStore((s) => s.done);
  const toggle = usePreparationProgressStore((s) => s.toggle);
  const meta = DIM_META[dimension];
  const Icon = meta.icon;
  const colorClass = meta.color === "amber" ? "text-amber" : "text-aurora";
  const borderClass = meta.color === "amber" ? "border-amber/30" : "border-aurora/30";

  if (!items || items.length === 0) return null;

  let doneCount = 0;
  for (let i = 0; i < items.length; i++) {
    if (done[`${wishId}.${dimension}.${i}`]) doneCount++;
  }

  return (
    <div className={cn("rounded-lg border-l-2 pl-3 py-2", borderClass)}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Icon className={cn("h-3.5 w-3.5", colorClass)} />
          <span className="text-xs font-medium text-starlight">{title}</span>
        </div>
        <span className={cn("text-[10px] font-mono", colorClass)}>
          {doneCount}/{items.length}
        </span>
      </div>
      <ul className="space-y-1">
        {items.map((item, idx) => {
          const key = `${wishId}.${dimension}.${idx}`;
          const checked = !!done[key];
          return (
            <li key={idx}>
              <button
                type="button"
                onClick={() => toggle(wishId, dimension, idx)}
                className="w-full text-left flex items-start gap-2 group/item transition-opacity"
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded border shrink-0 transition-all",
                    checked
                      ? meta.color === "amber"
                        ? "bg-amber/20 border-amber text-amber"
                        : "bg-aurora/20 border-aurora text-aurora"
                      : "border-white/20 text-transparent group-hover/item:border-white/40"
                  )}
                >
                  <Check className="h-2.5 w-2.5" />
                </span>
                <span
                  className={cn(
                    "text-[11px] leading-relaxed flex-1 transition-all",
                    checked
                      ? "text-muted-foreground line-through opacity-60"
                      : "text-muted-foreground group-hover/item:text-starlight"
                  )}
                >
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
