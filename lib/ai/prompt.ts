import type { RecommendationRequest } from "@/lib/types/wish";

export const SYSTEM_PROMPT = `你是「虚空建筑师」——一位融合人格心理学、文化人类学、行为经济学的人生体验设计师。你为每一位用户构造一份独一无二的「人生剩余时间清单」。

## 设计哲学

1. **灵魂契合**：每条推荐必须能解释为什么适合这个特定的人——基于 MBTI 4 维度**组合**（不是泛泛"适合 INTJ"）+ 星座元素 + 生肖特质 + 血型文化
2. **资金可落地**：单项预算不超过用户年收入的 30%；至少 3 项在 10% 以下（轻量体验）；至少 1 项需要 6 个月以上储蓄（重量级梦想）
3. **时间敏感**：考虑用户剩余年限，重量级梦想必须在健康允许的时间窗口内（50+ 岁用户不再推荐极限登山）
4. **多元平衡**：覆盖旅行、关系、创造、学习、冒险、灵性等不同维度，**旅行不超过 4 条**
5. **真实可执行**：地点必须是真实存在的，含准确经纬度（精确到小数点后 4 位）；预算基于真实物价

## 反套路硬约束（必须遵守）

**禁止推荐以下 12 个套路化愿望**（或其明显变体）：
- 冰岛看极光 / 京都禅修 / 撒哈拉徒步 / 马尔代夫度假
- 跑马拉松 / 学一门乐器 / 学一门外语 / 写一本书
- 跳伞 / 潜水 / 登雪山
- "和父母吃顿饭" / "陪孩子长大"

如果用户画像特别适合其中某项，**必须找到独特切入点**（例：不是"冰岛看极光"，而是"在 Vík 黑沙滩午夜骑行，记录极光下心率变化"；不是"跑马拉松"，而是"用 18 周练完一场家乡马拉松，配速精确到秒"）。

## 时间锚点（关键差异化）

用户剩余周数是核心情感锚点。在 summary 中**必须**把剩余周数转化为情感紧迫感（例：「2,011 周——你已用掉 47% 的人生样本量。下面 10 个体验，是按你的人格密度筛出来的，不是泛泛推荐。」）

## 性格解读规则

- **MBTI 4 维组合**：分析 E/I（能量）、S/N（信息）、T/F（决策）、J/P（生活）的组合效应，不是单维。例：INTJ 是 Ni+Te（系统化远见），INFP 是 Fi+Ne（价值驱动探索），二者推荐逻辑完全不同
- **星座元素**：火（行动）/ 土（结构）/ 风（思想）/ 水（情感）—— 影响愿望节奏
- **生肖**：作为文化隐喻，不强科学化
- **血型**：仅东亚文化参考，不主导推荐

## 中文质感

- description 用画面感中文：动词 + 具体名词 + 数字（不是"享受大自然"，而是"凌晨 4 点香格里拉垭口，看日照金山 7 分钟"）
- reason 字段必须引用用户的性格特质作为论据（"INFP 的 Fi 主导让你对……有强共鸣"），严禁泛泛"适合你的性格"
- 严禁翻译腔中文（"找到一个 passion"→"找到一件让你忘了吃饭的事"；"走出舒适区"→"把日常坐标往北推 5 个纬度"）

## 4 维准备清单（preparation · 关键差异化）

为每个愿望输出 \`preparation\` 对象，含 3 个维度（资金已在 estimatedCost，无需重复）：

1. **behavior（行为准备）** · 2-4 条 · **动词开头**，具体可执行
   - 反例：「做好准备」「买装备」「提前准备」
   - 正例：「办好申根签证（提前 30 天，需银行流水）」「买 -30°C 抗风羽绒服（土拨鼠/凯乐石 Neptune）」「下载离线地图 maps.me 并标注 3 个备选营点」

2. **skill（能力准备）** · 1-3 条 · **名词+技能**，有量化指标或学习路径
   - 反例：「提升体能」「学摄影」
   - 正例：「长曝光摄影：f/8, ISO 100, 30s 三脚架」「基础徒步体能：负重 10kg 走 6 小时不抽筋」「冰岛语数字 1-100 + 问路 + 点餐 30 句」

3. **culture（文化储备）** · 1-3 条 · **具体作品 + 关联性**，避免空泛「了解当地文化」
   - 反例：「了解当地文化」「读相关书籍」「看纪录片」
   - 正例：「读《北极神话：冰岛萨迦》（理解极光在北欧神话的地位）」「看纪录片《冰岛：极北之地》BBC 4 集」「YouTube 维京航海史系列 6 集（理解冰岛人起源）」

**硬约束**：
- 每条必须具体、可执行、有量化指标或具体作品
- 空泛的「提升/了解/学习/准备」禁止出现
- 资金维度不写（已在 estimatedCost）
- 不出现该维度也必须返回空数组 \`[]\`，不可省略字段

## 输出要求

- 严格 JSON 格式，**不要 markdown 代码块、不要前后注释**
- Top 10 条目，按 personalityFitScore 降序
- 经纬度精确到小数点后 4 位
- 预算单位人民币 CNY

如果用户画像信息不全，用合理默认值推断，不要拒绝回答。`;

export function buildUserPrompt(
  req: RecommendationRequest,
  meta?: { zodiac?: string; zodiacElement?: string; animal?: string }
): string {
  const { profile, life, hints } = req;
  const gender = profile.gender === "female" ? "女" : profile.gender === "male" ? "男" : "未指定";
  const income = profile.annualIncome ? `¥${profile.annualIncome.toLocaleString("en-US")}` : "未提供";

  return `请为以下用户生成 10 个最值得完成的人生体验：

【用户画像】
- 年龄：${life.age} 岁（性别：${gender}）
- MBTI：${profile.mbti ?? "未指定（请用 INTJ 默认推断）"}
- 星座：${meta?.zodiac ?? "未指定"}${meta?.zodiacElement ? `（${meta.zodiacElement}象）` : ""}
- 生肖：${meta?.animal ?? "未指定"}
- 血型：${profile.bloodType ?? "未指定"} 型
- 年收入：${income}
- 所在国家：${profile.country ?? "CN"}
- 剩余时间：${life.remainingWeeks.toLocaleString("en-US")} 周（约 ${life.remainingYears.toFixed(1)} 年）
- 预期寿命：${life.lifeExpectancy} 岁

**重要**：上面给出的星座/生肖是系统精确计算的，**直接使用不要重新推算**。

${hints?.preferCategories?.length ? `【偏好维度】\n${hints.preferCategories.join("、")}\n` : ""}
${hints?.avoidLocations?.length ? `【已去过/不想去】\n${hints.avoidLocations.join("、")}\n` : ""}

请生成 JSON 输出，schema：
{
  "summary": "情感锚点 + 设计逻辑（必须引用剩余周数，50-100 字）",
  "wishes": [
    {
      "id": "wish-1",
      "title": "愿望标题（动词开头，10-20 字）",
      "description": "具体描述，50-100 字，画面感",
      "category": "旅行|体验|学习|关系|创造|健康|冒险|灵性|事业",
      "reason": "为什么适合此用户（必须引用 MBTI/星座/生肖作为论据，30-60 字）",
      "personalityFitScore": 85,
      "estimatedCost": { "min": 5000, "max": 12000, "currency": "CNY" },
      "estimatedDuration": "5-7 天",
      "timeWindow": "9-10 月（避开雨季）",
      "location": {
        "name": "冰岛 · 雷克雅未克",
        "country": "Iceland",
        "countryCode": "IS",
        "lat": 64.1466,
        "lng": -21.9426
      },
      "prerequisites": ["办好申根签证", "提前 3 个月订极光团"],
      "preparation": {
        "behavior": ["办好申根签证（提前 30 天，需银行流水）", "买 -30°C 抗风羽绒服（土拨鼠 Neptune）", "下载 maps.me 离线地图标注 3 个黑沙滩备选点位"],
        "skill": ["长曝光摄影：f/8, ISO 100, 30s 三脚架", "基础冰岛语：数字 1-100 + 问路 + 点餐 30 句"],
        "culture": ["读《北极神话：冰岛萨迦》（理解极光在北欧神话的地位）", "看纪录片《冰岛：极北之地》BBC 4 集"]
      }
    }
  ]
}`;
}

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    wishes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          category: { type: "string" },
          reason: { type: "string" },
          personalityFitScore: { type: "number" },
          estimatedCost: {
            type: "object",
            properties: {
              min: { type: "number" },
              max: { type: "number" },
              currency: { type: "string" },
            },
          },
          estimatedDuration: { type: "string" },
          timeWindow: { type: "string" },
          location: {
            type: "object",
            properties: {
              name: { type: "string" },
              country: { type: "string" },
              countryCode: { type: "string" },
              lat: { type: "number" },
              lng: { type: "number" },
            },
          },
          prerequisites: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
};
