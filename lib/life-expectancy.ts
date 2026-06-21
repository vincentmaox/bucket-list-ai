export type CountryCode =
  | "CN"
  | "HK"
  | "TW"
  | "JP"
  | "KR"
  | "SG"
  | "US"
  | "CA"
  | "GB"
  | "FR"
  | "DE"
  | "IT"
  | "ES"
  | "AU"
  | "NZ"
  | "TH"
  | "VN"
  | "ID"
  | "MY"
  | "PH"
  | "IN"
  | "BR"
  | "RU"
  | "MX"
  | "EG"
  | "ZA"
  | "TR"
  | "SA";

type CountryMeta = {
  code: CountryCode;
  zh: string;
  en: string;
  flag: string;
  lifeExpectancy: {
    male: number;
    female: number;
    overall: number;
  };
};

export const COUNTRIES: Record<CountryCode, CountryMeta> = {
  CN: { code: "CN", zh: "中国", en: "China", flag: "🇨🇳", lifeExpectancy: { male: 75, female: 81, overall: 78 } },
  HK: { code: "HK", zh: "中国香港", en: "Hong Kong", flag: "🇭🇰", lifeExpectancy: { male: 81, female: 87, overall: 84 } },
  TW: { code: "TW", zh: "中国台湾", en: "Taiwan", flag: "🇹🇼", lifeExpectancy: { male: 77, female: 84, overall: 80 } },
  JP: { code: "JP", zh: "日本", en: "Japan", flag: "🇯🇵", lifeExpectancy: { male: 81, female: 87, overall: 84 } },
  KR: { code: "KR", zh: "韩国", en: "South Korea", flag: "🇰🇷", lifeExpectancy: { male: 79, female: 85, overall: 82 } },
  SG: { code: "SG", zh: "新加坡", en: "Singapore", flag: "🇸🇬", lifeExpectancy: { male: 81, female: 85, overall: 83 } },
  US: { code: "US", zh: "美国", en: "USA", flag: "🇺🇸", lifeExpectancy: { male: 75, female: 80, overall: 77 } },
  CA: { code: "CA", zh: "加拿大", en: "Canada", flag: "🇨🇦", lifeExpectancy: { male: 79, female: 84, overall: 82 } },
  GB: { code: "GB", zh: "英国", en: "UK", flag: "🇬🇧", lifeExpectancy: { male: 79, female: 83, overall: 81 } },
  FR: { code: "FR", zh: "法国", en: "France", flag: "🇫🇷", lifeExpectancy: { male: 79, female: 85, overall: 82 } },
  DE: { code: "DE", zh: "德国", en: "Germany", flag: "🇩🇪", lifeExpectancy: { male: 78, female: 83, overall: 81 } },
  IT: { code: "IT", zh: "意大利", en: "Italy", flag: "🇮🇹", lifeExpectancy: { male: 80, female: 84, overall: 82 } },
  ES: { code: "ES", zh: "西班牙", en: "Spain", flag: "🇪🇸", lifeExpectancy: { male: 80, female: 86, overall: 83 } },
  AU: { code: "AU", zh: "澳大利亚", en: "Australia", flag: "🇦🇺", lifeExpectancy: { male: 81, female: 85, overall: 83 } },
  NZ: { code: "NZ", zh: "新西兰", en: "New Zealand", flag: "🇳🇿", lifeExpectancy: { male: 80, female: 83, overall: 82 } },
  TH: { code: "TH", zh: "泰国", en: "Thailand", flag: "🇹🇭", lifeExpectancy: { male: 72, female: 79, overall: 76 } },
  VN: { code: "VN", zh: "越南", en: "Vietnam", flag: "🇻🇳", lifeExpectancy: { male: 71, female: 79, overall: 75 } },
  ID: { code: "ID", zh: "印度尼西亚", en: "Indonesia", flag: "🇮🇩", lifeExpectancy: { male: 69, female: 73, overall: 71 } },
  MY: { code: "MY", zh: "马来西亚", en: "Malaysia", flag: "🇲🇾", lifeExpectancy: { male: 73, female: 78, overall: 76 } },
  PH: { code: "PH", zh: "菲律宾", en: "Philippines", flag: "🇵🇭", lifeExpectancy: { male: 68, female: 75, overall: 72 } },
  IN: { code: "IN", zh: "印度", en: "India", flag: "🇮🇳", lifeExpectancy: { male: 68, female: 71, overall: 70 } },
  BR: { code: "BR", zh: "巴西", en: "Brazil", flag: "🇧🇷", lifeExpectancy: { male: 72, female: 79, overall: 75 } },
  RU: { code: "RU", zh: "俄罗斯", en: "Russia", flag: "🇷🇺", lifeExpectancy: { male: 65, female: 76, overall: 70 } },
  MX: { code: "MX", zh: "墨西哥", en: "Mexico", flag: "🇲🇽", lifeExpectancy: { male: 72, female: 78, overall: 75 } },
  EG: { code: "EG", zh: "埃及", en: "Egypt", flag: "🇪🇬", lifeExpectancy: { male: 69, female: 74, overall: 72 } },
  ZA: { code: "ZA", zh: "南非", en: "South Africa", flag: "🇿🇦", lifeExpectancy: { male: 62, female: 68, overall: 65 } },
  TR: { code: "TR", zh: "土耳其", en: "Turkey", flag: "🇹🇷", lifeExpectancy: { male: 74, female: 80, overall: 77 } },
  SA: { code: "SA", zh: "沙特", en: "Saudi Arabia", flag: "🇸🇦", lifeExpectancy: { male: 73, female: 78, overall: 76 } },
};

const MS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;
const WEEKS_PER_YEAR = 52.1775;

export type LifeCalculation = {
  age: number;
  ageWeeks: number;
  remainingWeeks: number;
  totalWeeks: number;
  livedPercent: number;
  lifeExpectancy: number;
};

export function calcLife(
  birthDate: Date,
  country: CountryCode,
  gender?: "male" | "female"
): LifeCalculation {
  const meta = COUNTRIES[country] ?? COUNTRIES.CN;
  const lifeExpectancy =
    gender === "male"
      ? meta.lifeExpectancy.male
      : gender === "female"
      ? meta.lifeExpectancy.female
      : meta.lifeExpectancy.overall;

  const now = new Date();
  const ageMs = Math.max(0, now.getTime() - birthDate.getTime());
  const ageYears = ageMs / (MS_PER_WEEK * WEEKS_PER_YEAR);
  const ageWeeks = Math.floor(ageMs / MS_PER_WEEK);
  const totalWeeks = Math.floor(lifeExpectancy * WEEKS_PER_YEAR);
  const remainingWeeks = Math.max(0, totalWeeks - ageWeeks);
  const livedPercent = (ageWeeks / totalWeeks) * 100;

  return {
    age: Math.floor(ageYears),
    ageWeeks,
    remainingWeeks,
    totalWeeks,
    livedPercent: Math.min(100, livedPercent),
    lifeExpectancy,
  };
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}
