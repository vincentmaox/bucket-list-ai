"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Settings as SettingsIcon,
  Sparkles,
  KeyRound,
  Server,
  Cpu,
  ExternalLink,
  Eye,
  EyeOff,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  Database,
  Trash2,
  Download,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard, GlowText } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAISettingsStore } from "@/lib/store/ai-settings-store";
import { useUserStore } from "@/lib/store/user-store";
import { useWishesStore } from "@/lib/store/wishes-store";
import { useMemoryStore } from "@/lib/store/memory-store";
import { useBudgetStore } from "@/lib/store/budget-store";
import { PROVIDER_PRESETS, getPreset } from "@/lib/ai/presets";
import { testConnection, getEffectiveConfig } from "@/lib/ai/client";

export default function SettingsPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <Header />
        <AIConfigSection />
        <DataSection />
        <AboutSection />
      </section>
    </AppShell>
  );
}

function Header() {
  return (
    <div className="mb-8">
      <Badge variant="outline" className="glass-panel text-amber border-amber/30 mb-3">
        <SettingsIcon className="h-3 w-3 mr-1" />
        SETTINGS · v0.1.0-alpha
      </Badge>
      <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-2">
        <span className="text-starlight">老赫的</span>{" "}
        <GlowText variant="amber" className="text-amber">控制台</GlowText>
      </h1>
      <p className="text-sm text-muted-foreground">
        手动切换 AI 服务商、测试连接、管理本地数据。所有配置只存在你浏览器，不上传。
      </p>
    </div>
  );
}

function AIConfigSection() {
  const settings = useAISettingsStore((s) => s.settings);
  const setProvider = useAISettingsStore((s) => s.setProvider);
  const setField = useAISettingsStore((s) => s.setField);
  const reset = useAISettingsStore((s) => s.reset);
  const [mounted, setMounted] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string; latencyMs?: number; reply?: string } | null>(null);

  useEffect(() => setMounted(true), []);

  const preset = getPreset(settings.provider);
  const effective = mounted ? getEffectiveConfig() : null;
  const keyMasked = settings.apiKey && !showKey
    ? "•".repeat(Math.min(settings.apiKey.length, 24))
    : settings.apiKey;

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const r = await testConnection();
      setTestResult(r);
      if (r.ok) {
        toast.success("连接成功", { description: r.message });
      } else {
        toast.error("连接失败", { description: r.message });
      }
    } finally {
      setTesting(false);
    }
  }

  return (
    <GlassCard strong className="p-6 sm:p-8 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="rounded-xl p-2 border-glow-amber bg-amber/10">
          <Sparkles className="h-5 w-5 text-amber" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-starlight">AI 服务商配置</h2>
          <p className="text-xs text-muted-foreground">
            切换 DeepSeek / 豆包 / OpenAI / 通义 / Moonshot 或自定义
          </p>
        </div>
      </div>

      {/* 当前生效来源 */}
      <div className="mb-5 text-xs flex items-center gap-2 flex-wrap">
        <span className="text-muted-foreground">当前生效配置：</span>
        {effective?.source === "user" && (
          <Badge className="bg-aurora/20 text-aurora border-aurora/30">用户配置（store）</Badge>
        )}
        {effective?.source === "env" && (
          <Badge className="bg-amber/20 text-amber border-amber/30">构建时嵌入（env）</Badge>
        )}
        {effective?.source === "missing" && (
          <Badge variant="outline" className="text-muted-foreground border-white/15">未配置 · 走 mock 兜底</Badge>
        )}
      </div>

      {/* 服务商选择 */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="provider" className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
            <Cpu className="h-3 w-3" />
            服务商
          </Label>
          <select
            id="provider"
            value={settings.provider}
            onChange={(e) => setProvider(e.target.value as typeof settings.provider)}
            className="glass-select glass-panel border-white/15 bg-transparent text-base w-full rounded-xl px-3 py-2.5 text-starlight focus:outline-none focus:border-amber/40"
          >
            {PROVIDER_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          {preset.hint && (
            <p className="text-xs text-muted-foreground mt-1.5">{preset.hint}</p>
          )}
          {preset.apiKeyUrl && (
            <a
              href={preset.apiKeyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-aurora hover:text-amber transition-colors inline-flex items-center gap-1 mt-1"
            >
              去 {preset.label.split(" · ")[0]} 申请 API Key
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* baseURL */}
        <div>
          <Label htmlFor="baseURL" className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
            <Server className="h-3 w-3" />
            API 地址 (Base URL)
          </Label>
          <Input
            id="baseURL"
            type="url"
            value={settings.baseURL}
            onChange={(e) => setField("baseURL", e.target.value)}
            placeholder="https://api.example.com/v1"
            className="glass-panel border-white/15 bg-transparent font-mono text-sm"
          />
        </div>

        {/* Model */}
        <div>
          <Label htmlFor="model" className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
            <Cpu className="h-3 w-3" />
            模型名 (Model)
          </Label>
          <Input
            id="model"
            value={settings.model}
            onChange={(e) => setField("model", e.target.value)}
            placeholder="deepseek-chat / gpt-4o-mini / doubao-pro-32k ..."
            className="glass-panel border-white/15 bg-transparent font-mono text-sm"
          />
        </div>

        {/* API Key */}
        <div>
          <Label htmlFor="apiKey" className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
            <KeyRound className="h-3 w-3" />
            API Key
          </Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showKey ? "text" : "password"}
              value={showKey ? settings.apiKey : keyMasked}
              onChange={(e) => setField("apiKey", e.target.value)}
              onFocus={() => setShowKey(true)}
              placeholder="sk-..."
              className="glass-panel border-white/15 bg-transparent font-mono text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber transition-colors"
              aria-label={showKey ? "隐藏" : "显示"}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            只存在浏览器 localStorage，不上传任何服务器（除调用 API 外）。
          </p>
        </div>

        <Separator className="my-2 bg-white/10" />

        {/* 测试连接 + 重置 */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleTest}
            disabled={testing || !settings.apiKey || !settings.baseURL}
            className="gradient-aurora text-background font-semibold"
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                测试中...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                测试连接
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              reset();
              toast.info("已重置为构建时默认配置");
            }}
            className="glass-panel border-white/15 hover:border-amber/40"
          >
            <RotateCcw className="h-4 w-4" />
            重置
          </Button>
        </div>

        {/* 测试结果 */}
        {testResult && (
          <div className={`rounded-xl p-3 text-sm flex items-start gap-2 ${
            testResult.ok
              ? "bg-aurora/10 border border-aurora/30 text-aurora"
              : "bg-destructive/10 border border-destructive/30 text-destructive"
          }`}>
            {testResult.ok ? (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-mono text-xs">{testResult.message}</div>
              {testResult.reply && (
                <div className="text-xs mt-1 opacity-70">模型回复：{testResult.reply}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

function DataSection() {
  const profile = useUserStore((s) => s.profile);
  const resetProfile = useUserStore((s) => s.reset);
  const wishesData = useWishesStore((s) => s.data);
  const clearWishes = useWishesStore((s) => s.clear);
  const memories = useMemoryStore((s) => s.memories);
  const clearMemories = useMemoryStore((s) => s.clearAll);
  const savedByWish = useBudgetStore((s) => s.savedByWish);
  const disposableRatio = useBudgetStore((s) => s.disposableRatio);
  const resetBudget = useBudgetStore((s) => s.reset);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const profileComplete = mounted && profile.onboardingCompletedAt && profile.birthDate;
  const wishesCount = mounted && wishesData ? wishesData.wishes.length : 0;
  const memoriesCount = mounted ? memories.length : 0;

  function exportAll() {
    const dump = {
      exportedAt: new Date().toISOString(),
      version: "0.1.0",
      profile,
      wishes: wishesData,
      memories,
      budget: { savedByWish, disposableRatio },
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bucket-list-ai-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("已导出 JSON 备份");
  }

  function clearAll() {
    if (!confirm("确定清空所有本地数据？此操作不可撤销。建议先导出备份。")) return;
    resetProfile();
    clearWishes();
    clearMemories();
    resetBudget();
    toast.success("已清空所有本地数据");
  }

  return (
    <GlassCard strong className="p-6 sm:p-8 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="rounded-xl p-2 border-glow-aurora bg-aurora/10">
          <Database className="h-5 w-5 text-aurora" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-starlight">数据管理</h2>
          <p className="text-xs text-muted-foreground">所有数据存在浏览器 localStorage</p>
        </div>
      </div>

      <div className="space-y-3">
        <DataRow
          label="用户画像"
          value={profileComplete ? `${profile.mbti ?? "?"} · ${profile.country ?? "?"}` : "未填写"}
          actionLabel={profileComplete ? "清除重填" : "去填写"}
          onAction={profileComplete ? () => { resetProfile(); toast.info("画像已清除"); } : undefined}
          actionHref={profileComplete ? undefined : "/onboarding"}
        />
        <DataRow
          label="人生清单"
          value={`${wishesCount} 条`}
          actionLabel={wishesCount > 0 ? "清空" : "去生成"}
          onAction={wishesCount > 0 ? () => { clearWishes(); toast.info("清单已清空"); } : undefined}
          actionHref={wishesCount > 0 ? undefined : "/wishes"}
        />
        <DataRow
          label="人生记录"
          value={`${memoriesCount} 条`}
          actionLabel={memoriesCount > 0 ? "清空" : "去记录"}
          onAction={memoriesCount > 0 ? () => { clearMemories(); toast.info("记录已清空"); } : undefined}
          actionHref={memoriesCount > 0 ? undefined : "/memories"}
        />

        <Separator className="my-2 bg-white/10" />

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            variant="outline"
            onClick={exportAll}
            className="glass-panel border-aurora/30 text-aurora hover:border-aurora/50"
          >
            <Download className="h-4 w-4" />
            导出全部 JSON
          </Button>
          <Button
            variant="outline"
            onClick={clearAll}
            className="glass-panel border-destructive/30 text-destructive hover:border-destructive/50"
          >
            <Trash2 className="h-4 w-4" />
            清空全部数据
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

function DataRow({
  label,
  value,
  actionLabel,
  onAction,
  actionHref,
}: {
  label: string;
  value: string;
  actionLabel: string;
  onAction?: () => void;
  actionHref?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div>
        <div className="text-sm text-starlight">{label}</div>
        <div className="text-xs text-muted-foreground font-mono">{value}</div>
      </div>
      {actionHref ? (
        <Button
          size="sm"
          variant="ghost"
          nativeButton={false}
          render={<Link href={actionHref} />}
          className="text-amber hover:text-amber hover:bg-amber/10"
        >
          {actionLabel}
          <ArrowRight className="h-3 w-3" />
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={onAction}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

function AboutSection() {
  return (
    <GlassCard className="p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm text-starlight mb-1 font-serif">bucket·list.ai</div>
          <div className="text-xs text-muted-foreground font-mono space-y-0.5">
            <div>v0.1.0-alpha · 2026-06-26</div>
            <div>TRAE AI 创造力大赛 2026 参赛作品</div>
            <div>Next.js 16 + Tauri 2 · React 19 + TypeScript 5</div>
          </div>
        </div>
        <Badge variant="outline" className="glass-panel text-aurora border-aurora/30">
          <span className="font-mono">VOID.ARCHITECT</span>
        </Badge>
      </div>
    </GlassCard>
  );
}
