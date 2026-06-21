"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  HeartPulse,
  Brain,
  MapPinned,
  Wallet,
  Globe2,
} from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/app-shell";
import {
  GlassCard,
  GlowText,
  CoordinateGrid,
  ConstellationMap,
  LifeInWeeks,
} from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUserStore } from "@/lib/store/user-store";
import { calcLife, formatNumber, COUNTRIES } from "@/lib/life-expectancy";
import { getZodiacSign } from "@/lib/astro";
import { getChineseZodiac } from "@/lib/zodiac";

const FEATURES = [
  {
    icon: HeartPulse,
    title: "人生沙漏",
    desc: "基于年龄、收入、所在国家平均寿命，可视化你还有多少周可以活。",
    glow: "amber" as const,
  },
  {
    icon: Brain,
    title: "AI 性格推荐",
    desc: "生日推算星座 + 生肖 + MBTI，让 AI 生成只属于你的人生体验清单。",
    glow: "aurora" as const,
  },
  {
    icon: MapPinned,
    title: "世界地图",
    desc: "想去的地方在地球上发光。已完成的发出极光绿，未完成的发出琥珀光。",
    glow: "amber" as const,
  },
];

export default function HomePage() {
  const profile = useUserStore((s) => s.profile);
  const reset = useUserStore((s) => s.reset);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasProfile =
    mounted &&
    profile.onboardingCompletedAt &&
    profile.birthDate &&
    profile.country;

  const life = hasProfile
    ? calcLife(
        new Date(profile.birthDate!),
        profile.country!,
        profile.gender
      )
    : null;

  const zodiac = hasProfile
    ? getZodiacSign(
        new Date(profile.birthDate!).getMonth() + 1,
        new Date(profile.birthDate!).getDate()
      )
    : null;
  const cz = hasProfile
    ? getChineseZodiac(new Date(profile.birthDate!).getFullYear())
    : null;
  const countryMeta = hasProfile ? COUNTRIES[profile.country!] : null;

  // 星图节点
  const constellationNodes = [
    {
      id: "mbti",
      label: profile.mbti ?? "????",
      sublabel: "人格",
      color: "amber" as const,
      x: 12,
      y: 22,
    },
    {
      id: "zodiac",
      label: zodiac?.sign ?? "????",
      sublabel: zodiac ? `${zodiac.element}象` : "星座",
      color: "aurora" as const,
      x: 88,
      y: 22,
    },
    {
      id: "animal",
      label: cz ? `${cz.emoji} ${cz.animal}` : "??",
      sublabel: "生肖",
      color: "aurora" as const,
      x: 12,
      y: 78,
    },
    {
      id: "blood",
      label: profile.bloodType ? `${profile.bloodType}型` : "?",
      sublabel: "血型",
      color: "amber" as const,
      x: 88,
      y: 78,
    },
  ];

  const centerValue = hasProfile && life
    ? formatNumber(life.remainingWeeks)
    : "2,847";
  const centerSublabel = hasProfile && life
    ? `约 ${(life.remainingWeeks / 52.1775).toFixed(0)} 年 · 已度过 ${life.livedPercent.toFixed(1)}%`
    : "示例数据 · 完成 onboarding 后真实计算";

  return (
    <AppShell>
      {/* ===== Hero: 时间坐标 ===== */}
      <section className="relative min-h-[88vh] flex flex-col overflow-hidden">
        <CoordinateGrid />

        {/* 顶部 badge */}
        <motion.div
          className="relative z-10 pt-12 sm:pt-16 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="glass-panel text-aurora border-aurora/30 font-mono"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-aurora animate-pulse mr-2" />
            TRAE · 2026 · VOID ARCHITECT
          </Badge>
        </motion.div>

        {/* 主标题双语 */}
        <motion.div
          className="relative z-10 text-center mt-10 sm:mt-12 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="font-mono text-[10px] sm:text-xs tracking-[0.5em] text-aurora/70 uppercase mb-3">
            Coordinates of
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            <span className="text-starlight">你的</span>
            <span className="text-amber text-glow-amber mx-2">时间坐标</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-3 font-mono tracking-wider">
            {hasProfile
              ? "AT THE INTERSECTION OF WHO YOU ARE AND HOW LONG YOU HAVE"
              : "AN AI-DRAWN MAP OF WHAT YOUR LIFE COULD STILL BECOME"}
          </p>
        </motion.div>

        {/* 中央星图 */}
        <motion.div
          className="relative z-10 flex-1 flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <ConstellationMap
            centerValue={centerValue}
            centerLabel="WEEKS REMAINING"
            centerSublabel={centerSublabel}
            nodes={constellationNodes}
          />
        </motion.div>

        {/* 元数据 + CTA */}
        <motion.div
          className="relative z-10 pb-12 sm:pb-16 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-center mb-6 px-2">
            <div className="font-mono text-[10px] sm:text-xs text-muted-foreground tracking-wider flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              {hasProfile && countryMeta ? (
                <>
                  <span>AT</span>
                  <span className="text-amber">{countryMeta.flag} {countryMeta.zh}</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-aurora">{life?.age}岁</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-amber">{life?.lifeExpectancy}岁预期</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-aurora">{(100 - (life?.livedPercent ?? 0)).toFixed(0)}% 可活</span>
                </>
              ) : (
                <>
                  <span>AT</span>
                  <span className="text-amber">UNKNOWN</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-aurora">UNMAPPED</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-amber">WAITING INPUT</span>
                </>
              )}
            </div>
          </div>

          {/* CTA: 文字路径不是按钮 */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href={hasProfile ? "/wishes" : "/onboarding"}
              className="group inline-flex flex-col items-center"
            >
              <span className="font-mono text-base sm:text-lg text-amber group-hover:text-glow-amber transition-all tracking-wider">
                → {hasProfile ? "展开你的清单" : "开始绘制你的坐标"}
              </span>
              <span className="block h-px bg-amber/40 group-hover:bg-amber group-hover:w-full transition-all mt-1 w-24" />
              <span className="text-[10px] text-muted-foreground font-mono mt-1.5 tracking-wider">
                {hasProfile ? "10 个 AI 推荐等你" : "1 分钟 · 5 个问题"}
              </span>
            </Link>

            {hasProfile && (
              <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  nativeButton={false}
                  className="text-muted-foreground hover:text-aurora"
                  render={<Link href="/map" />}
                >
                  <Globe2 className="h-3 w-3" />
                  看世界地图
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => reset()}
                  className="text-muted-foreground hover:text-amber"
                >
                  <RefreshCw className="h-3 w-3" />
                  重新填写
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* ===== 第二屏：周点阵（hasProfile 时）===== */}
      {hasProfile && life && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <LifeInWeeks
              ageWeeks={life.ageWeeks}
              totalWeeks={life.totalWeeks}
            />
          </motion.div>
        </section>
      )}

      {/* ===== 第三屏：quick stats（hasProfile 时）===== */}
      {hasProfile && life && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: HeartPulse, label: "年龄", value: life.age, color: "amber" as const },
              { icon: Sparkles, label: "预期寿命", value: life.lifeExpectancy, color: "aurora" as const },
              {
                icon: Wallet,
                label: "年收入",
                value: profile.annualIncome && profile.annualIncome >= 10000
                  ? `${(profile.annualIncome / 10000).toFixed(0)}万`
                  : (profile.annualIncome ?? 0),
                color: "amber" as const,
              },
              { icon: Globe2, label: "剩余可活年", value: Math.floor(life.remainingWeeks / 52.1775), color: "aurora" as const },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <GlassCard className="p-4 text-center">
                    <Icon
                      className={stat.color === "amber" ? "h-5 w-5 text-amber mx-auto mb-1" : "h-5 w-5 text-aurora mx-auto mb-1"}
                    />
                    <div className="text-xl font-mono font-bold text-starlight">
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{stat.label}</div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ===== 第四屏：叙事段 + Features ===== */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 border-t border-white/5">
        <motion.div
          className="text-center mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono text-[10px] tracking-[0.5em] text-aurora/70 uppercase mb-3">
            The Premise
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-snug mb-4">
            <span className="text-starlight">把模糊的</span>{" "}
            <GlowText variant="amber" className="text-amber">「我想做」</GlowText>
            <span className="text-starlight">，</span>
            <br className="hidden sm:inline" />
            <span className="text-starlight">翻译成可执行的</span>{" "}
            <GlowText variant="aurora" className="text-aurora">「下个月做什么」</GlowText>
            <span className="text-starlight">。</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            AI 不替你活，但帮你看见自己。
            剩余时间 · 性格画像 · 资金约束 · 世界地图 · 人生记录——五个维度，
            一份只属于你的人生清单。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <GlassCard interactive glow={feature.glow} className="p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div
                      className={
                        feature.glow === "amber"
                          ? "rounded-xl p-2.5 border-glow-amber bg-amber/10"
                          : "rounded-xl p-2.5 border-glow-aurora bg-aurora/10"
                      }
                    >
                      <Icon
                        className={
                          feature.glow === "amber"
                            ? "h-6 w-6 text-amber"
                            : "h-6 w-6 text-aurora"
                        }
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-lg mb-1 text-starlight">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* 终极 CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {hasProfile ? (
            <Button
              size="lg"
              nativeButton={false}
              className="gradient-aurora text-background font-semibold animate-glow-breathe"
              render={<Link href="/wishes" />}
            >
              <Sparkles className="h-4 w-4" />
              看我的清单
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="lg"
              nativeButton={false}
              className="gradient-aurora text-background font-semibold animate-glow-breathe"
              render={<Link href="/onboarding" />}
            >
              <Sparkles className="h-4 w-4" />
              开启我的人生清单
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground font-mono opacity-60">
            <span className="text-amber">●</span> 想去的地方
            <span className="mx-3">·</span>
            <span className="text-aurora">●</span> 已完成的愿望
            <span className="mx-3">·</span>
            <span className="text-starlight">/</span> 你在这里
          </p>
        </div>
      </section>
    </AppShell>
  );
}
