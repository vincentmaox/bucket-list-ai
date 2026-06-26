export type AIProvider =
  | "deepseek"
  | "openai"
  | "doubao"
  | "qwen"
  | "moonshot"
  | "custom";

export type ProviderPreset = {
  id: AIProvider;
  label: string;
  baseURL: string;
  model: string;
  apiKeyUrl: string;
  hint?: string;
};

export const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    id: "deepseek",
    label: "DeepSeek · 深度求索",
    baseURL: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
    apiKeyUrl: "https://platform.deepseek.com/api_keys",
    hint: "送 ¥10 免费额度，价格便宜，大赛默认推荐",
  },
  {
    id: "doubao",
    label: "豆包 · 字节跳动",
    baseURL: "https://ark.cn-beijing.volces.com/api/v3",
    model: "doubao-pro-32k",
    apiKeyUrl: "https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey",
    hint: "字节自家，TRAE 大赛加分项",
  },
  {
    id: "openai",
    label: "OpenAI",
    baseURL: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    apiKeyUrl: "https://platform.openai.com/api-keys",
    hint: "需海外网络访问",
  },
  {
    id: "qwen",
    label: "通义千问 · 阿里",
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: "qwen-plus",
    apiKeyUrl: "https://dashscope.console.aliyun.com/apiKey",
  },
  {
    id: "moonshot",
    label: "Moonshot · 月之暗面",
    baseURL: "https://api.moonshot.cn/v1",
    model: "moonshot-v1-8k",
    apiKeyUrl: "https://platform.moonshot.cn/console/api-keys",
  },
  {
    id: "custom",
    label: "自定义 · OpenAI 兼容",
    baseURL: "",
    model: "",
    apiKeyUrl: "",
    hint: "任何 OpenAI 兼容协议的服务",
  },
];

export function getPreset(id: AIProvider): ProviderPreset {
  return PROVIDER_PRESETS.find((p) => p.id === id) ?? PROVIDER_PRESETS[0];
}
