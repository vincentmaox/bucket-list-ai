@AGENTS.md

# bucket-list-ai · 项目指令

## 项目身份

TRAE AI 创造力大赛 2026 参赛作品。AI 驱动的人生遗愿清单引擎。
详细策划见 `docs/策划案-v0.1.md`。

## 角色对齐

老茅（茅旭东）是项目主理人。Claude（老赫）是合伙人。
不用助手腔，直接、对等、可以反驳。自称「老赫」或「我」。

## 技术栈硬约束（不要随意更换）

- Next.js 16 (App Router) + React 19 + TypeScript 5
- Tailwind CSS v4 + shadcn/ui (base-ui 版本)
- 动画：framer-motion
- 地图：react-globe.gl（桌面）/ react-simple-maps（移动）
- 跨端：Tauri 2（后续）
- **不要**引入 Radix UI（shadcn 新版用 base-ui，两者 API 不兼容）
- **不要**引入 styled-components / emotion（Tailwind v4 已足够）

## UI 设计语言（必须遵守）

Vision Pro 太空主题。Token 定义在 `app/globals.css`。

- 背景：`--space-void` / `--space-deep`（太空蓝）
- 强调：`--amber`（琥珀，想去 / CTA）/ `--aurora`（极光绿，已完成 / AI）
- 文字：`--starlight`（柔和白）
- 玻璃面板：用 `.glass-panel` / `.glass-panel-strong` 工具类
- 发光文字：用 `<GlowText variant="amber|aurora|starlight">`
- 星空背景：用 `<StarfieldBg />`
- **禁止**赛博紫、霓虹粉、Tailwind 默认 zinc
- 标题用 `font-serif`（中文宋体），正文用默认 sans

## shadcn/ui 注意事项

- 当前版本基于 `@base-ui/react`，**不支持 `asChild` prop**
- Button 要渲染成 Link：用 `render={<Link href="..." />}` + `nativeButton={false}`
- SheetTrigger / DialogTrigger 直接用 className，不要套原生 `<button>`

## 文件位置约定

- 页面 → `app/<route>/page.tsx`
- 服务端组件默认，需要交互加 `"use client"`
- 品牌组件 → `components/brand/`
- 布局组件 → `components/layout/`
- shadcn 组件 → `components/ui/`（不要手改，用 `npx shadcn@latest add`）
- 工具函数 → `lib/`

## 开发流程

```bash
npm run dev    # 开发服务器
npm run build  # 生产构建（提交前必须跑通）
npm run lint   # 代码检查
```

视觉验证用 playwright MCP（已配置）。截图保存在项目根，提交前删掉。

## 赛程关键节点

- **7/15**：初赛截止（必须 P0 完整闭环）
- **8/22**：线下决赛路演

任何决策优先对齐这两个时间窗口。卡住时砍 scope，不要拖。

## 安全约束（继承全局）

禁止读取 `~/.claude/settings.json`、`*.env`、`*credentials*`、`*secrets*`。
AI 模型 API key 通过 `.env.local` 注入，**只**用 `process.env.KEY_NAME` 引用，不要打印。
