"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ConstellationNode = {
  id: string;
  label: string;
  sublabel?: string;
  color: "amber" | "aurora";
  x: number;
  y: number;
};

type ConstellationMapProps = {
  centerValue: string | number;
  centerLabel?: string;
  centerSublabel?: string;
  nodes: ConstellationNode[];
  className?: string;
};

export function ConstellationMap({
  centerValue,
  centerLabel = "WEEKS",
  centerSublabel,
  nodes,
  className,
}: ConstellationMapProps) {
  return (
    <div className={cn("relative w-full aspect-[5/3] max-w-4xl mx-auto", className)}>
      {/* SVG 连线层 */}
      <svg
        viewBox="0 0 500 300"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <radialGradient id="center-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB547" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#FFB547" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFB547" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 中央光晕 */}
        <ellipse cx="250" cy="150" rx="180" ry="100" fill="url(#center-aura)" />

        {/* 连线（虚线流动） */}
        {nodes.map((node, i) => {
          const cx = (node.x / 100) * 500;
          const cy = (node.y / 100) * 300;
          const color = node.color === "amber" ? "#FFB547" : "#7FFFD4";
          return (
            <g key={node.id}>
              <motion.line
                x1={cx}
                y1={cy}
                x2="250"
                y2="150"
                stroke={color}
                strokeWidth="0.6"
                strokeDasharray="3 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{
                  duration: 1.2,
                  delay: 0.4 + i * 0.18,
                  ease: "easeOut",
                }}
              />
              <motion.line
                x1={cx}
                y1={cy}
                x2="250"
                y2="150"
                stroke={color}
                strokeWidth="0.6"
                strokeDasharray="2 18"
                className="animate-dash-flow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 1.6 + i * 0.18, duration: 0.6 }}
              />
            </g>
          );
        })}

        {/* 节点圆点 */}
        {nodes.map((node, i) => {
          const cx = (node.x / 100) * 500;
          const cy = (node.y / 100) * 300;
          const color = node.color === "amber" ? "#FFB547" : "#7FFFD4";
          return (
            <motion.g
              key={`dot-${node.id}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.6 + i * 0.18,
                type: "spring",
                stiffness: 200,
              }}
            >
              <circle cx={cx} cy={cy} r="9" fill={color} opacity="0.15" />
              <circle cx={cx} cy={cy} r="3.5" fill={color} />
              <circle
                cx={cx}
                cy={cy}
                r="3.5"
                fill="none"
                stroke={color}
                strokeWidth="0.5"
                className="animate-node-breathe"
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
            </motion.g>
          );
        })}
      </svg>

      {/* 中央数字（HTML 覆盖） */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="text-center">
          <div className="font-mono text-[10px] tracking-[0.5em] text-aurora/70 mb-2 uppercase">
            remaining
          </div>
          <div className="font-mono text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-amber tracking-tighter leading-none">
            <span className="text-glow-amber drop-shadow-[0_0_30px_rgba(255,181,71,0.5)]">
              {centerValue}
            </span>
          </div>
          <div className="font-mono text-xs sm:text-sm tracking-[0.4em] text-starlight/70 mt-3 uppercase">
            {centerLabel}
          </div>
          {centerSublabel && (
            <div className="text-[11px] text-muted-foreground mt-1 font-mono">
              {centerSublabel}
            </div>
          )}
        </div>
      </motion.div>

      {/* 节点标签（HTML 覆盖） */}
      {nodes.map((node, i) => {
        const offsetX = node.x > 60 ? "right" : node.x < 40 ? "left" : "center";
        const offsetY = node.y > 60 ? "bottom" : node.y < 40 ? "top" : "middle";
        const labelStyle: React.CSSProperties = {
          left: `${node.x}%`,
          top: `${node.y}%`,
        };
        if (offsetX === "left") labelStyle.transform = "translate(20px, -50%)";
        else if (offsetX === "right")
          labelStyle.transform = "translate(calc(-100% - 20px), -50%)";
        else labelStyle.transform = "translate(-50%, -50%)";
        if (offsetY === "top") labelStyle.top = `calc(${node.y}% + 14px)`;
        if (offsetY === "bottom") labelStyle.top = `calc(${node.y}% - 14px)`;

        return (
          <motion.div
            key={`label-${node.id}`}
            className="absolute pointer-events-none"
            style={labelStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 + i * 0.18, duration: 0.6 }}
          >
            <div
              className={cn(
                "font-mono text-xs sm:text-sm font-semibold whitespace-nowrap",
                node.color === "amber" ? "text-amber" : "text-aurora"
              )}
            >
              {node.label}
            </div>
            {node.sublabel && (
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5 whitespace-nowrap">
                {node.sublabel}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
