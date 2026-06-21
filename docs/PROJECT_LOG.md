# bucket-list-ai · 开发日志

> 按天记录。未来冷启动看这一个文件就能追上进度。

**项目启动**：2026-06-20
**当前状态**：2026-06-21 · P0+P1 完成度 95%
**目标**：TRAE AI 创造力大赛 2026（7/15 初赛 / 8/22 决赛）

---

## Day 1 · 2026-06-20 · 项目奠基

### 完成
- 调研 TRAE 大赛规则 + 同类产品（Death Clock / longevity / BucketList.co）
- 调研可借鉴 GitHub 仓库（react-globe.gl / assistant-ui / depth-anything-3）
- 写完整策划案（`docs/策划案-v0.1.md`）
- Next.js 16 + React 19 + Tailwind v4 + shadcn/ui 初始化
- 装 framer-motion / zustand / next-themes / sonner / date-fns
- shadcn/ui 初始化（base-ui 版本，不是 Radix）
- 加 14 个常用 shadcn 组件

### 踩坑
- shadcn 新版用 base-ui，**不支持 asChild**。Button 渲染 Link 用 `render={<Link />}` + `nativeButton={false}`
- SheetTrigger 不能套原生 `<button>`（button-in-button hydration 炸）

---

## Day 2 · 3D 世界地图

### 完成
- 装 react-globe.gl + three
- `components/globe/world-globe.tsx`（dynamic ssr:false + 自适应宽度）
- `app/map/page.tsx` 接入 9 个测试点位
- 点击弹 Dialog 显示详情

### 踩坑
- unpkg 国内访问抖（ERR_NETWORK_CHANGED）→ 下载纹理到 `public/textures/`
- react-globe.gl canvas 默认 absolute，父容器必须 `position: relative`

---

## Day 3 · onboarding AI 引导

### 完成
- `lib/astro.ts` 星座计算（12 种 + 元素 + 特质）
- `lib/zodiac.ts` 生肖计算（12 种 + emoji + 特质）
- `lib/life-expectancy.ts` 28 国平均寿命 + calcLife
- `lib/store/user-store.ts` Zustand + persist
- `components/onboarding/onboarding-flow.tsx` 5 步问卷 + framer-motion 动画
- 首屏动态读 store 显示真实数据

### 实测
1990-01-01 男 CN：剩余 2,011 周 / 摩羯座土象 / 🐴 属马 / A 型血

---

## Day 4 · AI 推荐引擎

### 完成
- `lib/types/wish.ts` 类型
- `lib/ai/prompt.ts` system + user prompt
- `lib/ai/mock-data.ts` 10 条兜底数据
- `app/api/recommend/route.ts` POST route
- `components/wishes/wish-card.tsx` 玻璃卡片
- `app/wishes/page.tsx` 接入

### 关键设计
- 无 API key 时自动 fallback mock
- 支持 OpenAI / DeepSeek / 豆包 / 通义 / Moonshot 任意 OpenAI 兼容 provider

---

## Day 5 · 愿望 ↔ 地图联动

### 完成
- `lib/store/wishes-store.ts` 持久化推荐结果
- WorldGlobe 加 `focusPoint` prop（暂停旋转 + 1.2s 动画过渡 + 5s 恢复）
- WishCard 加"在地球上看看"按钮 → `/map?focus=wish-id`
- map 页读 store + URL focus param + Suspense 包裹

---

## Day 6 · 首屏视觉升级 + 周点阵

### 完成
- `components/brand/life-in-weeks.tsx` SVG 矩阵 3900+ 圆点
- `components/brand/count-up.tsx` RAF 数字动画
- 首屏 Hero 加 count-up + LifeInWeeks + Quick Stats

### 踩坑
- CountUp 用 useRef 防重入 + React 严格模式 → cleanup cancel raf → 数字卡 0
- 改成纯 useEffect + cleanup，每次 target 变化重启

---

## Day 7 · 资金账本

### 完成
- `lib/store/budget-store.ts`（savedByWish + disposableRatio）
- `lib/budget.ts` 月供/达成日期计算
- `components/budget/{budget-summary,budget-card}.tsx`
- `app/budget/page.tsx` 三态引导

### 实测
INTJ + ¥40万 + 10 愿望：月可支配 ¥1万 / 总目标 ¥16万 / 全部达成 16 月 → 2027/10

---

## Day 8 · 人生记录

### 完成
- `lib/store/memory-store.ts`
- `lib/image.ts` Canvas 压缩（max 1200px + quality 0.65）
- `components/memories/{memory-card,memory-uploader}.tsx`
- `app/memories/page.tsx` Tabs（照片/文字）+ 瀑布流

### 踩坑
- `s.data?.wishes ?? []` 每次创建新数组引用 → React 19 useSyncExternalStore 警告
- 改成模块级 `const EMPTY: Wish[] = []` 复用引用

---

## Day 9 · AI 输出严格化

### 完成
- 装 zod
- `/api/recommend` 改用 `generateObject` + zod schema（之前是 generateText + 手动 parse）
- 加 maxRetries: 2 + AI 失败优雅 fallback mock + 详细错误消息

---

## Day 10 · 首屏「时间坐标」重塑

### 完成（调 frontend-design skill）
- `components/brand/coordinate-grid.tsx`（坐标网格 + 扫描线 + 4 角落标记）
- `components/brand/constellation-map.tsx`（中央数字 + 4 节点流动虚线连线）
- 抛弃 count-up + 三卡片 features 套路
- 双语标题 + 元数据坐标格式 + CTA 文字路径

### 差异化
- 角落坐标文字（北京经纬度 / T+0:00:00 [REC] / SIG·LOCK 42.7Hz / v0.1.0-alpha）
- 节点 spring 入场 + 虚线流动（`animate-dash-flow`）

---

## Day 11 · 空间照片

### 完成
- `components/memories/spatial-photo.tsx`（CSS 视差：鼠标 perspective + 多层高光阴影 mix-blend）
- `app/api/depth/route.ts` 占位 hook（未来接 depth-anything-3）
- MemoryCard 集成

### 决策
先做 CSS 视差而非真接 depth-anything-3：评委视觉分不出，体验等价，免 HF token。

---

## Day 12 · 初赛提交材料

### 完成
- `README.md` 重写（170 行）
- `docs/SUBMISSION.md`（232 行，评委核心文档）
- `docs/DEMO_SCRIPT.md`（226 行，3 分钟路演分镜）
- 项目代码盘点：58 文件 / 5992 行

---

## Day 13 · 多页面细节打磨

### 完成
- `globals.css` 加 shimmer / slider-amber / glass-select / progress-aurora / scan-line / node-breathe / dash-flow
- Skeleton 从 pulse 升级到 shimmer
- 首屏数字响应式（text-5xl→9xl）
- 元数据 flex-wrap
- budget slider 自定义 thumb + 进度条渐变
- onboarding MBTI grid 3/4 列响应式 + hover scale
- memories 上传"封存中..." loading 状态

### 踩坑
- Tailwind v4 `[&_[data-slot]]:utility` 不能作用于**自定义** utility 类
- 改用全局 CSS `@layer utilities` + descendant selector + `!important`

---

## Day 14 · 2026-06-21 · 持久化 + 版本控制

### 完成
- 建 memory 系统（7 个文件，下次冷启动自动恢复项目全貌）
- 写 `docs/PROJECT_LOG.md`（本文件）
- 写 `docs/HANDBOOK.md`（开发手册）
- git 首次完整 commit
- 调用 save_conversation_turn.py 存档对话

---

## 待办（按优先级）

### P0 · 老茅必做
1. **报名 TRAE 大赛**（trae.cn/ai-creativity）
2. **申请 AI key**（DeepSeek 送 ¥10 / 豆包字节加分）
3. **录 3 分钟 DEMO 视频**（按 `docs/DEMO_SCRIPT.md`）
4. **GitHub 建仓库 + push**

### P1 · 决赛加分
1. Tauri 2 三端打包（macOS/Windows/iOS/Android）
2. 真 AI key 联调 prompt 质量
3. depth-anything-3 真实接入（HuggingFace API）

### P2 · 后续
1. 国际化（i18n 英文版）
2. 社交分享（生成清单海报）
3. 多用户协作（家庭清单）

---

## 关键决策记录

### 为什么用 base-ui 不用 Radix
shadcn 新版默认就是 base-ui（Radix 团队新作），React 19 兼容更好。不可换。

### 为什么不接真 AI key 在 demo 里
评委演示网络可能挂。Mock 数据兜底确保永不翻车。真 AI 留作"接入即用"。

### 为什么先做 CSS 视差而非真 depth-anything-3
1. 真接需 HF token（老茅又得申请）
2. 模型推理 5-15s/张，UX 差
3. 评委视觉分不出
4. 留 `/api/depth` hook，未来真接直接填

### 为什么用 Zustand 不用 Redux
4 个独立 store，零服务端，persist 到 localStorage。Redux 太重。

### 为什么不引入新字体
Geist Sans + Geist Mono 已足够 distinctive。Inter 是廉价 AI 通用味。
