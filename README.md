(function () {
  let targetWin = window, targetDoc = document;
  try {
    if (window.parent && window.parent.document) { targetWin = window.parent; targetDoc = window.parent.document; }
    if (window.top && window.top.document) { targetWin = window.top; targetDoc = window.top.document; }
  } catch (e) {}

  targetDoc.getElementById("tw-floating-root")?.remove();
  targetDoc.getElementById("tw-floating-style")?.remove();
  if (targetWin.__twCheckTimer) clearInterval(targetWin.__twCheckTimer);

  const GLOBAL_CFG_KEY = "tw_palace_global_cfg_v31";
  const CHAT_STORE_PREFIX = "tw_palace_chat_data_v31_";
  const LAST_ACTIVE_SESSION_KEY = "tw_palace_last_session_v31";

  const DEFAULT_PLOT_WORD_LIMIT = 55;
  const DEFAULT_PLOT_CUSTOM_PROMPT = "以女主名字开头，简明概括本轮发生的核心事件、关键互动与结果，语言自然凝练。";

  const FORUM_STYLE_PRESETS = {
    lively: {
      name: "鲜活茶水间",
      desc: "像极了真实的宫人妃嫔私下嗑瓜子唠嗑！多用自然鲜活的口语词（如：哎哟、啧、笑不活了、不是吧、展开说说、谁懂啊），拒绝端着架子写公文，句子短促有活人感，大家会互相接话、插科打诨、吐槽当差或吃瓜。"
    },
    gossip: {
      name: "欢脱吃瓜风",
      desc: "全员乐子人与前排吃瓜群众！语气欢脱逗趣、看热闹不嫌事大，喜欢抢前排、搬小板凳、起哄、调侃、追问细节，充满快活热闹的欢快气氛。"
    },
    snarky: {
      name: "宫斗阴阳风",
      desc: "针锋相对、话里有话、阴阳怪气拉满！世家妃嫔端着体面说最扎心的话，武将派直接硬刚呛声，冷嘲热讽、暗戳戳护短或拆台，戏剧张力十足。"
    },
    street: {
      name: "市井烟火风",
      desc: "极致接地气的大白话与人间烟火味！三句不离吃食、银子、月例、跑腿当差的苦乐，像极了街坊邻里和底层打工人闲扯，朴实生动、直白鲜活。"
    },
    classical: {
      name: "古风文雅风",
      desc: "纯正唐风古韵，措辞讲究、含蓄蕴藉，偶有诗词雅谑或引经据典，符合大景世家贵女、翰林学士与宫廷女官的清雅谈吐，同时保持自然互动感。"
    },
    custom: {
      name: "自定义风格",
      desc: ""
    }
  };

  const GROUP_CHAT_THEMES = {
    story_sync: {
      name: "同步当前剧情",
      desc: "紧扣当前酒馆最新剧情、太微宫日常与朝堂后宫动向展开群聊。"
    },
    user_empress_harem: {
      name: "我是皇帝，其他人都是我后宫",
      desc: "【女皇独尊后宫IF线】女主是至高无上的大景女皇陛下！萧承稷（冷峻吃醋的贵君/皇夫）、沈砚（温润心机贤君）、陆敬（忠犬武将德君）、谢无咎（豪掷千金皇商丽君）、霍惊弦（鲜活直球小侍君）、温言酌（贴身侍医温昭仪）、裴玄度（冷肃掌律正君）、卫凛（宿卫侍君）以及崔清漪、秦昭华、苏枕月等全都是女皇陛下的后宫成员！全员在群里围绕女皇陛下争风吃醋、暗戳戳邀宠、比拼谁昨晚得了陛下召幸或赏赐，修罗场拉满！"
    },
    palace_gossip: {
      name: "深宫八卦吃瓜",
      desc: "围绕东西六宫争宠笑话、尚食局抢菜、内务府克扣、谁家宫人闹乌龙等深宫八卦热烈吃瓜吐槽。"
    },
    street_fun: {
      name: "长安市井趣闻",
      desc: "围绕长安东西两市奇珍、醉仙楼新酒、平康坊名曲、西市胡商宝马与民间奇闻轶事畅聊。"
    },
    if_modern: {
      name: "IF线：现代豪门集团",
      desc: "【现代职场豪门AU】太微集团总裁萧承稷、首席特助沈砚、安保总监陆敬、投资大鳄谢无咎、富二代小少爷霍惊弦、集团女高管秦昭华/崔清漪、摸鱼女明星苏枕月在公司大群里的爆笑日常。"
    },
    if_campus: {
      name: "IF线：皇家重点高中",
      desc: "【现代校园AU】太微一中高冷学生会长萧承稷、年级第一学神沈砚、体育特长生校霸陆敬、逃课打球的霍惊弦、小卖部幕后老板谢无咎、校医温言酌与各班班花在校园群里的热闹斗嘴。"
    },
    if_scifi: {
      name: "IF线：星际帝国舰队",
      desc: "【星际科幻AU】太微星系最高统帅萧承稷、首席智脑参谋官沈砚、机甲舰队司令陆敬、星际走私商谢无咎、首席医疗官温言酌在星舰公共频道里的跨星系吐槽。"
    },
    if_genderbend: {
      name: "IF线：全员性转女尊",
      desc: "【全员性转女尊大景AU】冷艳女帝萧承稷与后宫男宠贤夫们（端庄崔清漪公子、桀骜将门郎秦昭华、散漫江南富少苏枕月、女相沈砚、女将军陆敬）的奇妙反转群聊。"
    },
    custom: {
      name: "自定义群聊主题",
      desc: ""
    }
  };

  // 基础核心角色库（后妃严格采用 真名（位分） 格式）
  const BASE_DM_NPC_CATALOG = [
    { id: "萧承稷", name: "萧承稷", display: "萧承稷（大景天子）", title: "甘露殿 · 皇帝", keywords: ["萧承稷", "陛下", "圣人"], personality: "大景皇帝，必自称“朕”或私下对熟人称“我”（绝对禁止自称“孤”！）。冷峻威严、城府极深、掌控欲极强，说话简短直接，用陈述句或祈使句，私下对女主护短细腻、占有欲深重。" },
    { id: "沈砚", name: "沈砚", display: "沈砚（中书侍郎）", title: "政事堂 · 中书侍郎", keywords: ["沈砚", "沈清臣", "沈侍郎"], personality: "字清臣，寒门辅政重臣，萧承稷挚友。温润守礼、理智冷静、考虑周全，面对感情克制隐忍，一旦动心则占有欲极强。" },
    { id: "陆敬", name: "陆敬", display: "陆敬（镇国大将军）", title: "北衙禁军 · 大统领", keywords: ["陆敬", "陆怀远", "陆大将军", "陆统领"], personality: "字怀远，禁军最高统帅，萧承稷生死好友。爽朗直率、重情护短、武将风范，说话痛快直接，不擅弯弯绕绕。" },
    { id: "谢无咎", name: "谢无咎", display: "谢无咎（四海商行老板）", title: "醉仙楼 · 长安首富", keywords: ["谢无咎", "谢老板"], personality: "表面风流随性、算账精明、爱开玩笑，实则重情讲义气、考虑周密，常带宫外新鲜玩意儿与好酒。" },
    { id: "霍惊弦", name: "霍惊弦", display: "霍惊弦（定远侯世子）", title: "飞龙厩 · 小侯爷", keywords: ["霍惊弦", "小侯爷"], personality: "19岁少年心性，活泼开朗、精力充沛、爱笑爱闹、直接热烈，喜欢打马球养猎犬，搜罗西市好玩物品送人。" },
    { id: "温言酌", name: "温言酌", display: "温言酌（太医署院判）", title: "尚药局 · 御前侍医", keywords: ["温言酌", "温太医", "温院判"], personality: "表面温和，实则极有主见，做事慢条斯理，说话有时直接不留情面，唯一敢逼萧承稷喝苦药、叮嘱养生休息的人。" },
    { id: "裴玄度", name: "裴玄度", display: "裴玄度（大理寺卿）", title: "大理寺 · 司法重臣", keywords: ["裴玄度", "裴正卿", "裴卿"], personality: "字正卿，冷肃古板、刚正不阿、话少严谨，凡事讲求大景律法与证据，一旦关心人便会生硬直接地替对方扫清隐患。" },
    { id: "卫凛", name: "卫凛", display: "卫凛（羽林中郎将）", title: "甘露殿 · 副统领", keywords: ["卫凛", "卫统领", "卫中郎将"], personality: "沉稳寡言、执行命令彻底，外人面前严肃，熟悉的人面前略显局促实在，重实际行动。" },
    { id: "赵怀安", name: "赵怀安", display: "赵怀安（内侍监大总管）", title: "甘露殿 · 皇城司统领", keywords: ["赵怀安", "赵总管"], personality: "自称“奴婢”，对外人严厉狠辣，唯独对陛下恭敬细致、绝对忠诚，最清楚陛下起居与心意。" },
    { id: "苏枕月（丽嫔）", name: "苏枕月（丽嫔）", display: "苏枕月（丽嫔）", title: "玉照宫 · 正二品丽嫔", keywords: ["苏枕月", "苏丽嫔", "丽嫔"], personality: "自称“妾”或“妾身”。江南豪商之女，陪嫁丰厚，慵懒散漫、人间清醒，酷爱美食华服与看戏话本，大方友善。" },
    { id: "秦昭华（德妃）", name: "秦昭华（德妃）", display: "秦昭华（德妃）", title: "承香殿 · 正一品德妃", keywords: ["秦昭华", "秦德妃", "德妃"], personality: "自称“妾身”。将门虎女，明艳张扬、脾气直接、护短好面子，最看不起世家装模作样的做派。" },
    { id: "崔清漪（淑妃）", name: "崔清漪（淑妃）", display: "崔清漪（淑妃）", title: "淑景殿 · 正一品淑妃", keywords: ["崔清漪", "崔淑妃", "淑妃"], personality: "自称“妾身”。清河崔氏嫡女，端庄冷傲、心机深沉、极重千年世家门第规矩，说话滴水不漏。" },
    { id: "柳如絮（婕妤）", name: "柳如絮（婕妤）", display: "柳如絮（婕妤）", title: "听竹轩 · 正三品婕妤", keywords: ["柳如絮", "柳婕妤", "婕妤"], personality: "自称“妾”。江南寒门才女，清冷坚韧、聪慧自持、不卑不亢。" },
    { id: "卢婉兮（修仪）", name: "卢婉兮（修仪）", display: "卢婉兮（修仪）", title: "凝华殿 · 正二品修仪", keywords: ["卢婉兮", "卢修仪", "修仪"], personality: "自称“妾身”。范阳卢氏贵女，善妒刻薄、掐尖要强，紧抱崔淑妃大腿。" },
    { id: "郑芷兰（美人）", name: "郑芷兰（美人）", display: "郑芷兰（美人）", title: "流霞阁 · 正四品美人", keywords: ["郑芷兰", "郑美人"], personality: "自称“妾”。表面温顺寡言，实则心机深沉、擅坐山观虎斗。" },
    { id: "周妙音（才人）", name: "周妙音（才人）", display: "周妙音（才人）", title: "揽月阁 · 正五品才人", keywords: ["周妙音", "周才人"], personality: "自称“妾”。虚荣张扬、爱慕权势，整日巴结淑妃与修仪。" },
    { id: "韩怜儿（宝林）", name: "韩怜儿（宝林）", display: "韩怜儿（宝林）", title: "秋水居 · 正六品宝林", keywords: ["韩怜儿", "韩宝林"], personality: "自称“妾”。表面楚楚可怜，实则不甘寂寞、怨毒算计。" },
    { id: "沈青禾（选侍）", name: "沈青禾（选侍）", display: "沈青禾（选侍）", title: "翠微居 · 正七品选侍", keywords: ["沈青禾", "沈选侍"], personality: "自称“妾”。胆小本分、懂医药草木，与柳如絮（婕妤）交好。" },
    { id: "萧承泽", name: "萧承泽", display: "萧承泽（端王）", title: "皇室宗亲 · 七弟端王", keywords: ["萧承泽", "端王"], personality: "19岁先帝幼子，心思单纯、重情义、怕皇兄萧承稷查功课，酷爱养猎犬与骑射。" },
    { id: "贺兰枭", name: "贺兰枭", display: "贺兰枭（铁勒左贤王）", title: "北境草原 · 铁勒大王子", keywords: ["贺兰枭", "左贤王", "大王子"], personality: "漠北第一战神，桀骜悍勇、深情执拗，萧承稷生平宿敌。" },
    { id: "阿古拉", name: "阿古拉", display: "阿古拉（铁勒三王子）", title: "鸿胪寺 · 铁勒质子", keywords: ["阿古拉", "三王子"], personality: "表面豪爽顺从，实则心思细密，暗中在长安打探消息。" },
    { id: "洛青衣", name: "洛青衣", display: "洛青衣（胡月酒肆老板娘）", title: "西市 · 退役女侦察兵", keywords: ["洛青衣", "胡月酒肆"], personality: "直爽干脆、待客热情、办事利落。" },
    { id: "顾清商", name: "顾清商", display: "顾清商（听雨楼花魁）", title: "平康坊 · 皇城司暗探", keywords: ["顾清商", "听雨楼"], personality: "八面玲珑、观察敏锐、果断狠辣。" },
    { id: "小禄子", name: "小禄子", display: "小禄子（御前小内侍）", title: "甘露殿 · 奉茶内侍", keywords: ["小禄子", "陈禄"], personality: "自称“奴婢”，机灵乖巧、口风极严，熟悉陛下一切习惯。" }
  ];

  const FALLBACK_FORUM_NICKS = [
    "今日有戏听吗（苏枕月·丽嫔）",
    "百步穿杨将门女（秦昭华·德妃）",
    "飞龙厩第一快马（霍惊弦）",
    "和气生财算盘响（谢无咎）",
    "苦药不加蜜（温言酌）",
    "御前奉茶不洒水（小禄子）",
    "半窗修竹听雪（柳如絮·婕妤）",
    "玄武门巡夜人（陆敬）",
    "尚食局试菜官（苏云娘）",
    "清河门楣不可辱（崔清漪·淑妃）",
    "西市胡姬酒最烈（洛青衣）",
    "政事堂不眠人（沈砚）"
  ];

  const NPC_ALIAS_MAP = [
    { match: ["苏枕月", "苏丽嫔", "丽嫔"], full: "今日有戏听吗（苏枕月·丽嫔）" },
    { match: ["秦昭华", "秦德妃", "德妃"], full: "百步穿杨将门女（秦昭华·德妃）" },
    { match: ["崔清漪", "崔淑妃", "淑妃"], full: "清河门楣（崔清漪·淑妃）" },
    { match: ["卢婉兮", "卢修仪", "修仪"], full: "凝华殿赏花人（卢婉兮·修仪）" },
    { match: ["柳如絮", "柳婕妤", "婕妤"], full: "半窗修竹（柳如絮·婕妤）" },
    { match: ["郑芷兰", "郑美人"], full: "流霞阁抄经人（郑芷兰·美人）" },
    { match: ["周妙音", "周才人"], full: "今天换新香粉了（周妙音·才人）" },
    { match: ["韩怜儿", "韩宝林"], full: "秋水居听雨（韩怜儿·宝林）" },
    { match: ["沈青禾", "沈选侍"], full: "翠微居晒药草（沈青禾·选侍）" },
    { match: ["萧承稷", "陛下", "圣人"], full: "甘露殿值夜（萧承稷）" },
    { match: ["霍惊弦", "小侯爷"], full: "飞龙厩第一快马（霍惊弦）" },
    { match: ["谢无咎", "谢老板", "谢掌柜"], full: "和气生财算盘响（谢无咎）" },
    { match: ["温言酌", "温太医"], full: "苦药不加蜜（温言酌）" },
    { match: ["沈砚", "沈侍郎"], full: "政事堂下棋人（沈砚）" },
    { match: ["陆敬", "陆统领", "陆将军"], full: "北苑练剑人（陆敬）" },
    { match: ["裴玄度", "裴卿"], full: "景律第叁百条（裴玄度）" },
    { match: ["赵怀安", "赵总管"], full: "内侍监大总管（赵怀安）" },
    { match: ["萧承泽", "端王"], full: "不背策论只遛狗（端王萧承泽）" },
    { match: ["卫凛", "卫统领"], full: "殿前执戟（卫凛）" },
    { match: ["小禄子", "陈禄"], full: "御前奉茶不洒水（小禄子）" },
    { match: ["丹橘"], full: "承香殿第一护主（丹橘）" },
    { match: ["迎春"], full: "玉照宫算账小能手（迎春）" },
    { match: ["王大宝"], full: "尚食局抢菜冠军（王大宝）" },
    { match: ["锦书"], full: "淑景殿掌事（锦书）" },
    { match: ["听雪"], full: "听竹轩守门人（听雪）" },
    { match: ["苏云娘"], full: "御膳房掌勺（苏云娘）" },
    { match: ["沈碧螺"], full: "尚衣局金剪刀（沈碧螺）" },
    { match: ["洛青衣"], full: "西市胡姬酒最烈（洛青衣）" },
    { match: ["顾清商"], full: "平康坊听雨客（顾清商）" }
  ];

  const SPY_CARD_META = [
    { key: "visitors", icon: "👥", title: "今日见客", sub: "宣政延英 · 召对往来" },
    { key: "actions", icon: "🏛️", title: "今日政事", sub: "朝堂决断 · 圣躬行止" },
    { key: "memorials", icon: "📜", title: "所批折子", sub: "甘露御案 · 朱批钦定" },
    { key: "leisure", icon: "🎯", title: "今日消遣", sub: "北苑骑射 · 舆图丹青" },
    { key: "meals", icon: "🍵", title: "御膳茶点", sub: "尚食呈膳 · 浓茶苦茗" },
    { key: "desire", icon: "🔥", title: "隐秘欲念", sub: "暗潮克制 · 独占私心" }
  ];

  // ==================== 全局配置 ====================
  let config = {
    theme: "xuanpaper",
    autoMasterAll: true,
    autoModules: {
      status: true,
      plot: true,
      world: true
    },
    plotWordLimit: DEFAULT_PLOT_WORD_LIMIT,
    plotCustomPrompt: DEFAULT_PLOT_CUSTOM_PROMPT,
    chatMemoryCount: 20,
    forumNickname: "",
    forumSpeakStyle: "lively",
    forumCustomStyleText: "",
    groupChatTheme: "story_sync",
    groupChatCustomThemeText: "",
    lastKnownUserName: "",
    apiMode: "tavern",
    apiName: "",
    apiUrl: "https://api.openai.com/v1",
    apiKey: "",
    apiModel: "gpt-4o-mini",
    fetchedModels: [],
    savedApiPresets: [],
    activePresetId: ""
  };

  try {
    const legacyCfg = localStorage.getItem("tw_palace_global_cfg_v30") || localStorage.getItem("tw_palace_helper_cfg_v29") || "{}";
    const curCfg = localStorage.getItem(GLOBAL_CFG_KEY) || legacyCfg;
    const parsed = JSON.parse(curCfg);
    Object.assign(config, parsed);
    if (!config.autoModules || typeof config.autoModules !== "object") {
      config.autoModules = { status: true, plot: true, world: true };
    }
    delete config.autoModules.actions;
    if (!Array.isArray(config.savedApiPresets)) config.savedApiPresets = [];
    if (!config.plotWordLimit || isNaN(Number(config.plotWordLimit))) config.plotWordLimit = DEFAULT_PLOT_WORD_LIMIT;
    if (typeof config.plotCustomPrompt !== "string" || !config.plotCustomPrompt.trim()) config.plotCustomPrompt = DEFAULT_PLOT_CUSTOM_PROMPT;
    if (!config.chatMemoryCount || isNaN(Number(config.chatMemoryCount))) config.chatMemoryCount = 20;
    if (typeof config.forumNickname !== "string") config.forumNickname = "";
    if (!config.forumSpeakStyle || !FORUM_STYLE_PRESETS[config.forumSpeakStyle]) config.forumSpeakStyle = "lively";
    if (typeof config.forumCustomStyleText !== "string") config.forumCustomStyleText = "";
    if (!config.groupChatTheme || !GROUP_CHAT_THEMES[config.groupChatTheme]) config.groupChatTheme = "story_sync";
    if (typeof config.groupChatCustomThemeText !== "string") config.groupChatCustomThemeText = "";
    if (config.theme === "palaceglass") config.theme = "palace";
  } catch (e) {}

  const saveConfig = () => { try { localStorage.setItem(GLOBAL_CFG_KEY, JSON.stringify(config)); } catch (e) {} };

  function isAutoModuleOn(modName) {
    if (config.autoMasterAll) return true;
    return Boolean(config.autoModules && config.autoModules[modName]);
  }

  function escapeRegExp(str) {
    return String(str || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function simpleHash(str) {
    let h = 2166136261;
    const s = String(str || "");
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }

  // ==================== 稳固多存档识别与防丢档机制 ====================
  function detectCurrentChatSessionKey() {
    try {
      const stCtx = targetWin.SillyTavern?.getContext?.() || window.SillyTavern?.getContext?.();
      if (stCtx) {
        const cid = stCtx.chatId || stCtx.chat_metadata?.chat_id_hash || "";
        const charId = stCtx.characterId !== undefined ? stCtx.characterId : (stCtx.groupId || "g");
        if (cid && String(cid).trim() && String(cid) !== "undefined" && String(cid) !== "null") {
          const cleanCid = `st_${charId}_${String(cid).replace(/[^a-zA-Z0-9_\-\u4e00-\u9fa5]/g, "_")}`;
          try { localStorage.setItem(LAST_ACTIVE_SESSION_KEY, cleanCid); } catch (e) {}
          return cleanCid;
        }
        if (Array.isArray(stCtx.chat) && stCtx.chat.length > 0) {
          const firstMes = (stCtx.chat[0]?.mes || stCtx.chat[0]?.message || "").slice(0, 100);
          const sendDate = stCtx.chat[0]?.send_date || "";
          const hashKey = `st_hash_${charId}_${simpleHash(sendDate + "|" + firstMes)}`;
          try { localStorage.setItem(LAST_ACTIVE_SESSION_KEY, hashKey); } catch (e) {}
          return hashKey;
        }
      }
      // 如果酒馆上下文还在加载中，优先沿用上一次激活的存档Key，绝不轻易重置为空白！
      const lastSavedKey = localStorage.getItem(LAST_ACTIVE_SESSION_KEY);
      if (lastSavedKey) return lastSavedKey;
    } catch (e) {}
    return "default_session";
  }

  function detectCurrentUserName() {
    try {
      const stCtx = targetWin.SillyTavern?.getContext?.() || window.SillyTavern?.getContext?.();
      if (stCtx?.name1 && String(stCtx.name1).trim() && stCtx.name1 !== "User") {
        return String(stCtx.name1).trim();
      }
      const th = targetWin.TavernHelper || window.TavernHelper;
      if (th && typeof th.substitutes === "function") {
        const u = th.substitutes("user");
        if (u && !u.includes("{{") && u.trim() && u.trim() !== "User") return u.trim();
      }
      const userMesList = targetDoc.querySelectorAll('#chat .mes[is_user="true"]');
      if (userMesList.length > 0) {
        const lastUserMes = userMesList[userMesList.length - 1];
        const domName = lastUserMes.getAttribute("ch_name") || lastUserMes.querySelector(".name_text, .ch_name")?.textContent;
        if (domName && domName.trim() && domName.trim() !== "User") return domName.trim();
      }
      if (targetWin.name1 && String(targetWin.name1).trim() && targetWin.name1 !== "User") {
        return String(targetWin.name1).trim();
      }
    } catch (e) {}
    return config.lastKnownUserName || "云鸢";
  }

  // ==================== 当前对话框绑定的运行时 State（群聊默认为空白） ====================
  const state = {
    currentSessionKey: "",
    userName: detectCurrentUserName(),
    userIdentity: "未同步",
    time: "未同步",
    location: "未同步",
    mood: "未同步",
    pose: "未同步",
    clothes: "未同步",
    innerThought: "",
    diary: "",
    affection: 0,
    hasAffection: false,
    stage: "未同步",
    inNews: "",
    outNews: "",
    todo1: "",
    todo2: "",
    hasDirectStatusTags: false,
    lastAutoProcessedRoundId: "",
    plotSummary: [],
    palaceDynamics: [],
    outsideDynamics: [],
    posts: [],
    storyPlans: [],
    theaterText: "",
    replyTargets: {},
    chatQuoteTarget: null,
    dmQuoteTarget: null,
    groupMessages: [], // 默认空白，刷新才出
    dmNpcOptions: [...BASE_DM_NPC_CATALOG],
    dmActiveNpc: "萧承稷",
    dmHistories: {},
    emperorSpyData: null,
    emperorSpyRevealed: {}, // 记录哪些卡片已被点开查看
    emperorCardClickCount: 0, // 点开不同卡片的累计次数
    emperorNextCatchThreshold: Math.floor(Math.random() * 3) + 3, // 点开3~5次触发抓包
    isAutoRunning: false,
    isGlobalRefreshing: false,
    hasUnreadFabGlow: false,
    apiLogs: []
  };

  function resetStateToBlankForNewChat(sessionKey) {
    state.currentSessionKey = sessionKey;
    state.userName = detectCurrentUserName();
    state.userIdentity = "未同步";
    state.time = "未同步";
    state.location = "未同步";
    state.mood = "未同步";
    state.pose = "未同步";
    state.clothes = "未同步";
    state.innerThought = "";
    state.diary = "";
    state.affection = 0;
    state.hasAffection = false;
    state.stage = "未同步";
    state.inNews = "";
    state.outNews = "";
    state.todo1 = "";
    state.todo2 = "";
    state.hasDirectStatusTags = false;
    state.lastAutoProcessedRoundId = "";
    state.plotSummary = [];
    state.palaceDynamics = [];
    state.outsideDynamics = [];
    state.posts = [];
    state.storyPlans = [];
    state.theaterText = "";
    state.replyTargets = {};
    state.chatQuoteTarget = null;
    state.dmQuoteTarget = null;
    state.groupMessages = [];
    state.dmActiveNpc = "萧承稷";
    state.dmHistories = {};
    state.emperorSpyData = null;
    state.emperorSpyRevealed = {};
    state.emperorCardClickCount = 0;
    state.emperorNextCatchThreshold = Math.floor(Math.random() * 3) + 3;
  }

  function saveCurrentChatSessionData() {
    const key = state.currentSessionKey || detectCurrentChatSessionKey();
    if (!key) return;
    state.currentSessionKey = key;
    deduplicateTimelineInPlace();
    const payload = {
      userIdentity: state.userIdentity,
      time: state.time,
      location: state.location,
      mood: state.mood,
      pose: state.pose,
      clothes: state.clothes,
      innerThought: state.innerThought,
      diary: state.diary,
      affection: state.affection,
      hasAffection: state.hasAffection,
      stage: state.stage,
      inNews: state.inNews,
      outNews: state.outNews,
      todo1: state.todo1,
      todo2: state.todo2,
      lastAutoProcessedRoundId: state.lastAutoProcessedRoundId,
      plotSummary: state.plotSummary,
      palaceDynamics: state.palaceDynamics,
      outsideDynamics: state.outsideDynamics,
      posts: state.posts,
      storyPlans: state.storyPlans,
      theaterText: state.theaterText,
      groupMessages: state.groupMessages,
      dmActiveNpc: state.dmActiveNpc,
      dmHistories: state.dmHistories,
      dmCustomNpcs: state.dmNpcOptions.filter(x => x.isDynamic),
      emperorSpyData: state.emperorSpyData,
      emperorSpyRevealed: state.emperorSpyRevealed,
      emperorCardClickCount: state.emperorCardClickCount,
      emperorNextCatchThreshold: state.emperorNextCatchThreshold
    };
    try {
      localStorage.setItem(CHAT_STORE_PREFIX + key, JSON.stringify(payload));
      localStorage.setItem(LAST_ACTIVE_SESSION_KEY, key);
    } catch (e) {}
  }

  function loadChatSessionData(sessionKey) {
    if (!sessionKey) return;
    // 尝试读取 v31 存档，若无则自动兼容迁移 v30 同名存档
    let raw = null;
    try {
      raw = localStorage.getItem(CHAT_STORE_PREFIX + sessionKey) || localStorage.getItem("tw_palace_chat_data_v30_" + sessionKey);
    } catch (e) {}

    resetStateToBlankForNewChat(sessionKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      state.userIdentity = parsed.userIdentity || "未同步";
      state.time = parsed.time || "未同步";
      state.location = parsed.location || "未同步";
      state.mood = parsed.mood || "未同步";
      state.pose = parsed.pose || "未同步";
      state.clothes = parsed.clothes || "未同步";
      state.innerThought = parsed.innerThought || "";
      state.diary = parsed.diary || "";
      state.affection = Number(parsed.affection) || 0;
      state.hasAffection = Boolean(parsed.hasAffection);
      state.stage = parsed.stage || "未同步";
      state.inNews = parsed.inNews || "";
      state.outNews = parsed.outNews || "";
      state.todo1 = parsed.todo1 || "";
      state.todo2 = parsed.todo2 || "";
      state.lastAutoProcessedRoundId = parsed.lastAutoProcessedRoundId || "";
      state.plotSummary = Array.isArray(parsed.plotSummary) ? parsed.plotSummary : [];
      state.palaceDynamics = Array.isArray(parsed.palaceDynamics) ? parsed.palaceDynamics : [];
      state.outsideDynamics = Array.isArray(parsed.outsideDynamics) ? parsed.outsideDynamics : [];
      state.posts = Array.isArray(parsed.posts) ? parsed.posts : [];
      state.storyPlans = Array.isArray(parsed.storyPlans) ? parsed.storyPlans : [];
      state.theaterText = parsed.theaterText || "";
      state.groupMessages = Array.isArray(parsed.groupMessages) ? parsed.groupMessages : [];
      state.dmActiveNpc = parsed.dmActiveNpc || "萧承稷";
      state.dmHistories = (parsed.dmHistories && typeof parsed.dmHistories === "object") ? parsed.dmHistories : {};
      if (Array.isArray(parsed.dmCustomNpcs) && parsed.dmCustomNpcs.length) {
        const merged = [...BASE_DM_NPC_CATALOG];
        parsed.dmCustomNpcs.forEach(c => {
          if (c && c.id && !merged.some(m => m.id === c.id)) merged.push(c);
        });
        state.dmNpcOptions = merged;
      }
      state.emperorSpyData = parsed.emperorSpyData || null;
      state.emperorSpyRevealed = (parsed.emperorSpyRevealed && typeof parsed.emperorSpyRevealed === "object") ? parsed.emperorSpyRevealed : {};
      state.emperorCardClickCount = Number(parsed.emperorCardClickCount) || 0;
      state.emperorNextCatchThreshold = Number(parsed.emperorNextCatchThreshold) || (Math.floor(Math.random() * 3) + 3);
      saveCurrentChatSessionData();
    } catch (e) {}
    deduplicateTimelineInPlace();
  }

  function checkAndSwitchChatSessionIfNeeded() {
    const detectedKey = detectCurrentChatSessionKey();
    if (!detectedKey || detectedKey === "default_session") return false;
    if (!state.currentSessionKey) {
      loadChatSessionData(detectedKey);
      return true;
    }
    if (detectedKey !== state.currentSessionKey) {
      // 切换前先把旧档保存好
      saveCurrentChatSessionData();
      loadChatSessionData(detectedKey);
      return true;
    }
    return false;
  }

  function getForumStylePromptBlock() {
    const styleKey = config.forumSpeakStyle || "lively";
    const preset = FORUM_STYLE_PRESETS[styleKey] || FORUM_STYLE_PRESETS.lively;
    const customTxt = (config.forumCustomStyleText || "").trim();
    const activeDesc = (styleKey === "custom" && customTxt)
      ? `用户自定义说话风格要求：【${customTxt}】`
      : preset.desc;

    return `
【论坛说话风格与活人感最高指令（当前风格：${preset.name}）】：
1. 风格要求：${activeDesc}
2. 严禁死板书面语：发帖和评论是大家匿名逛论坛唠嗑，绝对不要写成公文汇报或人物小传！要多用口语、叹词、反问、吐槽、接梗、抢沙发或追问八卦细节。
3. 贴合人设又鲜活：每个NPC既要保持自己的立场脾气（如苏枕月（丽嫔）爱看戏嗑瓜子、秦昭华（德妃）护短嘴快、霍惊弦爱凑热闹、小禄子战战兢兢吃瓜、谢无咎精明爱起哄、萧承稷冷不丁冒出来压场子），又要用鲜活生动的活人口吻说话！`;
  }

  // ==================== 规范后妃姓名（位分）与论坛马甲保护 ====================
  function formatConsortStandardName(rawName) {
    let s = String(rawName || "").trim();
    if (!s) return s;
    const consortRules = [
      { keys: ["崔清漪", "崔淑妃", "淑妃"], std: "崔清漪（淑妃）" },
      { keys: ["秦昭华", "秦德妃", "德妃"], std: "秦昭华（德妃）" },
      { keys: ["卢婉兮", "卢修仪", "修仪"], std: "卢婉兮（修仪）" },
      { keys: ["苏枕月", "苏丽嫔", "丽嫔"], std: "苏枕月（丽嫔）" },
      { keys: ["柳如絮", "柳婕妤", "婕妤"], std: "柳如絮（婕妤）" },
      { keys: ["郑芷兰", "郑美人"], std: "郑芷兰（美人）" },
      { keys: ["周妙音", "周才人"], std: "周妙音（才人）" },
      { keys: ["韩怜儿", "韩宝林"], std: "韩怜儿（宝林）" },
      { keys: ["沈青禾", "沈选侍"], std: "沈青禾（选侍）" }
    ];
    for (const item of consortRules) {
      if (item.keys.some(k => s === k || s === `${item.keys[0]}·${item.keys[2]}`)) {
        return item.std;
      }
    }
    return s;
  }

  function normalizeForumNickWithRealName(rawNick, fallbackIdx = 0) {
    let s = String(rawNick || "").trim();
    if (!s) return FALLBACK_FORUM_NICKS[fallbackIdx % FALLBACK_FORUM_NICKS.length];

    const uName = state.userName || detectCurrentUserName();
    const customAlias = (config.forumNickname || "").trim();

    if (customAlias && (s === customAlias || s === `【${customAlias}】`)) {
      return customAlias;
    }
    if (s === uName) {
      return customAlias ? customAlias : uName;
    }

    s = enforceAddressingRules(s, true);
    s = s.replace(/\(([^)]+)\)/g, "（$1）");
    if (s.includes("（") && s.includes("）")) {
      return s;
    }

    for (const item of NPC_ALIAS_MAP) {
      for (const kw of item.match) {
        if (s === kw) return item.full;
        if (s.includes(kw)) {
          const pureNick = s.replace(kw, "").replace(/[·\-—_：:\s]/g, "").trim();
          if (pureNick) return `${pureNick}（${item.match[0]}）`;
          return item.full;
        }
      }
    }

    return s;
  }

  function pickForumNick(obj, fallbackIdx = 0) {
    if (!obj || typeof obj !== "object") {
      return FALLBACK_FORUM_NICKS[fallbackIdx % FALLBACK_FORUM_NICKS.length];
    }
    const customAlias = (config.forumNickname || "").trim();
    if (obj.isSelfUser) {
      return customAlias || state.userName;
    }
    const realNameField = obj.realName || obj.trueName || obj.npc || obj.character || "";
    const candidates = [
      obj.nick, obj.nickname, obj.author, obj.user, obj.username,
      obj.name, obj.sender, obj.poster, obj.speaker
    ];
    for (const c of candidates) {
      if (typeof c === "string" && c.trim()) {
        let raw = c.trim();
        if (customAlias && raw === customAlias) return customAlias;
        if (realNameField && typeof realNameField === "string" && !raw.includes("（") && !raw.includes("(")) {
          raw = `${raw}（${realNameField.trim()}）`;
        }
        return normalizeForumNickWithRealName(raw, fallbackIdx);
      }
    }
    return FALLBACK_FORUM_NICKS[fallbackIdx % FALLBACK_FORUM_NICKS.length];
  }

  function pickForumText(obj) {
    if (!obj || typeof obj !== "object") return "";
    const candidates = [obj.text, obj.content, obj.comment, obj.reply, obj.body, obj.message, obj.msg];
    for (const c of candidates) {
      if (typeof c === "string" && c.trim()) {
        return enforceAddressingRules(c.trim(), true);
      }
    }
    return "";
  }

  // ==================== 悬浮球流光提醒 + 模块刷新Toast + 仿微信通知横幅 ====================
  function triggerFabGlowReminder() {
    const overlay = targetDoc.getElementById("twModalOverlay");
    const fab = targetDoc.getElementById("twFabBall");
    if (!fab) return;
    if (overlay && overlay.classList.contains("tw-hidden")) {
      state.hasUnreadFabGlow = true;
      fab.classList.add("tw-fab-glow-active");
    }
  }

  function clearFabGlowReminder() {
    state.hasUnreadFabGlow = false;
    targetDoc.getElementById("twFabBall")?.classList.remove("tw-fab-glow-active");
  }

  let toastTimer = null;
  function showModuleSuccessToast(moduleTitle) {
    triggerFabGlowReminder();
    const toast = targetDoc.getElementById("twModuleToast");
    const txt = targetDoc.getElementById("twModuleToastText");
    if (!toast || !txt) return;
    txt.textContent = `✨ 【${moduleTitle}】刷新成功`;
    toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  let wechatBannerTimer = null;
  function showWechatNotification(senderName, previewText, jumpTarget = { tab: "games", subgame: "dm", npc: "" }) {
    triggerFabGlowReminder();
    const banner = targetDoc.getElementById("twWechatBanner");
    const avatarEl = targetDoc.getElementById("twWechatAvatar");
    const senderEl = targetDoc.getElementById("twWechatSender");
    const msgEl = targetDoc.getElementById("twWechatPreview");
    if (!banner || !senderEl || !msgEl) return;

    if (avatarEl) avatarEl.textContent = String(senderName || "宫").charAt(0);
    senderEl.textContent = senderName || "太微宫传信";
    msgEl.textContent = cleanPureText(previewText).slice(0, 42);
    banner.dataset.jumpTab = jumpTarget.tab || "games";
    banner.dataset.jumpSubgame = jumpTarget.subgame || "dm";
    banner.dataset.jumpNpc = jumpTarget.npc || "";

    banner.classList.add("show");
    if (wechatBannerTimer) clearTimeout(wechatBannerTimer);
    wechatBannerTimer = setTimeout(() => {
      banner.classList.remove("show");
    }, 4500);
  }

  function addApiLog(entry) {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    state.apiLogs.unshift({
      id: Date.now() + Math.random(),
      time: timeStr,
      source: entry.source || "通用请求",
      mode: entry.mode || (config.apiMode === "custom" ? `自定义 · ${config.apiModel || "默认"}` : "酒馆主 API"),
      status: entry.status || "success",
      duration: entry.duration || 0,
      detail: entry.detail || ""
    });
    if (state.apiLogs.length > 40) state.apiLogs.pop();
    renderApiLogs();
  }

  function showApiErrorBanner(sourceName, errMsg) {
    const errBar = targetDoc.getElementById("twApiErrorBanner");
    const errTxt = targetDoc.getElementById("twApiErrorText");
    if (!errBar || !errTxt) return;
    errTxt.textContent = `⚠️ API 调用出错 [${sourceName}]：${errMsg}`;
    errBar.classList.add("show");
  }

  function hideApiErrorBanner() {
    targetDoc.getElementById("twApiErrorBanner")?.classList.remove("show");
  }

  function renderApiLogs() {
    const box = targetDoc.getElementById("twApiLogList");
    const countBadge = targetDoc.getElementById("twApiLogCountBadge");
    if (countBadge) countBadge.textContent = `共 ${state.apiLogs.length} 条`;
    if (!box) return;
    if (!state.apiLogs.length) {
      box.innerHTML = `<div class="tw-empty-hint" style="padding:10px;">暂无 API 调用记录</div>`;
      return;
    }
    box.innerHTML = state.apiLogs.map(log => {
      const isErr = log.status === "error";
      return `
        <div class="tw-log-item ${isErr ? "err" : "ok"}">
          <div class="tw-log-top">
            <span><b>[${log.time}] ${log.source}</b> · ${log.mode}</span>
            <span class="tw-log-tag ${isErr ? "err" : "ok"}">${isErr ? "失败" : "成功"} · ${log.duration}ms</span>
          </div>
          <div class="tw-log-detail">${log.detail}</div>
        </div>`;
    }).join("");
  }

  function deduplicateTimelineInPlace() {
    if (!Array.isArray(state.plotSummary) || state.plotSummary.length <= 1) return;
    const cleaned = [];
    const seenRoundIds = new Set();
    for (const item of state.plotSummary) {
      if (!item || !item.summary) continue;
      const rid = item.roundId || item.turnKey || "";
      if (rid && rid !== "legacy" && seenRoundIds.has(rid)) {
        const existIdx = cleaned.findIndex(x => (x.roundId || x.turnKey) === rid);
        if (existIdx >= 0) cleaned[existIdx] = item;
        continue;
      }
      const prev = cleaned[cleaned.length - 1];
      if (prev && prev.time === item.time && prev.location === item.location && prev.summary.slice(0, 14) === item.summary.slice(0, 14)) {
        cleaned[cleaned.length - 1] = item;
        continue;
      }
      if (rid) seenRoundIds.add(rid);
      cleaned.push(item);
    }
    state.plotSummary = cleaned;
  }

  const saveTimeline = () => {
    saveCurrentChatSessionData();
  };

  if (state.userName && state.userName !== config.lastKnownUserName) {
    config.lastKnownUserName = state.userName;
    saveConfig();
  }

  // ==================== 世界观称呼铁律（严禁自称“孤”，后妃统一真名（位分）） ====================
  function getWorldAddressRules() {
    const uName = state.userName || detectCurrentUserName();
    return `
【大景王朝世界观、人物人设、后妃称呼与禁用词最高铁律】：
一、女主姓名自然书写规则：
1. 当前女主的名字叫：${uName}。
2. 提及女主时，请直接自然地写出 ${uName} 的名字，严禁在 ${uName} 名字外面加【】方括号！也严禁出现“主控”、“玩家”、“女主”等跳戏词汇！

二、萧承稷自称与说话风格死命令（严禁OOC）：
1. 萧承稷是大景王朝已登基的天子（皇帝），【只自称“朕”】（私下对挚友或亲密时的 ${uName} 偶称“我”），【绝对禁止自称“孤”或“本王”】！任何情况下都不准出现“孤”这个自称！
2. 萧承稷性格冷漠疏离、城府深沉、掌控欲极强，说话简短、直接、平稳，多用陈述句或祈使句，绝不啰嗦抒情。

三、后宫妃嫔统一命名格式与大景唐制称呼铁律：
1. 提及或扮演后宫妃嫔时，发送人名称统一采用「真名（位分）」格式：
   - 崔清漪（淑妃） — 正一品淑妃，居淑景殿，清河崔氏嫡女，端庄冷傲、心机深沉
   - 秦昭华（德妃） — 正一品德妃，居承香殿，将门虎女，明艳张扬、直来直去
   - 卢婉兮（修仪） — 正二品修仪，居凝华殿，范阳卢氏，善妒刻薄
   - 苏枕月（丽嫔） — 正二品丽嫔，居玉照宫，江南豪商之女，慵懒散漫、爱看戏吃瓜
   - 柳如絮（婕妤） — 正三品婕妤，居听竹轩，寒门才女，清冷坚韧
   - 郑芷兰（美人） — 正四品美人，居流霞阁，表面温顺实则擅挑拨
   - 周妙音（才人） — 正五品才人，居揽月阁，蠢毒虚荣
   - 韩怜儿（宝林） — 正六品宝林，居秋水居，怨毒蛰伏
   - 沈青禾（选侍） — 正七品选侍，居翠微居，胆小本分、懂医理草木
2. 尊称皇帝为“陛下”、“圣人”，严禁称“万岁爷”、“皇上”、“主子”！
3. 后妃尊称“娘娘”、“某娘子”，自称“妾”、“妾身”，严禁使用“小主”、“本宫”、“臣妾”、“答应”、“常在”、“贵人”！
4. 内侍与宫女一律自称“奴婢”，严禁自称“奴才”！年长女官称“姑姑”，严禁称“嬷嬷”！`;
  }

  function enforceAddressingRules(text, preserveForumAlias = false) {
    if (!text) return "";
    const uName = state.userName || detectCurrentUserName();
    const customNick = (config.forumNickname || "").trim();

    let res = String(text);
    const aliasPlaceholder = "__TW_FORUM_ALIAS_PROTECTED__";
    if (preserveForumAlias && customNick) {
      res = res.split(customNick).join(aliasPlaceholder);
    }

    res = res
      .replace(/【\s*(主控|玩家|女主|user)\s*】/gi, uName)
      .replace(/主控|玩家|女主/g, uName)
      .replace(/(?<!["'\w])user(?!["'\w])/gi, uName);

    if (config.lastKnownUserName && config.lastKnownUserName !== uName && config.lastKnownUserName !== customNick) {
      res = res.split(config.lastKnownUserName).join(uName);
    }
    if (uName !== "海绵" && customNick !== "海绵") {
      res = res.replace(/海绵/g, uName);
    }

    if (uName) {
      const escName = escapeRegExp(uName);
      res = res.replace(new RegExp(`【\\s*(${escName})\\s*】`, "g"), "$1");
    }

    // 强制拦截萧承稷台词中的自称“孤”，替换为“朕”（不影响“孤立、孤身、孤本、孤女、孤单、孤高、阿古拉”等正常词汇）
    res = res.replace(/(?<![\u4e00-\u9fa5])孤(?![立身本女单高儿寡零魂芳傲岛负月灯木掌臣])/g, "朕");

    res = res
      .replace(/小主/g, "娘子")
      .replace(/臣妾/g, "妾身")
      .replace(/万岁爷/g, "圣人")
      .replace(/皇上/g, "陛下")
      .replace(/老奴|奴才/g, "奴婢")
      .replace(/嬷嬷/g, "姑姑")
      .replace(/([崔卢沈陆赵柳温秦顾侯魏裴])大人/g, "$1公")
      .replace(/大人/g, "上官")
      .replace(/养心殿|乾清宫/g, "甘露殿")
      .replace(/御书房/g, "延英殿")
      .replace(/坤宁宫|凤仪宫|椒房殿/g, "立政殿")
      .replace(/翊坤宫|景仁宫|钟粹宫/g, "淑景殿")
      .replace(/永寿宫|咸福宫/g, "承香殿")
      .replace(/储秀宫|承乾宫/g, "凝华殿")
      .replace(/延禧宫|启祥宫/g, "玉照宫")
      .replace(/凝月轩/g, "听竹轩")
      .replace(/慈宁宫|寿康宫/g, "太微宫")
      .replace(/慎刑司/g, "暴室")
      .replace(/敬事房/g, "内侍监")
      .replace(/崔皇后|崔贵妃|淑妃崔氏/g, "崔淑妃")
      .replace(/秦贵妃|秦淑妃/g, "秦德妃")
      .replace(/卢贵妃|卢妃|卢昭仪|卢嫔|卢贵人/g, "卢修仪")
      .replace(/苏贵妃|苏妃|苏昭仪|苏贵人/g, "苏丽嫔")
      .replace(/柳嫔|柳贵人|柳才人|柳常在|柳答应/g, "柳婕妤")
      .replace(/郑嫔|郑贵人|郑才人/g, "郑美人")
      .replace(/周贵人|周常在|周答应|周美人/g, "周才人")
      .replace(/韩答应|韩常在|韩才人|韩贵人/g, "韩宝林")
      .replace(/沈答应|沈常在|沈才人|沈贵人/g, "沈选侍")
      .replace(new RegExp(`皇后娘娘(?!${escapeRegExp(uName)})`, "g"), "淑妃娘娘");

    if (preserveForumAlias && customNick) {
      res = res.split(aliasPlaceholder).join(customNick);
      const escNick = escapeRegExp(customNick);
      res = res.replace(new RegExp(`【\\s*(${escNick})\\s*】`, "g"), "$1");
    }
    return res;
  }

  function ensureUserNameInSummary(rawText) {
    let txt = enforceAddressingRules(rawText).trim();
    if (!txt) return "";
    const uName = state.userName || detectCurrentUserName();
    if (txt.includes(uName)) return txt;
    if (/^(她|少女|女子|新晋后妃|新晋嫔妃)/.test(txt)) {
      return txt.replace(/^(她|少女|女子|新晋后妃|新晋嫔妃)/, uName);
    }
    if (txt.includes("她")) {
      return txt.replace("她", uName);
    }
    if (/^(初入|入宫|在|于|前往|来到|居于|身处|偶遇|奉旨|蒙|获|被|因|与|随|听闻|收到|面对)/.test(txt)) {
      return `${uName}${txt}`;
    }
    return `${uName}：${txt}`;
  }

  const cleanPureText = (raw) => enforceAddressingRules(
    String(raw || "")
      .replace(/<startTime>[\s\S]*?<\/startTime>/gi, "")
      .replace(/<endTime>[\s\S]*?<\/endTime>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\b20\d{2}[-/]\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{2}(:\d{2})?\b/g, "")
      .replace(/[`*#~|]/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim()
  );

  function stripMetaAndStatusTags(raw) {
    if (!raw) return "";
    return String(raw)
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, "")
      .replace(/<xiao_chengji_cot>[\s\S]*?<\/xiao_chengji_cot>/gi, "")
      .replace(/<(角色名|时间|地点|天气|穿着|姿势|心情|心理活动|好感度数值|好感度阶段|user身份|预留字段1|宫内见闻|帝王日记|待办1|待办2|预留字段2|宫外见闻)>[\s\S]*?<\/\1>/gi, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  // ==================== 样式表（含悬浮球居中靠右、圣人日常精致平行翻牌卡片） ====================
  const styleEl = targetDoc.createElement("style");
  styleEl.id = "tw-floating-style";
  styleEl.textContent = `
    #tw-floating-root {
      --bg-paper:#f3ead8; --bg-card:rgba(251,246,234,0.95); --bg-nav:#e5d6bc; --bg-sub:rgba(226,211,183,0.58);
      --border-outer:#8c6239; --border-inner:#c4a472; --border-soft:#cbb58d;
      --head-grad:linear-gradient(135deg,#5e1d18 0%,#7d2922 55%,#511814 100%);
      --fab-grad:linear-gradient(145deg,#7a241d 0%,#4a120e 100%);
      --text-main:#2b2018; --text-sub:#6e5a49; --accent:#852922; --accent-strong:#591611; --gold:#b88a3e; --head-text:#f7ead0;
      --paper-vignette:inset 0 0 48px rgba(110,78,40,0.2);
      font-family:"STKaiti","Kaiti SC","Noto Serif SC","Songti SC","Microsoft YaHei",serif; color:var(--text-main); z-index:2147483647;
    }
    #tw-floating-root[data-theme="white"] {
      --bg-paper:#ffffff; --bg-card:#fafafc; --bg-nav:#f2f3f6; --bg-sub:#f2f4f8;
      --border-outer:#646c78; --border-inner:#c2c7d0; --border-soft:#dcdfe6;
      --head-grad:linear-gradient(135deg,#2c323b 0%,#404854 55%,#232830 100%);
      --fab-grad:linear-gradient(145deg,#3c4452 0%,#1e232b 100%);
      --text-main:#1d2129; --text-sub:#606875; --accent:#39424e; --accent-strong:#14181f; --gold:#9c8050; --head-text:#ffffff;
      --paper-vignette:inset 0 0 36px rgba(0,0,0,0.04);
    }
    #tw-floating-root[data-theme="celadon"] {
      --bg-paper:#e6efe9; --bg-card:#f4faf7; --bg-nav:#cfdfd8; --bg-sub:rgba(205,223,215,0.65);
      --border-outer:#466e62; --border-inner:#86aba0; --border-soft:#a9c4bc;
      --head-grad:linear-gradient(135deg,#22423a 0%,#355e53 55%,#1d3831 100%);
      --fab-grad:linear-gradient(145deg,#355e53 0%,#1b362f 100%);
      --text-main:#1b2b27; --text-sub:#526e66; --accent:#2c594e; --accent-strong:#173830; --gold:#527d70; --head-text:#ebf5f1;
      --paper-vignette:inset 0 0 48px rgba(45,85,73,0.16);
    }
    #tw-floating-root[data-theme="obsidian"] {
      --bg-paper:#1e1b18; --bg-card:#28231e; --bg-nav:#27221d; --bg-sub:#352e27;
      --border-outer:#b88d44; --border-inner:#6e552b; --border-soft:#4d4134;
      --head-grad:linear-gradient(135deg,#120f0d 0%,#2b221a 55%,#14110e 100%);
      --fab-grad:linear-gradient(145deg,#382c20 0%,#14110e 100%);
      --text-main:#e6dac6; --text-sub:#a3927b; --accent:#d4a857; --accent-strong:#f0c97d; --gold:#c79a4b; --head-text:#f5dfb3;
      --paper-vignette:inset 0 0 55px rgba(0,0,0,0.55);
    }
    #tw-floating-root[data-theme="rouge"] {
      --bg-paper:#f7e8ea; --bg-card:#fef6f7; --bg-nav:#edd1d6; --bg-sub:rgba(237,209,214,0.65);
      --border-outer:#9c515d; --border-inner:#cfa0a8; --border-soft:#dab3b9;
      --head-grad:linear-gradient(135deg,#6b2532 0%,#913948 55%,#591d28 100%);
      --fab-grad:linear-gradient(145deg,#993948 0%,#571b25 100%);
      --text-main:#361e22; --text-sub:#7d565d; --accent:#8f3342; --accent-strong:#631c28; --gold:#a85865; --head-text:#fff0f2;
      --paper-vignette:inset 0 0 48px rgba(135,60,75,0.16);
    }
    #tw-floating-root[data-theme="palace"] {
      --bg-paper:rgba(255, 250, 243, 0.66);
      --bg-card:rgba(255, 255, 255, 0.56);
      --bg-nav:rgba(250, 239, 222, 0.62);
      --bg-sub:rgba(247, 236, 218, 0.52);
      --border-outer:rgba(205, 162, 90, 0.85);
      --border-inner:rgba(255, 255, 255, 0.88);
      --border-soft:rgba(212, 175, 112, 0.42);
      --head-grad:linear-gradient(135deg, rgba(168, 52, 46, 0.82) 0%, rgba(201, 134, 68, 0.78) 52%, rgba(148, 42, 38, 0.84) 100%);
      --fab-grad:linear-gradient(145deg, rgba(182, 58, 50, 0.9) 0%, rgba(138, 38, 32, 0.92) 100%);
      --text-main:#332018; --text-sub:#785c49; --accent:#9e2f28; --accent-strong:#6e1813; --gold:#c99846; --head-text:#fffaf0;
      --paper-vignette:inset 0 0 38px rgba(255, 255, 255, 0.65);
    }
    #tw-floating-root[data-theme="newspaper"] {
      --bg-paper:#ece5d5; --bg-card:#f4efe4; --bg-nav:#dfd6c3; --bg-sub:#e4dccb;
      --border-outer:#221e1a; --border-inner:#524a40; --border-soft:#8c8273;
      --head-grad:linear-gradient(180deg, #1f1b18 0%, #2e2924 100%);
      --fab-grad:linear-gradient(145deg, #2b2622 0%, #14110f 100%);
      --text-main:#1a1715; --text-sub:#575047; --accent:#8f241e; --accent-strong:#14110f; --gold:#7a6a53; --head-text:#f4efe4;
      --paper-vignette:inset 0 0 40px rgba(40, 32, 22, 0.14);
      font-family:"Songti SC","Noto Serif SC","SimSun","STSong",serif;
    }

    #tw-floating-root * { box-sizing:border-box; }
    #tw-floating-root.tw-chat-inactive { display:none !important; }

    /* 悬浮球默认位置：屏幕垂直正中间靠右 + 流光呼吸动效 */
    @keyframes twFabStreamGlow {
      0% { box-shadow:0 0 12px #f5d380, 0 0 24px #c93b2b, inset 0 0 12px rgba(255,225,150,0.75); border-color:#ffe49e; }
      50% { box-shadow:0 0 22px #ffdf85, 0 0 38px #e64833, 0 0 52px rgba(255,190,70,0.65), inset 0 0 18px rgba(255,240,190,0.95); border-color:#ffffff; }
      100% { box-shadow:0 0 12px #f5d380, 0 0 24px #c93b2b, inset 0 0 12px rgba(255,225,150,0.75); border-color:#ffe49e; }
    }
    @keyframes twFabShineSweep {
      0% { transform:translateX(-120%) rotate(25deg); }
      100% { transform:translateX(220%) rotate(25deg); }
    }
    .tw-fab-ball {
      position:fixed; right:14px; top:50%; transform:translateY(-50%);
      width:58px; height:68px; background:var(--fab-grad);
      border:2px solid var(--gold); border-radius:14px 14px 26px 26px; color:var(--head-text);
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      cursor:pointer; user-select:none; touch-action:none; z-index:2147483647;
      box-shadow:0 8px 24px rgba(0,0,0,0.55),inset 0 0 0 3px rgba(255,255,255,0.12),inset 0 0 14px rgba(212,168,87,0.35);
      overflow:hidden;
    }
    .tw-fab-ball::before { content:""; position:absolute; inset:4px; border:1px solid rgba(245,223,179,0.45); border-radius:10px 10px 22px 22px; pointer-events:none; }
    .tw-fab-ball.tw-fab-glow-active {
      animation:twFabStreamGlow 1.6s infinite ease-in-out;
    }
    .tw-fab-ball.tw-fab-glow-active::after {
      content:""; position:absolute; top:-30%; left:-50%; width:60%; height:160%;
      background:linear-gradient(90deg, transparent, rgba(255,245,200,0.75), transparent);
      animation:twFabShineSweep 1.8s infinite linear; pointer-events:none;
    }
    .tw-fab-dot {
      display:none; position:absolute; top:5px; right:6px; width:9px; height:9px;
      border-radius:50%; background:#ff3b30; border:1.5px solid #fff; box-shadow:0 0 6px #ff3b30;
    }
    .tw-fab-ball.tw-fab-glow-active .tw-fab-dot { display:block; }
    .tw-fab-top { font-size:9.5px; letter-spacing:2px; opacity:.85; border-bottom:1px solid rgba(245,223,179,0.4); padding-bottom:2px; margin-bottom:3px; }
    .tw-fab-main { font-size:14px; font-weight:bold; letter-spacing:2.5px; line-height:1.15; }
    .tw-fab-ornament { width:18px; height:3px; margin-top:4px; background:linear-gradient(90deg,transparent,var(--gold),transparent); }

    /* 顶部仿微信新消息通知横幅 & 模块刷新成功 Toast */
    .tw-wechat-banner {
      position:fixed; top:16px; left:50%; transform:translateX(-50%) translateY(-130%);
      width:360px; max-width:92vw; background:rgba(32, 35, 42, 0.94); color:#fff;
      backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
      border:1px solid rgba(212, 168, 87, 0.65); border-radius:12px; padding:10px 13px;
      display:flex; align-items:center; gap:10px; z-index:2147483647;
      box-shadow:0 10px 28px rgba(0,0,0,0.45); cursor:pointer;
      transition:transform .32s cubic-bezier(0.22, 1, 0.36, 1), opacity .28s ease; opacity:0; pointer-events:none;
    }
    .tw-wechat-banner.show { transform:translateX(-50%) translateY(0); opacity:1; pointer-events:auto; }
    .tw-wechat-avatar {
      width:36px; height:36px; border-radius:8px; background:linear-gradient(135deg,#852922,#b88a3e);
      color:#fff8eb; font-weight:bold; font-size:15px; display:flex; align-items:center; justify-content:center; flex-shrink:0;
    }
    .tw-wechat-body { flex:1; overflow:hidden; }
    .tw-wechat-top { display:flex; justify-content:space-between; align-items:center; font-size:12px; font-weight:bold; color:#f7ead0; margin-bottom:2px; }
    .tw-wechat-tag { font-size:10px; color:#5cdbd3; font-weight:normal; }
    .tw-wechat-preview { font-size:11.5px; color:#dcdcdc; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

    .tw-module-toast {
      position:fixed; top:68px; left:50%; transform:translateX(-50%) translateY(-20px);
      background:var(--head-grad); color:var(--head-text); border:1.5px solid var(--gold);
      padding:6px 16px; border-radius:20px; font-size:12px; font-weight:bold; letter-spacing:1px;
      box-shadow:0 6px 20px rgba(0,0,0,0.38); z-index:2147483647;
      opacity:0; pointer-events:none; transition:all .25s ease;
    }
    .tw-module-toast.show { transform:translateX(-50%) translateY(0); opacity:1; }

    /* 圣人抓包警告弹窗 */
    .tw-catch-modal {
      display:none; position:absolute; inset:0; background:rgba(15, 8, 6, 0.78);
      backdrop-filter:blur(4px); z-index:99; align-items:center; justify-content:center; padding:18px;
    }
    .tw-catch-modal.show { display:flex; }
    .tw-catch-card {
      width:100%; max-width:380px; background:var(--bg-paper); border:2px solid #9e241e;
      outline:1px solid var(--gold); outline-offset:-5px; border-radius:8px; padding:16px;
      box-shadow:0 16px 40px rgba(0,0,0,0.75); text-align:center;
    }
    .tw-catch-title { font-size:16px; font-weight:bold; color:#9e241e; margin-bottom:8px; letter-spacing:1.5px; }
    .tw-catch-desc { font-size:12.5px; line-height:1.65; color:var(--text-main); margin-bottom:12px; text-align:left; background:var(--bg-sub); padding:9px 11px; border-radius:4px; border-left:3px solid #9e241e; }

    .tw-modal-overlay {
      position:fixed; top:0; left:0; right:0; bottom:0; width:100vw; height:100vh;
      background:rgba(12,8,5,0.58); backdrop-filter:blur(2.5px);
      display:flex; align-items:center; justify-content:center; padding:14px; z-index:2147483646; opacity:1; transition:opacity .2s ease;
    }
    .tw-modal-overlay.tw-hidden { opacity:0; pointer-events:none; display:none !important; }
    .tw-panel {
      width:560px; max-width:96vw; height:700px; max-height:91vh; background-color:var(--bg-paper);
      background-image:repeating-linear-gradient(0deg,rgba(120,90,50,0.03) 0px,rgba(120,90,50,0.03) 1px,transparent 1px,transparent 5px),
        repeating-linear-gradient(90deg,rgba(120,90,50,0.025) 0px,rgba(120,90,50,0.025) 1px,transparent 1px,transparent 7px);
      border:2px solid var(--border-outer); outline:1px solid var(--border-inner); outline-offset:-6px; border-radius:6px;
      box-shadow:0 20px 55px rgba(8,4,2,0.78),var(--paper-vignette); display:flex; flex-direction:column; overflow:hidden; position:relative; margin:auto;
    }
    .tw-head { padding:11px 14px; background:var(--head-grad); color:var(--head-text); border-bottom:2px solid var(--border-outer); display:flex; justify-content:space-between; align-items:center; }
    .tw-head-title { font-size:16px; font-weight:bold; letter-spacing:2px; }
    .tw-head-btns { display:flex; gap:6px; align-items:center; }
    .tw-mini-btn { padding:5px 10px; font-size:11.5px; color:var(--head-text); background:rgba(255,255,255,0.15); border:1px solid rgba(255,240,200,0.45); border-radius:4px; cursor:pointer; font-family:inherit; }
    .tw-mini-btn.api-btn { background:var(--border-outer); color:#fff8eb; font-weight:bold; border-color:#e8c987; }
    .tw-mini-btn:disabled { opacity:.55; cursor:wait; }
    .tw-manual-refresh-btn.disabled-gray,
    .tw-manual-refresh-btn:disabled {
      opacity:0.42 !important; filter:grayscale(100%) !important; cursor:not-allowed !important; pointer-events:none !important;
    }
    .tw-nav { display:flex; overflow-x:auto; white-space:nowrap; background:var(--bg-nav); border-bottom:1.5px solid var(--border-inner); padding:0 4px; scrollbar-width:none; user-select:none; cursor:grab; }
    .tw-nav::-webkit-scrollbar { display:none; }
    .tw-nav button { flex:1 0 auto; min-width:62px; padding:9px 6px; font-size:11.5px; color:var(--text-main); background:transparent; border:0; border-bottom:3px solid transparent; cursor:pointer; font-family:inherit; }
    .tw-nav button.active { color:var(--accent-strong); font-weight:bold; border-bottom-color:var(--accent); background:rgba(255,252,245,0.4); }
    .tw-content { flex:1; overflow-y:auto; padding:12px 14px 18px; font-size:12.5px; }
    .tw-tab-page { display:none; }
    .tw-tab-page.active { display:block; }
    .tw-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:9px; margin-bottom:10px; }
    .tw-box { background:var(--bg-card); border:1px solid var(--border-soft); border-radius:4px; padding:10px 12px; margin-bottom:10px; }
    .tw-label { font-size:11px; color:var(--text-sub); }
    .tw-val { font-size:15px; font-weight:bold; color:var(--accent-strong); margin:3px 0; }
    .tw-bar { height:6px; background:var(--border-soft); border-radius:4px; overflow:hidden; margin-top:5px; }
    .tw-bar i { display:block; height:100%; width:0%; background:linear-gradient(90deg,var(--accent),var(--gold)); transition:width .35s; }
    .tw-sec-head { font-size:13.5px; font-weight:bold; color:var(--accent-strong); margin-bottom:7px; padding-bottom:4px; border-bottom:1px solid var(--border-soft); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px; }
    .tw-badge { display:inline-block; padding:1.5px 6px; font-size:10.5px; color:var(--accent); background:rgba(142,53,46,0.09); border:1px solid var(--border-soft); border-radius:3px; margin-right:4px; }
    .tw-row { padding:6px 0; border-bottom:1px dashed var(--border-soft); line-height:1.6; }
    .tw-row:last-child { border-bottom:0; }
    .tw-row b { color:var(--accent-strong); }

    /* 圣人日常 · 精致平行翻牌卡片网格 */
    .tw-spy-grid {
      display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px;
    }
    .tw-spy-tile {
      position:relative; background:var(--bg-card); border:1.5px solid var(--border-outer);
      border-radius:7px; padding:11px 12px; cursor:pointer; transition:all .22s ease;
      box-shadow:0 3px 10px rgba(80, 50, 20, 0.08), inset 0 0 0 2px rgba(200, 165, 110, 0.16);
      display:flex; flex-direction:column; justify-content:space-between; min-height:108px;
      overflow:hidden;
    }
    .tw-spy-tile:hover {
      transform:translateY(-2px); box-shadow:0 6px 16px rgba(133, 41, 34, 0.18); border-color:var(--accent);
    }
    .tw-spy-tile.sealed {
      background:linear-gradient(145deg, var(--bg-card) 0%, var(--bg-sub) 100%);
      align-items:center; justify-content:center; text-align:center;
    }
    .tw-spy-tile.revealed {
      grid-column:1 / -1; background:var(--bg-card); border-left:4px solid var(--accent); cursor:default;
    }
    .tw-spy-seal-stamp {
      width:34px; height:34px; border-radius:50%; background:rgba(133, 41, 34, 0.12);
      border:1.5px dashed var(--accent); color:var(--accent); display:flex; align-items:center;
      justify-content:center; font-size:16px; margin-bottom:5px;
    }
    .tw-spy-tile-name { font-size:13.5px; font-weight:bold; color:var(--accent-strong); letter-spacing:1px; }
    .tw-spy-tile-sub { font-size:10.5px; color:var(--text-sub); margin-top:2px; }
    .tw-spy-seal-hint {
      margin-top:6px; font-size:10px; padding:2px 8px; border-radius:10px;
      background:var(--accent); color:#fff8eb; letter-spacing:0.5px;
    }
    .tw-spy-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; padding-bottom:4px; border-bottom:1px dashed var(--border-soft); }
    .tw-spy-title { font-weight:bold; color:var(--accent-strong); font-size:13px; display:flex; align-items:center; gap:5px; }
    .tw-spy-detail { font-size:12px; line-height:1.65; color:var(--text-main); margin-bottom:6px; }
    .tw-spy-murmur { padding:6px 9px; background:var(--bg-sub); border-radius:4px; font-size:11.5px; color:var(--accent-strong); border-left:2.5px solid var(--gold); line-height:1.55; }
    .tw-spy-fold-btn { background:none; border:1px solid var(--border-soft); border-radius:3px; font-size:10px; color:var(--text-sub); padding:1px 6px; cursor:pointer; font-family:inherit; }

    .tw-timeline { position:relative; padding-left:16px; margin-top:6px; }
    .tw-timeline::before { content:""; position:absolute; left:5px; top:6px; bottom:6px; width:2px; background:var(--border-outer); opacity:0.55; }
    .tw-tl-item { position:relative; padding:7px 0 9px 6px; border-bottom:1px dashed var(--border-soft); line-height:1.65; }
    .tw-tl-item:last-child { border-bottom:0; }
    .tw-tl-item::before { content:""; position:absolute; left:-15px; top:12px; width:8px; height:8px; border-radius:50%; background:var(--accent); border:1.5px solid var(--bg-paper); box-shadow:0 0 0 1px var(--border-outer); }
    .tw-tl-meta { display:flex; flex-wrap:wrap; gap:5px; align-items:center; margin-bottom:3px; }
    .tw-tl-time { display:inline-block; font-size:11px; font-weight:bold; color:var(--accent-strong); background:var(--bg-sub); border:1px solid var(--border-soft); padding:1px 7px; border-radius:3px; }
    .tw-tl-loc { display:inline-block; font-size:11px; font-weight:bold; color:var(--accent); background:rgba(142,53,46,0.08); border:1px solid var(--border-soft); padding:1px 7px; border-radius:3px; }
    .tw-tl-summary { font-size:12.5px; color:var(--text-main); }
    .tw-empty-hint { text-align:center; color:var(--text-sub); padding:16px 10px; font-size:12px; line-height:1.6; font-style:italic; }
    .tw-input,.tw-select,.tw-textarea { width:100%; padding:6px 9px; font-size:12px; border:1px solid var(--border-soft); border-radius:4px; background:var(--bg-card); color:var(--text-main); margin-bottom:7px; font-family:inherit; }
    .tw-textarea { min-height:64px; resize:vertical; }
    .tw-forum-bar { display:flex; gap:7px; margin-bottom:9px; align-items:center; }
    .tw-forum-bar .tw-input { margin-bottom:0; flex:1; }
    .tw-refresh-forum-btn { padding:6px 11px; font-size:11.5px; font-weight:bold; background:var(--accent); color:#fff8eb; border:1px solid var(--border-outer); border-radius:4px; cursor:pointer; white-space:nowrap; font-family:inherit; }
    .tw-refresh-forum-btn:disabled { opacity:.55; cursor:wait; }
    .tw-post-meta { display:flex; justify-content:space-between; font-size:11px; color:var(--text-sub); }
    .tw-post-tit { font-size:14px; font-weight:bold; color:var(--accent-strong); margin:4px 0; }
    .tw-post-txt { margin:0 0 7px; line-height:1.6; }
    .tw-post-foot { display:flex; justify-content:space-between; align-items:center; padding-top:5px; border-top:1px solid var(--border-soft); font-size:11px; }
    .tw-act-btn { background:none; border:0; color:var(--text-sub); font-size:11px; cursor:pointer; padding:2px 5px; font-family:inherit; }
    .tw-act-btn.liked { color:var(--accent); font-weight:bold; }
    .tw-cmt-box { margin-top:7px; padding:7px 9px; background:var(--bg-sub); border-left:2.5px solid var(--border-outer); border-radius:3px; }
    .tw-cmt-line { font-size:11.5px; line-height:1.55; padding:4px 0; border-bottom:1px dashed var(--border-soft); display:flex; justify-content:space-between; align-items:flex-start; gap:6px; }
    .tw-cmt-line:last-of-type { border-bottom:0; }
    .tw-cmt-u { color:var(--accent-strong); font-weight:bold; }
    .tw-reply-npc-btn { background:none; border:1px solid var(--border-soft); border-radius:3px; color:var(--accent); font-size:10px; padding:1px 5px; cursor:pointer; white-space:nowrap; font-family:inherit; }
    .tw-reply-npc-btn:disabled { opacity:.5; cursor:wait; }
    .tw-reply-target-bar { display:none; justify-content:space-between; align-items:center; font-size:10.5px; color:var(--accent-strong); background:rgba(142,53,46,0.1); padding:3px 7px; border-radius:3px; margin-top:5px; }
    .tw-reply-target-bar.active { display:flex; }
    .tw-cmt-send { display:flex; gap:5px; margin-top:5px; }
    .tw-cmt-send input { flex:1; padding:5px 8px; font-size:11.5px; border:1px solid var(--border-soft); border-radius:3px; background:var(--bg-card); color:var(--text-main); font-family:inherit; }
    .tw-cmt-send button { padding:5px 10px; font-size:11.5px; background:var(--accent); color:#fff; border:0; border-radius:3px; cursor:pointer; font-family:inherit; }
    .tw-act-card { background:var(--bg-card); border:1px solid var(--border-soft); border-left:4px solid var(--accent); border-radius:5px; padding:9px 11px; margin-bottom:8px; cursor:pointer; transition:transform .14s ease; }
    .tw-act-card:hover { transform:translateX(2px); }
    .tw-act-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; }
    .tw-act-title { font-size:13px; font-weight:bold; color:var(--accent-strong); }
    .tw-send-hint { font-size:10.5px; color:var(--accent); font-weight:bold; }
    .tw-toggle-btn { padding:3px 11px; font-size:11px; font-weight:bold; border:1px solid var(--border-outer); border-radius:12px; cursor:pointer; font-family:inherit; background:var(--bg-sub); color:var(--text-main); transition:all .15s; }
    .tw-toggle-btn.on { background:var(--accent); color:#fff8eb; }
    .tw-toggle-btn.disabled-gray, .tw-toggle-btn:disabled {
      opacity:0.42 !important; filter:grayscale(100%); cursor:not-allowed !important; background:var(--border-soft) !important; color:var(--text-sub) !important; border-color:var(--border-soft) !important;
    }
    .tw-sub-switch-row { display:flex; justify-content:space-between; align-items:center; padding:6px 8px; border-bottom:1px dashed var(--border-soft); border-radius:4px; }
    .tw-sub-switch-row:last-child { border-bottom:0; }
    .tw-sub-switch-row.locked-row { opacity:0.58; }
    .tw-api-mode-cards { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px; }
    .tw-api-mode-card { padding:9px 10px; border:1.5px solid var(--border-soft); border-radius:6px; background:var(--bg-sub); cursor:pointer; text-align:left; font-family:inherit; color:var(--text-main); transition:all .15s; }
    .tw-api-mode-card b { display:block; font-size:12.5px; color:var(--accent-strong); margin-bottom:2px; }
    .tw-api-mode-card span { font-size:10.5px; color:var(--text-sub); line-height:1.35; display:block; }
    .tw-api-mode-card.active { border-color:var(--accent); background:var(--bg-card); box-shadow:inset 0 0 0 1px var(--accent); }
    .tw-chip-row { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px; }
    .tw-chip { padding:4px 9px; font-size:11px; background:var(--bg-sub); border:1px solid var(--border-soft); color:var(--text-main); border-radius:12px; cursor:pointer; transition:all .14s; }
    .tw-chip:hover { border-color:var(--accent); color:var(--accent-strong); }
    .tw-chip.active { background:var(--accent); color:#fff8eb; border-color:var(--border-outer); font-weight:bold; }
    .tw-theater-output { white-space:pre-wrap; line-height:1.75; font-size:12.5px; padding:10px 12px; background:var(--bg-sub); border:1px solid var(--border-soft); border-radius:4px; min-height:180px; max-height:330px; overflow-y:auto; }
    .tw-game-tabs { display:grid; grid-template-columns:repeat(4,1fr); gap:5px; margin-bottom:10px; }
    .tw-game-tab-btn { padding:7px 4px; font-size:11.5px; font-weight:bold; background:var(--bg-card); color:var(--text-main); border:1.5px solid var(--border-soft); border-radius:4px; cursor:pointer; font-family:inherit; }
    .tw-game-tab-btn.active { background:var(--accent); color:#fff8eb; border-color:var(--border-outer); }
    .tw-subgame-pane { display:none; }
    .tw-subgame-pane.active { display:block; }
    .tw-memorial-scroll { background:var(--bg-sub); border:1.5px double var(--border-outer); padding:10px 12px; border-radius:4px; margin-bottom:8px; line-height:1.7; }
    .tw-gomoku-wrap { display:flex; flex-direction:column; align-items:center; }
    .tw-gomoku-board { display:grid; grid-template-columns:repeat(11,26px); grid-template-rows:repeat(11,26px); background:#dec496; border:2px solid #734f29; padding:6px; border-radius:4px; margin:6px auto; user-select:none; }
    .tw-gomoku-cell { width:26px; height:26px; position:relative; display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .tw-gomoku-cell::before { content:""; position:absolute; width:100%; height:1px; background:rgba(90,55,25,0.55); }
    .tw-gomoku-cell::after { content:""; position:absolute; height:100%; width:1px; background:rgba(90,55,25,0.55); }
    .tw-stone { width:20px; height:20px; border-radius:50%; z-index:2; box-shadow:1px 2px 4px rgba(0,0,0,0.45); }
    .tw-stone.black { background:radial-gradient(circle at 30% 30%,#555,#111); }
    .tw-stone.white { background:radial-gradient(circle at 30% 30%,#fff,#d4cec3); border:1px solid #999; }
    .tw-chatroom-messages { height:330px; overflow-y:auto; background:var(--bg-sub); border:1px solid var(--border-soft); border-radius:6px; padding:10px 12px; margin-bottom:8px; display:flex; flex-direction:column; gap:8px; }
    @keyframes twBubblePop {
      from { opacity:0; transform:translateY(5px); }
      to { opacity:1; transform:translateY(0); }
    }
    .tw-chat-sys-tip {
      align-self:center; font-size:10.5px; color:var(--text-sub); background:rgba(140, 98, 57, 0.12);
      border:1px dashed var(--border-soft); padding:2.5px 11px; border-radius:12px; margin:3px 0; text-align:center; letter-spacing:0.5px; animation:twBubblePop .22s ease-out;
    }
    .tw-chat-msg { display:flex; flex-direction:column; max-width:86%; animation:twBubblePop .22s ease-out; }
    .tw-chat-msg.self { align-self:flex-end; align-items:flex-end; }
    .tw-chat-head-row { display:flex; align-items:center; gap:6px; margin-bottom:2px; }
    .tw-chat-sender { font-size:10.5px; color:var(--text-sub); font-weight:bold; }
    .tw-chat-quote-btn { background:none; border:1px solid var(--border-soft); border-radius:3px; color:var(--accent); font-size:9.5px; padding:0px 4px; cursor:pointer; line-height:1.4; opacity:0.78; font-family:inherit; }
    .tw-chat-quote-btn:hover { opacity:1; background:rgba(142,53,46,0.08); }
    .tw-chat-bubble { background:var(--bg-card); border:1px solid var(--border-soft); padding:6px 10px; border-radius:8px; line-height:1.45; font-size:12px; box-shadow:0 1px 2px rgba(0,0,0,0.06); }
    .tw-chat-msg.self .tw-chat-bubble { background:var(--accent); color:#fff8eb; border-color:var(--border-outer); }
    .tw-chat-quoted-block { font-size:10.5px; padding:3px 6px; margin-bottom:4px; border-left:2px solid var(--border-outer); background:rgba(0,0,0,0.06); border-radius:3px; opacity:0.9; }
    .tw-chat-msg.self .tw-chat-quoted-block { border-left-color:rgba(255,248,235,0.75); background:rgba(255,255,255,0.14); color:#fff8eb; }
    .tw-chat-quote-bar { display:none; justify-content:space-between; align-items:center; font-size:11px; color:var(--accent-strong); background:rgba(142,53,46,0.1); border:1px dashed var(--border-soft); padding:4px 8px; border-radius:4px; margin-bottom:6px; }
    .tw-chat-quote-bar.active { display:flex; }
    .tw-theme-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:7px; margin-bottom:6px; }
    .tw-theme-btn { padding:8px; border:1.5px solid var(--border-soft); border-radius:4px; background:var(--bg-card); color:var(--text-main); font-size:12px; font-weight:bold; cursor:pointer; font-family:inherit; }
    .tw-theme-btn.active { border-color:var(--accent); color:var(--accent-strong); box-shadow:inset 0 0 0 1px var(--accent); }
    .tw-status-tip { font-size:11.5px; font-weight:bold; color:var(--accent-strong); background:var(--bg-sub); border:1.5px solid var(--accent); padding:7px 11px; border-radius:4px; margin-bottom:9px; display:none; }
    .tw-status-tip.show { display:block; }
    .tw-error-banner {
      display:none; justify-content:space-between; align-items:center; gap:8px; font-size:11.5px; font-weight:bold;
      color:#fff8f6; background:linear-gradient(135deg, #9e241e 0%, #6e1410 100%); border:1.5px solid #e69a8d;
      padding:7px 11px; border-radius:4px; margin-bottom:9px; box-shadow:0 3px 10px rgba(140, 25, 20, 0.28);
    }
    .tw-error-banner.show { display:flex; }
    .tw-error-close { background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.45); color:#fff; font-size:10.5px; padding:1px 6px; border-radius:3px; cursor:pointer; white-space:nowrap; font-family:inherit; }
    .tw-log-list { max-height:220px; overflow-y:auto; background:var(--bg-sub); border:1px solid var(--border-soft); border-radius:4px; padding:6px 8px; }
    .tw-log-item { padding:6px 7px; border-bottom:1px dashed var(--border-soft); font-size:11px; line-height:1.45; }
    .tw-log-item:last-child { border-bottom:0; }
    .tw-log-item.err { background:rgba(168, 36, 30, 0.08); border-left:3px solid #a8241e; padding-left:6px; }
    .tw-log-item.ok { border-left:3px solid var(--gold); padding-left:6px; }
    .tw-log-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:2px; }
    .tw-log-tag { font-size:10px; padding:1px 5px; border-radius:3px; font-weight:bold; }
    .tw-log-tag.ok { background:rgba(70, 120, 80, 0.16); color:#265934; }
    .tw-log-tag.err { background:rgba(168, 36, 30, 0.18); color:#9e1e18; }
    .tw-log-detail { color:var(--text-sub); word-break:break-all; }
  `;
  targetDoc.head.appendChild(styleEl);

  // ==================== 根 DOM 结构 ====================
  const rootEl = targetDoc.createElement("div");
  rootEl.id = "tw-floating-root";
  rootEl.setAttribute("data-theme", config.theme || "xuanpaper");
  rootEl.innerHTML = `
    <div class="tw-fab-ball" id="twFabBall" title="点击展开太微宫闻录">
      <span class="tw-fab-dot"></span>
      <span class="tw-fab-top">太微</span>
      <span class="tw-fab-main">闻录</span>
      <span class="tw-fab-ornament"></span>
    </div>

    <!-- 仿微信新消息通知横幅 -->
    <div class="tw-wechat-banner" id="twWechatBanner" title="点击直接查看消息">
      <div class="tw-wechat-avatar" id="twWechatAvatar">萧</div>
      <div class="tw-wechat-body">
        <div class="tw-wechat-top">
          <span id="twWechatSender">萧承稷</span>
          <span class="tw-wechat-tag">刚刚 · 点击查看</span>
        </div>
        <div class="tw-wechat-preview" id="twWechatPreview">你收到了一条新的传信…</div>
      </div>
    </div>

    <!-- 模块刷新成功轻提示 -->
    <div class="tw-module-toast" id="twModuleToast">
      <span id="twModuleToastText">✨ 刷新成功</span>
    </div>

    <div class="tw-modal-overlay tw-hidden" id="twModalOverlay">
      <div class="tw-panel" id="twMainPanel">
        <!-- 圣人抓包弹窗 -->
        <div class="tw-catch-modal" id="twCatchModal">
          <div class="tw-catch-card">
            <div class="tw-catch-title">⚠️ 频频窥探圣躬 · 被当场抓包！</div>
            <div class="tw-catch-desc" id="twCatchDesc">
              赵怀安低着头刚把起居注合上，甘露殿内便传来一声极轻的冷嗤。萧承稷指尖慢条斯理地转过墨玉扳指，淡色眼瞳隔着宫墙似已将你接连翻看他起居秘录的小动作尽收眼底，并向你发来了一道私密传讯……
            </div>
            <button type="button" class="tw-refresh-forum-btn" id="twGoCaughtDmBtn" style="width:100%;padding:8px;">立即前往【单人私聊】查看圣人质问</button>
          </div>
        </div>

        <div class="tw-head">
          <div class="tw-head-title">太微宫闻录</div>
          <div class="tw-head-btns">
            <button type="button" class="tw-mini-btn api-btn tw-manual-refresh-btn" id="twBtnApiSync">全部刷新</button>
            <button type="button" class="tw-mini-btn" id="twBtnClearAll">清空本档</button>
            <button type="button" class="tw-mini-btn" id="twBtnClose">关闭</button>
          </div>
        </div>
        <div class="tw-nav" id="twNavBar">
          <button type="button" class="active" data-tab="status">状态栏</button>
          <button type="button" data-tab="plot">剧情梳理</button>
          <button type="button" data-tab="actions">剧情安排</button>
          <button type="button" data-tab="world">世界动态</button>
          <button type="button" data-tab="emperor">圣人日常</button>
          <button type="button" data-tab="forum">宫内外坛</button>
          <button type="button" data-tab="theater">小剧场</button>
          <button type="button" data-tab="games">宫廷游艺</button>
          <button type="button" data-tab="settings">设置</button>
        </div>
        <div class="tw-content">
          <div class="tw-status-tip" id="twApiStatusBar">刷新中…</div>
          <div class="tw-error-banner" id="twApiErrorBanner">
            <span id="twApiErrorText">API 调用出错</span>
            <button type="button" class="tw-error-close" id="twCloseErrorBannerBtn">知道了</button>
          </div>

          <!-- 1. 状态栏 -->
          <div class="tw-tab-page active" id="tw-page-status">
            <div class="tw-grid2">
              <div class="tw-box" style="margin-bottom:0;">
                <div class="tw-label">萧承稷好感度</div>
                <div class="tw-val"><span id="twAffVal">--</span> / 100</div>
                <div class="tw-label" id="twAffStage">目前空白</div>
                <div class="tw-bar"><i id="twAffBar"></i></div>
              </div>
              <div class="tw-box" style="margin-bottom:0;">
                <div class="tw-label">当前身份</div>
                <div class="tw-val" id="twUserIdentity">未同步</div>
                <div class="tw-label">姓名：<span id="twUserNameTxt">--</span></div>
                <div class="tw-label" id="twTimeLoc">目前空白</div>
              </div>
            </div>
            <div class="tw-box">
              <div class="tw-sec-head">
                <span>天子状态栏与私密心绪</span>
                <div style="display:flex;gap:6px;align-items:center;">
                  <span class="tw-badge" id="twMood">待同步</span>
                  <button type="button" class="tw-reply-npc-btn tw-manual-refresh-btn" id="twRefreshStatusOnlyBtn">手动刷新</button>
                </div>
              </div>
              <div class="tw-row"><b>【圣人姿态】</b><span id="twEmpAct">目前空白</span></div>
              <div class="tw-row"><b>【真实心理】</b><span id="twInnerThought">目前空白</span></div>
              <div class="tw-row"><b>【帝王手札】</b><span id="twDiary">目前空白</span></div>
              <div class="tw-row"><b>【御前待办】</b><span id="twTodos">目前空白</span></div>
            </div>
          </div>

          <!-- 2. 剧情梳理 -->
          <div class="tw-tab-page" id="tw-page-plot">
            <div class="tw-box">
              <div class="tw-sec-head">
                <span>故事时间轴</span>
                <div style="display:flex;gap:5px;">
                  <button type="button" class="tw-reply-npc-btn tw-manual-refresh-btn" id="twAppendLatestPlotBtn">同步最新一轮</button>
                  <button type="button" class="tw-reply-npc-btn tw-manual-refresh-btn" id="twRebuildFullPlotBtn" style="background:var(--accent);color:#fff;">全量重梳全部楼层</button>
                </div>
              </div>
              <div id="twPlotSummaryList"></div>
            </div>
          </div>

          <!-- 3. 剧情安排 -->
          <div class="tw-tab-page" id="tw-page-actions">
            <div class="tw-box">
              <div class="tw-sec-head">
                <span>自定义剧情走向与灵感</span>
                <button type="button" class="tw-refresh-forum-btn tw-manual-refresh-btn" id="twRefreshActionsBtn" style="padding:4px 11px;font-size:11.5px;">手动刷新</button>
              </div>
              <div class="tw-chip-row" id="twStoryPlanChips">
                <span class="tw-chip" data-idea="暗生情愫与单独相处">感情升温</span>
                <span class="tw-chip" data-idea="嫉妒吃醋与强势试探">帝王吃醋</span>
                <span class="tw-chip" data-idea="六宫刁难或朝堂交锋">突发冲突</span>
                <span class="tw-chip" data-idea="旧部密信或外邦异动">暗流伏笔</span>
                <span class="tw-chip" data-idea="北苑游宴或微服出宫">游宴散心</span>
                <span class="tw-chip" data-idea="深夜急召或意外撞破">意外变故</span>
              </div>
              <input class="tw-input" id="twStoryCustomIdea" style="margin-bottom:0;" placeholder="输入你想生成的剧情走向，留空则结合当前剧情直接生成六个事件……">
            </div>
            <div class="tw-box">
              <div class="tw-sec-head">
                <span>六大剧情发展建议</span>
                <span class="tw-badge">第三人称 · 仅铺垫开端</span>
              </div>
              <div id="twStoryPlanList"></div>
            </div>
          </div>

          <!-- 4. 世界动态 -->
          <div class="tw-tab-page" id="tw-page-world">
            <div style="display:flex;justify-content:flex-end;margin-bottom:8px;">
              <button type="button" class="tw-refresh-forum-btn tw-manual-refresh-btn" id="twRefreshWorldBtn" style="padding:4px 11px;font-size:11.5px;">手动刷新</button>
            </div>
            <div class="tw-box">
              <div class="tw-sec-head">
                <span>宫内动态</span>
                <span class="tw-badge">太微宫内</span>
              </div>
              <div id="twPalaceWorldList"></div>
            </div>
            <div class="tw-box">
              <div class="tw-sec-head">
                <span>宫外动态</span>
                <span class="tw-badge">宫墙之外</span>
              </div>
              <div id="twOutsideWorldList"></div>
            </div>
          </div>

          <!-- 5. 圣人日常（位于论坛前面 · 平行精致翻牌卡片） -->
          <div class="tw-tab-page" id="tw-page-emperor">
            <div class="tw-box">
              <div class="tw-sec-head">
                <span>甘露殿起居秘录 · 圣人六事暗格</span>
                <button type="button" class="tw-refresh-forum-btn tw-manual-refresh-btn" id="twRefreshEmperorSpyBtn" style="padding:4px 11px;font-size:11.5px;">暗中打探刷新</button>
              </div>
              <div class="tw-label" style="margin-bottom:6px;">点击下方任意朱印暗格卡片即可掀开窥探萧承稷今日动向与内心碎碎念（注意：频繁翻看不同暗格极易引起圣人警觉）……</div>
              <div id="twEmperorSpyList"></div>
            </div>
          </div>

          <!-- 6. 宫内外坛 -->
          <div class="tw-tab-page" id="tw-page-forum">
            <div class="tw-box" style="padding:8px 11px;margin-bottom:8px;">
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <span class="tw-badge" style="margin:0;">我的论坛昵称</span>
                <input class="tw-input" id="twForumNickInput" style="margin-bottom:0;flex:1;min-width:140px;padding:4px 8px;" value="" placeholder="默认空白（使用本名），输入马甲则隐匿真名……">
                <button type="button" class="tw-reply-npc-btn" id="twSaveForumNickBtn" style="padding:4px 9px;font-size:11px;background:var(--accent);color:#fff;">保存昵称</button>
                <button type="button" class="tw-reply-npc-btn" id="twResetForumNickBtn" style="padding:4px 7px;font-size:11px;">清空恢复默认</button>
              </div>
              <div class="tw-label" style="margin-top:4px;margin-bottom:6px;">当前身份状态：<b id="twCurrentForumAuthorPreview" style="color:var(--accent-strong);">--</b></div>

              <div style="border-top:1px dashed var(--border-soft);padding-top:6px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
                  <span class="tw-badge" style="margin:0;">论坛说话风格</span>
                  <span class="tw-label">切换后刷新或回帖即按该画风说话</span>
                </div>
                <div class="tw-chip-row" id="twForumStyleChips" style="margin-bottom:4px;">
                  <span class="tw-chip" data-fstyle="lively">🔥 鲜活茶水间</span>
                  <span class="tw-chip" data-fstyle="gossip">🍉 欢脱吃瓜风</span>
                  <span class="tw-chip" data-fstyle="snarky">🍵 宫斗阴阳风</span>
                  <span class="tw-chip" data-fstyle="street">🍡 市井烟火风</span>
                  <span class="tw-chip" data-fstyle="classical">📜 古风文雅风</span>
                  <span class="tw-chip" data-fstyle="custom">✍️ 自定义风格</span>
                </div>
                <div id="twForumCustomStyleWrap" style="display:none;margin-top:4px;">
                  <input class="tw-input" id="twForumCustomStyleInput" style="margin-bottom:0;padding:4px 8px;" placeholder="输入你想要的论坛说话风格（如：全员柠檬精酸溜溜、全员夸夸群）……">
                </div>
              </div>
            </div>

            <div class="tw-forum-bar">
              <input class="tw-input" id="twSearch" placeholder="搜索帖子或NPC……">
              <button type="button" class="tw-refresh-forum-btn tw-manual-refresh-btn" id="twRefreshForumBtn">手动刷新</button>
            </div>
            <div id="twForumList"></div>
            <div class="tw-box">
              <div class="tw-sec-head"><span>投递新帖</span></div>
              <input class="tw-input" id="twNewTitle" placeholder="输入帖子标题……">
              <input class="tw-input" id="twNewBody" placeholder="写下宫内外新鲜风声或吐槽……">
              <button type="button" class="tw-mini-btn api-btn" id="twSendPost">发布并唤起群像NPC讨论</button>
            </div>
          </div>

          <!-- 7. 小剧场 -->
          <div class="tw-tab-page" id="tw-page-theater">
            <div class="tw-box">
              <div class="tw-sec-head"><span>太微宫小剧场生成</span><span class="tw-badge">番外</span></div>
              <div class="tw-chip-row" id="twTheaterChips">
                <span class="tw-chip" data-style="深夜甘露殿批阅奏章时的暗中温存与口是心非">甘露夜读</span>
                <span class="tw-chip" data-style="萧承稷看到旁人与你说话后暗中吃醋并冷脸宣示主权">帝王吃醋</span>
                <span class="tw-chip" data-style="便装微服出宫同游长安上元灯会或曲江春水舫">微服夜游</span>
                <span class="tw-chip" data-style="东西六宫或前朝受委屈时萧承稷突然驾临护短撑腰">御前护短</span>
                <span class="tw-chip" data-style="平行时空长安富家公子萧四郎与你的初遇">平行番外</span>
              </div>
              <textarea class="tw-textarea" id="twTheaterPrompt" placeholder="自由输入想看的小剧场主题，留空则紧扣最新剧情随机生成……"></textarea>
              <div style="display:flex;gap:8px;">
                <button type="button" class="tw-mini-btn api-btn" id="twGenTheaterBtn" style="flex:1;padding:7px;">生成小剧场</button>
                <button type="button" class="tw-mini-btn" id="twInsertTheaterBtn" style="color:var(--text-main);border-color:var(--border-soft);">填入输入框</button>
              </div>
            </div>
            <div class="tw-box">
              <div class="tw-sec-head"><span>小剧场正文</span></div>
              <div class="tw-theater-output" id="twTheaterResult"></div>
            </div>
          </div>

          <!-- 8. 宫廷游艺（单人私聊 / 太微群聊 / 代批奏折 / 五子棋） -->
          <div class="tw-tab-page" id="tw-page-games">
            <div class="tw-game-tabs">
              <button type="button" class="tw-game-tab-btn active" data-game="dm">单人私聊</button>
              <button type="button" class="tw-game-tab-btn" data-game="chatroom">太微群聊</button>
              <button type="button" class="tw-game-tab-btn" data-game="memorial">代批奏折</button>
              <button type="button" class="tw-game-tab-btn" data-game="gomoku">延英五子棋</button>
            </div>

            <!-- 子面板 A：单人私聊 -->
            <div class="tw-subgame-pane active" id="tw-game-dm">
              <div class="tw-box">
                <div class="tw-sec-head">
                  <span>单人私密传讯 · 选择对话人物</span>
                  <div style="display:flex;gap:5px;flex-wrap:wrap;">
                    <button type="button" class="tw-reply-npc-btn" id="twDmRefreshRosterBtn" title="扫描当前剧情与世界书刷新可选人物">🔄 刷新可选人物</button>
                    <button type="button" class="tw-reply-npc-btn" id="twDmSyncStoryBtn" style="background:var(--accent);color:#fff;">同步剧情开聊</button>
                    <button type="button" class="tw-reply-npc-btn" id="twDmExportOfflineBtn" title="将当前私聊转化为自然线下场景填入酒馆输入框">转化为线下剧情填入酒馆</button>
                    <button type="button" class="tw-reply-npc-btn" id="twDmClearBtn">清空对话</button>
                  </div>
                </div>
                <div style="display:flex;gap:6px;align-items:center;margin-bottom:7px;">
                  <span class="tw-label" style="white-space:nowrap;">私聊对象：</span>
                  <select class="tw-select" id="twDmNpcSelect" style="margin-bottom:0;flex:1;"></select>
                </div>
                <div class="tw-chatroom-messages" id="twDmBox"></div>
                <div class="tw-chat-quote-bar" id="twDmQuoteBar">
                  <span id="twDmQuoteText" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:82%;"></span>
                  <button type="button" class="tw-act-btn" id="twCancelDmQuoteBtn" style="color:var(--accent);font-weight:bold;">取消引用</button>
                </div>
                <div style="display:flex;gap:6px;">
                  <input class="tw-input" id="twDmInput" style="margin-bottom:0;" placeholder="输入私聊消息……">
                  <button type="button" class="tw-refresh-forum-btn" id="twDmSendBtn">发送</button>
                </div>
              </div>
            </div>

            <!-- 子面板 B：太微群聊（默认空白 + 换主题重置 + 新增我是皇帝全员后宫） -->
            <div class="tw-subgame-pane" id="tw-game-chatroom">
              <div class="tw-box">
                <div class="tw-sec-head">
                  <span>太微宫茶话群聊 · <span id="twChatroomRoleBadge">未同步</span></span>
                  <div style="display:flex;gap:5px;">
                    <button type="button" class="tw-reply-npc-btn" id="twRandomChatTopicBtn" style="background:var(--accent);color:#fff;">刷新群聊</button>
                    <button type="button" class="tw-reply-npc-btn" id="twClearChatroomBtn">清空</button>
                  </div>
                </div>
                <div style="margin-bottom:7px;padding-bottom:6px;border-bottom:1px dashed var(--border-soft);">
                  <div class="tw-chip-row" id="twGroupThemeChips" style="margin-bottom:4px;">
                    <span class="tw-chip" data-gtheme="story_sync">📍 同步当前剧情</span>
                    <span class="tw-chip" data-gtheme="user_empress_harem">👑 我是皇帝，其他人都是我后宫</span>
                    <span class="tw-chip" data-gtheme="palace_gossip">🍉 深宫八卦</span>
                    <span class="tw-chip" data-gtheme="street_fun">🏮 市井趣闻</span>
                    <span class="tw-chip" data-gtheme="if_modern">💼 IF现代豪门</span>
                    <span class="tw-chip" data-gtheme="if_campus">🏫 IF皇家高中</span>
                    <span class="tw-chip" data-gtheme="if_scifi">🚀 IF星际舰队</span>
                    <span class="tw-chip" data-gtheme="if_genderbend">🌸 IF全员性转</span>
                    <span class="tw-chip" data-gtheme="custom">✍️ 自定义主题</span>
                  </div>
                  <div id="twGroupCustomThemeWrap" style="display:none;margin-top:4px;">
                    <input class="tw-input" id="twGroupCustomThemeInput" style="margin-bottom:0;padding:4px 8px;" placeholder="输入你想看的群聊主题或IF线设定（如：全员剧本杀、末日丧尸围城、修仙宗门）……">
                  </div>
                </div>
                <div class="tw-chatroom-messages" id="twChatroomBox"></div>
                <div class="tw-chat-quote-bar" id="twChatQuoteBar">
                  <span id="twChatQuoteText" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:82%;"></span>
                  <button type="button" class="tw-act-btn" id="twCancelChatQuoteBtn" style="color:var(--accent);font-weight:bold;">取消引用</button>
                </div>
                <div style="display:flex;gap:6px;">
                  <input class="tw-input" id="twChatroomInput" style="margin-bottom:0;" placeholder="发句闲话聊聊……">
                  <button type="button" class="tw-refresh-forum-btn" id="twChatroomSendBtn">发送</button>
                </div>
              </div>
            </div>

            <!-- 子面板 C：代批奏折 -->
            <div class="tw-subgame-pane" id="tw-game-memorial">
              <div class="tw-box">
                <div class="tw-sec-head">
                  <span>甘露殿御案 · 代圣人朱批奏章</span>
                  <div style="display:flex;gap:5px;">
                    <button type="button" class="tw-reply-npc-btn" id="twNextMemorialBtn">换一封预设折子</button>
                    <button type="button" class="tw-reply-npc-btn" id="twAiMemorialBtn" style="background:var(--accent);color:#fff;">AI生成新折子</button>
                  </div>
                </div>
                <div class="tw-memorial-scroll">
                  <div style="font-size:11px;color:var(--text-sub);margin-bottom:3px;" id="twMemAuthor"></div>
                  <div style="font-size:13px;font-weight:bold;color:var(--accent-strong);margin-bottom:5px;" id="twMemTitle"></div>
                  <div style="font-size:12px;" id="twMemContent"></div>
                </div>
                <div class="tw-chip-row" id="twMemorialQuickChips"></div>
                <div style="display:flex;gap:6px;">
                  <input class="tw-input" id="twMemorialCustomInput" style="margin-bottom:0;" placeholder="亲手写下你的朱批……">
                  <button type="button" class="tw-refresh-forum-btn" id="twSubmitMemorialBtn">朱批用印</button>
                </div>
              </div>
              <div class="tw-box">
                <div class="tw-sec-head"><span>萧承稷的反应与朱批点评</span></div>
                <div id="twMemorialReaction" style="line-height:1.75;min-height:65px;white-space:pre-wrap;">挑选或输入朱批后点击“朱批用印”，即可查看萧承稷的反应。</div>
              </div>
            </div>

            <!-- 子面板 D：延英五子棋 -->
            <div class="tw-subgame-pane" id="tw-game-gomoku">
              <div class="tw-box">
                <div class="tw-sec-head">
                  <span>延英殿手谈 · 与萧承稷对弈五子棋</span>
                  <button type="button" class="tw-reply-npc-btn" id="twRestartGomokuBtn">重新开局</button>
                </div>
                <div style="background:var(--bg-sub);padding:8px 10px;border-radius:4px;margin-bottom:6px;border-left:3px solid var(--accent);">
                  <div style="font-size:11px;color:var(--text-sub);">萧承稷此刻对你说的话：</div>
                  <div id="twGomokuQuote" style="font-size:12.5px;color:var(--accent-strong);font-weight:bold;margin-top:3px;"></div>
                </div>
                <div class="tw-gomoku-wrap">
                  <div class="tw-gomoku-board" id="twGomokuBoard"></div>
                  <div style="font-size:11px;color:var(--text-sub);margin-top:3px;" id="twGomokuStatus"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 9. 设置 -->
          <div class="tw-tab-page" id="tw-page-settings">
            <div class="tw-box">
              <div class="tw-sec-head"><span>配色方案切换</span><span class="tw-badge">七色可选</span></div>
              <div class="tw-theme-grid">
                <button type="button" class="tw-theme-btn" data-theme-val="xuanpaper">古法宣黄</button>
                <button type="button" class="tw-theme-btn" data-theme-val="palace">宫阙螺钿</button>
                <button type="button" class="tw-theme-btn" data-theme-val="newspaper">长安邸报</button>
                <button type="button" class="tw-theme-btn" data-theme-val="white">纯白凝脂</button>
                <button type="button" class="tw-theme-btn" data-theme-val="celadon">天青汝窑</button>
                <button type="button" class="tw-theme-btn" data-theme-val="obsidian">乌金藏经</button>
                <button type="button" class="tw-theme-btn" data-theme-val="rouge" style="grid-column:1 / -1;">薛涛花笺</button>
              </div>
            </div>

            <div class="tw-box">
              <div class="tw-sec-head">
                <span>自动刷新总控与分模块开关</span>
                <span class="tw-badge" id="twAutoMasterStatusHint">总控开启中</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 9px;background:var(--bg-sub);border:1px solid var(--border-soft);border-radius:4px;margin-bottom:8px;">
                <div>
                  <b style="color:var(--accent-strong);">一键开启自动刷新</b>
                  <div class="tw-label">关闭总开关后可单独开关各模块自动刷新</div>
                </div>
                <button type="button" class="tw-toggle-btn" id="twMasterAutoToggleBtn">已开启</button>
              </div>
              <div id="twSubAutoSwitchList">
                <div class="tw-sub-switch-row" data-sub-row="status">
                  <span>① 状态栏</span>
                  <button type="button" class="tw-toggle-btn tw-sub-auto-btn" data-mod="status">已开启</button>
                </div>
                <div class="tw-sub-switch-row" data-sub-row="plot">
                  <span>② 剧情梳理</span>
                  <button type="button" class="tw-toggle-btn tw-sub-auto-btn" data-mod="plot">已开启</button>
                </div>
                <div class="tw-sub-switch-row" data-sub-row="world">
                  <span>③ 世界动态</span>
                  <button type="button" class="tw-toggle-btn tw-sub-auto-btn" data-mod="world">已开启</button>
                </div>
              </div>
            </div>

            <div class="tw-box">
              <div class="tw-sec-head">
                <span>聊天记忆条数与剧情摘要设置</span>
                <span class="tw-badge" id="twPlotPromptBadge">记忆${config.chatMemoryCount}条 · 摘要${config.plotWordLimit}字</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding-bottom:7px;border-bottom:1px dashed var(--border-soft);">
                <span class="tw-label" style="white-space:nowrap;">单聊/群聊记忆携带条数：</span>
                <input type="number" min="4" max="60" class="tw-input" id="twChatMemoryCountInput" style="margin-bottom:0;width:85px;" value="${config.chatMemoryCount}">
                <span class="tw-label">条（防失忆与防重复说话）</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px;">
                <span class="tw-label" style="white-space:nowrap;">单幕摘要目标字数：</span>
                <input type="number" min="15" max="300" class="tw-input" id="twPlotWordLimitInput" style="margin-bottom:0;width:90px;" value="${config.plotWordLimit}">
                <span class="tw-label">字以内</span>
              </div>
              <div class="tw-label" style="margin-bottom:4px;">自定义摘要要求提示词：</div>
              <textarea class="tw-textarea" id="twPlotCustomPromptInput" style="min-height:54px;" placeholder="例如：以女主名字开头，简明概括本轮核心事件与情感变化……"></textarea>
              <div style="display:flex;justify-content:flex-end;gap:6px;">
                <button type="button" class="tw-reply-npc-btn" id="twResetPlotPromptBtn" style="padding:4px 9px;font-size:11px;">恢复默认</button>
                <button type="button" class="tw-reply-npc-btn" id="twSavePlotPromptBtn" style="padding:4px 11px;font-size:11px;background:var(--accent);color:#fff;">保存记忆与摘要设置</button>
              </div>
            </div>

            <div class="tw-box">
              <div class="tw-sec-head">
                <span>API 通道选择与配置保存</span>
                <span class="tw-badge" id="twCurrentApiBadge">酒馆主 API</span>
              </div>
              <div class="tw-api-mode-cards">
                <button type="button" class="tw-api-mode-card" id="twModeCardTavern" data-api-mode="tavern">
                  <b>① 使用酒馆主 API</b>
                  <span>直接调用酒馆当前主模型接口</span>
                </button>
                <button type="button" class="tw-api-mode-card" id="twModeCardCustom" data-api-mode="custom">
                  <b>② 使用其他 API</b>
                  <span>自定义接口，支持自命名保存多个配置</span>
                </button>
              </div>

              <div id="twCustomApiFields" style="display:none;padding-top:4px;border-top:1px dashed var(--border-soft);">
                <div style="display:flex;gap:6px;align-items:center;margin-bottom:7px;">
                  <span class="tw-label" style="white-space:nowrap;">已存配置：</span>
                  <select class="tw-select" id="twSavedApiPresetSelect" style="margin-bottom:0;flex:1;">
                    <option value="">-- 新建 / 当前编辑配置 --</option>
                  </select>
                  <button type="button" class="tw-reply-npc-btn" id="twDeleteApiPresetBtn" style="padding:5px 8px;">删除该配置</button>
                </div>

                <div class="tw-label" style="margin-bottom:3px;">配置名称</div>
                <input class="tw-input" id="twApiNameInput" placeholder="输入自定义配置名称">

                <div class="tw-label" style="margin-bottom:3px;">API 接口地址</div>
                <input class="tw-input" id="twApiUrlInput" placeholder="https://api.openai.com/v1">

                <div class="tw-label" style="margin-bottom:3px;">API Key 密钥</div>
                <input class="tw-input" id="twApiKeyInput" type="password" placeholder="sk-...">

                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <span class="tw-label">模型名称</span>
                  <button type="button" class="tw-mini-btn api-btn" id="twFetchModelsBtn" style="padding:2px 8px;font-size:11px;">拉取模型列表</button>
                </div>
                <input class="tw-input" id="twApiModelInput" placeholder="gpt-4o-mini / claude-3-5-sonnet / deepseek-chat">
                <div id="twModelSelectWrap" style="display:none;margin-bottom:8px;">
                  <select class="tw-select" id="twModelSelectDropdown"></select>
                </div>
              </div>

              <div style="display:flex;justify-content:space-between;gap:8px;margin-top:6px;">
                <button type="button" class="tw-mini-btn" id="twTestApiBtn" style="background:var(--bg-sub);color:var(--accent-strong);border-color:var(--border-outer);font-weight:bold;">测试当前 API</button>
                <button type="button" class="tw-mini-btn api-btn" id="twSaveConfigBtn">保存并启用配置</button>
              </div>
              <div class="tw-status-tip" id="twApiTestResult" style="margin-top:8px;margin-bottom:0;"></div>
            </div>

            <div class="tw-box">
              <div class="tw-sec-head">
                <span>当前绑定对话框独立存档与调用日志</span>
                <div style="display:flex;gap:6px;align-items:center;">
                  <span class="tw-badge" id="twSessionPill">独立存档同步中</span>
                  <span class="tw-badge" id="twApiLogCountBadge">共 0 条</span>
                  <button type="button" class="tw-reply-npc-btn" id="twClearApiLogsBtn">清空日志</button>
                </div>
              </div>
              <div class="tw-log-list" id="twApiLogList"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  targetDoc.body.appendChild(rootEl);
  // ==================== 【上篇结束，请将下篇代码紧接着粘贴在此行下方】 ====================
  // ==================== 【下篇开始：紧接上篇 targetDoc.body.appendChild(rootEl); 之后】 ====================

  targetDoc.getElementById("twCloseErrorBannerBtn")?.addEventListener("click", hideApiErrorBanner);
  targetDoc.getElementById("twClearApiLogsBtn")?.addEventListener("click", () => {
    state.apiLogs = [];
    renderApiLogs();
  });

  // 点击顶部仿微信通知横幅，自动展开闻录并跳到对应聊天窗口
  targetDoc.getElementById("twWechatBanner")?.addEventListener("click", (e) => {
    const banner = e.currentTarget;
    banner.classList.remove("show");
    clearFabGlowReminder();
    const overlay = targetDoc.getElementById("twModalOverlay");
    overlay?.classList.remove("tw-hidden");

    const jumpTab = banner.dataset.jumpTab || "games";
    const jumpSubgame = banner.dataset.jumpSubgame || "dm";
    const jumpNpc = banner.dataset.jumpNpc || "";

    rootEl.querySelectorAll(".tw-nav button").forEach(b => b.classList.toggle("active", b.dataset.tab === jumpTab));
    rootEl.querySelectorAll(".tw-tab-page").forEach(p => p.classList.toggle("active", p.id === `tw-page-${jumpTab}`));

    if (jumpTab === "games") {
      rootEl.querySelectorAll(".tw-game-tab-btn").forEach(b => b.classList.toggle("active", b.dataset.game === jumpSubgame));
      rootEl.querySelectorAll(".tw-subgame-pane").forEach(p => p.classList.toggle("active", p.id === `tw-game-${jumpSubgame}`));
      if (jumpSubgame === "dm" && jumpNpc) {
        state.dmActiveNpc = jumpNpc;
        saveCurrentChatSessionData();
        renderDmSection();
      }
    }
  });

  // 圣人抓包弹窗跳转按钮
  targetDoc.getElementById("twGoCaughtDmBtn")?.addEventListener("click", () => {
    targetDoc.getElementById("twCatchModal")?.classList.remove("show");
    rootEl.querySelectorAll(".tw-nav button").forEach(b => b.classList.toggle("active", b.dataset.tab === "games"));
    rootEl.querySelectorAll(".tw-tab-page").forEach(p => p.classList.toggle("active", p.id === "tw-page-games"));
    rootEl.querySelectorAll(".tw-game-tab-btn").forEach(b => b.classList.toggle("active", b.dataset.game === "dm"));
    rootEl.querySelectorAll(".tw-subgame-pane").forEach(p => p.classList.toggle("active", p.id === "tw-game-dm"));
    state.dmActiveNpc = "萧承稷";
    saveCurrentChatSessionData();
    renderDmSection();
  });

  function setGlobalRefreshingState(isRefreshing, tipMessage = "") {
    state.isGlobalRefreshing = isRefreshing;
    const tip = targetDoc.getElementById("twApiStatusBar");

    if (tip) {
      if (isRefreshing) {
        tip.classList.add("show");
        tip.textContent = tipMessage || "刷新中…";
      } else if (tipMessage) {
        tip.classList.add("show");
        tip.textContent = tipMessage;
        setTimeout(() => {
          if (!state.isGlobalRefreshing) tip.classList.remove("show");
        }, 2000);
      } else {
        tip.classList.remove("show");
      }
    }

    rootEl.querySelectorAll(".tw-manual-refresh-btn").forEach(btn => {
      btn.disabled = isRefreshing;
      btn.classList.toggle("disabled-gray", isRefreshing);
    });
  }

  function getPlotSummaryInstruction() {
    const uName = state.userName || detectCurrentUserName();
    const limit = Math.max(15, Math.min(300, Number(config.plotWordLimit) || DEFAULT_PLOT_WORD_LIMIT));
    const custom = (config.plotCustomPrompt || DEFAULT_PLOT_CUSTOM_PROMPT).trim();
    return `字数严格控制在 ${limit} 字以内；要求：${custom}，必须自然写出女主名字 ${uName}，严禁加方括号或圆括号解释`;
  }

  const getUserFullTag = () => {
    state.userName = detectCurrentUserName();
    const id = state.userIdentity && state.userIdentity !== "未同步" && state.userIdentity.toLowerCase() !== "user"
      ? enforceAddressingRules(state.userIdentity)
      : "";
    return (!id || id === state.userName) ? state.userName : `${id}·${state.userName}`;
  };

  const getForumUserAuthor = () => {
    const custom = (config.forumNickname || "").trim();
    return custom ? custom : state.userName;
  };

  const isForumUsingAlias = () => {
    const custom = (config.forumNickname || "").trim();
    return Boolean(custom && custom !== state.userName);
  };

  function checkIsXiaoChat() {
    try {
      const chatEl = targetDoc.getElementById("chat");
      const sendForm = targetDoc.getElementById("send_form") || targetDoc.getElementId("form_sheld");
      if (!chatEl || chatEl.offsetParent === null || chatEl.clientHeight < 50) return false;
      if (sendForm && sendForm.offsetParent === null) return false;
      const stCtx = targetWin.SillyTavern?.getContext?.() || window.SillyTavern?.getContext?.();
      if (stCtx) {
        if (stCtx.characterId === undefined && !stCtx.groupId) return false;
        const cName = String(stCtx.name2 || "") + String(stCtx.characters?.[stCtx.characterId]?.name || "");
        if (cName.includes("萧承稷") || cName.includes("太微") || cName.includes("大景")) return true;
        const lastMes = String(stCtx.chat?.[stCtx.chat.length - 1]?.mes || "");
        if (lastMes.includes("萧承稷") || lastMes.includes("<角色名>萧承稷")) return true;
        return false;
      }
      const mesText = chatEl.innerText || "";
      return mesText.includes("萧承稷") || mesText.includes("太微宫") || mesText.includes("甘露殿");
    } catch (e) { return true; }
  }

  targetWin.__twCheckTimer = setInterval(() => {
    if (!checkIsXiaoChat()) {
      rootEl.classList.add("tw-chat-inactive");
      targetDoc.getElementById("twModalOverlay")?.classList.add("tw-hidden");
    } else {
      rootEl.classList.remove("tw-chat-inactive");
      if (checkAndSwitchChatSessionIfNeeded()) {
        syncFromWorldbookAndChat(false);
        renderAll();
      }
      const latestDetectedName = detectCurrentUserName();
      if (latestDetectedName && latestDetectedName !== state.userName) {
        const prevName = state.userName;
        state.userName = latestDetectedName;
        if (prevName && state.plotSummary.length) {
          state.plotSummary = state.plotSummary.map(item => ({
            ...item,
            summary: ensureUserNameInSummary(String(item.summary || "").split(prevName).join(latestDetectedName))
          }));
          saveCurrentChatSessionData();
        }
        config.lastKnownUserName = latestDetectedName;
        saveConfig();
        renderAll();
      }
    }
  }, 800);

  const normalizeBaseUrl = (u) => (u || "").trim().replace(/\/+$/, "").replace(/\/(chat\/completions|models)$/, "");

  async function callAI(promptText, sourceName = "闻录请求", preserveAlias = false) {
    state.userName = detectCurrentUserName();
    const fullPrompt = `${promptText}\n\n${getWorldAddressRules()}`;
    const startTime = Date.now();
    const modeLabel = config.apiMode === "custom"
      ? `自定义 · ${config.apiName || config.apiModel || "默认"}`
      : "酒馆主 API";

    try {
      let rawOut = "";
      if (config.apiMode === "custom") {
        const base = normalizeBaseUrl(config.apiUrl), key = (config.apiKey || "").trim(), model = (config.apiModel || "gpt-4o-mini").trim();
        if (!base || !key) throw new Error("未填写自定义 API 地址或 Key");
        const url = base.endsWith("/v1") ? `${base}/chat/completions` : `${base}/v1/chat/completions`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
          body: JSON.stringify({ model, messages: [{ role: "user", content: fullPrompt }], temperature: 0.88 })
        });
        if (!res.ok) {
          let errBody = "";
          try { errBody = await res.text(); } catch (e) {}
          throw new Error(`HTTP ${res.status} ${errBody ? errBody.slice(0, 80) : res.statusText}`);
        }
        const data = await res.json();
        rawOut = data.choices?.[0]?.message?.content || "";
      } else {
        const th = targetWin.TavernHelper || window.TavernHelper || window;
        if (typeof th.generateRaw === "function") rawOut = await th.generateRaw({ ordered_prompts: [{ role: "user", content: fullPrompt }] });
        else if (typeof th.generate === "function") rawOut = await th.generate({ user_input: fullPrompt, should_stream: false });
        else if (typeof targetWin.generateQuietPrompt === "function") rawOut = await targetWin.generateQuietPrompt(fullPrompt, false, false);
        else throw new Error("未检测到酒馆主 API，请在设置切换为使用其他 API");
      }

      if (!rawOut || !String(rawOut).trim()) {
        throw new Error("API 返回内容为空");
      }

      const finalOut = enforceAddressingRules(rawOut, preserveAlias);
      const duration = Date.now() - startTime;
      addApiLog({
        source: sourceName,
        mode: modeLabel,
        status: "success",
        duration,
        detail: `返回 ${finalOut.length} 字：${cleanPureText(finalOut).slice(0, 55)}…`
      });
      return finalOut;
    } catch (err) {
      const duration = Date.now() - startTime;
      const errMsg = err?.message || String(err);
      addApiLog({
        source: sourceName,
        mode: modeLabel,
        status: "error",
        duration,
        detail: `错误原因：${errMsg}`
      });
      showApiErrorBanner(sourceName, errMsg);
      throw err;
    }
  }

  function fillUserChatInput(text) {
    try {
      const cleaned = enforceAddressingRules(text);
      const th = targetWin.TavernHelper || window.TavernHelper;
      if (th && typeof th.setInput === "function") th.setInput(cleaned);
      else {
        const el = targetDoc.getElementById("send_textarea") || targetDoc.querySelector("#send_form textarea");
        if (el) { el.value = cleaned; el.dispatchEvent(new Event("input", { bubbles: true })); el.focus(); }
      }
      targetDoc.getElementById("twModalOverlay").classList.add("tw-hidden");
    } catch (e) {}
  }

  const getTag = (s, t) => { const m = (s || "").match(new RegExp(`<${t}>([\\s\\S]*?)<\\/${t}>`, "i")); return m ? m[1].trim() : ""; };

  function getRawChatList(limit = 0) {
    const fullList = [];
    const curUserName = detectCurrentUserName();
    try {
      const stCtx = targetWin.SillyTavern?.getContext?.() || window.SillyTavern?.getContext?.();
      if (stCtx?.chat?.length) {
        let aiCounter = 0;
        stCtx.chat.forEach((m, absIdx) => {
          const raw = m.mes || m.message || "";
          const isUser = !!m.is_user;
          if (!isUser && raw) aiCounter++;
          if (raw) fullList.push({ absIdx, aiRoundNum: isUser ? 0 : aiCounter, name: isUser ? curUserName : (m.name || "萧承稷"), isUser, raw });
        });
        if (fullList.length) return limit > 0 ? fullList.slice(-limit) : fullList;
      }
    } catch (e) {}
    try {
      const th = targetWin.TavernHelper || window.TavernHelper;
      if (th && typeof th.getChatMessages === "function") {
        const msgs = th.getChatMessages("0--1") || [];
        let aiCounter = 0;
        msgs.forEach((m, absIdx) => {
          const raw = m.message || m.mes || "";
          const isU = m.role === "user" || m.is_user;
          if (!isU && raw) aiCounter++;
          if (raw) fullList.push({ absIdx, aiRoundNum: isU ? 0 : aiCounter, name: isU ? curUserName : (m.name || "萧承稷"), isUser: isU, raw });
        });
        if (fullList.length) return limit > 0 ? fullList.slice(-limit) : fullList;
      }
    } catch (e) {}
    try {
      const allDom = Array.from(targetDoc.querySelectorAll("#chat .mes"));
      let aiCounter = 0;
      allDom.forEach((el, absIdx) => {
        const isUser = el.getAttribute("is_user") === "true";
        const name = isUser ? curUserName : (el.getAttribute("ch_name") || el.querySelector(".ch_name")?.textContent || "萧承稷");
        const raw = el.querySelector(".mes_text")?.innerHTML || el.querySelector(".mes_text")?.innerText || "";
        if (!isUser && raw) aiCounter++;
        if (raw) fullList.push({ absIdx, aiRoundNum: isUser ? 0 : aiCounter, name, isUser, raw });
      });
    } catch (e) {}
    return limit > 0 ? fullList.slice(-limit) : fullList;
  }

  function buildStableRoundId(aiRoundNum, absIdx, cleanBody) {
    const head = (cleanBody || "").slice(0, 24).replace(/\s+/g, "");
    return `ai_r${aiRoundNum}_m${absIdx}_${head}`;
  }

  function getFullStoryContext() {
    const fullList = getRawChatList(0);
    const totalAiRounds = fullList.filter(m => !m.isUser && stripMetaAndStatusTags(m.raw).length > 0).length;
    const list = fullList.slice(-12);

    if (!list.length) {
      return {
        historyText: "", lastSceneEnding: "", lastFullTurn: "", latestRoundText: "",
        latestRoundId: "", latestAiHasStatusBar: false, totalAiRounds: 0
      };
    }

    let latestAiHasStatusBar = false;
    let latestAiMsg = null;
    for (let i = list.length - 1; i >= 0; i--) {
      if (!list[i].isUser) {
        latestAiMsg = list[i];
        const r = list[i].raw || "";
        latestAiHasStatusBar = Boolean(
          getTag(r, "时间") || getTag(r, "地点") || getTag(r, "好感度数值") || getTag(r, "心理活动") || getTag(r, "帝王日记")
        );
        break;
      }
    }

    const cleanedTurns = list.map((m) => {
      const body = stripMetaAndStatusTags(m.raw);
      const timeTag = getTag(m.raw, "时间");
      const locTag = getTag(m.raw, "地点");
      return {
        absIdx: m.absIdx,
        aiRoundNum: m.aiRoundNum,
        name: m.name,
        isUser: m.isUser,
        body,
        timeTag,
        locTag
      };
    }).filter(x => x.body.length > 0);

    if (!cleanedTurns.length) {
      return {
        historyText: "", lastSceneEnding: "", lastFullTurn: "", latestRoundText: "",
        latestRoundId: "", latestAiHasStatusBar, totalAiRounds
      };
    }

    const historyParts = cleanedTurns.slice(0, -1).map((t, i) => {
      const snippet = t.body.length > 600 ? "…" + t.body.slice(-600) : t.body;
      return `第${i + 1}段·${t.name}：\n${snippet}`;
    });

    const lastTurn = cleanedTurns[cleanedTurns.length - 1];
    const prevTurn = cleanedTurns.length >= 2 ? cleanedTurns[cleanedTurns.length - 2] : null;

    const lastFullTurn = lastTurn.body.length > 2200 ? "…" + lastTurn.body.slice(-2200) : lastTurn.body;
    const lastSceneEnding = lastTurn.body.slice(-550);
    const latestRoundText = (prevTurn ? `${prevTurn.name}：\n${prevTurn.body.slice(-600)}\n\n` : "") + `${lastTurn.name}：\n${lastFullTurn}`;

    let latestRoundId = "";
    if (latestAiMsg) {
      const aiCleanBody = stripMetaAndStatusTags(latestAiMsg.raw);
      if (aiCleanBody) {
        latestRoundId = buildStableRoundId(latestAiMsg.aiRoundNum, latestAiMsg.absIdx, aiCleanBody);
      }
    }

    return {
      historyText: historyParts.join("\n\n"),
      lastFullTurn: `最新一楼完整剧情·${lastTurn.name}：\n${lastFullTurn}`,
      lastSceneEnding,
      latestRoundText,
      latestRoundId,
      latestAiHasStatusBar,
      totalAiRounds
    };
  }

  function getRelationshipAndFamiliarityContext() {
    const timelineTail = state.plotSummary.slice(-6).map((x, i) => `${i + 1}. [${x.time}·${x.location}] ${x.summary}`).join("\n");
    const { latestRoundText } = getFullStoryContext();
    return `
【当前剧情进度、萧承稷情感状态与NPC熟识度设定】：
1. 女主真实身份：${getUserFullTag()}，当前所在地点：${state.location}，当前时间：${state.time}。
2. 萧承稷对 ${state.userName} 的当前情感状态：好感度数值为 ${state.hasAffection ? state.affection : 0}，处于阶段 ${state.stage || "【审视窥探】"}，当前心情：${state.mood}，真实想法：“${state.innerThought || "专注于政务与宫中动向"}”。
3. NPC熟识度铁律：请根据下方近期故事时间轴与最新一轮剧情判断哪些 NPC 已经与 ${state.userName} 正式打过交道、关系亲疏如何；尚未在剧情中见过 ${state.userName} 的宫内外 NPC，对 ${state.userName} 只有道听途说的印象或完全陌生，绝不能自来熟。
4. 近期故事时间轴脉络：
${timelineTail || "刚开局"}
5. 最新一轮互动节选：
${latestRoundText ? latestRoundText.slice(-700) : "暂无"}`;
  }

  function applyFallbackStatusIfMissing(fs) {
    if (!fs || typeof fs !== "object") return;
    if (fs.time && (state.time === "未同步" || !state.hasDirectStatusTags)) state.time = enforceAddressingRules(fs.time);
    if (fs.location && (state.location === "未同步" || !state.hasDirectStatusTags)) state.location = enforceAddressingRules(fs.location);
    if (fs.userIdentity && (state.userIdentity === "未同步" || !state.hasDirectStatusTags)) state.userIdentity = enforceAddressingRules(fs.userIdentity);
    if (fs.clothes && (state.clothes === "未同步" || !state.hasDirectStatusTags)) state.clothes = enforceAddressingRules(fs.clothes);
    if (fs.pose && (state.pose === "未同步" || !state.hasDirectStatusTags)) state.pose = enforceAddressingRules(fs.pose);
    if (fs.mood && (state.mood === "未同步" || !state.hasDirectStatusTags)) state.mood = enforceAddressingRules(fs.mood);
    if (fs.innerThought && (!state.innerThought || !state.hasDirectStatusTags)) state.innerThought = enforceAddressingRules(fs.innerThought);
    if (fs.diary && (!state.diary || !state.hasDirectStatusTags)) state.diary = enforceAddressingRules(fs.diary);
    if (fs.todo1 && (!state.todo1 || !state.hasDirectStatusTags)) state.todo1 = enforceAddressingRules(fs.todo1);
    if (fs.todo2 && (!state.todo2 || !state.hasDirectStatusTags)) state.todo2 = enforceAddressingRules(fs.todo2);
    if (fs.affection !== undefined && !isNaN(Number(fs.affection)) && (!state.hasAffection || !state.hasDirectStatusTags)) {
      state.affection = Number(fs.affection);
      state.hasAffection = true;
    }
    if (fs.stage && (state.stage === "未同步" || !state.hasDirectStatusTags)) state.stage = enforceAddressingRules(fs.stage);
    saveCurrentChatSessionData();
  }

  function upsertTimelineNode(roundId, timeStr, locStr, summaryStr) {
    const cleanSum = ensureUserNameInSummary(summaryStr);
    if (!cleanSum) return;
    const nodeObj = {
      roundId: roundId || `manual_${Date.now()}`,
      time: enforceAddressingRules(timeStr || state.time || "延昭二年"),
      location: enforceAddressingRules(locStr || state.location || "太微宫"),
      summary: cleanSum
    };

    if (roundId) {
      const existingIdx = state.plotSummary.findIndex(x => (x.roundId || x.turnKey) === roundId);
      if (existingIdx >= 0) {
        state.plotSummary[existingIdx] = nodeObj;
        saveTimeline();
        return;
      }
    }

    const lastIdx = state.plotSummary.length - 1;
    if (lastIdx >= 0) {
      const lastItem = state.plotSummary[lastIdx];
      if (lastItem.summary === nodeObj.summary) return;
    }

    state.plotSummary.push(nodeObj);
    saveTimeline();
  }

  async function syncFromWorldbookAndChat(triggerAuto = false) {
    try {
      checkAndSwitchChatSessionIfNeeded();
      state.userName = detectCurrentUserName();
      const messages = getRawChatList(10);
      let latestAiFound = false;
      state.hasDirectStatusTags = false;

      for (let i = messages.length - 1; i >= 0; i--) {
        const raw = messages[i]?.raw || "";
        if (!raw) continue;
        const time = getTag(raw, "时间"), loc = getTag(raw, "地点"), clothes = getTag(raw, "穿着"), pose = getTag(raw, "姿势");
        const mood = getTag(raw, "心情"), thought = getTag(raw, "心理活动"), aff = getTag(raw, "好感度数值"), stage = getTag(raw, "好感度阶段");
        const uId = getTag(raw, "user身份"), inN = getTag(raw, "宫内见闻"), diary = getTag(raw, "帝王日记"), td1 = getTag(raw, "待办1"), td2 = getTag(raw, "待办2"), outN = getTag(raw, "宫外见闻");
        if (time || loc || aff !== "" || stage || inN || outN || thought || diary) {
          if (!latestAiFound && !messages[i].isUser) {
            state.hasDirectStatusTags = true;
          }
          if (time && !time.includes("{{")) state.time = time;
          if (loc && !loc.includes("{{")) state.location = enforceAddressingRules(loc);
          if (clothes && !clothes.includes("{{")) state.clothes = clothes;
          if (pose && !pose.includes("{{")) state.pose = pose;
          if (mood && !mood.includes("{{")) state.mood = mood;
          if (thought && !thought.includes("{{")) state.innerThought = enforceAddressingRules(thought);
          if (diary && !diary.includes("{{")) state.diary = enforceAddressingRules(diary);
          if (aff !== "" && !isNaN(Number(aff))) { state.affection = Number(aff); state.hasAffection = true; }
          if (stage && !stage.includes("{{")) state.stage = stage;
          if (uId && !uId.includes("{{") && uId.toLowerCase() !== "user") {
            state.userIdentity = enforceAddressingRules(uId);
          }
          if (td1 && !td1.includes("{{")) state.todo1 = enforceAddressingRules(td1);
          if (td2 && !td2.includes("{{")) state.todo2 = enforceAddressingRules(td2);
          if (inN && !inN.includes("{{")) state.inNews = enforceAddressingRules(inN);
          if (outN && !outN.includes("{{")) state.outNews = enforceAddressingRules(outN);
          saveCurrentChatSessionData();
          break;
        }
        if (!messages[i].isUser) latestAiFound = true;
      }
    } catch (e) {}
    scanChatForActiveDmNpcs();
    renderAll();

    const { lastSceneEnding, latestRoundId, totalAiRounds } = getFullStoryContext();
    if (triggerAuto && totalAiRounds >= 2 && lastSceneEnding && latestRoundId) {
      if (state.isAutoRunning) return;
      if (state.lastAutoProcessedRoundId === latestRoundId) return;

      state.isAutoRunning = true;
      state.lastAutoProcessedRoundId = latestRoundId;
      saveCurrentChatSessionData();
      try {
        await runEnabledAutoRefreshTasks(latestRoundId, totalAiRounds);
      } finally {
        state.isAutoRunning = false;
      }
    }
  }

  async function runEnabledAutoRefreshTasks(currentRoundId = "", totalAiRounds = 0) {
    const runStatus = isAutoModuleOn("status");
    const runPlot = isAutoModuleOn("plot");
    const runWorld = isAutoModuleOn("world");

    if (!runStatus && !runPlot && !runWorld) return;

    setGlobalRefreshingState(true, "刷新中…");
    try {
      const alreadyInTimeline = Boolean(
        currentRoundId && state.plotSummary.some(x => (x.roundId || x.turnKey) === currentRoundId)
      );

      if (runPlot && state.plotSummary.length < totalAiRounds - 1) {
        await rebuildFullLongTimeline(true);
      } else if (runStatus || (runPlot && !alreadyInTimeline)) {
        await autoGenerateCorePlotData(true, {
          doStatus: runStatus,
          doPlot: runPlot && !alreadyInTimeline
        });
      }

      if (runWorld) {
        await refreshWorldOnly(null, true);
      }
      setGlobalRefreshingState(false);
      showModuleSuccessToast("自动同步（状态/剧情/世界）");
    } catch (e) {
      setGlobalRefreshingState(false);
    }
  }

  async function autoGenerateCorePlotData(fromGlobalTask = false, opts = { doStatus: true, doPlot: true }) {
    if (!fromGlobalTask) {
      setGlobalRefreshingState(true, "刷新中…");
    }
    try {
      await syncFromWorldbookAndChat(false);
      const uName = state.userName;
      const { latestRoundText, latestRoundId, latestAiHasStatusBar } = getFullStoryContext();
      const needFallbackStatus = opts.doStatus && (!latestAiHasStatusBar || state.clothes === "未同步" || !state.innerThought || !fromGlobalTask);
      const existingTail = state.plotSummary.slice(-4).map((x, i) => `${i + 1}. [${x.time} · ${x.location}] ${ensureUserNameInSummary(x.summary)}`).join("\n");
      const plotInstruction = getPlotSummaryInstruction();

      const promptParts = [];
      if (needFallbackStatus) {
        promptParts.push(`"fallbackStatus": {
    "time": "当前大景年号、日期与时辰",
    "location": "萧承稷当前所在具体宫殿或地点",
    "userIdentity": "${uName}当前在剧中的具体身份或位分",
    "clothes": "萧承稷当前衣着与配饰，十字以内",
    "pose": "萧承稷当前动作与姿态，十字以内",
    "mood": "萧承稷当前情绪状态，四字以内",
    "innerThought": "萧承稷第一人称真实心理活动，自称朕，严禁自称孤，28字以内",
    "diary": "萧承稷第一人称私密帝王手札，自称朕，严禁自称孤，70字左右",
    "todo1": "萧承稷当前待办政务1",
    "todo2": "萧承稷当前待办事项2",
    "affection": ${state.hasAffection ? state.affection : 10},
    "stage": "${state.stage !== "未同步" ? state.stage : "【审视窥探】"}"
  }`);
      }
      if (opts.doPlot) {
        promptParts.push(`"latestTimelineNode": {
    "time": "本轮剧情的具体时间",
    "location": "本轮事件发生的具体太微宫或长安地点",
    "summary": "仅概括最新这一轮发生了什么新进展，严禁重复上方已记录的旧事件，遵守要求：${plotInstruction}"
  }`);
      }

      if (!promptParts.length) {
        if (!fromGlobalTask) setGlobalRefreshingState(false);
        return;
      }

      const prompt = `你是《太微宫闻录》的实时史官同步助手。请严格依据下方酒馆实际生成的最新一轮剧情正文进行同步。

当前女主姓名：${uName}，身份：${getUserFullTag()}，当前时间：${state.time}，当前地点：${state.location}。

故事时间轴已记录的最近几轮脉络：
${existingTail || "暂无记录"}

本轮最新发生的完整剧情：
${latestRoundText}

请直接输出纯 JSON 对象，不要包含任何圆括号注释说明：
{
  ${promptParts.join(",\n  ")}
}`;

      const resp = await callAI(prompt, opts.doPlot ? "剧情梳理与状态同步" : "状态栏同步");
      const m = String(resp).match(/{[\s\S]*}/);
      if (m) {
        const p = JSON.parse(m[0]);
        if (needFallbackStatus && p.fallbackStatus) {
          applyFallbackStatusIfMissing(p.fallbackStatus);
        }
        if (opts.doPlot) {
          const node = p.latestTimelineNode || (Array.isArray(p.newTimelineNodes) ? p.newTimelineNodes[0] : null);
          if (node && (node.summary || node.event)) {
            upsertTimelineNode(latestRoundId, node.time, node.location, node.summary || node.event);
          }
        }
        saveCurrentChatSessionData();
        renderAll();
        if (!fromGlobalTask) {
          setGlobalRefreshingState(false);
          showModuleSuccessToast(opts.doPlot ? "剧情时间轴" : "天子状态栏");
        }
      } else {
        throw new Error("返回格式未能解析为 JSON");
      }
    } catch (e) {
      if (!fromGlobalTask) setGlobalRefreshingState(false);
    }
  }

  async function rebuildFullLongTimeline(fromGlobalTask = false) {
    const btn = targetDoc.getElementById("twRebuildFullPlotBtn");
    if (btn) btn.textContent = "刷新中…";
    if (!fromGlobalTask) {
      setGlobalRefreshingState(true, "刷新中…");
    }
    try {
      await syncFromWorldbookAndChat(false);
      const uName = state.userName;
      const allList = getRawChatList(0);
      const aiRoundMeta = [];
      allList.forEach((m) => {
        if (m.isUser) return;
        const body = stripMetaAndStatusTags(m.raw);
        if (!body) return;
        const t = getTag(m.raw, "时间") || state.time || "延昭二年";
        const l = enforceAddressingRules(getTag(m.raw, "地点") || state.location || "太微宫");
        const roundId = buildStableRoundId(m.aiRoundNum, m.absIdx, body);
        const snippet = body.length > 520 ? body.slice(0, 180) + "……" + body.slice(-340) : body;
        aiRoundMeta.push({
          roundNum: aiRoundMeta.length + 1,
          roundId,
          time: t,
          location: l,
          text: `第${aiRoundMeta.length + 1}轮·女主姓名：${uName} | 时间：${t} | 地点：${l}：\n${snippet}`
        });
      });

      const sliceMeta = aiRoundMeta.slice(-18);
      const roundsToFeed = sliceMeta.map(x => x.text).join("\n\n");
      const { latestRoundId, latestAiHasStatusBar } = getFullStoryContext();
      const needFallbackStatus = !latestAiHasStatusBar || state.clothes === "未同步" || !state.innerThought;
      const plotInstruction = getPlotSummaryInstruction();

      const prompt = `你是《太微宫闻录》的编年史官。当前女主的名字叫：${uName}，身份：${getUserFullTag()}。
注意：
1. 下方共有 ${sliceMeta.length} 轮历史剧情，请在 longTimeline 数组中严格按顺序每一轮对应输出 1 幕，共 ${sliceMeta.length} 幕。
2. 每一幕的 summary 摘要必须严格遵循要求：${plotInstruction}。

逐轮历史剧情记录：
${roundsToFeed || "暂无历史记录"}

请直接输出纯 JSON 对象：
{
  ${needFallbackStatus ? `"fallbackStatus": {
    "time": "当前大景年号、日期与时辰",
    "location": "萧承稷当前所在地点",
    "userIdentity": "${uName}当前具体身份或位分",
    "clothes": "萧承稷当前衣着配饰，十字以内",
    "pose": "萧承稷当前动作姿态，十字以内",
    "mood": "萧承稷当前情绪，四字以内",
    "innerThought": "萧承稷第一人称真实想法，自称朕，28字以内",
    "diary": "萧承稷第一人称私密手札，自称朕，70字左右",
    "todo1": "萧承稷待办事项1",
    "todo2": "萧承稷待办事项2",
    "affection": ${state.hasAffection ? state.affection : 10},
    "stage": "${state.stage !== "未同步" ? state.stage : "【审视窥探】"}"
  },` : ""}
  "longTimeline": [
    {
      "time": "该轮具体时间",
      "location": "该轮具体地点",
      "summary": "概括该轮事件"
    }
  ]
}`;

      const resp = await callAI(prompt, "全量重梳时间轴");
      const m = String(resp).match(/{[\s\S]*}/);
      if (m) {
        const p = JSON.parse(m[0]);
        if (needFallbackStatus && p.fallbackStatus) applyFallbackStatusIfMissing(p.fallbackStatus);
        if (Array.isArray(p.longTimeline) && p.longTimeline.length) {
          state.plotSummary = p.longTimeline.map((node, i) => {
            const matchedMeta = sliceMeta[i] || sliceMeta[sliceMeta.length - 1];
            const rid = (i === p.longTimeline.length - 1 && latestRoundId)
              ? latestRoundId
              : (matchedMeta?.roundId || `hist_${i}`);
            return {
              roundId: rid,
              time: enforceAddressingRules(node.time || matchedMeta?.time || state.time || "延昭二年"),
              location: enforceAddressingRules(node.location || matchedMeta?.location || state.location || "太微宫"),
              summary: ensureUserNameInSummary(node.summary || node.event || "")
            };
          }).filter(x => x.summary);
        }
        if (latestRoundId) {
          state.lastAutoProcessedRoundId = latestRoundId;
        }
        saveCurrentChatSessionData();
        renderAll();
        if (!fromGlobalTask) {
          setGlobalRefreshingState(false);
          showModuleSuccessToast("全量故事时间轴");
        }
      } else {
        throw new Error("时间轴返回格式未能解析为 JSON");
      }
    } catch (e) {
      if (!fromGlobalTask) setGlobalRefreshingState(false);
    } finally {
      if (btn) btn.textContent = "全量重梳全部楼层";
    }
  }

  async function refreshStatusOnly() {
    const btn = targetDoc.getElementById("twRefreshStatusOnlyBtn");
    if (btn) btn.textContent = "刷新中…";
    try {
      await autoGenerateCorePlotData(false, { doStatus: true, doPlot: false });
    } finally {
      if (btn) btn.textContent = "手动刷新";
    }
  }

  // ==================== 圣人日常（平行精致翻牌卡片 · 点进不同卡片累计触发抓包） ====================
  function renderEmperorSpySection() {
    const box = targetDoc.getElementById("twEmperorSpyList");
    if (!box) return;
    if (!state.emperorSpyData) {
      box.innerHTML = `<div class="tw-empty-hint">目前尚未打探到圣人今日起居秘录，请点击右上角「暗中打探刷新」生成六大暗格卡片。</div>`;
      return;
    }

    const d = state.emperorSpyData;
    const revealed = state.emperorSpyRevealed || {};

    box.innerHTML = `<div class="tw-spy-grid">` + SPY_CARD_META.map(meta => {
      const info = d[meta.key] || {};
      const isOpened = Boolean(revealed[meta.key]);
      if (!isOpened) {
        return `
          <div class="tw-spy-tile sealed" data-spy-key="${meta.key}" title="点击掀开此暗格窥探">
            <div class="tw-spy-seal-stamp">${meta.icon}</div>
            <div class="tw-spy-tile-name">${meta.title}</div>
            <div class="tw-spy-tile-sub">${meta.sub}</div>
            <span class="tw-spy-seal-hint">朱印封缄 · 点击窥探</span>
          </div>`;
      }
      return `
        <div class="tw-spy-tile revealed" data-spy-key="${meta.key}">
          <div class="tw-spy-top">
            <span class="tw-spy-title">${meta.icon} ${meta.title}</span>
            <div style="display:flex;gap:6px;align-items:center;">
              <span class="tw-badge">心情：${enforceAddressingRules(info.mood || "沉静")}</span>
              <button type="button" class="tw-spy-fold-btn" data-fold-spy="${meta.key}">合上暗格</button>
            </div>
          </div>
          <div class="tw-spy-detail">${enforceAddressingRules(info.detail || "暂无记录")}</div>
          <div class="tw-spy-murmur">💭 圣人碎碎念：“${enforceAddressingRules(info.murmur || "……")}”</div>
        </div>`;
    }).join("") + `</div>`;
  }

  async function triggerEmperorCaughtEvent(clickedCardTitle = "起居秘录") {
    state.emperorCardClickCount = 0;
    state.emperorNextCatchThreshold = Math.floor(Math.random() * 3) + 3;
    saveCurrentChatSessionData();

    try {
      const relCtx = getRelationshipAndFamiliarityContext();
      const prompt = `${state.userName} 刚刚接连偷偷翻看甘露殿起居注暗格（刚刚正在偷看【${clickedCardTitle}】），打听萧承稷今日见客、膳食、奏折与隐秘心绪，结果因翻看频率太高，被城府极深、掌控欲极强的萧承稷当场察觉抓包！
${relCtx}
注意：萧承稷必自称“朕”（绝禁止自称“孤”！），语气简短冷峻、带着上位者的审视与掌控欲。
请输出纯 JSON：
{
  "catchScene": "60字左右第三人称描写萧承稷察觉 ${state.userName} 频频翻看他【${clickedCardTitle}】时的冷峻神态与反应",
  "dmQuestion": "萧承稷立刻发给 ${state.userName} 的一条单人私聊质问消息（符合当前好感度阶段 ${state.stage}，必自称朕，严禁自称孤，45字以内）"
}`;
      const resp = await callAI(prompt, "圣人抓包质问联动");
      const m = String(resp).match(/{[\s\S]*}/);
      let catchScene = `赵怀安刚把甘露殿起居注合上，殿内便传来一声极轻的冷哼。萧承稷指尖慢条斯理地转过墨玉扳指，早已将 ${state.userName} 接连翻看他【${clickedCardTitle}】的举动尽收眼底。`;
      let dmQuestion = `查了朕的膳食奏章还不算，连【${clickedCardTitle}】也要挨个翻看？${state.userName}，胆子肥了，自己过来甘露殿当面问朕。`;

      if (m) {
        const parsed = JSON.parse(m[0]);
        if (parsed.catchScene) catchScene = cleanPureText(parsed.catchScene);
        if (parsed.dmQuestion) dmQuestion = cleanPureText(parsed.dmQuestion);
      }

      if (!Array.isArray(state.dmHistories["萧承稷"])) {
        state.dmHistories["萧承稷"] = [];
      }
      state.dmHistories["萧承稷"].push({
        type: "system",
        text: `⚠️ 你频繁翻看【${clickedCardTitle}】的举动已被萧承稷当场察觉`
      });
      state.dmHistories["萧承稷"].push({
        sender: "萧承稷",
        text: dmQuestion,
        self: false
      });
      saveCurrentChatSessionData();
      renderDmSection();

      const descEl = targetDoc.getElementById("twCatchDesc");
      if (descEl) descEl.textContent = catchScene;
      targetDoc.getElementById("twCatchModal")?.classList.add("show");
      showWechatNotification("萧承稷（抓包质问）", dmQuestion, { tab: "games", subgame: "dm", npc: "萧承稷" });
    } catch (e) {}
  }

  // 点击圣人日常平行卡片展开 & 按点开不同卡片频率触发抓包
  targetDoc.getElementById("twEmperorSpyList")?.addEventListener("click", async (e) => {
    const foldBtn = e.target.closest("button[data-fold-spy]");
    if (foldBtn) {
      e.stopPropagation();
      const k = foldBtn.dataset.foldSpy;
      if (state.emperorSpyRevealed) delete state.emperorSpyRevealed[k];
      saveCurrentChatSessionData();
      renderEmperorSpySection();
      return;
    }

    const tile = e.target.closest(".tw-spy-tile.sealed");
    if (!tile) return;
    const key = tile.dataset.spyKey;
    if (!key) return;

    if (!state.emperorSpyRevealed) state.emperorSpyRevealed = {};
    state.emperorSpyRevealed[key] = true;
    state.emperorCardClickCount = (Number(state.emperorCardClickCount) || 0) + 1;
    saveCurrentChatSessionData();
    renderEmperorSpySection();

    const meta = SPY_CARD_META.find(x => x.key === key);
    if (state.emperorCardClickCount >= (state.emperorNextCatchThreshold || 3)) {
      await triggerEmperorCaughtEvent(meta ? meta.title : "起居秘录");
    }
  });

  async function refreshEmperorSpyOnly() {
    const btn = targetDoc.getElementById("twRefreshEmperorSpyBtn");
    if (btn) btn.textContent = "打探中…";
    setGlobalRefreshingState(true, "正在暗中打探圣人今日六事…");

    try {
      await syncFromWorldbookAndChat(false);
      const { lastFullTurn, lastSceneEnding } = getFullStoryContext();
      const relCtx = getRelationshipAndFamiliarityContext();

      const prompt = `你是甘露殿秘密起居注记录官。请结合当前最新剧情与萧承稷的人设，生成萧承稷今日的 6 项私密日常状态（1.今日见客 2.今日政事 3.所批折子 4.今日消遣 5.御膳茶点 6.隐秘欲念）。
每一项都必须包含：具体详情（detail）、他当时的心情（mood，4字内）、以及他第一人称的内心碎碎念（murmur，30字内，必自称“朕”或“我”，绝对禁止自称“孤”！冷峻腹黑、掌控欲强或暗藏对 ${state.userName} 的在意/欲念）。

最新剧情背景：
${lastFullTurn}
最新一幕：${lastSceneEnding}
${relCtx}

请严格输出纯 JSON 对象：
{
  "visitors": {"detail": "今日召见或偶遇的具体人物与交谈内容", "mood": "四字心情", "murmur": "萧承稷第一人称碎碎念（自称朕，禁称孤）"},
  "actions": {"detail": "今日在朝堂或内廷亲自处理的具体政事行动", "mood": "四字心情", "murmur": "萧承稷第一人称碎碎念（自称朕，禁称孤）"},
  "memorials": {"detail": "今日案头批阅的具体奏折内容与朱批态度", "mood": "四字心情", "murmur": "萧承稷第一人称碎碎念（自称朕，禁称孤）"},
  "leisure": {"detail": "今日闲暇时的骑射、弈棋、看舆图或暗中画画", "mood": "四字心情", "murmur": "萧承稷第一人称碎碎念（自称朕，禁称孤）"},
  "meals": {"detail": "今日尚食局进呈的早午晚膳或浓茶苦茶", "mood": "四字心情", "murmur": "萧承稷第一人称碎碎念（自称朕，禁称孤）"},
  "desire": {"detail": "今日对 ${state.userName} 的身体欲念程度、克制或隐秘幻想（结合好感度 ${state.affection} 与阶段 ${state.stage}）", "mood": "四字心情", "murmur": "萧承稷极具占有欲的第一人称私密碎碎念（自称朕，禁称孤）"}
}`;

      const resp = await callAI(prompt, "圣人日常窥探");
      const m = String(resp).match(/{[\s\S]*}/);
      if (m) {
        state.emperorSpyData = JSON.parse(m[0]);
        // 刷新后六张卡片全部重置为朱印封缄状态，等待玩家逐个点进去看
        state.emperorSpyRevealed = {};
        saveCurrentChatSessionData();
        renderEmperorSpySection();
        setGlobalRefreshingState(false);
        showModuleSuccessToast("圣人六事暗格已就绪（点击卡片可掀开查看）");
      } else {
        throw new Error("圣人日常返回格式未能解析为 JSON");
      }
    } catch (e) {
      setGlobalRefreshingState(false);
    } finally {
      if (btn) btn.textContent = "暗中打探刷新";
    }
  }

  async function generateStoryPlansOnly() {
    const btn = targetDoc.getElementById("twRefreshActionsBtn");
    if (btn) btn.textContent = "刷新中…";
    setGlobalRefreshingState(true, "刷新中…");
    try {
      await syncFromWorldbookAndChat(false);
      const uName = state.userName;
      const customIdea = targetDoc.getElementById("twStoryCustomIdea")?.value.trim() || "";
      const { lastFullTurn, lastSceneEnding } = getFullStoryContext();
      const relCtx = getRelationshipAndFamiliarityContext();

      const customDirective = customIdea
        ? `【用户指定的剧情走向】：请围绕「${customIdea}」这一方向，衍生构思 6 个不同切入点或不同展开方式的完整事件！`
        : `【全面涵盖六类剧情发展】：用户未指定具体方向，请结合当前剧情进展与 ${uName} 的身份，构思 6 个各具张力的完整事件发展，分别涵盖：
  1. 升温剧情：促使萧承稷与 ${uName} 产生拉扯、触动心防或增加好感度的完整事件；
  2. 冲突剧情：引爆矛盾、吃醋试探、身份危机或与六宫及朝臣正面交锋的完整事件；
  3. 平行事件：同一时刻宫墙内外、前朝或相关NPC发生的联动大事件，并将余波引向当前场景；
  4. 暗流伏笔：涉及皇城司密报、前朝旧党、漠北暗桩或深宫隐秘的悬念事件；
  5. 日常插曲：贴合当前时节、膳食医药、器物赏赐或北苑游艺的生活化事件；
  6. 破局转折：打破当下僵局或开辟新场面的转折事件。`;

      const prompt = `你是《太微宫闻录》的剧情总策划。请仔细阅读酒馆最新剧情与人物关系：
${lastFullTurn}

最新一幕结尾画面：
"""
${lastSceneEnding || "太微宫日常推进"}
"""

${relCtx}

${customDirective}

【剧情安排铁律】：
1. 不是单个动作，而是一整个完整事件：每一项都必须是一个有起因、有环境氛围、有人物动向与矛盾焦点的完整剧情事件安排。
2. 全程使用第三人称：直接写“${uName}”、“萧承稷”或相关NPC的名字，严禁使用“你”或第一人称“我”！严禁在名字后加任何圆括号说明！
3. 绝对不要写事件结果：只写事件的开端、突发状况与悬念铺垫，把事情推到最关键的节点戛然而止，留给正文中去自然演绎结果！
4. prompt 字段可直接发入对话框推进剧情：每项的 prompt 是一段 75~110 字左右、全第三人称、画面感极强的事件开端描写，紧接当前剧情并开启该事件，结尾停在悬念处，不写结局。

请直接输出纯 JSON 对象：
{
  "storyPlans": [
    {"tag": "升温剧情", "title": "事件标题12字内", "desc": "第三人称简述该事件的起因与悬念铺垫，不写结果，45字内", "prompt": "点击直接填入对话框的第三人称完整事件开端描写，不写事件结果，85字左右"},
    {"tag": "冲突剧情", "title": "事件标题12字内", "desc": "第三人称简述该事件的起因与悬念铺垫，不写结果，45字内", "prompt": "点击直接填入对话框的第三人称完整事件开端描写，不写事件结果，85字左右"},
    {"tag": "平行事件", "title": "事件标题12字内", "desc": "第三人称简述该事件的起因与悬念铺垫，不写结果，45字内", "prompt": "点击直接填入对话框的第三人称完整事件开端描写，不写事件结果，85字左右"},
    {"tag": "暗流伏笔", "title": "事件标题12字内", "desc": "第三人称简述该事件的起因与悬念铺垫，不写结果，45字内", "prompt": "点击直接填入对话框的第三人称完整事件开端描写，不写事件结果，85字左右"},
    {"tag": "日常插曲", "title": "事件标题12字内", "desc": "第三人称简述该事件的起因与悬念铺垫，不写结果，45字内", "prompt": "点击直接填入对话框的第三人称完整事件开端描写，不写事件结果，85字左右"},
    {"tag": "破局转折", "title": "事件标题12字内", "desc": "第三人称简述该事件的起因与悬念铺垫，不写结果，45字内", "prompt": "点击直接填入对话框的第三人称完整事件开端描写，不写事件结果，85字左右"}
  ]
}`;
      const resp = await callAI(prompt, "剧情安排生成");
      const m = String(resp).match(/{[\s\S]*}/);
      if (m) {
        const parsed = JSON.parse(m[0]);
        if (Array.isArray(parsed.storyPlans)) {
          state.storyPlans = parsed.storyPlans.slice(0, 6).map(a => ({
            tag: enforceAddressingRules(a.tag || "剧情安排"),
            title: enforceAddressingRules(a.title || ""),
            desc: enforceAddressingRules(a.desc || ""),
            prompt: enforceAddressingRules(a.prompt || "")
          }));
        }
        saveCurrentChatSessionData();
        renderActions();
        setGlobalRefreshingState(false);
        showModuleSuccessToast("剧情发展安排");
      } else {
        throw new Error("剧情安排返回格式未能解析为 JSON");
      }
    } catch (e) {
      setGlobalRefreshingState(false);
    } finally {
      if (btn) btn.textContent = "手动刷新";
    }
  }

  async function refreshWorldOnly(e, fromGlobalTask = false) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const btn = targetDoc.getElementById("twRefreshWorldBtn");
    if (btn) btn.textContent = "刷新中…";
    if (!fromGlobalTask) {
      setGlobalRefreshingState(true, "刷新中…");
    }
    try {
      await syncFromWorldbookAndChat(false);
      const { lastFullTurn, lastSceneEnding } = getFullStoryContext();
      const palaceCount = Math.floor(Math.random() * 4) + 2;
      const outsideCount = Math.floor(Math.random() * 3) + 2;

      const prompt = `请根据下方酒馆最新一轮剧情进展、当前时间与朝堂后宫局势，推演此刻同步发生的宫内动态约 ${palaceCount} 条与宫外动态约 ${outsideCount} 条。

最新剧情背景：
${lastFullTurn}
最新一幕：${lastSceneEnding}

【NPC动向真实鲜活铁律】：
1. 严禁全员围着女主 ${state.userName} 转，绝大多数 NPC 都在过自己的日子、忙自己的差事、搞自己的朝堂博弈或后宫算计。
2. 后宫妃嫔一律写为「真名（位分）」，如崔清漪（淑妃）、秦昭华（德妃）、苏枕月（丽嫔）、柳如絮（婕妤）等。
3. 宫内输出 ${palaceCount} 条左右，宫外输出 ${outsideCount} 条左右，描写具体鲜活，50字内。

直接输出纯 JSON 对象：
{"palaceDynamics":[{"npc":"姓名（位分或官职）","event":"鲜活具体的宫内或前朝NPC动向","tag":"具体地点或分类"}],"outsideDynamics":[{"npc":"宫外身份·姓名","event":"鲜活具体的长安坊市或边疆动向","tag":"具体坊市或分类"}]}`;
      const resp = await callAI(prompt, "世界动态刷新");
      const m = String(resp).match(/{[\s\S]*}/);
      if (m) {
        const p = JSON.parse(m[0]);
        if (Array.isArray(p.palaceDynamics)) state.palaceDynamics = p.palaceDynamics.map(x => ({ npc: enforceAddressingRules(x.npc), event: enforceAddressingRules(x.event), tag: enforceAddressingRules(x.tag || "太微宫内") }));
        if (Array.isArray(p.outsideDynamics)) state.outsideDynamics = p.outsideDynamics.map(x => ({ npc: enforceAddressingRules(x.npc), event: enforceAddressingRules(x.event), tag: enforceAddressingRules(x.tag || "宫墙之外") }));
        saveCurrentChatSessionData();
        renderWorldLists();
        if (!fromGlobalTask) {
          setGlobalRefreshingState(false);
          showModuleSuccessToast("宫内外世界动态");
        }
      } else {
        throw new Error("世界动态返回格式未能解析为 JSON");
      }
    } catch (err) {
      if (!fromGlobalTask) setGlobalRefreshingState(false);
    } finally {
      if (btn) btn.textContent = "手动刷新";
    }
  }

  const FORUM_NPC_ROSTER = `
【论坛发帖人与评论人昵称必填铁律（自然网名+括号真名与位分）】：
1. 每一个主帖的 author 字段、每一条评论的 nick 字段都【必须填写】，且统一采用「自然鲜活的趣味网名（真名·位分或身份）」格式！
2. 参考示例如下：
   - 苏枕月：“今日有戏听吗（苏枕月·丽嫔）”、“玉照宫嗑瓜子第一人（苏枕月·丽嫔）”
   - 秦昭华：“百步穿杨将门女（秦昭华·德妃）”、“承香殿不服就干（秦昭华·德妃）”
   - 崔清漪：“清河门楣不可辱（崔清漪·淑妃）”、“淑景殿主事（崔清漪·淑妃）”
   - 卢婉兮：“凝华殿赏花人（卢婉兮·修仪）”
   - 柳如絮：“半窗修竹听雪（柳如絮·婕妤）”
   - 郑芷兰：“流霞阁抄经人（郑芷兰·美人）”
   - 周妙音：“今天换新香粉了（周妙音·才人）”
   - 韩怜儿：“秋水居听雨（韩怜儿·宝林）”
   - 沈青禾：“翠微居晒药草（沈青禾·选侍）”
   - 宫女内侍：“承香殿第一护主（丹橘）”、“玉照宫算账小能手（迎春）”、“御前奉茶不洒水（小禄子）”、“尚食局抢菜冠军（王大宝）”、“淑景殿掌事（锦书）”、“听竹轩守门人（听雪）”
   - 萧承稷与前朝宫外：“甘露殿值夜（萧承稷）”、“飞龙厩第一快马（霍惊弦）”、“苦药不加蜜（温言酌）”、“和气生财算盘响（谢无咎）”、“政事堂下棋人（沈砚）”、“北苑练剑人（陆敬）”、“景律第叁百条（裴玄度）”、“不背策论只遛狗（端王萧承泽）”、“西市胡姬酒最烈（洛青衣）”`;

  async function refreshForumOnly(e, fromGlobalTask = false) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const btn = targetDoc.getElementById("twRefreshForumBtn");
    if (btn) btn.textContent = "刷新中…";
    if (!fromGlobalTask) {
      setGlobalRefreshingState(true, "刷新中…");
    }
    try {
      await syncFromWorldbookAndChat(false);
      const { lastFullTurn, lastSceneEnding } = getFullStoryContext();
      const relCtx = getRelationshipAndFamiliarityContext();
      const styleBlock = getForumStylePromptBlock();
      const prompt = `根据酒馆刚刚发生的最新剧情：
${lastFullTurn}
最新一幕：${lastSceneEnding}

${relCtx}

${styleBlock}

请生成 4 条围绕最新剧情风声、朝堂后宫吃瓜与太微宫日常的论坛热帖。每帖的评论数量请随机 3~5 条不等，评论之间要有互相接茬、抢楼、吐槽或拆台的互动感！
若帖子或评论正文中谈论起女主，正文里请直接自然地写 ${state.userName}。
${FORUM_NPC_ROSTER}
请严格按以下 JSON 数组格式输出（author 和 nick 必须为“自然网名（真名·位分）”格式）：
[{"author":"趣味网名（发帖NPC真名·位分）","title":"抓人眼球的活人感帖子标题","content":"生动口语化的帖子正文65字内","tags":["热议"],"comments":[{"nick":"趣味网名（评论NPC真名·位分）","text":"符合所选说话风格的鲜活评论40字内"}]}]`;
      const resp = await callAI(prompt, "宫内外坛刷新", true);
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) {
        state.posts = JSON.parse(m[0]).map((x, i) => ({
          id: Date.now() + i,
          author: pickForumNick(x, i),
          time: "刚刚",
          title: enforceAddressingRules(x.title || "宫中闲话", true),
          content: pickForumText(x),
          tags: Array.isArray(x.tags) ? x.tags : ["闲谈"],
          likes: Math.floor(Math.random() * 60) + 15,
          liked: false,
          comments: Array.isArray(x.comments)
            ? x.comments.map((c, cIdx) => ({
                user: pickForumNick(c, i * 5 + cIdx + 1),
                text: pickForumText(c)
              })).filter(c => c.text)
            : []
        }));
        state.replyTargets = {};
        saveCurrentChatSessionData();
        renderForum(targetDoc.getElementById("twSearch").value);
        if (!fromGlobalTask) {
          setGlobalRefreshingState(false);
          showModuleSuccessToast("宫内外坛热帖");
        }
      } else {
        throw new Error("论坛热帖返回格式未能解析为 JSON");
      }
    } catch (err) {
      if (!fromGlobalTask) setGlobalRefreshingState(false);
    } finally {
      if (btn) btn.textContent = "手动刷新";
    }
  }

  async function syncAllWithAI() {
    const btn = targetDoc.getElementById("twBtnApiSync");
    if (btn) btn.textContent = "刷新中…";
    setGlobalRefreshingState(true, "全部模块刷新中…");
    try {
      await syncFromWorldbookAndChat(false);
      const firstHasName = state.plotSummary.length > 0 && String(state.plotSummary[0]?.summary || "").includes(state.userName);
      if (!state.plotSummary.length || !firstHasName) {
        await rebuildFullLongTimeline(true);
      } else {
        await autoGenerateCorePlotData(true, { doStatus: true, doPlot: true });
      }
      await refreshWorldOnly(null, true);
      await refreshForumOnly(null, true);
      setGlobalRefreshingState(false);
      showModuleSuccessToast("全部模块同步刷新完毕");
    } catch (e) {
      setGlobalRefreshingState(false);
    } finally {
      renderAll();
      if (btn) btn.textContent = "全部刷新";
    }
  }

  async function triggerNpcCommentReply(post, text, targetNpc, isNewPost = false) {
    const randomReplyCount = isNewPost
      ? (Math.floor(Math.random() * 3) + 4)
      : (Math.floor(Math.random() * 3) + 2);
    const usingAlias = isForumUsingAlias();
    const forumUser = getForumUserAuthor();
    setGlobalRefreshingState(true, "刷新中…");

    try {
      const relCtx = getRelationshipAndFamiliarityContext();
      const styleBlock = getForumStylePromptBlock();
      const identityExposureRule = usingAlias
        ? `【匿名马甲防掉马最高铁律】：当前发帖/回帖人使用的是匿名马甲「${forumUser}」，绝对不是真名！严禁任何 NPC 在回复中写出她的真名「${state.userName}」，所有 NPC 只能称呼她的马甲名「@${forumUser}」或“楼主/层主”！`
        : `【公开本名互动规则】：当前使用的是公开本名「${state.userName}」，各位 NPC 请严格按照当前剧情中与 ${state.userName} 的真实熟识程度、交情好坏以及萧承稷当前的感情阶段直接回应。`;

      let actionDesc = "";
      if (isNewPost) {
        actionDesc = `刚刚「${forumUser}」发布了新帖《${post.title}》：“${post.content}”。请生成 ${randomReplyCount} 条不同性格的后宫妃嫔、宫人或前朝NPC的围观盖楼评论。`;
      } else if (targetNpc) {
        actionDesc = `刚刚「${forumUser}」点名回复了 ${targetNpc}：“${text}”。本次请生成 ${randomReplyCount} 条回复，第1条必须由 ${targetNpc} 本人直接回应“回复 @${forumUser}：…”，其余几条由其他围观NPC接话起哄或插嘴！`;
      } else {
        actionDesc = `刚刚「${forumUser}」在帖子下评论道：“${text}”。本次请生成 ${randomReplyCount} 条后宫或前朝NPC针对这句话的鲜活互动回复。`;
      }

      const resp = await callAI(
        `论坛帖子《${post.title}》下，${actionDesc}\n\n${styleBlock}\n\n${identityExposureRule}\n\n${relCtx}\n\n${FORUM_NPC_ROSTER}\n直接输出纯 JSON 数组（nick 字段必填“自然网名（真名·位分）”格式，绝不可为空）：[{"nick":"趣味网名（评论NPC真名·位分）","text":"符合所选说话风格的鲜活回复40字内"}]`,
        "论坛评论互动",
        true
      );
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) {
        const arr = JSON.parse(m[0]);
        for (let i = 0; i < arr.length; i++) {
          const r = arr[i];
          const rNick = pickForumNick(r, i + post.comments.length);
          let replyTxt = pickForumText(r);
          if (rNick && replyTxt) {
            await new Promise(res => setTimeout(res, 450 + Math.random() * 450));
            if (usingAlias && state.userName && replyTxt.includes(state.userName)) {
              replyTxt = replyTxt.split(state.userName).join(forumUser);
            }
            post.comments.push({ user: rNick, text: replyTxt });
            saveCurrentChatSessionData();
            renderForum(targetDoc.getElementById("twSearch").value);
          }
        }
        showModuleSuccessToast("论坛NPC盖楼回复");
      }
      setGlobalRefreshingState(false);
    } catch (e) {
      setGlobalRefreshingState(false);
    }
  }

  // ==================== 单人私聊（根据剧情与世界书动态刷新人物 + 记忆防复读） ====================
  function scanChatForActiveDmNpcs() {
    try {
      const recentMsgs = getRawChatList(18);
      const combinedText = recentMsgs.map(m => m.raw).join("\n") + "\n" + state.plotSummary.map(p => p.summary).join("\n");
      const activeFirst = [];
      const rest = [];

      state.dmNpcOptions.forEach(npc => {
        if (npc.id === "萧承稷") {
          activeFirst.unshift(npc);
          return;
        }
        const kws = npc.keywords || [npc.name.replace(/（.*）/, "")];
        const appeared = kws.some(k => k && combinedText.includes(k));
        if (appeared) {
          activeFirst.push({ ...npc, inCurrentPlot: true });
        } else {
          rest.push({ ...npc, inCurrentPlot: false });
        }
      });

      state.dmNpcOptions = [...activeFirst, ...rest];
    } catch (e) {}
  }

  async function refreshDmRosterFromPlotAndWorldbook() {
    const btn = targetDoc.getElementById("twDmRefreshRosterBtn");
    if (btn) { btn.disabled = true; btn.textContent = "扫描剧情中…"; }
    try {
      scanChatForActiveDmNpcs();
      const { lastFullTurn, historyText } = getFullStoryContext();
      const prompt = `请扫描下方当前剧情与大景王朝设定，列出当前剧情中最适合与女主 ${state.userName} 单独私聊的 4~6 位关键或新登场人物（如果是后宫妃嫔，必须写为「真名（位分）」，如崔清漪（淑妃）、秦昭华（德妃）、苏枕月（丽嫔）等）。
近期剧情：
${historyText.slice(-800)}
${lastFullTurn}

请直接输出纯 JSON 数组：
[{"id":"人物名称（后妃写为真名（位分））","title":"宫殿或官职身份","personality":"该人物核心性格、说话口吻与对女主态度"}]`;

      const resp = await callAI(prompt, "扫描剧情可选私聊人物");
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) {
        const arr = JSON.parse(m[0]);
        arr.forEach(item => {
          if (!item || !item.id) return;
          const stdId = formatConsortStandardName(enforceAddressingRules(item.id));
          if (stdId === state.userName) return;
          const existing = state.dmNpcOptions.find(x => x.id === stdId || x.name === stdId);
          if (existing) {
            existing.inCurrentPlot = true;
          } else {
            state.dmNpcOptions.splice(1, 0, {
              id: stdId,
              name: stdId,
              display: `${stdId}（${enforceAddressingRules(item.title || "剧情人物")}）`,
              title: enforceAddressingRules(item.title || "剧情登场人物"),
              personality: enforceAddressingRules(item.personality || "贴合当前剧情人设"),
              inCurrentPlot: true,
              isDynamic: true
            });
          }
        });
        saveCurrentChatSessionData();
        renderDmSection();
        showModuleSuccessToast("已根据当前剧情与世界书更新可选人物");
      }
    } catch (e) {
      scanChatForActiveDmNpcs();
      renderDmSection();
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = "🔄 刷新可选人物"; }
    }
  }

  function renderDmNpcDropdown() {
    const sel = targetDoc.getElementById("twDmNpcSelect");
    if (!sel) return;
    sel.innerHTML = state.dmNpcOptions.map(n => {
      const badge = n.inCurrentPlot ? "【剧情登场】" : "";
      const label = n.display || `${n.name}（${n.title}）`;
      return `<option value="${n.id}" ${n.id === state.dmActiveNpc ? "selected" : ""}>${badge}${label}</option>`;
    }).join("");
  }

  function updateDmQuoteBar() {
    const bar = targetDoc.getElementById("twDmQuoteBar");
    const txt = targetDoc.getElementById("twDmQuoteText");
    const inp = targetDoc.getElementById("twDmInput");
    const npcName = state.dmActiveNpc || "萧承稷";
    if (!bar || !txt) return;
    if (state.dmQuoteTarget) {
      bar.classList.add("active");
      txt.innerHTML = `正在引用 <b>${state.dmQuoteTarget.sender}</b>：“${state.dmQuoteTarget.text}”`;
      if (inp) inp.placeholder = `引用回复 ${npcName}……`;
    } else {
      bar.classList.remove("active");
      txt.innerHTML = "";
      if (inp) inp.placeholder = `给 ${npcName} 发送私密消息……`;
    }
  }

  function renderDmSection() {
    renderDmNpcDropdown();
    const box = targetDoc.getElementById("twDmBox");
    if (!box) return;
    const npcId = state.dmActiveNpc || "萧承稷";
    const list = Array.isArray(state.dmHistories[npcId]) ? state.dmHistories[npcId] : [];

    if (!list.length) {
      box.innerHTML = `<div class="tw-empty-hint" style="margin:auto;">当前与【${npcId}】的对话框为空白。<br>你可以直接发消息，或点击上方「同步剧情开聊」让对方结合当前剧情主动找你说话。</div>`;
      updateDmQuoteBar();
      return;
    }

    box.innerHTML = list.map((m, idx) => {
      if (m.type === "system" || m.type === "join") {
        return `<div class="tw-chat-sys-tip">— ${enforceAddressingRules(m.text)} —</div>`;
      }
      const quoteHtml = m.quote
        ? `<div class="tw-chat-quoted-block">「${m.quote.sender}：${m.quote.text}」</div>`
        : "";
      const quoteBtnHtml = !m.self
        ? `<button type="button" class="tw-chat-quote-btn" data-dm-quote-idx="${idx}" title="引用该条消息">引用</button>`
        : "";
      return `
        <div class="tw-chat-msg ${m.self ? "self" : ""}">
          <div class="tw-chat-head-row">
            <span class="tw-chat-sender">${m.sender}</span>
            ${quoteBtnHtml}
          </div>
          <div class="tw-chat-bubble">${quoteHtml}<div>${m.text}</div></div>
        </div>`;
    }).join("");
    box.scrollTop = box.scrollHeight;
    updateDmQuoteBar();
  }

  async function handleDmUserSend(userMsg) {
    const npcId = state.dmActiveNpc || "萧承稷";
    const npcMeta = state.dmNpcOptions.find(x => x.id === npcId) || BASE_DM_NPC_CATALOG[0];
    const sendBtn = targetDoc.getElementById("twDmSendBtn");
    const quotedObj = state.dmQuoteTarget ? { ...state.dmQuoteTarget } : null;
    state.dmQuoteTarget = null;

    if (!Array.isArray(state.dmHistories[npcId])) state.dmHistories[npcId] = [];
    state.dmHistories[npcId].push({
      sender: state.userName,
      text: enforceAddressingRules(userMsg),
      quote: quotedObj,
      self: true
    });
    saveCurrentChatSessionData();
    renderDmSection();

    if (sendBtn) { sendBtn.disabled = true; sendBtn.textContent = "等待回复…"; }
    try {
      const memLimit = Math.max(4, Math.min(60, Number(config.chatMemoryCount) || 20));
      const historySlice = state.dmHistories[npcId].slice(-memLimit);
      const hist = historySlice.map(m => m.type ? `[${m.text}]` : `${m.sender}：${m.text}`).join("\n");
      const alreadySaidByNpc = historySlice.filter(m => !m.self && !m.type && m.text).slice(-6).map(m => `“${m.text}”`).join("、");
      const relCtx = getRelationshipAndFamiliarityContext();

      const prompt = `这里是 ${state.userName} 与【${npcMeta.name}（${npcMeta.title}）】的 1对1 私密对话。
【${npcMeta.name} 严格人设与自称特征】：${npcMeta.personality}
（若是萧承稷，必须自称“朕”或“我”，绝对禁止出现“孤”字！）
${relCtx}

【最近 ${historySlice.length} 条私聊上下文记忆】：
${hist}

【严禁复读与严禁失忆指令】：
1. 请仔细阅读上方聊天记忆，顺着话题往下自然推进，绝对不要重复此前已经说过的台词、句式或梗（此前已说过的话：${alreadySaidByNpc || "无"}）！
2. 刚刚 ${state.userName} 发来消息：“${userMsg}”${quotedObj ? `（引用了此前说的“${quotedObj.text}”）` : ""}。
3. 请让 ${npcMeta.name} 直接回复 1~3 条简短自然、贴合人设与当前剧情关系的私聊消息（每条10~45字，口吻鲜活，严禁写长篇公文）。

直接输出纯 JSON 数组：
[{"sender": "${npcMeta.name}", "text": "回复内容"}]`;

      const resp = await callAI(prompt, `单人私聊·${npcMeta.name}`);
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) {
        const arr = JSON.parse(m[0]);
        let lastReplyText = "";
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          if (!item || !item.text) continue;
          await new Promise(r => setTimeout(r, i === 0 ? 350 : 600));
          const cleanTxt = cleanPureText(item.text);
          lastReplyText = cleanTxt;
          state.dmHistories[npcId].push({
            sender: npcMeta.name,
            text: cleanTxt,
            quote: i === 0 && quotedObj ? { sender: state.userName, text: userMsg } : null,
            self: false
          });
          saveCurrentChatSessionData();
          renderDmSection();
        }
        if (lastReplyText) {
          showWechatNotification(`${npcMeta.name}（私聊）`, lastReplyText, { tab: "games", subgame: "dm", npc: npcMeta.id });
        }
      }
    } catch (e) {}
    finally {
      if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = "发送"; }
    }
  }

  async function syncDmWithCurrentStory() {
    const npcId = state.dmActiveNpc || "萧承稷";
    const npcMeta = state.dmNpcOptions.find(x => x.id === npcId) || BASE_DM_NPC_CATALOG[0];
    const btn = targetDoc.getElementById("twDmSyncStoryBtn");
    if (btn) { btn.disabled = true; btn.textContent = "同步中…"; }

    try {
      await syncFromWorldbookAndChat(false);
      const { lastFullTurn, lastSceneEnding } = getFullStoryContext();
      const relCtx = getRelationshipAndFamiliarityContext();
      const memLimit = Math.max(4, Math.min(60, Number(config.chatMemoryCount) || 20));
      const prevHist = (state.dmHistories[npcId] || []).slice(-memLimit).map(m => m.type ? `[${m.text}]` : `${m.sender}：${m.text}`).join("\n");

      const prompt = `请根据下方酒馆最新一轮剧情进展，让【${npcMeta.name}（${npcMeta.title}）】主动给 ${state.userName} 发来 2~3 条与当前剧情紧密相关的私聊消息！
【${npcMeta.name} 严格人设】：${npcMeta.personality}
（若是萧承稷，必自称“朕”或“我”，绝对禁止自称“孤”！）
最新剧情：
${lastFullTurn}
最新一幕：${lastSceneEnding}
${relCtx}
此前私聊记忆（切勿重复说过的话）：
${prevHist || "暂无"}

要求：直接切入当前剧情里的事、情绪或暗中叮嘱/试探，每条 12~45 字，口语自然。
直接输出纯 JSON 数组：
[{"sender": "${npcMeta.name}", "text": "主动发来的剧情相关消息"}]`;

      const resp = await callAI(prompt, `私聊同步剧情·${npcMeta.name}`);
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) {
        if (!Array.isArray(state.dmHistories[npcId])) state.dmHistories[npcId] = [];
        state.dmHistories[npcId].push({ type: "system", text: `已同步最新剧情 · ${npcMeta.name} 向你发来消息` });
        const arr = JSON.parse(m[0]);
        let lastTxt = "";
        for (const item of arr) {
          if (item && item.text) {
            await new Promise(r => setTimeout(r, 450));
            lastTxt = cleanPureText(item.text);
            state.dmHistories[npcId].push({
              sender: npcMeta.name,
              text: lastTxt,
              self: false
            });
            saveCurrentChatSessionData();
            renderDmSection();
          }
        }
        if (lastTxt) {
          showWechatNotification(`${npcMeta.name}（剧情传讯）`, lastTxt, { tab: "games", subgame: "dm", npc: npcMeta.id });
        }
      }
    } catch (e) {}
    finally {
      if (btn) { btn.disabled = false; btn.textContent = "同步剧情开聊"; }
    }
  }

  async function convertDmToOfflineSceneAndFill() {
    const npcId = state.dmActiveNpc || "萧承稷";
    const npcMeta = state.dmNpcOptions.find(x => x.id === npcId) || BASE_DM_NPC_CATALOG[0];
    const list = (state.dmHistories[npcId] || []).filter(m => !m.type && m.text);
    const btn = targetDoc.getElementById("twDmExportOfflineBtn");

    if (!list.length) {
      showModuleSuccessToast("当前私聊为空，请先聊几句再转化");
      return;
    }

    if (btn) { btn.disabled = true; btn.textContent = "正在转化线下场景…"; }
    try {
      const memLimit = Math.max(4, Math.min(60, Number(config.chatMemoryCount) || 20));
      const recentChat = list.slice(-memLimit).map(m => `${m.sender}：“${m.text}”`).join("\n");
      const { lastSceneEnding } = getFullStoryContext();

      const prompt = `请将下方 ${state.userName} 与【${npcMeta.name}】在私聊框中的对话内容，自然转化为一段符合大景王朝古代宫廷/长安背景的【线下当面交谈或宫人密信传话】第三人称剧情描写（约110~160字），以便直接填入酒馆主对话框继续推进正文！

【最高铁律】：
1. 绝对禁止出现“手机、线上、微信、私聊、屏幕、发消息、聊天室”等任何现代或出戏词汇！
2. 萧承稷必自称“朕”或“我”，绝对禁止自称“孤”！
3. 若当前两人同处一殿或顺路偶遇，请写成自然的线下当面交谈与神态互动；若隔着宫墙或身处宫外，请写成内侍暗中递来亲笔字条或廊下低声交谈。

当前正文最新场景：${lastSceneEnding || state.location}
刚才的私聊记录：
${recentChat}

请直接输出这段纯文本线下场景描写（不要加任何标题或解释）：`;

      const resp = await callAI(prompt, `私聊转线下剧情·${npcMeta.name}`);
      const sceneText = cleanPureText(resp);
      if (sceneText) {
        fillUserChatInput(sceneText);
        showModuleSuccessToast("已转化为线下剧情并填入酒馆输入框");
      }
    } catch (e) {}
    finally {
      if (btn) { btn.disabled = false; btn.textContent = "转化为线下剧情填入酒馆"; }
    }
  }

  const PRESET_MEMORIALS = [
    {
      author: "御史大夫 · 魏征", title: "《参定远侯世子霍惊弦于北苑飞龙厩私烤全羊疏》",
      content: "臣启陛下：今日卯时三刻，定远侯世子霍惊弦竟在皇家飞龙厩旁架起铁锅炭火，偷烤西域肥尾绵羊，香气飘进宣政殿，引得早朝百官频频咽口水！请罚霍惊弦抄《景律》百遍，并没收烤羊！",
      options: ["准奏。烤羊即刻没收，趁热呈送甘露殿御案。", "魏公想吃直说便是，赐魏御史烤羊腿一条。", "罚霍惊弦再烤十只分与北衙羽林卫，少一只罚俸半年。"]
    },
    {
      author: "端王 · 萧承泽", title: "《恳请皇兄免除臣弟本月弘文馆策论功课折》",
      content: "臣弟承泽叩首：臣弟新得的西域细犬“追风”正值换毛期，昨日路过吏部不小心放狗咬掉了卢尚书半截袍角，臣弟愿自罚去北苑替皇兄驯马一月，求免背书！",
      options: ["咬得好。赏追风肉骨两根，但策论照背，少一篇禁足一月。", "把西域细犬牵来内廷养两日，你的策论功课翻倍。", "准去北苑驯马，顺道每日牵狗去卢尚书府外溜两圈。"]
    }
  ];
  let curMemorialIdx = 0;

  function renderCurrentMemorial() {
    const m = PRESET_MEMORIALS[curMemorialIdx % PRESET_MEMORIALS.length];
    targetDoc.getElementById("twMemAuthor").textContent = `上奏臣工：${m.author}`;
    targetDoc.getElementById("twMemTitle").textContent = m.title;
    targetDoc.getElementById("twMemContent").textContent = m.content;
    targetDoc.getElementById("twMemorialQuickChips").innerHTML = (m.options || []).map(o => `<span class="tw-chip" data-zhupi="${o}">${o}</span>`).join("");
  }

  const BOARD_SIZE = 11;
  let gomokuBoard = [], gomokuOver = false, gomokuMoveCount = 0;
  const XIAO_LINES = {
    start: "“朕让你执黑先行，落子无悔，莫要耍赖。”",
    mid: [
      "“步子迈得太急，两翼空虚。兵法与棋道，皆忌贪功。”",
      "“这步尚可，倒比霍惊弦那臭棋篓子强上几分。”",
      "“想声东击西？在朕眼皮底下做局，你还嫩了些。”",
      "“盯着朕的脸看做什么？棋盘上可没写着破局之法。”"
    ],
    block: [
      "“暗度陈仓连成三子？可惜被朕看穿了，这条路封死了。”",
      "“趁朕饮茶时偷连四子？这路数倒是跟谢无咎学的精明，堵上。”"
    ],
    win: "“五子连珠，承让。愿赌服输，今夜留在甘露殿替朕研墨，不许逃。”",
    lose: "“方才北苑风大，吹迷了朕的眼。罢了，答应你的大盈内库奇珍照赏不误，再来一局。”"
  };

  function initGomoku() {
    gomokuBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
    gomokuOver = false; gomokuMoveCount = 0;
    targetDoc.getElementById("twGomokuQuote").textContent = XIAO_LINES.start;
    targetDoc.getElementById("twGomokuStatus").textContent = `当前回合：轮到 ${getUserFullTag()} 落黑子`;
    renderGomokuBoard();
  }

  function renderGomokuBoard() {
    let html = "";
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const v = gomokuBoard[r][c];
        html += `<div class="tw-gomoku-cell" data-r="${r}" data-c="${c}">${v === 1 ? '<div class="tw-stone black"></div>' : v === 2 ? '<div class="tw-stone white"></div>' : ""}</div>`;
      }
    }
    targetDoc.getElementById("twGomokuBoard").innerHTML = html;
  }

  function checkGomokuWin(r, c, color) {
    for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
      let cnt = 1;
      for (let s = 1; s < 5; s++) { const nr = r + dr * s, nc = c + dc * s; if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE || gomokuBoard[nr][nc] !== color) break; cnt++; }
      for (let s = 1; s < 5; s++) { const nr = r - dr * s, nc = c - dc * s; if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE || gomokuBoard[nr][nc] !== color) break; cnt++; }
      if (cnt >= 5) return true;
    }
    return false;
  }

  function evalPoint(r, c, color) {
    let total = 0;
    for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
      let cnt = 1, open = 0, s = 1;
      while (s < 5) { const nr = r + dr * s, nc = c + dc * s; if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) break; if (gomokuBoard[nr][nc] === color) cnt++; else { if (!gomokuBoard[nr][nc]) open++; break; } s++; }
      s = 1;
      while (s < 5) { const nr = r - dr * s, nc = c - dc * s; if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) break; if (gomokuBoard[nr][nc] === color) cnt++; else { if (!gomokuBoard[nr][nc]) open++; break; } s++; }
      if (cnt >= 5) total += 100000; else if (cnt === 4) total += open === 2 ? 15000 : 3500; else if (cnt === 3) total += open === 2 ? 1800 : 300; else if (cnt === 2 && open === 2) total += 120;
    }
    return total;
  }

  function xiaoMoveGomoku() {
    if (gomokuOver) return;
    gomokuMoveCount++;
    let best = -1, br = 5, bc = 5, blocked = false;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (gomokuBoard[r][c]) continue;
        const atk = evalPoint(r, c, 2), def = evalPoint(r, c, 1), sc = atk * 1.1 + def + (10 - Math.abs(r - 5) - Math.abs(c - 5));
        if (sc > best) { best = sc; br = r; bc = c; blocked = def >= 1800 && def > atk; }
      }
    }
    gomokuBoard[br][bc] = 2;
    renderGomokuBoard();
    if (checkGomokuWin(br, bc, 2)) {
      gomokuOver = true;
      targetDoc.getElementById("twGomokuQuote").textContent = XIAO_LINES.win;
      targetDoc.getElementById("twGomokuStatus").textContent = "对局结束：萧承稷获胜";
      return;
    }
    const pool = blocked ? XIAO_LINES.block : XIAO_LINES.mid;
    targetDoc.getElementById("twGomokuQuote").textContent = pool[Math.floor(Math.random() * pool.length)];
    targetDoc.getElementById("twGomokuStatus").textContent = `当前回合：轮到 ${getUserFullTag()} 落黑子`;
  }

  // ==================== 太微群聊（默认空白 + 换主题重置 + 记忆条数防复读 + 后妃真名（位分）） ====================
  function getGroupThemePromptBlock() {
    const uName = state.userName || detectCurrentUserName();
    const key = config.groupChatTheme || "story_sync";
    const preset = GROUP_CHAT_THEMES[key] || GROUP_CHAT_THEMES.story_sync;
    const customTxt = (config.groupChatCustomThemeText || "").trim();
    const desc = (key === "custom" && customTxt)
      ? `用户自定义群聊主题与世界观设定：【${customTxt}】`
      : preset.desc;
    const isIfMode = key === "user_empress_harem" || key.startsWith("if_") || (key === "custom" && customTxt);

    const consortFormatRule = `
【群聊角色命名与人设死命令】：
1. 后宫妃嫔发言时，sender 字段必须严格写为「真名（位分）」格式：崔清漪（淑妃）、秦昭华（德妃）、苏枕月（丽嫔）、卢婉兮（修仪）、柳如絮（婕妤）、郑芷兰（美人）、周妙音（才人）、韩怜儿（宝林）、沈青禾（选侍）！
2. 萧承稷发言时（非女皇反串主题下），必须自称“朕”或“我”，绝对禁止自称“孤”！${key === "user_empress_harem" ? `在当前【我是皇帝，其他人都是我后宫】主题下，${uName} 才是女皇陛下（自称朕），萧承稷、沈砚、陆敬、谢无咎、霍惊弦、温言酌、裴玄度、卫凛等全都是女皇陛下 ${uName} 的后宫侍君/皇夫，尊称 ${uName} 为“陛下”，争相吃醋求翻牌侍寝！` : ""}`;

    return {
      name: preset.name,
      isIfMode,
      block: `【当前太微群聊主题模式：${preset.name}】\n主题要求：${desc}\n${consortFormatRule}`
    };
  }

  function updateGroupThemeUI() {
    rootEl.querySelectorAll("#twGroupThemeChips .tw-chip").forEach(chip => {
      chip.classList.toggle("active", chip.dataset.gtheme === (config.groupChatTheme || "story_sync"));
    });
    const wrap = targetDoc.getElementById("twGroupCustomThemeWrap");
    const inp = targetDoc.getElementById("twGroupCustomThemeInput");
    if (wrap) wrap.style.display = config.groupChatTheme === "custom" ? "block" : "none";
    if (inp && targetDoc.activeElement !== inp) {
      inp.value = config.groupChatCustomThemeText || "";
    }
  }

  function updateChatQuoteBar() {
    const bar = targetDoc.getElementById("twChatQuoteBar");
    const txt = targetDoc.getElementById("twChatQuoteText");
    const inp = targetDoc.getElementById("twChatroomInput");
    if (!bar || !txt) return;
    if (state.chatQuoteTarget) {
      bar.classList.add("active");
      txt.innerHTML = `正在引用回复 <b>@${state.chatQuoteTarget.sender}</b>：“${state.chatQuoteTarget.text}”`;
      if (inp) inp.placeholder = `单独回复 @${state.chatQuoteTarget.sender}……`;
    } else {
      bar.classList.remove("active");
      txt.innerHTML = "";
      if (inp) inp.placeholder = "发句闲话聊聊……";
    }
  }

  function renderChatroom() {
    updateGroupThemeUI();
    const box = targetDoc.getElementById("twChatroomBox");
    if (!box) return;
    targetDoc.getElementById("twChatroomRoleBadge").textContent =
      config.groupChatTheme === "user_empress_harem" ? `女皇陛下·${state.userName}` : getUserFullTag();
    const list = Array.isArray(state.groupMessages) ? state.groupMessages : [];

    if (!list.length) {
      box.innerHTML = `<div class="tw-empty-hint" style="margin:auto;">当前群聊默认空白。<br>请选好上方主题后点击右上角「刷新群聊」，或在下方直接发送消息开启群聊！</div>`;
      updateChatQuoteBar();
      return;
    }

    box.innerHTML = list.map((m, idx) => {
      if (m.type === "join" || m.type === "system") {
        return `<div class="tw-chat-sys-tip">— ${enforceAddressingRules(m.text)} —</div>`;
      }
      const stdSender = formatConsortStandardName(m.sender);
      const quoteHtml = m.quote
        ? `<div class="tw-chat-quoted-block">「${formatConsortStandardName(m.quote.sender)}：${m.quote.text}」</div>`
        : "";
      const quoteBtnHtml = !m.self
        ? `<button type="button" class="tw-chat-quote-btn" data-chat-quote-idx="${idx}" title="单独引用回复TA">引用</button>`
        : "";
      return `
        <div class="tw-chat-msg ${m.self ? "self" : ""}">
          <div class="tw-chat-head-row">
            <span class="tw-chat-sender">${stdSender}</span>
            ${quoteBtnHtml}
          </div>
          <div class="tw-chat-bubble">${quoteHtml}<div>${m.text}</div></div>
        </div>`;
    }).join("");
    box.scrollTop = box.scrollHeight;
    updateChatQuoteBar();
  }

  async function appendChatMessagesWithDelay(msgList) {
    let lastSender = "", lastText = "";
    for (let i = 0; i < msgList.length; i++) {
      const r = msgList[i];
      if (!r) continue;
      const isSys = r.type === "join" || r.type === "system" || r.sender === "系统" || r.sender === "system";
      const waitMs = i === 0 ? 350 : (isSys ? 450 : (550 + Math.floor(Math.random() * 450)));
      await new Promise(res => setTimeout(res, waitMs));

      if (isSys) {
        const joinTxt = cleanPureText(r.text || `${r.sender || "某人"} 进入了聊天室`);
        if (joinTxt) {
          state.groupMessages.push({ type: "join", text: joinTxt });
          saveCurrentChatSessionData();
          renderChatroom();
        }
      } else if (r.sender && r.text) {
        lastSender = formatConsortStandardName(enforceAddressingRules(r.sender));
        lastText = cleanPureText(r.text);
        state.groupMessages.push({
          sender: lastSender,
          text: lastText,
          quote: r.quote && r.quote.sender ? { sender: formatConsortStandardName(enforceAddressingRules(r.quote.sender)), text: cleanPureText(r.quote.text) } : null,
          self: false
        });
        saveCurrentChatSessionData();
        renderChatroom();
      }
    }
    if (lastSender && lastText) {
      showWechatNotification(`太微群聊 · ${lastSender}`, lastText, { tab: "games", subgame: "chatroom" });
    }
  }

  function getEmptyHintText(modName) {
    if (state.isGlobalRefreshing) return "刷新中…";
    if (modName && isAutoModuleOn(modName)) {
      return "目前空白，若未自动刷新请点击手动刷新。";
    }
    return "目前空白，请点击手动刷新。";
  }

  function renderWorldLists() {
    const emptyWorldTxt = getEmptyHintText("world");
    targetDoc.getElementById("twPalaceWorldList").innerHTML = state.palaceDynamics.length
      ? state.palaceDynamics.map(x => `<div class="tw-row"><div><span class="tw-badge">${x.tag || "太微宫内"}</span><b>${enforceAddressingRules(x.npc)}</b></div><div>${enforceAddressingRules(x.event)}</div></div>`).join("")
      : `<div class="tw-empty-hint">${emptyWorldTxt}</div>`;
    targetDoc.getElementById("twOutsideWorldList").innerHTML = state.outsideDynamics.length
      ? state.outsideDynamics.map(x => `<div class="tw-row"><div><span class="tw-badge">${x.tag || "宫墙之外"}</span><b>${enforceAddressingRules(x.npc)}</b></div><div>${enforceAddressingRules(x.event)}</div></div>`).join("")
      : `<div class="tw-empty-hint">${emptyWorldTxt}</div>`;
  }

  function updateForumNicknameUI() {
    const nickInput = targetDoc.getElementById("twForumNickInput");
    const previewEl = targetDoc.getElementById("twCurrentForumAuthorPreview");
    if (nickInput && targetDoc.activeElement !== nickInput) {
      nickInput.value = config.forumNickname || "";
    }
    if (previewEl) {
      const author = getForumUserAuthor();
      const curStyleKey = config.forumSpeakStyle || "lively";
      const curStyleName = FORUM_STYLE_PRESETS[curStyleKey]?.name || "鲜活茶水间";
      previewEl.textContent = (isForumUsingAlias()
        ? `${author}（匿名马甲 · 严格防掉马）`
        : `${author}（默认空白 · 使用本名）`) + ` · 当前画风：【${curStyleName}】`;
    }

    rootEl.querySelectorAll("#twForumStyleChips .tw-chip").forEach(chip => {
      chip.classList.toggle("active", chip.dataset.fstyle === (config.forumSpeakStyle || "lively"));
    });
    const customWrap = targetDoc.getElementById("twForumCustomStyleWrap");
    const customInput = targetDoc.getElementById("twForumCustomStyleInput");
    if (customWrap) {
      customWrap.style.display = config.forumSpeakStyle === "custom" ? "block" : "none";
    }
    if (customInput && targetDoc.activeElement !== customInput) {
      customInput.value = config.forumCustomStyleText || "";
    }
  }

  function syncAutoSwitchSettingsUI() {
    const masterBtn = targetDoc.getElementById("twMasterAutoToggleBtn");
    const masterHint = targetDoc.getElementById("twAutoMasterStatusHint");
    if (masterBtn) {
      masterBtn.classList.toggle("on", !!config.autoMasterAll);
      masterBtn.textContent = config.autoMasterAll ? "已开启" : "已关闭";
    }
    if (masterHint) {
      masterHint.textContent = config.autoMasterAll ? "总控全开" : "自定义模式";
    }

    rootEl.querySelectorAll(".tw-sub-auto-btn").forEach(btn => {
      const mod = btn.dataset.mod;
      const row = btn.closest(".tw-sub-switch-row");
      if (config.autoMasterAll) {
        btn.disabled = true;
        btn.classList.add("disabled-gray");
        btn.classList.remove("on");
        btn.textContent = "跟随总控";
        if (row) row.classList.add("locked-row");
      } else {
        btn.disabled = false;
        btn.classList.remove("disabled-gray");
        const isOn = Boolean(config.autoModules && config.autoModules[mod]);
        btn.classList.toggle("on", isOn);
        btn.textContent = isOn ? "已开启" : "已关闭";
        if (row) row.classList.remove("locked-row");
      }
    });
  }

  function renderActions() {
    const planBox = targetDoc.getElementById("twStoryPlanList");
    if (!planBox) return;

    if (!state.storyPlans.length) {
      planBox.innerHTML = `<div class="tw-empty-hint">${getEmptyHintText("")}</div>`;
    } else {
      planBox.innerHTML = state.storyPlans.slice(0, 6).map((a, i) => `
        <div class="tw-act-card" data-plan-idx="${i}">
          <div class="tw-act-top">
            <span class="tw-act-title">${a.tag ? `<span class="tw-badge">${enforceAddressingRules(a.tag)}</span>` : ""}${i + 1}. ${enforceAddressingRules(a.title)}</span>
            <span class="tw-send-hint">点击导入对话框</span>
          </div>
          <div style="font-size:11.5px;line-height:1.55;">${enforceAddressingRules(a.desc)}</div>
        </div>`).join("");
    }
  }

  function renderAll() {
    state.userName = detectCurrentUserName();
    const aff = Number(state.affection) || 0;
    const statusEmptyTxt = getEmptyHintText("status");

    const sessionPill = targetDoc.getElementById("twSessionPill");
    if (sessionPill) {
      const shortKey = (state.currentSessionKey || "default").slice(-10);
      sessionPill.textContent = `当前独立存档 · ${shortKey}`;
    }

    targetDoc.getElementById("twAffVal").textContent = state.hasAffection ? state.affection : "--";
    targetDoc.getElementById("twAffStage").textContent = state.stage !== "未同步" ? state.stage : statusEmptyTxt;
    targetDoc.getElementById("twAffBar").style.width = `${state.hasAffection ? Math.max(0, Math.min(100, aff)) : 0}%`;
    targetDoc.getElementById("twUserIdentity").textContent = state.userIdentity !== "未同步" ? state.userIdentity : "目前空白";
    targetDoc.getElementById("twUserNameTxt").textContent = state.userName;
    targetDoc.getElementById("twTimeLoc").textContent = (state.time !== "未同步" || state.location !== "未同步") ? `${state.time} · ${state.location}` : statusEmptyTxt;
    targetDoc.getElementById("twMood").textContent = state.mood !== "未同步" ? state.mood : "待同步";

    targetDoc.getElementById("twEmpAct").textContent = state.clothes !== "未同步" || state.pose !== "未同步" ? `身着${state.clothes}，${state.pose}，位于${state.location}` : statusEmptyTxt;
    targetDoc.getElementById("twInnerThought").textContent = state.innerThought ? `“${enforceAddressingRules(state.innerThought)}”` : statusEmptyTxt;
    targetDoc.getElementById("twDiary").textContent = state.diary ? enforceAddressingRules(state.diary) : statusEmptyTxt;
    targetDoc.getElementById("twTodos").textContent = state.todo1 || state.todo2 ? `① ${enforceAddressingRules(state.todo1) || "无"}；② ${enforceAddressingRules(state.todo2) || "无"}` : statusEmptyTxt;

    const plotBox = targetDoc.getElementById("twPlotSummaryList");
    if (!state.plotSummary.length) {
      plotBox.innerHTML = `<div class="tw-empty-hint">${getEmptyHintText("plot")}</div>`;
    } else {
      plotBox.innerHTML = `<div class="tw-timeline">` + state.plotSummary.map((item, idx) => {
        const timeStr = enforceAddressingRules(item.time || state.time || "延昭二年");
        const locStr = enforceAddressingRules(item.location || state.location || "太微宫");
        const sumStr = ensureUserNameInSummary(item.summary || item.event || "");
        return `
          <div class="tw-tl-item">
            <div class="tw-tl-meta">
              <span class="tw-badge">第 ${idx + 1} 幕</span>
              <span class="tw-tl-time">时间：${timeStr}</span>
              <span class="tw-tl-loc">地点：${locStr}</span>
            </div>
            <div class="tw-tl-summary">${sumStr}</div>
          </div>`;
      }).join("") + `</div>`;
    }

    renderEmperorSpySection();
    renderWorldLists();
    targetDoc.getElementById("twTheaterResult").textContent = state.theaterText ? enforceAddressingRules(state.theaterText) : "目前空白，请点击生成小剧场。";
    updateForumNicknameUI();
    renderForum(targetDoc.getElementById("twSearch").value);
    renderActions();
    renderDmSection();
    renderChatroom();
    syncAutoSwitchSettingsUI();
    renderApiLogs();
  }

  function renderForum(kw = "") {
    const box = targetDoc.getElementById("twForumList");
    if (!state.posts.length) {
      box.innerHTML = `<div class="tw-box"><div class="tw-empty-hint">${getEmptyHintText("")}</div></div>`;
      return;
    }
    const key = kw.trim().toLowerCase();
    const list = state.posts.filter(p => `${p.author}${p.title}${p.content}`.toLowerCase().includes(key));
    const curAuthor = getForumUserAuthor();
    box.innerHTML = list.map((p, pIdx) => {
      const postAuthor = p.isSelfUser ? curAuthor : pickForumNick(p, pIdx);
      const targetNpc = state.replyTargets[p.id] || "";
      return `
        <div class="tw-box">
          <div class="tw-post-meta"><span>发帖：<b>${postAuthor}</b></span><span>${p.time || "刚刚"}</span></div>
          <div class="tw-post-tit">${enforceAddressingRules(p.title, true)}</div>
          <p class="tw-post-txt">${enforceAddressingRules(p.content, true)}</p>
          <div class="tw-post-foot">
            <div>${(p.tags || []).map(t => `<span class="tw-badge">${enforceAddressingRules(t, true)}</span>`).join("")}</div>
            <div><button type="button" class="tw-act-btn ${p.liked ? "liked" : ""}" data-act="like" data-id="${p.id}">赞 ${p.likes}</button><span>评论 ${p.comments.length}</span></div>
          </div>
          <div class="tw-cmt-box">
            ${p.comments.map((c, cIdx) => {
              const cNick = c.isSelfUser ? curAuthor : pickForumNick(c, pIdx * 5 + cIdx + 1);
              const cText = pickForumText(c);
              return `<div class="tw-cmt-line"><div><span class="tw-cmt-u">${cNick}：</span><span>${cText}</span></div><button type="button" class="tw-reply-npc-btn" data-act="set-target" data-id="${p.id}" data-npc="${cNick}">回复TA</button></div>`;
            }).join("")}
            <div class="tw-reply-target-bar ${targetNpc ? "active" : ""}">
              <span>正在单独回复：<b>@${targetNpc}</b></span>
              <button type="button" class="tw-act-btn" data-act="clear-target" data-id="${p.id}" style="color:var(--accent);font-weight:bold;">取消点名</button>
            </div>
            <div class="tw-cmt-send">
              <input id="tw-cin-${p.id}" placeholder="${targetNpc ? `以 ${curAuthor} 回复 @${targetNpc}…` : `以 ${curAuthor} 直接评论主帖…`}">
              <button type="button" data-act="reply" data-id="${p.id}">${targetNpc ? "回复TA" : "直接回复"}</button>
            </div>
          </div>
        </div>`;
    }).join("");
  }

  // ==================== 交互事件绑定 ====================
  const fab = targetDoc.getElementById("twFabBall"), overlay = targetDoc.getElementById("twModalOverlay"), navBar = targetDoc.getElementById("twNavBar");
  let dragging = false, moved = false, startY = 0, startTop = 0;
  fab.addEventListener("pointerdown", (e) => {
    dragging = true;
    moved = false;
    startY = e.clientY;
    startTop = fab.getBoundingClientRect().top;
    fab.setPointerCapture(e.pointerId);
  });
  fab.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dy = e.clientY - startY;
    if (Math.abs(dy) > 4) moved = true;
    if (moved) {
      fab.style.transform = "none";
      fab.style.top = `${Math.max(20, Math.min(targetWin.innerHeight - 75, startTop + dy))}px`;
    }
  });
  fab.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;
    fab.releasePointerCapture(e.pointerId);
    if (!moved) {
      overlay.classList.toggle("tw-hidden");
      if (!overlay.classList.contains("tw-hidden")) {
        clearFabGlowReminder();
        syncFromWorldbookAndChat(false);
      }
    }
  });

  let navDrag = false, navMoved = false, navX = 0, navLeft = 0;
  navBar.addEventListener("pointerdown", (e) => { navDrag = true; navMoved = false; navX = e.clientX; navLeft = navBar.scrollLeft; });
  navBar.addEventListener("pointermove", (e) => { if (navDrag && Math.abs(e.clientX - navX) > 4) { navMoved = true; navBar.scrollLeft = navLeft - (e.clientX - navX); } });
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev => navBar.addEventListener(ev, () => { navDrag = false; }));

  targetDoc.getElementById("twBtnClose").addEventListener("click", () => overlay.classList.add("tw-hidden"));
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.add("tw-hidden"); });
  targetDoc.getElementById("twBtnClearAll").addEventListener("click", () => {
    resetStateToBlankForNewChat(state.currentSessionKey || detectCurrentChatSessionKey());
    saveCurrentChatSessionData();
    renderAll();
    showModuleSuccessToast("已清空当前存档数据");
  });

  targetDoc.getElementById("twSaveForumNickBtn").addEventListener("click", () => {
    const val = targetDoc.getElementById("twForumNickInput").value.trim();
    config.forumNickname = val;
    saveConfig();
    updateForumNicknameUI();
    renderForum(targetDoc.getElementById("twSearch").value);
    showModuleSuccessToast(val ? `已启用论坛马甲：${val}` : "已恢复默认空白（使用本名）");
  });
  targetDoc.getElementById("twResetForumNickBtn").addEventListener("click", () => {
    config.forumNickname = "";
    targetDoc.getElementById("twForumNickInput").value = "";
    saveConfig();
    updateForumNicknameUI();
    renderForum(targetDoc.getElementById("twSearch").value);
    showModuleSuccessToast("已清空论坛昵称（使用本名）");
  });
  targetDoc.getElementById("twForumNickInput").addEventListener("input", (e) => {
    config.forumNickname = e.target.value.trim();
    saveConfig();
    updateForumNicknameUI();
  });

  targetDoc.getElementById("twForumStyleChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".tw-chip[data-fstyle]");
    if (!chip) return;
    config.forumSpeakStyle = chip.dataset.fstyle || "lively";
    saveConfig();
    updateForumNicknameUI();
  });

  targetDoc.getElementById("twForumCustomStyleInput").addEventListener("input", (e) => {
    config.forumCustomStyleText = e.target.value.trim();
    saveConfig();
  });

  // 群聊主题切换：每次切换主题直接重置群聊并刷新新主题对话
  targetDoc.getElementById("twGroupThemeChips")?.addEventListener("click", (e) => {
    const chip = e.target.closest(".tw-chip[data-gtheme]");
    if (!chip) return;
    const newTheme = chip.dataset.gtheme || "story_sync";
    const changed = config.groupChatTheme !== newTheme;
    config.groupChatTheme = newTheme;
    saveConfig();
    updateGroupThemeUI();
    if (changed) {
      state.groupMessages = [];
      state.chatQuoteTarget = null;
      saveCurrentChatSessionData();
      renderChatroom();
    }
  });
  targetDoc.getElementById("twGroupCustomThemeInput")?.addEventListener("input", (e) => {
    config.groupChatCustomThemeText = e.target.value.trim();
    saveConfig();
  });

  // 单人私聊事件绑定
  targetDoc.getElementById("twDmNpcSelect")?.addEventListener("change", (e) => {
    state.dmActiveNpc = e.target.value || "萧承稷";
    state.dmQuoteTarget = null;
    saveCurrentChatSessionData();
    renderDmSection();
  });
  targetDoc.getElementById("twDmRefreshRosterBtn")?.addEventListener("click", refreshDmRosterFromPlotAndWorldbook);
  targetDoc.getElementById("twDmBox")?.addEventListener("click", (e) => {
    const qBtn = e.target.closest("button[data-dm-quote-idx]");
    if (!qBtn) return;
    const npcId = state.dmActiveNpc || "萧承稷";
    const list = state.dmHistories[npcId] || [];
    const targetMsg = list[Number(qBtn.dataset.dmQuoteIdx)];
    if (targetMsg && !targetMsg.type) {
      state.dmQuoteTarget = { sender: targetMsg.sender, text: targetMsg.text };
      updateDmQuoteBar();
      targetDoc.getElementById("twDmInput")?.focus();
    }
  });
  targetDoc.getElementById("twCancelDmQuoteBtn")?.addEventListener("click", () => {
    state.dmQuoteTarget = null;
    updateDmQuoteBar();
  });
  targetDoc.getElementById("twDmSendBtn")?.addEventListener("click", () => {
    const inp = targetDoc.getElementById("twDmInput"), v = inp ? inp.value.trim() : "";
    if (!v) return;
    inp.value = "";
    handleDmUserSend(v);
  });
  targetDoc.getElementById("twDmInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); targetDoc.getElementById("twDmSendBtn")?.click(); }
  });
  targetDoc.getElementById("twDmSyncStoryBtn")?.addEventListener("click", syncDmWithCurrentStory);
  targetDoc.getElementById("twDmExportOfflineBtn")?.addEventListener("click", convertDmToOfflineSceneAndFill);
  targetDoc.getElementById("twDmClearBtn")?.addEventListener("click", () => {
    const npcId = state.dmActiveNpc || "萧承稷";
    state.dmHistories[npcId] = [];
    state.dmQuoteTarget = null;
    saveCurrentChatSessionData();
    renderDmSection();
    showModuleSuccessToast(`已清空与 ${npcId} 的私聊记录`);
  });

  targetDoc.getElementById("twMasterAutoToggleBtn").addEventListener("click", () => {
    config.autoMasterAll = !config.autoMasterAll;
    saveConfig();
    syncAutoSwitchSettingsUI();
    renderAll();
  });

  targetDoc.getElementById("twSubAutoSwitchList").addEventListener("click", (e) => {
    const btn = e.target.closest(".tw-sub-auto-btn");
    if (!btn || config.autoMasterAll) return;
    const mod = btn.dataset.mod;
    if (!mod) return;
    config.autoModules[mod] = !config.autoModules[mod];
    saveConfig();
    syncAutoSwitchSettingsUI();
    renderAll();
  });

  targetDoc.getElementById("twSavePlotPromptBtn").addEventListener("click", () => {
    const memVal = Math.max(4, Math.min(60, Number(targetDoc.getElementById("twChatMemoryCountInput")?.value) || 20));
    const wVal = Math.max(15, Math.min(300, Number(targetDoc.getElementById("twPlotWordLimitInput").value) || DEFAULT_PLOT_WORD_LIMIT));
    const pVal = targetDoc.getElementById("twPlotCustomPromptInput").value.trim() || DEFAULT_PLOT_CUSTOM_PROMPT;
    config.chatMemoryCount = memVal;
    config.plotWordLimit = wVal;
    config.plotCustomPrompt = pVal;
    saveConfig();
    syncSettingsUI();
    showModuleSuccessToast(`已保存设置（聊天记忆${memVal}条 · 摘要${wVal}字内）`);
  });

  targetDoc.getElementById("twResetPlotPromptBtn").addEventListener("click", () => {
    config.chatMemoryCount = 20;
    config.plotWordLimit = DEFAULT_PLOT_WORD_LIMIT;
    config.plotCustomPrompt = DEFAULT_PLOT_CUSTOM_PROMPT;
    saveConfig();
    syncSettingsUI();
    showModuleSuccessToast("已恢复默认记忆条数与摘要设置");
  });

  function renderSavedApiPresetsDropdown() {
    const sel = targetDoc.getElementById("twSavedApiPresetSelect");
    if (!sel) return;
    const optionsHtml = `<option value="">-- 新建 / 手动输入自定义 API --</option>` +
      (config.savedApiPresets || []).map(p => `<option value="${p.id}" ${p.id === config.activePresetId ? "selected" : ""}>${p.name} · ${p.model || "默认模型"}</option>`).join("");
    sel.innerHTML = optionsHtml;
  }

  function syncSettingsUI() {
    rootEl.setAttribute("data-theme", config.theme || "xuanpaper");
    rootEl.querySelectorAll(".tw-theme-btn").forEach(b => b.classList.toggle("active", b.dataset.themeVal === config.theme));

    const isCustom = config.apiMode === "custom";
    targetDoc.getElementById("twModeCardTavern")?.classList.toggle("active", !isCustom);
    targetDoc.getElementById("twModeCardCustom")?.classList.toggle("active", isCustom);
    targetDoc.getElementById("twCustomApiFields").style.display = isCustom ? "block" : "none";

    const badge = targetDoc.getElementById("twCurrentApiBadge");
    if (badge) {
      badge.textContent = isCustom
        ? `其他 API：${config.apiName || config.apiModel || "自定义"}`
        : "当前：酒馆主 API";
    }

    const plotBadge = targetDoc.getElementById("twPlotPromptBadge");
    if (plotBadge) {
      plotBadge.textContent = `记忆${config.chatMemoryCount || 20}条 · 摘要${config.plotWordLimit || DEFAULT_PLOT_WORD_LIMIT}字`;
    }
    const memInput = targetDoc.getElementById("twChatMemoryCountInput");
    if (memInput) memInput.value = config.chatMemoryCount || 20;
    const wordInput = targetDoc.getElementById("twPlotWordLimitInput");
    if (wordInput) wordInput.value = config.plotWordLimit || DEFAULT_PLOT_WORD_LIMIT;
    const promptInput = targetDoc.getElementById("twPlotCustomPromptInput");
    if (promptInput) promptInput.value = config.plotCustomPrompt || DEFAULT_PLOT_CUSTOM_PROMPT;

    renderSavedApiPresetsDropdown();
    targetDoc.getElementById("twApiNameInput").value = config.apiName || "";
    targetDoc.getElementById("twApiUrlInput").value = config.apiUrl || "";
    targetDoc.getElementById("twApiKeyInput").value = config.apiKey || "";
    targetDoc.getElementById("twApiModelInput").value = config.apiModel || "";
    syncAutoSwitchSettingsUI();
    updateForumNicknameUI();
    updateGroupThemeUI();
    renderApiLogs();
  }
  syncSettingsUI();

  rootEl.querySelectorAll(".tw-theme-btn").forEach(btn => btn.addEventListener("click", () => { config.theme = btn.dataset.themeVal; saveConfig(); syncSettingsUI(); }));

  [targetDoc.getElementById("twModeCardTavern"), targetDoc.getElementById("twModeCardCustom")].forEach(card => {
    if (!card) return;
    card.addEventListener("click", () => {
      config.apiMode = card.dataset.apiMode;
      saveConfig();
      syncSettingsUI();
    });
  });

  targetDoc.getElementById("twSavedApiPresetSelect").addEventListener("change", (e) => {
    const pid = e.target.value;
    config.activePresetId = pid;
    if (!pid) {
      targetDoc.getElementById("twApiNameInput").value = "";
      return;
    }
    const found = (config.savedApiPresets || []).find(p => p.id === pid);
    if (found) {
      config.apiName = found.name;
      config.apiUrl = found.url;
      config.apiKey = found.key;
      config.apiModel = found.model;
      saveConfig();
      syncSettingsUI();
    }
  });

  targetDoc.getElementById("twDeleteApiPresetBtn").addEventListener("click", () => {
    const sel = targetDoc.getElementById("twSavedApiPresetSelect");
    const pid = sel?.value;
    const tip = targetDoc.getElementById("twApiTestResult");
    if (!pid) {
      tip.classList.add("show");
      tip.textContent = "请先在下拉框中选择一个已保存的配置再删除。";
      setTimeout(() => tip.classList.remove("show"), 1800);
      return;
    }
    config.savedApiPresets = (config.savedApiPresets || []).filter(p => p.id !== pid);
    config.activePresetId = "";
    config.apiName = "";
    saveConfig();
    syncSettingsUI();
    tip.classList.add("show");
    tip.textContent = "已删除该自定义 API 配置！";
    setTimeout(() => tip.classList.remove("show"), 1800);
  });

  targetDoc.getElementById("twFetchModelsBtn").addEventListener("click", async () => {
    const rawUrl = targetDoc.getElementById("twApiUrlInput").value.trim(), key = targetDoc.getElementById("twApiKeyInput").value.trim();
    const tip = targetDoc.getElementById("twApiTestResult"); tip.classList.add("show");
    if (!rawUrl || !key) { tip.textContent = "请先填写 API 地址与 Key"; return; }
    const startTime = Date.now();
    try {
      const base = normalizeBaseUrl(rawUrl);
      const res = await fetch(base.endsWith("/v1") ? `${base}/models` : `${base}/v1/models`, { headers: { "Authorization": `Bearer ${key}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const models = (data.data || data.models || []).map(x => typeof x === "string" ? x : x.id || x.name).filter(Boolean);
      if (models.length) {
        config.fetchedModels = models; config.apiModel = models[0];
        targetDoc.getElementById("twApiModelInput").value = models[0];
        const wrap = targetDoc.getElementById("twModelSelectWrap"), sel = targetDoc.getElementById("twModelSelectDropdown");
        wrap.style.display = "block"; sel.innerHTML = models.map(m => `<option value="${m}">${m}</option>`).join("");
        saveConfig();
        tip.textContent = `成功拉取 ${models.length} 个模型！`;
        addApiLog({ source: "拉取模型列表", mode: "自定义 API", status: "success", duration: Date.now() - startTime, detail: `成功获取 ${models.length} 个模型` });
      }
    } catch (e) {
      tip.textContent = `拉取失败：${e.message}`;
      addApiLog({ source: "拉取模型列表", mode: "自定义 API", status: "error", duration: Date.now() - startTime, detail: `拉取失败：${e.message}` });
      showApiErrorBanner("拉取模型列表", e.message);
    }
  });

  targetDoc.getElementById("twModelSelectDropdown").addEventListener("change", (e) => {
    if (e.target.value) { targetDoc.getElementById("twApiModelInput").value = e.target.value; config.apiModel = e.target.value; saveConfig(); }
  });

  targetDoc.getElementById("twTestApiBtn").addEventListener("click", async () => {
    if (config.apiMode === "custom") {
      config.apiName = targetDoc.getElementById("twApiNameInput").value.trim();
      config.apiUrl = targetDoc.getElementById("twApiUrlInput").value.trim();
      config.apiKey = targetDoc.getElementById("twApiKeyInput").value.trim();
      config.apiModel = targetDoc.getElementById("twApiModelInput").value.trim();
      saveConfig();
    }
    const tip = targetDoc.getElementById("twApiTestResult"); tip.classList.add("show"); tip.textContent = "刷新中…";
    try {
      const r = await callAI("请用一句话以大景内侍口吻向陛下请安，自称奴婢。", "API连接测试");
      tip.textContent = `连接成功：“${cleanPureText(r).slice(0, 35)}”`;
    } catch (e) { tip.textContent = `连接失败：${e.message}`; }
  });

  targetDoc.getElementById("twSaveConfigBtn").addEventListener("click", () => {
    const tip = targetDoc.getElementById("twApiTestResult");
    tip.classList.add("show");

    const memVal = Math.max(4, Math.min(60, Number(targetDoc.getElementById("twChatMemoryCountInput")?.value) || 20));
    const wVal = Math.max(15, Math.min(300, Number(targetDoc.getElementById("twPlotWordLimitInput").value) || DEFAULT_PLOT_WORD_LIMIT));
    const pVal = targetDoc.getElementById("twPlotCustomPromptInput").value.trim() || DEFAULT_PLOT_CUSTOM_PROMPT;
    config.chatMemoryCount = memVal;
    config.plotWordLimit = wVal;
    config.plotCustomPrompt = pVal;

    if (config.apiMode === "custom") {
      const rawName = targetDoc.getElementById("twApiNameInput").value.trim();
      const urlVal = targetDoc.getElementById("twApiUrlInput").value.trim();
      const keyVal = targetDoc.getElementById("twApiKeyInput").value.trim();
      const modelVal = targetDoc.getElementById("twApiModelInput").value.trim() || "gpt-4o-mini";

      const defaultIdx = (config.savedApiPresets?.length || 0) + 1;
      const finalName = rawName || `自定义API-${defaultIdx}·${modelVal}`;

      config.apiName = finalName;
      config.apiUrl = urlVal;
      config.apiKey = keyVal;
      config.apiModel = modelVal;

      if (urlVal && keyVal) {
        const existingIdx = (config.savedApiPresets || []).findIndex(p => p.id === config.activePresetId || p.name === finalName);
        if (existingIdx >= 0) {
          config.savedApiPresets[existingIdx] = {
            id: config.savedApiPresets[existingIdx].id,
            name: finalName,
            url: urlVal,
            key: keyVal,
            model: modelVal
          };
          config.activePresetId = config.savedApiPresets[existingIdx].id;
        } else {
          const newId = "preset_" + Date.now();
          config.savedApiPresets.push({
            id: newId,
            name: finalName,
            url: urlVal,
            key: keyVal,
            model: modelVal
          });
          config.activePresetId = newId;
        }
      }
      saveConfig();
      syncSettingsUI();
      tip.textContent = `已保存并启用其他 API 配置：「${finalName}」！`;
    } else {
      saveConfig();
      syncSettingsUI();
      tip.textContent = "已保存并启用酒馆主 API！";
    }
    setTimeout(() => tip.classList.remove("show"), 2200);
  });

  targetDoc.getElementById("twBtnApiSync").addEventListener("click", syncAllWithAI);
  targetDoc.getElementById("twRefreshStatusOnlyBtn").addEventListener("click", refreshStatusOnly);
  targetDoc.getElementById("twRefreshEmperorSpyBtn")?.addEventListener("click", refreshEmperorSpyOnly);
  targetDoc.getElementById("twAppendLatestPlotBtn").addEventListener("click", () => autoGenerateCorePlotData(false, { doStatus: false, doPlot: true }));
  targetDoc.getElementById("twRebuildFullPlotBtn").addEventListener("click", () => rebuildFullLongTimeline(false));
  targetDoc.getElementById("twRefreshActionsBtn").addEventListener("click", generateStoryPlansOnly);
  targetDoc.getElementById("twRefreshWorldBtn").addEventListener("click", (e) => refreshWorldOnly(e, false));
  targetDoc.getElementById("twRefreshForumBtn").addEventListener("click", (e) => refreshForumOnly(e, false));

  rootEl.querySelectorAll("#twStoryPlanChips .tw-chip").forEach(c => c.addEventListener("click", () => {
    targetDoc.getElementById("twStoryCustomIdea").value = c.dataset.idea || "";
  }));

  rootEl.querySelectorAll(".tw-nav button").forEach(btn => btn.addEventListener("click", () => {
    if (navMoved) return;
    rootEl.querySelectorAll(".tw-nav button").forEach(b => b.classList.remove("active"));
    rootEl.querySelectorAll(".tw-tab-page").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    targetDoc.getElementById(`tw-page-${btn.dataset.tab}`).classList.add("active");
    btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }));

  rootEl.querySelectorAll(".tw-game-tab-btn").forEach(btn => btn.addEventListener("click", () => {
    rootEl.querySelectorAll(".tw-game-tab-btn").forEach(b => b.classList.remove("active"));
    rootEl.querySelectorAll(".tw-subgame-pane").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    targetDoc.getElementById(`tw-game-${btn.dataset.game}`).classList.add("active");
  }));

  renderCurrentMemorial();
  targetDoc.getElementById("twNextMemorialBtn").addEventListener("click", () => { curMemorialIdx = (curMemorialIdx + 1) % PRESET_MEMORIALS.length; renderCurrentMemorial(); });
  targetDoc.getElementById("twAiMemorialBtn").addEventListener("click", async () => {
    const btn = targetDoc.getElementById("twAiMemorialBtn"); btn.disabled = true; btn.textContent = "刷新中…";
    try {
      const resp = await callAI(`生成一封大景朝堂趣味奏折，并提供3条不含任何名字的朱批选项。纯JSON：{"author":"官职·姓名","title":"《标题》","content":"正文70字内","options":["朱批1。","朱批2！","朱批3。"]}`, "生成趣味奏折");
      const m = String(resp).match(/{[\s\S]*}/);
      if (m) {
        PRESET_MEMORIALS.unshift(JSON.parse(m[0]));
        curMemorialIdx = 0;
        renderCurrentMemorial();
        showModuleSuccessToast("新奏折已呈递御案");
      }
    } catch (e) {}
    btn.disabled = false; btn.textContent = "AI生成新折子";
  });
  targetDoc.getElementById("twMemorialQuickChips").addEventListener("click", (e) => {
    const c = e.target.closest(".tw-chip"); if (c) targetDoc.getElementById("twMemorialCustomInput").value = c.dataset.zhupi;
  });
  targetDoc.getElementById("twSubmitMemorialBtn").addEventListener("click", async () => {
    const val = targetDoc.getElementById("twMemorialCustomInput").value.trim(); if (!val) return;
    const btn = targetDoc.getElementById("twSubmitMemorialBtn");
    const box = targetDoc.getElementById("twMemorialReaction"), m = PRESET_MEMORIALS[curMemorialIdx % PRESET_MEMORIALS.length];
    btn.disabled = true; btn.textContent = "刷新中…";
    box.textContent = "刷新中…";
    try {
      const resp = await callAI(`甘露殿内，${getUserFullTag()} 在 ${m.author} 呈递的奏折 ${m.title} 上提笔写下朱批：“${val}”。请写一段 120 字左右萧承稷看到这行朱批后的反应、神态动作，以及他亲手在旁边添上的一句朱批与对 ${state.userName} 说的话（萧承稷必自称“朕”，严禁自称“孤”）。`, "奏折朱批点评");
      box.textContent = cleanPureText(resp);
      showModuleSuccessToast("圣人已批阅你的朱批");
    } catch (e) {
      box.textContent = `萧承稷垂眸扫过奏折尾端那行朱砂小字，修长手指停在墨玉扳指上，足足沉默了三息。他提笔在旁边添了一道朱批：“准，依此钦行。”随后随手将折子合上丢入准奏铜匣，冷淡开口道：“既已盖了朕的宝印，便按批的办。若是明日门下省闹起来，朕替你兜着。”`;
    } finally {
      btn.disabled = false; btn.textContent = "朱批用印";
    }
  });

  initGomoku();
  targetDoc.getElementById("twRestartGomokuBtn").addEventListener("click", initGomoku);
  targetDoc.getElementById("twGomokuBoard").addEventListener("click", (e) => {
    if (gomokuOver) return;
    const cell = e.target.closest(".tw-gomoku-cell"); if (!cell) return;
    const r = Number(cell.dataset.r), c = Number(cell.dataset.c);
    if (gomokuBoard[r][c]) return;
    gomokuBoard[r][c] = 1; renderGomokuBoard();
    if (checkGomokuWin(r, c, 1)) {
      gomokuOver = true;
      targetDoc.getElementById("twGomokuQuote").textContent = XIAO_LINES.lose;
      targetDoc.getElementById("twGomokuStatus").textContent = `对局结束：${getUserFullTag()} 获胜！`;
      return;
    }
    setTimeout(xiaoMoveGomoku, 200);
  });

  // 太微群聊交互
  targetDoc.getElementById("twChatroomBox").addEventListener("click", (e) => {
    const qBtn = e.target.closest("button[data-chat-quote-idx]");
    if (!qBtn) return;
    const idx = Number(qBtn.dataset.chatQuoteIdx);
    const targetMsg = state.groupMessages[idx];
    if (targetMsg && !targetMsg.type) {
      state.chatQuoteTarget = { sender: targetMsg.sender, text: targetMsg.text };
      updateChatQuoteBar();
      targetDoc.getElementById("twChatroomInput")?.focus();
    }
  });

  targetDoc.getElementById("twCancelChatQuoteBtn").addEventListener("click", () => {
    state.chatQuoteTarget = null;
    updateChatQuoteBar();
  });

  async function handleUserSendChat(userMsg) {
    const sendBtn = targetDoc.getElementById("twChatroomSendBtn"), sender = state.userName;
    const quotedObj = state.chatQuoteTarget ? { ...state.chatQuoteTarget } : null;
    state.chatQuoteTarget = null;

    state.groupMessages.push({
      sender,
      text: enforceAddressingRules(userMsg),
      quote: quotedObj,
      self: true
    });
    saveCurrentChatSessionData();
    renderChatroom();

    sendBtn.disabled = true; sendBtn.textContent = "刷新中…";
    try {
      const msgCount = quotedObj
        ? (Math.floor(Math.random() * 3) + 5)
        : (Math.floor(Math.random() * 4) + 6);
      const memLimit = Math.max(4, Math.min(60, Number(config.chatMemoryCount) || 20));
      const historySlice = state.groupMessages.slice(-memLimit);
      const hist = historySlice.map(m => {
        if (m.type === "join" || m.type === "system") return `[系统提示：${m.text}]`;
        return `${m.sender}：${m.text}`;
      }).join("\n");
      const alreadySaidList = historySlice.filter(m => !m.self && !m.type && m.text).slice(-8).map(m => `“${m.text}”`).join("、");
      const relCtx = getRelationshipAndFamiliarityContext();
      const themeInfo = getGroupThemePromptBlock();

      const quoteRule = quotedObj
        ? `刚刚 ${sender} 专门单独引用了「${quotedObj.sender}」说的“${quotedObj.text}”，并回复道：“${userMsg}”。
1. 第 1 条消息必须由被单独引用的「${quotedObj.sender}」本人直接回应 ${sender}，并带上 quote 字段：{"sender":"${quotedObj.sender}","text":"回应内容","quote":{"sender":"${sender}","text":"${userMsg}"}}。
2. 紧接着，群里其他 3~5 位不同性格的 NPC 也纷纷出来围观起哄、插话或斗嘴，并且在中途穿插 1~2 条某位新NPC进入了聊天室的系统提示，随后这位刚进群的NPC立刻接话！`
        : `刚刚 ${sender} 在群里发了消息：“${userMsg}”。
请模拟热闹的太微宫群聊，让 4~6 位不同性格的 NPC 围绕这句话与当前群聊主题热聊起来，从萧承稷、霍惊弦、陆敬、沈砚、谢无咎、温言酌、端王萧承泽、裴玄度、苏枕月（丽嫔）、秦昭华（德妃）、崔清漪（淑妃）、卢婉兮（修仪）、柳如絮（婕妤）、赵怀安、洛青衣中挑选多层人物参与！`;

      const prompt = `《太微宫茶话群聊》最近 ${historySlice.length} 条记忆上下文：\n${hist}\n\n${themeInfo.block}\n\n${quoteRule}\n\n${themeInfo.isIfMode ? "" : relCtx}\n
【严禁复读与多人热闹群聊铁律】：
1. 严禁重复上方已经聊过的话或梗（已说过的话：${alreadySaidList || "无"}），必须顺着最新话题往前推进！
2. 后宫妃嫔 sender 必须写为「真名（位分）」，如苏枕月（丽嫔）、秦昭华（德妃）、崔清漪（淑妃）、柳如絮（婕妤）。
3. 萧承稷必自称“朕”或“我”，绝对禁止自称“孤”！
4. 本次总共输出 ${msgCount} 项 JSON 数组，在聊天中途自然穿插 1~2 条新角色刚进聊天室的系统提示：{"type": "join", "text": "角色名带动作进入了聊天室"}，并在下一条立刻让这位刚进群的角色发言插话！
5. 普通发言格式为：{"sender": "姓名（后妃带位分）", "text": "简短口语化消息6至24字"}。
直接输出纯 JSON 数组：`;
      const resp = await callAI(prompt, "太微群聊回复");
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) {
        await appendChatMessagesWithDelay(JSON.parse(m[0]));
      }
    } catch (e) {}
    finally { sendBtn.disabled = false; sendBtn.textContent = "发送"; }
  }

  // 点击「刷新群聊」直接重置当前群聊记录，开启全新一轮主题群聊
  async function triggerAiNpcRandomTopic() {
    const topicBtn = targetDoc.getElementById("twRandomChatTopicBtn");
    topicBtn.disabled = true; topicBtn.textContent = "刷新中…";
    try {
      const msgCount = Math.floor(Math.random() * 4) + 7;
      const relCtx = getRelationshipAndFamiliarityContext();
      const themeInfo = getGroupThemePromptBlock();

      // 每次点击刷新群聊直接重置，不接在旧主题下面
      state.groupMessages = [
        { type: "system", text: `当前群聊主题：【${themeInfo.name}】` }
      ];
      state.chatQuoteTarget = null;
      saveCurrentChatSessionData();
      renderChatroom();

      const prompt = `这里是《太微宫茶话群聊》。
${themeInfo.block}
${themeInfo.isIfMode ? "" : relCtx}

请让群里的众多 NPC 从霍惊弦、陆敬、沈砚、谢无咎、温言酌、端王萧承泽、裴玄度、苏枕月（丽嫔）、秦昭华（德妃）、崔清漪（淑妃）、卢婉兮（修仪）、柳如絮（婕妤）、周妙音（才人）、赵怀安、萧承稷中挑 5~7 位不同人物，绝不生成 ${state.userName} 本人的发言，严格围绕当前主题【${themeInfo.name}】开启新话题斗嘴、八卦或修罗场争宠！
1. 后宫妃嫔 sender 必须写为「真名（位分）」，如苏枕月（丽嫔）、秦昭华（德妃）、崔清漪（淑妃）。
2. 萧承稷必自称“朕”或“我”，绝对禁止自称“孤”！
3. 总共生成 ${msgCount} 项 JSON 数组，在聊到一半时插入 2 条 {"type": "join", "text": "某某带动作进入了聊天室"}，紧接着下一条就是这位刚进群的角色发言！
4. 普通发言格式：{"sender": "姓名（后妃带位分）", "text": "简短口语化消息6至26字"}。
直接输出纯 JSON 数组：`;
      const resp = await callAI(prompt, `太微群聊·${themeInfo.name}`);
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) {
        await appendChatMessagesWithDelay(JSON.parse(m[0]));
      }
    } catch (e) {}
    finally { topicBtn.disabled = false; topicBtn.textContent = "刷新群聊"; }
  }

  targetDoc.getElementById("twChatroomSendBtn").addEventListener("click", () => {
    const inp = targetDoc.getElementById("twChatroomInput"), v = inp.value.trim(); if (!v) return;
    inp.value = ""; handleUserSendChat(v);
  });
  targetDoc.getElementById("twChatroomInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); targetDoc.getElementById("twChatroomSendBtn").click(); }
  });
  targetDoc.getElementById("twClearChatroomBtn").addEventListener("click", () => {
    state.groupMessages = [];
    state.chatQuoteTarget = null;
    saveCurrentChatSessionData();
    renderChatroom();
    showModuleSuccessToast("已清空群聊记录");
  });
  targetDoc.getElementById("twRandomChatTopicBtn").addEventListener("click", triggerAiNpcRandomTopic);

  // 论坛发帖与回帖
  targetDoc.getElementById("twForumList").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-act]"); if (!btn) return;
    e.stopPropagation();
    const act = btn.dataset.act, id = Number(btn.dataset.id), post = state.posts.find(p => p.id === id);
    if (!post) return;
    if (act === "like") {
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
      saveCurrentChatSessionData();
      renderForum(targetDoc.getElementById("twSearch").value);
    } else if (act === "set-target") {
      state.replyTargets[id] = btn.dataset.npc || "";
      renderForum(targetDoc.getElementById("twSearch").value);
    } else if (act === "clear-target") {
      delete state.replyTargets[id];
      renderForum(targetDoc.getElementById("twSearch").value);
    } else if (act === "reply") {
      const inp = targetDoc.getElementById(`tw-cin-${id}`), val = inp ? inp.value.trim() : ""; if (!val) return;
      const tNpc = state.replyTargets[id] || "";
      const authorName = getForumUserAuthor();
      post.comments.push({
        isSelfUser: true,
        nick: authorName,
        user: authorName,
        text: enforceAddressingRules(tNpc ? `回复 @${tNpc}：${val}` : val, true)
      });
      delete state.replyTargets[id];
      saveCurrentChatSessionData();
      renderForum(targetDoc.getElementById("twSearch").value);
      triggerNpcCommentReply(post, val, tNpc, false);
    }
  });

  targetDoc.getElementById("twSendPost").addEventListener("click", (e) => {
    e.stopPropagation();
    const tEl = targetDoc.getElementById("twNewTitle"), bEl = targetDoc.getElementById("twNewBody");
    if (!tEl.value.trim() || !bEl.value.trim()) return;
    const authorName = getForumUserAuthor();
    const np = {
      id: Date.now(),
      isSelfUser: true,
      author: authorName,
      nick: authorName,
      time: "刚刚",
      title: enforceAddressingRules(tEl.value.trim(), true),
      content: enforceAddressingRules(bEl.value.trim(), true),
      tags: ["新帖"],
      likes: 1,
      liked: true,
      comments: []
    };
    state.posts.unshift(np);
    tEl.value = "";
    bEl.value = "";
    saveCurrentChatSessionData();
    renderForum();
    triggerNpcCommentReply(np, np.content, "", true);
  });

  targetDoc.getElementById("twSearch").addEventListener("input", (e) => renderForum(e.target.value));

  targetDoc.getElementById("tw-page-actions").addEventListener("click", (e) => {
    const card = e.target.closest(".tw-act-card"); if (!card) return;
    const idx = Number(card.dataset.planIdx);
    const plan = state.storyPlans[idx];
    if (plan) fillUserChatInput(plan.prompt || plan.desc || plan.title);
  });

  rootEl.querySelectorAll("#twTheaterChips .tw-chip").forEach(c => c.addEventListener("click", () => { targetDoc.getElementById("twTheaterPrompt").value = c.dataset.style; }));
  targetDoc.getElementById("twGenTheaterBtn").addEventListener("click", async () => {
    const btn = targetDoc.getElementById("twGenTheaterBtn"), out = targetDoc.getElementById("twTheaterResult"), st = targetDoc.getElementById("twTheaterPrompt").value.trim();
    btn.disabled = true; out.textContent = "刷新中…";
    try {
      const { lastSceneEnding } = getFullStoryContext();
      const resp = await callAI(`为大景皇帝萧承稷与 ${getUserFullTag()} 写一篇450字左右的古风番外小剧场。当前好感度：${state.affection}，阶段：${state.stage}。当前剧情背景：${lastSceneEnding || "太微宫日常"}。主题：${st || "紧接当前剧情的私下互动与护短"}。要求直接自然地称呼 ${state.userName}，萧承稷必自称“朕”或“我”（严禁自称“孤”），带有完整规范的中文标点符号。`, "番外小剧场生成");
      state.theaterText = cleanPureText(resp);
      out.textContent = state.theaterText;
      saveCurrentChatSessionData();
      showModuleSuccessToast("番外小剧场生成完毕");
    } catch (e) { out.textContent = `生成失败：${e.message}`; }
    btn.disabled = false;
  });
  targetDoc.getElementById("twInsertTheaterBtn").addEventListener("click", () => { if (state.theaterText) fillUserChatInput(state.theaterText); });

  try {
    const evOn = typeof eventOn === "function" ? eventOn : (targetWin.eventOn || window.TavernHelper?.eventOn);
    const tEvents = targetWin.tavern_events || window.tavern_events;
    if (typeof evOn === "function" && tEvents) {
      if (tEvents.MESSAGE_RECEIVED) evOn(tEvents.MESSAGE_RECEIVED, () => setTimeout(() => syncFromWorldbookAndChat(true), 900));
      if (tEvents.CHAT_CHANGED) evOn(tEvents.CHAT_CHANGED, () => setTimeout(() => {
        checkAndSwitchChatSessionIfNeeded();
        syncFromWorldbookAndChat(false);
      }, 300));
    }
  } catch (e) {}

  // 初始化加载当前对话框绑定的独立存档
  loadChatSessionData(detectCurrentChatSessionKey());
  syncFromWorldbookAndChat(false);
})();
