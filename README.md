# bucket-list-ai · 你的人生剩余清单

> 「让每个人死后没有遗憾」——把模糊的人生焦虑，做成可执行的资金约束优化问题。

AI 驱动的人生遗愿清单引擎。基于剩余寿命、收入约束、性格画像（MBTI / 星座 / 生肖 / 血型），生成个性化可落地的人生体验清单，并陪用户把它一件件干掉。

**TRAE AI 创造力大赛 2026 · 参赛作品** · [大赛官网](https://www.trae.cn/ai-creativity) · [参赛提交材料](./docs/SUBMISSION.md) · [DEMO 路演脚本](./docs/DEMO_SCRIPT.md)

---

## 一句话定位

**如果今天是你人生的最后一周，你想做什么？**

bucket-list-ai 用 5 个问题、1 分钟画像采集，告诉你：你还剩多少周、性格上最适合做什么、需要多少钱、什么时候能去、地球上哪些地方在等你。

数据全部存浏览器，**隐私零上传**。

---

## 五大差异化卖点

| # | 卖点 | 文件 |
|---|---|---|
| 1 | **「时间坐标」首屏**——抛弃 count-up 套路，性格画像在天上发光连线 | `app/page.tsx` + `components/brand/constellation-map.tsx` |
| 2 | **周点阵 life-in-weeks**——3,900+ 圆点，已度过暗灰，剩余琥珀发光 | `components/brand/life-in-weeks.tsx` |
| 3 | **AI 性格推荐**——LLM prompt 驱动，每条推荐引用 MBTI/星座作为论据 | `app/api/recommend/route.ts` + `lib/ai/prompt.ts` |
| 4 | **3D 地球联动**——点愿望卡跳地图，地球自动旋转定位 | `components/globe/world-globe.tsx` |
| 5 | **空间照片**——CSS 视差模拟 Vision Pro，留 depth-anything-3 hook | `components/memories/spatial-photo.tsx` |

---

## 模块矩阵

| 页面 | 状态 | 核心功能 |
|---|---|---|
| `/` 首屏 | ✅ | 时间坐标 + 周点阵 + Quick Stats |
| `/onboarding` | ✅ | 5 步 AI 引导（生日/血型/MBTI/收入/国家） |
| `/wishes` | ✅ | AI 推荐 Top 10 + 性格 reason + 跳地图 |
| `/map` | ✅ | 3D 地球 + focus 联动 + 详情 Dialog |
| `/budget` | ✅ | 月供节奏 + 进度 + 达成日期 |
| `/memories` | ✅ | 照片/文字 + 时间倒序 + 空间照片 |
| `/api/recommend` | ✅ | LLM + zod schema + mock fallback |
| `/api/depth` | ✅ hook | 占位，未来接 depth-anything-3 |

---

## 技术栈

- **框架**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **样式**: Tailwind CSS v4 + shadcn/ui (base-ui)
- **动画**: framer-motion + 自定义 SVG keyframes
- **状态**: Zustand + persist (localStorage) — 4 个独立 store
- **地图**: react-globe.gl + three.js
- **AI**: Vercel AI SDK v6 + `generateObject` + zod schema 严格约束
- **空间照片**: CSS 视差 + depth-anything-3 hook（计划真接）

## 设计语言 · Vision Pro 太空主题

| Token | 色值 | 用途 |
|---|---|---|
| `--space-void` | `oklch(0.13 0.025 260)` | 最深背景 |
| `--space-deep` | `oklch(0.18 0.04 256)` | 太空蓝主背景 |
| `--amber` | `oklch(0.82 0.16 71)` | 琥珀（想去 / CTA / 数字） |
| `--aurora` | `oklch(0.91 0.15 172)` | 极光绿（已完成 / AI / 坐标） |
| `--starlight` | `oklch(0.96 0.01 240)` | 柔和白（正文） |

**视觉规范**：
- 玻璃质感：`backdrop-filter: blur(40px) saturate(180%)` + 1px 内发光边
- 字体：Geist Sans (英) + 系统中文 fallback (PingFang SC / Microsoft YaHei)
- 标题用 `font-serif`（Songti SC）
- **拒绝**赛博紫、霓虹粉、Tailwind 默认 zinc——廉价 AI 通用味

---

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 启动

```bash
npm install
npm run dev      # http://localhost:3000
```

### 接入真 AI（可选）

```bash
cp .env.example .env.local
# 编辑 .env.local，填任意 OpenAI 兼容 provider
```

**推荐 provider**：
- **豆包（字节自家，TRAE 评委加分）**：火山方舟 token + `https://ark.cn-beijing.volces.com/api/v3`
- **DeepSeek（最便宜）**：送 ¥10 余额 ≈ 500 万 token
- OpenAI 官方 / 通义 / Moonshot 任选

未配置 API key 时，应用自动用 mock 数据兜底，DEMO 不依赖网络。

---

## 项目结构

```
bucket-list-ai/
├── app/                          # Next.js App Router
│   ├── api/                      # recommend + depth 两个 route
│   ├── page.tsx                  # 首屏「时间坐标」
│   ├── onboarding/               # 5 步 AI 引导
│   ├── wishes/                   # AI 推荐清单
│   ├── map/                      # 3D 世界地图
│   ├── budget/                   # 资金账本
│   └── memories/                 # 人生记录
├── components/
│   ├── brand/                    # 8 个设计系统组件
│   ├── globe/                    # 3D 地球封装
│   ├── onboarding/ wishes/ budget/ memories/
│   ├── layout/                   # AppShell / TopNav / PagePlaceholder
│   └── ui/                       # 16 个 shadcn/ui 组件
├── lib/
│   ├── store/                    # 4 个 Zustand store (localStorage)
│   ├── ai/                       # prompt + mock-data
│   ├── types/                    # wish + memory 类型
│   ├── astro.ts / zodiac.ts / life-expectancy.ts
│   ├── budget.ts / image.ts
│   └── utils.ts
└── docs/
    ├── 策划案-v0.1.md
    ├── SUBMISSION.md             # 参赛提交材料
    └── DEMO_SCRIPT.md            # 3 分钟路演脚本
```

**统计**：58 个 TS/TSX 文件，约 5,992 行代码。

---

## TRAE 大赛对齐

| 阶段 | 时间 | 目标 |
|---|---|---|
| 报名 + 初赛 | 6/16 - 7/15 | ✅ P0 核心完成（首屏 + onboarding + 推荐 + 地图） |
| 复赛 | 7/下 - 8/上 | 🚧 P1 差异化（账本 + 记录 + 空间照片）— 大部分完成 |
| 线下决赛 | 8/22 | 🚧 Tauri 三端打包 + 真 AI 联调 + 路演打磨 |

---

## 已知约束 / TODO

- [ ] AI key 真实联调（推荐 DeepSeek 或豆包）
- [ ] Tauri 2 桌面端打包
- [ ] depth-anything-3 真实接入（HuggingFace API）
- [ ] 国际化（i18n）
- [ ] 社交分享（生成清单海报）

---

## 协作

- **老茅**（茅旭东）· 字弘毅 · 号虚空建筑师 — 项目主理人
- **老赫**（Hermes）— 跨界构筑虚空建筑的伙伴（Claude）

「数据不上传，人生不下注。」

## License

MIT
