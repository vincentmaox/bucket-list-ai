# bucket-list-ai · 开发日志

> 按天记录。未来冷启动看这一个文件就能追上进度。

**项目启动**：2026-06-20
**当前状态**：2026-06-27 · P0+P1 完成度 100% · 设置页 + 4 维准备清单上线 · Tauri portable + 安装包首发 · 等 DEMO 视频 + 报名
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

## Day 18 · 2026-06-25 · Tauri dev 通 + AI prompt 反套路优化

### 完成
- **Tauri dev 编译通过**（首次 2m35s，371 crates）+ Tauri 窗口启动（`target/debug/app.exe`）
- **AI prompt 反套路优化**（`lib/ai/prompt.ts` SYSTEM_PROMPT 重写）：
  - 加 12 条反套路硬约束（禁冰岛极光/京都禅修/撒哈拉/马尔代夫/马拉松/乐器/外语/书/跳伞/潜水/雪山/父母/孩子）
  - 加「时间锚点」要求（summary 必须引用剩余周数）
  - 加「中文质感」约束（动词+名词+数字，禁翻译腔）
  - 加 MBTI 4 维**组合**解读（Ni/Te/Fi 等具体功能，非泛泛"适合 INTJ"）
- **DeepSeek 真实联调实测**（INTJ + 1990-01-01 男 + A 型血 + ¥40万 + 2,011 周）：
  - ✅ source=ai, model=deepseek-chat
  - ✅ summary 引用 2,011 周 + 融合 Ni-Te/摩羯/马/A 型 4 维画像
  - ✅ 反套路 0 命中（top 10：莫高窟临摹/浇筑混凝土桌/阿勒泰转场/半马精准配速/牯岭街旧书/腾冲热海/隆达速降/京都町屋/父亲口述史/骷髅海岸黑曜石）
  - ✅ MBTI reason 引用具体功能（"INTJ 的 Ni 渴望...""Te 喜欢闭环"）
  - ✅ 经纬度精确到 4 位、预算 3000-35000 CNY 合理分布、旅行只 1 条

### 工具链问题（待修）
- **对话存档 hook 行为不稳定**：注册后 UserPromptSubmit 工作（06-25.md 有 PENDING），但 Stop 似乎未触发（PENDING 未清）；同时 06-24.md 被莫名清空（已 git restore）。bug 待调查。
- **fallback 措施**：手动 Python 提取 jsonl 仍可用作兜底归档。

### Tauri build 限制（待处理）
- `tauri.conf.json` 的 `frontendDist: "http://localhost:3000"` 只在 dev 模式工作
- build 模式需要 `frontendDist` 指向静态文件目录（如 `../out`），但 Next.js 16 + API routes 默认不能 `output: 'export'`
- 方案待定：(A) Next.js static export + 改 AI 客户端直调；(B) Tauri 内嵌 Next.js standalone server

---

## Day 19 · 2026-06-25 · 方案 A 落地 + Tauri 桌面安装包首发

### 完成
- **方案 A 全链路打通**（Static export + 客户端直调）：
  - `next.config.ts` 加 `output: "export"` + `images.unoptimized` + `trailingSlash`
  - 新建 `lib/ai/client.ts`（把原 `/api/recommend` 逻辑搬到客户端，读 `NEXT_PUBLIC_OPENAI_*` env）
  - 改 `app/wishes/page.tsx` 用 `requestRecommendation` 客户端调用（本地 handler 重名→用 `as` 别名）
  - 删 `/api/recommend` + `/api/depth`（static export 不支持 server route）
  - `src-tauri/tauri.conf.json` `frontendDist` → `../out`（dev 仍用 `devUrl`）
- **env 变量 rename**：`OPENAI_*` → `NEXT_PUBLIC_OPENAI_*`（3 个 key，Python 脚本进程内处理，未打印值）
- **base-ui 适配**：`TooltipProvider` 的 `delayDuration={200}` → `delay={200}`（Radix 残留命名）
- **AI SDK 适配**：`createOpenAI` 移除 `compatibility: "compatible"`（新版默认兼容）
- **类型修正**：`mock-data.ts` 的 `wishes` 数组加 `as Wish[]`（修复 `category: string` 拓宽问题）
- **Tauri build 成功**（5m20s 编译，371→359 crates）：
  - `app.exe` 12 MB（raw）
  - `bucket-list-ai_0.1.0_x64_en-US.msi` 5.7 MB（MSI 安装包）
  - `bucket-list-ai_0.1.0_x64-setup.exe` 4.8 MB（NSIS 安装器）
  - 全部产物在 `src-tauri/target/release/bundle/`

### 关键决策
**为什么选方案 A 不选方案 B**：
- A 一次出 `.exe`，简单务实；B 需要内嵌 Next.js standalone server，Tauri sidecar 复杂度高
- API key 暴露给桌面应用是可接受的（桌面应用本就是单机产物，key 跟二进制走）
- 服务端 secret 这个概念对单机桌面应用没意义

### 安全事件（已处理）
Grep `.env.local` 用 `output_mode: content` 误读 DeepSeek key 进对话上下文。已建议用户轮换。后续 env 操作全部 Python 脚本进程内处理，只打印 key 名。

### 工具链状态
- **Stop hook 仍 disabled**（backup `settings.json.bak-20260625_134356-stop-disabled`），bug 待查
- **UserPromptSubmit / PreCompact / SessionStart 三个 hook 正常工作**

---

## Day 20 · 2026-06-26 · 设置页 + AI 服务商手动切换

### 完成
- **设置页全链路**（`/settings`，commit `89e129e`）：
  - `lib/ai/presets.ts`：6 家服务商预设（DeepSeek / 豆包 / OpenAI / 通义 / Moonshot / 自定义）
  - `lib/store/ai-settings-store.ts`：Zustand + persist，切换 provider 自动联动 baseURL/model
  - `lib/ai/client.ts` 改造：`getEffectiveConfig` 三层兜底（user store → NEXT_PUBLIC_ env → mock）+ `testConnection` 函数
  - `app/settings/page.tsx`：AI 配置区段（provider 下拉 + baseURL/model/Key 输入 + 显隐切换 + 测试连接 + 重置）+ 数据管理（导出 JSON / 各 store 清空 / 全部清空）+ 关于
  - `top-nav.tsx`：加齿轮入口（桌面+移动端 Sheet）
- **公发版方案落地**：build 时 NEXT_PUBLIC_OPENAI_* 注入 JS bundle（Brotli 压缩嵌入 exe），开箱即用真 AI；用户在设置页填新 key 即可覆盖
- **portable 分发**（`dist/bucket-list-ai-portable.exe` + `dist/README-PORTABLE.txt`）：双击即跑，Win10/11 自带 WebView2
- **build 修复 4 个**：
  - base-ui `TooltipProvider` 的 `delayDuration` → `delay`（Radix 残留）
  - `createOpenAI` 移除 `compatibility: "compatible"`（新版默认兼容）
  - `mock-data` wishes 数组 `as Wish[]`（字面量类型拓宽）
  - Wishes 页 `fetchRecommendation` 局部函数与 import 同名 → `as requestRecommendation`

### 验收
- ✅ 老茅双击 portable.exe 跑通（浏览器+桌面双测）
- ✅ Tauri build 用 1m15s 增量编译
- ⚠️ 但 API key 安全事件（见下）+ Stop hook 仍 disabled

### 安全事件追踪
- **06-25**：Grep `.env.local` `output_mode: content` 误读 DeepSeek key 进对话上下文 → 已建议轮换
- **06-26**：验证 portable.exe 字节流 grep 不到明文 key（Brotli 压缩），但解压可提取 → 自测 OK，公发需做无 key 版
- **教训**：CLAUDE.md 安全约束的 grep 排除规则扩大到「任何 .env 读取」（不只 Read）

---

## Day 21 · 2026-06-27 · 4 维准备清单（行为/能力/文化/资金）+ bug 修

### 老茅的核心洞察
> 「玩也是需要能力的」—— 愿望清单不能只有 prerequisites 字符串数组和 budget 数字，
> 要从清单反推**需要准备的行为、能力、文化储备**，让用户知道"为什么我做不到，缺什么"。

### 完成（commit `75cdd97` + `e8151a8`）
- **数据结构升级**：
  - `lib/types/wish.ts` 加 `WishPreparation` 类型（behavior/skill/culture，资金仍在 estimatedCost）
  - 向后兼容：旧 `prerequisites` 字段保留，preparation 缺失时 UI 回退平铺
- **进度存储**：`lib/store/preparation-progress-store.ts`（Zustand + persist）
  - key 格式：`${wishId}.${dimension}.${index}`
  - 提供 toggle / isDone / getDimensionProgress / getWishProgress / resetWish
- **UI 升级**：
  - `components/wishes/preparation-section.tsx`：单维度区段（checkbox + 维度进度）
  - `wish-card.tsx`：Dialog 升级 4 区段（资金/行为/能力/文化）+ 总进度条 + 资金跳转 `/budget?wish=wishId`
  - 卡片角标从「准备 8」升级为「准备 8 · 2/8」实时进度
- **AI prompt 升级**（`lib/ai/prompt.ts`）：
  - 加「4 维准备清单」章节（动词开头/名词+技能/具体作品+关联）
  - 加反例库（"做好准备"/"提升体能"/"了解当地文化" 全部禁止）
  - JSON schema 加 preparation 字段示例
- **mock-data 全填**：10 条愿望 × 4 维 = 约 90 项具体动作/技能/书目（非占位 placeholder）
  - 例：冰岛极光 → 办申根签证（提前 30 天，需 6 个月银行流水）/ 长曝光摄影 f/8 ISO 100 30s / 读《北极神话：冰岛萨迦》

### bug 修：useSyncExternalStore 无限循环（commit `e8151a8`）
- **症状**：浏览器控制台告警「The result of getSnapshot should be cached to avoid an infinite loop」`wish-card.tsx:62`
- **根因**：`usePreparationProgressStore((s) => s.getWishProgress(...))` — selector 调用 helper 返回**新对象**，Object.is 比较永远不等 → 无限 re-render
- **修法**：改为订阅稳定引用的 `done` map + 组件内 `useMemo` 缓存计算
- **memory 沉淀**：`feedback_zustand_selector.md`，记第 3 次踩同款雷（Day 8 / Day 12 旧账）

### 工具链状态
- Stop hook 仍 disabled
- Tauri portable 重打 3 次（设置页 / 4 维准备 / bug 修），增量编译稳定 1-2 min

---

## Day 15-17 · 2026-06-22 ~ 2026-06-24 · TRAE Work DEMO 视觉升级

---

## Day 15-17 · 2026-06-22 ~ 2026-06-24 · TRAE Work DEMO 视觉升级

### 背景
Day 14 后项目代码已就绪（P0 闭环）。老茅用 TRAE Work 把单文件 demo（`D:\01_Project\my-bucket-list\bucket-list-ai.html`）重新生成了一版，发现**视觉层次太简单**——缺主项目那种纵深感（参见 memory `project_demo_vs_main_gap.md`）。

### 完成
- **Day 15-16（06-22 / 06-23）**：项目静默。老茅处理线下事务（大赛报名 / AI key 申请等）。git 无 commit，jsonl 无对话记录。
- **Day 17（06-24）**：
  - `docs/TRAE_WORK_PROMPT.md` v1 → v2 大改（**+312 / -143 行**）
    - 标题：从「参赛生成提示词」→「视觉层次优化指令 v2」
    - 底层逻辑锁定四维补齐：**空间纵深 + 动画密度 + 信息层级 + 负空间淡出**
  - 调 `frontend-design` skill 协助提示词结构设计
  - 06-24 15:08 commit v1（`6edf861`）；v2 改动本次会话提交

### 关键决策
**为什么不直接在 Next.js 主项目里调视觉**：TRAE Work 生成的是单文件 HTML，用于初赛「创意产物」赛道，与 Next.js 主项目并行。两个产物定位不同——HTML 给评委即开即看（无 build 依赖），Next.js 给 8/22 路演现场（真实可交互）。

### 工具链状态
- **save_conversation_turn.py hook 已注册**（本次会话末尾）：4 事件全部就位（UserPromptSubmit / Stop / PreCompact / SessionStart），备份在 `~/.claude/settings.json.bak-20260624_234649`。
- 老茅下次新开会话起，对话自动归档到 `conversation_log/<date>.md`，无需手动。
- 本次会话已从 jsonl 手动提取 06-24 对话补到 `conversation_log/2026-06-24.md`（208 轮，作为 hook 启用前的历史补档）。

---

## 待办（按优先级）

### P0 · 老茅必做（7/15 初赛前）
1. ~~报名 TRAE 大赛~~（处理中）
2. ~~申请 AI key~~（DeepSeek 已申请，待轮换 + 加豆包字节加分）
3. **录 3 分钟 DEMO 视频**（按 `docs/DEMO_SCRIPT.md`）
4. ~~GitHub 建仓库 + push~~ ✅ 已完成（origin/main 16+ commits）
5. **真测 portable.exe**（设置页 + 4 维准备 + 真生成的 AI 推荐）
6. **公发版打包**（NEXT_PUBLIC_* 留空 build，避免 key 泄露）
7. README + SUBMISSION 打磨（评委第一眼）

### P1 · 决赛加分（8/22 前）
1. Tauri 2 三端打包（macOS/iOS/Android）
2. depth-anything-3 真实接入（HuggingFace API）
3. 真 AI key 联调 prompt 质量（设置页接入后持续优化）
4. 4 维准备进度持久化 + 跨设备同步

### P2 · 后续
1. 国际化（i18n 英文版）
2. 社交分享（生成清单海报）
3. 多用户协作（家庭清单）

### P3 · 工具链/质量（穿插）
1. **Stop hook bug 修**（settings.json 备份在 `.bak-20260625_134356-stop-disabled`）
2. CI/CD（GitHub Actions auto build）
3. 核心算法单测（astro / zodiac / life-expectancy）
4. 错误监控（Sentry）

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
