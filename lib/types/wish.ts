export type WishCategory =
  | "旅行"
  | "体验"
  | "学习"
  | "关系"
  | "创造"
  | "健康"
  | "冒险"
  | "灵性"
  | "事业";

export type WishLocation = {
  name: string;
  country: string;
  countryCode?: string;
  lat: number;
  lng: number;
};

export type Wish = {
  id: string;
  title: string;
  description: string;
  category: WishCategory;
  reason: string;
  personalityFitScore: number;
  estimatedCost: {
    min: number;
    max: number;
    currency: "CNY";
  };
  estimatedDuration: string;
  timeWindow: string;
  location?: WishLocation;
  prerequisites?: string[];
};

export type RecommendationRequest = {
  profile: {
    birthDate?: string;
    gender?: "male" | "female";
    bloodType?: "A" | "B" | "O" | "AB";
    mbti?: string;
    annualIncome?: number;
    country?: string;
  };
  life: {
    age: number;
    remainingWeeks: number;
    remainingYears: number;
    lifeExpectancy: number;
  };
  hints?: {
    avoidLocations?: string[];
    preferCategories?: WishCategory[];
  };
};

export type RecommendationResponse = {
  wishes: Wish[];
  summary: string;
  generatedAt: string;
  source: "ai" | "mock";
  model?: string;
};
