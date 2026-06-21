"use client";

import { useEffect, useState } from "react";

type CountUpProps = {
  target: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
};

export function CountUp({
  target,
  duration = 1600,
  format = (n) => n.toLocaleString("en-US"),
  className,
}: CountUpProps) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let raf: number;
    let startTime: number | null = null;

    const tick = (t: number) => {
      if (startTime === null) startTime = t;
      const progress = Math.min((t - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return <span className={className}>{format(val)}</span>;
}
