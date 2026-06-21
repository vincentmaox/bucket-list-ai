export type ChineseZodiac =
  | "鼠"
  | "牛"
  | "虎"
  | "兔"
  | "龙"
  | "蛇"
  | "马"
  | "羊"
  | "猴"
  | "鸡"
  | "狗"
  | "猪";

type ZodiacMeta = {
  animal: ChineseZodiac;
  emoji: string;
  trait: string;
};

const ZODIAC_LIST: ZodiacMeta[] = [
  { animal: "鼠", emoji: "🐭", trait: "机敏 · 适应力" },
  { animal: "牛", emoji: "🐮", trait: "坚韧 · 责任感" },
  { animal: "虎", emoji: "🐯", trait: "果敢 · 领导力" },
  { animal: "兔", emoji: "🐰", trait: "温和 · 谨慎" },
  { animal: "龙", emoji: "🐲", trait: "雄心 · 冒险欲" },
  { animal: "蛇", emoji: "🐍", trait: "智慧 · 神秘" },
  { animal: "马", emoji: "🐴", trait: "自由 · 行动力" },
  { animal: "羊", emoji: "🐑", trait: "同理 · 创造力" },
  { animal: "猴", emoji: "🐵", trait: "机灵 · 多元" },
  { animal: "鸡", emoji: "🐔", trait: "精准 · 勤奋" },
  { animal: "狗", emoji: "🐶", trait: "忠诚 · 正义" },
  { animal: "猪", emoji: "🐷", trait: "厚道 · 享乐" },
];

const BASE_YEAR = 2020;

export function getChineseZodiac(year: number): ZodiacMeta {
  const idx = ((year - BASE_YEAR) % 12 + 12) % 12;
  return ZODIAC_LIST[idx];
}

export function getZodiacByAnimal(animal: ChineseZodiac): ZodiacMeta {
  return ZODIAC_LIST.find((z) => z.animal === animal) ?? ZODIAC_LIST[0];
}
