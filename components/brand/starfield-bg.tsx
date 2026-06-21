import * as React from "react";
import { cn } from "@/lib/utils";

type StarfieldBgProps = React.HTMLAttributes<HTMLDivElement> & {
  drift?: boolean;
};

export function StarfieldBg({
  className,
  drift = true,
  ...props
}: StarfieldBgProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 starfield",
        drift && "animate-starlight-drift",
        className
      )}
      {...props}
    />
  );
}
