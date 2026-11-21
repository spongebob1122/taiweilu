(function () {
  const sandboxWin = window;
  let targetWin = window, targetDoc = document;
  try {
    if (window.parent && window.parent.document) { targetWin = window.parent; targetDoc = window.parent.document; }
    if (window.top && window.top.document) { targetWin = window.top; targetDoc = window.top.document; }
  } catch (e) {}

  function destroyTaiweiUI() {
    try {
      if (targetWin.__twCheckTimer) { clearInterval(targetWin.__twCheckTimer); targetWin.__twCheckTimer = null; }
      targetDoc.getElementById("tw-floating-root")?.remove();
      targetDoc.getElementById("tw-floating-style")?.remove();
    } catch (e) {}
  }
  destroyTaiweiUI();

  // 1. 当在酒馆助手里关闭脚本时，沙盒卸载立即移除悬浮球；开启才出现
  if (sandboxWin !== targetWin) {
    sandboxWin.addEventListener("unload", destroyTaiweiUI);
    sandboxWin.addEventListener("pagehide", destroyTaiweiUI);
  }

  const GLOBAL_CFG_KEY = "tw_palace_global_cfg_v35";
  const CHAT_BIND_VAR_KEY = "tw_palace_archive_v35";
  const LOCAL_BACKUP_PREFIX = "tw_palace_chat_backup_v35_";
  const DEFAULT_PLOT_WORD_LIMIT = 55;
  const DEFAULT_PLOT_CUSTOM_PROMPT = "以女主名字开头，简明概括本轮发生的核心事件、关键互动与结果，语言自然凝练。";

  const FORUM_STYLE_PRESETS = {
    lively: { name: "鲜活茶水间", desc: "像极了真实的宫人妃嫔私下嗑瓜子唠嗑！多用自然鲜活的口语词（如：哎哟、啧、可不是嘛、展开说说、谁懂啊），拒绝端着架子写公文，句子短促有活人感，大家不仅回楼主，还会频繁 @楼上其他NPC 互相接话、抬杠、拆台、追问新细节。" },
    gossip: { name: "欢脱吃瓜风", desc: "全员乐子人与前排吃瓜群众！语气欢脱逗趣、看热闹不嫌事大，喜欢抢前排、搬小板凳、起哄，楼层之间互相 @对方 顺着爆料继续深扒内幕，充满快活热闹的气氛。" },
    snarky: { name: "宫斗阴阳风", desc: "针锋相对、话里有话、阴阳怪气拉满！世家妃嫔端着体面说最扎心的话，武将派直接硬刚呛声，评论区里不同阵营的NPC会直接点名 @楼上死对头 逐句回怼或护短拆台，火药味与戏剧张力十足。" },
    street: { name: "市井烟火风", desc: "极致接地气的大白话与人间烟火味！三句不离吃食、银子、月例、跑腿当差的苦乐，像极了街坊邻里和底层打工人闲扯，互相打趣吐槽，朴实生动、直白鲜活。" },
    classical: { name: "古风文雅风", desc: "纯正唐风古韵，措辞讲究、含蓄蕴藉，偶有诗词雅谑或引经据典，符合大景世家贵女、翰林学士与宫廷女官的清雅谈吐，同时楼层之间互相唱和或机锋交锋。" },
    custom: { name: "自定义风格", desc: "" }
  };

  const GROUP_CHAT_THEMES = {
    story_sync: { name: "同步当前剧情", desc: "紧扣当前酒馆最新剧情、太微宫日常与朝堂后宫动向展开群聊。" },
    user_empress_harem: { name: "我是皇帝", desc: "【女皇独尊后宫IF线】女主是至高无上的大景女皇陛下！萧承稷（冷峻吃醋的贵君/皇夫）、沈砚（温润心机贤君）、陆敬（忠犬武将德君）、谢无咎（豪掷千金皇商丽君）、霍惊弦（鲜活直球小侍君）、温言酌（贴身侍医温昭仪）、裴玄度（冷肃掌律正君）、卫凛（宿卫侍君）以及崔清漪、秦昭华、苏枕月等全都是女皇陛下的后宫成员！全员在群里围绕女皇陛下争风吃醋、暗戳戳邀宠、比拼谁昨晚得了陛下召幸或赏赐，修罗场拉满！" },
    palace_gossip: { name: "深宫八卦吃瓜", desc: "围绕东西六宫争宠笑话、尚食局抢菜、内务府克扣、谁家宫人闹乌龙等深宫八卦热烈吃瓜吐槽。" },
    street_fun: { name: "长安市井趣闻", desc: "围绕长安东西两市奇珍、醉仙楼新酒、平康坊名曲、西市胡商宝马与民间奇闻轶事畅聊。" },
    if_modern: { name: "IF线：现代豪门集团", desc: "【现代职场豪门AU】太微集团总裁萧承稷、首席特助沈砚、安保总监陆敬、投资大鳄谢无咎、富二代小少爷霍惊弦、集团女高管秦昭华/崔清漪、摸鱼女明星苏枕月在公司大群里的爆笑日常。" },
    if_campus: { name: "IF线：皇家重点高中", desc: "【现代校园AU】太微一中高冷学生会长萧承稷、年级第一学神沈砚、体育特长生校霸陆敬、逃课打球的霍惊弦、小卖部幕后老板谢无咎、校医温言酌与各班班花在校园群里的热闹斗嘴。" },
    if_scifi: { name: "IF线：星际帝国舰队", desc: "【星际科幻AU】太微星系最高统帅萧承稷、首席智脑参谋官沈砚、机甲舰队司令陆敬、星际走私商谢无咎、首席医疗官温言酌在星舰公共频道里的跨星系吐槽。" },
    if_genderbend: { name: "IF线：全员性转女尊", desc: "【全员性转女尊大景AU】冷艳女帝萧承稷与后宫男宠贤夫们（端庄崔清漪公子、桀骜将门郎秦昭华、散漫江南富少苏枕月、女相沈砚、女将军陆敬）的奇妙反转群聊。" },
    custom: { name: "自定义群聊主题", desc: "" }
  };

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
    "今日有戏听吗（苏枕月·丽嫔）", "百步穿杨将门女（秦昭华·德妃）", "飞龙厩第一快马（霍惊弦）",
    "和气生财算盘响（谢无咎）", "苦药不加蜜（温言酌）", "御前奉茶不洒水（小禄子）",
    "半窗修竹听雪（柳如絮·婕妤）", "玄武门巡夜人（陆敬）", "尚食局试菜官（苏云娘）",
    "清河门楣不可辱（崔清漪·淑妃）", "西市胡姬酒最烈（洛青衣）", "政事堂不眠人（沈砚）"
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
    { key: "actions", icon: "🏛️", title: "今日所做", sub: "朝堂决断 · 圣躬行止" },
    { key: "meals", icon: "🍵", title: "吃了什么", sub: "尚食呈膳 · 浓茶苦茗" },
    { key: "memorials", icon: "📜", title: "所批折子", sub: "甘露御案 · 朱批钦定" },
    { key: "search", icon: "🔍", title: "查阅记录", sub: "秘阁调档 · 暗查卷宗" },
    { key: "toilet", icon: "🚾", title: "更衣净手", sub: "内室恭房 · 圣躬起居" },
    { key: "leisure", icon: "🎯", title: "今日消遣", sub: "北苑骑射 · 舆图丹青" },
    { key: "desire", icon: "🔥", title: "隐秘欲念", sub: "暗潮克制 · 独占私心" }
  ];

  let config = {
    theme: "xuanpaper", autoMasterAll: true,
    autoModules: { status: true, plot: true, world: true },
    plotWordLimit: DEFAULT_PLOT_WORD_LIMIT, plotCustomPrompt: DEFAULT_PLOT_CUSTOM_PROMPT,
    chatMemoryCount: 20, forumNickname: "", forumSpeakStyle: "lively", forumCustomStyleText: "",
    groupChatTheme: "story_sync", groupChatCustomThemeText: "", lastKnownUserName: "",
    customSaveSlot: "chat_bind", fabCustomTopRatio: null, apiMode: "tavern",
    apiName: "", apiUrl: "https://api.openai.com/v1", apiKey: "", apiModel: "gpt-4o-mini",
    fetchedModels: [], savedApiPresets: [], activePresetId: ""
  };

  function loadGlobalConfig() {
    try {
      const legacyStr = localStorage.getItem(GLOBAL_CFG_KEY) || localStorage.getItem("tw_palace_global_cfg_v34") || "";
      if (legacyStr) Object.assign(config, JSON.parse(legacyStr));
    } catch (e) {}
    try {
      const th = targetWin.TavernHelper || window.TavernHelper;
      const stCtx = targetWin.SillyTavern?.getContext?.() || window.SillyTavern?.getContext?.();
      const backendCfg = th?.getVariables?.({ type: "global" })?.[GLOBAL_CFG_KEY] || stCtx?.extensionSettings?.[GLOBAL_CFG_KEY];
      if (backendCfg && typeof backendCfg === "object") Object.assign(config, backendCfg);
    } catch (e) {}
    if (!config.autoModules || typeof config.autoModules !== "object") config.autoModules = { status: true, plot: true, world: true };
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
    if (!config.customSaveSlot || config.customSaveSlot === "auto_bind" || config.customSaveSlot === "vault_main") config.customSaveSlot = "chat_bind";
    if (config.theme === "palaceglass") config.theme = "palace";
  }

  const saveConfig = () => {
    try { localStorage.setItem(GLOBAL_CFG_KEY, JSON.stringify(config)); } catch (e) {}
    try {
      const th = targetWin.TavernHelper || window.TavernHelper;
      if (th && typeof th.insertOrAssignVariables === "function") th.insertOrAssignVariables({ [GLOBAL_CFG_KEY]: config }, { type: "global" });
    } catch (e) {}
  };
  loadGlobalConfig();

  const isAutoModuleOn = (modName) => config.autoMasterAll ? true : Boolean(config.autoModules && config.autoModules[modName]);
  const escapeRegExp = (str) => String(str || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function detectCurrentUserName() {
    try {
      const stCtx = targetWin.SillyTavern?.getContext?.() || window.SillyTavern?.getContext?.();
      if (stCtx?.name1 && String(stCtx.name1).trim() && stCtx.name1 !== "User") return String(stCtx.name1).trim();
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
      if (targetWin.name1 && String(targetWin.name1).trim() && targetWin.name1 !== "User") return String(targetWin.name1).trim();
    } catch (e) {}
    return config.lastKnownUserName || "云鸢";
  }

  function getCurrentChatFileId() {
    try {
      const stCtx = targetWin.SillyTavern?.getContext?.() || window.SillyTavern?.getContext?.();
      if (stCtx && typeof stCtx.getCurrentChatId === "function") {
        const cid = stCtx.getCurrentChatId();
        if (cid) return String(cid).replace(/[^a-zA-Z0-9_\-\u4e00-\u9fa5]/g, "_");
      }
      if (stCtx?.chatId) return String(stCtx.chatId).replace(/[^a-zA-Z0-9_\-\u4e00-\u9fa5]/g, "_");
      if (stCtx?.chat_metadata?.chat_id_hash) return "hash_" + String(stCtx.chat_metadata.chat_id_hash);
    } catch (e) {}
    return "default_chat";
  }

  function getActiveVaultKey() {
    const slot = config.customSaveSlot || "chat_bind";
    return slot === "chat_bind" ? `${CHAT_BIND_VAR_KEY}_${getCurrentChatFileId()}` : `${CHAT_BIND_VAR_KEY}_${slot}`;
  }

  function hasSubstantialData(obj) {
    if (!obj || typeof obj !== "object") return false;
    return Boolean(
      (Array.isArray(obj.plotSummary) && obj.plotSummary.length > 0) ||
      (Array.isArray(obj.posts) && obj.posts.length > 0) ||
      (Array.isArray(obj.palaceDynamics) && obj.palaceDynamics.length > 0) ||
      (Array.isArray(obj.outsideDynamics) && obj.outsideDynamics.length > 0) ||
      (Array.isArray(obj.storyPlans) && obj.storyPlans.length > 0) ||
      (Array.isArray(obj.groupMessages) && obj.groupMessages.length > 0) ||
      (obj.dmHistories && Object.keys(obj.dmHistories).some(k => Array.isArray(obj.dmHistories[k]) && obj.dmHistories[k].length > 0)) ||
      obj.emperorSpyData || obj.theaterText || obj.innerThought || obj.diary
    );
  }

  const state = {
    isHydrated: false, currentSessionKey: getActiveVaultKey(), boundChatId: getCurrentChatFileId(),
    userName: detectCurrentUserName(), userIdentity: "未同步", time: "未同步", location: "未同步",
    mood: "未同步", pose: "未同步", clothes: "未同步", innerThought: "", diary: "",
    affection: 0, hasAffection: false, stage: "未同步", inNews: "", outNews: "", todo1: "", todo2: "",
    hasDirectStatusTags: false, lastAutoProcessedRoundId: "", plotSummary: [], palaceDynamics: [],
    outsideDynamics: [], posts: [], storyPlans: [], theaterText: "", replyTargets: {},
    chatQuoteTarget: null, dmQuoteTarget: null, groupMessages: [], dmNpcOptions: [...BASE_DM_NPC_CATALOG],
    dmActiveNpc: "萧承稷", dmHistories: {}, emperorSpyData: null, emperorSpyRevealed: {},
    emperorActiveDetailKey: null, emperorCardClickCount: 0, emperorPeekAccumulatedSec: 0,
    emperorNextCatchThreshold: Math.floor(Math.random() * 3) + 3,
    emperorNextTimeThresholdSec: Math.floor(Math.random() * 16) + 22,
    isAutoRunning: false, isGlobalRefreshing: false, hasUnreadFabGlow: false, apiLogs: []
  };

  function explicitClearCurrentArchive() {
    state.userName = detectCurrentUserName();
    state.userIdentity = "未同步"; state.time = "未同步"; state.location = "未同步";
    state.mood = "未同步"; state.pose = "未同步"; state.clothes = "未同步";
    state.innerThought = ""; state.diary = ""; state.affection = 0; state.hasAffection = false;
    state.stage = "未同步"; state.inNews = ""; state.outNews = ""; state.todo1 = ""; state.todo2 = "";
    state.hasDirectStatusTags = false; state.lastAutoProcessedRoundId = "";
    state.plotSummary = []; state.palaceDynamics = []; state.outsideDynamics = [];
    state.posts = []; state.storyPlans = []; state.theaterText = ""; state.replyTargets = {};
    state.chatQuoteTarget = null; state.dmQuoteTarget = null; state.groupMessages = [];
    state.dmActiveNpc = "萧承稷"; state.dmHistories = {}; state.emperorSpyData = null;
    state.emperorSpyRevealed = {}; state.emperorActiveDetailKey = null;
    state.emperorCardClickCount = 0; state.emperorPeekAccumulatedSec = 0;
    state.emperorNextCatchThreshold = Math.floor(Math.random() * 3) + 3;
    state.emperorNextTimeThresholdSec = Math.floor(Math.random() * 16) + 22;
  }

  function applyParsedPayloadToState(parsed) {
    if (!parsed || typeof parsed !== "object") return false;
    if (parsed.userIdentity && parsed.userIdentity !== "未同步") state.userIdentity = parsed.userIdentity;
    if (parsed.time && parsed.time !== "未同步") state.time = parsed.time;
    if (parsed.location && parsed.location !== "未同步") state.location = parsed.location;
    if (parsed.mood && parsed.mood !== "未同步") state.mood = parsed.mood;
    if (parsed.pose && parsed.pose !== "未同步") state.pose = parsed.pose;
    if (parsed.clothes && parsed.clothes !== "未同步") state.clothes = parsed.clothes;
    if (parsed.innerThought) state.innerThought = parsed.innerThought;
    if (parsed.diary) state.diary = parsed.diary;
    if (parsed.hasAffection) { state.affection = Number(parsed.affection) || 0; state.hasAffection = true; }
    if (parsed.stage && parsed.stage !== "未同步") state.stage = parsed.stage;
    if (parsed.inNews) state.inNews = parsed.inNews;
    if (parsed.outNews) state.outNews = parsed.outNews;
    if (parsed.todo1) state.todo1 = parsed.todo1;
    if (parsed.todo2) state.todo2 = parsed.todo2;
    if (parsed.lastAutoProcessedRoundId) state.lastAutoProcessedRoundId = parsed.lastAutoProcessedRoundId;
    if (Array.isArray(parsed.plotSummary)) state.plotSummary = parsed.plotSummary;
    if (Array.isArray(parsed.palaceDynamics)) state.palaceDynamics = parsed.palaceDynamics;
    if (Array.isArray(parsed.outsideDynamics)) state.outsideDynamics = parsed.outsideDynamics;
    if (Array.isArray(parsed.posts)) state.posts = parsed.posts;
    if (Array.isArray(parsed.storyPlans)) state.storyPlans = parsed.storyPlans;
    if (parsed.theaterText !== undefined) state.theaterText = parsed.theaterText;
    if (Array.isArray(parsed.groupMessages)) state.groupMessages = parsed.groupMessages;
    if (parsed.dmActiveNpc) state.dmActiveNpc = parsed.dmActiveNpc;
    if (parsed.dmHistories && typeof parsed.dmHistories === "object") state.dmHistories = parsed.dmHistories;
    if (Array.isArray(parsed.dmCustomNpcs) && parsed.dmCustomNpcs.length) {
      const merged = [...BASE_DM_NPC_CATALOG];
      parsed.dmCustomNpcs.forEach(c => { if (c && c.id && !merged.some(m => m.id === c.id)) merged.push(c); });
      state.dmNpcOptions = merged;
    }
    if (parsed.emperorSpyData !== undefined) state.emperorSpyData = parsed.emperorSpyData;
    if (parsed.emperorSpyRevealed && typeof parsed.emperorSpyRevealed === "object") state.emperorSpyRevealed = parsed.emperorSpyRevealed;
    state.emperorCardClickCount = Number(parsed.emperorCardClickCount) || 0;
    state.emperorPeekAccumulatedSec = Number(parsed.emperorPeekAccumulatedSec) || 0;
    state.emperorNextCatchThreshold = Number(parsed.emperorNextCatchThreshold) || (Math.floor(Math.random() * 3) + 3);
    state.emperorNextTimeThresholdSec = Number(parsed.emperorNextTimeThresholdSec) || (Math.floor(Math.random() * 16) + 22);
    deduplicateTimelineInPlace();
    return true;
  }

  function readFromTavernBackend(vaultKey) {
    const isChatBindMode = (config.customSaveSlot || "chat_bind") === "chat_bind";
    const v34Key = vaultKey.replace("v35", "v34");
    try {
      const th = targetWin.TavernHelper || window.TavernHelper;
      if (th && typeof th.getVariables === "function") {
        if (isChatBindMode) {
          const chatVars = th.getVariables({ type: "chat" });
          for (const k of [CHAT_BIND_VAR_KEY, vaultKey, "tw_palace_archive_v34", v34Key]) {
            if (chatVars && chatVars[k] && hasSubstantialData(chatVars[k])) return chatVars[k];
          }
        }
        const globalVars = th.getVariables({ type: "global" });
        for (const k of [vaultKey, v34Key]) {
          if (globalVars && globalVars[k] && hasSubstantialData(globalVars[k])) return globalVars[k];
        }
      }
    } catch (e) {}
    try {
      const stCtx = targetWin.SillyTavern?.getContext?.() || window.SillyTavern?.getContext?.();
      if (stCtx && isChatBindMode && stCtx.chatMetadata) {
        for (const k of [CHAT_BIND_VAR_KEY, vaultKey, "tw_palace_archive_v34", v34Key]) {
          if (stCtx.chatMetadata[k] && hasSubstantialData(stCtx.chatMetadata[k])) return stCtx.chatMetadata[k];
        }
      }
    } catch (e) {}
    try {
      if (targetWin.__TW_PERSIST_CACHE_V35 && hasSubstantialData(targetWin.__TW_PERSIST_CACHE_V35[vaultKey])) return targetWin.__TW_PERSIST_CACHE_V35[vaultKey];
      const raw = localStorage.getItem(LOCAL_BACKUP_PREFIX + vaultKey) || localStorage.getItem("tw_palace_chat_backup_v34_" + v34Key) || localStorage.getItem(vaultKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (hasSubstantialData(parsed)) return parsed;
      }
    } catch (e) {}
    return null;
  }

  function writeToTavernBackend(vaultKey, payload) {
    const isChatBindMode = (config.customSaveSlot || "chat_bind") === "chat_bind";
    try {
      const th = targetWin.TavernHelper || window.TavernHelper;
      if (th && typeof th.insertOrAssignVariables === "function") {
        if (isChatBindMode) th.insertOrAssignVariables({ [CHAT_BIND_VAR_KEY]: payload, [vaultKey]: payload }, { type: "chat" });
        th.insertOrAssignVariables({ [vaultKey]: payload }, { type: "global" });
      }
    } catch (e) {}
    try {
      const stCtx = targetWin.SillyTavern?.getContext?.() || window.SillyTavern?.getContext?.();
      if (stCtx && isChatBindMode && stCtx.chatMetadata) {
        stCtx.chatMetadata[CHAT_BIND_VAR_KEY] = payload;
        stCtx.chatMetadata[vaultKey] = payload;
        if (typeof stCtx.saveMetadata === "function") stCtx.saveMetadata();
        else if (typeof targetWin.saveMetadataDebounced === "function") targetWin.saveMetadataDebounced();
      }
    } catch (e) {}
    try {
      if (!targetWin.__TW_PERSIST_CACHE_V35) targetWin.__TW_PERSIST_CACHE_V35 = {};
      targetWin.__TW_PERSIST_CACHE_V35[vaultKey] = payload;
      localStorage.setItem(LOCAL_BACKUP_PREFIX + vaultKey, JSON.stringify(payload));
    } catch (e) {}
  }

  function saveCurrentChatSessionData(forceAllowEmpty = false) {
    if (!state.isHydrated && !forceAllowEmpty) return;
    deduplicateTimelineInPlace();
    const vaultKey = getActiveVaultKey();
    state.currentSessionKey = vaultKey;
    state.boundChatId = getCurrentChatFileId();
    const payload = {
      savedAt: Date.now(), vaultKey, boundChatId: state.boundChatId,
      userIdentity: state.userIdentity, time: state.time, location: state.location,
      mood: state.mood, pose: state.pose, clothes: state.clothes,
      innerThought: state.innerThought, diary: state.diary,
      affection: state.affection, hasAffection: state.hasAffection, stage: state.stage,
      inNews: state.inNews, outNews: state.outNews, todo1: state.todo1, todo2: state.todo2,
      lastAutoProcessedRoundId: state.lastAutoProcessedRoundId,
      plotSummary: state.plotSummary, palaceDynamics: state.palaceDynamics,
      outsideDynamics: state.outsideDynamics, posts: state.posts, storyPlans: state.storyPlans,
      theaterText: state.theaterText, groupMessages: state.groupMessages,
      dmActiveNpc: state.dmActiveNpc, dmHistories: state.dmHistories,
      dmCustomNpcs: state.dmNpcOptions.filter(x => x.isDynamic),
      emperorSpyData: state.emperorSpyData, emperorSpyRevealed: state.emperorSpyRevealed,
      emperorCardClickCount: state.emperorCardClickCount,
      emperorPeekAccumulatedSec: state.emperorPeekAccumulatedSec,
      emperorNextCatchThreshold: state.emperorNextCatchThreshold,
      emperorNextTimeThresholdSec: state.emperorNextTimeThresholdSec
    };
    if (!forceAllowEmpty && !hasSubstantialData(payload)) {
      const existingBackendData = readFromTavernBackend(vaultKey);
      if (existingBackendData && hasSubstantialData(existingBackendData)) {
        applyParsedPayloadToState(existingBackendData);
        return;
      }
    }
    writeToTavernBackend(vaultKey, payload);
  }

  function loadChatSessionData(explicitSlotOrChatSwitch = false) {
    const vaultKey = getActiveVaultKey();
    state.currentSessionKey = vaultKey;
    state.boundChatId = getCurrentChatFileId();
    if (explicitSlotOrChatSwitch) explicitClearCurrentArchive();
    const backendData = readFromTavernBackend(vaultKey);
    if (backendData && hasSubstantialData(backendData)) {
      applyParsedPayloadToState(backendData);
      state.isHydrated = true;
      return true;
    }
    state.isHydrated = true;
    return false;
  }

  function getForumStylePromptBlock() {
    const styleKey = config.forumSpeakStyle || "lively";
    const preset = FORUM_STYLE_PRESETS[styleKey] || FORUM_STYLE_PRESETS.lively;
    const customTxt = (config.forumCustomStyleText || "").trim();
    const activeDesc = (styleKey === "custom" && customTxt) ? `用户自定义说话风格要求：【${customTxt}】` : preset.desc;
    return `\n【论坛说话风格与活人感最高指令（当前风格：${preset.name}）】：\n1. 风格要求：${activeDesc}\n2. 严禁死板书面语与严禁车轱辘话！\n3. 楼层NPC互相点名回复（如在评论 text 中自然写出“回复 @某NPC网名：……”）！`;
  }

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
      if (item.keys.some(k => s === k || s === `${item.keys[0]}·${item.keys[2]}`)) return item.std;
    }
    return s;
  }

  function normalizeForumNickWithRealName(rawNick, fallbackIdx = 0) {
    let s = String(rawNick || "").trim();
    if (!s) return FALLBACK_FORUM_NICKS[fallbackIdx % FALLBACK_FORUM_NICKS.length];
    const uName = state.userName || detectCurrentUserName();
    const customAlias = (config.forumNickname || "").trim();
    if (customAlias && (s === customAlias || s === `【${customAlias}】`)) return customAlias;
    if (s === uName) return customAlias ? customAlias : uName;
    s = enforceAddressingRules(s, true).replace(/\(([^)]+)\)/g, "（$1）");
    if (s.includes("（") && s.includes("）")) return s;
    for (const item of NPC_ALIAS_MAP) {
      for (const kw of item.match) {
        if (s === kw) return item.full;
        if (s.includes(kw)) {
          const pureNick = s.replace(kw, "").replace(/[·\-—_：:\s]/g, "").trim();
          return pureNick ? `${pureNick}（${item.match[0]}）` : item.full;
        }
      }
    }
    return s;
  }

  function pickForumNick(obj, fallbackIdx = 0) {
    if (!obj || typeof obj !== "object") return FALLBACK_FORUM_NICKS[fallbackIdx % FALLBACK_FORUM_NICKS.length];
    const customAlias = (config.forumNickname || "").trim();
    if (obj.isSelfUser) return customAlias || state.userName;
    const realNameField = obj.realName || obj.trueName || obj.npc || obj.character || "";
    const candidates = [obj.nick, obj.nickname, obj.author, obj.user, obj.username, obj.name, obj.sender, obj.poster, obj.speaker];
    for (const c of candidates) {
      if (typeof c === "string" && c.trim()) {
        let raw = c.trim();
        if (customAlias && raw === customAlias) return customAlias;
        if (realNameField && typeof realNameField === "string" && !raw.includes("（") && !raw.includes("(")) raw = `${raw}（${realNameField.trim()}）`;
        return normalizeForumNickWithRealName(raw, fallbackIdx);
      }
    }
    return FALLBACK_FORUM_NICKS[fallbackIdx % FALLBACK_FORUM_NICKS.length];
  }

  function pickForumText(obj) {
    if (!obj || typeof obj !== "object") return "";
    for (const c of [obj.text, obj.content, obj.comment, obj.reply, obj.body, obj.message, obj.msg]) {
      if (typeof c === "string" && c.trim()) return enforceAddressingRules(c.trim(), true);
    }
    return "";
  }

  function triggerFabGlowReminder() {
    const ov = targetDoc.getElementById("twModalOverlay"), fb = targetDoc.getElementById("twFabBall");
    if (fb && ov && ov.classList.contains("tw-hidden")) { state.hasUnreadFabGlow = true; fb.classList.add("tw-fab-glow-active"); }
  }
  function clearFabGlowReminder() {
    state.hasUnreadFabGlow = false;
    targetDoc.getElementById("twFabBall")?.classList.remove("tw-fab-glow-active");
  }

  let toastTimer = null;
  function showModuleSuccessToast(moduleTitle) {
    triggerFabGlowReminder();
    const toast = targetDoc.getElementById("twModuleToast"), txt = targetDoc.getElementById("twModuleToastText");
    if (!toast || !txt) return;
    txt.textContent = `✨ 【${moduleTitle}】刷新成功`;
    toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  let wechatBannerTimer = null;
  function showWechatNotification(senderName, previewText, jumpTarget = { tab: "games", subgame: "dm", npc: "" }) {
    triggerFabGlowReminder();
    const banner = targetDoc.getElementById("twWechatBanner"), avatarEl = targetDoc.getElementById("twWechatAvatar");
    const senderEl = targetDoc.getElementById("twWechatSender"), msgEl = targetDoc.getElementById("twWechatPreview");
    if (!banner || !senderEl || !msgEl) return;
    if (avatarEl) avatarEl.textContent = String(senderName || "宫").charAt(0);
    senderEl.textContent = senderName || "太微宫传信";
    msgEl.textContent = cleanPureText(previewText).slice(0, 42);
    banner.dataset.jumpTab = jumpTarget.tab || "games";
    banner.dataset.jumpSubgame = jumpTarget.subgame || "dm";
    banner.dataset.jumpNpc = jumpTarget.npc || "";
    banner.classList.add("show");
    if (wechatBannerTimer) clearTimeout(wechatBannerTimer);
    wechatBannerTimer = setTimeout(() => banner.classList.remove("show"), 4500);
  }

  function addApiLog(entry) {
    const now = new Date(), pad = (n) => String(n).padStart(2, "0");
    state.apiLogs.unshift({
      id: Date.now() + Math.random(),
      time: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
      source: entry.source || "通用请求",
      mode: entry.mode || (config.apiMode === "custom" ? `自定义 · ${config.apiModel || "默认"}` : "酒馆主 API"),
      status: entry.status || "success", duration: entry.duration || 0, detail: entry.detail || ""
    });
    if (state.apiLogs.length > 40) state.apiLogs.pop();
    renderApiLogs();
  }

  function showApiErrorBanner(sourceName, errMsg) {
    const errBar = targetDoc.getElementById("twApiErrorBanner"), errTxt = targetDoc.getElementById("twApiErrorText");
    if (errBar && errTxt) { errTxt.textContent = `⚠️ API 调用出错 [${sourceName}]：${errMsg}`; errBar.classList.add("show"); }
  }
  function hideApiErrorBanner() { targetDoc.getElementById("twApiErrorBanner")?.classList.remove("show"); }

  function renderApiLogs() {
    const box = targetDoc.getElementById("twApiLogList"), countBadge = targetDoc.getElementById("twApiLogCountBadge");
    if (countBadge) countBadge.textContent = `共 ${state.apiLogs.length} 条`;
    if (!box) return;
    if (!state.apiLogs.length) { box.innerHTML = `<div class="tw-empty-hint" style="padding:10px;">暂无 API 调用记录</div>`; return; }
    box.innerHTML = state.apiLogs.map(log => {
      const isErr = log.status === "error";
      return `<div class="tw-log-item ${isErr ? "err" : "ok"}"><div class="tw-log-top"><span><b>[${log.time}] ${log.source}</b> · ${log.mode}</span><span class="tw-log-tag ${isErr ? "err" : "ok"}">${isErr ? "失败" : "成功"} · ${log.duration}ms</span></div><div class="tw-log-detail">${log.detail}</div></div>`;
    }).join("");
  }

  function deduplicateTimelineInPlace() {
    if (!Array.isArray(state.plotSummary) || state.plotSummary.length <= 1) return;
    const cleaned = [], seenRoundIds = new Set();
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
  const saveTimeline = () => saveCurrentChatSessionData(false);

  if (state.userName && state.userName !== config.lastKnownUserName) {
    config.lastKnownUserName = state.userName;
    saveConfig();
  }

  function getWorldAddressRules(hideTrueUserIdentity = false) {
    const uName = state.userName || detectCurrentUserName();
    const customAlias = (config.forumNickname || "").trim();
    const userSection = hideTrueUserIdentity && customAlias
      ? `一、论坛匿名马甲盲猜铁律：\n1. 当前发帖/回帖人使用了匿名马甲「${customAlias}」，宫内外所有人【绝对不知道】TA 的真实姓名与真实位分！\n2. 严禁在任何回复中写出「${uName}」这个名字！NPC 只能称呼「@${customAlias}」或“楼主/层主”，并只能根据发言内容去盲猜TA的身份！`
      : `一、女主姓名自然书写规则：\n1. 当前女主的名字叫：${uName}。\n2. 提及女主时，请直接自然地写出 ${uName} 的名字，严禁在 ${uName} 名字外面加【】方括号！`;
    return `\n【大景王朝世界观、人物人设、后妃称呼与禁用词最高铁律】：\n${userSection}\n二、萧承稷是大景王朝已登基的天子，【只自称“朕”】（私下对挚友偶称“我”），【绝对禁止自称“孤”或“本王”】！\n三、后宫妃嫔统一采用「真名（位分）」格式：崔清漪（淑妃）、秦昭华（德妃）、卢婉兮（修仪）、苏枕月（丽嫔）、柳如絮（婕妤）、郑芷兰（美人）、周妙音（才人）、韩怜儿（宝林）、沈青禾（选侍）。尊称皇帝为“陛下”、“圣人”，后妃自称“妾”、“妾身”，宫人自称“奴婢”。`;
  }

  function enforceAddressingRules(text, preserveForumAlias = false) {
    if (!text) return "";
    const uName = state.userName || detectCurrentUserName();
    const customNick = (config.forumNickname || "").trim();
    let res = String(text);
    const aliasPlaceholder = "__TW_FORUM_ALIAS_PROTECTED__";
    if (preserveForumAlias && customNick) res = res.split(customNick).join(aliasPlaceholder);
    res = res
      .replace(/【\s*(主控|玩家|女主|user)\s*】/gi, preserveForumAlias && customNick ? customNick : uName)
      .replace(/主控|玩家|女主/g, preserveForumAlias && customNick ? customNick : uName)
      .replace(/(?<!["'\w])user(?!["'\w])/gi, preserveForumAlias && customNick ? customNick : uName);
    if (config.lastKnownUserName && config.lastKnownUserName !== uName && config.lastKnownUserName !== customNick) {
      res = res.split(config.lastKnownUserName).join(uName);
    }
    if (uName !== "海绵" && customNick !== "海绵") res = res.replace(/海绵/g, uName);
    if (uName) res = res.replace(new RegExp(`【\\s*(${escapeRegExp(uName)})\\s*】`, "g"), "$1");
    res = res.replace(/(?<![\u4e00-\u9fa5])孤(?![立身本女单高儿寡零魂芳傲岛负月灯木掌臣])/g, "朕");
    res = res
      .replace(/小主/g, "娘子").replace(/臣妾/g, "妾身").replace(/万岁爷/g, "圣人").replace(/皇上/g, "陛下")
      .replace(/老奴|奴才/g, "奴婢").replace(/嬷嬷/g, "姑姑").replace(/([崔卢沈陆赵柳温秦顾侯魏裴])大人/g, "$1公")
      .replace(/养心殿|乾清宫/g, "甘露殿").replace(/御书房/g, "延英殿").replace(/坤宁宫|凤仪宫|椒房殿/g, "立政殿")
      .replace(/翊坤宫|景仁宫|钟粹宫/g, "淑景殿").replace(/永寿宫|咸福宫/g, "承香殿").replace(/储秀宫|承乾宫/g, "凝华殿")
      .replace(/延禧宫|启祥宫/g, "玉照宫").replace(/慎刑司/g, "暴室").replace(/敬事房/g, "内侍监");
    if (preserveForumAlias && customNick) {
      res = res.split(aliasPlaceholder).join(customNick);
      res = res.replace(new RegExp(`【\\s*(${escapeRegExp(customNick)})\\s*】`, "g"), "$1");
    }
    return res;
  }

  function ensureUserNameInSummary(rawText) {
    let txt = enforceAddressingRules(rawText).trim();
    if (!txt) return "";
    const uName = state.userName || detectCurrentUserName();
    if (txt.includes(uName)) return txt;
    if (/^(她|少女|女子|新晋后妃|新晋嫔妃)/.test(txt)) return txt.replace(/^(她|少女|女子|新晋后妃|新晋嫔妃)/, uName);
    if (txt.includes("她")) return txt.replace("她", uName);
    if (/^(初入|入宫|在|于|前往|来到|居于|身处|偶遇|奉旨|蒙|获|被|因|与|随|听闻|收到|面对)/.test(txt)) return `${uName}${txt}`;
    return `${uName}：${txt}`;
  }

  const cleanPureText = (raw) => enforceAddressingRules(
    String(raw || "").replace(/<[^>]+>/g, "").replace(/[`*#~|]/g, "").replace(/\n{2,}/g, "\n").trim()
  );

  function stripMetaAndStatusTags(raw) {
    if (!raw) return "";
    return String(raw)
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, "")
      .replace(/<xiao_chengji_cot>[\s\S]*?<\/xiao_chengji_cot>/gi, "")
      .replace(/<(角色名|时间|地点|天气|穿着|姿势|心情|心理活动|好感度数值|好感度阶段|user身份|预留字段1|宫内见闻|帝王日记|待办1|待办2|预留字段2|宫外见闻)>[\s\S]*?<\/\1>/gi, "")
      .replace(/```[\s\S]*?```/g, "").replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim();
  }

  // ==================== 100% 原版 v35 样式表 ====================
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
      --bg-paper:rgba(255, 250, 243, 0.66); --bg-card:rgba(255, 255, 255, 0.56); --bg-nav:rgba(250, 239, 222, 0.62); --bg-sub:rgba(247, 236, 218, 0.52);
      --border-outer:rgba(205, 162, 90, 0.85); --border-inner:rgba(255, 255, 255, 0.88); --border-soft:rgba(212, 175, 112, 0.42);
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
    @keyframes twFabShineSweep { 0% { transform:translateX(-130%) rotate(25deg); } 100% { transform:translateX(230%) rotate(25deg); } }
    .tw-fab-ball {
      position:fixed !important; top:calc(50vh - 34px); right:14px !important; left:auto !important; bottom:auto !important;
      width:58px; height:68px; background:var(--fab-grad); border:2px solid var(--gold); border-radius:14px 14px 26px 26px; color:var(--head-text);
      display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; user-select:none; touch-action:none; z-index:2147483647;
      box-shadow:0 8px 24px rgba(0,0,0,0.55),inset 0 0 0 3px rgba(255,255,255,0.12),inset 0 0 14px rgba(212,168,87,0.35); overflow:hidden;
    }
    .tw-fab-ball::before { content:""; position:absolute; inset:4px; border:1px solid rgba(245,223,179,0.45); border-radius:10px 10px 22px 22px; pointer-events:none; }
    .tw-fab-ball.tw-fab-glow-active::after {
      content:""; position:absolute; top:-30%; left:-50%; width:55%; height:160%;
      background:linear-gradient(90deg, transparent, rgba(255,245,210,0.58), transparent);
      animation:twFabShineSweep 2.4s infinite ease-in-out; pointer-events:none;
    }
    .tw-fab-dot { display:none; position:absolute; top:5px; right:6px; width:9px; height:9px; border-radius:50%; background:#e6392e; border:1.5px solid #fff8eb; box-shadow:0 1px 4px rgba(0,0,0,0.4); }
    .tw-fab-ball.tw-fab-glow-active .tw-fab-dot { display:block; }
    .tw-fab-top { font-size:9.5px; letter-spacing:2px; opacity:.85; border-bottom:1px solid rgba(245,223,179,0.4); padding-bottom:2px; margin-bottom:3px; }
    .tw-fab-main { font-size:14px; font-weight:bold; letter-spacing:2.5px; line-height:1.15; }
    .tw-fab-ornament { width:18px; height:3px; margin-top:4px; background:linear-gradient(90deg,transparent,var(--gold),transparent); }
    .tw-wechat-banner {
      position:fixed; top:16px; left:50%; transform:translateX(-50%) translateY(-130%); width:360px; max-width:92vw; background:rgba(32, 35, 42, 0.94); color:#fff;
      backdrop-filter:blur(12px); border:1px solid rgba(212, 168, 87, 0.65); border-radius:12px; padding:10px 13px; display:flex; align-items:center; gap:10px; z-index:2147483647;
      box-shadow:0 10px 28px rgba(0,0,0,0.45); cursor:pointer; transition:transform .32s cubic-bezier(0.22, 1, 0.36, 1), opacity .28s ease; opacity:0; pointer-events:none;
    }
    .tw-wechat-banner.show { transform:translateX(-50%) translateY(0); opacity:1; pointer-events:auto; }
    .tw-wechat-avatar { width:36px; height:36px; border-radius:8px; background:linear-gradient(135deg,#852922,#b88a3e); color:#fff8eb; font-weight:bold; font-size:15px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .tw-wechat-body { flex:1; overflow:hidden; }
    .tw-wechat-top { display:flex; justify-content:space-between; align-items:center; font-size:12px; font-weight:bold; color:#f7ead0; margin-bottom:2px; }
    .tw-wechat-tag { font-size:10px; color:#5cdbd3; font-weight:normal; }
    .tw-wechat-preview { font-size:11.5px; color:#dcdcdc; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .tw-module-toast {
      position:fixed; top:68px; left:50%; transform:translateX(-50%) translateY(-20px); background:var(--head-grad); color:var(--head-text); border:1.5px solid var(--gold);
      padding:6px 16px; border-radius:20px; font-size:12px; font-weight:bold; letter-spacing:1px; box-shadow:0 6px 20px rgba(0,0,0,0.38); z-index:2147483647; opacity:0; pointer-events:none; transition:all .25s ease;
    }
    .tw-module-toast.show { transform:translateX(-50%) translateY(0); opacity:1; }
    .tw-catch-modal { display:none; position:absolute; inset:0; background:rgba(15, 8, 6, 0.78); backdrop-filter:blur(4px); z-index:99; align-items:center; justify-content:center; padding:18px; }
    .tw-catch-modal.show { display:flex; }
    .tw-catch-card { width:100%; max-width:380px; background:var(--bg-paper); border:2px solid #9e241e; outline:1px solid var(--gold); outline-offset:-5px; border-radius:8px; padding:16px; box-shadow:0 16px 40px rgba(0,0,0,0.75); text-align:center; }
    .tw-catch-title { font-size:16px; font-weight:bold; color:#9e241e; margin-bottom:8px; letter-spacing:1.5px; }
    .tw-catch-desc { font-size:12.5px; line-height:1.65; color:var(--text-main); margin-bottom:12px; text-align:left; background:var(--bg-sub); padding:9px 11px; border-radius:4px; border-left:3px solid #9e241e; }
    .tw-modal-overlay {
      position:fixed; top:0; left:0; right:0; bottom:0; width:100vw; height:100vh; background:rgba(12,8,5,0.58); backdrop-filter:blur(2.5px);
      display:flex; align-items:center; justify-content:center; padding:14px; z-index:2147483646; opacity:1; transition:opacity .2s ease;
    }
    .tw-modal-overlay.tw-hidden { opacity:0; pointer-events:none; display:none !important; }
    .tw-panel {
      width:560px; max-width:96vw; height:700px; max-height:91vh; background-color:var(--bg-paper);
      background-image:repeating-linear-gradient(0deg,rgba(120,90,50,0.03) 0px,rgba(120,90,50,0.03) 1px,transparent 1px,transparent 5px),repeating-linear-gradient(90deg,rgba(120,90,50,0.025) 0px,rgba(120,90,50,0.025) 1px,transparent 1px,transparent 7px);
      border:2px solid var(--border-outer); outline:1px solid var(--border-inner); outline-offset:-6px; border-radius:6px; box-shadow:0 20px 55px rgba(8,4,2,0.78),var(--paper-vignette); display:flex; flex-direction:column; overflow:hidden; position:relative; margin:auto;
    }
    .tw-head { padding:11px 14px; background:var(--head-grad); color:var(--head-text); border-bottom:2px solid var(--border-outer); display:flex; justify-content:space-between; align-items:center; }
    .tw-head-title { font-size:16px; font-weight:bold; letter-spacing:2px; }
    .tw-head-btns { display:flex; gap:6px; align-items:center; }
    .tw-mini-btn { padding:5px 10px; font-size:11.5px; color:var(--head-text); background:rgba(255,255,255,0.15); border:1px solid rgba(255,240,200,0.45); border-radius:4px; cursor:pointer; font-family:inherit; }
    .tw-mini-btn.api-btn { background:var(--border-outer); color:#fff8eb; font-weight:bold; border-color:#e8c987; }
    .tw-mini-btn:disabled { opacity:.55; cursor:wait; }
    .tw-manual-refresh-btn.disabled-gray, .tw-manual-refresh-btn:disabled { opacity:0.42 !important; filter:grayscale(100%) !important; cursor:not-allowed !important; pointer-events:none !important; }
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
    .tw-spy-grid { display:grid; grid-template-columns:1fr 1fr; gap:9px; margin-top:6px; }
    .tw-spy-tile {
      position:relative; background:linear-gradient(145deg, var(--bg-card) 0%, var(--bg-sub) 100%); border:1.5px solid var(--border-outer); border-radius:7px; padding:11px 10px;
      cursor:pointer; transition:all .2s ease; box-shadow:0 3px 10px rgba(80, 50, 20, 0.08), inset 0 0 0 2px rgba(200, 165, 110, 0.16);
      display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; min-height:98px; overflow:hidden;
    }
    .tw-spy-tile:hover { transform:translateY(-2px); box-shadow:0 6px 16px rgba(133, 41, 34, 0.18); border-color:var(--accent); }
    .tw-spy-tile.visited { border-color:var(--gold); }
    .tw-spy-seal-stamp { width:32px; height:32px; border-radius:50%; background:rgba(133, 41, 34, 0.12); border:1.5px dashed var(--accent); color:var(--accent); display:flex; align-items:center; justify-content:center; font-size:15px; margin-bottom:4px; }
    .tw-spy-tile-name { font-size:13px; font-weight:bold; color:var(--accent-strong); letter-spacing:1px; }
    .tw-spy-tile-sub { font-size:10px; color:var(--text-sub); margin-top:2px; }
    .tw-spy-seal-hint { margin-top:5px; font-size:9.5px; padding:1.5px 8px; border-radius:10px; background:var(--accent); color:#fff8eb; letter-spacing:0.5px; }
    .tw-spy-tile.visited .tw-spy-seal-hint { background:var(--bg-sub); color:var(--accent-strong); border:1px solid var(--border-soft); }
    .tw-spy-detail-page { animation:twBubblePop .2s ease-out; }
    .tw-spy-detail-header { display:flex; justify-content:space-between; align-items:center; padding-bottom:8px; margin-bottom:10px; border-bottom:1.5px solid var(--border-outer); }
    .tw-spy-back-btn { padding:4px 10px; font-size:11.5px; font-weight:bold; background:var(--bg-sub); color:var(--accent-strong); border:1px solid var(--border-outer); border-radius:4px; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:4px; }
    .tw-spy-back-btn:hover { background:var(--accent); color:#fff8eb; }
    .tw-spy-entry-list { display:flex; flex-direction:column; gap:7px; margin-bottom:10px; }
    .tw-spy-entry-item { background:var(--bg-sub); border:1px solid var(--border-soft); border-left:3.5px solid var(--accent); border-radius:4px; padding:8px 10px; font-size:12px; line-height:1.65; color:var(--text-main); }
    .tw-spy-murmur-box { padding:9px 11px; background:var(--bg-card); border:1.5px dashed var(--gold); border-left:4px solid var(--gold); border-radius:5px; font-size:12px; color:var(--accent-strong); line-height:1.6; }
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
    .tw-toggle-btn.disabled-gray, .tw-toggle-btn:disabled { opacity:0.42 !important; filter:grayscale(100%); cursor:not-allowed !important; background:var(--border-soft) !important; color:var(--text-sub) !important; border-color:var(--border-soft) !important; }
    .tw-sub-switch-row { display:flex; justify-content:space-between; align-items:center; padding:6px 8px; border-bottom:1px dashed var(--border-soft); border-radius:4px; }
    .tw-sub-switch-row:last-child { border-bottom:0; }
    .tw-sub-switch-row.locked-row { opacity:0.58; }
    .tw-api-mode-cards { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px; }
    .tw-api-mode-card { padding:9px 10px; border:1.5px solid var(--border-soft); border-radius:6px; background:var(--bg-sub); cursor:pointer; text-align:left; font-family:inherit; color:var(--text-main); transition:all .15s; }
    .tw-api-mode-card b { display:block; font-size:12.5px; color:var(--accent-strong); margin-bottom:2px; }
    .tw-api-mode-card span { font-size:10.5px; color:var(--text-sub); line-height:1.35; display:block; }
    .tw-api-mode-card.active { border-color:var(--accent); background:var(--bg-card); box-shadow:inset 0 0 0 1px var(--accent); }
    .tw-chip-row { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px; }
    .tw-chip-row.tw-nowrap-scroll { flex-wrap:nowrap; overflow-x:auto; white-space:nowrap; scrollbar-width:none; padding-bottom:2px; margin-bottom:4px; }
    .tw-chip-row.tw-nowrap-scroll::-webkit-scrollbar { display:none; }
    .tw-chip { padding:4px 9px; font-size:11px; background:var(--bg-sub); border:1px solid var(--border-soft); color:var(--text-main); border-radius:12px; cursor:pointer; transition:all .14s; flex-shrink:0; }
    .tw-chip:hover { border-color:var(--accent); color:var(--accent-strong); }
    .tw-chip.active { background:var(--accent); color:#fff8eb; border-color:var(--border-outer); font-weight:bold; }
    .tw-theater-output { white-space:pre-wrap; line-height:1.75; font-size:12.5px; padding:10px 12px; background:var(--bg-sub); border:1px solid var(--border-soft); border-radius:4px; min-height:180px; max-height:330px; overflow-y:auto; }
    .tw-game-tabs { display:grid; grid-template-columns:repeat(4,1fr); gap:5px; margin-bottom:7px; }
    .tw-game-tab-btn { padding:6px 4px; font-size:11.5px; font-weight:bold; background:var(--bg-card); color:var(--text-main); border:1.5px solid var(--border-soft); border-radius:4px; cursor:pointer; font-family:inherit; }
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
    .tw-chatroom-messages { height:435px; overflow-y:auto; background:var(--bg-sub); border:1px solid var(--border-soft); border-radius:6px; padding:9px 11px; margin-bottom:6px; display:flex; flex-direction:column; gap:7px; }
    @keyframes twBubblePop { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
    .tw-chat-sys-tip { align-self:center; font-size:10.5px; color:var(--text-sub); background:rgba(140, 98, 57, 0.12); border:1px dashed var(--border-soft); padding:2.5px 11px; border-radius:12px; margin:3px 0; text-align:center; letter-spacing:0.5px; animation:twBubblePop .22s ease-out; }
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
    .tw-error-banner { display:none; justify-content:space-between; align-items:center; gap:8px; font-size:11.5px; font-weight:bold; color:#fff8f6; background:linear-gradient(135deg, #9e241e 0%, #6e1410 100%); border:1.5px solid #e69a8d; padding:7px 11px; border-radius:4px; margin-bottom:9px; box-shadow:0 3px 10px rgba(140, 25, 20, 0.28); }
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

  const rootEl = targetDoc.createElement("div");
  rootEl.id = "tw-floating-root";
  rootEl.setAttribute("data-theme", config.theme || "xuanpaper");
  rootEl.innerHTML = `
    <div class="tw-fab-ball" id="twFabBall" title="点击展开太微宫闻录（可上下拖动）">
      <span class="tw-fab-dot"></span>
      <span class="tw-fab-top">太微</span>
      <span class="tw-fab-main">闻录</span>
      <span class="tw-fab-ornament"></span>
    </div>
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
    <div class="tw-module-toast" id="twModuleToast"><span id="twModuleToastText">✨ 刷新成功</span></div>
    <div class="tw-modal-overlay tw-hidden" id="twModalOverlay">
      <div class="tw-panel" id="twMainPanel">
        <div class="tw-catch-modal" id="twCatchModal">
          <div class="tw-catch-card">
            <div class="tw-catch-title">⚠️ 窥探圣躬过久 · 被当场抓包！</div>
            <div class="tw-catch-desc" id="twCatchDesc">赵怀安低着头刚把起居注合上，甘露殿内传来一声极轻的冷嗤。萧承稷指尖慢条斯理地转过墨玉扳指，淡色眼瞳隔着宫墙似已将你接连翻看他起居秘录的小动作尽收眼底，并向你发来了一道私密传讯……</div>
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

          <div class="tw-tab-page" id="tw-page-world">
            <div style="display:flex;justify-content:flex-end;margin-bottom:8px;">
              <button type="button" class="tw-refresh-forum-btn tw-manual-refresh-btn" id="twRefreshWorldBtn" style="padding:4px 11px;font-size:11.5px;">手动刷新</button>
            </div>
            <div class="tw-box">
              <div class="tw-sec-head"><span>宫内动态</span><span class="tw-badge">太微宫内</span></div>
              <div id="twPalaceWorldList"></div>
            </div>
            <div class="tw-box">
              <div class="tw-sec-head"><span>宫外动态</span><span class="tw-badge">宫墙之外</span></div>
              <div id="twOutsideWorldList"></div>
            </div>
          </div>

          <!-- 2. 圣人日常：只写警觉度，不显示翻看项数与秒数 -->
          <div class="tw-tab-page" id="tw-page-emperor">
            <div class="tw-box">
              <div class="tw-sec-head">
                <span>甘露殿起居秘录·偷窥圣人</span>
                <div style="display:flex;gap:6px;align-items:center;">
                  <span class="tw-badge" id="twSpyRiskBadge">警觉度：安全</span>
                  <button type="button" class="tw-refresh-forum-btn tw-manual-refresh-btn" id="twRefreshEmperorSpyBtn" style="padding:4px 11px;font-size:11.5px;">偷窥刷新</button>
                </div>
              </div>
              <div class="tw-label" style="margin-bottom:6px;" id="twSpySubHint">点击下方任意暗格即可打开独立详情页，查看萧承稷今日吃了什么、做了什么、秘阁查阅记录与更衣净手状态（注意：翻看过多或停留太久均会被圣人察觉抓包）……</div>
              <div id="twEmperorSpyList"></div>
            </div>
          </div>

          <div class="tw-tab-page" id="tw-page-forum">
            <div class="tw-box" style="padding:8px 11px;margin-bottom:8px;">
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <span class="tw-badge" style="margin:0;">我的论坛昵称</span>
                <input class="tw-input" id="twForumNickInput" style="margin-bottom:0;flex:1;min-width:140px;padding:4px 8px;" value="" placeholder="默认空白（使用本名），输入马甲则全员盲猜……">
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
                  <input class="tw-input" id="twForumCustomStyleInput" style="margin-bottom:0;padding:4px 8px;" placeholder="输入你想要的论坛说话风格……">
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

          <div class="tw-tab-page" id="tw-page-games">
            <div class="tw-game-tabs">
              <button type="button" class="tw-game-tab-btn active" data-game="dm">单人私聊</button>
              <button type="button" class="tw-game-tab-btn" data-game="chatroom">太微群聊</button>
              <button type="button" class="tw-game-tab-btn" data-game="memorial">代批奏折</button>
              <button type="button" class="tw-game-tab-btn" data-game="gomoku">延英五子棋</button>
            </div>

            <div class="tw-subgame-pane active" id="tw-game-dm">
              <div class="tw-box" style="padding:8px 10px;margin-bottom:0;">
                <div class="tw-sec-head" style="margin-bottom:5px;">
                  <span>单人私密传讯</span>
                  <div style="display:flex;gap:4px;flex-wrap:wrap;">
                    <button type="button" class="tw-reply-npc-btn" id="twDmRefreshRosterBtn">🔄 刷新人物</button>
                    <button type="button" class="tw-reply-npc-btn" id="twDmSyncStoryBtn" style="background:var(--accent);color:#fff;">同步剧情开聊</button>
                    <button type="button" class="tw-reply-npc-btn" id="twDmExportOfflineBtn">转线下填入酒馆</button>
                    <button type="button" class="tw-reply-npc-btn" id="twDmClearBtn">清空</button>
                  </div>
                </div>
                <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;">
                  <span class="tw-label" style="white-space:nowrap;">私聊对象：</span>
                  <select class="tw-select" id="twDmNpcSelect" style="margin-bottom:0;flex:1;padding:4px 8px;"></select>
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

            <!-- 3. 太微群聊：添加左右滑动选择提示，并将“我是皇帝，其他人都是我后宫”精简为“👑 我是皇帝” -->
            <div class="tw-subgame-pane" id="tw-game-chatroom">
              <div class="tw-box" style="padding:8px 10px;margin-bottom:0;">
                <div class="tw-sec-head" style="margin-bottom:4px;padding-bottom:3px;">
                  <span style="font-size:12.5px;">太微宫茶话群聊 · <span id="twChatroomRoleBadge">未同步</span></span>
                  <div style="display:flex;gap:5px;">
                    <button type="button" class="tw-reply-npc-btn" id="twRandomChatTopicBtn" style="background:var(--accent);color:#fff;">刷新群聊</button>
                    <button type="button" class="tw-reply-npc-btn" id="twClearChatroomBtn">清空</button>
                  </div>
                </div>
                <div style="margin-bottom:5px;padding-bottom:4px;border-bottom:1px dashed var(--border-soft);">
                  <div class="tw-label" style="margin-bottom:3px;font-size:10.5px;">⇄ 左右滑动下方标签可切换聊天主题：</div>
                  <div class="tw-chip-row tw-nowrap-scroll" id="twGroupThemeChips" title="左右滑动切换群聊主题">
                    <span class="tw-chip" data-gtheme="story_sync">📍 同步当前剧情</span>
                    <span class="tw-chip" data-gtheme="user_empress_harem">👑 我是皇帝</span>
                    <span class="tw-chip" data-gtheme="palace_gossip">🍉 深宫八卦</span>
                    <span class="tw-chip" data-gtheme="street_fun">🏮 市井趣闻</span>
                    <span class="tw-chip" data-gtheme="if_modern">💼 IF现代豪门</span>
                    <span class="tw-chip" data-gtheme="if_campus">🏫 IF皇家高中</span>
                    <span class="tw-chip" data-gtheme="if_scifi">🚀 IF星际舰队</span>
                    <span class="tw-chip" data-gtheme="if_genderbend">🌸 IF全员性转</span>
                    <span class="tw-chip" data-gtheme="custom">✍️ 自定义主题</span>
                  </div>
                  <div id="twGroupCustomThemeWrap" style="display:none;margin-top:3px;">
                    <input class="tw-input" id="twGroupCustomThemeInput" style="margin-bottom:0;padding:3px 8px;" placeholder="输入你想看的群聊主题或IF线设定……">
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

          <!-- 4. 设置：隐藏“存档绑定与悬浮球位置管理”模块（功能完整保留） -->
          <div class="tw-tab-page" id="tw-page-settings">
            <div class="tw-box" style="display:none !important;">
              <div class="tw-sec-head">
                <span>存档绑定与悬浮球位置管理</span>
                <span class="tw-badge" id="twSessionPill">已绑定当前对话</span>
              </div>
              <select class="tw-select" id="twSaveSlotSelect">
                <option value="chat_bind">自动绑定当前聊天记录</option>
                <option value="slot_1">独立固定存档槽位一</option>
                <option value="slot_2">独立固定存档槽位二</option>
                <option value="slot_3">独立固定存档槽位三</option>
              </select>
              <button type="button" id="twResetFabPosBtn">悬浮球恢复居中</button>
            </div>

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
                <span>API 调用监控日志</span>
                <div style="display:flex;gap:6px;align-items:center;">
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

  // ==================== 悬浮球位置管理与点击拖拽 ====================
  const fab = targetDoc.getElementById("twFabBall"), overlay = targetDoc.getElementById("twModalOverlay"), navBar = targetDoc.getElementById("twNavBar");

  function pinFabToRightCenter(forceResetToCenter = false) {
    if (!fab) return;
    if (forceResetToCenter) { config.fabCustomTopRatio = null; saveConfig(); }
    fab.style.setProperty("position", "fixed", "important");
    fab.style.setProperty("right", "14px", "important");
    fab.style.setProperty("left", "auto", "important");
    fab.style.setProperty("bottom", "auto", "important");
    fab.style.setProperty("transform", "none", "important");
    const vh = targetWin.innerHeight || targetDoc.documentElement.clientHeight || 0;
    if (typeof config.fabCustomTopRatio === "number" && !isNaN(config.fabCustomTopRatio) && config.fabCustomTopRatio >= 0.05 && config.fabCustomTopRatio <= 0.92 && vh > 240) {
      const targetTopPx = Math.max(20, Math.min(vh - 88, Math.round(vh * config.fabCustomTopRatio)));
      fab.style.setProperty("top", `${targetTopPx}px`, "important");
    } else {
      fab.style.setProperty("top", "calc(50vh - 34px)", "important");
    }
  }
  pinFabToRightCenter(false);
  targetWin.addEventListener("resize", () => pinFabToRightCenter(false));

  let dragging = false, moved = false, startY = 0, startTop = 0;
  fab.addEventListener("pointerdown", (e) => {
    dragging = true; moved = false; startY = e.clientY;
    startTop = fab.getBoundingClientRect().top;
    try { fab.setPointerCapture(e.pointerId); } catch (err) {}
  });
  fab.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dy = e.clientY - startY;
    if (Math.abs(dy) > 5) moved = true;
    if (moved) {
      const vh = targetWin.innerHeight || targetDoc.documentElement.clientHeight || 800;
      const newTop = Math.max(20, Math.min(vh - 88, startTop + dy));
      fab.style.setProperty("top", `${newTop}px`, "important");
      config.fabCustomTopRatio = newTop / vh;
    }
  });
  fab.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;
    try { fab.releasePointerCapture(e.pointerId); } catch (err) {}
    if (moved) {
      saveConfig();
    } else {
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

  const gThemeBar = targetDoc.getElementById("twGroupThemeChips");
  if (gThemeBar) {
    let gDrag = false, gStartX = 0, gScrollLeft = 0;
    gThemeBar.addEventListener("pointerdown", (e) => { gDrag = true; gStartX = e.clientX; gScrollLeft = gThemeBar.scrollLeft; });
    gThemeBar.addEventListener("pointermove", (e) => { if (gDrag && Math.abs(e.clientX - gStartX) > 4) { gThemeBar.scrollLeft = gScrollLeft - (e.clientX - gStartX); } });
    ["pointerup", "pointerleave", "pointercancel"].forEach(ev => gThemeBar.addEventListener(ev, () => { gDrag = false; }));
  }

  targetWin.addEventListener("beforeunload", () => {
    if (state.isHydrated && hasSubstantialData(state)) saveCurrentChatSessionData(false);
  });

  targetDoc.getElementById("twResetFabPosBtn")?.addEventListener("click", () => {
    pinFabToRightCenter(true);
    showModuleSuccessToast("悬浮球已恢复居中位置");
  });

  targetDoc.getElementById("twSaveSlotSelect")?.addEventListener("change", (e) => {
    const newSlot = e.target.value || "chat_bind";
    saveCurrentChatSessionData(false);
    config.customSaveSlot = newSlot;
    saveConfig();
    loadChatSessionData(true);
    renderAll();
  });

  targetDoc.getElementById("twCloseErrorBannerBtn")?.addEventListener("click", hideApiErrorBanner);
  targetDoc.getElementById("twClearApiLogsBtn")?.addEventListener("click", () => { state.apiLogs = []; renderApiLogs(); });

  targetDoc.getElementById("twWechatBanner")?.addEventListener("click", (e) => {
    const banner = e.currentTarget;
    banner.classList.remove("show");
    clearFabGlowReminder();
    overlay?.classList.remove("tw-hidden");
    const jumpTab = banner.dataset.jumpTab || "games", jumpSubgame = banner.dataset.jumpSubgame || "dm", jumpNpc = banner.dataset.jumpNpc || "";
    rootEl.querySelectorAll(".tw-nav button").forEach(b => b.classList.toggle("active", b.dataset.tab === jumpTab));
    rootEl.querySelectorAll(".tw-tab-page").forEach(p => p.classList.toggle("active", p.id === `tw-page-${jumpTab}`));
    if (jumpTab === "games") {
      rootEl.querySelectorAll(".tw-game-tab-btn").forEach(b => b.classList.toggle("active", b.dataset.game === jumpSubgame));
      rootEl.querySelectorAll(".tw-subgame-pane").forEach(p => p.classList.toggle("active", p.id === `tw-game-${jumpSubgame}`));
      if (jumpSubgame === "dm" && jumpNpc) {
        state.dmActiveNpc = jumpNpc;
        saveCurrentChatSessionData(false);
        renderDmSection();
      }
    }
  });

  targetDoc.getElementById("twGoCaughtDmBtn")?.addEventListener("click", () => {
    targetDoc.getElementById("twCatchModal")?.classList.remove("show");
    state.emperorActiveDetailKey = null;
    rootEl.querySelectorAll(".tw-nav button").forEach(b => b.classList.toggle("active", b.dataset.tab === "games"));
    rootEl.querySelectorAll(".tw-tab-page").forEach(p => p.classList.toggle("active", p.id === "tw-page-games"));
    rootEl.querySelectorAll(".tw-game-tab-btn").forEach(b => b.classList.toggle("active", b.dataset.game === "dm"));
    rootEl.querySelectorAll(".tw-subgame-pane").forEach(p => p.classList.toggle("active", p.id === "tw-game-dm"));
    state.dmActiveNpc = "萧承稷";
    saveCurrentChatSessionData(false);
    renderDmSection();
  });

  function setGlobalRefreshingState(isRefreshing, tipMessage = "") {
    state.isGlobalRefreshing = isRefreshing;
    const tip = targetDoc.getElementById("twApiStatusBar");
    if (tip) {
      if (isRefreshing) { tip.classList.add("show"); tip.textContent = tipMessage || "刷新中…"; }
      else if (tipMessage) {
        tip.classList.add("show"); tip.textContent = tipMessage;
        setTimeout(() => { if (!state.isGlobalRefreshing) tip.classList.remove("show"); }, 2000);
      } else tip.classList.remove("show");
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
    const id = state.userIdentity && state.userIdentity !== "未同步" && state.userIdentity.toLowerCase() !== "user" ? enforceAddressingRules(state.userIdentity) : "";
    return (!id || id === state.userName) ? state.userName : `${id}·${state.userName}`;
  };
  const getForumUserAuthor = () => { const custom = (config.forumNickname || "").trim(); return custom ? custom : state.userName; };
  const isForumUsingAlias = () => { const custom = (config.forumNickname || "").trim(); return Boolean(custom && custom !== state.userName); };

  function checkIsXiaoChat() {
    try {
      const chatEl = targetDoc.getElementById("chat");
      const sendForm = targetDoc.getElementById("send_form") || targetDoc.getElementById("form_sheld");
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

  // 2. 圣人日常：只显示“警觉度：安全/起疑/极危”，不显示翻看次数和秒数
  let isCatchTriggering = false;
  function updateSpyRiskBadgeUI() {
    const badge = targetDoc.getElementById("twSpyRiskBadge");
    if (!badge) return;
    const clickRatio = (state.emperorCardClickCount || 0) / Math.max(1, state.emperorNextCatchThreshold || 3);
    const timeRatio = (state.emperorPeekAccumulatedSec || 0) / Math.max(1, state.emperorNextTimeThresholdSec || 25);
    const maxRatio = Math.max(clickRatio, timeRatio);
    if (maxRatio >= 0.78) {
      badge.textContent = "警觉度：极危";
      badge.style.color = "#9e241e";
      badge.style.fontWeight = "bold";
    } else if (maxRatio >= 0.45) {
      badge.textContent = "警觉度：起疑";
      badge.style.color = "#b88a3e";
      badge.style.fontWeight = "bold";
    } else {
      badge.textContent = "警觉度：安全";
      badge.style.color = "";
      badge.style.fontWeight = "";
    }
  }

  targetWin.__twCheckTimer = setInterval(() => {
    // 若在酒馆助手里关掉了脚本导致沙盒断开，立即销毁悬浮球
    try {
      if (sandboxWin !== targetWin && sandboxWin.frameElement && !sandboxWin.frameElement.isConnected) {
        destroyTaiweiUI();
        return;
      }
    } catch (e) {}

    if (!checkIsXiaoChat()) {
      rootEl.classList.add("tw-chat-inactive");
      overlay?.classList.add("tw-hidden");
      return;
    }
    rootEl.classList.remove("tw-chat-inactive");
    const curCid = getCurrentChatFileId();
    if ((config.customSaveSlot || "chat_bind") === "chat_bind" && curCid !== "default_chat" && curCid !== state.boundChatId) {
      state.boundChatId = curCid;
      loadChatSessionData(true);
      syncFromWorldbookAndChat(false);
      return;
    }
    if (!hasSubstantialData(state)) {
      if (loadChatSessionData(false)) renderAll();
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
        saveCurrentChatSessionData(false);
      }
      config.lastKnownUserName = latestDetectedName;
      saveConfig();
      renderAll();
    }

    const empPage = targetDoc.getElementById("tw-page-emperor");
    const catchModal = targetDoc.getElementById("twCatchModal");
    if (overlay && !overlay.classList.contains("tw-hidden") && empPage && empPage.classList.contains("active") && state.emperorActiveDetailKey && state.emperorSpyData && (!catchModal || !catchModal.classList.contains("show")) && !isCatchTriggering) {
      state.emperorPeekAccumulatedSec = (Number(state.emperorPeekAccumulatedSec) || 0) + 1;
      updateSpyRiskBadgeUI();
      if (state.emperorPeekAccumulatedSec >= (state.emperorNextTimeThresholdSec || 25)) {
        const meta = SPY_CARD_META.find(x => x.key === state.emperorActiveDetailKey);
        triggerEmperorCaughtEvent(meta ? meta.title : "起居秘录", "盯看秘录时间过久");
      }
    }
  }, 1000);

  const normalizeBaseUrl = (u) => (u || "").trim().replace(/\/+$/, "").replace(/\/(chat\/completions|models)$/, "");

  async function callAI(promptText, sourceName = "闻录请求", preserveAlias = false, hideTrueUserIdentity = false) {
    state.userName = detectCurrentUserName();
    const fullPrompt = `${promptText}\n\n${getWorldAddressRules(hideTrueUserIdentity)}`;
    const startTime = Date.now();
    const modeLabel = config.apiMode === "custom" ? `自定义 · ${config.apiName || config.apiModel || "默认"}` : "酒馆主 API";
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
          let errBody = ""; try { errBody = await res.text(); } catch (e) {}
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
      if (!rawOut || !String(rawOut).trim()) throw new Error("API 返回内容为空");
      const finalOut = enforceAddressingRules(rawOut, preserveAlias);
      addApiLog({ source: sourceName, mode: modeLabel, status: "success", duration: Date.now() - startTime, detail: `返回 ${finalOut.length} 字：${cleanPureText(finalOut).slice(0, 55)}…` });
      return finalOut;
    } catch (err) {
      const errMsg = err?.message || String(err);
      addApiLog({ source: sourceName, mode: modeLabel, status: "error", duration: Date.now() - startTime, detail: `错误原因：${errMsg}` });
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
      overlay?.classList.add("tw-hidden");
    } catch (e) {}
  }

  const getTag = (s, t) => { const m = (s || "").match(new RegExp(`<${t}>([\\s\\S]*?)<\\/${t}>`, "i")); return m ? m[1].trim() : ""; };

  function getRawChatList(limit = 0) {
    const fullList = [], curUserName = detectCurrentUserName();
    try {
      const stCtx = targetWin.SillyTavern?.getContext?.() || window.SillyTavern?.getContext?.();
      if (stCtx?.chat?.length) {
        let aiCounter = 0;
        stCtx.chat.forEach((m, absIdx) => {
          const raw = m.mes || m.message || "", isUser = !!m.is_user;
          if (!isUser && raw) aiCounter++;
          if (raw) fullList.push({ absIdx, aiRoundNum: isUser ? 0 : aiCounter, name: isUser ? curUserName : (m.name || "萧承稷"), isUser, raw });
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

  const buildStableRoundId = (aiRoundNum, absIdx, cleanBody) => `ai_r${aiRoundNum}_m${absIdx}_${(cleanBody || "").slice(0, 24).replace(/\s+/g, "")}`;

  function getFullStoryContext() {
    const fullList = getRawChatList(0);
    const totalAiRounds = fullList.filter(m => !m.isUser && stripMetaAndStatusTags(m.raw).length > 0).length;
    const list = fullList.slice(-12);
    if (!list.length) return { historyText: "", lastSceneEnding: "", lastFullTurn: "", latestRoundText: "", latestRoundId: "", latestAiHasStatusBar: false, totalAiRounds: 0 };
    let latestAiHasStatusBar = false, latestAiMsg = null;
    for (let i = list.length - 1; i >= 0; i--) {
      if (!list[i].isUser) {
        latestAiMsg = list[i];
        const r = list[i].raw || "";
        latestAiHasStatusBar = Boolean(getTag(r, "时间") || getTag(r, "地点") || getTag(r, "好感度数值") || getTag(r, "心理活动") || getTag(r, "帝王日记"));
        break;
      }
    }
    const cleanedTurns = list.map((m) => ({
      absIdx: m.absIdx, aiRoundNum: m.aiRoundNum, name: m.name, isUser: m.isUser,
      body: stripMetaAndStatusTags(m.raw), timeTag: getTag(m.raw, "时间"), locTag: getTag(m.raw, "地点")
    })).filter(x => x.body.length > 0);
    if (!cleanedTurns.length) return { historyText: "", lastSceneEnding: "", lastFullTurn: "", latestRoundText: "", latestRoundId: "", latestAiHasStatusBar, totalAiRounds };
    const historyParts = cleanedTurns.slice(0, -1).map((t, i) => `第${i + 1}段·${t.name}：\n${t.body.length > 600 ? "…" + t.body.slice(-600) : t.body}`);
    const lastTurn = cleanedTurns[cleanedTurns.length - 1];
    const prevTurn = cleanedTurns.length >= 2 ? cleanedTurns[cleanedTurns.length - 2] : null;
    const lastFullTurn = lastTurn.body.length > 2200 ? "…" + lastTurn.body.slice(-2200) : lastTurn.body;
    const lastSceneEnding = lastTurn.body.slice(-550);
    const latestRoundText = (prevTurn ? `${prevTurn.name}：\n${prevTurn.body.slice(-600)}\n\n` : "") + `${lastTurn.name}：\n${lastFullTurn}`;
    let latestRoundId = "";
    if (latestAiMsg) {
      const aiCleanBody = stripMetaAndStatusTags(latestAiMsg.raw);
      if (aiCleanBody) latestRoundId = buildStableRoundId(latestAiMsg.aiRoundNum, latestAiMsg.absIdx, aiCleanBody);
    }
    return { historyText: historyParts.join("\n\n"), lastFullTurn: `最新一楼完整剧情·${lastTurn.name}：\n${lastFullTurn}`, lastSceneEnding, latestRoundText, latestRoundId, latestAiHasStatusBar, totalAiRounds };
  }

  function getRelationshipAndFamiliarityContext(blindUserIdentity = false) {
    const timelineTail = state.plotSummary.slice(-6).map((x, i) => `${i + 1}. [${x.time}·${x.location}] ${x.summary}`).join("\n");
    const { latestRoundText } = getFullStoryContext();
    if (blindUserIdentity) {
      return `\n【当前太微宫与长安城时间局势背景（发帖人真实身份已完全隐匿）】：\n1. 当前时间：${state.time}，圣人所在位置：${state.location}，圣人当前心情：${state.mood}。\n2. 重要提示：当前在论坛发言的「${getForumUserAuthor()}」是一个彻底匿名的神秘马甲！所有NPC【完全不知道】这个马甲背后是谁，只能盲猜！`;
    }
    return `\n【当前剧情进度、萧承稷情感状态与NPC熟识度设定】：\n1. 女主真实身份：${getUserFullTag()}，当前所在地点：${state.location}，当前时间：${state.time}。\n2. 萧承稷对 ${state.userName} 的当前情感状态：好感度数值为 ${state.hasAffection ? state.affection : 0}，处于阶段 ${state.stage || "【审视窥探】"}，当前心情：${state.mood}。\n3. 近期故事时间轴脉络：\n${timelineTail || "刚开局"}\n4. 最新一轮互动节选：\n${latestRoundText ? latestRoundText.slice(-700) : "暂无"}`;
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
      state.affection = Number(fs.affection); state.hasAffection = true;
    }
    if (fs.stage && (state.stage === "未同步" || !state.hasDirectStatusTags)) state.stage = enforceAddressingRules(fs.stage);
    saveCurrentChatSessionData(false);
  }

  function upsertTimelineNode(roundId, timeStr, locStr, summaryStr) {
    const cleanSum = ensureUserNameInSummary(summaryStr);
    if (!cleanSum) return;
    const nodeObj = { roundId: roundId || `manual_${Date.now()}`, time: enforceAddressingRules(timeStr || state.time || "延昭二年"), location: enforceAddressingRules(locStr || state.location || "太微宫"), summary: cleanSum };
    if (roundId) {
      const existingIdx = state.plotSummary.findIndex(x => (x.roundId || x.turnKey) === roundId);
      if (existingIdx >= 0) { state.plotSummary[existingIdx] = nodeObj; saveTimeline(); return; }
    }
    const lastIdx = state.plotSummary.length - 1;
    if (lastIdx >= 0 && state.plotSummary[lastIdx].summary === nodeObj.summary) return;
    state.plotSummary.push(nodeObj);
    saveTimeline();
  }

  async function syncFromWorldbookAndChat(triggerAuto = false) {
    try {
      if (!state.isHydrated || !hasSubstantialData(state)) loadChatSessionData(false);
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
          if (!latestAiFound && !messages[i].isUser) state.hasDirectStatusTags = true;
          if (time && !time.includes("{{")) state.time = time;
          if (loc && !loc.includes("{{")) state.location = enforceAddressingRules(loc);
          if (clothes && !clothes.includes("{{")) state.clothes = clothes;
          if (pose && !pose.includes("{{")) state.pose = pose;
          if (mood && !mood.includes("{{")) state.mood = mood;
          if (thought && !thought.includes("{{")) state.innerThought = enforceAddressingRules(thought);
          if (diary && !diary.includes("{{")) state.diary = enforceAddressingRules(diary);
          if (aff !== "" && !isNaN(Number(aff))) { state.affection = Number(aff); state.hasAffection = true; }
          if (stage && !stage.includes("{{")) state.stage = stage;
          if (uId && !uId.includes("{{") && uId.toLowerCase() !== "user") state.userIdentity = enforceAddressingRules(uId);
          if (td1 && !td1.includes("{{")) state.todo1 = enforceAddressingRules(td1);
          if (td2 && !td2.includes("{{")) state.todo2 = enforceAddressingRules(td2);
          if (inN && !inN.includes("{{")) state.inNews = enforceAddressingRules(inN);
          if (outN && !outN.includes("{{")) state.outNews = enforceAddressingRules(outN);
          if (hasSubstantialData(state)) saveCurrentChatSessionData(false);
          break;
        }
        if (!messages[i].isUser) latestAiFound = true;
      }
    } catch (e) {}
    scanChatForActiveDmNpcs();
    renderAll();

    const { lastSceneEnding, latestRoundId, totalAiRounds } = getFullStoryContext();
    if (triggerAuto && totalAiRounds >= 2 && lastSceneEnding && latestRoundId) {
      if (state.isAutoRunning || state.lastAutoProcessedRoundId === latestRoundId) return;
      state.isAutoRunning = true;
      state.lastAutoProcessedRoundId = latestRoundId;
      saveCurrentChatSessionData(false);
      try { await runEnabledAutoRefreshTasks(latestRoundId, totalAiRounds); }
      finally { state.isAutoRunning = false; }
    }
  }

  async function runEnabledAutoRefreshTasks(currentRoundId = "", totalAiRounds = 0) {
    const runStatus = isAutoModuleOn("status"), runPlot = isAutoModuleOn("plot"), runWorld = isAutoModuleOn("world");
    if (!runStatus && !runPlot && !runWorld) return;
    setGlobalRefreshingState(true, "刷新中…");
    try {
      const alreadyInTimeline = Boolean(currentRoundId && state.plotSummary.some(x => (x.roundId || x.turnKey) === currentRoundId));
      if (runPlot && state.plotSummary.length < totalAiRounds - 1) {
        await rebuildFullLongTimeline(true);
      } else if (runStatus || (runPlot && !alreadyInTimeline)) {
        await autoGenerateCorePlotData(true, { doStatus: runStatus, doPlot: runPlot && !alreadyInTimeline });
      }
      if (runWorld) await refreshWorldOnly(null, true);
      setGlobalRefreshingState(false);
      showModuleSuccessToast("自动同步（状态/剧情/世界）");
    } catch (e) { setGlobalRefreshingState(false); }
  }

  async function autoGenerateCorePlotData(fromGlobalTask = false, opts = { doStatus: true, doPlot: true }) {
    if (!fromGlobalTask) setGlobalRefreshingState(true, "刷新中…");
    try {
      await syncFromWorldbookAndChat(false);
      const uName = state.userName;
      const { latestRoundText, latestRoundId, latestAiHasStatusBar } = getFullStoryContext();
      const needFallbackStatus = opts.doStatus && (!latestAiHasStatusBar || state.clothes === "未同步" || !state.innerThought || !fromGlobalTask);
      const existingTail = state.plotSummary.slice(-4).map((x, i) => `${i + 1}. [${x.time} · ${x.location}] ${ensureUserNameInSummary(x.summary)}`).join("\n");
      const plotInstruction = getPlotSummaryInstruction();
      const promptParts = [];
      if (needFallbackStatus) {
        promptParts.push(`"fallbackStatus": {"time":"当前年号日期时辰","location":"萧承稷所在宫殿","userIdentity":"${uName}当前具体位分","clothes":"萧承稷衣着十字内","pose":"萧承稷动作十字内","mood":"四字情绪","innerThought":"萧承稷第一人称真实想法，自称朕，28字内","diary":"萧承稷第一人称私密手札，自称朕，70字左右","todo1":"待办1","todo2":"待办2","affection":${state.hasAffection ? state.affection : 10},"stage":"${state.stage !== "未同步" ? state.stage : "【淡漠留意】"}"}`);
      }
      if (opts.doPlot) {
        promptParts.push(`"latestTimelineNode": {"time":"本轮具体时间","location":"本轮具体地点","summary":"仅概括最新这一轮新进展，遵守要求：${plotInstruction}"}`);
      }
      if (!promptParts.length) { if (!fromGlobalTask) setGlobalRefreshingState(false); return; }
      const prompt = `你是《太微宫闻录》史官同步助手。当前女主：${uName}（${getUserFullTag()}）。\n已记录脉络：\n${existingTail || "暂无"}\n本轮最新剧情：\n${latestRoundText}\n请输出纯 JSON 对象：\n{\n${promptParts.join(",\n")}\n}`;
      const resp = await callAI(prompt, opts.doPlot ? "剧情梳理与状态同步" : "状态栏同步");
      const m = String(resp).match(/{[\s\S]*}/);
      if (m) {
        const p = JSON.parse(m[0]);
        if (needFallbackStatus && p.fallbackStatus) applyFallbackStatusIfMissing(p.fallbackStatus);
        if (opts.doPlot) {
          const node = p.latestTimelineNode || (Array.isArray(p.newTimelineNodes) ? p.newTimelineNodes[0] : null);
          if (node && (node.summary || node.event)) upsertTimelineNode(latestRoundId, node.time, node.location, node.summary || node.event);
        }
        saveCurrentChatSessionData(false);
        renderAll();
        if (!fromGlobalTask) { setGlobalRefreshingState(false); showModuleSuccessToast(opts.doPlot ? "剧情时间轴" : "天子状态栏"); }
      }
    } catch (e) { if (!fromGlobalTask) setGlobalRefreshingState(false); }
  }

  async function rebuildFullLongTimeline(fromGlobalTask = false) {
    const btn = targetDoc.getElementById("twRebuildFullPlotBtn");
    if (btn) btn.textContent = "刷新中…";
    if (!fromGlobalTask) setGlobalRefreshingState(true, "刷新中…");
    try {
      await syncFromWorldbookAndChat(false);
      const uName = state.userName, allList = getRawChatList(0), aiRoundMeta = [];
      allList.forEach((m) => {
        if (m.isUser) return;
        const body = stripMetaAndStatusTags(m.raw);
        if (!body) return;
        const t = getTag(m.raw, "时间") || state.time || "延昭二年";
        const l = enforceAddressingRules(getTag(m.raw, "地点") || state.location || "太微宫");
        const roundId = buildStableRoundId(m.aiRoundNum, m.absIdx, body);
        const snippet = body.length > 520 ? body.slice(0, 180) + "……" + body.slice(-340) : body;
        aiRoundMeta.push({ roundNum: aiRoundMeta.length + 1, roundId, time: t, location: l, text: `第${aiRoundMeta.length + 1}轮 | 时间：${t} | 地点：${l}：\n${snippet}` });
      });
      const sliceMeta = aiRoundMeta.slice(-18);
      const { latestRoundId } = getFullStoryContext();
      const plotInstruction = getPlotSummaryInstruction();
      const prompt = `你是《太微宫闻录》编年史官。当前女主：${uName}。请在 longTimeline 数组中按顺序每一轮对应输出 1 幕（共 ${sliceMeta.length} 幕），summary 遵守要求：${plotInstruction}。\n历史记录：\n${sliceMeta.map(x => x.text).join("\n\n")}\n请直接输出纯 JSON 对象：\n{"longTimeline":[{"time":"具体时间","location":"具体地点","summary":"该轮事件摘要"}]}`;
      const resp = await callAI(prompt, "全量重梳时间轴");
      const m = String(resp).match(/{[\s\S]*}/);
      if (m) {
        const p = JSON.parse(m[0]);
        if (Array.isArray(p.longTimeline) && p.longTimeline.length) {
          state.plotSummary = p.longTimeline.map((node, i) => {
            const matchedMeta = sliceMeta[i] || sliceMeta[sliceMeta.length - 1];
            const rid = (i === p.longTimeline.length - 1 && latestRoundId) ? latestRoundId : (matchedMeta?.roundId || `hist_${i}`);
            return { roundId: rid, time: enforceAddressingRules(node.time || matchedMeta?.time || state.time || "延昭二年"), location: enforceAddressingRules(node.location || matchedMeta?.location || state.location || "太微宫"), summary: ensureUserNameInSummary(node.summary || node.event || "") };
          }).filter(x => x.summary);
        }
        if (latestRoundId) state.lastAutoProcessedRoundId = latestRoundId;
        saveCurrentChatSessionData(false);
        renderAll();
        if (!fromGlobalTask) { setGlobalRefreshingState(false); showModuleSuccessToast("全量故事时间轴"); }
      }
    } catch (e) { if (!fromGlobalTask) setGlobalRefreshingState(false); }
    finally { if (btn) btn.textContent = "全量重梳全部楼层"; }
  }

  async function refreshStatusOnly() {
    const btn = targetDoc.getElementById("twRefreshStatusOnlyBtn");
    if (btn) btn.textContent = "刷新中…";
    try { await autoGenerateCorePlotData(false, { doStatus: true, doPlot: false }); }
    finally { if (btn) btn.textContent = "手动刷新"; }
  }

  // ==================== 2. 圣人日常（二级界面不显示“第1条、第2条”，直接把条数列出来） ====================
  function extractSpyEntriesList(infoObj) {
    if (!infoObj || typeof infoObj !== "object") return ["暂无具体记录"];
    const cleanNumPrefix = (s) => enforceAddressingRules(String(s || "").replace(/^【?第\s*[0-9一二三四五六七八九十]+\s*条】?\s*/g, "").trim());
    if (Array.isArray(infoObj.entries) && infoObj.entries.length) return infoObj.entries.map(cleanNumPrefix).filter(Boolean);
    if (Array.isArray(infoObj.items) && infoObj.items.length) return infoObj.items.map(cleanNumPrefix).filter(Boolean);
    if (typeof infoObj.detail === "string" && infoObj.detail.trim()) {
      const parts = infoObj.detail.split(/(?:；|\n|。)/).map(cleanNumPrefix).filter(Boolean);
      return parts.length ? parts.map(p => p.endsWith("。") ? p : p + "。") : [cleanNumPrefix(infoObj.detail)];
    }
    return ["暂无具体记录"];
  }

  function renderEmperorSpySection() {
    updateSpyRiskBadgeUI();
    const box = targetDoc.getElementById("twEmperorSpyList"), subHint = targetDoc.getElementById("twSpySubHint");
    if (!box) return;
    if (!state.emperorSpyData) {
      if (subHint) subHint.style.display = "block";
      box.innerHTML = `<div class="tw-empty-hint">目前尚未偷窥到圣人今日起居秘录，请点击右上角「偷窥刷新」生成八大暗格卡片。</div>`;
      return;
    }
    const d = state.emperorSpyData, revealed = state.emperorSpyRevealed || {};
    if (state.emperorActiveDetailKey) {
      const meta = SPY_CARD_META.find(x => x.key === state.emperorActiveDetailKey) || SPY_CARD_META[0];
      const info = d[meta.key] || {}, entries = extractSpyEntriesList(info);
      if (subHint) subHint.style.display = "none";
      box.innerHTML = `
        <div class="tw-spy-detail-page">
          <div class="tw-spy-detail-header">
            <button type="button" class="tw-spy-back-btn" id="twSpyBackToGridBtn">← 返回总览</button>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:14px;font-weight:bold;color:var(--accent-strong);">${meta.icon} ${meta.title}</span>
              <span class="tw-badge">心情：${enforceAddressingRules(info.mood || "沉静")}</span>
            </div>
          </div>
          <div class="tw-label" style="margin-bottom:6px;">📜 内侍监暗记明细：</div>
          <div class="tw-spy-entry-list">
            ${entries.map((line) => `<div class="tw-spy-entry-item">${line}</div>`).join("")}
          </div>
          <div class="tw-spy-murmur-box">
            <b>💭 萧承稷此刻内心碎碎念：</b><br>“${enforceAddressingRules(info.murmur || "……")}”
          </div>
        </div>`;
      return;
    }
    if (subHint) subHint.style.display = "block";
    box.innerHTML = `<div class="tw-spy-grid">` + SPY_CARD_META.map(meta => {
      const isVisited = Boolean(revealed[meta.key]);
      return `<div class="tw-spy-tile ${isVisited ? "visited" : ""}" data-spy-key="${meta.key}"><div class="tw-spy-seal-stamp">${meta.icon}</div><div class="tw-spy-tile-name">${meta.title}</div><div class="tw-spy-tile-sub">${meta.sub}</div><span class="tw-spy-seal-hint">${isVisited ? "已掀封 · 点击重看" : "朱印封缄 · 点击打开"}</span></div>`;
    }).join("") + `</div>`;
  }

  async function triggerEmperorCaughtEvent(clickedCardTitle = "起居秘录", catchReason = "接连翻看多份暗格") {
    if (isCatchTriggering) return;
    isCatchTriggering = true;
    state.emperorCardClickCount = 0; state.emperorPeekAccumulatedSec = 0;
    state.emperorNextCatchThreshold = Math.floor(Math.random() * 3) + 3;
    state.emperorNextTimeThresholdSec = Math.floor(Math.random() * 16) + 22;
    saveCurrentChatSessionData(false);
    updateSpyRiskBadgeUI();
    try {
      const relCtx = getRelationshipAndFamiliarityContext();
      const prompt = `${state.userName} 刚刚偷偷翻看甘露殿起居秘录【${clickedCardTitle}】（原因：${catchReason}），被萧承稷当场察觉抓包！\n${relCtx}\n萧承稷必自称“朕”（禁称孤），请输出纯 JSON：\n{"catchScene":"65字左右第三人称描写萧承稷察觉时的冷峻反应","dmQuestion":"萧承稷发给 ${state.userName} 的私聊质问消息（45字内，自称朕）"}`;
      const resp = await callAI(prompt, "圣人抓包质问联动");
      const m = String(resp).match(/{[\s\S]*}/);
      let catchScene = `赵怀安刚把甘露殿起居注合上，殿内便传来一声极轻的冷哼。萧承稷指尖慢条斯理地转过墨玉扳指，早已将 ${state.userName} 偷看他【${clickedCardTitle}】的举动尽收眼底。`;
      let dmQuestion = `抱着朕的【${clickedCardTitle}】看了这么久还没看够？${state.userName}，自己过来甘露殿当面问朕。`;
      if (m) {
        const parsed = JSON.parse(m[0]);
        if (parsed.catchScene) catchScene = cleanPureText(parsed.catchScene);
        if (parsed.dmQuestion) dmQuestion = cleanPureText(parsed.dmQuestion);
      }
      if (!Array.isArray(state.dmHistories["萧承稷"])) state.dmHistories["萧承稷"] = [];
      state.dmHistories["萧承稷"].push({ type: "system", text: `⚠️ 你偷看【${clickedCardTitle}】已被萧承稷当场抓包` });
      state.dmHistories["萧承稷"].push({ sender: "萧承稷", text: dmQuestion, self: false });
      saveCurrentChatSessionData(false);
      renderDmSection();
      const descEl = targetDoc.getElementById("twCatchDesc");
      if (descEl) descEl.textContent = catchScene;
      targetDoc.getElementById("twCatchModal")?.classList.add("show");
      showWechatNotification("萧承稷（抓包质问）", dmQuestion, { tab: "games", subgame: "dm", npc: "萧承稷" });
    } catch (e) {}
    finally { isCatchTriggering = false; }
  }

  targetDoc.getElementById("twEmperorSpyList")?.addEventListener("click", async (e) => {
    if (e.target.closest("#twSpyBackToGridBtn")) {
      e.stopPropagation();
      state.emperorActiveDetailKey = null;
      renderEmperorSpySection();
      return;
    }
    const tile = e.target.closest(".tw-spy-tile");
    if (!tile) return;
    const key = tile.dataset.spyKey;
    if (!key) return;
    if (!state.emperorSpyRevealed) state.emperorSpyRevealed = {};
    state.emperorSpyRevealed[key] = true;
    state.emperorActiveDetailKey = key;
    state.emperorCardClickCount = (Number(state.emperorCardClickCount) || 0) + 1;
    state.emperorPeekAccumulatedSec = (Number(state.emperorPeekAccumulatedSec) || 0) + 3;
    saveCurrentChatSessionData(false);
    renderEmperorSpySection();
    const meta = SPY_CARD_META.find(x => x.key === key);
    if (state.emperorCardClickCount >= (state.emperorNextCatchThreshold || 3)) {
      await triggerEmperorCaughtEvent(meta ? meta.title : "起居秘录", "接连翻看多份起居暗格");
    }
  });

  async function refreshEmperorSpyOnly() {
    const btn = targetDoc.getElementById("twRefreshEmperorSpyBtn");
    if (btn) btn.textContent = "偷窥中…";
    setGlobalRefreshingState(true, "正在偷窥圣人今日八事清单…");
    try {
      await syncFromWorldbookAndChat(false);
      const { lastFullTurn, lastSceneEnding } = getFullStoryContext();
      const relCtx = getRelationshipAndFamiliarityContext();
      const prompt = `你是甘露殿秘密起居注记录官。请结合当前最新剧情与萧承稷的人设，生成萧承稷今日的 8 项私密日常状态：visitors（今日见客）、actions（今日所做）、meals（吃了什么）、memorials（所批折子）、search（查阅记录）、toilet（更衣净手/如厕起居）、leisure（今日消遣）、desire（隐秘欲念）。\n每个分类包含 entries（3~4条具体明细数组，直接写内容不要加“第1条”编号）、mood（四字心情）、murmur（第一人称碎碎念，必自称朕，禁称孤）。\n最新剧情：${lastFullTurn}\n${lastSceneEnding}\n${relCtx}\n请输出纯 JSON 对象：\n{"visitors":{"entries":["明细1","明细2","明细3"],"mood":"四字","murmur":"自称朕"},"actions":{"entries":["明细1","明细2","明细3"],"mood":"四字","murmur":"自称朕"},"meals":{"entries":["早膳明细","午膳明细","晚膳夜茶明细"],"mood":"四字","murmur":"自称朕"},"memorials":{"entries":["折子1","折子2","折子3"],"mood":"四字","murmur":"自称朕"},"search":{"entries":["查阅1","查阅2","查阅3"],"mood":"四字","murmur":"自称朕"},"toilet":{"entries":["晨起盥洗更衣","午后恭房如厕与净手","夜间沐浴更衣"],"mood":"四字","murmur":"自称朕"},"leisure":{"entries":["消遣1","消遣2","消遣3"],"mood":"四字","murmur":"自称朕"},"desire":{"entries":["暗念1","暗念2","暗念3"],"mood":"四字","murmur":"自称朕"}}`;
      const resp = await callAI(prompt, "圣人日常八事窥探");
      const m = String(resp).match(/{[\s\S]*}/);
      if (m) {
        state.emperorSpyData = JSON.parse(m[0]);
        state.emperorSpyRevealed = {};
        state.emperorActiveDetailKey = null;
        state.emperorCardClickCount = 0;
        state.emperorPeekAccumulatedSec = 0;
        saveCurrentChatSessionData(false);
        renderEmperorSpySection();
        setGlobalRefreshingState(false);
        showModuleSuccessToast("偷窥圣人已就绪");
      }
    } catch (e) { setGlobalRefreshingState(false); }
    finally { if (btn) btn.textContent = "偷窥刷新"; }
  }

  async function generateStoryPlansOnly() {
    const btn = targetDoc.getElementById("twRefreshActionsBtn");
    if (btn) btn.textContent = "刷新中…";
    setGlobalRefreshingState(true, "刷新中…");
    try {
      await syncFromWorldbookAndChat(false);
      const uName = state.userName, customIdea = targetDoc.getElementById("twStoryCustomIdea")?.value.trim() || "";
      const { lastFullTurn, lastSceneEnding } = getFullStoryContext(), relCtx = getRelationshipAndFamiliarityContext();
      const customDirective = customIdea ? `请围绕「${customIdea}」衍生 6 个完整事件开端！` : `请结合当前剧情构思 6 个完整事件开端（升温剧情、冲突剧情、平行事件、暗流伏笔、日常插曲、破局转折）。`;
      const prompt = `你是《太微宫闻录》剧情总策划。\n${lastFullTurn}\n${lastSceneEnding}\n${relCtx}\n${customDirective}\n要求全第三人称（直接写${uName}、萧承稷），只写事件开端悬念，不写结果。输出纯 JSON：\n{"storyPlans":[{"tag":"升温剧情","title":"标题12字内","desc":"简述45字内","prompt":"点击填入对话框的第三人称事件开端描写85字左右"}]}`;
      const resp = await callAI(prompt, "剧情安排生成");
      const m = String(resp).match(/{[\s\S]*}/);
      if (m) {
        const parsed = JSON.parse(m[0]);
        if (Array.isArray(parsed.storyPlans)) {
          state.storyPlans = parsed.storyPlans.slice(0, 6).map(a => ({ tag: enforceAddressingRules(a.tag || "剧情安排"), title: enforceAddressingRules(a.title || ""), desc: enforceAddressingRules(a.desc || ""), prompt: enforceAddressingRules(a.prompt || "") }));
        }
        saveCurrentChatSessionData(false);
        renderActions();
        setGlobalRefreshingState(false);
        showModuleSuccessToast("剧情发展安排");
      }
    } catch (e) { setGlobalRefreshingState(false); }
    finally { if (btn) btn.textContent = "手动刷新"; }
  }

  async function refreshWorldOnly(e, fromGlobalTask = false) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const btn = targetDoc.getElementById("twRefreshWorldBtn");
    if (btn) btn.textContent = "刷新中…";
    if (!fromGlobalTask) setGlobalRefreshingState(true, "刷新中…");
    try {
      await syncFromWorldbookAndChat(false);
      const { lastFullTurn, lastSceneEnding } = getFullStoryContext();
      const prompt = `请根据最新剧情推演此刻同步发生的宫内动态 4 条与宫外动态 3 条。后妃写为「真名（位分）」。\n${lastFullTurn}\n${lastSceneEnding}\n输出纯 JSON：\n{"palaceDynamics":[{"npc":"姓名（位分或官职）","event":"动向50字内","tag":"地点"}],"outsideDynamics":[{"npc":"身份·姓名","event":"动向50字内","tag":"坊市或边关"}]}`;
      const resp = await callAI(prompt, "世界动态刷新");
      const m = String(resp).match(/{[\s\S]*}/);
      if (m) {
        const p = JSON.parse(m[0]);
        if (Array.isArray(p.palaceDynamics)) state.palaceDynamics = p.palaceDynamics.map(x => ({ npc: enforceAddressingRules(x.npc), event: enforceAddressingRules(x.event), tag: enforceAddressingRules(x.tag || "太微宫内") }));
        if (Array.isArray(p.outsideDynamics)) state.outsideDynamics = p.outsideDynamics.map(x => ({ npc: enforceAddressingRules(x.npc), event: enforceAddressingRules(x.event), tag: enforceAddressingRules(x.tag || "宫墙之外") }));
        saveCurrentChatSessionData(false);
        renderWorldLists();
        if (!fromGlobalTask) { setGlobalRefreshingState(false); showModuleSuccessToast("宫内外世界动态"); }
      }
    } catch (err) { if (!fromGlobalTask) setGlobalRefreshingState(false); }
    finally { if (btn) btn.textContent = "手动刷新"; }
  }

  const FORUM_NPC_ROSTER = `每一个主帖 author 和评论 nick 必须采用「趣味网名（真名·位分或身份）」格式（如“今日有戏听吗（苏枕月·丽嫔）”、“百步穿杨将门女（秦昭华·德妃）”、“飞龙厩第一快马（霍惊弦）”）。`;

  async function refreshForumOnly(e, fromGlobalTask = false) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const btn = targetDoc.getElementById("twRefreshForumBtn");
    if (btn) btn.textContent = "刷新中…";
    if (!fromGlobalTask) setGlobalRefreshingState(true, "刷新中…");
    try {
      await syncFromWorldbookAndChat(false);
      const { lastFullTurn, lastSceneEnding } = getFullStoryContext();
      const relCtx = getRelationshipAndFamiliarityContext(false), styleBlock = getForumStylePromptBlock();
      const prompt = `根据最新剧情生成 4 条太微宫论坛热帖，每帖 4~6 条评论，楼层间安排 NPC 互相 @楼上NPC 回复互怼！\n${lastFullTurn}\n${lastSceneEnding}\n${relCtx}\n${styleBlock}\n${FORUM_NPC_ROSTER}\n输出纯 JSON 数组：\n[{"author":"趣味网名（真名·位分）","title":"标题","content":"正文65字内","tags":["热议"],"comments":[{"nick":"趣味网名（真名·位分）","text":"评论内容45字内"}]}]`;
      const resp = await callAI(prompt, "宫内外坛刷新", true, false);
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) {
        state.posts = JSON.parse(m[0]).map((x, i) => ({
          id: Date.now() + i, author: pickForumNick(x, i), time: "刚刚",
          title: enforceAddressingRules(x.title || "宫中闲话", true), content: pickForumText(x),
          tags: Array.isArray(x.tags) ? x.tags : ["闲谈"], likes: Math.floor(Math.random() * 60) + 15, liked: false,
          comments: Array.isArray(x.comments) ? x.comments.map((c, cIdx) => ({ user: pickForumNick(c, i * 5 + cIdx + 1), text: pickForumText(c) })).filter(c => c.text) : []
        }));
        state.replyTargets = {};
        saveCurrentChatSessionData(false);
        renderForum(targetDoc.getElementById("twSearch").value);
        if (!fromGlobalTask) { setGlobalRefreshingState(false); showModuleSuccessToast("宫内外坛热帖"); }
      }
    } catch (err) { if (!fromGlobalTask) setGlobalRefreshingState(false); }
    finally { if (btn) btn.textContent = "手动刷新"; }
  }

  async function syncAllWithAI() {
    const btn = targetDoc.getElementById("twBtnApiSync");
    if (btn) btn.textContent = "刷新中…";
    setGlobalRefreshingState(true, "全部模块刷新中…");
    try {
      await syncFromWorldbookAndChat(false);
      const firstHasName = state.plotSummary.length > 0 && String(state.plotSummary[0]?.summary || "").includes(state.userName);
      if (!state.plotSummary.length || !firstHasName) await rebuildFullLongTimeline(true);
      else await autoGenerateCorePlotData(true, { doStatus: true, doPlot: true });
      await refreshWorldOnly(null, true);
      await refreshForumOnly(null, true);
      setGlobalRefreshingState(false);
      showModuleSuccessToast("全部模块同步刷新完毕");
    } catch (e) { setGlobalRefreshingState(false); }
    finally { renderAll(); if (btn) btn.textContent = "全部刷新"; }
  }

  function maskRealIdentityForAnonPrompt(rawStr, aliasName) {
    if (!rawStr) return "";
    const uName = state.userName || detectCurrentUserName();
    let res = String(rawStr);
    if (uName) res = res.split(uName).join(aliasName);
    if (state.userIdentity && state.userIdentity !== "未同步") res = res.split(state.userIdentity).join("神秘宫人");
    return res;
  }

  async function triggerNpcCommentReply(post, text, targetNpc, isNewPost = false) {
    const randomReplyCount = isNewPost ? 5 : 4;
    const usingAlias = isForumUsingAlias(), forumUser = getForumUserAuthor();
    setGlobalRefreshingState(true, "正在盖楼回复…");
    try {
      const relCtx = getRelationshipAndFamiliarityContext(usingAlias), styleBlock = getForumStylePromptBlock();
      const identityRule = usingAlias
        ? `当前发帖/回帖人使用的是纯匿名马甲「${forumUser}」！全场NPC 100%不知道TA的真名，请让NPC根据发言口吻盲猜TA身份！`
        : `当前使用的是公开本名「${state.userName}」（${getUserFullTag()}），请按熟识度回应。`;
      const existingComments = Array.isArray(post.comments) ? post.comments : [];
      const fullThreadHistory = existingComments.map((c, idx) => `[${idx + 1}楼] ${c.isSelfUser ? forumUser : (c.user || c.nick || "路人")}：${usingAlias ? maskRealIdentityForAnonPrompt(c.text, forumUser) : c.text}`).join("\n");
      const safePostTitle = usingAlias ? maskRealIdentityForAnonPrompt(post.title, forumUser) : post.title;
      const safePostContent = usingAlias ? maskRealIdentityForAnonPrompt(post.content, forumUser) : post.content;
      const safeInputText = usingAlias ? maskRealIdentityForAnonPrompt(text, forumUser) : text;
      const prompt = `这里是《太微宫内外坛》盖楼现场。\n主帖：《${safePostTitle}》：“${safePostContent}”\n历史楼层：\n${fullThreadHistory || "无"}\n刚刚「${forumUser}」发言：“${safeInputText}”${targetNpc ? `（点名回复 ${targetNpc}）` : ""}。\n请生成 ${randomReplyCount} 条新评论（包含回复 @${forumUser} 以及后楼NPC点名回复 @前楼NPC）！\n${styleBlock}\n${identityRule}\n${relCtx}\n${FORUM_NPC_ROSTER}\n输出纯 JSON 数组：\n[{"nick":"趣味网名（真名·位分）","text":"鲜活回复45字内"}]`;
      const resp = await callAI(prompt, "论坛全楼层互通回复", true, usingAlias);
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) {
        const arr = JSON.parse(m[0]);
        for (let i = 0; i < arr.length; i++) {
          const r = arr[i], rNick = pickForumNick(r, i + post.comments.length);
          let replyTxt = pickForumText(r);
          if (rNick && replyTxt) {
            await new Promise(res => setTimeout(res, 420));
            if (usingAlias && state.userName && replyTxt.includes(state.userName)) replyTxt = replyTxt.split(state.userName).join(forumUser);
            post.comments.push({ user: rNick, text: replyTxt });
            saveCurrentChatSessionData(false);
            renderForum(targetDoc.getElementById("twSearch").value);
          }
        }
        showModuleSuccessToast("论坛NPC已接话互怼盖楼");
      }
      setGlobalRefreshingState(false);
    } catch (e) { setGlobalRefreshingState(false); }
  }

  function scanChatForActiveDmNpcs() {
    try {
      const recentMsgs = getRawChatList(18);
      const combinedText = recentMsgs.map(m => m.raw).join("\n") + "\n" + state.plotSummary.map(p => p.summary).join("\n");
      const activeFirst = [], rest = [];
      state.dmNpcOptions.forEach(npc => {
        if (npc.id === "萧承稷") { activeFirst.unshift(npc); return; }
        const kws = npc.keywords || [npc.name.replace(/（.*）/, "")];
        if (kws.some(k => k && combinedText.includes(k))) activeFirst.push({ ...npc, inCurrentPlot: true });
        else rest.push({ ...npc, inCurrentPlot: false });
      });
      state.dmNpcOptions = [...activeFirst, ...rest];
    } catch (e) {}
  }

  async function refreshDmRosterFromPlotAndWorldbook() {
    const btn = targetDoc.getElementById("twDmRefreshRosterBtn");
    if (btn) { btn.disabled = true; btn.textContent = "扫描中…"; }
    try {
      scanChatForActiveDmNpcs();
      const { lastFullTurn, historyText } = getFullStoryContext();
      const prompt = `扫描当前剧情，列出最适合与女主 ${state.userName} 私聊的 4~6 位登场人物（后妃写为「真名（位分）」）。\n${historyText.slice(-800)}\n${lastFullTurn}\n输出纯 JSON 数组：\n[{"id":"人物名称","title":"身份","personality":"性格与说话口吻"}]`;
      const resp = await callAI(prompt, "扫描剧情可选私聊人物");
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) {
        JSON.parse(m[0]).forEach(item => {
          if (!item || !item.id) return;
          const stdId = formatConsortStandardName(enforceAddressingRules(item.id));
          if (stdId === state.userName) return;
          const existing = state.dmNpcOptions.find(x => x.id === stdId || x.name === stdId);
          if (existing) existing.inCurrentPlot = true;
          else state.dmNpcOptions.splice(1, 0, { id: stdId, name: stdId, display: `${stdId}（${enforceAddressingRules(item.title || "剧情人物")}）`, title: enforceAddressingRules(item.title || "剧情登场人物"), personality: enforceAddressingRules(item.personality || "贴合当前剧情人设"), inCurrentPlot: true, isDynamic: true });
        });
        saveCurrentChatSessionData(false);
        renderDmSection();
        showModuleSuccessToast("已更新可选私聊人物");
      }
    } catch (e) { scanChatForActiveDmNpcs(); renderDmSection(); }
    finally { if (btn) { btn.disabled = false; btn.textContent = "🔄 刷新人物"; } }
  }

  function renderDmNpcDropdown() {
    const sel = targetDoc.getElementById("twDmNpcSelect");
    if (!sel) return;
    sel.innerHTML = state.dmNpcOptions.map(n => `<option value="${n.id}" ${n.id === state.dmActiveNpc ? "selected" : ""}>${n.inCurrentPlot ? "【剧情登场】" : ""}${n.display || `${n.name}（${n.title}）`}</option>`).join("");
  }

  function updateDmQuoteBar() {
    const bar = targetDoc.getElementById("twDmQuoteBar"), txt = targetDoc.getElementById("twDmQuoteText"), inp = targetDoc.getElementById("twDmInput");
    const npcName = state.dmActiveNpc || "萧承稷";
    if (!bar || !txt) return;
    if (state.dmQuoteTarget) {
      bar.classList.add("active");
      txt.innerHTML = `正在引用 <b>${state.dmQuoteTarget.sender}</b>：“${state.dmQuoteTarget.text}”`;
      if (inp) inp.placeholder = `引用回复 ${npcName}……`;
    } else {
      bar.classList.remove("active"); txt.innerHTML = "";
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
      if (m.type === "system" || m.type === "join") return `<div class="tw-chat-sys-tip">— ${enforceAddressingRules(m.text)} —</div>`;
      const quoteHtml = m.quote ? `<div class="tw-chat-quoted-block">「${m.quote.sender}：${m.quote.text}」</div>` : "";
      const quoteBtnHtml = !m.self ? `<button type="button" class="tw-chat-quote-btn" data-dm-quote-idx="${idx}">引用</button>` : "";
      return `<div class="tw-chat-msg ${m.self ? "self" : ""}"><div class="tw-chat-head-row"><span class="tw-chat-sender">${m.sender}</span>${quoteBtnHtml}</div><div class="tw-chat-bubble">${quoteHtml}<div>${m.text}</div></div></div>`;
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
    state.dmHistories[npcId].push({ sender: state.userName, text: enforceAddressingRules(userMsg), quote: quotedObj, self: true });
    saveCurrentChatSessionData(false);
    renderDmSection();
    if (sendBtn) { sendBtn.disabled = true; sendBtn.textContent = "等待回复…"; }
    try {
      const memLimit = Math.max(4, Math.min(60, Number(config.chatMemoryCount) || 20));
      const historySlice = state.dmHistories[npcId].slice(-memLimit);
      const hist = historySlice.map(m => m.type ? `[${m.text}]` : `${m.sender}：${m.text}`).join("\n");
      const relCtx = getRelationshipAndFamiliarityContext();
      const prompt = `这里是 ${state.userName} 与【${npcMeta.name}（${npcMeta.title}）】的 1对1 私密对话。\n人设：${npcMeta.personality}（萧承稷必自称朕，禁称孤）\n${relCtx}\n最近记忆：\n${hist}\n刚刚 ${state.userName} 发来消息：“${userMsg}”。请让 ${npcMeta.name} 直接回复 1~3 条简短自然的私聊消息。\n直接输出纯 JSON 数组：\n[{"sender": "${npcMeta.name}", "text": "回复内容"}]`;
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
          state.dmHistories[npcId].push({ sender: npcMeta.name, text: cleanTxt, quote: i === 0 && quotedObj ? { sender: state.userName, text: userMsg } : null, self: false });
          saveCurrentChatSessionData(false);
          renderDmSection();
        }
        if (lastReplyText) showWechatNotification(`${npcMeta.name}（私聊）`, lastReplyText, { tab: "games", subgame: "dm", npc: npcMeta.id });
      }
    } catch (e) {}
    finally { if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = "发送"; } }
  }

  async function syncDmWithCurrentStory() {
    const npcId = state.dmActiveNpc || "萧承稷";
    const npcMeta = state.dmNpcOptions.find(x => x.id === npcId) || BASE_DM_NPC_CATALOG[0];
    const btn = targetDoc.getElementById("twDmSyncStoryBtn");
    if (btn) { btn.disabled = true; btn.textContent = "同步中…"; }
    try {
      await syncFromWorldbookAndChat(false);
      const { lastFullTurn, lastSceneEnding } = getFullStoryContext(), relCtx = getRelationshipAndFamiliarityContext();
      const prompt = `根据最新剧情让【${npcMeta.name}（${npcMeta.title}）】主动给 ${state.userName} 发来 2~3 条与当前剧情紧密相关的私聊消息！\n人设：${npcMeta.personality}\n${lastFullTurn}\n${lastSceneEnding}\n${relCtx}\n输出纯 JSON 数组：\n[{"sender": "${npcMeta.name}", "text": "主动发来的消息"}]`;
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
            state.dmHistories[npcId].push({ sender: npcMeta.name, text: lastTxt, self: false });
            saveCurrentChatSessionData(false);
            renderDmSection();
          }
        }
        if (lastTxt) showWechatNotification(`${npcMeta.name}（剧情传讯）`, lastTxt, { tab: "games", subgame: "dm", npc: npcMeta.id });
      }
    } catch (e) {}
    finally { if (btn) { btn.disabled = false; btn.textContent = "同步剧情开聊"; } }
  }

  async function convertDmToOfflineSceneAndFill() {
    const npcId = state.dmActiveNpc || "萧承稷";
    const npcMeta = state.dmNpcOptions.find(x => x.id === npcId) || BASE_DM_NPC_CATALOG[0];
    const list = (state.dmHistories[npcId] || []).filter(m => !m.type && m.text);
    const btn = targetDoc.getElementById("twDmExportOfflineBtn");
    if (!list.length) { showModuleSuccessToast("当前私聊为空，请先聊几句再转化"); return; }
    if (btn) { btn.disabled = true; btn.textContent = "转化中…"; }
    try {
      const memLimit = Math.max(4, Math.min(60, Number(config.chatMemoryCount) || 20));
      const recentChat = list.slice(-memLimit).map(m => `${m.sender}：“${m.text}”`).join("\n");
      const { lastSceneEnding } = getFullStoryContext();
      const prompt = `请将下方 ${state.userName} 与【${npcMeta.name}】在私聊中的对话自然转化为一段符合大景王朝背景的【线下当面交谈或宫人密信传话】第三人称剧情描写（约120字），严禁出现手机、微信、私聊等现代词。\n当前场景：${lastSceneEnding || state.location}\n对话记录：\n${recentChat}`;
      const resp = await callAI(prompt, `私聊转线下剧情·${npcMeta.name}`);
      const sceneText = cleanPureText(resp);
      if (sceneText) { fillUserChatInput(sceneText); showModuleSuccessToast("已转化为线下剧情并填入酒馆输入框"); }
    } catch (e) {}
    finally { if (btn) { btn.disabled = false; btn.textContent = "转线下填入酒馆"; } }
  }

  const PRESET_MEMORIALS = [
    { author: "御史大夫 · 魏征", title: "《参定远侯世子霍惊弦于北苑飞龙厩私烤全羊疏》", content: "臣启陛下：今日卯时三刻，定远侯世子霍惊弦竟在皇家飞龙厩旁架起铁锅炭火，偷烤西域肥尾绵羊，香气飘进宣政殿，引得早朝百官频频咽口水！请罚霍惊弦抄《景律》百遍，并没收烤羊！", options: ["准奏。烤羊即刻没收，趁热呈送甘露殿御案。", "魏公想吃直说便是，赐魏御史烤羊腿一条。", "罚霍惊弦再烤十只分与北衙羽林卫，少一只罚俸半年。"] },
    { author: "端王 · 萧承泽", title: "《恳请皇兄免除臣弟本月弘文馆策论功课折》", content: "臣弟承泽叩首：臣弟新得的西域细犬“追风”正值换毛期，昨日路过吏部不小心放狗咬掉了卢尚书半截袍角，臣弟愿自罚去北苑替皇兄驯马一月，求免背书！", options: ["咬得好。赏追风肉骨两根，但策论照背，少一篇禁足一月。", "把西域细犬牵来内廷养两日，你的策论功课翻倍。", "准去北苑驯马，顺道每日牵狗去卢尚书府外溜两圈。"] }
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
  let gomokuBoard = [], gomokuOver = false;
  const XIAO_LINES = {
    start: "“朕让你执黑先行，落子无悔，莫要耍赖。”",
    mid: ["“步子迈得太急，两翼空虚。兵法与棋道，皆忌贪功。”", "“这步尚可，倒比霍惊弦那臭棋篓子强上几分。”", "“想声东击西？在朕眼皮底下做局，你还嫩了些。”", "“盯着朕的脸看做什么？棋盘上可没写着破局之法。”"],
    block: ["“暗度陈仓连成三子？可惜被朕看穿了，这条路封死了。”", "“趁朕饮茶时偷连四子？这路数倒是跟谢无咎学的精明，堵上。”"],
    win: "“五子连珠，承让。愿赌服输，今夜留在甘露殿替朕研墨，不许逃。”",
    lose: "“方才北苑风大，吹迷了朕的眼。罢了，答应你的大盈内库奇珍照赏不误，再来一局。”"
  };

  function initGomoku() {
    gomokuBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
    gomokuOver = false;
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

  function getGroupThemePromptBlock() {
    const uName = state.userName || detectCurrentUserName();
    const key = config.groupChatTheme || "story_sync";
    const preset = GROUP_CHAT_THEMES[key] || GROUP_CHAT_THEMES.story_sync;
    const customTxt = (config.groupChatCustomThemeText || "").trim();
    const desc = (key === "custom" && customTxt) ? `用户自定义群聊主题与世界观设定：【${customTxt}】` : preset.desc;
    const isIfMode = key === "user_empress_harem" || key.startsWith("if_") || (key === "custom" && customTxt);
    const consortFormatRule = `\n【群聊角色命名与人设死命令】：后宫妃嫔 sender 必须写为「真名（位分）」格式！萧承稷发言时（非女皇反串主题下）必自称“朕”或“我”，禁称“孤”！${key === "user_empress_harem" ? `在当前【我是皇帝】主题下，${uName} 才是女皇陛下（自称朕），萧承稷、沈砚、陆敬、谢无咎、霍惊弦、温言酌、裴玄度、卫凛等全都是女皇陛下 ${uName} 的后宫侍君/皇夫，尊称 ${uName} 为“陛下”，争相吃醋求翻牌侍寝！` : ""}`;
    return { name: preset.name, isIfMode, block: `【当前太微群聊主题模式：${preset.name}】\n主题要求：${desc}\n${consortFormatRule}` };
  }

  function updateGroupThemeUI() {
    rootEl.querySelectorAll("#twGroupThemeChips .tw-chip").forEach(chip => chip.classList.toggle("active", chip.dataset.gtheme === (config.groupChatTheme || "story_sync")));
    const wrap = targetDoc.getElementById("twGroupCustomThemeWrap"), inp = targetDoc.getElementById("twGroupCustomThemeInput");
    if (wrap) wrap.style.display = config.groupChatTheme === "custom" ? "block" : "none";
    if (inp && targetDoc.activeElement !== inp) inp.value = config.groupChatCustomThemeText || "";
  }

  function updateChatQuoteBar() {
    const bar = targetDoc.getElementById("twChatQuoteBar"), txt = targetDoc.getElementById("twChatQuoteText"), inp = targetDoc.getElementById("twChatroomInput");
    if (!bar || !txt) return;
    if (state.chatQuoteTarget) {
      bar.classList.add("active");
      txt.innerHTML = `正在引用回复 <b>@${state.chatQuoteTarget.sender}</b>：“${state.chatQuoteTarget.text}”`;
      if (inp) inp.placeholder = `单独回复 @${state.chatQuoteTarget.sender}……`;
    } else {
      bar.classList.remove("active"); txt.innerHTML = "";
      if (inp) inp.placeholder = "发句闲话聊聊……";
    }
  }

  function renderChatroom() {
    updateGroupThemeUI();
    const box = targetDoc.getElementById("twChatroomBox");
    if (!box) return;
    targetDoc.getElementById("twChatroomRoleBadge").textContent = config.groupChatTheme === "user_empress_harem" ? `女皇陛下·${state.userName}` : getUserFullTag();
    const list = Array.isArray(state.groupMessages) ? state.groupMessages : [];
    if (!list.length) {
      box.innerHTML = `<div class="tw-empty-hint" style="margin:auto;">当前群聊默认空白。<br>请选好上方主题后点击右上角「刷新群聊」，或在下方直接发送消息开启群聊！</div>`;
      updateChatQuoteBar();
      return;
    }
    box.innerHTML = list.map((m, idx) => {
      if (m.type === "join" || m.type === "system") return `<div class="tw-chat-sys-tip">— ${enforceAddressingRules(m.text)} —</div>`;
      const stdSender = formatConsortStandardName(m.sender);
      const quoteHtml = m.quote ? `<div class="tw-chat-quoted-block">「${formatConsortStandardName(m.quote.sender)}：${m.quote.text}」</div>` : "";
      const quoteBtnHtml = !m.self ? `<button type="button" class="tw-chat-quote-btn" data-chat-quote-idx="${idx}">引用</button>` : "";
      return `<div class="tw-chat-msg ${m.self ? "self" : ""}"><div class="tw-chat-head-row"><span class="tw-chat-sender">${stdSender}</span>${quoteBtnHtml}</div><div class="tw-chat-bubble">${quoteHtml}<div>${m.text}</div></div></div>`;
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
      await new Promise(res => setTimeout(res, i === 0 ? 350 : 500));
      if (isSys) {
        const joinTxt = cleanPureText(r.text || `${r.sender || "某人"} 进入了聊天室`);
        if (joinTxt) { state.groupMessages.push({ type: "join", text: joinTxt }); saveCurrentChatSessionData(false); renderChatroom(); }
      } else if (r.sender && r.text) {
        lastSender = formatConsortStandardName(enforceAddressingRules(r.sender));
        lastText = cleanPureText(r.text);
        state.groupMessages.push({
          sender: lastSender, text: lastText,
          quote: r.quote && r.quote.sender ? { sender: formatConsortStandardName(enforceAddressingRules(r.quote.sender)), text: cleanPureText(r.quote.text) } : null,
          self: false
        });
        saveCurrentChatSessionData(false);
        renderChatroom();
      }
    }
    if (lastSender && lastText) showWechatNotification(`太微群聊 · ${lastSender}`, lastText, { tab: "games", subgame: "chatroom" });
  }

  function getEmptyHintText(modName) {
    if (state.isGlobalRefreshing) return "刷新中…";
    if (modName && isAutoModuleOn(modName)) return "目前空白，若未自动刷新请点击手动刷新。";
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
    const nickInput = targetDoc.getElementById("twForumNickInput"), previewEl = targetDoc.getElementById("twCurrentForumAuthorPreview");
    if (nickInput && targetDoc.activeElement !== nickInput) nickInput.value = config.forumNickname || "";
    if (previewEl) {
      const author = getForumUserAuthor(), curStyleKey = config.forumSpeakStyle || "lively";
      const curStyleName = FORUM_STYLE_PRESETS[curStyleKey]?.name || "鲜活茶水间";
      previewEl.textContent = (isForumUsingAlias() ? `${author}（真·匿名马甲 · 全员盲猜身份）` : `${author}（默认空白 · 使用本名）`) + ` · 当前画风：【${curStyleName}】`;
    }
    rootEl.querySelectorAll("#twForumStyleChips .tw-chip").forEach(chip => chip.classList.toggle("active", chip.dataset.fstyle === (config.forumSpeakStyle || "lively")));
    const customWrap = targetDoc.getElementById("twForumCustomStyleWrap"), customInput = targetDoc.getElementById("twForumCustomStyleInput");
    if (customWrap) customWrap.style.display = config.forumSpeakStyle === "custom" ? "block" : "none";
    if (customInput && targetDoc.activeElement !== customInput) customInput.value = config.forumCustomStyleText || "";
  }

  function syncAutoSwitchSettingsUI() {
    const masterBtn = targetDoc.getElementById("twMasterAutoToggleBtn"), masterHint = targetDoc.getElementById("twAutoMasterStatusHint");
    if (masterBtn) { masterBtn.classList.toggle("on", !!config.autoMasterAll); masterBtn.textContent = config.autoMasterAll ? "已开启" : "已关闭"; }
    if (masterHint) masterHint.textContent = config.autoMasterAll ? "总控全开" : "自定义模式";
    rootEl.querySelectorAll(".tw-sub-auto-btn").forEach(btn => {
      const mod = btn.dataset.mod, row = btn.closest(".tw-sub-switch-row");
      if (config.autoMasterAll) {
        btn.disabled = true; btn.classList.add("disabled-gray"); btn.classList.remove("on"); btn.textContent = "跟随总控";
        if (row) row.classList.add("locked-row");
      } else {
        btn.disabled = false; btn.classList.remove("disabled-gray");
        const isOn = Boolean(config.autoModules && config.autoModules[mod]);
        btn.classList.toggle("on", isOn); btn.textContent = isOn ? "已开启" : "已关闭";
        if (row) row.classList.remove("locked-row");
      }
    });
  }

  function renderActions() {
    const planBox = targetDoc.getElementById("twStoryPlanList");
    if (!planBox) return;
    if (!state.storyPlans.length) { planBox.innerHTML = `<div class="tw-empty-hint">${getEmptyHintText("")}</div>`; }
    else {
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
    const aff = Number(state.affection) || 0, statusEmptyTxt = getEmptyHintText("status");
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
    if (!state.plotSummary.length) plotBox.innerHTML = `<div class="tw-empty-hint">${getEmptyHintText("plot")}</div>`;
    else {
      plotBox.innerHTML = `<div class="tw-timeline">` + state.plotSummary.map((item, idx) => `
        <div class="tw-tl-item">
          <div class="tw-tl-meta">
            <span class="tw-badge">第 ${idx + 1} 幕</span>
            <span class="tw-tl-time">时间：${enforceAddressingRules(item.time || state.time || "延昭二年")}</span>
            <span class="tw-tl-loc">地点：${enforceAddressingRules(item.location || state.location || "太微宫")}</span>
          </div>
          <div class="tw-tl-summary">${ensureUserNameInSummary(item.summary || item.event || "")}</div>
        </div>`).join("") + `</div>`;
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
    if (!state.posts.length) { box.innerHTML = `<div class="tw-box"><div class="tw-empty-hint">${getEmptyHintText("")}</div></div>`; return; }
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
              return `<div class="tw-cmt-line"><div><span class="tw-cmt-u">[${cIdx + 1}L] ${cNick}：</span><span>${pickForumText(c)}</span></div><button type="button" class="tw-reply-npc-btn" data-act="set-target" data-id="${p.id}" data-npc="${cNick}">回复TA</button></div>`;
            }).join("")}
            <div class="tw-reply-target-bar ${targetNpc ? "active" : ""}">
              <span>正在单独回复：<b>@${targetNpc}</b></span>
              <button type="button" class="tw-act-btn" data-act="clear-target" data-id="${p.id}" style="color:var(--accent);font-weight:bold;">切换为直接回复全楼</button>
            </div>
            <div class="tw-cmt-send">
              <input id="tw-cin-${p.id}" placeholder="${targetNpc ? `以 ${curAuthor} 单独回复 @${targetNpc}…` : `以 ${curAuthor} 直接接话盖楼…`}">
              <button type="button" data-act="reply" data-id="${p.id}">${targetNpc ? "回复TA" : "直接回复"}</button>
            </div>
          </div>
        </div>`;
    }).join("");
  }

  targetDoc.getElementById("twBtnClose").addEventListener("click", () => overlay.classList.add("tw-hidden"));
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.add("tw-hidden"); });
  targetDoc.getElementById("twBtnClearAll").addEventListener("click", () => {
    explicitClearCurrentArchive();
    const vaultKey = getActiveVaultKey();
    writeToTavernBackend(vaultKey, {});
    try {
      localStorage.removeItem(LOCAL_BACKUP_PREFIX + vaultKey);
      if (targetWin.__TW_PERSIST_CACHE_V35) delete targetWin.__TW_PERSIST_CACHE_V35[vaultKey];
    } catch (e) {}
    renderAll();
    showModuleSuccessToast("已清空当前存档数据");
  });

  targetDoc.getElementById("twSaveForumNickBtn").addEventListener("click", () => {
    const val = targetDoc.getElementById("twForumNickInput").value.trim();
    config.forumNickname = val; saveConfig(); updateForumNicknameUI();
    renderForum(targetDoc.getElementById("twSearch").value);
    showModuleSuccessToast(val ? `已启用匿名马甲：${val}` : "已恢复默认本名");
  });
  targetDoc.getElementById("twResetForumNickBtn").addEventListener("click", () => {
    config.forumNickname = ""; targetDoc.getElementById("twForumNickInput").value = "";
    saveConfig(); updateForumNicknameUI(); renderForum(targetDoc.getElementById("twSearch").value);
    showModuleSuccessToast("已清空论坛昵称（使用本名）");
  });
  targetDoc.getElementById("twForumNickInput").addEventListener("input", (e) => { config.forumNickname = e.target.value.trim(); saveConfig(); updateForumNicknameUI(); });
  targetDoc.getElementById("twForumStyleChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".tw-chip[data-fstyle]"); if (!chip) return;
    config.forumSpeakStyle = chip.dataset.fstyle || "lively"; saveConfig(); updateForumNicknameUI();
  });
  targetDoc.getElementById("twForumCustomStyleInput").addEventListener("input", (e) => { config.forumCustomStyleText = e.target.value.trim(); saveConfig(); });

  targetDoc.getElementById("twGroupThemeChips")?.addEventListener("click", (e) => {
    const chip = e.target.closest(".tw-chip[data-gtheme]"); if (!chip) return;
    const newTheme = chip.dataset.gtheme || "story_sync", changed = config.groupChatTheme !== newTheme;
    config.groupChatTheme = newTheme; saveConfig(); updateGroupThemeUI();
    chip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    if (changed) { state.groupMessages = []; state.chatQuoteTarget = null; saveCurrentChatSessionData(false); renderChatroom(); }
  });
  targetDoc.getElementById("twGroupCustomThemeInput")?.addEventListener("input", (e) => { config.groupChatCustomThemeText = e.target.value.trim(); saveConfig(); });

  targetDoc.getElementById("twDmNpcSelect")?.addEventListener("change", (e) => {
    state.dmActiveNpc = e.target.value || "萧承稷"; state.dmQuoteTarget = null; saveCurrentChatSessionData(false); renderDmSection();
  });
  targetDoc.getElementById("twDmRefreshRosterBtn")?.addEventListener("click", refreshDmRosterFromPlotAndWorldbook);
  targetDoc.getElementById("twDmBox")?.addEventListener("click", (e) => {
    const qBtn = e.target.closest("button[data-dm-quote-idx]"); if (!qBtn) return;
    const npcId = state.dmActiveNpc || "萧承稷", list = state.dmHistories[npcId] || [];
    const targetMsg = list[Number(qBtn.dataset.dmQuoteIdx)];
    if (targetMsg && !targetMsg.type) { state.dmQuoteTarget = { sender: targetMsg.sender, text: targetMsg.text }; updateDmQuoteBar(); targetDoc.getElementById("twDmInput")?.focus(); }
  });
  targetDoc.getElementById("twCancelDmQuoteBtn")?.addEventListener("click", () => { state.dmQuoteTarget = null; updateDmQuoteBar(); });
  targetDoc.getElementById("twDmSendBtn")?.addEventListener("click", () => {
    const inp = targetDoc.getElementById("twDmInput"), v = inp ? inp.value.trim() : ""; if (!v) return;
    inp.value = ""; handleDmUserSend(v);
  });
  targetDoc.getElementById("twDmInput")?.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); targetDoc.getElementById("twDmSendBtn")?.click(); } });
  targetDoc.getElementById("twDmSyncStoryBtn")?.addEventListener("click", syncDmWithCurrentStory);
  targetDoc.getElementById("twDmExportOfflineBtn")?.addEventListener("click", convertDmToOfflineSceneAndFill);
  targetDoc.getElementById("twDmClearBtn")?.addEventListener("click", () => {
    const npcId = state.dmActiveNpc || "萧承稷"; state.dmHistories[npcId] = []; state.dmQuoteTarget = null;
    saveCurrentChatSessionData(false); renderDmSection(); showModuleSuccessToast(`已清空与 ${npcId} 的私聊记录`);
  });

  targetDoc.getElementById("twMasterAutoToggleBtn").addEventListener("click", () => {
    config.autoMasterAll = !config.autoMasterAll; saveConfig(); syncAutoSwitchSettingsUI(); renderAll();
  });
  targetDoc.getElementById("twSubAutoSwitchList").addEventListener("click", (e) => {
    const btn = e.target.closest(".tw-sub-auto-btn"); if (!btn || config.autoMasterAll) return;
    const mod = btn.dataset.mod; if (!mod) return;
    config.autoModules[mod] = !config.autoModules[mod]; saveConfig(); syncAutoSwitchSettingsUI(); renderAll();
  });

  targetDoc.getElementById("twSavePlotPromptBtn").addEventListener("click", () => {
    config.chatMemoryCount = Math.max(4, Math.min(60, Number(targetDoc.getElementById("twChatMemoryCountInput")?.value) || 20));
    config.plotWordLimit = Math.max(15, Math.min(300, Number(targetDoc.getElementById("twPlotWordLimitInput").value) || DEFAULT_PLOT_WORD_LIMIT));
    config.plotCustomPrompt = targetDoc.getElementById("twPlotCustomPromptInput").value.trim() || DEFAULT_PLOT_CUSTOM_PROMPT;
    saveConfig(); syncSettingsUI(); showModuleSuccessToast("已保存记忆与摘要设置");
  });
  targetDoc.getElementById("twResetPlotPromptBtn").addEventListener("click", () => {
    config.chatMemoryCount = 20; config.plotWordLimit = DEFAULT_PLOT_WORD_LIMIT; config.plotCustomPrompt = DEFAULT_PLOT_CUSTOM_PROMPT;
    saveConfig(); syncSettingsUI(); showModuleSuccessToast("已恢复默认设置");
  });

  function renderSavedApiPresetsDropdown() {
    const sel = targetDoc.getElementById("twSavedApiPresetSelect"); if (!sel) return;
    sel.innerHTML = `<option value="">-- 新建 / 手动输入自定义 API --</option>` + (config.savedApiPresets || []).map(p => `<option value="${p.id}" ${p.id === config.activePresetId ? "selected" : ""}>${p.name} · ${p.model || "默认模型"}</option>`).join("");
  }

  function syncSettingsUI() {
    rootEl.setAttribute("data-theme", config.theme || "xuanpaper");
    rootEl.querySelectorAll(".tw-theme-btn").forEach(b => b.classList.toggle("active", b.dataset.themeVal === config.theme));
    const isCustom = config.apiMode === "custom";
    targetDoc.getElementById("twModeCardTavern")?.classList.toggle("active", !isCustom);
    targetDoc.getElementById("twModeCardCustom")?.classList.toggle("active", isCustom);
    targetDoc.getElementById("twCustomApiFields").style.display = isCustom ? "block" : "none";
    const badge = targetDoc.getElementById("twCurrentApiBadge");
    if (badge) badge.textContent = isCustom ? `其他 API：${config.apiName || config.apiModel || "自定义"}` : "当前：酒馆主 API";
    const plotBadge = targetDoc.getElementById("twPlotPromptBadge");
    if (plotBadge) plotBadge.textContent = `记忆${config.chatMemoryCount || 20}条 · 摘要${config.plotWordLimit || DEFAULT_PLOT_WORD_LIMIT}字`;
    targetDoc.getElementById("twChatMemoryCountInput").value = config.chatMemoryCount || 20;
    targetDoc.getElementById("twPlotWordLimitInput").value = config.plotWordLimit || DEFAULT_PLOT_WORD_LIMIT;
    targetDoc.getElementById("twPlotCustomPromptInput").value = config.plotCustomPrompt || DEFAULT_PLOT_CUSTOM_PROMPT;
    renderSavedApiPresetsDropdown();
    targetDoc.getElementById("twApiNameInput").value = config.apiName || "";
    targetDoc.getElementById("twApiUrlInput").value = config.apiUrl || "";
    targetDoc.getElementById("twApiKeyInput").value = config.apiKey || "";
    targetDoc.getElementById("twApiModelInput").value = config.apiModel || "";
    syncAutoSwitchSettingsUI(); updateForumNicknameUI(); updateGroupThemeUI(); renderApiLogs();
  }
  syncSettingsUI();

  rootEl.querySelectorAll(".tw-theme-btn").forEach(btn => btn.addEventListener("click", () => { config.theme = btn.dataset.themeVal; saveConfig(); syncSettingsUI(); }));
  [targetDoc.getElementById("twModeCardTavern"), targetDoc.getElementById("twModeCardCustom")].forEach(card => {
    if (!card) return;
    card.addEventListener("click", () => { config.apiMode = card.dataset.apiMode; saveConfig(); syncSettingsUI(); });
  });

  targetDoc.getElementById("twSavedApiPresetSelect").addEventListener("change", (e) => {
    const pid = e.target.value; config.activePresetId = pid;
    if (!pid) { targetDoc.getElementById("twApiNameInput").value = ""; return; }
    const found = (config.savedApiPresets || []).find(p => p.id === pid);
    if (found) { config.apiName = found.name; config.apiUrl = found.url; config.apiKey = found.key; config.apiModel = found.model; saveConfig(); syncSettingsUI(); }
  });

  targetDoc.getElementById("twDeleteApiPresetBtn").addEventListener("click", () => {
    const pid = targetDoc.getElementById("twSavedApiPresetSelect")?.value;
    const tip = targetDoc.getElementById("twApiTestResult");
    if (!pid) { tip.classList.add("show"); tip.textContent = "请先选择一个已保存的配置再删除。"; setTimeout(() => tip.classList.remove("show"), 1800); return; }
    config.savedApiPresets = (config.savedApiPresets || []).filter(p => p.id !== pid);
    config.activePresetId = ""; config.apiName = ""; saveConfig(); syncSettingsUI();
    tip.classList.add("show"); tip.textContent = "已删除该自定义 API 配置！"; setTimeout(() => tip.classList.remove("show"), 1800);
  });

  targetDoc.getElementById("twFetchModelsBtn").addEventListener("click", async () => {
    const rawUrl = targetDoc.getElementById("twApiUrlInput").value.trim(), key = targetDoc.getElementById("twApiKeyInput").value.trim();
    const tip = targetDoc.getElementById("twApiTestResult"); tip.classList.add("show");
    if (!rawUrl || !key) { tip.textContent = "请先填写 API 地址与 Key"; return; }
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
        saveConfig(); tip.textContent = `成功拉取 ${models.length} 个模型！`;
      }
    } catch (e) { tip.textContent = `拉取失败：${e.message}`; }
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
    saveCurrentChatSessionData(false);
    renderChatroom();

    sendBtn.disabled = true; sendBtn.textContent = "刷新中…";
    try {
      const msgCount = quotedObj ? 6 : 7;
      const memLimit = Math.max(4, Math.min(60, Number(config.chatMemoryCount) || 20));
      const historySlice = state.groupMessages.slice(-memLimit);
      const hist = historySlice.map(m => (m.type === "join" || m.type === "system") ? `[系统提示：${m.text}]` : `${m.sender}：${m.text}`).join("\n");
      const relCtx = getRelationshipAndFamiliarityContext();
      const themeInfo = getGroupThemePromptBlock();

      const prompt = `《太微宫茶话群聊》最近记忆上下文：\n${hist}\n\n${themeInfo.block}\n\n刚刚 ${sender} 在群里发了消息：“${userMsg}”${quotedObj ? `（引用了 @${quotedObj.sender} 的“${quotedObj.text}”）` : ""}。\n${themeInfo.isIfMode ? "" : relCtx}\n请模拟热闹的太微宫群聊，让 4~6 位不同性格的 NPC 围绕这句话与当前主题【${themeInfo.name}】热聊起来，输出 ${msgCount} 项 JSON 数组（中途可穿插 1 条 {"type": "join", "text": "某角色进入了聊天室"}，普通发言格式为 {"sender": "姓名（后妃带位分）", "text": "简短口语化消息6至24字"}）：`;
      const resp = await callAI(prompt, "太微群聊回复");
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) await appendChatMessagesWithDelay(JSON.parse(m[0]));
    } catch (e) {}
    finally { sendBtn.disabled = false; sendBtn.textContent = "发送"; }
  }

  async function triggerAiNpcRandomTopic() {
    const topicBtn = targetDoc.getElementById("twRandomChatTopicBtn");
    topicBtn.disabled = true; topicBtn.textContent = "刷新中…";
    try {
      const msgCount = 8;
      const relCtx = getRelationshipAndFamiliarityContext();
      const themeInfo = getGroupThemePromptBlock();

      state.groupMessages = [{ type: "system", text: `当前群聊主题：【${themeInfo.name}】` }];
      state.chatQuoteTarget = null;
      saveCurrentChatSessionData(false);
      renderChatroom();

      const prompt = `这里是《太微宫茶话群聊》。\n${themeInfo.block}\n${themeInfo.isIfMode ? "" : relCtx}\n请从霍惊弦、陆敬、沈砚、谢无咎、温言酌、端王萧承泽、裴玄度、苏枕月（丽嫔）、秦昭华（德妃）、崔清漪（淑妃）、卢婉兮（修仪）、柳如絮（婕妤）、赵怀安、萧承稷中挑 5~7 位不同人物，严格围绕当前主题【${themeInfo.name}】开启新话题斗嘴、八卦或修罗场争宠！总共生成 ${msgCount} 项 JSON 数组（中途可插入 1~2 条 {"type": "join", "text": "某某进入了聊天室"}，普通发言格式：{"sender": "姓名（后妃带位分）", "text": "简短口语化消息6至26字"}）：`;
      const resp = await callAI(prompt, `太微群聊·${themeInfo.name}`);
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) await appendChatMessagesWithDelay(JSON.parse(m[0]));
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
    state.groupMessages = []; state.chatQuoteTarget = null;
    saveCurrentChatSessionData(false); renderChatroom();
    showModuleSuccessToast("已清空群聊记录");
  });
  targetDoc.getElementById("twRandomChatTopicBtn").addEventListener("click", triggerAiNpcRandomTopic);

  targetDoc.getElementById("twForumList").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-act]"); if (!btn) return;
    e.stopPropagation();
    const act = btn.dataset.act, id = Number(btn.dataset.id), post = state.posts.find(p => p.id === id);
    if (!post) return;
    if (act === "like") {
      post.liked = !post.liked; post.likes += post.liked ? 1 : -1;
      saveCurrentChatSessionData(false); renderForum(targetDoc.getElementById("twSearch").value);
    } else if (act === "set-target") {
      state.replyTargets[id] = btn.dataset.npc || "";
      renderForum(targetDoc.getElementById("twSearch").value);
      targetDoc.getElementById(`tw-cin-${id}`)?.focus();
    } else if (act === "clear-target") {
      delete state.replyTargets[id];
      renderForum(targetDoc.getElementById("twSearch").value);
      targetDoc.getElementById(`tw-cin-${id}`)?.focus();
    } else if (act === "reply") {
      const inp = targetDoc.getElementById(`tw-cin-${id}`), val = inp ? inp.value.trim() : ""; if (!val) return;
      const tNpc = state.replyTargets[id] || "", authorName = getForumUserAuthor();
      post.comments.push({ isSelfUser: true, nick: authorName, user: authorName, text: enforceAddressingRules(tNpc ? `回复 @${tNpc}：${val}` : val, true) });
      delete state.replyTargets[id];
      saveCurrentChatSessionData(false);
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
      id: Date.now(), isSelfUser: true, author: authorName, nick: authorName, time: "刚刚",
      title: enforceAddressingRules(tEl.value.trim(), true),
      content: enforceAddressingRules(bEl.value.trim(), true),
      tags: ["新帖"], likes: 1, liked: true, comments: []
    };
    state.posts.unshift(np);
    tEl.value = ""; bEl.value = "";
    saveCurrentChatSessionData(false); renderForum();
    triggerNpcCommentReply(np, np.content, "", true);
  });

  targetDoc.getElementById("twSearch").addEventListener("input", (e) => renderForum(e.target.value));

  targetDoc.getElementById("tw-page-actions").addEventListener("click", (e) => {
    const card = e.target.closest(".tw-act-card"); if (!card) return;
    const idx = Number(card.dataset.planIdx), plan = state.storyPlans[idx];
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
      saveCurrentChatSessionData(false);
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
        state.boundChatId = getCurrentChatFileId();
        loadChatSessionData(true);
        syncFromWorldbookAndChat(false);
      }, 350));
    }
  } catch (e) {}

  loadChatSessionData(false);
  syncFromWorldbookAndChat(false);
  setTimeout(() => {
    if (!hasSubstantialData(state)) {
      if (loadChatSessionData(false)) renderAll();
    }
  }, 450);
  setTimeout(() => {
    if (!hasSubstantialData(state)) {
      if (loadChatSessionData(false)) renderAll();
    }
  }, 1200);
  try {
    var SOLO_ARCHIVE_PREFIX = "tw_palace_solo_archive_v35_";
    targetWin.__twIsManuallyCleared = false;

    // 1. 接管存档读写：严格按当前对话 ID 独立隔离，彻底斩断 global 全局变量与 v34 旧档串档！
    readFromTavernBackend = function (vaultKey) {
      if (targetWin.__twIsManuallyCleared) return null;
      try {
        var raw = localStorage.getItem(SOLO_ARCHIVE_PREFIX + vaultKey);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && parsed.__cleared) return null;
          if (hasSubstantialData(parsed)) return parsed;
        }
      } catch (e) {}
      return null;
    };

    writeToTavernBackend = function (vaultKey, payload) {
      try {
        if (!payload || Object.keys(payload).length === 0 || payload.__cleared) {
          localStorage.removeItem(SOLO_ARCHIVE_PREFIX + vaultKey);
          localStorage.removeItem(LOCAL_BACKUP_PREFIX + vaultKey);
          localStorage.removeItem(vaultKey);
          return;
        }
        targetWin.__twIsManuallyCleared = false;
        localStorage.setItem(SOLO_ARCHIVE_PREFIX + vaultKey, JSON.stringify(payload));
      } catch (e) {}
    };

    // 2. 阻止每秒定时器在手动清空后或新档状态下偷偷把旧数据恢复回来
    var origLoadChatSessionData = loadChatSessionData;
    loadChatSessionData = function (explicitSlotOrChatSwitch) {
      if (explicitSlotOrChatSwitch) {
        targetWin.__twIsManuallyCleared = false;
      }
      if (targetWin.__twIsManuallyCleared) {
        state.isHydrated = true;
        return false;
      }
      return origLoadChatSessionData(explicitSlotOrChatSwitch);
    };

    // 3. 重新绑定【清空本档】按钮：一键连根拔除当前档一切缓存，绝不反弹复原！
    var oldClearBtn = targetDoc.getElementById("twBtnClearAll");
    if (oldClearBtn && oldClearBtn.parentNode) {
      var newClearBtn = oldClearBtn.cloneNode(true);
      oldClearBtn.parentNode.replaceChild(newClearBtn, oldClearBtn);
      newClearBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        targetWin.__twIsManuallyCleared = true;
        var vk = getActiveVaultKey();
        var v34k = vk.replace("v35", "v34");

        // 清空内存状态
        explicitClearCurrentArchive();

        // 彻底清除 localStorage 里的所有新旧备份键
        try {
          localStorage.removeItem(SOLO_ARCHIVE_PREFIX + vk);
          localStorage.removeItem(LOCAL_BACKUP_PREFIX + vk);
          localStorage.removeItem("tw_palace_chat_backup_v34_" + v34k);
          localStorage.removeItem(vk);
          localStorage.removeItem(v34k);
          if (targetWin.__TW_PERSIST_CACHE_V35) {
            delete targetWin.__TW_PERSIST_CACHE_V35[vk];
          }
        } catch (err) {}

        // 彻底清除酒馆 chatMetadata 与 TavernHelper 里的旧残留
        try {
          var stCtx = (targetWin.SillyTavern && targetWin.SillyTavern.getContext) ? targetWin.SillyTavern.getContext() : null;
          if (stCtx && stCtx.chatMetadata) {
            delete stCtx.chatMetadata[CHAT_BIND_VAR_KEY];
            delete stCtx.chatMetadata[vk];
            delete stCtx.chatMetadata["tw_palace_archive_v34"];
            delete stCtx.chatMetadata[v34k];
            if (typeof stCtx.saveMetadata === "function") stCtx.saveMetadata();
          }
        } catch (err) {}

        try {
          var th = targetWin.TavernHelper || window.TavernHelper;
          if (th && typeof th.insertOrAssignVariables === "function") {
            var emptyPatch = {};
            emptyPatch[CHAT_BIND_VAR_KEY] = null;
            emptyPatch[vk] = null;
            emptyPatch["tw_palace_archive_v34"] = null;
            emptyPatch[v34k] = null;
            th.insertOrAssignVariables(emptyPatch, { type: "chat" });
            th.insertOrAssignVariables(emptyPatch, { type: "global" });
          }
        } catch (err) {}

        renderAll();
        showModuleSuccessToast("已清空");
      });
    }

    // 初始化立即按隔离规则重新校验一次当前对话存档
    explicitClearCurrentArchive();
    loadChatSessionData(false);
    renderAll();
  } catch (err) {}
})();
