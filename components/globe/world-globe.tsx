"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full text-muted-foreground text-sm">
      正在唤醒地球...
    </div>
  ),
});

export type WishPoint = {
  lat: number;
  lng: number;
  name: string;
  country: string;
  status: "dream" | "done";
  category: string;
  description: string;
  budget?: string;
  wishId?: string;
};

export type FocusPoint = {
  lat: number;
  lng: number;
  altitude?: number;
};

type WorldGlobeProps = {
  points: WishPoint[];
  onPointClick?: (point: WishPoint) => void;
  height?: number;
  className?: string;
  focusPoint?: FocusPoint | null;
  onFocusComplete?: () => void;
};

const STATUS_COLOR: Record<WishPoint["status"], string> = {
  dream: "#FFB547",
  done: "#7FFFD4",
};

const STATUS_GLOW: Record<WishPoint["status"], string> = {
  dream: "rgba(255, 181, 71, 0.6)",
  done: "rgba(127, 255, 212, 0.6)",
};

export function WorldGlobe({
  points,
  onPointClick,
  height = 600,
  className,
  focusPoint,
  onFocusComplete,
}: WorldGlobeProps) {
  const globeRef = useRef<any>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enableZoom = true;
    controls.minDistance = 180;
    controls.maxDistance = 800;
    globeRef.current.pointOfView({ lat: 25, lng: 110, altitude: 2.5 }, 0);
  }, [mounted]);

  // 焦点切换：暂停旋转 + 平滑过渡
  useEffect(() => {
    if (!globeRef.current || !focusPoint) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = false;
    globeRef.current.pointOfView(
      {
        lat: focusPoint.lat,
        lng: focusPoint.lng,
        altitude: focusPoint.altitude ?? 1.5,
      },
      1200
    );
    const timer = setTimeout(() => {
      if (globeRef.current) {
        const c = globeRef.current.controls();
        c.autoRotate = true;
      }
      onFocusComplete?.();
    }, 5000);
    return () => clearTimeout(timer);
  }, [focusPoint, onFocusComplete]);

  const pointColor = useCallback(
    (d: object) => STATUS_COLOR[(d as WishPoint).status],
    []
  );

  const pointLabel = useCallback((d: object) => {
    const p = d as WishPoint;
    const color = STATUS_COLOR[p.status];
    const glow = STATUS_GLOW[p.status];
    return `
      <div style="
        background: rgba(10, 22, 40, 0.88);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid ${color};
        border-radius: 12px;
        padding: 10px 14px;
        color: #F5F7FA;
        font-family: ui-sans-serif, system-ui, 'PingFang SC', 'Microsoft YaHei', sans-serif;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${glow};
        max-width: 220px;
      ">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
          <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color};"></span>
          <span style="font-size:14px;font-weight:600;letter-spacing:0.02em;">${p.name}</span>
        </div>
        <div style="font-size:11px;color:${color};margin-bottom:4px;font-weight:500;">
          ${p.country} · ${p.category}
        </div>
        <div style="font-size:11px;color:rgba(245,247,250,0.7);line-height:1.4;">
          ${p.description}
        </div>
        ${p.budget ? `<div style="font-size:11px;color:#FFB547;margin-top:4px;font-family:ui-monospace,monospace;">预算 ${p.budget}</div>` : ""}
      </div>
    `;
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ width: "100%", height }}
    >
      {mounted && (
        <Globe
          ref={globeRef}
          width={width}
          height={height}
          globeImageUrl="/textures/earth-night.jpg"
          bumpImageUrl="/textures/earth-topology.png"
          backgroundImageUrl="/textures/night-sky.png"
          showAtmosphere
          atmosphereColor="#7FFFD4"
          atmosphereAltitude={0.18}
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor={pointColor}
          pointAltitude={0.015}
          pointRadius={0.35}
          pointResolution={8}
          pointsMerge={false}
          pointLabel={pointLabel}
          onPointClick={(d: object) => onPointClick?.(d as WishPoint)}
        />
      )}
    </div>
  );
}
