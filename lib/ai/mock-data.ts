import type { RecommendationResponse, RecommendationRequest, Wish } from "@/lib/types/wish";

export function getMockRecommendation(req: RecommendationRequest): RecommendationResponse {
  const mbti = req.profile.mbti ?? "INTJ";
  const income = req.profile.annualIncome ?? 200000;
  const isAnalytical = ["INTJ", "INTP", "ENTJ", "ENTP"].includes(mbti);
  const isDiplomatic = ["INFJ", "INFP", "ENFJ", "ENFP"].includes(mbti);

  const wishes: RecommendationResponse = {
    summary: `基于你的 ${mbti} 性格与 ¥${income.toLocaleString("en-US")} 年收入约束，老赫为你设计了 10 个能在 ${req.life.remainingYears.toFixed(0)} 年内实现的人生体验。`,
    generatedAt: new Date().toISOString(),
    source: "mock",
    wishes: ([
      {
        id: "wish-1",
        title: "在冰岛黑沙滩等一场天幕极光",
        description: "零下二十度的 Vík 黑沙滩，玄武岩柱沉默如远古祭坛，等绿色极光覆盖整个天幕。",
        category: "旅行",
        reason: `${mbti} 的内倾直觉让你能独自消化漫长等待后的震撼，这是水象星座 ${isDiplomatic ? "尤其契合" : "可以挑战"}的体验。`,
        personalityFitScore: 92,
        estimatedCost: { min: 18000, max: 28000, currency: "CNY" },
        estimatedDuration: "8-10 天",
        timeWindow: "11 月 - 3 月（极夜季节）",
        location: { name: "冰岛 · 维克黑沙滩", country: "Iceland", countryCode: "IS", lat: 63.4185, lng: -19.0064 },
        prerequisites: ["申根签证", "冰岛克朗兑换", "防风羽绒服"],
        preparation: {
          behavior: [
            "办申根签证（提前 30 天，需 6 个月银行流水）",
            "买 -30°C 抗风羽绒服（土拨鼠 Neptune / 凯乐石）",
            "提前 60 天订 Vík 当地极光团（小团 ≤8 人）",
            "下载 maps.me 离线地图 + 标注 3 个黑沙滩备选点位",
          ],
          skill: [
            "长曝光摄影：f/8, ISO 100, 30s 三脚架 + 快门线",
            "基础冰岛语：数字 1-100 + 问路 + 点餐 30 句",
          ],
          culture: [
            "读《北极神话：冰岛萨迦》（理解极光在北欧神话的地位）",
            "看纪录片《冰岛：极北之地》BBC 4 集",
          ],
        },
      },
      {
        id: "wish-2",
        title: "在京都哲学之道走完一整个樱花季",
        description: "从若王子神社到银阁寺，2 公里的樱隧道，每天去走一遍，看花瓣飘落琵琶湖水。",
        category: "体验",
        reason: `${isAnalytical ? mbti + " 的深思倾向与哲学之道的名字共鸣" : mbti + " 的内省能量需要这种慢节奏的审美沉浸"}。`,
        personalityFitScore: 89,
        estimatedCost: { min: 8000, max: 15000, currency: "CNY" },
        estimatedDuration: "5-7 天",
        timeWindow: "3 月底 - 4 月初",
        location: { name: "京都 · 哲学之道", country: "Japan", countryCode: "JP", lat: 35.0279, lng: 135.7944 },
        prerequisites: ["日本签证", "樱花前线 App"],
        preparation: {
          behavior: [
            "办日本单次签证（在职证明 + 纳税证明）",
            "订关西机场机票 + 哲学之道 1km 内民宿",
            "订阅樱花前线 App（开花日 ±3 天预报）",
            "预订银阁寺 + 南禅寺参拜时段",
          ],
          skill: [
            "基础日语礼貌语（aru/e 失礼します + すみません）",
            "单反构图：前景樱花 + 中景小径 + 远景人物",
          ],
          culture: [
            "读川端康成《古都》（理解京都四季感知）",
            "看《寻访千利休》（理解日本侘寂美学）",
          ],
        },
      },
      {
        id: "wish-3",
        title: "在喜马拉雅 EBC 大本营重新校准人生尺度",
        description: "12 天徒步到 5364 米的珠峰南坡大本营，在世界之巅脚下重新理解「大」和「小」。",
        category: "冒险",
        reason: `${mbti} 的判断功能（J）会享受训练计划，剩余 ${req.life.remainingYears.toFixed(0)} 年是身体还能承受的窗口期。`,
        personalityFitScore: 87,
        estimatedCost: { min: 30000, max: 45000, currency: "CNY" },
        estimatedDuration: "14-16 天",
        timeWindow: "3-5 月 / 10-11 月",
        location: { name: "尼泊尔 · EBC 大本营", country: "Nepal", countryCode: "NP", lat: 28.0025, lng: 86.8528 },
        prerequisites: ["半年体能训练", "高海拔药物", "夏尔巴向导"],
        preparation: {
          behavior: [
            "提前 6 个月体能训练（每周 3 次 10km 跑 + 楼梯负重）",
            "买 -40°C 睡袋（信封式 + 防水压缩袋）",
            "买乙酰唑胺（Diamox）防高反 + 提前 3 天服用",
            "雇夏尔巴向导（约 ¥800/天）+ 加德满都办 TIMS 卡",
          ],
          skill: [
            "负重 15kg 海拔 5000m 连续徒步 6 小时不抽筋",
            "高山病识别（头痛/呕吐/共济失调 → 立即下撤）",
            "基础尼泊尔语（Namaste + 数字 + 谈价钱）",
          ],
          culture: [
            "读《Into Thin Air》Jon Krakauer（理解 8000m 山峰的代价）",
            "看纪录片《珠峰：巅峰之旅》National Geographic",
          ],
        },
      },
      {
        id: "wish-4",
        title: "在巴黎奥赛看完所有印象派原作",
        description: "莫奈、雷诺阿、德加、梵高——把课本上见过的画，一张张站在原作前重新看一遍。",
        category: "学习",
        reason: `${mbti} 的直觉（N）功能对印象派对光影的捕捉会有深度共鸣。`,
        personalityFitScore: 85,
        estimatedCost: { min: 12000, max: 20000, currency: "CNY" },
        estimatedDuration: "5-7 天",
        timeWindow: "全年，避开 7-8 月旺季",
        location: { name: "巴黎 · 奥赛博物馆", country: "France", countryCode: "FR", lat: 48.86, lng: 2.3266 },
        prerequisites: ["申根签证", "Paris Museum Pass"],
        preparation: {
          behavior: [
            "办申根签证 + 提前 30 天预订奥赛时段票（避免 2 小时排队）",
            "买 Paris Museum Pass 4 天版（含奥赛+橘园+凯旋门）",
            "订拉丁区酒店（步行 15 分钟到奥赛）",
            "下载奥赛官方 App + 标注必看 20 幅画的展厅号",
          ],
          skill: [
            "法语基础（点餐 + 买票 + 问路 50 句）",
            "印象派历史脉络（1860-1900 关键人物+流派）",
            "速写本素描（站原作前临摹 15 分钟/幅）",
          ],
          culture: [
            "读《印象派源流》迈耶·夏皮罗（学术+视觉双线）",
            "看《午夜巴黎》（理解巴黎对印象派的塑造）",
          ],
        },
      },
      {
        id: "wish-5",
        title: "在沙漠腹地看一整夜银河升起",
        description: "撒哈拉或腾格里的沙丘上，等银河中心从地平线升起，沙子像凝固的海。",
        category: "灵性",
        reason: `${mbti} 对「渺小感」的处理方式独特，星空会让你重新理解存在。`,
        personalityFitScore: 84,
        estimatedCost: { min: 6000, max: 12000, currency: "CNY" },
        estimatedDuration: "3-5 天",
        timeWindow: "4-5 月 / 9-10 月（避开极端高温）",
        location: { name: "摩洛哥 · 梅尔祖卡沙漠", country: "Morocco", countryCode: "MA", lat: 31.098, lng: -4.0128 },
        prerequisites: ["防沙眼镜", "保暖睡袋"],
        preparation: {
          behavior: [
            "买防沙眼镜 + 防沙面罩（梅尔祖卡风季扬尘）",
            "买 -10°C 睡袋（沙漠夜间 0°C）+ 防潮垫",
            "雇柏柏尔向导（约 ¥400/天，含骆驼+营地）",
            "下载 Stellarium App + 离线星图",
          ],
          skill: [
            "银河摄影：ISO 6400, f/2.8, 25s + 三脚架",
            "夜间方向辨识（北极星 + 仙后座定位）",
          ],
          culture: [
            "读圣埃克苏佩里《小王子》（理解沙漠+星空的隐喻）",
            "看《阿拉伯的劳伦斯》（理解沙漠文明的张力）",
          ],
        },
      },
      {
        id: "wish-6",
        title: "学一门乐器到能完整演奏一首曲子",
        description: "钢琴、小提琴、二胡、卡林巴——选一个，从零开始，6 个月内上台演奏一首完整的曲子。",
        category: "创造",
        reason: `${mbti} 的 ${isAnalytical ? "思维-判断组合适合系统性练习" : "情感功能需要艺术表达出口"}。`,
        personalityFitScore: 82,
        estimatedCost: { min: 3000, max: 10000, currency: "CNY" },
        estimatedDuration: "持续 6 个月",
        timeWindow: "随时开始",
        preparation: {
          behavior: [
            "选乐器（推荐卡林巴 17 键入门 ¥200 / 尤克里里 ¥500）",
            "雇老师每周 1 次（¥300-500/课时）",
            "每天固定 30 分钟练习（早晨比晚上效率高 2 倍）",
            "报名第 6 个月的小型演奏会（朋友 5-10 人）",
          ],
          skill: [
            "五线谱基础（高音谱号 + 节拍 + 调式）",
            "节拍器训练（60 BPM 起步 → 目标曲速度）",
            "目标曲分段记忆（A-B-C 三段，每段独立练到自动化）",
          ],
          culture: [
            "读《音乐的极境》萨义德（理解演奏的智性维度）",
            "看贝多芬/肖邦传记纪录片（理解作曲家心路）",
          ],
        },
      },
      {
        id: "wish-7",
        title: "去非洲看一次完整的大迁徙",
        description: "肯尼亚马赛马拉，百万角马渡马拉河，鳄鱼伏击，尘土遮天。",
        category: "冒险",
        reason: `${mbti} 的直觉能从这种原始生命力中汲取长期能量。`,
        personalityFitScore: 80,
        estimatedCost: { min: 35000, max: 60000, currency: "CNY" },
        estimatedDuration: "10-12 天",
        timeWindow: "7-10 月（迁徙季）",
        location: { name: "肯尼亚 · 马赛马拉", country: "Kenya", countryCode: "KE", lat: -1.4061, lng: 35.0083 },
        prerequisites: ["黄热病疫苗", "高端旅行保险"],
        preparation: {
          behavior: [
            "提前 10 天打黄热病疫苗（黄色本本，国际必须）",
            "买高端旅行保险（含 SOS 直升机救援，¥800/7 天）",
            "订内罗毕 Safari 公司（推荐 8 天小团 ≤6 人）",
            "买 8x42 双筒望远镜 + 400mm 长焦镜头",
          ],
          skill: [
            "野生动物摄影（长焦追焦 + 高 ISO 3200+）",
            "基础斯瓦希里语（Jambo + Asante + 数字）",
            "Safari 安全守则（不开窗/不下车/不喂食）",
          ],
          culture: [
            "看 BBC《非洲》纪录片（理解东非生态系统）",
            "读海明威《乞力马扎罗的雪》（理解非洲的形而上）",
          ],
        },
      },
      {
        id: "wish-8",
        title: "和五年后的自己写一封信",
        description: "用三天时间独处，写一封 5000 字的信给五年后的自己，封存，五年后拆开。",
        category: "灵性",
        reason: `${mbti} 的内倾判断需要这种结构化的自我对话。`,
        personalityFitScore: 78,
        estimatedCost: { min: 200, max: 2000, currency: "CNY" },
        estimatedDuration: "一个周末",
        timeWindow: "生日前后",
        preparation: {
          behavior: [
            "选安静的住所（推荐山里/海边民宿 3 天）",
            "关手机/关 wifi（提前告知家人紧急联系方式）",
            "买 5000 字厚度的厚信纸 + 蜡封 + 铁盒",
            "设 5 年后日历提醒（同年同月同日）",
          ],
          skill: [
            "冥想打坐（每天 20 分钟，连续 7 天预热）",
            "自由写作训练（每天 1000 字不修改）",
          ],
          culture: [
            "读《沉思录》马可·奥勒留（理解自我对话的古典传统）",
            "读梭罗《瓦尔登湖》（理解独处的形而上）",
          ],
        },
      },
      {
        id: "wish-9",
        title: "在新西兰跳一次高空跳伞",
        description: "皇后镇 15000 英尺，60 秒自由落体，200 公里时速俯瞰南阿尔卑斯。",
        category: "冒险",
        reason: `${mbti} 的感觉（S/N）功能会在失重瞬间得到独特体验。`,
        personalityFitScore: 76,
        estimatedCost: { min: 3000, max: 5000, currency: "CNY" },
        estimatedDuration: "1 天",
        timeWindow: "全年天气允许时",
        location: { name: "新西兰 · 皇后镇", country: "New Zealand", countryCode: "NZ", lat: -45.0312, lng: 168.6626 },
        prerequisites: ["无心脏病", "体重 100kg 以下"],
        preparation: {
          behavior: [
            "体检（心电图 + 血压 + 关节评估，¥500）",
            "提前订皇后镇 NZONE 15000ft 套餐（含 GoPro 视频）",
            "报体重（<100kg，超重加收 ¥1500）",
            "提前 1 天抵达皇后镇适应海拔",
          ],
          skill: [
            "自由落体姿态（弓身 + 下巴抬高 + 四肢张开 45°）",
            "高空呼吸法（4-7-8 节律抑制恐慌）",
          ],
          culture: [
            "看纪录片《Free Solo》同导演作品《坠落》",
            "看 YouTube 跳伞科普 5 集（理解自由落体物理）",
          ],
        },
      },
      {
        id: "wish-10",
        title: "和父母做一次深度的口述史访谈",
        description: "录制 3-5 小时视频，问他们童年、爱情、遗憾、对死亡的看法。剪辑成纪录片。",
        category: "关系",
        reason: `${mbti} 剩余 ${req.life.remainingYears.toFixed(0)} 年里，父母可陪伴的窗口更短，这件事不可推迟。`,
        personalityFitScore: 95,
        estimatedCost: { min: 500, max: 3000, currency: "CNY" },
        estimatedDuration: "持续 1 个月",
        timeWindow: "春节 / 国庆（家族聚会时）",
        prerequisites: ["录音录像设备", "访谈大纲"],
        preparation: {
          behavior: [
            "买 4K 摄录机（推荐 Sony ZV-1 II ¥6000 或 iPhone Pro）",
            "买领夹麦克风（大疆 Mic 2 ¥1500，降噪关键）",
            "拟 50 题访谈大纲（童年/爱情/工作/遗憾/死亡 5 个章节）",
            "春节/国庆回家 3 天 + 提前寄设备试录",
          ],
          skill: [
            "深度访谈技巧（开放问题 + 不插话 + 沉默 3 秒）",
            "DaVinci Resolve 基础剪辑（剪切 + 字幕 + 调色）",
          ],
          culture: [
            "读《口述史方法论》杨祥银（理解访谈的伦理与方法）",
            "看纪录片《四个女儿》+《Harlan County USA》（理解口述史的电影语言）",
          ],
        },
      },
    ] as Wish[]).sort((a, b) => b.personalityFitScore - a.personalityFitScore),
  };

  return wishes;
}
