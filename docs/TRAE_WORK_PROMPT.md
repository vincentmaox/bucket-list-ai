# TRAE Work 视觉层次优化指令 v2

> 目标：将 `my-bucket-list.html` 的单文件 demo 首屏视觉冲击力，提升至接近 bucket-list-ai 主项目（Next.js + Tailwind v4 + framer-motion）的水平。
>
> 底层逻辑：**空间纵深 + 动画密度 + 信息层级 + 负空间淡出** 四维度补齐。

---

## 先决条件（执行本指令前必读）

1. 文件保持单文件 HTML，所有 CSS/JS 内联，不引入任何动画库，不引入 build 工具。
2. 配色严格沿用现有 5 个 CSS 变量（`--space-void` / `--space-deep` / `--amber` / `--aurora` / `--starlight`），禁止新增赛博紫/霓虹粉。
3. 每条优化都给了可直接粘贴的 CSS/JS 代码，不要省略任何细节。

---

## 优化 1：添加全屏坐标网格背景（P0 · 最重要）

**问题**：当前背景只有几个 radial-gradient 光斑，没有网格层，首屏像"网页"而非"太空控制台"。

**做法**：在现有背景之上新增 SVG 网格层，铺满全屏，中心明亮、边缘用 radialGradient 隐入黑暗。

```html
<!-- 替换 body 里现有的 bg-cosmos + bg-stars 为以下三层 -->
<div class="bg-grid">
  <svg preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="coord-grid" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(127,255,212,0.06)" stroke-width="0.5"/>
        <circle cx="0" cy="0" r="1" fill="rgba(255,181,71,0.35)"/>
      </pattern>
      <radialGradient id="grid-fade" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#000" stop-opacity="0"/>
        <stop offset="60%" stop-color="#000" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.85"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#coord-grid)"/>
    <rect width="100%" height="100%" fill="url(#grid-fade)"/>
  </svg>
</div>
<div class="bg-stars"></div>
```

```css
.bg-grid {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 900px 600px at 50% 50%, rgba(255,181,71,0.08), transparent 60%),
    linear-gradient(180deg, var(--space-void) 0%, var(--space-deep) 50%, var(--space-void) 100%);
}
.bg-grid svg { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.55; }
```

**效果**：首屏立刻有了"太空控制台"的三层纵深（网格背景 → 星图中景 → 文字前景）。

---

## 优化 2：星图放大 + 节点改为 SVG 圆点 + 呼吸动画（P0）

**问题**：星图固定 640px 正方形，太小。4 个节点是 div 方块，不是"星点"，没有呼吸感。

**做法**：

1. 星图容器改为 `aspect-ratio: 5/3` + `max-width: 960px`，横向拉伸。
2. 删除 4 个 `.node` div，改用 SVG 画连线 + 圆点。
3. 给节点加 `node-breathe` 动画（半径缩放）。

```css
.star-map {
  position: relative; width: 100%; max-width: 960px;
  aspect-ratio: 5/3; margin: 0 auto;
}

@keyframes node-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.6); }
}
.node-breathe {
  transform-origin: center;
  animation: node-breathe 3s ease-in-out infinite;
}

@keyframes conn-flow {
  to { stroke-dashoffset: -20; }
}
.conn-flow {
  animation: conn-flow 1.5s linear infinite;
}
```

```html
<!-- 在 .star-map 内部，替换现有 SVG 和所有 .node div 为： -->
<svg viewBox="0 0 500 300" preserveAspectRatio="none"
     style="position:absolute;inset:0;width:100%;height:100%">
  <defs>
    <radialGradient id="center-aura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFB547" stop-opacity="0.3"/>
      <stop offset="40%" stop-color="#FFB547" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#FFB547" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- 中央光晕 -->
  <ellipse cx="250" cy="150" rx="180" ry="100" fill="url(#center-aura)"/>

  <!-- 连线：4 条静态虚线 + 4 条流动虚线 -->
  <!-- 左上 amber 节点 (20%, 22%) -> 中心 -->
  <line x1="100" y1="66" x2="250" y2="150" stroke="#FFB547" stroke-width="0.6" stroke-dasharray="3 4" opacity="0.5"/>
  <line x1="100" y1="66" x2="250" y2="150" stroke="#FFB547" stroke-width="0.6" stroke-dasharray="2 18" class="conn-flow" opacity="0.8"/>

  <!-- 右上 aurora 节点 (88%, 22%) -> 中心 -->
  <line x1="440" y1="66" x2="250" y2="150" stroke="#7FFFD4" stroke-width="0.6" stroke-dasharray="3 4" opacity="0.5"/>
  <line x1="440" y1="66" x2="250" y2="150" stroke="#7FFFD4" stroke-width="0.6" stroke-dasharray="2 18" class="conn-flow" opacity="0.8"/>

  <!-- 左下 aurora 节点 (12%, 78%) -> 中心 -->
  <line x1="60" y1="234" x2="250" y2="150" stroke="#7FFFD4" stroke-width="0.6" stroke-dasharray="3 4" opacity="0.5"/>
  <line x1="60" y1="234" x2="250" y2="150" stroke="#7FFFD4" stroke-width="0.6" stroke-dasharray="2 18" class="conn-flow" opacity="0.8"/>

  <!-- 右下 amber 节点 (88%, 78%) -> 中心 -->
  <line x1="440" y1="234" x2="250" y2="150" stroke="#FFB547" stroke-width="0.6" stroke-dasharray="3 4" opacity="0.5"/>
  <line x1="440" y1="234" x2="250" y2="150" stroke="#FFB547" stroke-width="0.6" stroke-dasharray="2 18" class="conn-flow" opacity="0.8"/>

  <!-- 节点圆点 -->
  <!-- 左上 amber -->
  <circle cx="100" cy="66" r="9" fill="#FFB547" opacity="0.15"/>
  <circle cx="100" cy="66" r="3.5" fill="#FFB547"/>
  <circle cx="100" cy="66" r="3.5" fill="none" stroke="#FFB547" stroke-width="0.5" class="node-breathe"/>

  <!-- 右上 aurora -->
  <circle cx="440" cy="66" r="9" fill="#7FFFD4" opacity="0.15"/>
  <circle cx="440" cy="66" r="3.5" fill="#7FFFD4"/>
  <circle cx="440" cy="66" r="3.5" fill="none" stroke="#7FFFD4" stroke-width="0.5" class="node-breathe"/>

  <!-- 左下 aurora -->
  <circle cx="60" cy="234" r="9" fill="#7FFFD4" opacity="0.15"/>
  <circle cx="60" cy="234" r="3.5" fill="#7FFFD4"/>
  <circle cx="60" cy="234" r="3.5" fill="none" stroke="#7FFFD4" stroke-width="0.5" class="node-breathe"/>

  <!-- 右下 amber -->
  <circle cx="440" cy="234" r="9" fill="#FFB547" opacity="0.15"/>
  <circle cx="440" cy="234" r="3.5" fill="#FFB547"/>
  <circle cx="440" cy="234" r="3.5" fill="none" stroke="#FFB547" stroke-width="0.5" class="node-breathe"/>
</svg>

<!-- 节点标签（HTML 覆盖在 SVG 上） -->
<div style="position:absolute;left:20%;top:22%;transform:translate(20px,-50%)">
  <div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600;color:var(--amber);white-space:nowrap">INTJ</div>
  <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted);margin-top:2px">人格</div>
</div>
<div style="position:absolute;left:88%;top:22%;transform:translate(calc(-100% - 20px),-50%)">
  <div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600;color:var(--aurora);white-space:nowrap">摩羯座</div>
  <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted);margin-top:2px">土象</div>
</div>
<div style="position:absolute;left:12%;top:78%;transform:translate(20px,-50%)">
  <div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600;color:var(--aurora);white-space:nowrap">🐴 马</div>
  <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted);margin-top:2px">生肖</div>
</div>
<div style="position:absolute;left:88%;top:78%;transform:translate(calc(-100% - 20px),-50%)">
  <div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600;color:var(--amber);white-space:nowrap">A 型</div>
  <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted);margin-top:2px">血型</div>
</div>
```

**注意**：节点坐标是 `viewBox="0 0 500 300"` 内的绝对像素，换算关系：
- x% → x/100 * 500, y% → y/100 * 300
- 中心 = (250, 150)

---

## 优化 3：扫描线改为细线 + 光晕尾迹（P0）

**问题**：当前 `.scanline` 是 120px 高的大色块带背景渐变，像"擦除动画"，不像科幻扫描线。

**做法**：改成 1px 细线 + 12px 光晕尾迹，纯 CSS。

```css
.scanline {
  position: absolute; top: 0; left: 0; right: 0;
  pointer-events: none; z-index: 3;
  animation: scan 9s linear infinite;
}
.scanline::before {
  content: "";
  position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,181,71,0.5), transparent);
}
.scanline::after {
  content: "";
  position: absolute; left: 0; right: 0; height: 12px;
  background: linear-gradient(180deg, rgba(255,181,71,0.10), transparent);
}

@keyframes scan {
  0%   { transform: translateY(-12px); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}
```

---

## 优化 4：中央数字加多层光晕 + 呼吸动画（P1）

**问题**：当前只有一层 `text-shadow: 0 0 30px`，光晕太薄，没有"发光体"的体积感。

**做法**：4 层递进光晕 + 4s 呼吸周期。

```css
.center-num {
  /* 保持现有定位代码不变，只替换 text-shadow */
  text-shadow:
    0 0 20px rgba(255,181,71,0.6),
    0 0 50px rgba(255,181,71,0.3),
    0 0 100px rgba(255,181,71,0.15),
    0 0 200px rgba(255,181,71,0.05);
  animation: num-glow 4s ease-in-out infinite;
}

@keyframes num-glow {
  0%, 100% {
    text-shadow:
      0 0 20px rgba(255,181,71,0.6),
      0 0 50px rgba(255,181,71,0.3),
      0 0 100px rgba(255,181,71,0.15),
      0 0 200px rgba(255,181,71,0.05);
  }
  50% {
    text-shadow:
      0 0 30px rgba(255,181,71,0.8),
      0 0 70px rgba(255,181,71,0.4),
      0 0 140px rgba(255,181,71,0.2),
      0 0 280px rgba(255,181,71,0.08);
  }
}
```

---

## 优化 5：CTA 改为文字链接风格（P1）

**问题**：实心橙渐变按钮像"营销落地页"，破坏太空控制台的克制感。

**做法**：改成文字 + 下划线动效，参考主项目 `page.tsx:222-234`。

```html
<div style="display:flex;flex-direction:column;align-items:center;gap:16px">
  <a href="#guide" class="cta-group" style="text-decoration:none;display:inline-flex;flex-direction:column;align-items:center">
    <span style="font-family:'JetBrains Mono',monospace;font-size:16px;color:var(--amber);letter-spacing:0.1em">
      → 开启我的人生清单
    </span>
    <span class="cta-underline" style="display:block;height:1px;background:rgba(255,181,71,0.4);width:96px;margin-top:4px;transition:all .25s"></span>
    <span style="font-size:10px;color:var(--muted);font-family:'JetBrains Mono',monospace;margin-top:6px;letter-spacing:0.05em">
      1 分钟 · 5 个问题
    </span>
  </a>
  <a href="#earth" style="font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--muted);letter-spacing:0.05em;text-decoration:none;transition:color .25s" onmouseover="this.style.color='var(--aurora)'" onmouseout="this.style.color='var(--muted)'">
    看看世界 →
  </a>
</div>

<style>
.cta-group:hover .cta-underline {
  width: 100% !important;
  background: var(--amber) !important;
}
</style>
```

---

## 优化 6：角落坐标文字换行（P2）

**问题**：单行太宽，像标签而非终端输出。

**做法**：`
` 换行，配合 `white-space: pre-line`。

```html
<div class="corner-coord" style="top:70px;left:24px;white-space:pre-line">N 39°54'
E 116°23'</div>
<div class="corner-coord" style="top:70px;right:24px;white-space:pre-line;text-align:right">T+0:00:00
[REC]</div>
<div class="corner-coord" style="bottom:24px;left:24px;white-space:pre-line">SIG · LOCK
42.7Hz</div>
<div class="corner-coord" style="bottom:24px;right:24px;white-space:pre-line;text-align:right">v0.1.0-alpha
void.architect</div>
```

---

## 执行优先级（如果一次改不完）

| 批次 | 包含优化 | 视觉提升占比 |
|---|---|---|
| 第一批 | 1（网格背景）+ 2（SVG 星图节点）+ 3（扫描线细线）| ~80% |
| 第二批 | 4（数字光晕）+ 5（CTA 文字链接）| ~15% |
| 第三批 | 6（角落换行）+ 微调 | ~5% |

---

## 验收标准

- [ ] 首屏网格铺满全屏，中心明亮、边缘隐入黑暗
- [ ] 星图横向 5:3 比例，节点是 SVG 圆点且有呼吸动画
- [ ] 扫描线是 1px 细线 + 光晕，不是大块背景
- [ ] 中央数字有 4 层递进光晕 + 呼吸
- [ ] CTA 是文字链接风格，无实心按钮
- [ ] 所有改动保持单文件 HTML，无外部依赖
- [ ] 加载时间 < 2 秒，无控制台报错

---

## 附录：原始提示词（v1）

完整原始生成提示词见 `.trae/specs/build-bucket-list-app/spec.md`，包含所有 Section 1-6 的功能要求。
本文件（v2）仅覆盖首屏视觉层次的增量优化指令。

---

*生成时间：2026-06-24*
*对比基准：bucket-list-ai 主项目 `app/page.tsx` + `components/brand/constellation-map.tsx` + `components/brand/coordinate-grid.tsx`*
