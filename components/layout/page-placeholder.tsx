import * as React from "react";
import { GlassCard, GlowText } from "@/components/brand";
import { Badge } from "@/components/ui/badge";

type PagePlaceholderProps = {
  icon: React.ElementType;
  title: string;
  highlight?: string;
  desc: string;
  status?: string;
};

export function PagePlaceholder({
  icon: Icon,
  title,
  highlight,
  desc,
  status = "开发中 · MVP Week 2-3",
}: PagePlaceholderProps) {
  return (
    <GlassCard strong className="mx-auto max-w-3xl p-8 sm:p-12 text-center">
      <div className="inline-flex items-center justify-center rounded-2xl border-glow-amber bg-amber/10 p-4 mb-6">
        <Icon className="h-10 w-10 text-amber" />
      </div>

      <Badge
        variant="outline"
        className="glass-panel text-aurora border-aurora/30 mb-4"
      >
        {status}
      </Badge>

      <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3">
        <span className="text-starlight">{title}</span>
        {highlight && (
          <>
            <br />
            <GlowText variant="amber" className="text-amber">
              {highlight}
            </GlowText>
          </>
        )}
      </h1>

      <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
        {desc}
      </p>
    </GlassCard>
  );
}
