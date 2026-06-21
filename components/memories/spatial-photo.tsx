"use client";

import { useRef, useState, useCallback } from "react";
import { Sparkles, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type SpatialPhotoProps = {
  src: string;
  alt?: string;
  className?: string;
  intensity?: number;
};

export function SpatialPhoto({
  src,
  alt = "",
  className,
  intensity = 12,
}: SpatialPhotoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>("");
  const [hovering, setHovering] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * intensity * 2;
      const rotX = -(py - 0.5) * intensity * 2;
      setTransform(
        `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.04)`
      );
      setGlarePos({ x: px * 100, y: py * 100 });
    },
    [intensity]
  );

  const handleLeave = useCallback(() => {
    setTransform("perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)");
    setHovering(false);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleLeave}
      className={cn(
        "relative overflow-hidden rounded-lg cursor-pointer",
        "transition-transform duration-200 ease-out will-change-transform",
        className
      )}
      style={{ transform }}
    >
      {/* 主图 */}
      <img
        src={src}
        alt={alt}
        className="block w-full h-auto select-none pointer-events-none"
        draggable={false}
      />

      {/* 深度高光层（模拟前景受光） */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-60"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 35%)`,
        }}
      />

      {/* 深度阴影层（模拟背景后退） */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-40"
        style={{
          background: `radial-gradient(circle at ${100 - glarePos.x}% ${100 - glarePos.y}%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%)`,
        }}
      />

      {/* 边缘内发光（强化"被聚焦"感） */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-200",
          hovering ? "opacity-100" : "opacity-0"
        )}
        style={{
          boxShadow:
            "inset 0 0 40px rgba(255, 181, 71, 0.2), inset 0 0 80px rgba(127, 255, 212, 0.08)",
        }}
      />

      {/* 空间照片标签 */}
      <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full glass-panel-strong px-2 py-0.5 text-[10px] font-mono text-aurora">
        <Sparkles className="h-2.5 w-2.5" />
        SPATIAL
      </div>

      {/* hover 提示 */}
      <div
        className={cn(
          "absolute bottom-2 left-2 flex items-center gap-1 rounded-full glass-panel-strong px-2 py-0.5 text-[10px] font-mono text-amber transition-opacity duration-200",
          hovering ? "opacity-100" : "opacity-0"
        )}
      >
        <Eye className="h-2.5 w-2.5" />
        移动鼠标 · 感受深度
      </div>
    </div>
  );
}
