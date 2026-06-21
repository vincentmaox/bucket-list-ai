import * as React from "react";
import { cn } from "@/lib/utils";

type CoordinateGridProps = {
  className?: string;
  showScan?: boolean;
  cell?: number;
};

export function CoordinateGrid({
  className,
  showScan = true,
  cell = 80,
}: CoordinateGridProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        className="opacity-[0.55]"
      >
        <defs>
          <pattern
            id="coord-grid"
            width={cell}
            height={cell}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${cell} 0 L 0 0 0 ${cell}`}
              fill="none"
              stroke="rgba(127, 255, 212, 0.06)"
              strokeWidth="0.5"
            />
            <circle cx="0" cy="0" r="1" fill="rgba(255, 181, 71, 0.35)" />
          </pattern>
          <radialGradient id="grid-fade" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="60%" stopColor="#000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#coord-grid)" />
        <rect width="100%" height="100%" fill="url(#grid-fade)" />

        {/* 中心十字标 */}
        <g className="opacity-40">
          <line
            x1="50%"
            y1="calc(50% - 16px)"
            x2="50%"
            y2="calc(50% - 4px)"
            stroke="rgba(255, 181, 71, 0.6)"
            strokeWidth="1"
          />
          <line
            x1="50%"
            y1="calc(50% + 4px)"
            x2="50%"
            y2="calc(50% + 16px)"
            stroke="rgba(255, 181, 71, 0.6)"
            strokeWidth="1"
          />
          <line
            x1="calc(50% - 16px)"
            y1="50%"
            x2="calc(50% - 4px)"
            y2="50%"
            stroke="rgba(255, 181, 71, 0.6)"
            strokeWidth="1"
          />
          <line
            x1="calc(50% + 4px)"
            y1="50%"
            x2="calc(50% + 16px)"
            y2="50%"
            stroke="rgba(255, 181, 71, 0.6)"
            strokeWidth="1"
          />
        </g>
      </svg>

      {/* 角落坐标标记 */}
      <CornerMark position="top-left" />
      <CornerMark position="top-right" />
      <CornerMark position="bottom-left" />
      <CornerMark position="bottom-right" />

      {/* 扫描线 */}
      {showScan && (
        <div className="absolute inset-x-0 animate-scan-line">
          <div className="h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent" />
          <div className="h-12 bg-gradient-to-b from-amber/10 to-transparent" />
        </div>
      )}
    </div>
  );
}

function CornerMark({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const positions: Record<typeof position, string> = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };
  return (
    <div
      className={`absolute ${positions[position]} font-mono text-[10px] text-aurora/40 tracking-wider`}
    >
      {position === "top-left" && "N 39°54'\nE 116°23'"}
      {position === "top-right" && "T+0:00:00\n[REC]"}
      {position === "bottom-left" && "SIG · LOCK\n42.7Hz"}
      {position === "bottom-right" && "v0.1.0-alpha\nvoid.architect"}
    </div>
  );
}
