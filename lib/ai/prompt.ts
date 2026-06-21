import type { RecommendationRequest } from "@/lib/types/wish";

export const SYSTEM_PROMPT = `你是一位资深的人生体验设计师（Experience Architect），擅长基于用户的人格画像、资金约束和剩余时间，生成个性化的人生体验清单。

你的设计哲学：
1. **灵魂契合**：每条推荐必须能解释为什么适合这个特定的人（基于 MBTI 4 维度 + 星座元素 + 生肖特质）
2. **资金可落地**：单项预算不超过用户年收入的 30%；至少 3 项在 10% 以下（轻量体验）；至少 1 项需要 6 个月以上储蓄（重量级梦想）
3. **时间敏感**：考虑用户剩余年限，重量级梦想必须在健康允许的时间窗口内
4. **多元平衡**：覆盖旅行、关系、创造、学习、冒险等不同维度，不要全是旅行
5. **真实可执行**：地点必须是真实存在的，含准确经纬度；预算基于真实物价

输出要求：
- 严格 JSON 格式，不要 markdown 代码块
- Top 10 条目，按 personalityFitScore 降序
- 每条 reason 字段必须引用用户的性格特质作为论据
- 经纬度精确到小数点后 4 位
- 预算单位人民币 CNY

性格解读规则：
- MBTI：分析能量方向（E/I）、信息收集（S/N）、决策方式（T/F）、生活方式（J/P）4 个维度
- 星座元素：火（行动）/ 土（结构）/ 风（思想）/ 水（情感）
- 生肖：作为文化隐喻，不强科学化
- 血型：仅东亚文化参考，不主导推荐

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
  "summary": "一句话总结这份清单的设计逻辑（中文）",
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
      "prerequisites": ["办好申根签证", "提前 3 个月订极光团"]
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
