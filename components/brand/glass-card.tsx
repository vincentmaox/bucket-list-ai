import * as React from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: "amber" | "aurora" | "none";
  strong?: boolean;
  interactive?: boolean;
};

export function GlassCard({
  className,
  glow = "none",
  strong = false,
  interactive = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        strong ? "glass-panel-strong" : "glass-panel",
        interactive &&
          "transition-all duration-500 hover:translate-y-[-2px] hover:border-glow-amber",
        glow === "amber" && "border-glow-amber",
        glow === "aurora" && "border-glow-aurora",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
