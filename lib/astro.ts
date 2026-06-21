export type ZodiacSign =
  | "白羊座"
  | "金牛座"
  | "双子座"
  | "巨蟹座"
  | "狮子座"
  | "处女座"
  | "天秤座"
  | "天蝎座"
  | "射手座"
  | "摩羯座"
  | "水瓶座"
  | "双鱼座";

type SignRange = {
  sign: ZodiacSign;
  start: [number, number];
  end: [number, number];
  element: "火" | "土" | "风" | "水";
  trait: string;
};

const RANGES: SignRange[] = [
  { sign: "摩羯座", start: [12, 22], end: [1, 19], element: "土", trait: "结构 · 长期主义" },
  { sign: "水瓶座", start: [1, 20], end: [2, 18], element: "风", trait: "反叛 · 未来主义" },
  { sign: "双鱼座", start: [2, 19], end: [3, 20], element: "水", trait: "共情 · 梦境主义" },
  { sign: "白羊座", start: [3, 21], end: [4, 19], element: "火", trait: "先锋 · 行动主义" },
  { sign: "金牛座", start: [4, 20], end: [5, 20], element: "土", trait: "稳固 · 感官主义" },
  { sign: "双子座", start: [5, 21], end: [6, 21], element: "风", trait: "好奇 · 多元主义" },
  { sign: "巨蟹座", start: [6, 22], end: [7, 22], element: "水", trait: "守护 · 情感主义" },
  { sign: "狮子座", start: [7, 23], end: [8, 22], element: "火", trait: "中心 · 表演主义" },
  { sign: "处女座", start: [8, 23], end: [9, 22], element: "土", trait: "完美 · 工匠主义" },
  { sign: "天秤座", start: [9, 23], end: [10, 23], element: "风", trait: "平衡 · 审美主义" },
  { sign: "天蝎座", start: [10, 24], end: [11, 22], element: "水", trait: "深度 · 重生主义" },
  { sign: "射手座", start: [11, 23], end: [12, 21], element: "火", trait: "远行 · 探索主义" },
];

function inRange(m: number, d: number, range: SignRange): boolean {
  const [sm, sd] = range.start;
  const [em, ed] = range.end;
  const startMatches = m === sm && d >= sd;
  const endMatches = m === em && d <= ed;
  if (sm > em) {
    // 跨年（如摩羯 12/22 - 1/19）
    return startMatches || endMatches;
  }
  // 同年
  return startMatches || endMatches || (m > sm && m < em);
}

export function getZodiacSign(month: number, day: number): SignRange {
  const m = Number(month);
  const d = Number(day);
  return RANGES.find((r) => inRange(m, d, r)) ?? RANGES[0];
}

export function getZodiacMeta(sign: ZodiacSign): SignRange {
  return RANGES.find((r) => r.sign === sign) ?? RANGES[0];
}
