import * as React from "react";
import { cn } from "@/lib/utils";

type GlowTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "amber" | "aurora" | "starlight";
  as?: React.ElementType;
};

export function GlowText({
  className,
  variant = "amber",
  as: Tag = "span",
  ...props
}: GlowTextProps) {
  return (
    <Tag
      className={cn(
        variant === "amber" && "text-glow-amber",
        variant === "aurora" && "text-glow-aurora",
        variant === "starlight" && "text-glow-starlight",
        className
      )}
      {...props}
    />
  );
}
