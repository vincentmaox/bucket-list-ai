"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Cake,
  Droplet,
  Brain,
  Wallet,
  Globe,
  RotateCcw,
} from "lucide-react";
import { GlassCard, GlowText } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useUserStore, type MBTIType, type BloodType, type Gender } from "@/lib/store/user-store";
import { getZodiacSign } from "@/lib/astro";
import { getChineseZodiac } from "@/lib/zodiac";
import { COUNTRIES, calcLife, formatNumber, type CountryCode } from "@/lib/life-expectancy";

const TOTAL_STEPS = 5;

const MBTI_OPTIONS: { type: MBTIType; label: string; nickname: string }[] = [
  { type: "INTJ", label: "INTJ", nickname: "建筑师" },
  { type: "INTP", label: "INTP", nickname: "逻辑学家" },
  { type: "ENTJ", label: "ENTJ", nickname: "指挥官" },
  { type: "ENTP", label: "ENTP", nickname: "辩论家" },
  { type: "INFJ", label: "INFJ", nickname: "提倡者" },
  { type: "INFP", label: "INFP", nickname: "调停者" },
  { type: "ENFJ", label: "ENFJ", nickname: "主人公" },
  { type: "ENFP", label: "ENFP", nickname: "竞选者" },
  { type: "ISTJ", label: "ISTJ", nickname: "物流师" },
  { type: "ISFJ", label: "ISFJ", nickname: "守卫者" },
  { type: "ESTJ", label: "ESTJ", nickname: "总经理" },
  { type: "ESFJ", label: "ESFJ", nickname: "执政官" },
  { type: "ISTP", label: "ISTP", nickname: "鉴赏家" },
  { type: "ISFP", label: "ISFP", nickname: "探险家" },
  { type: "ESTP", label: "ESTP", nickname: "企业家" },
  { type: "ESFP", label: "ESFP", nickname: "表演者" },
];

const BLOOD_TYPES: BloodType[] = ["A", "B", "O", "AB"];

const COUNTRY_CODES = Object.keys(COUNTRIES) as CountryCode[];

export function OnboardingFlow() {
  const router = useRouter();
  const setProfile = useUserStore((s) => s.setProfile);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [bloodType, setBloodType] = useState<BloodType | "">("");
  const [mbti, setMbti] = useState<MBTIType | "">("");
  const [annualIncome, setAnnualIncome] = useState<string>("");
  const [country, setCountry] = useState<CountryCode | "">("");

  function canProceed(): boolean {
    switch (step) {
      case 0: return !!birthDate && !!gender;
      case 1: return !!bloodType && !!mbti;
      case 2: return !!annualIncome && Number(annualIncome) > 0;
      case 3: return !!country;
      default: return true;
    }
  }

  function next() {
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep(step + 1);
    } else {
      // 完成
      setProfile({
        birthDate,
        gender: gender || undefined,
        bloodType: bloodType || undefined,
        mbti: mbti || undefined,
        annualIncome: Number(annualIncome) || undefined,
        country: country || undefined,
      });
      completeOnboarding();
      router.push("/");
    }
  }

  function prev() {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <GlassCard strong className="mx-auto max-w-2xl p-6 sm:p-10">
      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2 text-xs">
          <span className="text-muted-foreground font-mono">
            {String(step + 1).padStart(2, "0")} / {String(TOTAL_STEPS).padStart(2, "0")}
          </span>
          <span className="text-amber">
            {["生日 · 性别", "血型 · MBTI", "收入", "国家", "完成"][step]}
          </span>
        </div>
        <Progress value={progress} className="h-1 bg-white/5" />
      </div>

      {/* 步骤内容 */}
      <div className="min-h-[340px] flex flex-col justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {step === 0 && (
              <StepShell
                icon={Cake}
                title="你什么时候"
                highlight="来到这颗星球"
              >
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="birth" className="text-sm text-muted-foreground mb-2 block">
                      出生日期
                    </Label>
                    <Input
                      id="birth"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="glass-panel border-white/15 bg-transparent text-base"
                    />
                    {birthDate && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(() => {
                          const d = new Date(birthDate);
                          const z = getZodiacSign(d.getMonth() + 1, d.getDate());
                          const cz = getChineseZodiac(d.getFullYear());
                          return (
                            <>
                              <Badge variant="outline" className="border-amber/40 text-amber">
                                {z.sign} · {z.element}象 · {z.trait}
                              </Badge>
                              <Badge variant="outline" className="border-aurora/40 text-aurora">
                                {cz.emoji} 属{cz.animal} · {cz.trait}
                              </Badge>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      生理性别（用于更精准的寿命估算）
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["male", "female"] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={cn(
                            "rounded-xl p-4 text-sm font-medium transition-all",
                            gender === g
                              ? "glass-panel-strong border-glow-amber text-amber"
                              : "glass-panel text-muted-foreground hover:text-starlight"
                          )}
                        >
                          {g === "male" ? "男" : "女"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </StepShell>
            )}

            {step === 1 && (
              <StepShell
                icon={Brain}
                title="你的"
                highlight="出厂配置"
              >
                <div className="space-y-5">
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      <Droplet className="inline h-3 w-3 mr-1" />
                      血型
                    </Label>
                    <div className="grid grid-cols-4 gap-2">
                      {BLOOD_TYPES.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBloodType(b)}
                          className={cn(
                            "rounded-xl py-3 text-sm font-mono font-semibold transition-all",
                            bloodType === b
                              ? "glass-panel-strong border-glow-aurora text-aurora"
                              : "glass-panel text-muted-foreground hover:text-starlight"
                          )}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      <Brain className="inline h-3 w-3 mr-1" />
                      MBTI 性格类型（不知道选哪个稍后 AI 帮你判断）
                    </Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {MBTI_OPTIONS.map((m) => (
                        <button
                          key={m.type}
                          type="button"
                          onClick={() => setMbti(m.type)}
                          className={cn(
                            "rounded-xl p-2 text-center transition-all duration-200",
                            mbti === m.type
                              ? "glass-panel-strong border-glow-amber scale-[1.03]"
                              : "glass-panel hover:bg-white/5 hover:scale-[1.02]"
                          )}
                        >
                          <div className={cn(
                            "text-sm font-mono font-bold transition-colors",
                            mbti === m.type ? "text-amber text-glow-amber" : "text-starlight"
                          )}>
                            {m.label}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                            {m.nickname}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </StepShell>
            )}

            {step === 2 && (
              <StepShell
                icon={Wallet}
                title="你的"
                highlight="弹药库"
              >
                <div className="space-y-4">
                  <Label htmlFor="income" className="text-sm text-muted-foreground block">
                    年收入（税前，人民币 ¥）
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
                      ¥
                    </span>
                    <Input
                      id="income"
                      type="number"
                      inputMode="numeric"
                      placeholder="如 400000"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(e.target.value)}
                      className="glass-panel border-white/15 bg-transparent text-lg pl-8 font-mono"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[100000, 200000, 400000, 800000, 1500000].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setAnnualIncome(String(v))}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs transition-all",
                          annualIncome === String(v)
                            ? "glass-panel-strong text-amber"
                            : "glass-panel text-muted-foreground hover:text-starlight"
                        )}
                      >
                        ¥{v >= 10000 ? `${v / 10000}万` : v}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    老赫只在你浏览器里算账，不上传任何数据。资金约束让梦想可落地。
                  </p>
                </div>
              </StepShell>
            )}

            {step === 3 && (
              <StepShell
                icon={Globe}
                title="你"
                highlight="在哪片土地上"
              >
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[260px] overflow-y-auto pr-1">
                  {COUNTRY_CODES.map((code) => {
                    const meta = COUNTRIES[code];
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setCountry(code)}
                        className={cn(
                          "rounded-xl p-2.5 text-left transition-all",
                          country === code
                            ? "glass-panel-strong border-glow-amber"
                            : "glass-panel hover:bg-white/5"
                        )}
                      >
                        <div className="text-xl mb-0.5">{meta.flag}</div>
                        <div className="text-xs font-medium text-starlight truncate">
                          {meta.zh}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {meta.lifeExpectancy.overall}岁
                        </div>
                      </button>
                    );
                  })}
                </div>
              </StepShell>
            )}

            {step === 4 && birthDate && country && (
              <ResultShell
                birthDate={birthDate}
                gender={gender || undefined}
                bloodType={bloodType || undefined}
                mbti={mbti || undefined}
                annualIncome={Number(annualIncome) || undefined}
                country={country as CountryCode}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 导航按钮 */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
        {step > 0 ? (
          <Button
            variant="ghost"
            onClick={prev}
            className="text-muted-foreground hover:text-starlight"
          >
            <ArrowLeft className="h-4 w-4" />
            上一步
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">
            约 1 分钟完成
          </span>
        )}

        <Button
          onClick={next}
          disabled={!canProceed()}
          className={cn(
            "min-w-[140px]",
            step === TOTAL_STEPS - 1
              ? "gradient-aurora text-background"
              : "glass-panel-strong border-glow-amber"
          )}
        >
          {step === TOTAL_STEPS - 1 ? (
            <>
              <Check className="h-4 w-4" />
              进入我的人生
            </>
          ) : (
            <>
              继续
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </GlassCard>
  );
}

function StepShell({
  icon: Icon,
  title,
  highlight,
  children,
}: {
  icon: React.ElementType;
  title: string;
  highlight: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-xl p-2 border-glow-amber bg-amber/10">
          <Icon className="h-5 w-5 text-amber" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">
          <span className="text-starlight">{title}</span>{" "}
          <GlowText variant="amber" className="text-amber">
            {highlight}
          </GlowText>
        </h2>
      </div>
      {children}
    </div>
  );
}

function ResultShell({
  birthDate,
  gender,
  bloodType,
  mbti,
  annualIncome,
  country,
}: {
  birthDate: string;
  gender?: Gender;
  bloodType?: BloodType;
  mbti?: MBTIType;
  annualIncome?: number;
  country: CountryCode;
}) {
  const d = new Date(birthDate);
  const z = getZodiacSign(d.getMonth() + 1, d.getDate());
  const cz = getChineseZodiac(d.getFullYear());
  const life = calcLife(d, country, gender);
  const countryMeta = COUNTRIES[country];

  return (
    <div className="text-center space-y-6">
      <div className="inline-flex items-center justify-center rounded-2xl border-glow-aurora bg-aurora/10 p-3 mb-2">
        <Sparkles className="h-6 w-6 text-aurora" />
      </div>

      <div>
        <div className="text-sm text-muted-foreground mb-1">你还有</div>
        <GlowText
          variant="amber"
          as="div"
          className="font-mono text-6xl sm:text-7xl font-bold text-amber"
        >
          {formatNumber(life.remainingWeeks)}
        </GlowText>
        <div className="text-lg text-starlight mt-1">周可以活</div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="glass-panel rounded-xl p-3">
          <div className="text-[10px] text-muted-foreground mb-1">已活过</div>
          <div className="text-base font-mono text-starlight">
            {formatNumber(life.ageWeeks)}
          </div>
          <div className="text-[10px] text-muted-foreground">周</div>
        </div>
        <div className="glass-panel rounded-xl p-3">
          <div className="text-[10px] text-muted-foreground mb-1">预期寿命</div>
          <div className="text-base font-mono text-aurora">
            {life.lifeExpectancy}
          </div>
          <div className="text-[10px] text-muted-foreground">岁 · {countryMeta.zh}</div>
        </div>
        <div className="glass-panel rounded-xl p-3">
          <div className="text-[10px] text-muted-foreground mb-1">已度过</div>
          <div className="text-base font-mono text-amber">
            {life.livedPercent.toFixed(1)}%
          </div>
          <div className="text-[10px] text-muted-foreground">人生进度</div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 pt-2">
        {z.sign && (
          <Badge variant="outline" className="border-amber/40 text-amber">
            {z.sign} · {z.element}象
          </Badge>
        )}
        {cz.animal && (
          <Badge variant="outline" className="border-aurora/40 text-aurora">
            {cz.emoji} 属{cz.animal}
          </Badge>
        )}
        {bloodType && (
          <Badge variant="outline" className="border-amber/40 text-amber">
            {bloodType} 型血
          </Badge>
        )}
        {mbti && (
          <Badge variant="outline" className="border-aurora/40 text-aurora">
            {mbti}
          </Badge>
        )}
      </div>

      <div className="text-xs text-muted-foreground font-mono flex items-center justify-center gap-1">
        <RotateCcw className="h-3 w-3" />
        以上数据仅存于你的浏览器，AI 没看见
      </div>
    </div>
  );
}
