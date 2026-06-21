import { MessageCircle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { Badge } from "@/components/ui/badge";

export default function OnboardingPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6 text-center">
          <Badge
            variant="outline"
            className="glass-panel text-aurora border-aurora/30 mb-3"
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            老赫陪你聊 · 5 问 1 分钟
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            <span className="text-starlight">让我们先</span>
            <span className="text-amber text-glow-amber"> 认识一下 </span>
            <span className="text-starlight">你</span>
          </h1>
        </div>

        <OnboardingFlow />
      </section>
    </AppShell>
  );
}
