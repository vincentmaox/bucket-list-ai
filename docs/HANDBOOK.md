# bucket-list-ai · 开发手册

> 给未来的老赫 / 任何接手这个项目的 Claude 的 onboarding 文档。
> 读这一个文件 + `docs/PROJECT_LOG.md` 就能上手。

---

## 一、身份对齐

- **老茅**（茅旭东）· 字弘毅 · 号虚空建筑师 · 项目主理人
- **老赫**（Hermes）· 跨界构筑虚空建筑的伙伴（Claude）

**输出风格**：
- 自称「老赫」或「我」
- 直接、对等、可以反驳老茅
- **禁止助手腔**（"为您服务""请问还有什么"）
- 每日结束用 `AskUserQuestion` 给下一天 4 个选项

**对话存档**：用 `~/.claude/scripts/save_conversation_turn.py`，主体标签 `**老茅:**` / `**老赫:**`

---

## 二、技术栈硬约束（不要随意更换）

| 层 | 选型 | 备注 |
|---|---|---|
| 框架 | Next.js 16 (App Router) + React 19 + TypeScript 5 | 最新栈 |
| 样式 | Tailwind CSS v4 + shadcn/ui (**base-ui**) | 不是 Radix |
| 动画 | framer-motion + 自定义 SVG keyframes | 不要装 GSAP |
| 状态 | Zustand + persist (localStorage) | 不要 Redux |
| 地图 | react-globe.gl + three.js | 不要 Leaflet/Mapbox |
| AI | Vercel AI SDK v6 + generateObject + zod | 不要 LangChain |
| 跨端 | Tauri 2（计划） | 不要 Electron |

### 严禁引入
- Radix UI（与 base-ui API 不兼容）
- styled-components / emotion（Tailwind v4 已够）
- Inter / Roboto / Arial 字体（廉价 AI 味）
- 赛博紫 / 霓虹粉配色

---

## 三、设计语言（必须遵守）

### 配色 token（`app/globals.css` :root）

```css
--space-void:    oklch(0.13 0.025 260);  /* 最深背景 */
--space-deep:    oklch(0.18 0.04 256);   /* 太空蓝主背景 */
--amber:         oklch(0.82 0.16 71);    /* 琥珀：想去 / CTA / 数字 */
--aurora:        oklch(0.91 0.15 172);   /* 极光绿：已完成 / AI / 坐标 */
--starlight:     oklch(0.96 0.01 240);   /* 柔和白：正文 */
```

### 字体
- 英文：Geist Sans（已加载 next/font/google）
- 中文：系统 fallback（PingFang SC / Microsoft YaHei）
- 标题：`font-serif`（Songti SC / STSong）
- 数字：`font-mono`（Geist Mono）

### 必备工具类（globals.css 已定义）

| 类 | 用途 |
|---|---|
| `.glass-panel` / `.glass-panel-strong` | 玻璃质感容器 |
| `.text-glow-amber/aurora/starlight` | 发光文字 |
| `.border-glow-amber/aurora` | 边框光晕 |
| `.gradient-aurora` | amber→aurora→purple 渐变 |
| `.starfield` | 星空背景 |
| `.shimmer` | skeleton 流光（替代 animate-pulse） |
| `.slider-amber` | 自定义 range thumb |
| `.progress-aurora` | 进度条渐变（作用到 indicator） |
| `.animate-scan-line` | 扫描线（9s 周期） |
| `.animate-node-breathe` | 节点脉动 |
| `.animate-dash-flow` | 虚线流动 |
| `.animate-glow-breathe` | CTA 呼吸光晕 |

---

## 四、踩坑清单（详见 `memory/feedback_tech_pitfalls.md`）

### 1. shadcn/ui 新版用 base-ui 不是 Radix
- ❌ `asChild` 不能用
- ✅ Button 渲染 Link：`render={<Link href="..." />} nativeButton={false}`
- ❌ SheetTrigger/DialogTrigger 不能套原生 `<button>`

### 2. Tailwind v4 arbitrary variant 限制
- ❌ `[&_[data-slot]]:gradient-aurora` 无效（自定义 utility 不能用这语法）
- ✅ 全局 CSS `@layer utilities` + descendant selector + `!important`

### 3. Zustand selector + `?? []`
- ❌ `useStore((s) => s.data?.items ?? [])` 触发 useSyncExternalStore 警告
- ✅ 模块级 `const EMPTY: T[] = []` 复用引用

### 4. CountUp + React 严格模式
- ❌ useRef 防重入（cleanup cancel 第一次 raf）
- ✅ 纯 useEffect + cleanup，每次 target 变化重启

### 5. unpkg 国内抖动
- 关键纹理/资源下载到 `public/` 本地引用

### 6. react-globe.gl canvas 定位
- 父容器必须 `position: relative`

### 7. base-ui Progress 结构
- Root → Track (bg-muted) → Indicator (bg-primary)
- 美化进度条作用到 `[data-slot=progress-indicator]`

### 8. next/dynamic ssr:false
- 必须在 client component 里用，server component 会报错

---

## 五、文件位置约定

| 类型 | 路径 |
|---|---|
| 页面 | `app/<route>/page.tsx` |
| API route | `app/api/<name>/route.ts` |
| 品牌组件 | `components/brand/` |
| 业务组件 | `components/<module>/` |
| 布局组件 | `components/layout/` |
| shadcn 组件 | `components/ui/`（**不要手改**，用 `npx shadcn@latest add`） |
| Store | `lib/store/` |
| 工具函数 | `lib/` |
| 类型 | `lib/types/` |
| 静态资源 | `public/` |

### 服务端 vs 客户端
- 默认 server component
- 需要 `useState` / `useEffect` / 事件 → 加 `"use client"`
- 用 `useSearchParams` 必须包 `<Suspense>`

---

## 六、开发流程

### 启动
```bash
npm run dev      # http://localhost:3000
npm run build    # 生产构建
npm run lint     # ESLint
```

### 添加 shadcn 组件
```bash
npx shadcn@latest add <component-name>
```

### 视觉验证
用 playwright MCP（已配置）。
- 截图保存到项目根，提交前删（`.gitignore` 已含 `homepage-*.png`）
- Read 工具在这个 MCP 环境不返图，老赫靠 `browser_evaluate` + DOM 检查判断

---

## 七、AI provider 配置

复制 `.env.example` 为 `.env.local`，填任意 OpenAI 兼容 provider：

| Provider | baseURL | Model |
|---|---|---|
| 豆包（字节加分） | `https://ark.cn-beijing.volces.com/api/v3` | endpoint id 如 `ep-2024xxxx` |
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat` |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` |
| 通义 | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-plus` |
| Moonshot | `https://api.moonshot.cn/v1` | `moonshot-v1-32k` |

**未配置时自动 fallback mock 数据**，DEMO 不依赖网络。

---

## 八、安全约束（继承全局）

- **禁止读取** `~/.claude/settings.json`、`*.env`、`*credentials*`、`*secrets*`
- API key 通过 `.env.local` 注入，**只**用 `process.env.KEY_NAME` 引用，**不要打印**
- 用户贴密码/token → 立即在下一条响应顶部提醒轮换

---

## 九、赛程关键节点

- **7/15**：初赛截止（P0 必须完整闭环）✅ 已就绪
- **8/22**：线下决赛路演

任何决策优先对齐这两个时间窗口。卡住时砍 scope，不要拖。

---

## 十、协作 checklist（每次会话开始）

- [ ] 读 `docs/PROJECT_LOG.md` 看最新进展
- [ ] 读 `docs/HANDBOOK.md`（本文件）
- [ ] 检查 memory 系统（`~/.claude/projects/.../memory/MEMORY.md`）
- [ ] 跑 `npm run dev` 确认项目能起
- [ ] 跟老茅确认今天主攻方向（AskUserQuestion）

## 十一、对话存档系统

### 现状（2026-06-24）
- `~/.claude/scripts/save_conversation_turn.py` 存在，但**未注册**到 `~/.claude/settings.json` 的 hooks
- 当前所有对话归档靠老赫**从 jsonl 手动提取**（`~/.claude/projects/.../*.jsonl` → `conversation_log/<date>.md`）
- 一旦 hook 注册，会自动落到 `conversation_log/<date>.md`，无需手动

### Hook 注册（待老茅执行）
脚本支持 4 个事件，需要全部注册到 `~/.claude/settings.json`（含密文件，用 `update-config` skill 操作或 Edit 非密锚点）：

| Event | 行为 |
|---|---|
| `UserPromptSubmit` | 老茅 prompt 一提交就 append，标 `[PENDING:sid]` |
| `Stop` | 老赫回复完成，清 PENDING + 追加回复 |
| `PreCompact` | 压缩前快照 jsonl 到 `conversation_log/_snapshots/` |
| `SessionStart` | 注入近 5 轮对话回上下文 |

参考片段（路径用绝对路径，含 `\` 需转义）：
```jsonc
{
  "hooks": {
    "UserPromptSubmit": [{"matcher": "*", "hooks": [{"type": "command", "command": "python C:\\Users\\maoxu\\.claude\\scripts\\save_conversation_turn.py"}]}],
    "Stop":             [{"matcher": "*", "hooks": [{"type": "command", "command": "python C:\\Users\\maoxu\\.claude\\scripts\\save_conversation_turn.py"}]}],
    "PreCompact":       [{"matcher": "*", "hooks": [{"type": "command", "command": "python C:\\Users\\maoxu\\.claude\\scripts\\save_conversation_turn.py"}]}],
    "SessionStart":     [{"matcher": "*", "hooks": [{"type": "command", "command": "python C:\\Users\\maoxu\\.claude\\scripts\\save_conversation_turn.py"}]}]
  }
}
```

### 手动归档 fallback
未注册期间，老赫用本会话同款 python 脚本从 jsonl 提取：
```bash
python -c "
import json
from pathlib import Path
JSONL_DIR = Path(r'C:/Users/maoxu/.claude/projects/D--ClaudeCodeProjects-bucket-list-ai')
# ... 遍历 jsonl，提取 type=user/assistant 的 text，写入 conversation_log/<date>.md
"
```

### 主体标签约定
- **老茅:**（不用 `**User:**`）
- **老赫:**（不用 `**Assistant:**`）
- 每轮 `## HH:MM:SS · **label**` 头
- 截断：老茅 4000 字 / 老赫 8000 字（脚本默认）

---

## 十二、协作 checklist（每次会话结束）

- [ ] 更新 `docs/PROJECT_LOG.md`（加 Day N 条目）
- [ ] 有重大决策/踩坑 → 更新 memory 系统
- [ ] git commit
- [ ] 调用 `~/.claude/scripts/save_conversation_turn.py` 存档
