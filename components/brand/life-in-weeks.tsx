"use client";

import { useMemo } from "react";
import { GlassCard } from "@/components/brand";
import { cn } from "@/lib/utils";

type LifeInWeeksProps = {
  ageWeeks: number;
  totalWeeks: number;
  className?: string;
  compact?: boolean;
};

const WEEKS_PER_ROW = 52;
const DOT_R = 1.8;
const GAP = 2.2;
const STEP = DOT_R * 2 + GAP;

export function LifeInWeeks({
  ageWeeks,
  totalWeeks,
  className,
  compact = false,
}: LifeInWeeksProps) {
  const rows = Math.ceil(totalWeeks / WEEKS_PER_ROW);
  const width = WEEKS_PER_ROW * STEP;
  const height = rows * STEP;

  const points = useMemo(() => {
    const arr: {
      idx: number;
      col: number;
      row: number;
      isLived: boolean;
      isCurrent: boolean;
    }[] = [];
    for (let i = 0; i < totalWeeks; i++) {
      arr.push({
        idx: i,
        col: i % WEEKS_PER_ROW,
        row: Math.floor(i / WEEKS_PER_ROW),
        isLived: i < ageWeeks,
        isCurrent: i === ageWeeks,
      });
    }
    return arr;
  }, [ageWeeks, totalWeeks]);

  return (
    <GlassCard
      strong
      className={cn("p-5 sm:p-8 overflow-hidden", className)}
    >
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold mb-1">
            <span className="text-starlight">你的人生</span>{" "}
            <span className="text-amber text-glow-amber">在周点阵里</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            每个点是一周。已度过的化为暗灰，剩下的还在发光。
          </p>
        </div>
        <div className="flex gap-3 text-[11px] font-mono">
          <div>
            <div className="text-amber text-glow-amber text-base">
              {totalWeeks.toLocaleString("en-US")}
            </div>
            <div className="text-muted-foreground">总周数</div>
          </div>
          <div>
            <div className="text-muted-foreground text-base">
              {ageWeeks.toLocaleString("en-US")}
            </div>
            <div className="text-muted-foreground">已度过</div>
          </div>
          <div>
            <div className="text-aurora text-base">
              {(totalWeeks - ageWeeks).toLocaleString("en-US")}
            </div>
            <div className="text-muted-foreground">剩余</div>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`-2 -2 ${width + 4} ${height + 4}`}
          className="w-full"
          style={{ minWidth: compact ? 320 : 600 }}
        >
          {points.map((p) => {
            const cx = p.col * STEP + DOT_R + GAP / 2;
            const cy = p.row * STEP + DOT_R + GAP / 2;
            if (p.isCurrent) {
              return (
                <g key={p.idx}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={DOT_R + 2.5}
                    fill="none"
                    stroke="#FFB547"
                    strokeWidth={0.5}
                    opacity={0.5}
                  >
                    <animate
                      attributeName="r"
                      values={`${DOT_R + 1};${DOT_R + 4};${DOT_R + 1}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.8;0.2;0.8"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx={cx} cy={cy} r={DOT_R + 0.5} fill="#FFB547" />
                </g>
              );
            }
            if (p.isLived) {
              return (
                <circle
                  key={p.idx}
                  cx={cx}
                  cy={cy}
                  r={DOT_R}
                  fill="rgba(255, 255, 255, 0.10)"
                />
              );
            }
            const remaining = totalWeeks - ageWeeks;
            const tailIdx = p.idx - ageWeeks;
            const intensity = Math.max(0.25, 1 - tailIdx / Math.max(remaining, 1) * 0.6);
            return (
              <circle
                key={p.idx}
                cx={cx}
                cy={cy}
                r={DOT_R}
                fill="#FFB547"
                opacity={intensity}
              />
            );
          })}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-white/10" />
            已度过
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-amber shadow-[0_0_6px_#FFB547]" />
            剩余可活
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-amber animate-pulse" />
            本周
          </span>
        </div>
        <span className="text-muted-foreground/60">
          一行 = 一年（52 周）· 你还能活约 {Math.floor((totalWeeks - ageWeeks) / 52)} 行
        </span>
      </div>
    </GlassCard>
  );
}
