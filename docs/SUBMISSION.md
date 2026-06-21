# bucket-list-ai · 参赛提交材料

> 「让每个人死前没有遗憾」——把模糊的人生焦虑，做成可执行的资金约束优化问题。

**TRAE AI 创造力大赛 2026 · 参赛作品**

---

## 一、项目介绍（300 字）

**bucket-list-ai** 是一款 AI 驱动的人生遗愿清单引擎。

它做的事情很简单：基于用户的剩余寿命、收入约束、性格画像（MBTI + 星座 + 生肖 + 血型），用 AI 生成一份**只属于这个人**的人生体验清单，并陪他/她把它一件件干掉。

用户进入应用，AI 用 5 个问题在 1 分钟内完成画像采集，然后展示一个让人脊背发凉的画面——「你还有 2,011 周」。接着是 10 个 AI 推荐的人生体验，每个都附性格契合度评分 + 资金分解 + 时间窗口。这些愿望被自动放到 3D 地球上发光，配合资金账本算出每月攒钱节奏，最终通过人生记录模块把完成的体验封存为时间倒序的「人生碎片河」。

整个应用运行在浏览器，所有数据存 localStorage，**用户隐私零上传**。

它不替用户活，但帮用户看见自己。

---

## 二、五大差异化卖点（评委记忆点）

### 1. 「时间坐标」首屏——不是 AI demo 标准套路

抛弃了 count-up 数字 + glassmorphism + 三卡片 features 的通用 AI 套路。首屏是一个**用户专属的星图**：中央巨型 monospace 数字（带光晕）+ 周围 4 个发光节点（MBTI/星座/生肖/血型）用流动虚线连到中心，背景是极光绿坐标网格 + 缓慢扫描线 + 角落坐标文字（北京经纬度 / 录制时间戳 / 信号频率 / 版本号）。

**评委 30 秒记住的画面**：你的性格画像在天上发光连线，中央是你还剩多少周。

### 2. 周点阵（life-in-weeks）——Tim Urban 的存在主义冲击

把整个人生可视化成 **3,900+ 个圆点**，每个点是一周。已度过的化为暗灰，剩余的发出琥珀色光芒（随剩余量递减），本周脉动光环。

**评委碎心画面**：当用户看到自己人生已经走过了一半的暗灰点阵，剩下的还在发光——这不是抽象数字，是肉眼可见的死亡。

### 3. AI 推荐引擎——LLM prompt 驱动，不查表

不依赖 MBTI→活动 的静态规则库，把 MBTI 4 维度 + 星座元素（火/土/风/水）+ 生肖特质 + 血型 + 收入约束 + 剩余时间 全部作为 prompt context 喂给 LLM，让模型生成个性化推荐。每条推荐必须引用用户的性格特质作为论据（"INTJ 的内倾直觉让你能独自消化漫长等待后的震撼"）。

用 Vercel AI SDK 的 `generateObject` + zod schema 严格约束输出，确保 JSON 结构稳定。支持 OpenAI / DeepSeek / 火山方舟豆包（**字节自家，TRAE 评委加分**）/ 通义 / Moonshot 任意 OpenAI 兼容 provider，**无 key 时自动 fallback mock 数据**，演示永不翻车。

### 4. 3D 地球 + 愿望 ↔ 地图联动

用 `react-globe.gl`（Three.js 封装）渲染夜景地球，大气辉光设为极光绿色。AI 推荐的每个带地理位置的愿望自动变成地球上的发光点（琥珀=想去 / 极光绿=已完成）。

**关键交互**：在愿望清单页点任意卡片的「在地球上看看」按钮，跳转到地图页，地球自动暂停旋转、1.2s 动画过渡到该愿望的地理位置，5 秒后恢复自转。

### 5. 空间照片（CSS 视差 + depth-anything-3 hook）

每张人生记录照片默认带空间感：鼠标移动时照片根据位置做 perspective + rotateX/Y，多层视差（高光 overlay + 阴影 multiply + 内发光），强化 Vision Pro 美学。

留了 `/api/depth` hook route，未来接入字节自家 **depth-anything-3**（HuggingFace Inference API），用真实深度图做更精确的视差合成。

---

## 三、技术架构

### 技术栈

| 层 | 选型 | 理由 |
|---|---|---|
| 框架 | Next.js 16 (App Router) + React 19 + TypeScript 5 | 最新栈，RSC + Streaming |
| 样式 | Tailwind CSS v4 + shadcn/ui (base-ui) | 原子化 + 设计系统 |
| 动画 | framer-motion + 自定义 SVG keyframes | 入场动画 + 微交互 |
| 状态 | Zustand + persist (localStorage) | 4 个独立 store，零服务端 |
| 地图 | react-globe.gl + three.js | 3D WebGL 地球 |
| AI | Vercel AI SDK v6 + generateObject + zod | 多 provider + schema 严格 |
| 跨端 | Tauri 2（计划） | 一套代码三端 |

### 数据流

```
用户输入 (onboarding 5 步)
   ↓
user-store (localStorage)
   ↓
POST /api/recommend
   ↓ (有 key → 真 AI; 无 key → mock)
wishes-store (localStorage)
   ↓
   ├→ /wishes 渲染 10 张卡片
   ├→ /map 3D 地球标记点位
   ├→ /budget 资金分配
   └→ /memories 关联记录

budget-store (可支配比例 + 每愿望已攒)
memory-store (照片/文字 时间倒序)
```

### 模块矩阵

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

## 四、TRAE 大赛对齐分析

### 主题对齐：世界很大，放手去造

bucket-list-ai 把「世界很大」字面化——3D 地球上每个发光点都是用户想去的远方。AI 不替用户活，但帮他看见这个世界还有哪些角落值得去。

### 评委关注点回应

| 评委关注 | 项目回应 |
|---|---|
| AI 创造力 | LLM prompt 驱动性格画像推荐 + 性格 reason 引用 + generateObject 严格 schema |
| 产品完成度 | 6 页面完整闭环 + 4 store 数据持久化 + mock fallback 防演示翻车 |
| 情感冲击力 | 周点阵 + 时间坐标首屏 + "你还有 X 周"巨型数字 |
| 跨端能力 | PWA 即开即用，Tauri 2 三端打包（计划） |
| 字节生态加分 | 火山方舟豆包 provider 支持 + depth-anything-3 hook 预留 |

### 参赛工具合规

全程可在 **TRAE IDE 中国版** 开发（项目是标准 Next.js + TypeScript，无特殊依赖）。

---

## 五、开发运行指南

### 环境要求

- Node.js 18+ 
- npm 或 pnpm

### 启动

```bash
# 安装依赖
npm install

# 开发模式（默认 http://localhost:3000）
npm run dev

# 生产构建
npm run build && npm run start
```

### 接入真 AI（可选）

复制 `.env.example` 为 `.env.local`，填入任意 OpenAI 兼容 provider：

```bash
# 豆包（字节自家，加分）
OPENAI_API_KEY=你的火山方舟 token
OPENAI_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
OPENAI_MODEL=doubao-pro-32k

# 或 DeepSeek / OpenAI / 通义 / Moonshot
```

未配置时应用自动用 mock 数据兜底，DEMO 不依赖网络。

---

## 六、附录：项目结构

```
bucket-list-ai/
├── app/                          # 8 个路由
│   ├── api/recommend/route.ts    # AI 推荐引擎（generateObject + zod）
│   ├── api/depth/route.ts        # depth-anything-3 hook
│   ├── page.tsx                  # 首屏「时间坐标」
│   ├── onboarding/page.tsx       # 5 步 AI 引导
│   ├── wishes/page.tsx           # AI 推荐清单
│   ├── map/page.tsx              # 3D 世界地图
│   ├── budget/page.tsx           # 资金账本
│   └── memories/page.tsx         # 人生记录
├── components/
│   ├── brand/                    # 8 个设计系统组件
│   │   ├── constellation-map.tsx # 时间坐标星图
│   │   ├── coordinate-grid.tsx   # 坐标网格背景
│   │   ├── life-in-weeks.tsx     # 周点阵（3900+ 圆点）
│   │   ├── glass-card.tsx        # 玻璃质感卡片
│   │   ├── glow-text.tsx         # 发光文字
│   │   ├── starfield-bg.tsx      # 星空背景
│   │   ├── count-up.tsx          # RAF 数字动画
│   │   └── index.ts
│   ├── globe/world-globe.tsx     # 3D 地球封装
│   ├── onboarding/onboarding-flow.tsx
│   ├── wishes/wish-card.tsx
│   ├── budget/{budget-summary,budget-card}.tsx
│   ├── memories/{memory-card,memory-uploader,spatial-photo}.tsx
│   ├── layout/{app-shell,top-nav,page-placeholder}.tsx
│   └── ui/                       # 16 个 shadcn/ui 组件
├── lib/
│   ├── store/                    # 4 个 Zustand store
│   │   ├── user-store.ts
│   │   ├── wishes-store.ts
│   │   ├── budget-store.ts
│   │   └── memory-store.ts
│   ├── ai/{prompt,mock-data}.ts  # AI prompt + 兜底数据
│   ├── types/{wish,memory}.ts
│   ├── astro.ts                  # 星座计算
│   ├── zodiac.ts                 # 生肖计算
│   ├── life-expectancy.ts        # 28 国平均寿命 + 剩余周数
│   ├── budget.ts                 # 资金计算
│   └── image.ts                  # Canvas 图片压缩
└── docs/
    ├── 策划案-v0.1.md
    ├── SUBMISSION.md             # 本文档
    └── DEMO_SCRIPT.md            # 3 分钟路演脚本
```

**代码统计**：58 个 TypeScript/TSX 文件，约 5,992 行代码（含 shadcn/ui 标准组件）。

---

## 七、已知约束 / 后续规划

- [ ] AI key 真实联调（DeepSeek / 豆包 provider）
- [ ] Tauri 2 桌面端打包（macOS / Windows）
- [ ] depth-anything-3 真实接入（HuggingFace API）
- [ ] 国际化（i18n，英文版）
- [ ] 社交分享（生成清单海报）
- [ ] 多用户协作（家庭清单）

---

**联系方式**：老茅（茅旭东）· 字弘毅 · 号虚空建筑师
**协作 AI**：老赫（Hermes）· 跨界构筑虚空建筑的伙伴

「数据不上传，人生不下注。」
