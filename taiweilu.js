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
      targetDoc.getElementById("twHiddenWpFilePicker")?.remove();
    } catch (e) {}
  }
  destroyTaiweiUI();

  if (sandboxWin !== targetWin) {
    sandboxWin.addEventListener("unload", destroyTaiweiUI);
    sandboxWin.addEventListener("pagehide", destroyTaiweiUI);
  }

  const GLOBAL_CFG_KEY = "tw_palace_global_cfg_v37";
  const CHAT_BIND_VAR_KEY = "tw_palace_archive_v37";
  const LOCAL_BACKUP_PREFIX = "tw_palace_chat_backup_v37_";
  const SOLO_ARCHIVE_PREFIX = "tw_palace_solo_archive_v37_";
  const WALLPAPER_STORAGE_KEY = "tw_palace_custom_wallpaper_v37";
  const EMPEROR_BG_URL = "https://i.imgs.ovh/2026/11/22/60e9175b05663f7d9316d86a2f57a557.png";
  const CATCH_AVATAR_URL = "https://i.imgs.ovh/2026/11/22/7bc0ecf4c0ca3764421f7e0dda4c2ca0.jpg";
  const DEFAULT_PLOT_WORD_LIMIT = 55;
  const DEFAULT_PLOT_CUSTOM_PROMPT = "以女主名字开头，简明概括本轮发生的核心事件、关键互动与结果，语言自然凝练。";

  const FORUM_STYLE_PRESETS = {
    lively: { name: "鲜活茶水间", desc: "像真实的宫人妃嫔、朝臣百姓私下嗑瓜子唠嗑！多用自然鲜活口语词，句子短促有活人感，既有直接针对主帖发表看法的，也有 @楼上其他NPC 互相接话、抬杠、拆台、追问细节的。" },
    gossip: { name: "欢脱吃瓜风", desc: "全员乐子人与前排吃瓜群众！语气欢脱逗趣，喜欢抢前排、起哄，既有单独评论主帖的，也有楼层之间互相 @对方 继续深扒内幕的。" },
    snarky: { name: "宫斗阴阳风", desc: "针锋相对、阴阳怪气拉满！世家妃嫔端着体面说最扎心的话，武将派直接硬刚呛声，既有直接点评主帖的，也有点名 @楼上死对头 逐句回怼的。" },
    street: { name: "市井烟火风", desc: "极致接地气的大白话与人间烟火味！三句不离吃食、银子、月例、当差苦乐与坊市见闻，互相打趣吐槽，朴实鲜活。" },
    classical: { name: "古风文雅风", desc: "纯正唐风古韵，措辞讲究、含蓄蕴藉，偶有诗词雅谑，同时楼层之间互相唱和或机锋交锋。" },
    custom: { name: "自定义风格", desc: "" }
  };

  const GROUP_CHAT_THEMES = {
    story_sync: { name: "同步当前剧情", userCentric: false, isIf: false, desc: "紧扣当前酒馆最新时间节点的太微宫日常、前朝政事与六宫动向展开群聊。大家各自聊手头的差事、宫内见闻或互相斗嘴，像真实微信群一样自然鲜活，不要全员围着女主转。" },
    user_empress_harem: { name: "我是皇帝", userCentric: true, isIf: true, desc: "【女皇独尊后宫IF线·女主中心】女主是至高无上的大景女皇陛下！萧承稷、沈砚、陆敬、谢无咎、霍惊弦、温言酌、裴玄度、卫凛及后宫诸妃全都是女皇陛下的后宫成员，全员围绕女皇陛下争风吃醋、邀宠修罗场拉满！" },
    palace_gossip: { name: "深宫八卦吃瓜", userCentric: false, isIf: false, desc: "围绕东西六宫争宠笑话、尚食局抢菜、内务府克扣、哪家宫人闹乌龙等深宫八卦热烈吃瓜吐槽。大家聊各自的宫中见闻与死对头八卦，不要全员围着女主转。" },
    street_fun: { name: "长安市井趣闻", userCentric: false, isIf: false, desc: "围绕长安东西两市奇珍、醉仙楼新酒、平康坊名曲、西市胡商宝马与民间奇闻畅聊。大家聊吃喝玩乐、跑马听曲与坊市新鲜事，不要全员围着女主转。" },
    if_modern: { name: "IF线：现代豪门集团", userCentric: false, isIf: true, desc: "【现代职场豪门AU】太微集团总裁萧承稷、首席特助沈砚、安保总监陆敬、投资大鳄谢无咎、富二代小少爷霍惊弦与各位高管女明星在公司大群的爆笑日常。" },
    if_campus: { name: "IF线：皇家重点高中", userCentric: false, isIf: true, desc: "【现代校园AU】太微一中学生会长萧承稷、学神沈砚、校霸陆敬、逃课打球的霍惊弦、小卖部老板谢无咎、校医温言酌在校园群的热闹斗嘴。" },
    if_scifi: { name: "IF线：星际帝国舰队", userCentric: false, isIf: true, desc: "【星际科幻AU】最高统帅萧承稷、首席参谋官沈砚、机甲司令陆敬、星际走私商谢无咎、首席医官温言酌在星舰公共频道的跨星系吐槽。" },
    if_genderbend: { name: "IF线：全员性转女尊", userCentric: false, isIf: true, desc: "【全员性转女尊大景AU】冷艳女帝萧承稷与后宫男宠贤夫们（端庄崔清漪公子、桀骜将门郎秦昭华、散漫江南富少苏枕月、女相沈砚、女将军陆敬）的反转群聊。" },
    custom: { name: "自定义群聊主题", userCentric: false, isIf: true, desc: "" }
  };

  const BASE_DM_NPC_CATALOG = [
    { id: "萧承稷", name: "萧承稷", display: "萧承稷（大景天子）", title: "甘露殿 · 皇帝", seal: "御笔亲敕", keywords: ["萧承稷", "陛下", "圣人"], personality: "大景皇帝，必自称“朕”或私下对熟人称“我”（禁称“孤”）。冷峻威严、城府极深、掌控欲强，说话简短直接，私下对女主护短细腻、占有欲深重。" },
    { id: "沈砚", name: "沈砚", display: "沈砚（中书侍郎）", title: "政事堂 · 中书侍郎", seal: "沈氏清臣", keywords: ["沈砚", "沈清臣", "沈侍郎"], personality: "字清臣，寒门辅政重臣。温润守礼、理智冷静、考虑周全，面对感情克制隐忍，动心后占有欲极强。" },
    { id: "陆敬", name: "陆敬", display: "陆敬（镇国大将军）", title: "北衙禁军 · 大统领", seal: "镇国将军印", keywords: ["陆敬", "陆怀远", "陆大将军", "陆统领"], personality: "字怀远，禁军统帅。爽朗直率、重情护短、武将风范，说话痛快直接。" },
    { id: "谢无咎", name: "谢无咎", display: "谢无咎（四海商行老板）", title: "醉仙楼 · 长安首富", seal: "四海无咎", keywords: ["谢无咎", "谢老板"], personality: "表面风流随性、算账精明、爱开玩笑，实则重情讲义气、考虑周密。" },
    { id: "霍惊弦", name: "霍惊弦", display: "霍惊弦（定远侯世子）", title: "飞龙厩 · 小侯爷", seal: "惊弦私印", keywords: ["霍惊弦", "小侯爷"], personality: "19岁少年心性，活泼开朗、爱笑爱闹、直接热烈，喜欢搜罗西市好玩物品送人。" },
    { id: "温言酌", name: "温言酌", display: "温言酌（太医署院判）", title: "尚药局 · 御前侍医", seal: "杏林温氏", keywords: ["温言酌", "温太医", "温院判"], personality: "表面温和，实则极有主见，说话直接不留情面，唯一敢逼萧承稷喝苦药的人。" },
    { id: "裴玄度", name: "裴玄度", display: "裴玄度（大理寺卿）", title: "大理寺 · 司法重臣", seal: "大理正卿", keywords: ["裴玄度", "裴正卿", "裴卿"], personality: "字正卿，冷肃古板、刚正不阿、话少严谨，一旦关心人便会生硬直接地替对方扫清隐患。" },
    { id: "卫凛", name: "卫凛", display: "卫凛（羽林中郎将）", title: "甘露殿 · 副统领", seal: "羽林卫凛", keywords: ["卫凛", "卫统领", "卫中郎将"], personality: "沉稳寡言、执行命令彻底，熟悉的人面前略显局促实在，重实际行动。" },
    { id: "赵怀安", name: "赵怀安", display: "赵怀安（内侍监大总管）", title: "甘露殿 · 皇城司统领", seal: "内侍总管", keywords: ["赵怀安", "赵总管"], personality: "自称“奴婢”，对外人严厉狠辣，唯独对陛下恭敬细致、绝对忠诚。" },
    { id: "苏枕月（丽嫔）", name: "苏枕月（丽嫔）", display: "苏枕月（丽嫔）", title: "玉照宫 · 正二品丽嫔", seal: "玉照枕月", keywords: ["苏枕月", "苏丽嫔", "丽嫔"], personality: "自称“妾”或“妾身”。江南豪商之女，慵懒散漫、人间清醒，酷爱美食华服与看戏话本。" },
    { id: "秦昭华（德妃）", name: "秦昭华（德妃）", display: "秦昭华（德妃）", title: "承香殿 · 正一品德妃", seal: "陇右昭华", keywords: ["秦昭华", "秦德妃", "德妃"], personality: "自称“妾身”。将门虎女，明艳张扬、脾气直接、护短好面子。" },
    { id: "崔清漪（淑妃）", name: "崔清漪（淑妃）", display: "崔清漪（淑妃）", title: "淑景殿 · 正一品淑妃", seal: "清河崔氏", keywords: ["崔清漪", "崔淑妃", "淑妃"], personality: "自称“妾身”。清河崔氏嫡女，端庄冷傲、心机深沉、极重世家规矩。" },
    { id: "柳如絮（婕妤）", name: "柳如絮（婕妤）", display: "柳如絮（婕妤）", title: "听竹轩 · 正三品婕妤", seal: "听竹如絮", keywords: ["柳如絮", "柳婕妤", "婕妤"], personality: "自称“妾”。江南寒门才女，清冷坚韧、聪慧自持。" },
    { id: "卢婉兮（修仪）", name: "卢婉兮（修仪）", display: "卢婉兮（修仪）", title: "凝华殿 · 正二品修仪", seal: "范阳卢氏", keywords: ["卢婉兮", "卢修仪", "修仪"], personality: "自称“妾身”。范阳卢氏贵女，善妒刻薄、掐尖要强。" },
    { id: "郑芷兰（美人）", name: "郑芷兰（美人）", display: "郑芷兰（美人）", title: "流霞阁 · 正四品美人", seal: "流霞芷兰", keywords: ["郑芷兰", "郑美人"], personality: "自称“妾”。表面温顺寡言，实则心机深沉。" },
    { id: "周妙音（才人）", name: "周妙音（才人）", display: "周妙音（才人）", title: "揽月阁 · 正五品才人", seal: "揽月妙音", keywords: ["周妙音", "周才人"], personality: "自称“妾”。虚荣张扬，巴结淑妃与修仪。" },
    { id: "韩怜儿（宝林）", name: "韩怜儿（宝林）", display: "韩怜儿（宝林）", title: "秋水居 · 正六品宝林", seal: "秋水韩氏", keywords: ["韩怜儿", "韩宝林"], personality: "自称“妾”。表面楚楚可怜，实则怨毒算计。" },
    { id: "沈青禾（选侍）", name: "沈青禾（选侍）", display: "沈青禾（选侍）", title: "翠微居 · 正七品选侍", seal: "翠微青禾", keywords: ["沈青禾", "沈选侍"], personality: "自称“妾”。胆小本分、懂医药草木。" },
    { id: "萧承泽", name: "萧承泽", display: "萧承泽（端王）", title: "皇室宗亲 · 七弟端王", seal: "端王之宝", keywords: ["萧承泽", "端王"], personality: "19岁先帝幼子，心思单纯、怕皇兄查功课，酷爱养猎犬与骑射。" },
    { id: "阿古拉", name: "阿古拉", display: "阿古拉（铁勒三王子）", title: "鸿胪寺 · 铁勒质子", seal: "漠北狼印", keywords: ["阿古拉", "三王子"], personality: "表面豪爽顺从，实则心思细密。" },
    { id: "洛青衣", name: "洛青衣", display: "洛青衣（胡月酒肆老板娘）", title: "西市 · 退役女侦察兵", seal: "胡月青衣", keywords: ["洛青衣", "胡月酒肆"], personality: "直爽干脆、待客热情、办事利落。" },
    { id: "顾清商", name: "顾清商", display: "顾清商（听雨楼花魁）", title: "平康坊 · 皇城司暗探", seal: "听雨清商", keywords: ["顾清商", "听雨楼"], personality: "八面玲珑、观察敏锐、果断狠辣。" },
    { id: "小禄子", name: "小禄子", display: "小禄子（御前小内侍）", title: "甘露殿 · 奉茶内侍", seal: "御前陈禄", keywords: ["小禄子", "陈禄"], personality: "自称“奴婢”，机灵乖巧、口风极严。" }
  ];

  const NPC_FANCY_JOIN_MAP = {
    "萧承稷": ["萧承稷 转动着墨玉扳指冷着脸进入了聊天室", "萧承稷 刚批完一摞奏章、带着一身低气压进入了聊天室"],
    "沈砚": ["沈砚 搁下紫毫笔、端着雨前龙井温雅地进入了聊天室", "沈砚 从政事堂卷宗堆里抬起头进入了聊天室"],
    "陆敬": ["陆敬 按着腰间横刀大步流星闯进了聊天室", "陆敬 刚从北苑校场练完剑、擦着汗进入了聊天室"],
    "谢无咎": ["谢无咎 摇着描金折扇、拨着算盘笑眯眯进入了聊天室", "谢无咎 拎着两坛醉仙楼新酿的梨花白溜达进了聊天室"],
    "霍惊弦": ["霍惊弦 牵着西域细犬翻墙溜进了聊天室", "霍惊弦 拎着马球杆风风火火地冲进了聊天室"],
    "温言酌": ["温言酌 端着一碗冒热气的苦药慢条斯理进入了聊天室", "温言酌 一边翻看《千金方》一边踱步进入了聊天室"],
    "裴玄度": ["裴玄度 手持《大景律疏》面无表情地进入了聊天室", "裴玄度 刚从大理寺审完案、衣摆带风进入了聊天室"],
    "卫凛": ["卫凛 抱剑守在廊下、沉默地加入了聊天室", "卫凛 巡视完甘露殿宫道后安静进入了聊天室"],
    "赵怀安": ["赵怀安 躬着身子、拂尘一甩悄无声息进入了聊天室", "赵怀安 揣着皇城司密报低头进入了聊天室"],
    "苏枕月": ["苏枕月（丽嫔） 嗑着奶油瓜子、斜倚软榻进入了聊天室", "苏枕月（丽嫔） 刚听完一出折子戏、懒洋洋进入了聊天室"],
    "秦昭华": ["秦昭华（德妃） 拎着镶金马鞭、明艳张扬地跨进了聊天室", "秦昭华（德妃） 刚同人比完投壶、气势汹汹进入了聊天室"],
    "崔清漪": ["崔清漪（淑妃） 端着青花茶盏、仪态万方地步入了聊天室", "崔清漪（淑妃） 由宫女扶着、冷淡矜持地进入了聊天室"],
    "柳如絮": ["柳如絮（婕妤） 拢了拢素色披风、携着竹叶清香进入了聊天室", "柳如絮（婕妤） 合上手中诗卷安静进入了聊天室"],
    "卢婉兮": ["卢婉兮（修仪） 帕子掩唇、眼波流转地走入了聊天室", "卢婉兮（修仪） 带着满身名贵熏香进入了聊天室"],
    "萧承泽": ["端王萧承泽 抱着刚满月的小猎犬偷偷摸摸溜进了聊天室", "端王萧承泽 趁太傅不注意逃课钻进了聊天室"],
    "周妙音": ["周妙音（才人） 涂着新买的胭脂、左顾右盼地进了聊天室"],
    "郑芷兰": ["郑芷兰（美人） 垂着眼眸、捏着佛珠轻步走入了聊天室"],
    "韩怜儿": ["韩怜儿（宝林） 眼眶微红、扶着门框怯生生进入了聊天室"],
    "沈青禾": ["沈青禾（选侍） 怀里抱着刚晒干的甘草片、贴着墙根溜进了聊天室"]
  };

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

  const MODULE_BTN_MAP = {
    all: ["twBtnApiSync"],
    status: ["twHomeRefreshStatusBtn"],
    plot: ["twAppendLatestPlotBtn", "twRebuildFullPlotBtn"],
    actions: ["twRefreshActionsBtn"],
    world: ["twRefreshWorldBtn"],
    emperor: ["twRefreshEmperorSpyBtn"],
    forum: ["twRefreshForumBtn"]
  };

  /* 桌面12大古风App（第1、2位固定为剧情梳理、剧情选择） */
  const PHONE_APPS_META = [
    { id: "plot", title: "剧情梳理", sub: "起居编年", color: "linear-gradient(145deg,#8f2922,#54120e)", svg: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff6e0" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>` },
    { id: "actions", title: "剧情选择", sub: "六大走向", color: "linear-gradient(145deg,#b57c34,#754b16)", svg: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff6e0" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
    { id: "chat", title: "灵犀传音", sub: "私聊·群聊", color: "linear-gradient(145deg,#993948,#5c1b26)", svg: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff6e0" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>` },
    { id: "letter", title: "飞鸽传书", sub: "鱼雁往来", color: "linear-gradient(145deg,#355e53,#1b362f)", svg: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff6e0" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>` },
    { id: "world", title: "地图", sub: "堪舆动向", color: "linear-gradient(145deg,#466e62,#233d35)", svg: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff6e0" stroke-width="1.8"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>` },
    { id: "emperor", title: "帝王起居", sub: "偷窥圣躬", color: "linear-gradient(145deg,#3b332b,#1c1713)", svg: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#f5dfb3" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/></svg>` },
    { id: "forum", title: "宫内外坛", sub: "六宫吃瓜", color: "linear-gradient(145deg,#6e552b,#3d2e14)", svg: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff6e0" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>` },
    { id: "theater", title: "小剧场", sub: "泥金画卷", color: "linear-gradient(145deg,#824654,#4c232d)", svg: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff6e0" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>` },
    { id: "tacit", title: "默契挑战", sub: "双向盲猜", color: "linear-gradient(145deg,#a33648,#5e1622)", svg: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff6e0" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>` },
    { id: "memorial", title: "御案批折", sub: "朱批奏章", color: "linear-gradient(145deg,#7d2922,#4a130f)", svg: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff6e0" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>` },
    { id: "gomoku", title: "纹枰手谈", sub: "延英对弈", color: "linear-gradient(145deg,#2d5248,#162b25)", svg: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff6e0" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><circle cx="9" cy="9" r="2" fill="#fff6e0"/><circle cx="15" cy="15" r="2"/></svg>` },
    { id: "settings", title: "设置", sub: "系统·壁纸", color: "linear-gradient(145deg,#545c68,#2b3038)", svg: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff6e0" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>` }
  ];

  let config = {
    theme: "xuanpaper", autoMasterAll: true,
    autoModules: { status: true, plot: true, world: true },
    plotWordLimit: DEFAULT_PLOT_WORD_LIMIT, plotCustomPrompt: DEFAULT_PLOT_CUSTOM_PROMPT,
    chatMemoryCount: 20, forumNickname: "", forumSpeakStyle: "lively", forumCustomStyleText: "",
    groupChatTheme: "story_sync", groupChatCustomThemeText: "", lastKnownUserName: "",
    customSaveSlot: "chat_bind", fabCustomTopRatio: null, apiMode: "tavern",
    apiName: "", apiUrl: "https://api.openai.com/v1", apiKey: "", apiModel: "gpt-4o-mini",
    fetchedModels: [], savedApiPresets: [], activePresetId: "",
    wallpaperMaskOpacity: 0.2, customWallpaperUrl: "",
    wallpaperTextColorMode: "auto", detectedWpIsLight: true
  };

  function getSavedWallpaperDataUrl() {
    if (config.customWallpaperUrl) return config.customWallpaperUrl;
    try {
      return targetWin.localStorage.getItem(WALLPAPER_STORAGE_KEY) || localStorage.getItem(WALLPAPER_STORAGE_KEY) || "";
    } catch (e) { return ""; }
  }
  function saveWallpaperDataUrl(dataUrl) {
    config.customWallpaperUrl = dataUrl || "";
    saveConfig();
    try {
      if (!dataUrl) {
        targetWin.localStorage.removeItem(WALLPAPER_STORAGE_KEY);
        localStorage.removeItem(WALLPAPER_STORAGE_KEY);
      } else {
        targetWin.localStorage.setItem(WALLPAPER_STORAGE_KEY, dataUrl);
        localStorage.setItem(WALLPAPER_STORAGE_KEY, dataUrl);
      }
    } catch (e) {}
  }

  function loadGlobalConfig() {
    try {
      const legacyStr = localStorage.getItem(GLOBAL_CFG_KEY) || localStorage.getItem("tw_palace_global_cfg_v36") || localStorage.getItem("tw_palace_global_cfg_v35") || "";
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
    if (typeof config.wallpaperMaskOpacity !== "number" || isNaN(config.wallpaperMaskOpacity)) config.wallpaperMaskOpacity = 0.2;
    if (!["auto", "dark", "light"].includes(config.wallpaperTextColorMode)) config.wallpaperTextColorMode = "auto";
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

  function getUserPersonaContext() {
    try {
      const stCtx = targetWin.SillyTavern?.getContext?.() || window.SillyTavern?.getContext?.();
      const p1 = stCtx?.powerUserSettings?.persona_description || "";
      if (p1 && String(p1).trim()) return String(p1).trim().slice(0, 600);
      const th = targetWin.TavernHelper || window.TavernHelper;
      if (th && typeof th.substitutes === "function") {
        const p2 = th.substitutes("{{persona}}");
        if (p2 && !p2.includes("{{") && p2.trim()) return p2.trim().slice(0, 600);
      }
      const domPersona = targetDoc.getElementById("persona_description")?.value || "";
      if (domPersona.trim()) return domPersona.trim().slice(0, 600);
    } catch (e) {}
    return "";
  }
  function getCurrentChatFileId() {
    try {
      const stCtx = targetWin.SillyTavern?.getContext?.() || window.SillyTavern?.getContext?.();
      let cid = "";
      if (stCtx && typeof stCtx.getCurrentChatId === "function") cid = stCtx.getCurrentChatId();
      if (!cid && stCtx?.chatId) cid = stCtx.chatId;
      if (!cid && stCtx?.chat_metadata?.chat_id_hash) cid = "hash_" + String(stCtx.chat_metadata.chat_id_hash);
      if (cid) {
        const cleanCid = String(cid).replace(/[^a-zA-Z0-9_\-\u4e00-\u9fa5]/g, "_");
        if (cleanCid && cleanCid !== "default_chat" && cleanCid !== "undefined" && cleanCid !== "null") {
          targetWin.__twLastValidChatId = cleanCid;
          try { targetWin.localStorage.setItem("tw_last_valid_cid_v37", cleanCid); } catch (e) {}
          return cleanCid;
        }
      }
    } catch (e) {}
    // 防止刚点进去瞬间酒馆还未加载完 chatId 导致跳回 default_chat 引发回档
    if (targetWin.__twLastValidChatId) return targetWin.__twLastValidChatId;
    try {
      const cached = targetWin.localStorage.getItem("tw_last_valid_cid_v37");
      if (cached) return cached;
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
      (Array.isArray(obj.lettersList) && obj.lettersList.length > 0) ||
      (obj.dmHistories && Object.keys(obj.dmHistories).some(k => Array.isArray(obj.dmHistories[k]) && obj.dmHistories[k].length > 0)) ||
      obj.emperorSpyData || obj.theaterText || obj.innerThought || obj.diary || obj.tacitData
    );
  }

  const state = {
    isHydrated: false, savedAt: 0, currentApp: "home", activeChatTab: "dm",
    appUnreadBadges: {},
    currentSessionKey: getActiveVaultKey(), boundChatId: getCurrentChatFileId(),
    userName: detectCurrentUserName(), userIdentity: "未同步", time: "未同步", location: "未同步",
    mood: "未同步", pose: "未同步", clothes: "未同步", innerThought: "", diary: "",
    affection: 0, hasAffection: false, stage: "未同步", inNews: "", outNews: "", todo1: "", todo2: "",
    hasDirectStatusTags: false, lastSyncedMsgKey: "", lastAutoProcessedRoundId: "", plotSummary: [], palaceDynamics: [],
    outsideDynamics: [], posts: [], storyPlans: [], theaterText: "", theaterTitle: "", replyTargets: {},
    chatQuoteTarget: null, dmQuoteTarget: null, showAtPicker: false, atFilterKeyword: "",
    groupMessages: [], dmNpcOptions: [...BASE_DM_NPC_CATALOG],
    dmActiveNpc: "萧承稷", dmHistories: {}, dmTyping: false, chatroomTyping: false,
    letterActiveNpc: "萧承稷", lettersList: [], activeLetterViewId: null,
    tacitMode: "guess_xiao", tacitTopic: "日常小习惯与怪癖", tacitData: null, tacitUserChoices: {},
    emperorSpyData: null, emperorSpyRevealed: {},
    emperorActiveDetailKey: null, emperorCardClickCount: 0, emperorPeekAccumulatedSec: 0,
    emperorNextCatchThreshold: Math.floor(Math.random() * 3) + 3,
    emperorNextTimeThresholdSec: Math.floor(Math.random() * 16) + 22,
    isAutoRunning: false, isGlobalRefreshing: false, refreshingModules: {}, hasUnreadFabGlow: false, apiLogs: []
  };

  targetWin.__twIsManuallyCleared = false;

  function addAppBadgeCount(appId, delta = 1) {
    if (!appId) return;
    if (state.currentApp === appId && !targetDoc.getElementById("twModalOverlay")?.classList.contains("tw-hidden")) return;
    if (!state.appUnreadBadges) state.appUnreadBadges = {};
    state.appUnreadBadges[appId] = (Number(state.appUnreadBadges[appId]) || 0) + Math.max(1, Number(delta) || 1);
    renderPhoneHomeGrid();
    triggerFabGlowReminder();
  }

  function clearAppBadgeCount(appId) {
    if (!appId || !state.appUnreadBadges) return;
    delete state.appUnreadBadges[appId];
    renderPhoneHomeGrid();
  }

  function explicitClearCurrentArchive() {
    state.savedAt = 0;
    state.userName = detectCurrentUserName();
    state.appUnreadBadges = {};
    state.userIdentity = "未同步"; state.time = "未同步"; state.location = "未同步";
    state.mood = "未同步"; state.pose = "未同步"; state.clothes = "未同步";
    state.innerThought = ""; state.diary = ""; state.affection = 0; state.hasAffection = false;
    state.stage = "未同步"; state.inNews = ""; state.outNews = ""; state.todo1 = ""; state.todo2 = "";
    state.hasDirectStatusTags = false; state.lastSyncedMsgKey = ""; state.lastAutoProcessedRoundId = "";
    state.plotSummary = []; state.palaceDynamics = []; state.outsideDynamics = [];
    state.posts = []; state.storyPlans = []; state.theaterText = ""; state.theaterTitle = ""; state.replyTargets = {};
    state.chatQuoteTarget = null; state.dmQuoteTarget = null; state.showAtPicker = false; state.atFilterKeyword = "";
    state.groupMessages = []; state.dmActiveNpc = "萧承稷"; state.dmHistories = {};
    state.lettersList = []; state.activeLetterViewId = null;
    state.tacitData = null; state.tacitUserChoices = {};
    state.dmTyping = false; state.chatroomTyping = false;
    state.emperorSpyData = null; state.emperorSpyRevealed = {}; state.emperorActiveDetailKey = null;
    state.emperorCardClickCount = 0; state.emperorPeekAccumulatedSec = 0;
    state.emperorNextCatchThreshold = Math.floor(Math.random() * 3) + 3;
    state.emperorNextTimeThresholdSec = Math.floor(Math.random() * 16) + 22;
  }

  function applyParsedPayloadToState(parsed) {
    if (!parsed || typeof parsed !== "object") return false;
    state.savedAt = Number(parsed.savedAt) || Date.now();
    if (parsed.lastSyncedMsgKey) state.lastSyncedMsgKey = parsed.lastSyncedMsgKey;
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
    if (parsed.theaterTitle !== undefined) state.theaterTitle = parsed.theaterTitle;
    if (Array.isArray(parsed.groupMessages)) state.groupMessages = parsed.groupMessages;
    if (Array.isArray(parsed.lettersList)) state.lettersList = parsed.lettersList;
    if (parsed.tacitData !== undefined) state.tacitData = parsed.tacitData;
    if (parsed.tacitUserChoices && typeof parsed.tacitUserChoices === "object") state.tacitUserChoices = parsed.tacitUserChoices;
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

  let readFromTavernBackend = function (vaultKey) {
    if (targetWin.__twIsManuallyCleared) return null;
    try {
      const store = targetWin.localStorage || localStorage;
      const raw = store.getItem(SOLO_ARCHIVE_PREFIX + vaultKey) || localStorage.getItem(SOLO_ARCHIVE_PREFIX + vaultKey) || store.getItem("tw_palace_solo_archive_v36_" + vaultKey.replace("v37", "v36"));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.__cleared) return null;
        if (hasSubstantialData(parsed)) return parsed;
      }
    } catch (e) {}
    return null;
  };

  let writeToTavernBackend = function (vaultKey, payload) {
    try {
      const store = targetWin.localStorage || localStorage;
      if (!payload || Object.keys(payload).length === 0 || payload.__cleared) {
        store.removeItem(SOLO_ARCHIVE_PREFIX + vaultKey);
        localStorage.removeItem(SOLO_ARCHIVE_PREFIX + vaultKey);
        return;
      }
      targetWin.__twIsManuallyCleared = false;
      const str = JSON.stringify(payload);
      store.setItem(SOLO_ARCHIVE_PREFIX + vaultKey, str);
      try { localStorage.setItem(SOLO_ARCHIVE_PREFIX + vaultKey, str); } catch (e) {}
    } catch (e) {}
  };

  function saveCurrentChatSessionData(forceAllowEmpty = false) {
    if (!state.isHydrated && !forceAllowEmpty) return;
    deduplicateTimelineInPlace();
    const vaultKey = getActiveVaultKey();
    state.currentSessionKey = vaultKey;
    state.boundChatId = getCurrentChatFileId();
    state.savedAt = Date.now();
    const payload = {
      savedAt: state.savedAt, vaultKey, boundChatId: state.boundChatId,
      lastSyncedMsgKey: state.lastSyncedMsgKey,
      userIdentity: state.userIdentity, time: state.time, location: state.location,
      mood: state.mood, pose: state.pose, clothes: state.clothes,
      innerThought: state.innerThought, diary: state.diary,
      affection: state.affection, hasAffection: state.hasAffection, stage: state.stage,
      inNews: state.inNews, outNews: state.outNews, todo1: state.todo1, todo2: state.todo2,
      lastAutoProcessedRoundId: state.lastAutoProcessedRoundId,
      plotSummary: state.plotSummary, palaceDynamics: state.palaceDynamics,
      outsideDynamics: state.outsideDynamics, posts: state.posts, storyPlans: state.storyPlans,
      theaterText: state.theaterText, theaterTitle: state.theaterTitle, groupMessages: state.groupMessages,
      lettersList: state.lettersList, tacitData: state.tacitData, tacitUserChoices: state.tacitUserChoices,
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

  let loadChatSessionData = function (explicitSlotOrChatSwitch = false) {
    if (explicitSlotOrChatSwitch) targetWin.__twIsManuallyCleared = false;
    if (targetWin.__twIsManuallyCleared) { state.isHydrated = true; return false; }
    const vaultKey = getActiveVaultKey();
    state.currentSessionKey = vaultKey;
    state.boundChatId = getCurrentChatFileId();
    const backendData = readFromTavernBackend(vaultKey);
    if (backendData && hasSubstantialData(backendData)) {
      // 只有在切换到新聊天窗口，或者本地保存的数据比当前内存更新时，才覆盖内存，绝不拿旧档回退新档！
      if (explicitSlotOrChatSwitch || !hasSubstantialData(state) || (Number(backendData.savedAt) || 0) >= (Number(state.savedAt) || 0)) {
        if (explicitSlotOrChatSwitch) explicitClearCurrentArchive();
        applyParsedPayloadToState(backendData);
      }
      state.isHydrated = true;
      return true;
    }
    if (explicitSlotOrChatSwitch) explicitClearCurrentArchive();
    state.isHydrated = true;
    return false;
  };


  function getForumStylePromptBlock() {
    const styleKey = config.forumSpeakStyle || "lively";
    const preset = FORUM_STYLE_PRESETS[styleKey] || FORUM_STYLE_PRESETS.lively;
    const customTxt = (config.forumCustomStyleText || "").trim();
    const activeDesc = (styleKey === "custom" && customTxt) ? `用户自定义说话风格要求：【${customTxt}】` : preset.desc;
    const uName = state.userName || detectCurrentUserName();
    const customAlias = (config.forumNickname || "").trim();
    return `\n【论坛说话风格、群像世界观与最高禁令（当前风格：${preset.name}）】：\n1. 风格要求：${activeDesc}\n2. 严禁死板书面语与车轱辘话！\n3. 【去中心化鲜活世界铁律】：论坛是整个太微宫、前朝官署与长安百坊的公共水区，【绝对不要全都围着 ${uName} 转】！生成的帖子里，最多只允许 1 条与当前主线或 ${uName} 沾边，其余帖子必须写宫内宫外其他人的趣闻！\n4. 评论构成必须包含两种：一部分NPC直接针对主帖内容发表评论，另一部分NPC互相点名回复楼上其他NPC！\n5. 【绝对禁令】：严禁AI替（${uName}${customAlias ? ` 或马甲 ${customAlias}` : ""}）发帖或发表任何评论！`;
  }

  function isNpcMatchingUser(rawAuthorStr) {
    if (!rawAuthorStr) return false;
    const s = String(rawAuthorStr).trim();
    const uName = state.userName || detectCurrentUserName();
    const customAlias = (config.forumNickname || "").trim();
    if (uName && (s === uName || s.includes(`（${uName}`) || s.includes(`(${uName}`) || s.includes(`·${uName}`))) return true;
    if (customAlias && (s === customAlias || s.includes(customAlias))) return true;
    if (/^(玩家|女主|user)$/i.test(s)) return true;
    return false;
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

  function upgradePlainJoinTipToFancy(rawJoinText) {
    let txt = cleanPureText(rawJoinText || "");
    if (!txt) return "霍惊弦 牵着西域细犬翻墙溜进了聊天室";
    const isPlain = /^(?:[\u4e00-\u9fa5A-Za-z0-9·（）()]+)\s*(?:加入了群聊|进入了聊天室|进入了群聊|加入聊天室)[。！!]?$/.test(txt);
    if (!isPlain && txt.length > 11) return txt;
    for (const [k, pool] of Object.entries(NPC_FANCY_JOIN_MAP)) {
      if (txt.includes(k)) return pool[Math.floor(Math.random() * pool.length)];
    }
    return txt;
  }

  function highlightMentionsHtml(rawText) {
    const safe = enforceAddressingRules(rawText || "");
    return safe.replace(/(@[\u4e00-\u9fa5A-Za-z0-9_·（）：:]+)/g, '<b class="tw-at-highlight">$1</b>');
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
        if (isNpcMatchingUser(raw) || isNpcMatchingUser(realNameField)) return FALLBACK_FORUM_NICKS[fallbackIdx % FALLBACK_FORUM_NICKS.length];
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
    txt.textContent = `✨ ${moduleTitle}`;
    toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  let wechatBannerTimer = null;
  function showWechatNotification(senderName, previewText, jumpTarget = { app: "chat", chatTab: "dm", npc: "" }) {
    triggerFabGlowReminder();
    const banner = targetDoc.getElementById("twWechatBanner"), avatarEl = targetDoc.getElementById("twWechatAvatar");
    const senderEl = targetDoc.getElementById("twWechatSender"), msgEl = targetDoc.getElementById("twWechatPreview");
    if (!banner || !senderEl || !msgEl) return;
    if (avatarEl) avatarEl.textContent = String(senderName || "宫").charAt(0);
    senderEl.textContent = senderName || "太微宫传信";
    msgEl.textContent = cleanPureText(previewText).slice(0, 42);
    banner.dataset.jumpApp = jumpTarget.app || "chat";
    banner.dataset.jumpChatTab = jumpTarget.chatTab || "dm";
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
      ? `一、论坛匿名马甲盲猜铁律：\n1. 当前发帖/回帖人使用了匿名马甲「${customAlias}」，宫内外所有人【绝对不知道】TA 的真实姓名与位分！\n2. 严禁在回复中写出「${uName}」！NPC 只能称呼「@${customAlias}」或“楼主/层主”，并只能盲猜身份！`
      : `一、姓名自然书写规则：\n1. 当前人物叫：${uName}。\n2. 提及时直接写出 ${uName}，严禁在名字外加【】方括号！`;
    return `\n【大景王朝世界观、人设、称呼与禁用词最高铁律】：\n${userSection}\n二、萧承稷只自称“朕”（私下对挚友偶称“我”），【绝对禁止自称“孤”或“本王”】！\n三、后宫妃嫔统一用「真名（位分）」格式：崔清漪（淑妃）、秦昭华（德妃）、卢婉兮（修仪）、苏枕月（丽嫔）、柳如絮（婕妤）、郑芷兰（美人）、周妙音（才人）、韩怜儿（宝林）、沈青禾（选侍）。尊称皇帝为“陛下”、“圣人”，后妃自称“妾”、“妾身”，宫人自称“奴婢”。\n四、严禁AI代替（${uName}${customAlias ? ` 或 ${customAlias}` : ""}）说话或发评！`;
  }

  function enforceAddressingRules(text, preserveForumAlias = false) {
    if (!text) return "";
    const uName = state.userName || detectCurrentUserName();
    const customNick = (config.forumNickname || "").trim();
    let res = String(text);
    const aliasPlaceholder = "__TW_FORUM_ALIAS_PROTECTED__";
    if (preserveForumAlias && customNick) res = res.split(customNick).join(aliasPlaceholder);
    res = res
      .replace(/【\s*(玩家|女主|user)\s*】/gi, preserveForumAlias && customNick ? customNick : uName)
      .replace(/玩家|女主/g, preserveForumAlias && customNick ? customNick : uName)
      .replace(/(?<!["'\w])user(?!["'\w])/gi, preserveForumAlias && customNick ? customNick : uName);
    if (config.lastKnownUserName && config.lastKnownUserName !== uName && config.lastKnownUserName !== customNick) {
      res = res.split(config.lastKnownUserName).join(uName);
    }
    if (uName !== "云鸢" && customNick !== "云鸢") res = res.replace(/云鸢/g, uName);
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

  const styleEl = targetDoc.createElement("style");
  styleEl.id = "tw-floating-style";
  styleEl.textContent = `
    #tw-floating-root { --bg-paper:#f3ead8; --bg-card:rgba(251,246,234,0.92); --bg-nav:#e5d6bc; --bg-sub:rgba(226,211,183,0.62); --border-outer:#8c6239; --border-inner:#c4a472; --border-soft:#cbb58d; --head-grad:linear-gradient(135deg,#5e1d18 0%,#7d2922 55%,#511814 100%); --fab-grad:linear-gradient(145deg,#7a241d 0%,#4a120e 100%); --text-main:#2b2018; --text-sub:#6e5a49; --accent:#852922; --accent-strong:#591611; --gold:#b88a3e; --head-text:#f7ead0; --paper-vignette:inset 0 0 48px rgba(110,78,40,0.2); font-family:"STKaiti","Kaiti SC","Noto Serif SC","Songti SC","Microsoft YaHei",serif; color:var(--text-main); z-index:2147483647; }
    #tw-floating-root[data-theme="white"] { --bg-paper:#ffffff; --bg-card:rgba(250,250,252,0.92); --bg-nav:#f2f3f6; --bg-sub:rgba(242,244,248,0.75); --border-outer:#646c78; --border-inner:#c2c7d0; --border-soft:#dcdfe6; --head-grad:linear-gradient(135deg,#2c323b 0%,#404854 55%,#232830 100%); --fab-grad:linear-gradient(145deg,#3c4452 0%,#1e232b 100%); --text-main:#1d2129; --text-sub:#606875; --accent:#39424e; --accent-strong:#14181f; --gold:#9c8050; --head-text:#ffffff; --paper-vignette:inset 0 0 36px rgba(0,0,0,0.04); }
    #tw-floating-root[data-theme="celadon"] { --bg-paper:#e6efe9; --bg-card:rgba(244,250,247,0.92); --bg-nav:#cfdfd8; --bg-sub:rgba(205,223,215,0.68); --border-outer:#466e62; --border-inner:#86aba0; --border-soft:#a9c4bc; --head-grad:linear-gradient(135deg,#22423a 0%,#355e53 55%,#1d3831 100%); --fab-grad:linear-gradient(145deg,#355e53 0%,#1b362f 100%); --text-main:#1b2b27; --text-sub:#526e66; --accent:#2c594e; --accent-strong:#173830; --gold:#527d70; --head-text:#ebf5f1; --paper-vignette:inset 0 0 48px rgba(45,85,73,0.16); }
    #tw-floating-root[data-theme="obsidian"] { --bg-paper:#1e1b18; --bg-card:rgba(40,35,30,0.92); --bg-nav:#27221d; --bg-sub:rgba(53,46,39,0.75); --border-outer:#b88d44; --border-inner:#6e552b; --border-soft:#4d4134; --head-grad:linear-gradient(135deg,#120f0d 0%,#2b221a 55%,#14110e 100%); --fab-grad:linear-gradient(145deg,#382c20 0%,#14110e 100%); --text-main:#e6dac6; --text-sub:#a3927b; --accent:#d4a857; --accent-strong:#f0c97d; --gold:#c79a4b; --head-text:#f5dfb3; --paper-vignette:inset 0 0 55px rgba(0,0,0,0.55); }
    #tw-floating-root[data-theme="rouge"] { --bg-paper:#f7e8ea; --bg-card:rgba(254,246,247,0.92); --bg-nav:#edd1d6; --bg-sub:rgba(237,209,214,0.68); --border-outer:#9c515d; --border-inner:#cfa0a8; --border-soft:#dab3b9; --head-grad:linear-gradient(135deg,#6b2532 0%,#913948 55%,#591d28 100%); --fab-grad:linear-gradient(145deg,#993948 0%,#571b25 100%); --text-main:#361e22; --text-sub:#7d565d; --accent:#8f3342; --accent-strong:#631c28; --gold:#a85865; --head-text:#fff0f2; --paper-vignette:inset 0 0 48px rgba(135,60,75,0.16); }
    #tw-floating-root[data-theme="palace"] { --bg-paper:rgba(255, 250, 243, 0.85); --bg-card:rgba(255, 255, 255, 0.78); --bg-nav:rgba(250, 239, 222, 0.75); --bg-sub:rgba(247, 236, 218, 0.65); --border-outer:rgba(205, 162, 90, 0.85); --border-inner:rgba(255, 255, 255, 0.88); --border-soft:rgba(212, 175, 112, 0.42); --head-grad:linear-gradient(135deg, rgba(168, 52, 46, 0.88) 0%, rgba(201, 134, 68, 0.82) 52%, rgba(148, 42, 38, 0.88) 100%); --fab-grad:linear-gradient(145deg, rgba(182, 58, 50, 0.9) 0%, rgba(138, 38, 32, 0.92) 100%); --text-main:#332018; --text-sub:#785c49; --accent:#9e2f28; --accent-strong:#6e1813; --gold:#c99846; --head-text:#fffaf0; --paper-vignette:inset 0 0 38px rgba(255, 255, 255, 0.65); }
    #tw-floating-root[data-theme="newspaper"] { --bg-paper:#ece5d5; --bg-card:rgba(244,239,228,0.92); --bg-nav:#dfd6c3; --bg-sub:rgba(228,220,203,0.75); --border-outer:#221e1a; --border-inner:#524a40; --border-soft:#8c8273; --head-grad:linear-gradient(180deg, #1f1b18 0%, #2e2924 100%); --fab-grad:linear-gradient(145deg, #2b2622 0%, #14110f 100%); --text-main:#1a1715; --text-sub:#575047; --accent:#8f241e; --accent-strong:#14110f; --gold:#7a6a53; --head-text:#f4efe4; --paper-vignette:inset 0 0 40px rgba(40, 32, 22, 0.14); font-family:"Songti SC","Noto Serif SC","SimSun","STSong",serif; }
    #tw-floating-root * { box-sizing:border-box; }
    #tw-floating-root.tw-chat-inactive { display:none !important; }
    @keyframes twFabShineSweep { 0% { transform:translateX(-130%) rotate(25deg); } 100% { transform:translateX(230%) rotate(25deg); } }
    @keyframes twPulseTyping { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }
    @keyframes twBubblePop { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
    @keyframes twMapRadar { 0% { r: 3.5; opacity: 0.95; } 100% { r: 12; opacity: 0; } }
    @keyframes twDashFlow { to { stroke-dashoffset: -24; } }

    .tw-fab-ball { position:fixed !important; top:calc(50vh - 34px); right:14px !important; left:auto !important; bottom:auto !important; width:58px; height:68px; background:var(--fab-grad); border:2px solid var(--gold); border-radius:14px 14px 26px 26px; color:var(--head-text); display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; user-select:none; touch-action:none; z-index:2147483645; box-shadow:0 8px 24px rgba(0,0,0,0.55),inset 0 0 0 3px rgba(255,255,255,0.12),inset 0 0 14px rgba(212,168,87,0.35); overflow:hidden; transition:opacity .18s ease; }
    /* 打开小手机面板时隐藏悬浮球，绝不遮挡手机 */
    .tw-fab-ball.tw-fab-hidden-when-open { display:none !important; opacity:0 !important; pointer-events:none !important; }
    .tw-fab-ball::before { content:""; position:absolute; inset:4px; border:1px solid rgba(245,223,179,0.45); border-radius:10px 10px 22px 22px; pointer-events:none; }
    .tw-fab-ball.tw-fab-glow-active::after { content:""; position:absolute; top:-30%; left:-50%; width:55%; height:160%; background:linear-gradient(90deg, transparent, rgba(255,245,210,0.58), transparent); animation:twFabShineSweep 2.4s infinite ease-in-out; pointer-events:none; }
    .tw-fab-dot { display:none; position:absolute; top:5px; right:6px; width:9px; height:9px; border-radius:50%; background:#e6392e; border:1.5px solid #fff8eb; box-shadow:0 1px 4px rgba(0,0,0,0.4); }
    .tw-fab-ball.tw-fab-glow-active .tw-fab-dot { display:block; }
    .tw-fab-top { font-size:9.5px; letter-spacing:2px; opacity:.85; border-bottom:1px solid rgba(245,223,179,0.4); padding-bottom:2px; margin-bottom:3px; }
    .tw-fab-main { font-size:14px; font-weight:bold; letter-spacing:2.5px; line-height:1.15; }
    .tw-fab-ornament { width:18px; height:3px; margin-top:4px; background:linear-gradient(90deg,transparent,var(--gold),transparent); }
    .tw-wechat-banner { position:fixed; top:16px; left:50%; transform:translateX(-50%) translateY(-130%); width:360px; max-width:92vw; background:rgba(32, 35, 42, 0.94); color:#fff; backdrop-filter:blur(12px); border:1px solid rgba(212, 168, 87, 0.65); border-radius:12px; padding:10px 13px; display:flex; align-items:center; gap:10px; z-index:2147483647; box-shadow:0 10px 28px rgba(0,0,0,0.45); cursor:pointer; transition:transform .32s cubic-bezier(0.22, 1, 0.36, 1), opacity .28s ease; opacity:0; pointer-events:none; }
    .tw-wechat-banner.show { transform:translateX(-50%) translateY(0); opacity:1; pointer-events:auto; }
    .tw-wechat-avatar { width:36px; height:36px; border-radius:8px; background:linear-gradient(135deg,#852922,#b88a3e); color:#fff8eb; font-weight:bold; font-size:15px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .tw-wechat-body { flex:1; overflow:hidden; }
    .tw-wechat-top { display:flex; justify-content:space-between; align-items:center; font-size:12px; font-weight:bold; color:#f7ead0; margin-bottom:2px; }
    .tw-wechat-tag { font-size:10px; color:#5cdbd3; font-weight:normal; }
    .tw-wechat-preview { font-size:11.5px; color:#dcdcdc; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .tw-module-toast { position:fixed; top:68px; left:50%; transform:translateX(-50%) translateY(-20px); background:var(--head-grad); color:var(--head-text); border:1.5px solid var(--gold); padding:6px 16px; border-radius:20px; font-size:12px; font-weight:bold; letter-spacing:1px; box-shadow:0 6px 20px rgba(0,0,0,0.38); z-index:2147483647; opacity:0; pointer-events:none; transition:all .25s ease; }
    .tw-module-toast.show { transform:translateX(-50%) translateY(0); opacity:1; }
    .tw-modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; width:100vw; height:100vh; background:rgba(12,8,5,0.62); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; padding:10px; z-index:2147483646; opacity:1; transition:opacity .2s ease; }
    .tw-modal-overlay.tw-hidden { opacity:0; pointer-events:none; display:none !important; }

    /* 古风小手机外壳与壁纸层 */
    .tw-panel { width:416px; max-width:95vw; height:760px; max-height:92vh; background-color:var(--bg-paper); background-image:repeating-linear-gradient(0deg,rgba(120,90,50,0.03) 0px,rgba(120,90,50,0.03) 1px,transparent 1px,transparent 5px),repeating-linear-gradient(90deg,rgba(120,90,50,0.025) 0px,rgba(120,90,50,0.025) 1px,transparent 1px,transparent 7px); border:4px solid var(--border-outer); outline:1.5px solid var(--gold); outline-offset:-7px; border-radius:34px; box-shadow:0 24px 65px rgba(5,2,1,0.82), inset 0 0 0 2px rgba(255,248,230,0.22), var(--paper-vignette); display:flex; flex-direction:column; overflow:hidden; position:relative; margin:auto; }
    .tw-phone-wallpaper { position:absolute; inset:0; background-size:cover; background-position:center; background-repeat:no-repeat; z-index:0; pointer-events:none; transition:opacity .25s ease; }
    .tw-phone-wallpaper-mask { position:absolute; inset:0; background:rgba(18, 12, 8, 0.2); z-index:1; pointer-events:none; opacity:0; transition:opacity .25s ease; }
    .tw-panel.has-custom-wp .tw-phone-wallpaper-mask { opacity:1; }
    .tw-phone-statusbar { position:relative; z-index:5; padding:8px 18px 5px; background:var(--head-grad); color:var(--head-text); font-size:10.5px; display:flex; justify-content:space-between; align-items:center; letter-spacing:1px; border-bottom:1px solid rgba(255,240,200,0.22); }
    .tw-phone-notch { width:64px; height:5px; border-radius:4px; background:rgba(0,0,0,0.35); border:1px solid rgba(245,223,179,0.35); }
    .tw-app-header { position:relative; z-index:5; padding:8px 14px; background:var(--head-grad); color:var(--head-text); border-bottom:1.5px solid var(--border-outer); display:flex; justify-content:space-between; align-items:center; gap:6px; }
    .tw-app-header.home-mode { background:rgba(45, 22, 18, 0.55); backdrop-filter:blur(8px); border-bottom:1px solid rgba(245,223,179,0.28); }
    .tw-back-home-btn { padding:4px 9px; font-size:11.5px; font-weight:bold; color:var(--head-text); background:rgba(255,255,255,0.16); border:1px solid rgba(255,240,200,0.45); border-radius:14px; cursor:pointer; font-family:inherit; display:flex; align-items:center; gap:3px; }
    .tw-back-home-btn:hover { background:rgba(255,255,255,0.28); }
    .tw-head-title { font-size:14.5px; font-weight:bold; letter-spacing:1.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .tw-head-btns { display:flex; gap:5px; align-items:center; }
    .tw-mini-btn { padding:4px 8px; font-size:11px; color:var(--head-text); background:rgba(255,255,255,0.15); border:1px solid rgba(255,240,200,0.45); border-radius:12px; cursor:pointer; font-family:inherit; }
    .tw-mini-btn.api-btn { background:var(--border-outer); color:#fff8eb; font-weight:bold; border-color:#e8c987; }
    .tw-mini-btn:disabled { opacity:.55; cursor:wait; }
    .tw-manual-refresh-btn.disabled-gray, .tw-manual-refresh-btn:disabled { opacity:0.42 !important; filter:grayscale(100%) !important; cursor:not-allowed !important; pointer-events:none !important; }

    /* 小手机桌面与App角标（支持根据壁纸深浅自适应文字颜色） */
    .tw-content { position:relative; z-index:4; flex:1; overflow-y:auto; padding:11px 12px 13px; font-size:12.5px; display:flex; flex-direction:column; }
    .tw-tab-page { display:none; flex-direction:column; flex:1; animation:twBubblePop .18s ease-out; }
    .tw-tab-page.active { display:flex; }
    .tw-home-hero-card { background:rgba(251, 246, 234, 0.86); backdrop-filter:blur(10px); border:1.5px solid var(--border-outer); border-radius:15px; padding:10px 12px; margin-bottom:12px; box-shadow:0 6px 18px rgba(0,0,0,0.14); }
    #tw-floating-root[data-theme="obsidian"] .tw-home-hero-card { background:rgba(40, 35, 30, 0.86); }
    .tw-home-clock-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; border-bottom:1px dashed var(--border-soft); padding-bottom:5px; }
    .tw-home-shichen { font-size:15.5px; font-weight:bold; color:var(--accent-strong); letter-spacing:1px; }
    .tw-home-loc { font-size:11px; color:var(--text-sub); }
    .tw-home-mini-status { display:grid; grid-template-columns:1fr 1fr; gap:5px 8px; font-size:11.5px; line-height:1.45; }
    .tw-app-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:11px 6px; padding:2px; margin-bottom:auto; }
    .tw-app-item { position:relative; display:flex; flex-direction:column; align-items:center; text-align:center; cursor:pointer; user-select:none; transition:transform .16s ease; }
    .tw-app-item:hover { transform:translateY(-3px) scale(1.03); }
    .tw-app-item:active { transform:scale(0.95); }
    .tw-app-icon-wrap { position:relative; display:inline-flex; margin-bottom:4px; }
    .tw-app-icon-box { width:54px; height:54px; border-radius:14px; display:flex; align-items:center; justify-content:center; border:1.5px solid #e8c987; box-shadow:0 6px 14px rgba(0,0,0,0.28), inset 0 1px 2px rgba(255,255,255,0.35); position:relative; overflow:hidden; }
    .tw-app-icon-box::after { content:""; position:absolute; inset:3px; border:1px solid rgba(255,248,225,0.25); border-radius:10px; pointer-events:none; }
    .tw-app-badge { position:absolute; top:-5px; right:-6px; min-width:19px; height:19px; padding:0 5px; border-radius:10px; background:linear-gradient(135deg,#ff3b30,#c91c14); color:#fff; font-size:10px; font-weight:bold; display:flex; align-items:center; justify-content:center; border:1.5px solid #fff8eb; box-shadow:0 2px 6px rgba(0,0,0,0.45); z-index:4; pointer-events:none; font-family:sans-serif; }
    .tw-app-name { font-size:11.5px; font-weight:bold; color:var(--text-main); letter-spacing:0.5px; text-shadow:0 1px 3px rgba(255,255,255,0.85); line-height:1.2; transition:color .2s, text-shadow .2s; }
    .tw-app-sub { font-size:9px; color:var(--text-sub); margin-top:1px; transition:color .2s, text-shadow .2s; }
    /* 浅色壁纸/深色文字模式（默认清晰墨褐字+白描边光晕） */
    .tw-panel.wp-text-dark .tw-app-name { color:#261710 !important; text-shadow:0 0 6px rgba(255,252,245,0.98), 0 1px 2px rgba(255,255,255,0.95) !important; }
    .tw-panel.wp-text-dark .tw-app-sub { color:#4a3325 !important; font-weight:bold; text-shadow:0 0 5px rgba(255,252,245,0.98), 0 1px 2px rgba(255,255,255,0.9) !important; }
    /* 深色壁纸/浅色文字模式（泥金白字+黑阴影） */
    .tw-panel.wp-text-light .tw-app-name { color:#fff9ed !important; text-shadow:0 1px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.82) !important; }
    .tw-panel.wp-text-light .tw-app-sub { color:#f0dec0 !important; text-shadow:0 1px 3px rgba(0,0,0,0.95) !important; }
    #tw-floating-root[data-theme="obsidian"] .tw-panel:not(.wp-text-dark) .tw-app-name { color:#f5dfb3; text-shadow:0 1px 4px rgba(0,0,0,0.9); }

    .tw-phone-dock { margin-top:10px; padding:8px 9px; background:rgba(251, 246, 234, 0.78); backdrop-filter:blur(12px); border:1.5px solid var(--border-outer); border-radius:20px; display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; box-shadow:0 6px 18px rgba(0,0,0,0.18); }
    #tw-floating-root[data-theme="obsidian"] .tw-phone-dock { background:rgba(40, 35, 30, 0.82); }
    .tw-phone-dock .tw-app-icon-box { width:46px; height:46px; border-radius:12px; }
    .tw-phone-bottom-bar { position:relative; z-index:5; height:24px; background:var(--bg-nav); border-top:1px solid var(--border-soft); display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .tw-phone-home-pill { width:108px; height:5px; border-radius:4px; background:var(--border-outer); opacity:0.75; transition:all .15s; }
    .tw-phone-bottom-bar:hover .tw-phone-home-pill { width:126px; opacity:1; background:var(--accent); }

    /* 小剧场泥金画卷美化样式 */
    .tw-theater-scroll-card { background:linear-gradient(180deg, #fbf4e4 0%, #f4e8ce 50%, #efe0c0 100%); border:2px solid #8c5a32; outline:1px solid #c9a368; outline-offset:-6px; border-radius:10px; padding:15px 16px; color:#2b1d12; position:relative; box-shadow:inset 0 0 32px rgba(138, 96, 48, 0.2), 0 6px 16px rgba(0,0,0,0.1); max-height:390px; overflow-y:auto; }
    #tw-floating-root[data-theme="obsidian"] .tw-theater-scroll-card { background:linear-gradient(180deg, #2b241d 0%, #221c16 100%); color:#e8dcc8; border-color:#b88d44; outline-color:#6e552b; }
    .tw-theater-scroll-head { text-align:center; border-bottom:1.5px double #b88a3e; padding-bottom:8px; margin-bottom:10px; }
    .tw-theater-scroll-title { font-size:15px; font-weight:bold; color:#7d2019; letter-spacing:2px; margin-bottom:4px; }
    #tw-floating-root[data-theme="obsidian"] .tw-theater-scroll-title { color:#f0c97d; }
    .tw-theater-scroll-meta { display:flex; justify-content:center; gap:8px; font-size:10px; color:#785c49; }
    #tw-floating-root[data-theme="obsidian"] .tw-theater-scroll-meta { color:#a3927b; }
    .tw-theater-para { font-size:12.5px; line-height:1.88; margin:0 0 9px; text-indent:2em; text-align:justify; letter-spacing:0.4px; }
    .tw-theater-para.first-para { text-indent:0; }
    .tw-theater-dropcap { float:left; font-size:24px; font-weight:bold; line-height:1; padding:3px 6px; margin-right:6px; margin-top:2px; color:#fff8eb; background:#8f241e; border:1px solid #d4a857; border-radius:4px; font-family:"STKaiti","Kaiti SC",serif; }
    .tw-theater-quote { color:#7a1e18; font-weight:bold; }
    #tw-floating-root[data-theme="obsidian"] .tw-theater-quote { color:#f2c97d; }
    .tw-theater-scroll-foot { display:flex; justify-content:space-between; align-items:center; margin-top:12px; padding-top:8px; border-top:1px dashed rgba(140,90,50,0.4); font-size:10.5px; color:#785c49; }
    .tw-theater-stamp { padding:2px 8px; border:1.5px solid #a8201a; color:#a8201a; font-weight:bold; font-size:10px; border-radius:3px; letter-spacing:1.5px; transform:rotate(-4deg); background:rgba(168,32,26,0.06); }
    /* 帝王起居专属背景图（防提示条顶开露底 + 100%锁死全覆盖 + 纯白字体） */
    .tw-content:has(#tw-page-emperor.active) {
      background-image: linear-gradient(rgba(10, 6, 4, 0.14), rgba(10, 6, 4, 0.28)), url("${EMPEROR_BG_URL}") !important;
      background-size: cover !important;
      background-position: center !important;
    }
    .tw-content:has(#tw-page-emperor.active) #twApiStatusBar {
      background: rgba(20, 14, 10, 0.65) !important;
      color: #fff6d6 !important;
      border-color: rgba(255, 235, 190, 0.55) !important;
      backdrop-filter: blur(4px);
    }
    #tw-page-emperor {
      background-image: linear-gradient(rgba(10, 6, 4, 0.14), rgba(10, 6, 4, 0.28)), url("${EMPEROR_BG_URL}");
      background-size: cover;
      background-position: center;
      margin: -11px -12px -13px !important;
      padding: 14px 13px 18px !important;
      min-height: calc(100% + 24px) !important;
      border-radius: 0 !important;
    }
    #tw-page-emperor > .tw-box { background:rgba(20, 14, 10, 0.20) !important; backdrop-filter:blur(1.5px); border:1px solid rgba(255, 240, 200, 0.38) !important; }
    #tw-page-emperor .tw-sec-head, #tw-page-emperor .tw-label, #tw-page-emperor .tw-spy-tile-name, #tw-page-emperor .tw-spy-detail-header span { color:#ffffff !important; text-shadow:0 1px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.8) !important; border-bottom-color:rgba(255,240,200,0.3) !important; }
    #tw-page-emperor .tw-spy-tile-sub, #tw-page-emperor .tw-empty-hint { color:#f5e6c8 !important; text-shadow:0 1px 3px rgba(0,0,0,0.95) !important; }
    #tw-page-emperor .tw-spy-tile { background:rgba(20, 14, 10, 0.32) !important; backdrop-filter:blur(2px); border:1.5px solid rgba(255, 235, 190, 0.5) !important; }
    #tw-page-emperor .tw-spy-seal-stamp { background:rgba(255, 245, 220, 0.18) !important; border:1.5px dashed #ffe8a3 !important; color:#ffffff !important; }
    #tw-page-emperor .tw-spy-entry-item { background:rgba(20, 14, 10, 0.45) !important; border:1px solid rgba(255, 240, 200, 0.35) !important; border-left:3.5px solid #ffe8a3 !important; color:#ffffff !important; text-shadow:0 1px 3px rgba(0,0,0,0.95) !important; }
    #tw-page-emperor .tw-spy-murmur-box { background:rgba(30, 18, 14, 0.52) !important; border:1.5px dashed #ffe8a3 !important; border-left:4px solid #ffe8a3 !important; color:#fff6d6 !important; text-shadow:0 1px 3px rgba(0,0,0,0.95) !important; }




    /* 抓包弹窗大尺寸帝王头像 */
    .tw-catch-modal { display:none; position:absolute; inset:0; background:rgba(15, 8, 6, 0.84); backdrop-filter:blur(5px); z-index:99; align-items:center; justify-content:center; padding:16px; }
    .tw-catch-modal.show { display:flex; }
    .tw-catch-card { width:100%; max-width:370px; background:var(--bg-paper); border:2px solid #9e241e; outline:1px solid var(--gold); outline-offset:-5px; border-radius:14px; padding:16px; box-shadow:0 16px 40px rgba(0,0,0,0.75); text-align:center; }
    .tw-catch-avatar-big { width:118px; height:118px; border-radius:18px; object-fit:cover; border:2.5px solid var(--gold); box-shadow:0 8px 22px rgba(158, 36, 30, 0.45); margin:0 auto 10px; display:block; }
    .tw-catch-title { font-size:15.5px; font-weight:bold; color:#9e241e; margin-bottom:8px; letter-spacing:1.5px; }
    .tw-catch-desc { font-size:12px; line-height:1.65; color:var(--text-main); margin-bottom:12px; text-align:left; background:var(--bg-sub); padding:9px 11px; border-radius:6px; border-left:3px solid #9e241e; max-height:320px; overflow-y:auto; white-space:pre-wrap; }

    /* 飞鸽传书（仿真古风信笺） */
    .tw-letter-paper { background-color:#f9f1e1; background-image:repeating-linear-gradient(90deg, transparent 0px, transparent 31px, rgba(168, 68, 56, 0.22) 31px, rgba(168, 68, 56, 0.22) 32px); border:2px solid #8c5a32; outline:1px solid #c9a368; outline-offset:-5px; border-radius:8px; padding:14px 16px; color:#2b1d12; position:relative; box-shadow:inset 0 0 28px rgba(138, 96, 48, 0.18), 0 4px 12px rgba(0,0,0,0.08); margin-bottom:10px; }
    .tw-letter-salutation { font-size:13.5px; font-weight:bold; color:#5e1d18; margin-bottom:8px; letter-spacing:1.5px; }
    .tw-letter-body { font-size:12.5px; line-height:1.95; white-space:pre-wrap; min-height:95px; letter-spacing:0.8px; }
    .tw-letter-footer { display:flex; justify-content:flex-end; align-items:center; gap:10px; margin-top:12px; padding-top:6px; }
    .tw-letter-sign { font-size:12px; font-weight:bold; color:#4a2c18; letter-spacing:1px; }
    .tw-letter-seal { width:38px; height:38px; border:2px solid #a8201a; border-radius:4px; color:#a8201a; font-size:10px; font-weight:bold; line-height:1.15; display:flex; align-items:center; justify-content:center; text-align:center; padding:2px; transform:rotate(-7deg); background:rgba(168, 32, 26, 0.08); box-shadow:inset 0 0 0 1px rgba(168, 32, 26, 0.35); font-family:"STKaiti","Kaiti SC",serif; }
    .tw-letter-item-card { background:var(--bg-sub); border:1px solid var(--border-soft); border-left:3.5px solid var(--accent); border-radius:6px; padding:8px 10px; margin-bottom:7px; cursor:pointer; transition:all .15s; }
    .tw-letter-item-card:hover { border-color:var(--accent); transform:translateX(2px); }

    /* 仿真堪舆动态地图 */
    .tw-map-canvas { width:100%; height:205px; background:radial-gradient(circle at center, #f4ead5 0%, #dfd0b2 100%); border:2px solid var(--border-outer); border-radius:10px; position:relative; overflow:hidden; margin-bottom:9px; box-shadow:inset 0 0 24px rgba(90, 58, 24, 0.28); }
    #tw-floating-root[data-theme="obsidian"] .tw-map-canvas { background:radial-gradient(circle at center, #2b241d 0%, #17130f 100%); }
    .tw-map-svg { width:100%; height:100%; display:block; }
    .tw-map-route { stroke:#8c6239; stroke-width:1.4; stroke-dasharray:4 4; fill:none; opacity:0.65; animation:twDashFlow 3s linear infinite; }
    .tw-map-pulse { fill:none; stroke:#b82921; stroke-width:1.6; animation:twMapRadar 2.2s infinite ease-out; }
    .tw-map-node { fill:#852922; stroke:#fff8eb; stroke-width:1.5; cursor:pointer; }
    .tw-map-node.gold { fill:#b88a3e; }
    .tw-map-label { font-size:9.5px; font-weight:bold; fill:#3b2314; text-anchor:middle; pointer-events:none; }
    #tw-floating-root[data-theme="obsidian"] .tw-map-label { fill:#f0d9b5; }

    /* 默契挑战选项样式 */
    .tw-tacit-q-card { background:var(--bg-sub); border:1px solid var(--border-soft); border-radius:8px; padding:9px 10px; margin-bottom:8px; }
    .tw-tacit-q-title { font-size:12.5px; font-weight:bold; color:var(--accent-strong); margin-bottom:6px; line-height:1.45; }
    .tw-tacit-opt { display:block; width:100%; text-align:left; padding:6px 9px; margin-bottom:5px; font-size:11.5px; background:var(--bg-card); border:1px solid var(--border-soft); border-radius:6px; cursor:pointer; font-family:inherit; color:var(--text-main); transition:all .14s; }
    .tw-tacit-opt.selected { background:var(--accent); color:#fff8eb; border-color:var(--border-outer); font-weight:bold; }
    .tw-tacit-opt.correct-mark { border:2px solid #2b7a3e; }
    .tw-tacit-comment { margin-top:5px; padding:6px 8px; background:rgba(133, 41, 34, 0.08); border-left:3px solid var(--accent); border-radius:4px; font-size:11.5px; color:var(--accent-strong); }

    .tw-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:9px; }
    .tw-box { background:var(--bg-card); backdrop-filter:blur(8px); border:1px solid var(--border-soft); border-radius:10px; padding:10px 11px; margin-bottom:9px; }
    .tw-label { font-size:11px; color:var(--text-sub); }
    .tw-val { font-size:14.5px; font-weight:bold; color:var(--accent-strong); margin:2px 0; }
    .tw-bar { height:5px; background:var(--border-soft); border-radius:4px; overflow:hidden; margin-top:4px; }
    .tw-bar i { display:block; height:100%; width:0%; background:linear-gradient(90deg,var(--accent),var(--gold)); transition:width .35s; }
    .tw-sec-head { font-size:13px; font-weight:bold; color:var(--accent-strong); margin-bottom:7px; padding-bottom:4px; border-bottom:1px solid var(--border-soft); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px; }
    .tw-badge { display:inline-block; padding:1.5px 6px; font-size:10px; color:var(--accent); background:rgba(142,53,46,0.09); border:1px solid var(--border-soft); border-radius:4px; margin-right:4px; }
    .tw-row { padding:6px 0; border-bottom:1px dashed var(--border-soft); line-height:1.6; }
    .tw-row:last-child { border-bottom:0; }
    .tw-row b { color:var(--accent-strong); }
    .tw-spy-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:6px; }
        .tw-spy-tile { position:relative; background:linear-gradient(145deg, rgba(251,246,234,0.48) 0%, rgba(226,211,183,0.36) 100%); backdrop-filter:blur(2px); border:1.5px solid rgba(140, 98, 57, 0.75); border-radius:10px; padding:10px 8px; cursor:pointer; transition:all .2s ease; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; min-height:92px; text-shadow:0 0 6px rgba(255,252,245,0.95); }
    #tw-floating-root[data-theme="obsidian"] .tw-spy-tile { background:linear-gradient(145deg, rgba(32,26,22,0.52) 0%, rgba(20,16,12,0.42) 100%); text-shadow:0 1px 4px rgba(0,0,0,0.95); }
    .tw-spy-tile:hover { transform:translateY(-2px); border-color:var(--accent); }
    .tw-spy-tile.visited { border-color:var(--gold); }
    .tw-spy-seal-stamp { width:30px; height:30px; border-radius:50%; background:rgba(133, 41, 34, 0.12); border:1.5px dashed var(--accent); color:var(--accent); display:flex; align-items:center; justify-content:center; font-size:14px; margin-bottom:4px; }
    .tw-spy-tile-name { font-size:12.5px; font-weight:bold; color:var(--accent-strong); }
    .tw-spy-tile-sub { font-size:9.5px; color:var(--text-sub); margin-top:2px; }
    .tw-spy-seal-hint { margin-top:4px; font-size:9px; padding:1.5px 7px; border-radius:10px; background:var(--accent); color:#fff8eb; }
    .tw-spy-tile.visited .tw-spy-seal-hint { background:var(--bg-sub); color:var(--accent-strong); border:1px solid var(--border-soft); }
    .tw-spy-detail-header { display:flex; justify-content:space-between; align-items:center; padding-bottom:8px; margin-bottom:10px; border-bottom:1.5px solid var(--border-outer); }
    .tw-spy-back-btn { padding:4px 10px; font-size:11px; font-weight:bold; background:var(--bg-sub); color:var(--accent-strong); border:1px solid var(--border-outer); border-radius:6px; cursor:pointer; font-family:inherit; }
    .tw-spy-entry-list { display:flex; flex-direction:column; gap:7px; margin-bottom:10px; }
    .tw-spy-entry-item { background:var(--bg-sub); border:1px solid var(--border-soft); border-left:3.5px solid var(--accent); border-radius:6px; padding:8px 10px; font-size:12px; line-height:1.65; }
    .tw-spy-murmur-box { padding:9px 11px; background:var(--bg-card); border:1.5px dashed var(--gold); border-left:4px solid var(--gold); border-radius:6px; font-size:12px; color:var(--accent-strong); line-height:1.6; }
    .tw-timeline { position:relative; padding-left:15px; margin-top:6px; }
    .tw-timeline::before { content:""; position:absolute; left:4px; top:6px; bottom:6px; width:2px; background:var(--border-outer); opacity:0.55; }
    .tw-tl-item { position:relative; padding:7px 0 9px 6px; border-bottom:1px dashed var(--border-soft); line-height:1.6; }
    .tw-tl-item:last-child { border-bottom:0; }
    .tw-tl-item::before { content:""; position:absolute; left:-14px; top:12px; width:8px; height:8px; border-radius:50%; background:var(--accent); border:1.5px solid var(--bg-paper); }
    .tw-tl-meta { display:flex; flex-wrap:wrap; gap:4px; align-items:center; margin-bottom:3px; }
    .tw-tl-time, .tw-tl-loc { display:inline-block; font-size:10.5px; font-weight:bold; padding:1px 6px; border-radius:4px; border:1px solid var(--border-soft); }
    .tw-tl-time { color:var(--accent-strong); background:var(--bg-sub); }
    .tw-tl-loc { color:var(--accent); background:rgba(142,53,46,0.08); }
    .tw-tl-summary { font-size:12px; color:var(--text-main); }
    .tw-empty-hint { text-align:center; color:var(--text-sub); padding:16px 10px; font-size:11.5px; line-height:1.6; font-style:italic; }
    .tw-input,.tw-select,.tw-textarea { width:100%; padding:6px 9px; font-size:12px; border:1px solid var(--border-soft); border-radius:6px; background:var(--bg-card); color:var(--text-main); margin-bottom:7px; font-family:inherit; }
    .tw-textarea { min-height:60px; resize:vertical; }
    .tw-forum-bar { display:flex; gap:6px; margin-bottom:8px; align-items:center; }
    .tw-forum-bar .tw-input { margin-bottom:0; flex:1; }
    .tw-refresh-forum-btn { padding:5px 10px; font-size:11px; font-weight:bold; background:var(--accent); color:#fff8eb; border:1px solid var(--border-outer); border-radius:6px; cursor:pointer; white-space:nowrap; font-family:inherit; }
    .tw-refresh-forum-btn:disabled { opacity:.55; cursor:wait; }
    .tw-ai-wait-btn { padding:6px 10px; font-size:13px; font-weight:bold; background:var(--bg-sub); color:var(--accent-strong); border:1.5px solid var(--border-outer); border-radius:6px; cursor:pointer; white-space:nowrap; font-family:inherit; display:flex; align-items:center; justify-content:center; min-width:34px; }
    .tw-ai-wait-btn::after { content:"✦"; font-size:13px; }
    .tw-ai-wait-btn:hover { background:var(--accent); color:#fff8eb; }
    .tw-ai-wait-btn:disabled { opacity:.45; cursor:wait; }
    .tw-post-meta { display:flex; justify-content:space-between; align-items:center; font-size:10.5px; color:var(--text-sub); }
    .tw-post-tit { font-size:13.5px; font-weight:bold; color:var(--accent-strong); margin:4px 0; }
    .tw-post-txt { margin:0 0 7px; line-height:1.55; font-size:12px; }
    .tw-post-foot { display:flex; justify-content:space-between; align-items:center; padding-top:5px; border-top:1px solid var(--border-soft); font-size:10.5px; }
    .tw-act-btn { background:none; border:0; color:var(--text-sub); font-size:11px; cursor:pointer; padding:2px 5px; font-family:inherit; }
    .tw-act-btn.liked { color:var(--accent); font-weight:bold; }
    .tw-del-btn { background:none; border:1px solid rgba(158, 36, 30, 0.35); border-radius:4px; color:#9e241e; font-size:9.5px; padding:0px 5px; cursor:pointer; line-height:1.4; font-family:inherit; }
    .tw-peek-recall-btn { background:rgba(142, 53, 46, 0.08); border:1px dashed var(--accent); border-radius:10px; color:var(--accent-strong); font-size:10px; padding:1px 7px; cursor:pointer; font-family:inherit; }
    .tw-recalled-reveal-box { margin-top:4px; padding:4px 9px; background:var(--bg-card); border-left:2.5px solid var(--gold); border-radius:4px; font-size:11px; color:var(--text-main); text-align:left; max-width:92%; }
    .tw-typing-row { align-self:flex-start; font-size:11px; color:var(--accent-strong); background:var(--bg-card); border:1px dashed var(--border-outer); padding:4px 11px; border-radius:12px; margin:2px 0; animation:twPulseTyping 1.2s infinite ease-in-out; }
    .tw-at-highlight { color:var(--accent); font-weight:bold; background:rgba(133, 41, 34, 0.08); padding:0 3px; border-radius:3px; }
    .tw-chat-msg.self .tw-at-highlight { color:#ffe8a3; background:rgba(255, 255, 255, 0.16); }
    .tw-at-picker-bar { display:none; padding:5px 8px; background:var(--bg-card); border:1.5px solid var(--border-outer); border-radius:6px; margin-bottom:5px; }
    .tw-at-picker-bar.active { display:block; }
    .tw-cmt-box { margin-top:7px; padding:7px 8px; background:var(--bg-sub); border-left:2.5px solid var(--border-outer); border-radius:5px; }
    .tw-cmt-line { font-size:11px; line-height:1.5; padding:4px 0; border-bottom:1px dashed var(--border-soft); display:flex; justify-content:space-between; align-items:flex-start; gap:5px; }
    .tw-cmt-line:last-of-type { border-bottom:0; }
    .tw-cmt-u { color:var(--accent-strong); font-weight:bold; }
    .tw-reply-npc-btn { background:none; border:1px solid var(--border-soft); border-radius:4px; color:var(--accent); font-size:10px; padding:2px 6px; cursor:pointer; white-space:nowrap; font-family:inherit; }
    .tw-reply-npc-btn:disabled { opacity:.5; cursor:wait; }
    .tw-reply-target-bar { display:none; justify-content:space-between; align-items:center; font-size:10.5px; color:var(--accent-strong); background:rgba(142,53,46,0.1); padding:3px 7px; border-radius:4px; margin-top:5px; }
    .tw-reply-target-bar.active { display:flex; }
    .tw-cmt-send { display:flex; gap:5px; margin-top:5px; }
    .tw-cmt-send input { flex:1; padding:5px 8px; font-size:11.5px; border:1px solid var(--border-soft); border-radius:5px; background:var(--bg-card); color:var(--text-main); font-family:inherit; }
    .tw-cmt-send button { padding:5px 9px; font-size:11px; background:var(--accent); color:#fff; border:0; border-radius:5px; cursor:pointer; font-family:inherit; }
    .tw-act-card { background:var(--bg-card); border:1px solid var(--border-soft); border-left:4px solid var(--accent); border-radius:7px; padding:9px 10px; margin-bottom:8px; cursor:pointer; }
    .tw-act-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; }
    .tw-act-title { font-size:12.5px; font-weight:bold; color:var(--accent-strong); }
    .tw-send-hint { font-size:10px; color:var(--accent); font-weight:bold; }
    .tw-toggle-btn { padding:3px 10px; font-size:10.5px; font-weight:bold; border:1px solid var(--border-outer); border-radius:12px; cursor:pointer; font-family:inherit; background:var(--bg-sub); color:var(--text-main); }
    .tw-toggle-btn.on { background:var(--accent); color:#fff8eb; }
    .tw-toggle-btn.disabled-gray, .tw-toggle-btn:disabled { opacity:0.42 !important; filter:grayscale(100%); cursor:not-allowed !important; }
    .tw-sub-switch-row { display:flex; justify-content:space-between; align-items:center; padding:6px 8px; border-bottom:1px dashed var(--border-soft); }
    .tw-sub-switch-row:last-child { border-bottom:0; }
    .tw-api-mode-cards { display:grid; grid-template-columns:1fr 1fr; gap:7px; margin-bottom:9px; }
    .tw-api-mode-card { padding:8px 9px; border:1.5px solid var(--border-soft); border-radius:7px; background:var(--bg-sub); cursor:pointer; text-align:left; font-family:inherit; color:var(--text-main); }
    .tw-api-mode-card b { display:block; font-size:12px; color:var(--accent-strong); margin-bottom:2px; }
    .tw-api-mode-card span { font-size:10px; color:var(--text-sub); line-height:1.35; display:block; }
    .tw-api-mode-card.active { border-color:var(--accent); background:var(--bg-card); box-shadow:inset 0 0 0 1px var(--accent); }
    .tw-chip-row { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:7px; }
    .tw-chip-row.tw-nowrap-scroll { flex-wrap:nowrap; overflow-x:auto; white-space:nowrap; scrollbar-width:none; padding-bottom:2px; margin-bottom:4px; }
    .tw-chip-row.tw-nowrap-scroll::-webkit-scrollbar { display:none; }
    .tw-chip { padding:3.5px 8px; font-size:10.5px; background:var(--bg-sub); border:1px solid var(--border-soft); color:var(--text-main); border-radius:12px; cursor:pointer; flex-shrink:0; }
    .tw-chip.active { background:var(--accent); color:#fff8eb; border-color:var(--border-outer); font-weight:bold; }
    .tw-game-tabs { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:8px; }
    .tw-game-tab-btn { padding:6px 4px; font-size:11.5px; font-weight:bold; background:var(--bg-card); color:var(--text-main); border:1.5px solid var(--border-soft); border-radius:8px; cursor:pointer; font-family:inherit; }
    .tw-game-tab-btn.active { background:var(--accent); color:#fff8eb; border-color:var(--border-outer); }
    .tw-subgame-pane { display:none; }
    .tw-subgame-pane.active { display:block; }
    .tw-memorial-scroll { background:var(--bg-sub); border:1.5px double var(--border-outer); padding:10px 11px; border-radius:6px; margin-bottom:8px; line-height:1.65; }
    .tw-gomoku-wrap { display:flex; flex-direction:column; align-items:center; }
    .tw-gomoku-board { display:grid; grid-template-columns:repeat(11,25px); grid-template-rows:repeat(11,25px); background:#dec496; border:2px solid #734f29; padding:5px; border-radius:6px; margin:6px auto; user-select:none; }
    .tw-gomoku-cell { width:25px; height:25px; position:relative; display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .tw-gomoku-cell::before { content:""; position:absolute; width:100%; height:1px; background:rgba(90,55,25,0.55); }
    .tw-gomoku-cell::after { content:""; position:absolute; height:100%; width:1px; background:rgba(90,55,25,0.55); }
    .tw-stone { width:19px; height:19px; border-radius:50%; z-index:2; box-shadow:1px 2px 4px rgba(0,0,0,0.45); }
    .tw-stone.black { background:radial-gradient(circle at 30% 30%,#555,#111); }
    .tw-stone.white { background:radial-gradient(circle at 30% 30%,#fff,#d4cec3); border:1px solid #999; }
    .tw-chatroom-messages { height:400px; overflow-y:auto; background:var(--bg-sub); border:1px solid var(--border-soft); border-radius:8px; padding:9px 10px; margin-bottom:6px; display:flex; flex-direction:column; gap:7px; }
    .tw-chat-sys-tip { align-self:center; font-size:10px; color:var(--text-sub); background:rgba(140, 98, 57, 0.12); border:1px dashed var(--border-soft); padding:3px 10px; border-radius:12px; margin:2px 0; text-align:center; display:flex; flex-direction:column; align-items:center; gap:3px; }
    .tw-chat-sys-line { display:flex; align-items:center; gap:5px; flex-wrap:wrap; justify-content:center; }
       .tw-chat-msg { display:flex; flex-direction:column; align-self:flex-start; align-items:flex-start; width:fit-content; max-width:84%; animation:twBubblePop .22s ease-out; }
    .tw-chat-msg.self { align-self:flex-end; align-items:flex-end; }
    .tw-chat-head-row { display:flex; align-items:center; gap:5px; margin-bottom:2px; flex-wrap:wrap; }
    .tw-chat-sender { font-size:10px; color:var(--text-sub); font-weight:bold; }
    .tw-chat-quote-btn { background:none; border:1px solid var(--border-soft); border-radius:4px; color:var(--accent); font-size:9px; padding:0px 4px; cursor:pointer; font-family:inherit; }
    .tw-chat-bubble { display:inline-block; width:fit-content; max-width:100%; background:var(--bg-card); border:1px solid var(--border-soft); padding:6px 10px; border-radius:9px; line-height:1.45; font-size:12px; word-break:break-word; }

    .tw-chat-msg.self .tw-chat-bubble { background:var(--accent); color:#fff8eb; border-color:var(--border-outer); }
    .tw-chat-quoted-block { font-size:10px; padding:3px 6px; margin-bottom:4px; border-left:2px solid var(--border-outer); background:rgba(0,0,0,0.06); border-radius:4px; }
    .tw-chat-msg.self .tw-chat-quoted-block { border-left-color:rgba(255,248,235,0.75); background:rgba(255,255,255,0.14); color:#fff8eb; }
    .tw-chat-quote-bar { display:none; justify-content:space-between; align-items:center; font-size:10.5px; color:var(--accent-strong); background:rgba(142,53,46,0.1); border:1px dashed var(--border-soft); padding:4px 8px; border-radius:5px; margin-bottom:5px; }
    .tw-chat-quote-bar.active { display:flex; }
    .tw-theme-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:6px; margin-bottom:6px; }
    .tw-theme-btn { padding:7px; border:1.5px solid var(--border-soft); border-radius:6px; background:var(--bg-card); color:var(--text-main); font-size:11.5px; font-weight:bold; cursor:pointer; font-family:inherit; }
    .tw-theme-btn.active { border-color:var(--accent); color:var(--accent-strong); box-shadow:inset 0 0 0 1px var(--accent); }
    .tw-status-tip { font-size:11px; font-weight:bold; color:var(--accent-strong); background:var(--bg-sub); border:1.5px solid var(--accent); padding:6px 10px; border-radius:6px; margin-bottom:8px; display:none; }
    .tw-status-tip.show { display:block; }
    .tw-error-banner { display:none; justify-content:space-between; align-items:center; gap:8px; font-size:11px; font-weight:bold; color:#fff8f6; background:linear-gradient(135deg, #9e241e 0%, #6e1410 100%); border:1.5px solid #e69a8d; padding:6px 10px; border-radius:6px; margin-bottom:8px; }
    .tw-error-banner.show { display:flex; }
    .tw-error-close { background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.45); color:#fff; font-size:10px; padding:1px 6px; border-radius:4px; cursor:pointer; font-family:inherit; }
    .tw-log-list { max-height:190px; overflow-y:auto; background:var(--bg-sub); border:1px solid var(--border-soft); border-radius:6px; padding:6px 8px; }
    .tw-log-item { padding:5px 6px; border-bottom:1px dashed var(--border-soft); font-size:10.5px; line-height:1.4; }
    .tw-log-item:last-child { border-bottom:0; }
    .tw-log-item.err { background:rgba(168, 36, 30, 0.08); border-left:3px solid #a8241e; padding-left:6px; }
    .tw-log-item.ok { border-left:3px solid var(--gold); padding-left:6px; }
    .tw-log-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:2px; }
    .tw-log-tag { font-size:9.5px; padding:1px 5px; border-radius:3px; font-weight:bold; }
    .tw-log-tag.ok { background:rgba(70, 120, 80, 0.16); color:#265934; }
    .tw-log-tag.err { background:rgba(168, 36, 30, 0.18); color:#9e1e18; }
    .tw-log-detail { color:var(--text-sub); word-break:break-all; }
    .tw-wp-preview { width:100%; height:92px; border-radius:8px; border:1.5px dashed var(--border-outer); background-size:cover; background-position:center; display:flex; align-items:center; justify-content:center; font-size:11px; color:var(--text-sub); margin-bottom:8px; overflow:hidden; position:relative; }
  `;
  targetDoc.head.appendChild(styleEl);

  const rootEl = targetDoc.createElement("div");
  rootEl.id = "tw-floating-root";
  rootEl.setAttribute("data-theme", config.theme || "xuanpaper");
  rootEl.innerHTML = `
    <div class="tw-fab-ball" id="twFabBall" title="点击展开太微玉简小手机（可上下拖动）">
      <span class="tw-fab-dot"></span>
      <span class="tw-fab-top">太微</span>
      <span class="tw-fab-main">玉简</span>
      <span class="tw-fab-ornament"></span>
    </div>
    <div class="tw-wechat-banner" id="twWechatBanner" title="点击直接查看消息">
      <div class="tw-wechat-avatar" id="twWechatAvatar">萧</div>
      <div class="tw-wechat-body">
        <div class="tw-wechat-top"><span id="twWechatSender">萧承稷</span><span class="tw-wechat-tag">刚刚 · 点击查看</span></div>
        <div class="tw-wechat-preview" id="twWechatPreview">你收到了一条新的传音…</div>
      </div>
    </div>
    <div class="tw-module-toast" id="twModuleToast"><span id="twModuleToastText">✨ 刷新成功</span></div>
    <div class="tw-modal-overlay tw-hidden" id="twModalOverlay">
      <div class="tw-panel" id="twMainPanel">
        <div class="tw-phone-wallpaper" id="twPhoneWallpaper"></div>
        <div class="tw-phone-wallpaper-mask" id="twPhoneWallpaperMask"></div>

        <div class="tw-catch-modal" id="twCatchModal">
          <div class="tw-catch-card">
            <img class="tw-catch-avatar-big" src="${CATCH_AVATAR_URL}" alt="萧承稷">
            <div class="tw-catch-title">⚠️ 窥探圣躬过久 · 被当场抓包！</div>
            <div class="tw-catch-desc" id="twCatchDesc">赵怀安低着头刚把起居注合上，甘露殿内传来一声极轻的冷嗤。萧承稷指尖慢条斯理地转过墨玉扳指，淡色眼瞳隔着宫墙似已将你接连翻看他起居秘录的小动作尽收眼底，并向你发来了一道私密传音……</div>
            <button type="button" class="tw-refresh-forum-btn" id="twGoCaughtDmBtn" style="width:100%;padding:8px;">立即前往【灵犀传音·私聊】查看圣人质问</button>
          </div>
        </div>

        <div class="tw-catch-modal" id="twClearConfirmModal">
          <div class="tw-catch-card">
            <div class="tw-catch-title">⚠️ 确定要清空当前存档吗？</div>
            <div class="tw-catch-desc">此操作将彻底清除本档已生成的【故事时间轴、地图动态、帝王起居、宫内外坛、灵犀传音、飞鸽传书与默契挑战】，清空后不可恢复。是否继续？</div>
            <div style="display:flex;gap:8px;justify-content:center;">
              <button type="button" class="tw-mini-btn" id="twCancelClearArchiveBtn" style="flex:1;padding:7px;background:var(--bg-sub);color:var(--text-main);border-color:var(--border-outer);font-weight:bold;">取消保留</button>
              <button type="button" class="tw-refresh-forum-btn" id="twConfirmClearArchiveBtn" style="flex:1;padding:7px;">确定清空</button>
            </div>
          </div>
        </div>

        <div class="tw-phone-statusbar">
          <span id="twPhoneTopShichen">大景延昭 · 太微宫</span>
          <div class="tw-phone-notch"></div>
          <span>灵犀满格 · ❖ 玖成</span>
        </div>

        <div class="tw-app-header home-mode" id="twAppHeaderBar">
          <div style="display:flex;align-items:center;gap:6px;">
            <button type="button" class="tw-back-home-btn" id="twBackHomeBtn" style="display:none;">← 桌面</button>
            <div class="tw-head-title" id="twAppHeaderTitle">太微宫闻录</div>
          </div>
          <div class="tw-head-btns">
            <button type="button" class="tw-mini-btn api-btn tw-manual-refresh-btn" id="twBtnApiSync">全刷</button>
            <button type="button" class="tw-mini-btn" id="twBtnClearAll">清空</button>
            <button type="button" class="tw-mini-btn" id="twBtnClose">✕</button>
          </div>
        </div>

        <div class="tw-content">
          <div class="tw-status-tip" id="twApiStatusBar">刷新中…</div>
          <div class="tw-error-banner" id="twApiErrorBanner"><span id="twApiErrorText">API 调用出错</span><button type="button" class="tw-error-close" id="twCloseErrorBannerBtn">知道了</button></div>

          <!-- 0. 古风小手机主桌面 (Home Screen) -->
          <div class="tw-tab-page active" id="tw-page-home">
            <div class="tw-home-hero-card">
              <div class="tw-home-clock-row">
                <span class="tw-home-shichen" id="twHomeTimeTxt">延昭二年 · 待同步</span>
                <div style="display:flex;align-items:center;gap:5px;">
                  <span class="tw-home-loc" id="twHomeLocTxt">📍 太微宫</span>
                  <button type="button" class="tw-reply-npc-btn tw-manual-refresh-btn" id="twHomeRefreshStatusBtn" style="padding:1px 6px;font-size:9.5px;">刷新状态</button>
                </div>
              </div>
              <div class="tw-home-mini-status">
                <div><span class="tw-label">当前身份：</span><b id="twHomeUserTxt">--</b></div>
                <div><span class="tw-label">帝王好感：</span><b id="twHomeAffTxt" style="color:var(--accent);">-- / 100</b></div>
                <div style="grid-column:1 / -1;"><div class="tw-bar" style="margin:2px 0 4px;"><i id="twAffBar"></i></div></div>
                <div style="grid-column:1 / -1;"><span class="tw-label">圣人心情：</span><span class="tw-badge" id="twHomeMoodBadge">待同步</span><span id="twHomePoseTxt" style="font-size:11px;color:var(--text-sub);"></span></div>
                <div style="grid-column:1 / -1;padding-top:3px;border-top:1px dashed var(--border-soft);color:var(--accent-strong);"><span class="tw-label">帝王心声：</span><span id="twHomeThoughtTxt">“……”</span></div>
              </div>
            </div>
            <div class="tw-app-grid" id="twPhoneAppGrid"></div>
            <div class="tw-phone-dock" id="twPhoneDockGrid"></div>
          </div>

          <!-- 1. 剧情梳理 App（第一顺位） -->
          <div class="tw-tab-page" id="tw-page-plot">
            <div class="tw-box">
              <div class="tw-sec-head"><span>故事时间轴</span><div style="display:flex;gap:5px;"><button type="button" class="tw-reply-npc-btn tw-manual-refresh-btn" id="twAppendLatestPlotBtn">同步最新一轮</button><button type="button" class="tw-reply-npc-btn tw-manual-refresh-btn" id="twRebuildFullPlotBtn" style="background:var(--accent);color:#fff;">全量重梳全部楼层</button></div></div>
              <div id="twPlotSummaryList"></div>
            </div>
          </div>

          <!-- 2. 剧情选择 App（第二顺位） -->
          <div class="tw-tab-page" id="tw-page-actions">
            <div class="tw-box">
              <div class="tw-sec-head"><span>自定义剧情走向与灵感</span><button type="button" class="tw-refresh-forum-btn tw-manual-refresh-btn" id="twRefreshActionsBtn" style="padding:4px 10px;font-size:11px;">手动刷新</button></div>
              <div class="tw-chip-row" id="twStoryPlanChips">
                <span class="tw-chip" data-idea="暗生情愫与单独相处">感情升温</span><span class="tw-chip" data-idea="嫉妒吃醋与强势试探">帝王吃醋</span><span class="tw-chip" data-idea="六宫刁难或朝堂交锋">突发冲突</span>
                <span class="tw-chip" data-idea="旧部密信或外邦异动">暗流伏笔</span><span class="tw-chip" data-idea="北苑游宴或微服出宫">游宴散心</span><span class="tw-chip" data-idea="深夜急召或意外撞破">意外变故</span>
              </div>
              <input class="tw-input" id="twStoryCustomIdea" style="margin-bottom:0;" placeholder="输入你想生成的剧情走向，留空则结合当前剧情直接生成六个事件……">
            </div>
            <div class="tw-box"><div class="tw-sec-head"><span>六大剧情发展建议</span><span class="tw-badge">第三人称 · 点击导入</span></div><div id="twStoryPlanList"></div></div>
          </div>

          <!-- 3. 灵犀传音 App（单人私聊 + 太微群聊） -->
          <div class="tw-tab-page" id="tw-page-chat">
            <div class="tw-game-tabs">
              <button type="button" class="tw-game-tab-btn active" data-chattab="dm">💬 单人私密传音</button>
              <button type="button" class="tw-game-tab-btn" data-chattab="chatroom">🏮 太微宫茶话群聊</button>
            </div>
            <div class="tw-subgame-pane active" id="tw-chat-pane-dm">
              <div class="tw-box" style="padding:8px 10px;margin-bottom:0;">
                <div class="tw-sec-head" style="margin-bottom:5px;">
                  <span>单人私密传音</span>
                  <div style="display:flex;gap:4px;flex-wrap:wrap;">
                    <button type="button" class="tw-reply-npc-btn" id="twDmRefreshRosterBtn">🔄 刷新人物</button>
                    <button type="button" class="tw-reply-npc-btn" id="twDmSyncStoryBtn" style="background:var(--accent);color:#fff;">同步剧情开聊</button>
                    <button type="button" class="tw-reply-npc-btn" id="twDmExportOfflineBtn">转线下填入酒馆</button>
                    <button type="button" class="tw-reply-npc-btn" id="twDmClearBtn">清空</button>
                  </div>
                </div>
                <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;"><span class="tw-label" style="white-space:nowrap;">传音对象：</span><select class="tw-select" id="twDmNpcSelect" style="margin-bottom:0;flex:1;padding:4px 8px;"></select></div>
                <div class="tw-chatroom-messages" id="twDmBox"></div>
                <div class="tw-chat-quote-bar" id="twDmQuoteBar"><span id="twDmQuoteText" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:82%;"></span><button type="button" class="tw-act-btn" id="twCancelDmQuoteBtn" style="color:var(--accent);font-weight:bold;">取消引用</button></div>
                <div style="display:flex;gap:5px;align-items:stretch;">
                  <input class="tw-input" id="twDmInput" style="margin-bottom:0;flex:1;" placeholder="点「发送」仅发消息，点右侧按钮让对方回复……">
                  <button type="button" class="tw-refresh-forum-btn" id="twDmSendBtn">发送</button>
                  <button type="button" class="tw-ai-wait-btn" id="twDmWaitAiBtn" title="等待对方回复"></button>
                </div>
              </div>
            </div>
            <div class="tw-subgame-pane" id="tw-chat-pane-chatroom">
              <div class="tw-box" style="padding:8px 10px;margin-bottom:0;">
                <div class="tw-sec-head" style="margin-bottom:4px;padding-bottom:3px;">
                  <span style="font-size:11.5px;">太微群聊 · <span id="twChatroomRoleBadge">未同步</span></span>
                  <div style="display:flex;gap:4px;flex-wrap:wrap;">
                    <button type="button" class="tw-reply-npc-btn" id="twRandomChatTopicBtn" style="background:var(--accent);color:#fff;">刷新群聊</button>
                    <button type="button" class="tw-reply-npc-btn" id="twGroupExportOfflineBtn" style="border-color:var(--accent);font-weight:bold;">转线下填入酒馆</button>
                    <button type="button" class="tw-reply-npc-btn" id="twClearChatroomBtn">清空</button>
                  </div>
                </div>
                <div style="margin-bottom:5px;padding-bottom:4px;border-bottom:1px dashed var(--border-soft);">
                  <div class="tw-label" style="margin-bottom:3px;font-size:10px;">⇄ 左右滑动切换主题（IF线/自定义转酒馆时会自动附带平行背景说明）：</div>
                  <div class="tw-chip-row tw-nowrap-scroll" id="twGroupThemeChips">
                    <span class="tw-chip" data-gtheme="story_sync">📍 同步当前剧情</span><span class="tw-chip" data-gtheme="user_empress_harem">👑 我是皇帝</span><span class="tw-chip" data-gtheme="palace_gossip">🍉 深宫八卦</span>
                    <span class="tw-chip" data-gtheme="street_fun">🏮 市井趣闻</span><span class="tw-chip" data-gtheme="if_modern">💼 IF现代豪门</span><span class="tw-chip" data-gtheme="if_campus">🏫 IF皇家高中</span>
                    <span class="tw-chip" data-gtheme="if_scifi">🚀 IF星际舰队</span><span class="tw-chip" data-gtheme="if_genderbend">🌸 IF全员性转</span><span class="tw-chip" data-gtheme="custom">✍️ 自定义主题</span>
                  </div>
                  <div id="twGroupCustomThemeWrap" style="display:none;margin-top:3px;"><input class="tw-input" id="twGroupCustomThemeInput" style="margin-bottom:0;padding:3px 8px;" placeholder="输入你想看的群聊主题或IF线设定……"></div>
                </div>
                <div class="tw-chatroom-messages" id="twChatroomBox"></div>
                <div class="tw-chat-quote-bar" id="twChatQuoteBar"><span id="twChatQuoteText" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:82%;"></span><button type="button" class="tw-act-btn" id="twCancelChatQuoteBtn" style="color:var(--accent);font-weight:bold;">取消引用</button></div>
                <div class="tw-at-picker-bar" id="twAtPickerBar">
                  <div class="tw-label" style="margin-bottom:3px;">选择要 @艾特 的群成员：</div>
                  <div class="tw-chip-row tw-nowrap-scroll" id="twAtPickerChips" style="margin-bottom:0;"></div>
                </div>
                <div style="display:flex;gap:5px;align-items:stretch;">
                  <input class="tw-input" id="twChatroomInput" style="margin-bottom:0;flex:1;" placeholder="输入 @ 选人艾特，点「发送」仅发消息，点右侧按钮触发群友回复……">
                  <button type="button" class="tw-refresh-forum-btn" id="twChatroomSendBtn">发送</button>
                  <button type="button" class="tw-ai-wait-btn" id="twChatroomWaitAiBtn" title="等待群友回复"></button>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. 飞鸽传书 App（仿真古风信笺写信与回信） -->
          <div class="tw-tab-page" id="tw-page-letter">
            <div class="tw-box">
              <div class="tw-sec-head">
                <span>🕊️ 鱼雁尺素 · 亲笔修书</span>
                <button type="button" class="tw-reply-npc-btn" id="twLetterClearAllBtn">清空信箱</button>
              </div>
              <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;">
                <span class="tw-label" style="white-space:nowrap;">收信之人：</span>
                <select class="tw-select" id="twLetterNpcSelect" style="margin-bottom:0;flex:1;padding:4px 8px;"></select>
              </div>
              <div class="tw-letter-paper">
                <div class="tw-letter-salutation" id="twLetterWriteSalutation">展信佳：</div>
                <textarea class="tw-textarea" id="twLetterWriteBody" style="background:transparent;border:0;padding:0;min-height:90px;line-height:1.95;font-size:12.5px;color:#2b1d12;outline:none;box-shadow:none;" placeholder="在此提笔写下书信内容，遣内侍或信鸽送往对方案头……"></textarea>
                <div class="tw-letter-footer">
                  <span class="tw-letter-sign" id="twLetterWriteSign">知名手启</span>
                  <div class="tw-letter-seal">太微<br>尺素</div>
                </div>
              </div>
              <button type="button" class="tw-refresh-forum-btn" id="twSendLetterBtn" style="width:100%;padding:7px;">🕊️ 封缄用印 · 飞鸽投递并静候回音</button>
            </div>
            <div class="tw-box">
              <div class="tw-sec-head"><span>📜 往来尺素锦匣（点击展信阅览）</span><span class="tw-badge" id="twLetterCountBadge">共 0 封</span></div>
              <div id="twLetterDetailView" style="display:none;"></div>
              <div id="twLetterListBox"></div>
            </div>
          </div>

          <!-- 5. 地图 App（动态仿真堪舆图 + 宫内外动向） -->
          <div class="tw-tab-page" id="tw-page-world">
            <div class="tw-box" style="padding:9px 10px;">
              <div class="tw-sec-head">
                <span>🗺️ 大景太微宫与长安百坊堪舆图</span>
                <button type="button" class="tw-refresh-forum-btn tw-manual-refresh-btn" id="twRefreshWorldBtn" style="padding:3px 10px;font-size:11px;">刷新动向</button>
              </div>
              <div class="tw-map-canvas">
                <svg class="tw-map-svg" viewBox="0 0 360 200">
                  <rect x="18" y="8" width="324" height="112" rx="4" fill="rgba(140,98,57,0.08)" stroke="#8c6239" stroke-width="1.5"/>
                  <rect x="18" y="126" width="324" height="66" rx="4" fill="rgba(70,110,98,0.08)" stroke="#6e5a49" stroke-width="1.2" stroke-dasharray="3 2"/>
                  <path class="tw-map-route" d="M180 28 L180 62 L180 102 L180 155"/>
                  <path class="tw-map-route" d="M75 55 L180 62 L285 55"/>
                  <path class="tw-map-route" d="M125 90 L180 62 L235 90"/>
                  <path class="tw-map-route" d="M85 158 L180 155 L275 158"/>
                  <circle class="tw-map-pulse" cx="180" cy="62" r="5"/>
                  <circle class="tw-map-pulse" cx="75" cy="55" r="5"/>
                  <circle class="tw-map-pulse" cx="285" cy="55" r="5"/>
                  <circle class="tw-map-pulse" cx="85" cy="158" r="5"/>
                  <circle class="tw-map-pulse" cx="275" cy="158" r="5"/>
                  <circle class="tw-map-node gold" cx="180" cy="24" r="4.5"/><text class="tw-map-label" x="180" y="16">北苑·太液池</text>
                  <circle class="tw-map-node" cx="180" cy="62" r="5.5"/><text class="tw-map-label" x="180" y="52">★甘露殿(帝寝)</text>
                  <circle class="tw-map-node" cx="75" cy="55" r="4.5"/><text class="tw-map-label" x="75" y="45">西六宫·承香殿</text>
                  <circle class="tw-map-node" cx="285" cy="55" r="4.5"/><text class="tw-map-label" x="285" y="45">东六宫·淑景殿</text>
                  <circle class="tw-map-node gold" cx="125" cy="92" r="4"/><text class="tw-map-label" x="125" y="106">延英殿</text>
                  <circle class="tw-map-node gold" cx="180" cy="102" r="4.5"/><text class="tw-map-label" x="180" y="115">宣政殿·丹凤门</text>
                  <circle class="tw-map-node gold" cx="235" cy="92" r="4"/><text class="tw-map-label" x="235" y="106">尚食·秘阁</text>
                  <circle class="tw-map-node" cx="85" cy="158" r="4.5"/><text class="tw-map-label" x="85" y="175">西市·胡月酒肆</text>
                  <circle class="tw-map-node gold" cx="180" cy="155" r="4.5"/><text class="tw-map-label" x="180" y="172">朱雀街·崇仁坊</text>
                  <circle class="tw-map-node" cx="275" cy="158" r="4.5"/><text class="tw-map-label" x="275" y="175">东市·醉仙平康</text>
                </svg>
              </div>
              <div class="tw-label" style="text-align:center;" id="twMapCurrentLocHint">📍 当前所在方位：太微宫 · 甘露殿</div>
            </div>
            <div class="tw-box"><div class="tw-sec-head"><span>宫内各处实时动向</span><span class="tw-badge">太微宫禁</span></div><div id="twPalaceWorldList"></div></div>
            <div class="tw-box"><div class="tw-sec-head"><span>长安百坊与边塞动向</span><span class="tw-badge">宫墙之外</span></div><div id="twOutsideWorldList"></div></div>
          </div>

          <!-- 6. 帝王起居 App（专属古风背景图） -->
          <div class="tw-tab-page" id="tw-page-emperor">
            <div class="tw-box">
              <div class="tw-sec-head"><span>甘露殿起居秘录·偷窥圣人</span><div style="display:flex;gap:6px;align-items:center;"><button type="button" class="tw-refresh-forum-btn tw-manual-refresh-btn" id="twRefreshEmperorSpyBtn" style="padding:4px 10px;font-size:11px;">偷窥刷新</button></div></div>
              <div class="tw-label" style="margin-bottom:6px;" id="twSpySubHint">点击下方任意暗格即可打开独立详情页，查看萧承稷今日吃了什么、做了什么、秘阁查阅记录与更衣净手状态……</div>
              <div id="twEmperorSpyList"></div>
            </div>
          </div>

          <!-- 7. 宫内外坛 App（八卦论坛） -->
          <div class="tw-tab-page" id="tw-page-forum">
            <div class="tw-box" style="padding:8px 10px;margin-bottom:8px;">
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <span class="tw-badge" style="margin:0;">我的昵称</span>
                <input class="tw-input" id="twForumNickInput" style="margin-bottom:0;flex:1;min-width:120px;padding:4px 8px;" value="" placeholder="默认空白（用本名），填马甲则盲猜…">
                <button type="button" class="tw-reply-npc-btn" id="twSaveForumNickBtn" style="padding:4px 8px;font-size:10.5px;background:var(--accent);color:#fff;">保存</button>
                <button type="button" class="tw-reply-npc-btn" id="twResetForumNickBtn" style="padding:4px 6px;font-size:10.5px;">恢复默认</button>
              </div>
              <div class="tw-label" style="margin-top:4px;margin-bottom:6px;">当前状态：<b id="twCurrentForumAuthorPreview" style="color:var(--accent-strong);">--</b></div>
              <div style="border-top:1px dashed var(--border-soft);padding-top:6px;">
                <div class="tw-chip-row" id="twForumStyleChips" style="margin-bottom:4px;">
                  <span class="tw-chip" data-fstyle="lively">🔥 鲜活茶水间</span><span class="tw-chip" data-fstyle="gossip">🍉 欢脱吃瓜风</span><span class="tw-chip" data-fstyle="snarky">🍵 宫斗阴阳风</span>
                  <span class="tw-chip" data-fstyle="street">🍡 市井烟火风</span><span class="tw-chip" data-fstyle="classical">📜 古风文雅风</span><span class="tw-chip" data-fstyle="custom">✍️ 自定义</span>
                </div>
                <div id="twForumCustomStyleWrap" style="display:none;margin-top:4px;"><input class="tw-input" id="twForumCustomStyleInput" style="margin-bottom:0;padding:4px 8px;" placeholder="输入你想要的论坛说话风格……"></div>
              </div>
            </div>
            <div class="tw-forum-bar"><input class="tw-input" id="twSearch" placeholder="搜索帖子或NPC……"><button type="button" class="tw-refresh-forum-btn tw-manual-refresh-btn" id="twRefreshForumBtn">手动刷新</button></div>
            <div id="twForumList"></div>
            <div class="tw-box">
              <div class="tw-sec-head"><span>投递新帖</span></div>
              <input class="tw-input" id="twNewTitle" placeholder="输入帖子标题……"><input class="tw-input" id="twNewBody" placeholder="写下宫内外新鲜风声或吐槽……">
              <button type="button" class="tw-mini-btn api-btn" id="twSendPost">发布并唤起群像NPC讨论</button>
            </div>
          </div>

          <!-- 8. 小剧场 App（泥金画卷美化排版 + 清空按钮） -->
          <div class="tw-tab-page" id="tw-page-theater">
            <div class="tw-box">
              <div class="tw-sec-head">
                <span>🎭 太微宫小剧场生成</span>
                <button type="button" class="tw-reply-npc-btn" id="twClearTheaterBtn">清空小剧场</button>
              </div>
              <div class="tw-chip-row" id="twTheaterChips">
                <span class="tw-chip" data-style="深夜甘露殿批阅奏章时的暗中温存与口是心非">甘露夜读</span><span class="tw-chip" data-style="萧承稷看到旁人与你说话后暗中吃醋并冷脸宣示主权">帝王吃醋</span>
                <span class="tw-chip" data-style="便装微服出宫同游长安上元灯会或曲江春水舫">微服夜游</span><span class="tw-chip" data-style="东西六宫或前朝受委屈时萧承稷突然驾临护短撑腰">御前护短</span><span class="tw-chip" data-style="平行时空长安富家公子萧四郎与你的初遇">平行番外</span>
              </div>
              <textarea class="tw-textarea" id="twTheaterPrompt" placeholder="自由输入想看的小剧场主题，留空则紧扣最新剧情随机生成……"></textarea>
              <div style="display:flex;gap:8px;">
                <button type="button" class="tw-mini-btn api-btn" id="twGenTheaterBtn" style="flex:1;padding:7px;">✨ 执笔生成画卷剧场</button>
                <button type="button" class="tw-mini-btn" id="twInsertTheaterBtn" style="color:var(--text-main);border-color:var(--border-soft);">填入酒馆输入框</button>
              </div>
            </div>
            <div class="tw-box" style="padding:10px;">
              <div class="tw-sec-head"><span>📜 泥金画卷 · 剧场展阅</span><span class="tw-badge">精装排版</span></div>
              <div id="twTheaterResult"></div>
            </div>
          </div>

          <!-- 9. 默契挑战 App（结合User人设与酒馆剧情 + 古风白话） -->
          <div class="tw-tab-page" id="tw-page-tacit">
            <div class="tw-game-tabs">
              <button type="button" class="tw-game-tab-btn active" data-tacitmode="guess_xiao">🎯 我猜萧承稷（圣人阅卷打分）</button>
              <button type="button" class="tw-game-tab-btn" data-tacitmode="xiao_guess_me">👑 萧承稷猜我（我出题考圣人）</button>
            </div>
            <div class="tw-box">
              <div class="tw-sec-head">
                <span id="twTacitModeTitle">选择挑战主题（结合人设与剧情抽5题）</span>
                <button type="button" class="tw-refresh-forum-btn" id="twGenTacitQuizBtn">🎲 抽取5道新题</button>
              </div>
              <div class="tw-chip-row" id="twTacitTopicChips">
                <span class="tw-chip active" data-ttopic="日常小习惯与起居怪癖">🍵 小习惯</span>
                <span class="tw-chip" data-ttopic="恋爱心意、占有欲与吃醋反应">💞 恋爱吃醋</span>
                <span class="tw-chip" data-ttopic="红绡帐暖与闺房私密癖好（NSFW尺度）">🔥 闺房私密(NSFW)</span>
                <span class="tw-chip" data-ttopic="朝堂帝王心术与逆鳞底线">🗡️ 帝王逆鳞</span>
                <span class="tw-chip" data-ttopic="微服出宫吃喝玩乐偏好">🏮 微服喜好</span>
              </div>
              <input class="tw-input" id="twTacitCustomTopic" style="margin-bottom:0;" placeholder="也可自由输入你想测试的主题（如：吵架谁先服软、生病喂药等）……">
            </div>
            <div class="tw-box">
              <div class="tw-sec-head">
                <span>默契考卷（共5题 · 古风白话）</span>
                <button type="button" class="tw-reply-npc-btn" id="twShareTacitToDmBtn" style="display:none;background:var(--accent);color:#fff;">📤 转发结果给萧承稷私聊</button>
              </div>
              <div id="twTacitQuestionsBox"><div class="tw-empty-hint">请先选定上方主题并点击「🎲 抽取5道新题」开启默契大考验！</div></div>
              <button type="button" class="tw-refresh-forum-btn" id="twSubmitTacitBtn" style="display:none;width:100%;padding:8px;margin-top:6px;">呈交萧承稷批阅打分</button>
              <div id="twTacitResultBox" style="display:none;margin-top:10px;"></div>
            </div>
          </div>

          <!-- 10. 御案批折 App -->
          <div class="tw-tab-page" id="tw-page-memorial">
            <div class="tw-box">
              <div class="tw-sec-head"><span>甘露殿御案 · 代圣人朱批奏章</span><div style="display:flex;gap:5px;"><button type="button" class="tw-reply-npc-btn" id="twNextMemorialBtn">换一封预设折子</button><button type="button" class="tw-reply-npc-btn" id="twAiMemorialBtn" style="background:var(--accent);color:#fff;">AI生成新折子</button></div></div>
              <div class="tw-memorial-scroll"><div style="font-size:11px;color:var(--text-sub);margin-bottom:3px;" id="twMemAuthor"></div><div style="font-size:13px;font-weight:bold;color:var(--accent-strong);margin-bottom:5px;" id="twMemTitle"></div><div style="font-size:12px;" id="twMemContent"></div></div>
              <div class="tw-chip-row" id="twMemorialQuickChips"></div>
              <div style="display:flex;gap:6px;"><input class="tw-input" id="twMemorialCustomInput" style="margin-bottom:0;" placeholder="亲手写下你的朱批……"><button type="button" class="tw-refresh-forum-btn" id="twSubmitMemorialBtn">朱批用印</button></div>
            </div>
            <div class="tw-box"><div class="tw-sec-head"><span>萧承稷的反应与朱批点评</span></div><div id="twMemorialReaction" style="line-height:1.75;min-height:65px;white-space:pre-wrap;">挑选或输入朱批后点击“朱批用印”，即可查看萧承稷的反应。</div></div>
          </div>

          <!-- 11. 纹枰手谈 App -->
          <div class="tw-tab-page" id="tw-page-gomoku">
            <div class="tw-box">
              <div class="tw-sec-head"><span>延英殿手谈 · 与萧承稷对弈五子棋</span><button type="button" class="tw-reply-npc-btn" id="twRestartGomokuBtn">重新开局</button></div>
              <div style="background:var(--bg-sub);padding:8px 10px;border-radius:6px;margin-bottom:6px;border-left:3px solid var(--accent);"><div style="font-size:11px;color:var(--text-sub);">萧承稷此刻对你说的话：</div><div id="twGomokuQuote" style="font-size:12px;color:var(--accent-strong);font-weight:bold;margin-top:3px;"></div></div>
              <div class="tw-gomoku-wrap"><div class="tw-gomoku-board" id="twGomokuBoard"></div><div style="font-size:11px;color:var(--text-sub);margin-top:3px;" id="twGomokuStatus"></div></div>
            </div>
          </div>

          <!-- 12. 设置 App（含壁纸更换、App文字深浅自适应与系统配置） -->
          <div class="tw-tab-page" id="tw-page-settings">
            <div class="tw-box" style="display:none !important;">
              <select class="tw-select" id="twSaveSlotSelect"><option value="chat_bind">自动绑定当前聊天记录</option></select>
              <button type="button" id="twResetFabPosBtn">悬浮球恢复居中</button>
            </div>
            <div class="tw-box">
              <div class="tw-sec-head"><span>🖼️ 桌面壁纸与图标文字颜色</span><span class="tw-badge">智能明暗适配</span></div>
              <div class="tw-wp-preview" id="twWpPreviewBox">当前使用主题默认古风宣纸底纹</div>
              <div style="display:flex;gap:6px;margin-bottom:7px;">
                <button type="button" class="tw-refresh-forum-btn" id="twUploadWpBtn" style="flex:1;padding:6px;">📂 选择本地图片上传</button>
                <button type="button" class="tw-reply-npc-btn" id="twClearWpBtn" style="padding:6px 10px;font-size:11px;">恢复默认底纹</button>
              </div>
              <div style="display:flex;gap:5px;margin-bottom:8px;">
                <input class="tw-input" id="twWpUrlInput" style="margin-bottom:0;flex:1;padding:4px 8px;" placeholder="或直接粘贴图片网络链接 (https://...)…">
                <button type="button" class="tw-reply-npc-btn" id="twApplyWpUrlBtn" style="padding:4px 9px;background:var(--accent);color:#fff;">应用链接</button>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:8px;padding-bottom:7px;border-bottom:1px dashed var(--border-soft);">
                <span class="tw-label">桌面图标字体颜色：</span>
                <div style="display:flex;gap:4px;" id="twWpTextColorModeGroup">
                  <button type="button" class="tw-reply-npc-btn" data-wp-tmode="auto">✨ 自动随壁纸</button>
                  <button type="button" class="tw-reply-npc-btn" data-wp-tmode="dark">🖤 浅壁纸</button>
                  <button type="button" class="tw-reply-npc-btn" data-wp-tmode="light">🤍 深壁纸</button>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span class="tw-label" style="white-space:nowrap;">壁纸暗角遮罩浓度：</span>
                <input type="range" id="twWpMaskRange" min="0" max="75" value="20" style="flex:1;">
                <span class="tw-label" id="twWpMaskValTxt">20%</span>
              </div>
            </div>
            <div class="tw-box">
              <div class="tw-sec-head"><span>🎨 配色方案切换</span><span class="tw-badge">七色可选</span></div>
              <div class="tw-theme-grid">
                <button type="button" class="tw-theme-btn" data-theme-val="xuanpaper">古法宣黄</button><button type="button" class="tw-theme-btn" data-theme-val="palace">宫阙螺钿</button>
                <button type="button" class="tw-theme-btn" data-theme-val="newspaper">长安邸报</button><button type="button" class="tw-theme-btn" data-theme-val="white">纯白凝脂</button>
                <button type="button" class="tw-theme-btn" data-theme-val="celadon">天青汝窑</button><button type="button" class="tw-theme-btn" data-theme-val="obsidian">乌金藏经</button>
                <button type="button" class="tw-theme-btn" data-theme-val="rouge" style="grid-column:1 / -1;">薛涛花笺</button>
              </div>
            </div>
            <div class="tw-box">
              <div class="tw-sec-head"><span>自动刷新总控与分模块开关</span><span class="tw-badge" id="twAutoMasterStatusHint">总控开启中</span></div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 9px;background:var(--bg-sub);border:1px solid var(--border-soft);border-radius:6px;margin-bottom:8px;">
                <div><b style="color:var(--accent-strong);">一键开启自动刷新</b><div class="tw-label">关闭总开关后可单独开关各模块自动刷新</div></div>
                <button type="button" class="tw-toggle-btn" id="twMasterAutoToggleBtn">已开启</button>
              </div>
              <div id="twSubAutoSwitchList">
                <div class="tw-sub-switch-row" data-sub-row="status"><span>① 首页顶部状态卡</span><button type="button" class="tw-toggle-btn tw-sub-auto-btn" data-mod="status">已开启</button></div>
                <div class="tw-sub-switch-row" data-sub-row="plot"><span>② 剧情梳理</span><button type="button" class="tw-toggle-btn tw-sub-auto-btn" data-mod="plot">已开启</button></div>
                <div class="tw-sub-switch-row" data-sub-row="world"><span>③ 地图动向</span><button type="button" class="tw-toggle-btn tw-sub-auto-btn" data-mod="world">已开启</button></div>
              </div>
            </div>
            <div class="tw-box">
              <div class="tw-sec-head"><span>聊天记忆条数与剧情摘要设置</span><span class="tw-badge" id="twPlotPromptBadge">记忆${config.chatMemoryCount}条 · 摘要${config.plotWordLimit}字</span></div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding-bottom:7px;border-bottom:1px dashed var(--border-soft);"><span class="tw-label" style="white-space:nowrap;">单聊/群聊记忆携带条数：</span><input type="number" min="4" max="60" class="tw-input" id="twChatMemoryCountInput" style="margin-bottom:0;width:80px;" value="${config.chatMemoryCount}"><span class="tw-label">条</span></div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px;"><span class="tw-label" style="white-space:nowrap;">单幕摘要目标字数：</span><input type="number" min="15" max="300" class="tw-input" id="twPlotWordLimitInput" style="margin-bottom:0;width:85px;" value="${config.plotWordLimit}"><span class="tw-label">字以内</span></div>
              <textarea class="tw-textarea" id="twPlotCustomPromptInput" style="min-height:50px;"></textarea>
              <div style="display:flex;justify-content:flex-end;gap:6px;"><button type="button" class="tw-reply-npc-btn" id="twResetPlotPromptBtn" style="padding:4px 9px;font-size:11px;">恢复默认</button><button type="button" class="tw-reply-npc-btn" id="twSavePlotPromptBtn" style="padding:4px 11px;font-size:11px;background:var(--accent);color:#fff;">保存设置</button></div>
            </div>
            <div class="tw-box">
              <div class="tw-sec-head"><span>API 通道选择与配置保存</span><span class="tw-badge" id="twCurrentApiBadge">酒馆主 API</span></div>
              <div class="tw-api-mode-cards">
                <button type="button" class="tw-api-mode-card" id="twModeCardTavern" data-api-mode="tavern"><b>① 使用酒馆主 API</b><span>直接调用酒馆当前主模型接口</span></button>
                <button type="button" class="tw-api-mode-card" id="twModeCardCustom" data-api-mode="custom"><b>② 使用其他 API</b><span>自定义接口，支持保存多个配置</span></button>
              </div>
              <div id="twCustomApiFields" style="display:none;padding-top:4px;border-top:1px dashed var(--border-soft);">
                <div style="display:flex;gap:6px;align-items:center;margin-bottom:7px;"><span class="tw-label" style="white-space:nowrap;">已存配置：</span><select class="tw-select" id="twSavedApiPresetSelect" style="margin-bottom:0;flex:1;"><option value="">-- 新建 / 当前编辑配置 --</option></select><button type="button" class="tw-reply-npc-btn" id="twDeleteApiPresetBtn" style="padding:5px 8px;">删除</button></div>
                <div class="tw-label" style="margin-bottom:3px;">配置名称</div><input class="tw-input" id="twApiNameInput" placeholder="输入自定义配置名称">
                <div class="tw-label" style="margin-bottom:3px;">API 接口地址</div><input class="tw-input" id="twApiUrlInput" placeholder="https://api.openai.com/v1">
                <div class="tw-label" style="margin-bottom:3px;">API Key 密钥</div><input class="tw-input" id="twApiKeyInput" type="password" placeholder="sk-...">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;"><span class="tw-label">模型名称</span><button type="button" class="tw-mini-btn api-btn" id="twFetchModelsBtn" style="padding:2px 8px;font-size:10.5px;">拉取模型</button></div>
                <input class="tw-input" id="twApiModelInput" placeholder="gpt-4o-mini / claude-3-5-sonnet / deepseek-chat">
                <div id="twModelSelectWrap" style="display:none;margin-bottom:8px;"><select class="tw-select" id="twModelSelectDropdown"></select></div>
              </div>
              <div style="display:flex;justify-content:space-between;gap:8px;margin-top:6px;">
                <button type="button" class="tw-mini-btn" id="twTestApiBtn" style="background:var(--bg-sub);color:var(--accent-strong);border-color:var(--border-outer);font-weight:bold;">测试当前 API</button>
                <button type="button" class="tw-mini-btn api-btn" id="twSaveConfigBtn">保存并启用配置</button>
              </div>
              <div class="tw-status-tip" id="twApiTestResult" style="margin-top:8px;margin-bottom:0;"></div>
            </div>
            <div class="tw-box">
              <div class="tw-sec-head"><span>API 调用监控日志</span><div style="display:flex;gap:6px;align-items:center;"><span class="tw-badge" id="twApiLogCountBadge">共 0 条</span><button type="button" class="tw-reply-npc-btn" id="twClearApiLogsBtn">清空日志</button></div></div>
              <div class="tw-log-list" id="twApiLogList"></div>
            </div>
          </div>
        </div>

        <div class="tw-phone-bottom-bar" id="twPhoneBottomHomeBar" title="点击返回太微玉简桌面">
          <div class="tw-phone-home-pill"></div>
        </div>
      </div>
    </div>
  `;
  targetDoc.body.appendChild(rootEl);
  const fab = targetDoc.getElementById("twFabBall"), overlay = targetDoc.getElementById("twModalOverlay");

  function syncFabVisibilityWithModal() {
    if (!fab || !overlay) return;
    const isModalOpen = !overlay.classList.contains("tw-hidden");
    fab.classList.toggle("tw-fab-hidden-when-open", isModalOpen);
  }

    function setModalOpenState(open) {
    if (!overlay) return;
    overlay.classList.toggle("tw-hidden", !open);
    syncFabVisibilityWithModal();
    if (open) {
      openAppPage("home"); 
      clearFabGlowReminder();
      syncFromWorldbookAndChat(false);
    }
  }


    function scrollChatBoxesToBottom() {
    requestAnimationFrame(() => {
      const dmBox = targetDoc.getElementById("twDmBox");
      if (dmBox) dmBox.scrollTop = dmBox.scrollHeight;
      const roomBox = targetDoc.getElementById("twChatroomBox");
      if (roomBox) roomBox.scrollTop = roomBox.scrollHeight;
    });
  }

  function openAppPage(appId) {
    state.currentApp = appId || "home";
    clearAppBadgeCount(state.currentApp);
    const isHome = state.currentApp === "home";
    const headerBar = targetDoc.getElementById("twAppHeaderBar");
    const backBtn = targetDoc.getElementById("twBackHomeBtn");
    const titleEl = targetDoc.getElementById("twAppHeaderTitle");
    if (headerBar) headerBar.classList.toggle("home-mode", isHome);
    if (backBtn) backBtn.style.display = isHome ? "none" : "inline-flex";
    if (titleEl) {
      if (isHome) titleEl.textContent = "太微宫闻录";
      else {
        const meta = PHONE_APPS_META.find(a => a.id === state.currentApp);
        titleEl.textContent = meta ? meta.title : "太微宫闻录";
      }
    }
    rootEl.querySelectorAll(".tw-tab-page").forEach(p => {
      p.classList.toggle("active", p.id === `tw-page-${state.currentApp}`);
    });
    const contentBox = rootEl.querySelector(".tw-content");
    if (contentBox) contentBox.scrollTop = 0;
    if (state.currentApp === "chat") {
      scrollChatBoxesToBottom();
      setTimeout(scrollChatBoxesToBottom, 60);
    }
  }


  function renderPhoneHomeGrid() {
    const mainGrid = targetDoc.getElementById("twPhoneAppGrid");
    const dockGrid = targetDoc.getElementById("twPhoneDockGrid");
    if (!mainGrid || !dockGrid) return;
    const badges = state.appUnreadBadges || {};
    const buildBadgeHtml = (appId) => {
      const cnt = Number(badges[appId]) || 0;
      if (cnt <= 0) return "";
      return `<span class="tw-app-badge">${cnt > 99 ? "99+" : cnt}</span>`;
    };

    mainGrid.innerHTML = PHONE_APPS_META.map(app => `
      <div class="tw-app-item" data-open-app="${app.id}">
        <div class="tw-app-icon-wrap">
          <div class="tw-app-icon-box" style="background:${app.color};">${app.svg}</div>
          ${buildBadgeHtml(app.id)}
        </div>
        <div class="tw-app-name">${app.title}</div>
        <div class="tw-app-sub">${app.sub}</div>
      </div>
    `).join("");

    const dockIds = ["plot", "chat", "letter", "forum"];
    const dockApps = dockIds.map(id => PHONE_APPS_META.find(a => a.id === id)).filter(Boolean);
    dockGrid.innerHTML = dockApps.map(app => `
      <div class="tw-app-item" data-open-app="${app.id}">
        <div class="tw-app-icon-wrap" style="margin-bottom:2px;">
          <div class="tw-app-icon-box" style="background:${app.color};">${app.svg}</div>
          ${buildBadgeHtml(app.id)}
        </div>
        <div class="tw-app-name" style="font-size:10.5px;">${app.title}</div>
      </div>
    `).join("");
  }
  renderPhoneHomeGrid();

  /* 检测壁纸图片平均亮度（返回 true 代表浅色背景，适合深色墨字） */
  function detectImageLuminance(imgSrc, callback) {
    if (!imgSrc) { callback(true); return; }
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      try {
        const cvs = targetDoc.createElement("canvas");
        cvs.width = 24; cvs.height = 24;
        const ctx = cvs.getContext("2d");
        ctx.drawImage(img, 0, 0, 24, 24);
        const data = ctx.getImageData(0, 0, 24, 24).data;
        let sum = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          sum += lum; count++;
        }
        const avgLum = count ? (sum / count) : 180;
        callback(avgLum >= 128);
      } catch (e) {
        callback(true);
      }
    };
    img.onerror = function () { callback(true); };
    img.src = imgSrc;
  }

  function applyCustomWallpaperToUI() {
    const wpEl = targetDoc.getElementById("twPhoneWallpaper");
    const maskEl = targetDoc.getElementById("twPhoneWallpaperMask");
    const panelEl = targetDoc.getElementById("twMainPanel");
    const previewEl = targetDoc.getElementById("twWpPreviewBox");
    const rangeEl = targetDoc.getElementById("twWpMaskRange");
    const valTxt = targetDoc.getElementById("twWpMaskValTxt");
    const urlInp = targetDoc.getElementById("twWpUrlInput");
    const dataUrl = getSavedWallpaperDataUrl();
    const maskOp = typeof config.wallpaperMaskOpacity === "number" ? config.wallpaperMaskOpacity : 0.2;

    if (rangeEl && targetDoc.activeElement !== rangeEl) rangeEl.value = Math.round(maskOp * 100);
    if (valTxt) valTxt.textContent = `${Math.round(maskOp * 100)}%`;
    if (maskEl) maskEl.style.background = `rgba(18, 12, 8, ${maskOp})`;
    if (urlInp && targetDoc.activeElement !== urlInp) {
      urlInp.value = dataUrl.startsWith("http") ? dataUrl : "";
    }

    rootEl.querySelectorAll("#twWpTextColorModeGroup button").forEach(b => {
      const isAct = b.dataset.wpTmode === (config.wallpaperTextColorMode || "auto");
      b.style.background = isAct ? "var(--accent)" : "";
      b.style.color = isAct ? "#fff8eb" : "";
    });

    if (dataUrl) {
      if (wpEl) wpEl.style.backgroundImage = `url("${dataUrl}")`;
      if (panelEl) {
        panelEl.classList.add("has-custom-wp");
        const mode = config.wallpaperTextColorMode || "auto";
        let useDarkText = true;
        if (mode === "dark") useDarkText = true;
        else if (mode === "light") useDarkText = false;
        else {
          const effectiveLight = config.detectedWpIsLight !== false && maskOp < 0.42;
          useDarkText = effectiveLight;
        }
        panelEl.classList.toggle("wp-text-dark", useDarkText);
        panelEl.classList.toggle("wp-text-light", !useDarkText);
      }
      if (previewEl) {
        previewEl.style.backgroundImage = `url("${dataUrl}")`;
        previewEl.innerHTML = `<span style="background:rgba(0,0,0,0.58);color:#fff8eb;padding:3px 9px;border-radius:12px;font-size:10.5px;">已启用自定义壁纸</span>`;
      }
    } else {
      if (wpEl) wpEl.style.backgroundImage = "none";
      if (panelEl) {
        panelEl.classList.remove("has-custom-wp", "wp-text-dark", "wp-text-light");
      }
      if (previewEl) {
        previewEl.style.backgroundImage = "none";
        previewEl.textContent = "当前使用主题默认古风宣纸底纹";
      }
    }
  }
  applyCustomWallpaperToUI();

  function compressAndSaveImageFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      const rawDataUrl = ev.target?.result;
      if (!rawDataUrl) return;
      const img = new Image();
      img.onload = function () {
        try {
          const canvas = targetDoc.createElement("canvas");
          const maxW = 680, maxH = 1200;
          let w = img.width || 600, h = img.height || 1000;
          if (w > maxW || h > maxH) {
            const ratio = Math.min(maxW / w, maxH / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          let outUrl = canvas.toDataURL("image/jpeg", 0.78);
          if (outUrl.length > 1800000) outUrl = canvas.toDataURL("image/jpeg", 0.55);
          detectImageLuminance(outUrl, (isLight) => {
            config.detectedWpIsLight = isLight;
            saveWallpaperDataUrl(outUrl);
            applyCustomWallpaperToUI();
            showModuleSuccessToast(`壁纸已更换（自动匹配${isLight ? "深色墨字" : "浅色金字"}）`);
          });
        } catch (err) {
          saveWallpaperDataUrl(rawDataUrl);
          applyCustomWallpaperToUI();
          showModuleSuccessToast("壁纸已应用");
        }
      };
      img.onerror = function () {
        saveWallpaperDataUrl(rawDataUrl);
        applyCustomWallpaperToUI();
        showModuleSuccessToast("壁纸已应用");
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  }

  function triggerCrossFrameFileSelect() {
    try {
      let picker = targetDoc.getElementById("twHiddenWpFilePicker");
      if (picker) picker.remove();
      picker = targetDoc.createElement("input");
      picker.type = "file";
      picker.id = "twHiddenWpFilePicker";
      picker.accept = "image/*";
      picker.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;";
      targetDoc.body.appendChild(picker);
      picker.addEventListener("change", (ev) => {
        const f = ev.target.files?.[0];
        if (f) compressAndSaveImageFile(f);
      });
      picker.click();
    } catch (e) {
      showModuleSuccessToast("若浏览器拦截弹窗，请在下方粘贴图片链接");
    }
  }

  targetDoc.getElementById("twUploadWpBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    triggerCrossFrameFileSelect();
  });
  targetDoc.getElementById("twApplyWpUrlBtn")?.addEventListener("click", () => {
    const u = targetDoc.getElementById("twWpUrlInput")?.value.trim() || "";
    if (!u) { showModuleSuccessToast("请先输入图片网络链接"); return; }
    detectImageLuminance(u, (isLight) => {
      config.detectedWpIsLight = isLight;
      saveWallpaperDataUrl(u);
      applyCustomWallpaperToUI();
      showModuleSuccessToast("网络壁纸应用成功");
    });
  });
  targetDoc.getElementById("twClearWpBtn")?.addEventListener("click", () => {
    saveWallpaperDataUrl("");
    applyCustomWallpaperToUI();
    showModuleSuccessToast("已恢复默认宣纸底纹");
  });
  targetDoc.getElementById("twWpMaskRange")?.addEventListener("input", (e) => {
    const v = Number(e.target.value) || 0;
    config.wallpaperMaskOpacity = Math.max(0, Math.min(0.85, v / 100));
    saveConfig();
    applyCustomWallpaperToUI();
  });
  targetDoc.getElementById("twWpTextColorModeGroup")?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-wp-tmode]");
    if (!btn) return;
    config.wallpaperTextColorMode = btn.dataset.wpTmode || "auto";
    saveConfig();
    applyCustomWallpaperToUI();
  });

  rootEl.addEventListener("click", (e) => {
    const appCard = e.target.closest("[data-open-app]");
    if (appCard) {
      openAppPage(appCard.dataset.openApp);
      return;
    }
  });
  targetDoc.getElementById("twBackHomeBtn")?.addEventListener("click", () => openAppPage("home"));
  targetDoc.getElementById("twPhoneBottomHomeBar")?.addEventListener("click", () => openAppPage("home"));

  rootEl.querySelectorAll("button[data-chattab]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeChatTab = btn.dataset.chattab || "dm";
      rootEl.querySelectorAll("button[data-chattab]").forEach(b => b.classList.toggle("active", b === btn));
      targetDoc.getElementById("tw-chat-pane-dm")?.classList.toggle("active", state.activeChatTab === "dm");
      targetDoc.getElementById("tw-chat-pane-chatroom")?.classList.toggle("active", state.activeChatTab === "chatroom");
      scrollChatBoxesToBottom();
      setTimeout(scrollChatBoxesToBottom, 50);
    });
  });


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
      const willOpen = overlay.classList.contains("tw-hidden");
      setModalOpenState(willOpen);
    }
  });

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

  targetDoc.getElementById("twCloseErrorBannerBtn")?.addEventListener("click", hideApiErrorBanner);
  targetDoc.getElementById("twClearApiLogsBtn")?.addEventListener("click", () => { state.apiLogs = []; renderApiLogs(); });

  targetDoc.getElementById("twWechatBanner")?.addEventListener("click", (e) => {
    const banner = e.currentTarget;
    banner.classList.remove("show");
    setModalOpenState(true);
    const jumpApp = banner.dataset.jumpApp || "chat";
    const jumpChatTab = banner.dataset.jumpChatTab || "dm";
    const jumpNpc = banner.dataset.jumpNpc || "";
    openAppPage(jumpApp);
    if (jumpApp === "chat") {
      state.activeChatTab = jumpChatTab;
      rootEl.querySelectorAll("button[data-chattab]").forEach(b => b.classList.toggle("active", b.dataset.chattab === jumpChatTab));
      targetDoc.getElementById("tw-chat-pane-dm")?.classList.toggle("active", jumpChatTab === "dm");
      targetDoc.getElementById("tw-chat-pane-chatroom")?.classList.toggle("active", jumpChatTab === "chatroom");
      if (jumpChatTab === "dm" && jumpNpc) {
        state.dmActiveNpc = jumpNpc;
        saveCurrentChatSessionData(false);
        renderDmSection();
      }
    }
  });

  targetDoc.getElementById("twGoCaughtDmBtn")?.addEventListener("click", () => {
    targetDoc.getElementById("twCatchModal")?.classList.remove("show");
    state.emperorActiveDetailKey = null;
    openAppPage("chat");
    state.activeChatTab = "dm";
    rootEl.querySelectorAll("button[data-chattab]").forEach(b => b.classList.toggle("active", b.dataset.chattab === "dm"));
    targetDoc.getElementById("tw-chat-pane-dm")?.classList.add("active");
    targetDoc.getElementById("tw-chat-pane-chatroom")?.classList.remove("active");
    state.dmActiveNpc = "萧承稷";
    saveCurrentChatSessionData(false);
    renderDmSection();
  });

  function setModuleRefreshing(modKey, isRef, tipMessage = "") {
    if (!state.refreshingModules) state.refreshingModules = {};
    state.refreshingModules[modKey] = isRef;
    const btnIds = MODULE_BTN_MAP[modKey] || [];
    btnIds.forEach(id => {
      const btn = targetDoc.getElementById(id);
      if (btn) {
        btn.disabled = isRef;
        btn.classList.toggle("disabled-gray", isRef);
      }
    });
    const anyActive = Object.values(state.refreshingModules).some(Boolean);
    state.isGlobalRefreshing = Boolean(state.refreshingModules.all);
    const tip = targetDoc.getElementById("twApiStatusBar");
    if (tip) {
      if (anyActive && tipMessage) {
        tip.classList.add("show");
        tip.textContent = tipMessage;
      } else if (!anyActive) {
        tip.classList.remove("show");
      }
    }
  }

  function setGlobalRefreshingState(isRefreshing, tipMessage = "") {
    ["all", "status", "plot", "actions", "world", "emperor", "forum"].forEach(k => setModuleRefreshing(k, isRefreshing, tipMessage));
  }

  function getPlotSummaryInstruction() {
    const uName = state.userName || detectCurrentUserName();
    const limit = Math.max(15, Math.min(300, Number(config.plotWordLimit) || DEFAULT_PLOT_WORD_LIMIT));
    const custom = (config.plotCustomPrompt || DEFAULT_PLOT_CUSTOM_PROMPT).trim();
    return `字数严格控制在 ${limit} 字以内；要求：${custom}，必须自然写出名字 ${uName}，严禁加方括号或圆括号解释`;
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
      if (!chatEl) return true;
      const stCtx = targetWin.SillyTavern?.getContext?.() || window.SillyTavern?.getContext?.();
      if (stCtx) {
        if (stCtx.characterId === undefined && !stCtx.groupId) return false;
        const cName = String(stCtx.name2 || "") + String(stCtx.characters?.[stCtx.characterId]?.name || "");
        if (cName.includes("萧承稷") || cName.includes("太微") || cName.includes("大景")) return true;
        const lastMes = String(stCtx.chat?.[stCtx.chat.length - 1]?.mes || "");
        if (lastMes.includes("萧承稷") || lastMes.includes("<角色名>萧承稷") || lastMes.includes("太微宫") || lastMes.includes("甘露殿")) return true;
      }
      return true;
    } catch (e) { return true; }
  }

  let isCatchTriggering = false;

  targetWin.__twCheckTimer = setInterval(() => {
    try {
      if (sandboxWin !== targetWin && sandboxWin.frameElement && !sandboxWin.frameElement.isConnected) {
        destroyTaiweiUI();
        return;
      }
    } catch (e) {}

    if (!checkIsXiaoChat()) {
      rootEl.classList.add("tw-chat-inactive");
      setModalOpenState(false);
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
      setModalOpenState(false);
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
    const userPersona = getUserPersonaContext();
    if (blindUserIdentity) {
      return `\n【当前太微宫与长安城时间局势背景（发帖人真实身份已完全隐匿）】：\n1. 当前时间：${state.time}，圣人所在位置：${state.location}，圣人当前心情：${state.mood}。\n2. 重要提示：当前在论坛发言的「${getForumUserAuthor()}」是一个彻底匿名的神秘马甲！所有NPC【完全不知道】这个马甲背后是谁，只能盲猜！`;
    }
    return `\n【当前世界背景、人设与时间线参考】：\n1. 当前身份：${getUserFullTag()}，当前地点：${state.location}，当前时间：${state.time}。\n2. ${state.userName} 的人设与性格特征：${userPersona || "（未单独填写固定人设，请直接根据下方近期剧情中她的言行举止、性情反应来推演）"}。\n3. 萧承稷对 ${state.userName} 好感度：${state.hasAffection ? state.affection : 0}（${state.stage || "【淡漠留意】"}），当前心情：${state.mood}。\n4. 近期时间轴脉络：\n${timelineTail || "刚开局"}\n5. 最新酒馆剧情节选：\n${latestRoundText ? latestRoundText.slice(-650) : "暂无"}`;
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
    if (runStatus) setModuleRefreshing("status", true, "自动同步中…");
    if (runPlot) setModuleRefreshing("plot", true, "自动同步中…");
    if (runWorld) setModuleRefreshing("world", true, "自动同步中…");
    try {
      const alreadyInTimeline = Boolean(currentRoundId && state.plotSummary.some(x => (x.roundId || x.turnKey) === currentRoundId));
      if (runPlot && state.plotSummary.length < totalAiRounds - 1) {
        if (runStatus) await autoGenerateCorePlotData(true, { doStatus: true, doPlot: false });
        setModuleRefreshing("status", false);
        await rebuildFullLongTimeline(true);
        setModuleRefreshing("plot", false);
      } else if (runStatus || (runPlot && !alreadyInTimeline)) {
        await autoGenerateCorePlotData(true, { doStatus: runStatus, doPlot: runPlot && !alreadyInTimeline });
        setModuleRefreshing("status", false);
        setModuleRefreshing("plot", false);
      } else {
        setModuleRefreshing("status", false);
        setModuleRefreshing("plot", false);
      }
      if (runWorld) {
        await refreshWorldOnly(null, true);
        setModuleRefreshing("world", false);
      }
      showModuleSuccessToast("自动同步完成");
    } catch (e) {
      setModuleRefreshing("status", false);
      setModuleRefreshing("plot", false);
      setModuleRefreshing("world", false);
    }
  }

  async function autoGenerateCorePlotData(fromGlobalTask = false, opts = { doStatus: true, doPlot: true }) {
    if (!fromGlobalTask) {
      if (opts.doStatus) setModuleRefreshing("status", true, "状态卡刷新中…");
      if (opts.doPlot) setModuleRefreshing("plot", true, "剧情梳理刷新中…");
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
        promptParts.push(`"fallbackStatus": {"time":"当前年号日期时辰","location":"萧承稷所在宫殿","userIdentity":"${uName}当前具体位分","clothes":"萧承稷衣着十字内","pose":"萧承稷动作十字内","mood":"四字情绪","innerThought":"萧承稷第一人称真实心声，自称朕，28字内","affection":${state.hasAffection ? state.affection : 10},"stage":"${state.stage !== "未同步" ? state.stage : "【淡漠留意】"}"}`);
      }
      if (opts.doPlot) {
        promptParts.push(`"latestTimelineNode": {"time":"本轮具体时间","location":"本轮具体地点","summary":"仅概括最新这一轮新进展，遵守要求：${plotInstruction}"}`);
      }
      if (!promptParts.length) return;
      const prompt = `你是《太微宫闻录》史官同步助手。当前人物：${uName}（${getUserFullTag()}）。\n已记录脉络：\n${existingTail || "暂无"}\n本轮最新剧情：\n${latestRoundText}\n请输出纯 JSON 对象：\n{\n${promptParts.join(",\n")}\n}`;
      const resp = await callAI(prompt, opts.doPlot ? "剧情梳理与状态同步" : "首页状态同步");
      const m = String(resp).match(/{[\s\S]*}/);
      if (m) {
        const p = JSON.parse(m[0]);
        if (needFallbackStatus && p.fallbackStatus) applyFallbackStatusIfMissing(p.fallbackStatus);
        if (opts.doPlot) {
          const node = p.latestTimelineNode || (Array.isArray(p.newTimelineNodes) ? p.newTimelineNodes[0] : null);
          if (node && (node.summary || node.event)) {
            upsertTimelineNode(latestRoundId, node.time, node.location, node.summary || node.event);
            addAppBadgeCount("plot", 1);
          }
        }
        saveCurrentChatSessionData(false);
        renderAll();
        if (!fromGlobalTask) showModuleSuccessToast(opts.doPlot ? "剧情梳理已更新 (+1)" : "首页状态已刷新");
      }
    } catch (e) {}
    finally {
      if (!fromGlobalTask) {
        if (opts.doStatus) setModuleRefreshing("status", false);
        if (opts.doPlot) setModuleRefreshing("plot", false);
      }
    }
  }

  async function rebuildFullLongTimeline(fromGlobalTask = false) {
    const btn = targetDoc.getElementById("twRebuildFullPlotBtn");
    if (btn) btn.textContent = "刷新中…";
    if (!fromGlobalTask) setModuleRefreshing("plot", true, "全量重梳时间轴中…");
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
      const prompt = `你是《太微宫闻录》编年史官。当前人物：${uName}。请在 longTimeline 数组中按顺序每一轮对应输出 1 幕（共 ${sliceMeta.length} 幕），summary 遵守要求：${plotInstruction}。\n历史记录：\n${sliceMeta.map(x => x.text).join("\n\n")}\n请直接输出纯 JSON 对象：\n{"longTimeline":[{"time":"具体时间","location":"具体地点","summary":"该轮事件摘要"}]}`;
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
          addAppBadgeCount("plot", 1);
        }
        if (latestRoundId) state.lastAutoProcessedRoundId = latestRoundId;
        saveCurrentChatSessionData(false);
        renderAll();
        if (!fromGlobalTask) showModuleSuccessToast("全量时间轴已更新 (+1)");
      }
    } catch (e) {}
    finally {
      if (btn) btn.textContent = "全量重梳全部楼层";
      if (!fromGlobalTask) setModuleRefreshing("plot", false);
    }
  }

  async function refreshStatusOnly() {
    const btn = targetDoc.getElementById("twHomeRefreshStatusBtn");
    if (btn) btn.textContent = "刷新中…";
    try { await autoGenerateCorePlotData(false, { doStatus: true, doPlot: false }); }
    finally { if (btn) btn.textContent = "刷新状态"; }
  }

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
              <span style="font-size:13.5px;font-weight:bold;color:var(--accent-strong);">${meta.icon} ${meta.title}</span>
              <span class="tw-badge">心情：${enforceAddressingRules(info.mood || "沉静")}</span>
            </div>
          </div>
          <div class="tw-label" style="margin-bottom:6px;">📜 内侍监暗记明细：</div>
          <div class="tw-spy-entry-list">${entries.map((line) => `<div class="tw-spy-entry-item">${line}</div>`).join("")}</div>
          <div class="tw-spy-murmur-box"><b>💭 萧承稷此刻内心碎碎念：</b><br>“${enforceAddressingRules(info.murmur || "……")}”</div>
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
      addAppBadgeCount("chat", 1);
      saveCurrentChatSessionData(false);
      renderDmSection();
      const descEl = targetDoc.getElementById("twCatchDesc");
      if (descEl) descEl.textContent = catchScene;
      targetDoc.getElementById("twCatchModal")?.classList.add("show");
      showWechatNotification("萧承稷（抓包质问）", dmQuestion, { app: "chat", chatTab: "dm", npc: "萧承稷" });
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
    setModuleRefreshing("emperor", true, "正在偷窥圣人今日八事清单…");
    try {
      await syncFromWorldbookAndChat(false);
      const { lastFullTurn, lastSceneEnding } = getFullStoryContext();
      const relCtx = getRelationshipAndFamiliarityContext();
      const prompt = `你是甘露殿秘密起居注记录官。请结合当前最新剧情与萧承稷的人设，生成萧承稷今日的 8 项私密日常状态：visitors（今日见客）、actions（今日所做）、meals（吃了什么）、memorials（所批折子）、search（查阅记录）、toilet（更衣净手/如厕起居）、leisure（今日消遣）、desire（隐秘欲念）。\n每个分类包含 entries（3~4条具体明细数组，直接写内容不要加编号）、mood（四字心情）、murmur（第一人称碎碎念，必自称朕，禁称孤）。\n最新剧情：${lastFullTurn}\n${lastSceneEnding}\n${relCtx}\n请输出纯 JSON 对象：\n{"visitors":{"entries":["明细1","明细2","明细3"],"mood":"四字","murmur":"自称朕"},"actions":{"entries":["明细1","明细2","明细3"],"mood":"四字","murmur":"自称朕"},"meals":{"entries":["早膳明细","午膳明细","晚膳夜茶明细"],"mood":"四字","murmur":"自称朕"},"memorials":{"entries":["折子1","折子2","折子3"],"mood":"四字","murmur":"自称朕"},"search":{"entries":["查阅1","查阅2","查阅3"],"mood":"四字","murmur":"自称朕"},"toilet":{"entries":["晨起盥洗更衣","午后恭房如厕与净手","夜间沐浴更衣"],"mood":"四字","murmur":"自称朕"},"leisure":{"entries":["消遣1","消遣2","消遣3"],"mood":"四字","murmur":"自称朕"},"desire":{"entries":["暗念1","暗念2","暗念3"],"mood":"四字","murmur":"自称朕"}}`;
      const resp = await callAI(prompt, "圣人日常八事窥探");
      const m = String(resp).match(/{[\s\S]*}/);
      if (m) {
        state.emperorSpyData = JSON.parse(m[0]);
        state.emperorSpyRevealed = {};
        state.emperorActiveDetailKey = null;
        state.emperorCardClickCount = 0;
        state.emperorPeekAccumulatedSec = 0;
        addAppBadgeCount("emperor", 1);
        saveCurrentChatSessionData(false);
        renderEmperorSpySection();
        showModuleSuccessToast("帝王起居已刷新 (+1)");
      }
    } catch (e) {}
    finally {
      if (btn) btn.textContent = "偷窥刷新";
      setModuleRefreshing("emperor", false);
    }
  }

  async function generateStoryPlansOnly() {
    const btn = targetDoc.getElementById("twRefreshActionsBtn");
    if (btn) btn.textContent = "刷新中…";
    setModuleRefreshing("actions", true, "剧情选择生成中…");
    try {
      await syncFromWorldbookAndChat(false);
      const uName = state.userName, customIdea = targetDoc.getElementById("twStoryCustomIdea")?.value.trim() || "";
      const { lastFullTurn, lastSceneEnding } = getFullStoryContext(), relCtx = getRelationshipAndFamiliarityContext();
      const customDirective = customIdea ? `请围绕「${customIdea}」衍生 6 个完整事件开端！` : `请结合当前剧情构思 6 个完整事件开端（升温剧情、冲突剧情、平行事件、暗流伏笔、日常插曲、破局转折）。`;
      const prompt = `你是《太微宫闻录》剧情总策划。\n${lastFullTurn}\n${lastSceneEnding}\n${relCtx}\n${customDirective}\n要求全第三人称（直接写${uName}、萧承稷），只写事件开端悬念，不写结果。输出纯 JSON：\n{"storyPlans":[{"tag":"升温剧情","title":"标题12字内","desc":"简述45字内","prompt":"点击填入对话框的第三人称事件开端描写85字左右"}]}`;
      const resp = await callAI(prompt, "剧情选择生成");
      const m = String(resp).match(/{[\s\S]*}/);
      if (m) {
        const parsed = JSON.parse(m[0]);
        if (Array.isArray(parsed.storyPlans)) {
          state.storyPlans = parsed.storyPlans.slice(0, 6).map(a => ({ tag: enforceAddressingRules(a.tag || "剧情走向"), title: enforceAddressingRules(a.title || ""), desc: enforceAddressingRules(a.desc || ""), prompt: enforceAddressingRules(a.prompt || "") }));
          addAppBadgeCount("actions", 1);
        }
        saveCurrentChatSessionData(false);
        renderActions();
        showModuleSuccessToast("剧情选择已更新 (+1)");
      }
    } catch (e) {}
    finally {
      if (btn) btn.textContent = "手动刷新";
      setModuleRefreshing("actions", false);
    }
  }

  async function refreshWorldOnly(e, fromGlobalTask = false) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const btn = targetDoc.getElementById("twRefreshWorldBtn");
    if (btn) btn.textContent = "刷新中…";
    if (!fromGlobalTask) setModuleRefreshing("world", true, "地图动向刷新中…");
    try {
      await syncFromWorldbookAndChat(false);
      const { lastFullTurn, lastSceneEnding } = getFullStoryContext();
      const prompt = `请根据最新剧情推演此刻同步发生的宫内动态 4 条与宫外动态 3 条。后妃写为「真名（位分）」。\n${lastFullTurn}\n${lastSceneEnding}\n输出纯 JSON：\n{"palaceDynamics":[{"npc":"姓名（位分或官职）","event":"动向50字内","tag":"地点"}],"outsideDynamics":[{"npc":"身份·姓名","event":"动向50字内","tag":"坊市或边关"}]}`;
      const resp = await callAI(prompt, "地图动向刷新");
      const m = String(resp).match(/{[\s\S]*}/);
      if (m) {
        const p = JSON.parse(m[0]);
        if (Array.isArray(p.palaceDynamics)) state.palaceDynamics = p.palaceDynamics.map(x => ({ npc: enforceAddressingRules(x.npc), event: enforceAddressingRules(x.event), tag: enforceAddressingRules(x.tag || "太微宫内") }));
        if (Array.isArray(p.outsideDynamics)) state.outsideDynamics = p.outsideDynamics.map(x => ({ npc: enforceAddressingRules(x.npc), event: enforceAddressingRules(x.event), tag: enforceAddressingRules(x.tag || "宫墙之外") }));
        addAppBadgeCount("world", 1);
        saveCurrentChatSessionData(false);
        renderWorldLists();
        if (!fromGlobalTask) showModuleSuccessToast("地图动向已刷新 (+1)");
      }
    } catch (err) {}
    finally {
      if (btn) btn.textContent = "刷新动向";
      if (!fromGlobalTask) setModuleRefreshing("world", false);
    }
  }

  const FORUM_NPC_ROSTER = `每一个主帖 author 和评论 nick 必须采用「趣味网名（真名·位分或身份）」格式（如“今日有戏听吗（苏枕月·丽嫔）”、“百步穿杨将门女（秦昭华·德妃）”、“飞龙厩第一快马（霍惊弦）”、“御膳房掌勺（苏云娘）”、“西市胡姬酒最烈（洛青衣）”）。严禁使用玩家名字或马甲！`;

  async function refreshForumOnly(e, fromGlobalTask = false) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const btn = targetDoc.getElementById("twRefreshForumBtn");
    if (btn) btn.textContent = "刷新中…";
    if (!fromGlobalTask) setModuleRefreshing("forum", true, "宫内外坛刷新中…");
    try {
      await syncFromWorldbookAndChat(false);
      const { lastFullTurn, lastSceneEnding } = getFullStoryContext();
      const relCtx = getRelationshipAndFamiliarityContext(false), styleBlock = getForumStylePromptBlock();
      const prompt = `请生成 4 条《太微宫内外坛》热帖，每帖 4~6 条评论。\n【主题分布强制要求】：不要全都围着 ${state.userName} 转！4条帖子里最多只能有 1 条提及当前主线或 ${state.userName}，其余 3~4 条必须写大景王朝鲜活的宫内外百态！\n每帖评论既要有直接单独回复主帖的，也要有 @楼上NPC 互相接话抬杠的！严禁AI替玩家发帖或回帖！\n当前时间背景：${lastFullTurn}\n${lastSceneEnding}\n${relCtx}\n${styleBlock}\n${FORUM_NPC_ROSTER}\n输出纯 JSON 数组：\n[{"author":"趣味网名（真名·位分）","title":"标题","content":"正文65字内","tags":["宫内趣闻"],"comments":[{"nick":"趣味网名（真名·位分）","text":"评论内容45字内"}]}]`;
      const resp = await callAI(prompt, "宫内外坛刷新", true, false);
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) {
        const rawPosts = JSON.parse(m[0]).filter(x => !isNpcMatchingUser(x.author || x.nick));
        state.posts = rawPosts.map((x, i) => ({
          id: Date.now() + i, isSelfUser: false, author: pickForumNick(x, i), time: "刚刚",
          title: enforceAddressingRules(x.title || "宫中闲话", true), content: pickForumText(x),
          tags: Array.isArray(x.tags) ? x.tags : ["闲谈"], likes: Math.floor(Math.random() * 60) + 15, liked: false,
          comments: Array.isArray(x.comments)
            ? x.comments
                .filter(c => !isNpcMatchingUser(c.nick || c.user || c.author))
                .map((c, cIdx) => ({ isSelfUser: false, user: pickForumNick(c, i * 5 + cIdx + 1), text: pickForumText(c) }))
                .filter(c => c.text)
            : []
        }));
        state.replyTargets = {};
        addAppBadgeCount("forum", 1);
        saveCurrentChatSessionData(false);
        renderForum(targetDoc.getElementById("twSearch").value);
        if (!fromGlobalTask) showModuleSuccessToast("宫内外坛热帖已更新 (+1)");
      }
    } catch (err) {}
    finally {
      if (btn) btn.textContent = "手动刷新";
      if (!fromGlobalTask) setModuleRefreshing("forum", false);
    }
  }

  async function syncAllWithAI() {
    const btn = targetDoc.getElementById("twBtnApiSync");
    if (btn) btn.textContent = "刷新中";
    setGlobalRefreshingState(true, "全部模块刷新中…");
    try {
      await syncFromWorldbookAndChat(false);
      const firstHasName = state.plotSummary.length > 0 && String(state.plotSummary[0]?.summary || "").includes(state.userName);
      if (!state.plotSummary.length || !firstHasName) {
        await autoGenerateCorePlotData(true, { doStatus: true, doPlot: false });
        setModuleRefreshing("status", false, "状态卡已完成，正在重梳时间轴…");
        await rebuildFullLongTimeline(true);
        setModuleRefreshing("plot", false, "剧情梳理已完成，正在刷新地图动向…");
      } else {
        await autoGenerateCorePlotData(true, { doStatus: true, doPlot: true });
        setModuleRefreshing("status", false, "状态与剧情已完成，正在刷新地图动向…");
        setModuleRefreshing("plot", false, "状态与剧情已完成，正在刷新地图动向…");
      }
      setModuleRefreshing("actions", false);
      setModuleRefreshing("emperor", false);
      await refreshWorldOnly(null, true);
      setModuleRefreshing("world", false, "地图动向已完成，正在刷新论坛…");
      await refreshForumOnly(null, true);
      setModuleRefreshing("forum", false);
      setModuleRefreshing("all", false);
      showModuleSuccessToast("全部模块同步刷新完毕");
    } catch (e) {
      setGlobalRefreshingState(false);
    } finally {
      setGlobalRefreshingState(false);
      renderAll();
      if (btn) btn.textContent = "全刷";
    }
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
    setModuleRefreshing("forum", true, "正在盖楼回复…");
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
      const prompt = `这里是《太微宫内外坛》盖楼现场。\n主帖：《${safePostTitle}》：“${safePostContent}”\n历史楼层：\n${fullThreadHistory || "无"}\n刚刚「${forumUser}」发言：“${safeInputText}”${targetNpc ? `（点名回复 ${targetNpc}）` : ""}。\n请生成 ${randomReplyCount} 条新评论！严禁AI冒充「${forumUser}」或「${state.userName}」回帖！\n${styleBlock}\n${identityRule}\n${relCtx}\n${FORUM_NPC_ROSTER}\n输出纯 JSON 数组：\n[{"nick":"趣味网名（真名·位分）","text":"鲜活回复45字内"}]`;
      const resp = await callAI(prompt, "论坛全楼层互通回复", true, usingAlias);
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) {
        const arr = JSON.parse(m[0]).filter(r => !isNpcMatchingUser(r.nick || r.user || r.author));
        for (let i = 0; i < arr.length; i++) {
          const r = arr[i], rNick = pickForumNick(r, i + post.comments.length);
          let replyTxt = pickForumText(r);
          if (rNick && replyTxt) {
            await new Promise(res => setTimeout(res, 420));
            if (usingAlias && state.userName && replyTxt.includes(state.userName)) replyTxt = replyTxt.split(state.userName).join(forumUser);
            post.comments.push({ isSelfUser: false, user: rNick, text: replyTxt });
            saveCurrentChatSessionData(false);
            renderForum(targetDoc.getElementById("twSearch").value);
          }
        }
        addAppBadgeCount("forum", 1);
        showModuleSuccessToast("论坛NPC已接话盖楼");
      }
    } catch (e) {}
    finally { setModuleRefreshing("forum", false); }
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
      const prompt = `扫描当前剧情，列出最适合与 ${state.userName} 联系的 4~6 位登场人物（后妃写为「真名（位分）」）。\n${historyText.slice(-800)}\n${lastFullTurn}\n输出纯 JSON 数组：\n[{"id":"人物名称","title":"身份","personality":"性格与说话口吻"}]`;
      const resp = await callAI(prompt, "扫描剧情可选人物");
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) {
        JSON.parse(m[0]).forEach(item => {
          if (!item || !item.id) return;
          const stdId = formatConsortStandardName(enforceAddressingRules(item.id));
          if (stdId === state.userName) return;
          const existing = state.dmNpcOptions.find(x => x.id === stdId || x.name === stdId);
          if (existing) existing.inCurrentPlot = true;
          else state.dmNpcOptions.splice(1, 0, { id: stdId, name: stdId, display: `${stdId}（${enforceAddressingRules(item.title || "剧情人物")}）`, title: enforceAddressingRules(item.title || "剧情登场人物"), seal: `${stdId.slice(0, 2)}私印`, personality: enforceAddressingRules(item.personality || "贴合当前剧情人设"), inCurrentPlot: true, isDynamic: true });
        });
        saveCurrentChatSessionData(false);
        renderDmSection();
        renderLetterSection();
        renderAtPickerBar();
        showModuleSuccessToast("已更新可选人物名单");
      }
    } catch (e) { scanChatForActiveDmNpcs(); renderDmSection(); renderLetterSection(); }
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
      if (inp) inp.placeholder = `引用回复 ${npcName}（点发送仅发消息，点右侧按钮让对方回复）……`;
    } else {
      bar.classList.remove("active"); txt.innerHTML = "";
      if (inp) inp.placeholder = `给 ${npcName} 发消息（点「发送」仅发消息，点右侧按钮让对方回复）……`;
    }
  }

  function renderDmSection() {
    renderDmNpcDropdown();
    const box = targetDoc.getElementById("twDmBox");
    if (!box) return;
    const npcId = state.dmActiveNpc || "萧承稷";
    const list = Array.isArray(state.dmHistories[npcId]) ? state.dmHistories[npcId] : [];
    if (!list.length && !state.dmTyping) {
      box.innerHTML = `<div class="tw-empty-hint" style="margin:auto;">当前与【${npcId}】的传音记录为空白。<br>点「发送」可先发出消息，点右侧按钮让对方回复。</div>`;
      updateDmQuoteBar();
      return;
    }
    const htmlItems = list.map((m, idx) => {
      if (m.type === "recall") {
        const isSelfRecall = Boolean(m.selfRecall || m.recallBy === state.userName);
        const delBtn = isSelfRecall ? `<button type="button" class="tw-del-btn" data-dm-del-idx="${idx}">删除</button>` : "";
        const peekBtn = (!isSelfRecall && m.originalText)
          ? `<button type="button" class="tw-peek-recall-btn" data-dm-peek-idx="${idx}">${m.showRecalled ? "收起" : "点击查看撤回内容"}</button>`
          : "";
        const revealBox = (!isSelfRecall && m.originalText && m.showRecalled)
          ? `<div class="tw-recalled-reveal-box">${enforceAddressingRules(m.originalText)}</div>`
          : "";
        return `<div class="tw-chat-sys-tip"><div class="tw-chat-sys-line"><span>— ${enforceAddressingRules(m.text)} —</span>${peekBtn}${delBtn}</div>${revealBox}</div>`;
      }
      if (m.type === "system" || m.type === "join") {
        return `<div class="tw-chat-sys-tip"><div class="tw-chat-sys-line"><span>— ${enforceAddressingRules(m.text)} —</span></div></div>`;
      }
      const quoteHtml = m.quote ? `<div class="tw-chat-quoted-block">「${m.quote.sender}：${m.quote.text}」</div>` : "";
      const actionBtns = m.self
        ? `<button type="button" class="tw-chat-quote-btn" data-dm-recall-idx="${idx}">撤回</button><button type="button" class="tw-del-btn" data-dm-del-idx="${idx}">删除</button>`
        : `<button type="button" class="tw-chat-quote-btn" data-dm-quote-idx="${idx}">引用</button>`;
      return `<div class="tw-chat-msg ${m.self ? "self" : ""}"><div class="tw-chat-head-row"><span class="tw-chat-sender">${m.sender}</span>${actionBtns}</div><div class="tw-chat-bubble">${quoteHtml}<div>${highlightMentionsHtml(m.text)}</div></div></div>`;
    });
    if (state.dmTyping) {
      htmlItems.push(`<div class="tw-typing-row">💬 对方正在输入中……</div>`);
    }
    box.innerHTML = htmlItems.join("");
    box.scrollTop = box.scrollHeight;
    updateDmQuoteBar();
  }

  function appendDmUserMessageOnly(userMsg) {
    const npcId = state.dmActiveNpc || "萧承稷";
    const quotedObj = state.dmQuoteTarget ? { ...state.dmQuoteTarget } : null;
    state.dmQuoteTarget = null;
    if (!Array.isArray(state.dmHistories[npcId])) state.dmHistories[npcId] = [];
    state.dmHistories[npcId].push({ sender: state.userName, text: enforceAddressingRules(userMsg), quote: quotedObj, self: true });
    saveCurrentChatSessionData(false);
    renderDmSection();
  }

  async function triggerDmAiReply() {
    const inp = targetDoc.getElementById("twDmInput");
    if (inp && inp.value.trim()) {
      appendDmUserMessageOnly(inp.value.trim());
      inp.value = "";
    }
    const npcId = state.dmActiveNpc || "萧承稷";
    const npcMeta = state.dmNpcOptions.find(x => x.id === npcId) || BASE_DM_NPC_CATALOG[0];
    const waitBtn = targetDoc.getElementById("twDmWaitAiBtn");
    if (!Array.isArray(state.dmHistories[npcId])) state.dmHistories[npcId] = [];
    if (waitBtn) waitBtn.disabled = true;
    state.dmTyping = true;
    renderDmSection();
    try {
      const memLimit = Math.max(4, Math.min(60, Number(config.chatMemoryCount) || 20));
      const historySlice = state.dmHistories[npcId].slice(-memLimit);
      const hist = historySlice.map(m => {
        if (m.type === "recall") return `[系统提示：${m.text}（撤回内容为：“${m.originalText || ""}”，对方已看到撤回动作）]`;
        if (m.type) return `[${m.text}]`;
        const quotePrefix = (m.quote && m.quote.sender) ? `（引用了 ${m.quote.sender} 的消息：“${m.quote.text}”）` : "";
        return `${m.sender}${quotePrefix}：${m.text}`;
      }).join("\n");
      const relCtx = getRelationshipAndFamiliarityContext();
      const prompt = `这里是 ${state.userName} 与【${npcMeta.name}（${npcMeta.title}）】的 1对1 私密对话。\n人设：${npcMeta.personality}（萧承稷必自称朕，禁称孤）\n${relCtx}\n最近记录：\n${hist || "（暂无对话，请主动开启话题）"}\n请让 ${npcMeta.name} 直接回复 1~3 条简短自然的消息。如果情绪微妙、口误失言或口是心非，可随机在某条消息设置 "recall": true。严禁替 ${state.userName} 发言！\n直接输出纯 JSON 数组：\n[{"sender": "${npcMeta.name}", "text": "回复内容", "recall": false}]`;
      const resp = await callAI(prompt, `灵犀传音·${npcMeta.name}`);
      state.dmTyping = false;
      renderDmSection();
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) {
        const arr = JSON.parse(m[0]).filter(item => !isNpcMatchingUser(item.sender));
        let lastReplyText = "", addedCount = 0;
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          if (!item || !item.text) continue;
          await new Promise(r => setTimeout(r, i === 0 ? 300 : 580));
          const cleanTxt = cleanPureText(item.text);
          lastReplyText = cleanTxt;
          addedCount++;
          const msgObj = { sender: npcMeta.name, text: cleanTxt, self: false };
          state.dmHistories[npcId].push(msgObj);
          saveCurrentChatSessionData(false);
          renderDmSection();
          if (item.recall === true || (arr.length > 1 && i === 0 && Math.random() < 0.2)) {
            await new Promise(r => setTimeout(r, 1150));
            const idx = state.dmHistories[npcId].indexOf(msgObj);
            if (idx !== -1) {
              state.dmHistories[npcId][idx] = { type: "recall", selfRecall: false, recallBy: npcMeta.name, originalText: cleanTxt, showRecalled: false, text: `${npcMeta.name} 撤回了一条消息` };
              saveCurrentChatSessionData(false);
              renderDmSection();
            }
          }
        }
        if (addedCount > 0) addAppBadgeCount("chat", addedCount);
        if (lastReplyText) showWechatNotification(`${npcMeta.name}（传音）`, lastReplyText, { app: "chat", chatTab: "dm", npc: npcMeta.id });
      }
    } catch (e) {}
    finally {
      state.dmTyping = false;
      renderDmSection();
      if (waitBtn) waitBtn.disabled = false;
    }
  }

  async function syncDmWithCurrentStory() {
    const npcId = state.dmActiveNpc || "萧承稷";
    const npcMeta = state.dmNpcOptions.find(x => x.id === npcId) || BASE_DM_NPC_CATALOG[0];
    const btn = targetDoc.getElementById("twDmSyncStoryBtn");
    if (btn) { btn.disabled = true; btn.textContent = "同步中…"; }
    state.dmTyping = true;
    renderDmSection();
    try {
      await syncFromWorldbookAndChat(false);
      const { lastFullTurn, lastSceneEnding } = getFullStoryContext(), relCtx = getRelationshipAndFamiliarityContext();
      const prompt = `根据最新剧情让【${npcMeta.name}（${npcMeta.title}）】主动给 ${state.userName} 发来 2~3 条与当前剧情紧密相关的消息！\n人设：${npcMeta.personality}\n${lastFullTurn}\n${lastSceneEnding}\n${relCtx}\n输出纯 JSON 数组：\n[{"sender": "${npcMeta.name}", "text": "主动发来的消息"}]`;
      const resp = await callAI(prompt, `传音同步剧情·${npcMeta.name}`);
      state.dmTyping = false;
      renderDmSection();
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) {
        if (!Array.isArray(state.dmHistories[npcId])) state.dmHistories[npcId] = [];
        state.dmHistories[npcId].push({ type: "system", text: `已同步最新剧情 · ${npcMeta.name} 向你发来传音` });
        const arr = JSON.parse(m[0]).filter(item => !isNpcMatchingUser(item.sender));
        let lastTxt = "", cnt = 0;
        for (const item of arr) {
          if (item && item.text) {
            await new Promise(r => setTimeout(r, 450));
            lastTxt = cleanPureText(item.text);
            cnt++;
            state.dmHistories[npcId].push({ sender: npcMeta.name, text: lastTxt, self: false });
            saveCurrentChatSessionData(false);
            renderDmSection();
          }
        }
        if (cnt > 0) addAppBadgeCount("chat", cnt);
        if (lastTxt) showWechatNotification(`${npcMeta.name}（剧情传音）`, lastTxt, { app: "chat", chatTab: "dm", npc: npcMeta.id });
      }
    } catch (e) {}
    finally {
      state.dmTyping = false;
      renderDmSection();
      if (btn) { btn.disabled = false; btn.textContent = "同步剧情开聊"; }
    }
  }

  async function convertDmToOfflineSceneAndFill() {
    const npcId = state.dmActiveNpc || "萧承稷";
    const npcMeta = state.dmNpcOptions.find(x => x.id === npcId) || BASE_DM_NPC_CATALOG[0];
    const list = (state.dmHistories[npcId] || []).filter(m => !m.type && m.text);
    const btn = targetDoc.getElementById("twDmExportOfflineBtn");
    if (!list.length) { showModuleSuccessToast("当前传音为空，请先聊几句再转化"); return; }
    if (btn) { btn.disabled = true; btn.textContent = "转化中…"; }
    try {
      const memLimit = Math.max(4, Math.min(60, Number(config.chatMemoryCount) || 20));
      const recentChat = list.slice(-memLimit).map(m => `${m.sender}：“${m.text}”`).join("\n");
      const { lastSceneEnding } = getFullStoryContext();
      const prompt = `请将下方 ${state.userName} 与【${npcMeta.name}】在灵犀传音中的对话自然转化为一段符合大景王朝背景的【线下当面交谈或内侍传话】第三人称剧情描写（约120字），严禁出现手机、微信、私聊等现代词。\n当前场景：${lastSceneEnding || state.location}\n对话记录：\n${recentChat}`;
      const resp = await callAI(prompt, `传音转线下剧情·${npcMeta.name}`);
      const sceneText = cleanPureText(resp);
      if (sceneText) { fillUserChatInput(sceneText); showModuleSuccessToast("已转化为线下剧情并填入酒馆输入框"); }
    } catch (e) {}
    finally { if (btn) { btn.disabled = false; btn.textContent = "转线下填入酒馆"; } }
  }

  function isGroupThemeIfOrCustom() {
    const key = config.groupChatTheme || "story_sync";
    const preset = GROUP_CHAT_THEMES[key];
    return Boolean(preset?.isIf || key === "custom" || key === "user_empress_harem" || key.startsWith("if_"));
  }

  /* 群聊转酒馆输入框（若为IF线或自定义主题，自动附带完整平行世界/主题背景设定说明） */
  async function exportGroupChatToTavernOffline() {
    const list = (state.groupMessages || []).filter(m => (!m.type || m.type === "recall") && (m.text || m.originalText));
    if (!list.length) {
      showModuleSuccessToast("当前群聊记录为空，请先刷新或聊几句");
      return;
    }
    const btn = targetDoc.getElementById("twGroupExportOfflineBtn");
    const isIfMode = isGroupThemeIfOrCustom();
    const themeKey = config.groupChatTheme || "story_sync";
    const themeName = GROUP_CHAT_THEMES[themeKey]?.name || "自定义主题";
    const customThemeTxt = (config.groupChatCustomThemeText || "").trim();
    const themeDesc = (themeKey === "custom" && customThemeTxt) ? customThemeTxt : (GROUP_CHAT_THEMES[themeKey]?.desc || themeName);
    const memLimit = Math.max(8, Math.min(60, Number(config.chatMemoryCount) || 25));
    const chatTranscript = list.slice(-memLimit).map(m => {
      if (m.type === "recall") return `[${m.recallBy} 撤回了一句话：“${m.originalText}”]`;
      const q = (m.quote && m.quote.sender) ? `（回复 @${m.quote.sender}）` : "";
      return `${m.sender}${q}：“${m.text}”`;
    }).join("\n");

    if (btn) { btn.disabled = true; btn.textContent = "转化中…"; }
    try {
      if (!isIfMode) {
        const { lastSceneEnding } = getFullStoryContext();
        const prompt = `请将下方《太微群聊（主题：${themeName}）》中众人与 ${state.userName} 的对话与热闹动向，自然转化为一段符合大景王朝宫廷/长安背景的【线下当面偶遇交谈、茶会闲话或宫人传话】第三人称场景描写（约140字），用于直接衔接酒馆主线剧情。严禁出现群聊、手机、艾特、撤回等现代词汇。\n当前主线场景：${lastSceneEnding || state.location}\n群聊记录：\n${chatTranscript}`;
        const resp = await callAI(prompt, `群聊转线下场景·${themeName}`);
        const sceneText = cleanPureText(resp);
        if (sceneText) {
          fillUserChatInput(sceneText);
          showModuleSuccessToast("群聊已转化为线下场景并填入酒馆");
        }
      } else {
        const prompt = `请将下方【${themeName}】群聊中的互动内容，转化为一段约150字的第三人称线下开场剧情描写（紧接群聊里刚刚聊到的事件往下演）。\n背景设定：${themeDesc}\n群聊记录：\n${chatTranscript}`;
        const resp = await callAI(prompt, `IF线群聊转酒馆·${themeName}`);
        const sceneText = cleanPureText(resp);
        const fullExportText = `【平行时空/特殊主题剧场：${themeName}】\n【当前世界背景与身份设定：${themeDesc}】\n\n${sceneText}`;
        fillUserChatInput(fullExportText);
        showModuleSuccessToast(`已带【${themeName}】背景说明填入酒馆输入框`);
      }
    } catch (e) {}
    finally {
      if (btn) { btn.disabled = false; btn.textContent = "转线下填入酒馆"; }
    }
  }

  targetDoc.getElementById("twGroupExportOfflineBtn")?.addEventListener("click", exportGroupChatToTavernOffline);

  /* ==================== 飞鸽传书 App（支持多轮书信往来） ==================== */
  function renderLetterSection() {
    const sel = targetDoc.getElementById("twLetterNpcSelect");
    const salEl = targetDoc.getElementById("twLetterWriteSalutation");
    const signEl = targetDoc.getElementById("twLetterWriteSign");
    const countBadge = targetDoc.getElementById("twLetterCountBadge");
    const listBox = targetDoc.getElementById("twLetterListBox");
    const detailBox = targetDoc.getElementById("twLetterDetailView");
    if (!sel || !listBox) return;

    sel.innerHTML = state.dmNpcOptions.map(n => `<option value="${n.id}" ${n.id === state.letterActiveNpc ? "selected" : ""}>${n.display || `${n.name}（${n.title}）`}</option>`).join("");
    const curNpc = state.dmNpcOptions.find(x => x.id === state.letterActiveNpc) || BASE_DM_NPC_CATALOG[0];
    if (salEl) salEl.textContent = `致 ${curNpc.name} 展信佳：`;
    if (signEl) signEl.textContent = `${state.userName} 手启`;
    if (countBadge) countBadge.textContent = `共 ${state.lettersList.length} 封`;

    if (state.activeLetterViewId) {
      const item = state.lettersList.find(x => x.id === state.activeLetterViewId);
      if (item && detailBox) {
        // 兼容多轮书信历史 rounds 数组
        const rounds = Array.isArray(item.rounds) && item.rounds.length
          ? item.rounds
          : [{
              userBody: item.userBody,
              replySalutation: item.replySalutation,
              replyBody: item.replyBody,
              replySign: item.replySign,
              replySeal: item.replySeal,
              time: item.time
            }];

        const roundsHtml = rounds.map((r, rIdx) => `
          <div style="margin-bottom:6px;font-size:10.5px;color:var(--text-sub);text-align:center;">— 第 ${rIdx + 1} 回鱼雁往来（${r.time || item.time || "今日"}） —</div>
          <div class="tw-letter-paper" style="margin-bottom:8px;opacity:0.92;">
            <div class="tw-letter-salutation">【寄出】致 ${item.npcName}：</div>
            <div class="tw-letter-body" style="min-height:40px;">${enforceAddressingRules(r.userBody)}</div>
            <div class="tw-letter-footer"><span class="tw-letter-sign">${state.userName} 手启</span></div>
          </div>
          <div class="tw-letter-paper" style="margin-bottom:12px;">
            <div class="tw-letter-salutation">${enforceAddressingRules(r.replySalutation || `${state.userName} 亲启：`)}</div>
            <div class="tw-letter-body">${enforceAddressingRules(r.replyBody || "信使尚在途中……")}</div>
            <div class="tw-letter-footer">
              <span class="tw-letter-sign">${enforceAddressingRules(r.replySign || `${item.npcName} 亲笔`)}</span>
              <div class="tw-letter-seal">${enforceAddressingRules(r.replySeal || "亲笔<br>私印")}</div>
            </div>
          </div>
        `).join("");

        detailBox.style.display = "block";
        listBox.style.display = "none";
        detailBox.innerHTML = `
          <div style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
            <button type="button" class="tw-spy-back-btn" id="twLetterBackListBtn">← 返回锦匣列表</button>
            <span class="tw-badge">共 ${rounds.length} 回往来</span>
          </div>
          ${roundsHtml}
          <div class="tw-letter-paper" style="padding:10px 12px;margin-top:6px;">
            <div class="tw-letter-salutation" style="font-size:12.5px;margin-bottom:4px;">✍️ 紧接此信继续回信给 【${item.npcName}】：</div>
            <textarea class="tw-textarea" id="twLetterFollowupInput" style="background:transparent;border:0;padding:0;min-height:65px;line-height:1.85;font-size:12px;color:#2b1d12;outline:none;box-shadow:none;" placeholder="看着TA的回信，在此继续提笔回传……"></textarea>
            <button type="button" class="tw-refresh-forum-btn" id="twSendFollowupLetterBtn" data-letter-id="${item.id}" style="width:100%;padding:6px;margin-top:4px;">🕊️ 再次封缄投递 · 等候TA下一封回信</button>
          </div>
        `;
        return;
      }
    }
    if (detailBox) detailBox.style.display = "none";
    listBox.style.display = "block";
    if (!state.lettersList.length) {
      listBox.innerHTML = `<div class="tw-empty-hint">锦匣内暂无往来书信，请在上方信笺提笔修书投递。</div>`;
      return;
    }
    listBox.innerHTML = state.lettersList.map(item => {
      const rCount = Array.isArray(item.rounds) ? item.rounds.length : 1;
      const latestReply = Array.isArray(item.rounds) && item.rounds.length ? item.rounds[item.rounds.length - 1].replyBody : item.replyBody;
      return `
        <div class="tw-letter-item-card" data-letter-id="${item.id}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
            <b>🕊️ 与【${item.npcName}】的尺素（${rCount}回）</b>
            <span class="tw-label">${item.time || "刚刚"}</span>
          </div>
          <div style="font-size:11.5px;color:var(--text-sub);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">最新回音：${enforceAddressingRules(latestReply || "").slice(0, 38)}……</div>
        </div>
      `;
    }).join("");
  }

  targetDoc.getElementById("twLetterNpcSelect")?.addEventListener("change", (e) => {
    state.letterActiveNpc = e.target.value || "萧承稷";
    renderLetterSection();
  });

  async function requestNpcLetterReply(npcMeta, userTxt, historyRounds = []) {
    const relCtx = getRelationshipAndFamiliarityContext();
    const prevContext = historyRounds.length
      ? `\n【此前双方书信往来上下文】：\n` + historyRounds.slice(-4).map((r, i) => `第${i + 1}回·${state.userName}去信：“${r.userBody}”\n第${i + 1}回·${npcMeta.name}回信：“${r.replyBody}”`).join("\n\n")
      : "";
    const prompt = `${state.userName} 刚刚修书一封，遣信鸽/内侍送至【${npcMeta.name}（${npcMeta.title}）】案头。${prevContext}\n\n【本次最新来信内容】：“${userTxt}”\n收信人人设：${npcMeta.personality}（若为萧承稷必自称朕或我，禁称孤）。\n${relCtx}\n请以 ${npcMeta.name} 的口吻用纯正古风尺素书信体写一封回信（约 120~180 字，紧接上一封信的话头，展现出拆信时的神态心情与对本次来信的细致回应）。\n直接输出纯 JSON 对象：\n{"salutation":"信首称呼（如：${state.userName}展信、或爱妃亲启等）","body":"回信正文（分段自然，古雅真挚，贴合人设）","sign":"落款署名（如：萧承稷 御笔 / 沈砚 谨启）","seal":"四字印章内容（如：${npcMeta.seal || "亲笔私印"}）"}`;
    const resp = await callAI(prompt, `飞鸽回信·${npcMeta.name}`);
    const m = String(resp).match(/{[\s\S]*}/);
    if (!m) throw new Error("回信解析失败");
    return JSON.parse(m[0]);
  }

  targetDoc.getElementById("twSendLetterBtn")?.addEventListener("click", async () => {
    const bodyInp = targetDoc.getElementById("twLetterWriteBody");
    const userTxt = bodyInp?.value.trim() || "";
    if (!userTxt) { showModuleSuccessToast("请先在信笺上写下内容"); return; }
    const btn = targetDoc.getElementById("twSendLetterBtn");
    const npcMeta = state.dmNpcOptions.find(x => x.id === state.letterActiveNpc) || BASE_DM_NPC_CATALOG[0];
    if (btn) { btn.disabled = true; btn.textContent = "🕊️ 飞鸽传书中，正在等候对方提笔回信……"; }
    try {
      const p = await requestNpcLetterReply(npcMeta, userTxt, []);
      const curTime = state.time !== "未同步" ? state.time : "延昭二年";
      const firstRound = {
        time: curTime,
        userBody: userTxt,
        replySalutation: cleanPureText(p.salutation || `${state.userName} 展信：`),
        replyBody: cleanPureText(p.body || ""),
        replySign: cleanPureText(p.sign || `${npcMeta.name} 手启`),
        replySeal: cleanPureText(p.seal || npcMeta.seal || "亲笔私印").slice(0, 4)
      };
      const newLetter = {
        id: Date.now(),
        npcId: npcMeta.id,
        npcName: npcMeta.name,
        time: curTime,
        ...firstRound,
        rounds: [firstRound]
      };
      state.lettersList.unshift(newLetter);
      state.activeLetterViewId = newLetter.id;
      if (bodyInp) bodyInp.value = "";
      addAppBadgeCount("letter", 1);
      saveCurrentChatSessionData(false);
      renderLetterSection();
      showWechatNotification(`🕊️ ${npcMeta.name} 的回信`, firstRound.replyBody, { app: "letter" });
    } catch (e) {}
    finally {
      if (btn) { btn.disabled = false; btn.textContent = "🕊️ 封缄用印 · 飞鸽投递并静候回音"; }
    }
  });

  targetDoc.getElementById("tw-page-letter")?.addEventListener("click", async (e) => {
    if (e.target.closest("#twLetterBackListBtn")) {
      state.activeLetterViewId = null;
      renderLetterSection();
      return;
    }
    const followBtn = e.target.closest("#twSendFollowupLetterBtn");
    if (followBtn) {
      const letterId = Number(followBtn.dataset.letterId);
      const item = state.lettersList.find(x => x.id === letterId);
      const followInp = targetDoc.getElementById("twLetterFollowupInput");
      const userTxt = followInp?.value.trim() || "";
      if (!item || !userTxt) { showModuleSuccessToast("请先写下要回传的内容"); return; }
      const npcMeta = state.dmNpcOptions.find(x => x.id === item.npcId || x.name === item.npcName) || BASE_DM_NPC_CATALOG[0];
      followBtn.disabled = true;
      followBtn.textContent = `🕊️ 信鸽已飞往 ${item.npcName} 处，正在等候回音……`;
      try {
        if (!Array.isArray(item.rounds) || !item.rounds.length) {
          item.rounds = [{ time: item.time, userBody: item.userBody, replySalutation: item.replySalutation, replyBody: item.replyBody, replySign: item.replySign, replySeal: item.replySeal }];
        }
        const p = await requestNpcLetterReply(npcMeta, userTxt, item.rounds);
        const curTime = state.time !== "未同步" ? state.time : "延昭二年";
        const nextRound = {
          time: curTime,
          userBody: userTxt,
          replySalutation: cleanPureText(p.salutation || `${state.userName} 再展：`),
          replyBody: cleanPureText(p.body || ""),
          replySign: cleanPureText(p.sign || `${npcMeta.name} 手启`),
          replySeal: cleanPureText(p.seal || npcMeta.seal || "亲笔私印").slice(0, 4)
        };
        item.rounds.push(nextRound);
        item.time = curTime;
        item.replyBody = nextRound.replyBody;
        addAppBadgeCount("letter", 1);
        saveCurrentChatSessionData(false);
        renderLetterSection();
        showWechatNotification(`🕊️ ${item.npcName} 的新回信`, nextRound.replyBody, { app: "letter" });
      } catch (err) {
        followBtn.disabled = false;
        followBtn.textContent = "🕊️ 再次封缄投递 · 等候TA下一封回信";
      }
      return;
    }
    const card = e.target.closest(".tw-letter-item-card");
    if (card) {
      state.activeLetterViewId = Number(card.dataset.letterId);
      renderLetterSection();
    }
  });

  targetDoc.getElementById("twLetterClearAllBtn")?.addEventListener("click", () => {
    state.lettersList = [];
    state.activeLetterViewId = null;
    saveCurrentChatSessionData(false);
    renderLetterSection();
    showModuleSuccessToast("已清空往来书信锦匣");
  });


  /* ==================== 默契挑战 App（结合User人设与酒馆剧情 + 纯正古风白话） ==================== */
  function renderTacitSection() {
    rootEl.querySelectorAll("button[data-tacitmode]").forEach(b => b.classList.toggle("active", b.dataset.tacitmode === state.tacitMode));
    const titleEl = targetDoc.getElementById("twTacitModeTitle");
    if (titleEl) {
      titleEl.textContent = state.tacitMode === "guess_xiao"
        ? `我猜萧承稷（选圣人最可能选的答案）`
        : `萧承稷猜我（先勾出你自己的真实答案考圣人）`;
    }
    const qBox = targetDoc.getElementById("twTacitQuestionsBox");
    const subBtn = targetDoc.getElementById("twSubmitTacitBtn");
    const resBox = targetDoc.getElementById("twTacitResultBox");
    const shareBtn = targetDoc.getElementById("twShareTacitToDmBtn");
    if (!qBox || !subBtn || !resBox) return;

    if (!state.tacitData || !Array.isArray(state.tacitData.questions) || !state.tacitData.questions.length) {
      qBox.innerHTML = `<div class="tw-empty-hint">请先选定上方主题并点击「🎲 抽取5道新题」开启古风默契大考验！</div>`;
      subBtn.style.display = "none";
      resBox.style.display = "none";
      if (shareBtn) shareBtn.style.display = "none";
      return;
    }

    const qs = state.tacitData.questions;
    const isSubmitted = Boolean(state.tacitData.submitted);
    qBox.innerHTML = qs.map((q, qIdx) => {
      const userPick = state.tacitUserChoices[qIdx];
      const optsHtml = (q.options || []).map((optText, oIdx) => {
        const isSel = userPick === oIdx;
        let markClass = "";
        if (isSubmitted) {
          const targetAns = state.tacitMode === "guess_xiao" ? q.xiaoAnswerIndex : q.xiaoGuessIndex;
          if (oIdx === targetAns) markClass = "correct-mark";
        }
        return `<button type="button" class="tw-tacit-opt ${isSel ? "selected" : ""} ${markClass}" data-qidx="${qIdx}" data-oidx="${oIdx}" ${isSubmitted ? "disabled" : ""}>${["甲", "乙", "丙", "丁"][oIdx] || "·"}、 ${enforceAddressingRules(optText)}</button>`;
      }).join("");

      let feedbackHtml = "";
      if (isSubmitted) {
        if (state.tacitMode === "guess_xiao") {
          const xiaoIdx = Number(q.xiaoAnswerIndex) || 0;
          const isHit = userPick === xiaoIdx;
          feedbackHtml = `<div class="tw-tacit-comment"><b>${isHit ? "✅ 猜中圣心" : `❌ 猜错（圣人真实心意：${["甲", "乙", "丙", "丁"][xiaoIdx]}）`}</b><br>萧承稷朱批：“${enforceAddressingRules(q.xiaoComment || "……")}”</div>`;
        } else {
          const xiaoGuess = Number(q.xiaoGuessIndex) || 0;
          const isHit = userPick === xiaoGuess;
          feedbackHtml = `<div class="tw-tacit-comment"><b>${isHit ? `✅ 圣人猜中了你（他选了 ${["甲", "乙", "丙", "丁"][xiaoGuess]}）` : `❌ 圣人猜错了（他选了 ${["甲", "乙", "丙", "丁"][xiaoGuess]}，你的真实答案是 ${["甲", "乙", "丙", "丁"][userPick]}）`}</b><br>萧承稷反应：“${enforceAddressingRules(q.xiaoReaction || "……")}”</div>`;
        }
      }
      return `<div class="tw-tacit-q-card"><div class="tw-tacit-q-title">第 ${["一", "二", "三", "四", "五"][qIdx] || (qIdx + 1)} 题：${enforceAddressingRules(q.question)}</div>${optsHtml}${feedbackHtml}</div>`;
    }).join("");

    if (!isSubmitted) {
      subBtn.style.display = "block";
      subBtn.textContent = state.tacitMode === "guess_xiao" ? "呈交萧承稷朱批打分" : "锁定我的答案 · 请圣人盲猜";
      resBox.style.display = "none";
      if (shareBtn) shareBtn.style.display = "none";
    } else {
      subBtn.style.display = "none";
      resBox.style.display = "block";
      if (shareBtn) shareBtn.style.display = "inline-block";
      resBox.innerHTML = `
        <div class="tw-spy-murmur-box">
          <div style="font-size:14px;font-weight:bold;color:#9e241e;margin-bottom:4px;">🏆 灵犀默契得分：${state.tacitData.score} / 100 分（契合 ${state.tacitData.hitCount} / 5 题）</div>
          <div><b>👑 萧承稷御笔总评：</b><br>“${enforceAddressingRules(state.tacitData.overallRoast || "尚可。")}”</div>
        </div>
      `;
    }
  }

  rootEl.querySelectorAll("button[data-tacitmode]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.tacitMode = btn.dataset.tacitmode || "guess_xiao";
      state.tacitData = null;
      state.tacitUserChoices = {};
      renderTacitSection();
    });
  });

  targetDoc.getElementById("twTacitTopicChips")?.addEventListener("click", (e) => {
    const chip = e.target.closest(".tw-chip[data-ttopic]");
    if (!chip) return;
    rootEl.querySelectorAll("#twTacitTopicChips .tw-chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    state.tacitTopic = chip.dataset.ttopic || "日常小习惯与起居怪癖";
    targetDoc.getElementById("twTacitCustomTopic").value = "";
  });

  targetDoc.getElementById("twGenTacitQuizBtn")?.addEventListener("click", async () => {
    const btn = targetDoc.getElementById("twGenTacitQuizBtn");
    const customT = targetDoc.getElementById("twTacitCustomTopic")?.value.trim() || "";
    const activeTopic = customT || state.tacitTopic || "日常小习惯与起居怪癖";
    if (btn) { btn.disabled = true; btn.textContent = "拟题中…"; }
    try {
      await syncFromWorldbookAndChat(false);
      const relCtx = getRelationshipAndFamiliarityContext();
      const userPersona = getUserPersonaContext();
      const { lastFullTurn } = getFullStoryContext();
      const styleRule = `【语言风格与剧情结合死命令】：\n1. 全程题目、四个选项与点评必须采用**纯正古风白话**（唐代宫廷日常口语与古韵白话结合，自然生动，严禁出现现代网络词、手机、约会、男神等现代出戏词汇）！\n2. 必须紧密结合当前酒馆已发生的剧情事件、萧承稷人设以及 ${state.userName} 的人设（${userPersona || "参考最新酒馆剧情表现"}）来量身定制题目！`;

      if (state.tacitMode === "guess_xiao") {
        const prompt = `请围绕主题【${activeTopic}】，结合大景天子萧承稷的人设与当前与 ${state.userName} 的最新剧情互动，现场随机出 5 道《测试 ${state.userName} 有多了解萧承稷》的四选一古风白话默契题！\n${styleRule}\n${relCtx}\n最新剧情参考：\n${lastFullTurn.slice(-600)}\n每道题包含 question、options（4个古风白话选项数组）、xiaoAnswerIndex（0~3，萧承稷按其性格与当前好感阶段真实会选的索引）、xiaoComment（萧承稷看到 ${state.userName} 选对或选错时的简短古风白话点评，自称朕）。\n直接输出纯 JSON 对象：\n{"topic":"${activeTopic}","questions":[{"question":"古风白话题目内容","options":["选项甲","选项乙","选项丙","选项丁"],"xiaoAnswerIndex":0,"xiaoComment":"萧承稷的一句话古风点评"}]}`;
        const resp = await callAI(prompt, `默契出题·猜萧承稷`);
        const m = String(resp).match(/{[\s\S]*}/);
        if (m) {
          const p = JSON.parse(m[0]);
          state.tacitData = { mode: "guess_xiao", topic: activeTopic, questions: (p.questions || []).slice(0, 5), submitted: false };
          state.tacitUserChoices = {};
          saveCurrentChatSessionData(false);
          renderTacitSection();
          showModuleSuccessToast("5道古风默契题已生成！");
        }
      } else {
        const prompt = `请围绕主题【${activeTopic}】，深度读取 ${state.userName} 的人设（${userPersona || "未填固定人设，请直接依据下方最新酒馆剧情中她的言行性情"}）与两人近期相处剧情，现场生成 5 道《关于 ${state.userName} 性情喜好/小心思/遇到某事时的反应》的四选一古风白话题目（用来让 ${state.userName} 先选自己的真实答案，再请萧承稷根据他对她的观察来盲猜）！\n${styleRule}\n${relCtx}\n最新剧情参考：\n${lastFullTurn.slice(-600)}\n直接输出纯 JSON 对象：\n{"topic":"${activeTopic}","questions":[{"question":"关于${state.userName}的古风白话题目","options":["选项甲","选项乙","选项丙","选项丁"]}]}`;
        const resp = await callAI(prompt, `默契出题·考萧承稷`);
        const m = String(resp).match(/{[\s\S]*}/);
        if (m) {
          const p = JSON.parse(m[0]);
          state.tacitData = { mode: "xiao_guess_me", topic: activeTopic, questions: (p.questions || []).slice(0, 5), submitted: false };
          state.tacitUserChoices = {};
          saveCurrentChatSessionData(false);
          renderTacitSection();
          showModuleSuccessToast("请先勾选你自己的真实答案！");
        }
      }
    } catch (e) {}
    finally {
      if (btn) { btn.disabled = false; btn.textContent = "🎲 抽取5道新题"; }
    }
  });

  targetDoc.getElementById("twTacitQuestionsBox")?.addEventListener("click", (e) => {
    const optBtn = e.target.closest(".tw-tacit-opt");
    if (!optBtn || state.tacitData?.submitted) return;
    const qIdx = Number(optBtn.dataset.qidx), oIdx = Number(optBtn.dataset.oidx);
    state.tacitUserChoices[qIdx] = oIdx;
    renderTacitSection();
  });

  targetDoc.getElementById("twSubmitTacitBtn")?.addEventListener("click", async () => {
    if (!state.tacitData || !Array.isArray(state.tacitData.questions)) return;
    const qs = state.tacitData.questions;
    for (let i = 0; i < qs.length; i++) {
      if (state.tacitUserChoices[i] === undefined) {
        showModuleSuccessToast(`请先答完第 ${i + 1} 题再提交`);
        return;
      }
    }
    const subBtn = targetDoc.getElementById("twSubmitTacitBtn");
    if (subBtn) { subBtn.disabled = true; subBtn.textContent = "萧承稷正在执朱笔批阅……"; }
    try {
      const relCtx = getRelationshipAndFamiliarityContext();
      const userPersona = getUserPersonaContext();
      if (state.tacitMode === "guess_xiao") {
        let hitCount = 0;
        const detailLines = qs.map((q, i) => {
          const uPick = state.tacitUserChoices[i], xAns = Number(q.xiaoAnswerIndex) || 0;
          if (uPick === xAns) hitCount++;
          return `第${i + 1}题：${q.question} | ${state.userName}选了：${q.options[uPick]} | 萧承稷真实答案：${q.options[xAns]}（${uPick === xAns ? "答对" : "答错"}）`;
        }).join("\n");
        const score = hitCount * 20;
        const prompt = `${state.userName} 刚刚做完了《关于萧承稷的默契挑战（主题：${state.tacitData.topic}）》，共 5 题答对了 ${hitCount} 题（得分 ${score}/100）。\n答题明细：\n${detailLines}\n${relCtx}\n请以萧承稷的口吻（必自称朕，禁称孤，使用纯正古风白话）对每一道题 ${state.userName} 的选择作出一句针对性朱批点评，并给出一段 70 字左右的总评与敲打/奖赏！\n输出纯 JSON：\n{"perQuestionComments":["第1题点评","第2题点评","第3题点评","第4题点评","第5题点评"],"overallRoast":"萧承稷的古风白话总评70字左右"}`;
        const resp = await callAI(prompt, "萧承稷批阅默契考卷");
        const m = String(resp).match(/{[\s\S]*}/);
        if (m) {
          const p = JSON.parse(m[0]);
          if (Array.isArray(p.perQuestionComments)) {
            qs.forEach((q, idx) => { if (p.perQuestionComments[idx]) q.xiaoComment = p.perQuestionComments[idx]; });
          }
          state.tacitData.overallRoast = p.overallRoast || "";
        }
        state.tacitData.hitCount = hitCount;
        state.tacitData.score = score;
        state.tacitData.submitted = true;
        saveCurrentChatSessionData(false);
        renderTacitSection();
      } else {
        const qSummary = qs.map((q, i) => `第${i + 1}题：${q.question}\n选项：0:${q.options[0]} | 1:${q.options[1]} | 2:${q.options[2]} | 3:${q.options[3]}\n（${state.userName} 的真实答案索引是：${state.tacitUserChoices[i]}）`).join("\n\n");
        const prompt = `${state.userName} 出了一份关于她自己的默契考卷（主题：${state.tacitData.topic}）考萧承稷。\n${state.userName}的人设信息：${userPersona || "请结合近期酒馆剧情中她的言行表现判断"}\n${qSummary}\n${relCtx}\n请让萧承稷根据他对 ${state.userName} 人设与日常剧情的观察盲猜这 5 道题（根据当前好感度与了解程度，合理决定他猜对几题、或因帝王思维猜错哪题），并用纯正古风白话写出他揭晓答案后发现自己猜对/猜错时的反应（自称朕）以及最终总评！\n输出纯 JSON：\n{"guesses":[{"xiaoGuessIndex":0,"xiaoReaction":"萧承稷发现猜对或猜错这题时的古风白话反应"},{"xiaoGuessIndex":1,"xiaoReaction":"..."},{"xiaoGuessIndex":0,"xiaoReaction":"..."},{"xiaoGuessIndex":2,"xiaoReaction":"..."},{"xiaoGuessIndex":1,"xiaoReaction":"..."}],"overallRoast":"萧承稷考完后的古风白话总评70字左右"}`;
        const resp = await callAI(prompt, "萧承稷盲猜默契考卷");
        const m = String(resp).match(/{[\s\S]*}/);
        let hitCount = 0;
        if (m) {
          const p = JSON.parse(m[0]);
          qs.forEach((q, i) => {
            const g = p.guesses?.[i] || {};
            const gIdx = (typeof g.xiaoGuessIndex === "number" && g.xiaoGuessIndex >= 0 && g.xiaoGuessIndex <= 3) ? g.xiaoGuessIndex : state.tacitUserChoices[i];
            q.xiaoGuessIndex = gIdx;
            q.xiaoReaction = g.xiaoReaction || "朕自然清楚你的脾性。";
            if (gIdx === state.tacitUserChoices[i]) hitCount++;
          });
          state.tacitData.overallRoast = p.overallRoast || "";
        }
        state.tacitData.hitCount = hitCount;
        state.tacitData.score = hitCount * 20;
        state.tacitData.submitted = true;
        saveCurrentChatSessionData(false);
        renderTacitSection();
      }
    } catch (e) {}
    finally {
      if (subBtn) subBtn.disabled = false;
    }
  });

  targetDoc.getElementById("twShareTacitToDmBtn")?.addEventListener("click", () => {
    if (!state.tacitData || !state.tacitData.submitted) return;
    if (!Array.isArray(state.dmHistories["萧承稷"])) state.dmHistories["萧承稷"] = [];
    const modeTitle = state.tacitMode === "guess_xiao" ? `${state.userName}猜圣人` : `圣人猜${state.userName}`;
    const cardMsg = `【默契挑战卷 · ${state.tacitData.topic}（${modeTitle}）】得分：${state.tacitData.score}/100 分（契合 ${state.tacitData.hitCount}/5 题）`;
    state.dmHistories["萧承稷"].push({ sender: state.userName, text: cardMsg, self: true });
    if (state.tacitData.overallRoast) {
      state.dmHistories["萧承稷"].push({ sender: "萧承稷", text: cleanPureText(state.tacitData.overallRoast), self: false });
    }
    state.dmActiveNpc = "萧承稷";
    saveCurrentChatSessionData(false);
    openAppPage("chat");
    state.activeChatTab = "dm";
    rootEl.querySelectorAll("button[data-chattab]").forEach(b => b.classList.toggle("active", b.dataset.chattab === "dm"));
    targetDoc.getElementById("tw-chat-pane-dm")?.classList.add("active");
    targetDoc.getElementById("tw-chat-pane-chatroom")?.classList.remove("active");
    renderDmSection();
    showModuleSuccessToast("成绩单已转发至萧承稷私聊");
  });

  /* ==================== 小剧场泥金画卷美化渲染 ==================== */
  function renderTheaterFancyView() {
    const outBox = targetDoc.getElementById("twTheaterResult");
    if (!outBox) return;
    const raw = (state.theaterText || "").trim();
    if (!raw) {
      outBox.innerHTML = `<div class="tw-empty-hint">目前画卷为空白，请在上方选择或输入主题后点击「✨ 执笔生成画卷剧场」。</div>`;
      return;
    }
    const safeTxt = enforceAddressingRules(raw);
    const paras = safeTxt.split(/\n+/).map(s => s.trim()).filter(Boolean);
    const titleStr = enforceAddressingRules(state.theaterTitle || targetDoc.getElementById("twTheaterPrompt")?.value.trim() || "太微宫 · 浮生秘戏");
    const shortTitle = titleStr.length > 16 ? titleStr.slice(0, 16) + "…" : titleStr;

    const formattedParas = paras.map((p, idx) => {
      const coloredQuotes = p.replace(/(“[^”]+”)/g, '<span class="tw-theater-quote">$1</span>');
      if (idx === 0 && p.length > 2) {
        const firstChar = p.charAt(0);
        const restStr = p.slice(1).replace(/(“[^”]+”)/g, '<span class="tw-theater-quote">$1</span>');
        return `<p class="tw-theater-para first-para"><span class="tw-theater-dropcap">${firstChar}</span>${restStr}</p>`;
      }
      return `<p class="tw-theater-para">${coloredQuotes}</p>`;
    }).join("");

    outBox.innerHTML = `
      <div class="tw-theater-scroll-card">
        <div class="tw-theater-scroll-head">
          <div class="tw-theater-scroll-title">《 ${shortTitle} 》</div>
          <div class="tw-theater-scroll-meta">
            <span>⏳ ${state.time !== "未同步" ? state.time : "延昭二年"}</span>
            <span>·</span>
            <span>📍 ${state.location !== "未同步" ? state.location : "太微宫"}</span>
            <span>·</span>
            <span>💞 好感 ${state.hasAffection ? state.affection : 0}</span>
          </div>
        </div>
        <div>${formattedParas}</div>
        <div class="tw-theater-scroll-foot">
          <span>起居注内档 · 谨封</span>
          <span class="tw-theater-stamp">太微秘戏</span>
        </div>
      </div>
    `;
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

  function getGroupThemePromptBlock(hasRecentUserMsg = false) {
    const uName = state.userName || detectCurrentUserName();
    const key = config.groupChatTheme || "story_sync";
    const preset = GROUP_CHAT_THEMES[key] || GROUP_CHAT_THEMES.story_sync;
    const customTxt = (config.groupChatCustomThemeText || "").trim();
    const desc = (key === "custom" && customTxt) ? `用户自定义群聊主题与世界观设定：【${customTxt}】` : preset.desc;
    const isUserCentric = Boolean(preset.userCentric) || (key === "custom" && /女皇|我是皇帝|围绕我|宠我|修罗场/.test(customTxt));
    const isIfMode = isGroupThemeIfOrCustom();

    const focusRule = isUserCentric
      ? `【群聊焦点规则】：全员围绕 ${uName} 展开互动、争风吃醋或邀宠！`
      : hasRecentUserMsg
        ? `【群聊焦点规则】：因为 ${uName} 刚刚在群里说了话（或 @了某人），请被 @到的角色或群友自然接住 ${uName} 的话往下聊，同时其他群友之间也可以顺着话题互相 @对方 斗嘴插科打诨！`
        : `【群聊去中心化最高铁律】：严禁全员围着 ${uName} 聊天！群成员们必须严格围绕当前主题【${preset.name}】聊他们自己的日常、朝堂差事、后宫八卦、打球喝酒或互相抬杠互怼！`;

    const fancyJoinRule = `【NPC花样进群提示铁律】：中途穿插的 1~2 条 {"type": "join", "text": "..."} 严禁只写干巴巴的“某某进入了聊天室”！必须结合该角色人设与当前动作写出活灵活现的花样进群提示！`;

    const consortFormatRule = `\n【群聊命名、@艾特与人设死命令】：\n1. 后宫妃嫔 sender 必须写为「真名（位分）」格式！萧承稷发言时（非女皇反串主题下）必自称“朕”或“我”，禁称“孤”！严禁AI代替 ${uName} 发言！\n2. 群成员之间互相接话或怼人时，可在 text 中自然使用「@某人 」。\n3. ${focusRule}\n4. ${fancyJoinRule}`;

    return { name: preset.name, isIfMode, isUserCentric, block: `【当前太微群聊主题模式：${preset.name}】\n主题要求：${desc}\n${consortFormatRule}` };
  }

  function renderAtPickerBar() {
    const bar = targetDoc.getElementById("twAtPickerBar"), chipsBox = targetDoc.getElementById("twAtPickerChips");
    if (!bar || !chipsBox) return;
    if (!state.showAtPicker) {
      bar.classList.remove("active");
      return;
    }
    const kw = (state.atFilterKeyword || "").trim().toLowerCase();
    const allCandidates = ["全体成员", ...state.dmNpcOptions.map(x => x.name)];
    const filtered = kw ? allCandidates.filter(n => n.toLowerCase().includes(kw)) : allCandidates;
    if (!filtered.length) {
      bar.classList.remove("active");
      return;
    }
    bar.classList.add("active");
    chipsBox.innerHTML = filtered.map(n => `<span class="tw-chip" data-at-name="${n}">@${n}</span>`).join("");
  }

  function insertAtMentionIntoChatInput(targetName) {
    const inp = targetDoc.getElementById("twChatroomInput");
    if (!inp || !targetName) return;
    const val = inp.value;
    if (/(?:^|\s)@([^\s@]*)$/.test(val)) {
      inp.value = val.replace(/(?:^|\s)@([^\s@]*)$/, (match) => {
        const prefixSpace = match.startsWith(" ") ? " " : "";
        return `${prefixSpace}@${targetName} `;
      });
    } else {
      const mentionStr = `@${targetName} `;
      if (!val.includes(mentionStr)) {
        inp.value = val ? `${val.trimEnd()} ${mentionStr}` : mentionStr;
      }
    }
    state.showAtPicker = false;
    state.atFilterKeyword = "";
    renderAtPickerBar();
    inp.focus();
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
      if (inp) inp.placeholder = `单独回复 @${state.chatQuoteTarget.sender}（点发送仅发消息，点右侧按钮触发群友回复）……`;
    } else {
      bar.classList.remove("active"); txt.innerHTML = "";
      if (inp) inp.placeholder = "输入 @ 选人艾特，点「发送」仅发消息，点右侧按钮触发群友回复……";
    }
  }

  function renderChatroom() {
    updateGroupThemeUI();
    renderAtPickerBar();
    const box = targetDoc.getElementById("twChatroomBox");
    if (!box) return;
    targetDoc.getElementById("twChatroomRoleBadge").textContent = config.groupChatTheme === "user_empress_harem" ? `女皇陛下·${state.userName}` : getUserFullTag();
    const list = Array.isArray(state.groupMessages) ? state.groupMessages : [];
    if (!list.length && !state.chatroomTyping) {
      box.innerHTML = `<div class="tw-empty-hint" style="margin:auto;">当前群聊默认空白。<br>点「发送」发出消息，点右侧按钮让群友回复，或点右上角「刷新群聊」！</div>`;
      updateChatQuoteBar();
      return;
    }
    const htmlItems = list.map((m, idx) => {
      if (m.type === "recall") {
        const isSelfRecall = Boolean(m.selfRecall || m.recallBy === state.userName);
        const delBtn = isSelfRecall ? `<button type="button" class="tw-del-btn" data-chat-del-idx="${idx}">删除</button>` : "";
        const peekBtn = (!isSelfRecall && m.originalText)
          ? `<button type="button" class="tw-peek-recall-btn" data-chat-peek-idx="${idx}">${m.showRecalled ? "收起" : "点击查看撤回内容"}</button>`
          : "";
        const revealBox = (!isSelfRecall && m.originalText && m.showRecalled)
          ? `<div class="tw-recalled-reveal-box">${enforceAddressingRules(m.originalText)}</div>`
          : "";
        return `<div class="tw-chat-sys-tip"><div class="tw-chat-sys-line"><span>— ${enforceAddressingRules(m.text)} —</span>${peekBtn}${delBtn}</div>${revealBox}</div>`;
      }
      if (m.type === "join" || m.type === "system") {
        return `<div class="tw-chat-sys-tip"><div class="tw-chat-sys-line"><span>— ${enforceAddressingRules(m.text)} —</span></div></div>`;
      }
      const stdSender = formatConsortStandardName(m.sender);
      const quoteHtml = m.quote ? `<div class="tw-chat-quoted-block">「${formatConsortStandardName(m.quote.sender)}：${m.quote.text}」</div>` : "";
      const actionBtns = m.self
        ? `<button type="button" class="tw-chat-quote-btn" data-chat-recall-idx="${idx}">撤回</button><button type="button" class="tw-del-btn" data-chat-del-idx="${idx}">删除</button>`
        : `<button type="button" class="tw-chat-quote-btn" data-chat-quote-idx="${idx}">引用</button>`;
      return `<div class="tw-chat-msg ${m.self ? "self" : ""}"><div class="tw-chat-head-row"><span class="tw-chat-sender">${stdSender}</span>${actionBtns}</div><div class="tw-chat-bubble">${quoteHtml}<div>${highlightMentionsHtml(m.text)}</div></div></div>`;
    });
    if (state.chatroomTyping) {
      htmlItems.push(`<div class="tw-typing-row">💬 群友们正在输入中……</div>`);
    }
    box.innerHTML = htmlItems.join("");
    box.scrollTop = box.scrollHeight;
    updateChatQuoteBar();
  }

  async function appendChatMessagesWithDelay(msgList) {
    let lastSender = "", lastText = "", realMsgCount = 0;
    const filteredList = (msgList || []).filter(r => !r || !r.sender || !isNpcMatchingUser(r.sender));
    for (let i = 0; i < filteredList.length; i++) {
      const r = filteredList[i];
      if (!r) continue;
      const isSys = r.type === "join" || r.type === "system" || r.sender === "系统" || r.sender === "system";
      await new Promise(res => setTimeout(res, i === 0 ? 300 : 500));
      if (isSys) {
        const joinTxt = upgradePlainJoinTipToFancy(r.text || `${r.sender || "霍惊弦"} 进入了聊天室`);
        if (joinTxt) { state.groupMessages.push({ type: "join", text: joinTxt }); saveCurrentChatSessionData(false); renderChatroom(); }
      } else if (r.sender && r.text) {
        lastSender = formatConsortStandardName(enforceAddressingRules(r.sender));
        lastText = cleanPureText(r.text);
        realMsgCount++;
        const msgObj = {
          sender: lastSender, text: lastText,
          quote: r.quote && r.quote.sender ? { sender: formatConsortStandardName(enforceAddressingRules(r.quote.sender)), text: cleanPureText(r.quote.text) } : null,
          self: false
        };
        state.groupMessages.push(msgObj);
        saveCurrentChatSessionData(false);
        renderChatroom();
        if (r.recall === true) {
          await new Promise(res => setTimeout(res, 1100));
          const idx = state.groupMessages.indexOf(msgObj);
          if (idx !== -1) {
            state.groupMessages[idx] = { type: "recall", selfRecall: false, recallBy: lastSender, originalText: lastText, showRecalled: false, text: `${lastSender} 撤回了一条消息` };
            saveCurrentChatSessionData(false);
            renderChatroom();
          }
        }
      }
    }
    if (realMsgCount > 0) addAppBadgeCount("chat", realMsgCount);
    if (lastSender && lastText) showWechatNotification(`太微群聊（+${realMsgCount}条）`, `${lastSender}：${lastText}`, { app: "chat", chatTab: "chatroom" });
  }

  function getEmptyHintText(modName) {
    if (state.refreshingModules && state.refreshingModules[modName]) return "刷新中…";
    if (modName && isAutoModuleOn(modName)) return "目前空白，若未自动刷新请点击手动刷新。";
    return "目前空白，请点击手动刷新。";
  }

  function renderWorldLists() {
    const emptyWorldTxt = getEmptyHintText("world");
    const locHint = targetDoc.getElementById("twMapCurrentLocHint");
    if (locHint) locHint.textContent = `📍 当前所在方位：${state.location !== "未同步" ? state.location : "太微宫 · 甘露殿"}`;
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
      previewEl.textContent = (isForumUsingAlias() ? `${author}（匿名马甲）` : `${author}（本名）`) + ` · 【${curStyleName}】`;
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
    if (!state.storyPlans.length) { planBox.innerHTML = `<div class="tw-empty-hint">${getEmptyHintText("actions")}</div>`; }
    else {
      planBox.innerHTML = state.storyPlans.slice(0, 6).map((a, i) => `
        <div class="tw-act-card" data-plan-idx="${i}">
          <div class="tw-act-top"><span class="tw-act-title">${a.tag ? `<span class="tw-badge">${enforceAddressingRules(a.tag)}</span>` : ""}${i + 1}. ${enforceAddressingRules(a.title)}</span><span class="tw-send-hint">点击导入</span></div>
          <div style="font-size:11.5px;line-height:1.55;">${enforceAddressingRules(a.desc)}</div>
        </div>`).join("");
    }
  }

  function renderAll() {
    state.userName = detectCurrentUserName();
    const aff = Number(state.affection) || 0;

    // 同步桌面顶部状态栏与首页唯一状态卡片
    const topShichen = targetDoc.getElementById("twPhoneTopShichen");
    if (topShichen) topShichen.textContent = state.time !== "未同步" ? state.time : "大景延昭 · 太微宫";
    const homeTime = targetDoc.getElementById("twHomeTimeTxt");
    if (homeTime) homeTime.textContent = state.time !== "未同步" ? state.time : "延昭二年 · 待同步";
    const homeLoc = targetDoc.getElementById("twHomeLocTxt");
    if (homeLoc) homeLoc.textContent = `📍 ${state.location !== "未同步" ? state.location : "太微宫"}`;
    const homeUser = targetDoc.getElementById("twHomeUserTxt");
    if (homeUser) homeUser.textContent = getUserFullTag();
    const homeAff = targetDoc.getElementById("twHomeAffTxt");
    if (homeAff) homeAff.textContent = `${state.hasAffection ? state.affection : "--"} / 100（${state.stage !== "未同步" ? state.stage : "待同步"}）`;
    const affBar = targetDoc.getElementById("twAffBar");
    if (affBar) affBar.style.width = `${state.hasAffection ? Math.max(0, Math.min(100, aff)) : 0}%`;
    const moodBadge = targetDoc.getElementById("twHomeMoodBadge");
    if (moodBadge) moodBadge.textContent = state.mood !== "未同步" ? state.mood : "待同步";
    const poseTxt = targetDoc.getElementById("twHomePoseTxt");
    if (poseTxt) poseTxt.textContent = (state.clothes !== "未同步" || state.pose !== "未同步") ? `（${state.clothes} · ${state.pose}）` : "";
    const thoughtTxt = targetDoc.getElementById("twHomeThoughtTxt");
    if (thoughtTxt) thoughtTxt.textContent = state.innerThought ? `“${enforceAddressingRules(state.innerThought)}”` : "“暂未同步圣人心声，可点击右上角刷新状态。”";

    const plotBox = targetDoc.getElementById("twPlotSummaryList");
    if (plotBox) {
      if (!state.plotSummary.length) plotBox.innerHTML = `<div class="tw-empty-hint">${getEmptyHintText("plot")}</div>`;
      else {
        plotBox.innerHTML = `<div class="tw-timeline">` + state.plotSummary.map((item, idx) => `
          <div class="tw-tl-item">
            <div class="tw-tl-meta"><span class="tw-badge">第 ${idx + 1} 幕</span><span class="tw-tl-time">${enforceAddressingRules(item.time || state.time || "延昭二年")}</span><span class="tw-tl-loc">${enforceAddressingRules(item.location || state.location || "太微宫")}</span></div>
            <div class="tw-tl-summary">${ensureUserNameInSummary(item.summary || item.event || "")}</div>
          </div>`).join("") + `</div>`;
      }
    }

    renderPhoneHomeGrid();
    renderEmperorSpySection();
    renderWorldLists();
    renderTheaterFancyView();
    updateForumNicknameUI();
    renderForum(targetDoc.getElementById("twSearch").value);
    renderActions();
    renderDmSection();
    renderChatroom();
    renderLetterSection();
    renderTacitSection();
    syncAutoSwitchSettingsUI();
    renderApiLogs();
  }

  function renderForum(kw = "") {
    const box = targetDoc.getElementById("twForumList");
    if (!state.posts.length) { box.innerHTML = `<div class="tw-box"><div class="tw-empty-hint">${getEmptyHintText("forum")}</div></div>`; return; }
    const key = kw.trim().toLowerCase();
    const list = state.posts.filter(p => `${p.author}${p.title}${p.content}`.toLowerCase().includes(key));
    const curAuthor = getForumUserAuthor();
    box.innerHTML = list.map((p, pIdx) => {
      const postAuthor = p.isSelfUser ? curAuthor : pickForumNick(p, pIdx);
      const targetNpc = state.replyTargets[p.id] || "";
      const delPostBtn = p.isSelfUser ? `<button type="button" class="tw-del-btn" data-act="del-post" data-id="${p.id}">删除帖子</button>` : "";
      return `
        <div class="tw-box">
          <div class="tw-post-meta"><span>发帖：<b>${postAuthor}</b></span><div style="display:flex;gap:6px;align-items:center;">${delPostBtn}<span>${p.time || "刚刚"}</span></div></div>
          <div class="tw-post-tit">${enforceAddressingRules(p.title, true)}</div>
          <p class="tw-post-txt">${enforceAddressingRules(p.content, true)}</p>
          <div class="tw-post-foot">
            <div>${(p.tags || []).map(t => `<span class="tw-badge">${enforceAddressingRules(t, true)}</span>`).join("")}</div>
            <div><button type="button" class="tw-act-btn ${p.liked ? "liked" : ""}" data-act="like" data-id="${p.id}">赞 ${p.likes}</button><span>评论 ${p.comments.length}</span></div>
          </div>
          <div class="tw-cmt-box">
            ${p.comments.map((c, cIdx) => {
              const cNick = c.isSelfUser ? curAuthor : pickForumNick(c, pIdx * 5 + cIdx + 1);
              const delCmtBtn = c.isSelfUser ? `<button type="button" class="tw-del-btn" data-act="del-cmt" data-id="${p.id}" data-cidx="${cIdx}">删除</button>` : "";
              return `<div class="tw-cmt-line"><div><span class="tw-cmt-u">[${cIdx + 1}L] ${cNick}：</span><span>${pickForumText(c)}</span></div><div style="display:flex;gap:4px;align-items:center;">${delCmtBtn}<button type="button" class="tw-reply-npc-btn" data-act="set-target" data-id="${p.id}" data-npc="${cNick}">回复TA</button></div></div>`;
            }).join("")}
            <div class="tw-reply-target-bar ${targetNpc ? "active" : ""}">
              <span>正在单独回复：<b>@${targetNpc}</b></span>
              <button type="button" class="tw-act-btn" data-act="clear-target" data-id="${p.id}" style="color:var(--accent);font-weight:bold;">直接回主帖</button>
            </div>
            <div class="tw-cmt-send">
              <input id="tw-cin-${p.id}" placeholder="${targetNpc ? `以 ${curAuthor} 回复 @${targetNpc}…` : `以 ${curAuthor} 直接评论主帖…`}">
              <button type="button" data-act="reply" data-id="${p.id}">${targetNpc ? "回复TA" : "回帖"}</button>
            </div>
          </div>
        </div>`;
    }).join("");
  }

  targetDoc.getElementById("twBtnClose").addEventListener("click", () => setModalOpenState(false));
  overlay.addEventListener("click", (e) => { if (e.target === overlay) setModalOpenState(false); });

  targetDoc.getElementById("twBtnClearAll").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    targetDoc.getElementById("twClearConfirmModal")?.classList.add("show");
  });

  targetDoc.getElementById("twCancelClearArchiveBtn")?.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    targetDoc.getElementById("twClearConfirmModal")?.classList.remove("show");
  });

  targetDoc.getElementById("twConfirmClearArchiveBtn")?.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    targetDoc.getElementById("twClearConfirmModal")?.classList.remove("show");
    targetWin.__twIsManuallyCleared = true;
    const vk = getActiveVaultKey(), v36k = vk.replace("v37", "v36"), v35k = vk.replace("v37", "v35");
    explicitClearCurrentArchive();
    try {
      localStorage.removeItem(SOLO_ARCHIVE_PREFIX + vk);
      localStorage.removeItem(LOCAL_BACKUP_PREFIX + vk);
      localStorage.removeItem("tw_palace_solo_archive_v36_" + v36k);
      localStorage.removeItem("tw_palace_solo_archive_v35_" + v35k);
      localStorage.removeItem(vk);
    } catch (err) {}
    renderAll();
    showModuleSuccessToast("本档已彻底清空");
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
    showModuleSuccessToast("已恢复默认本名");
  });
  targetDoc.getElementById("twForumNickInput").addEventListener("input", (e) => { config.forumNickname = e.target.value.trim(); saveConfig(); updateForumNicknameUI(); });
  targetDoc.getElementById("twForumStyleChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".tw-chip[data-fstyle]"); if (!chip) return;
    config.forumSpeakStyle = chip.dataset.fstyle || "lively"; saveConfig(); updateForumNicknameUI();
  });
  targetDoc.getElementById("twForumCustomStyleInput").addEventListener("input", (e) => { config.forumCustomStyleText = e.target.value.trim(); saveConfig(); });

  targetDoc.getElementById("twGroupThemeChips")?.addEventListener("click", (e) => {
    const chip = e.target.closest(".tw-chip[data-gtheme]"); if (!chip) return;
    config.groupChatTheme = chip.dataset.gtheme || "story_sync";
    saveConfig(); updateGroupThemeUI();
    chip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    renderChatroom();
  });
  targetDoc.getElementById("twGroupCustomThemeInput")?.addEventListener("input", (e) => { config.groupChatCustomThemeText = e.target.value.trim(); saveConfig(); });

  targetDoc.getElementById("twAtPickerChips")?.addEventListener("click", (e) => {
    const chip = e.target.closest(".tw-chip[data-at-name]");
    if (!chip) return;
    insertAtMentionIntoChatInput(chip.dataset.atName);
  });

  targetDoc.getElementById("twChatroomInput")?.addEventListener("input", (e) => {
    const val = e.target.value || "";
    const m = val.match(/(?:^|\s)@([^\s@]*)$/);
    if (m) {
      state.showAtPicker = true;
      state.atFilterKeyword = m[1] || "";
    } else {
      state.showAtPicker = false;
      state.atFilterKeyword = "";
    }
    renderAtPickerBar();
  });

  targetDoc.getElementById("twDmNpcSelect")?.addEventListener("change", (e) => {
    state.dmActiveNpc = e.target.value || "萧承稷"; state.dmQuoteTarget = null; saveCurrentChatSessionData(false); renderDmSection();
  });
  targetDoc.getElementById("twDmRefreshRosterBtn")?.addEventListener("click", refreshDmRosterFromPlotAndWorldbook);

  targetDoc.getElementById("twDmBox")?.addEventListener("click", (e) => {
    const npcId = state.dmActiveNpc || "萧承稷", list = state.dmHistories[npcId] || [];
    const qBtn = e.target.closest("button[data-dm-quote-idx]");
    if (qBtn) {
      const targetMsg = list[Number(qBtn.dataset.dmQuoteIdx)];
      if (targetMsg && !targetMsg.type) { state.dmQuoteTarget = { sender: targetMsg.sender, text: targetMsg.text }; updateDmQuoteBar(); targetDoc.getElementById("twDmInput")?.focus(); }
      return;
    }
    const pBtn = e.target.closest("button[data-dm-peek-idx]");
    if (pBtn) {
      const idx = Number(pBtn.dataset.dmPeekIdx), targetMsg = list[idx];
      if (targetMsg && targetMsg.type === "recall") {
        targetMsg.showRecalled = !targetMsg.showRecalled;
        saveCurrentChatSessionData(false); renderDmSection();
      }
      return;
    }
    const rBtn = e.target.closest("button[data-dm-recall-idx]");
    if (rBtn) {
      const idx = Number(rBtn.dataset.dmRecallIdx), targetMsg = list[idx];
      if (targetMsg && !targetMsg.type && targetMsg.self) {
        list[idx] = { type: "recall", selfRecall: true, recallBy: state.userName, originalText: targetMsg.text, text: `${state.userName} 撤回了一条消息` };
        saveCurrentChatSessionData(false); renderDmSection();
      }
      return;
    }
    const dBtn = e.target.closest("button[data-dm-del-idx]");
    if (dBtn) {
      const idx = Number(dBtn.dataset.dmDelIdx), targetMsg = list[idx];
      if (targetMsg && (targetMsg.self || targetMsg.selfRecall)) {
        list.splice(idx, 1); saveCurrentChatSessionData(false); renderDmSection();
      }
    }
  });

  targetDoc.getElementById("twCancelDmQuoteBtn")?.addEventListener("click", () => { state.dmQuoteTarget = null; updateDmQuoteBar(); });
  targetDoc.getElementById("twDmSendBtn")?.addEventListener("click", () => {
    const inp = targetDoc.getElementById("twDmInput"), v = inp ? inp.value.trim() : ""; if (!v) return;
    inp.value = ""; appendDmUserMessageOnly(v);
  });
  targetDoc.getElementById("twDmWaitAiBtn")?.addEventListener("click", triggerDmAiReply);
  targetDoc.getElementById("twDmInput")?.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); targetDoc.getElementById("twDmSendBtn")?.click(); } });
  targetDoc.getElementById("twDmSyncStoryBtn")?.addEventListener("click", syncDmWithCurrentStory);
  targetDoc.getElementById("twDmExportOfflineBtn")?.addEventListener("click", convertDmToOfflineSceneAndFill);
  targetDoc.getElementById("twDmClearBtn")?.addEventListener("click", () => {
    const npcId = state.dmActiveNpc || "萧承稷"; state.dmHistories[npcId] = []; state.dmQuoteTarget = null;
    saveCurrentChatSessionData(false); renderDmSection(); showModuleSuccessToast(`已清空与 ${npcId} 的传音记录`);
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
    applyCustomWallpaperToUI();
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
    const pid = targetDoc.getElementById("twSavedApiPresetSelect")?.value, tip = targetDoc.getElementById("twApiTestResult");
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
    const tip = targetDoc.getElementById("twApiTestResult"); tip.classList.add("show"); tip.textContent = "测试中…";
    try {
      const r = await callAI("请用一句话以大景内侍口吻向陛下请安，自称奴婢。", "API连接测试");
      tip.textContent = `连接成功：“${cleanPureText(r).slice(0, 35)}”`;
    } catch (e) { tip.textContent = `连接失败：${e.message}`; }
  });

  targetDoc.getElementById("twSaveConfigBtn").addEventListener("click", () => {
    const tip = targetDoc.getElementById("twApiTestResult"); tip.classList.add("show");
    config.chatMemoryCount = Math.max(4, Math.min(60, Number(targetDoc.getElementById("twChatMemoryCountInput")?.value) || 20));
    config.plotWordLimit = Math.max(15, Math.min(300, Number(targetDoc.getElementById("twPlotWordLimitInput").value) || DEFAULT_PLOT_WORD_LIMIT));
    config.plotCustomPrompt = targetDoc.getElementById("twPlotCustomPromptInput").value.trim() || DEFAULT_PLOT_CUSTOM_PROMPT;

    if (config.apiMode === "custom") {
      const rawName = targetDoc.getElementById("twApiNameInput").value.trim();
      const urlVal = targetDoc.getElementById("twApiUrlInput").value.trim();
      const keyVal = targetDoc.getElementById("twApiKeyInput").value.trim();
      const modelVal = targetDoc.getElementById("twApiModelInput").value.trim() || "gpt-4o-mini";
      const defaultIdx = (config.savedApiPresets?.length || 0) + 1;
      const finalName = rawName || `自定义API-${defaultIdx}·${modelVal}`;
      config.apiName = finalName; config.apiUrl = urlVal; config.apiKey = keyVal; config.apiModel = modelVal;

      if (urlVal && keyVal) {
        const existingIdx = (config.savedApiPresets || []).findIndex(p => p.id === config.activePresetId || p.name === finalName);
        if (existingIdx >= 0) {
          config.savedApiPresets[existingIdx] = { id: config.savedApiPresets[existingIdx].id, name: finalName, url: urlVal, key: keyVal, model: modelVal };
          config.activePresetId = config.savedApiPresets[existingIdx].id;
        } else {
          const newId = "preset_" + Date.now();
          config.savedApiPresets.push({ id: newId, name: finalName, url: urlVal, key: keyVal, model: modelVal });
          config.activePresetId = newId;
        }
      }
      saveConfig(); syncSettingsUI();
      tip.textContent = `已保存并启用其他 API 配置：「${finalName}」！`;
    } else {
      saveConfig(); syncSettingsUI();
      tip.textContent = "已保存并启用酒馆主 API！";
    }
    setTimeout(() => tip.classList.remove("show"), 2200);
  });

  targetDoc.getElementById("twBtnApiSync").addEventListener("click", syncAllWithAI);
  targetDoc.getElementById("twHomeRefreshStatusBtn")?.addEventListener("click", refreshStatusOnly);
  targetDoc.getElementById("twRefreshEmperorSpyBtn")?.addEventListener("click", refreshEmperorSpyOnly);
  targetDoc.getElementById("twAppendLatestPlotBtn").addEventListener("click", () => autoGenerateCorePlotData(false, { doStatus: false, doPlot: true }));
  targetDoc.getElementById("twRebuildFullPlotBtn").addEventListener("click", () => rebuildFullLongTimeline(false));
  targetDoc.getElementById("twRefreshActionsBtn").addEventListener("click", generateStoryPlansOnly);
  targetDoc.getElementById("twRefreshWorldBtn").addEventListener("click", (e) => refreshWorldOnly(e, false));
  targetDoc.getElementById("twRefreshForumBtn").addEventListener("click", (e) => refreshForumOnly(e, false));

  rootEl.querySelectorAll("#twStoryPlanChips .tw-chip").forEach(c => c.addEventListener("click", () => {
    targetDoc.getElementById("twStoryCustomIdea").value = c.dataset.idea || "";
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
        curMemorialIdx = 0; renderCurrentMemorial();
        addAppBadgeCount("memorial", 1);
        showModuleSuccessToast("新奏折已呈递御案 (+1)");
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
    btn.disabled = true; btn.textContent = "批阅中…"; box.textContent = "圣人正在审阅你的朱批…";
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
    if (qBtn) {
      const idx = Number(qBtn.dataset.chatQuoteIdx), targetMsg = state.groupMessages[idx];
      if (targetMsg && !targetMsg.type) {
        state.chatQuoteTarget = { sender: targetMsg.sender, text: targetMsg.text };
        updateChatQuoteBar();
        targetDoc.getElementById("twChatroomInput")?.focus();
      }
      return;
    }
    const pBtn = e.target.closest("button[data-chat-peek-idx]");
    if (pBtn) {
      const idx = Number(pBtn.dataset.chatPeekIdx), targetMsg = state.groupMessages[idx];
      if (targetMsg && targetMsg.type === "recall") {
        targetMsg.showRecalled = !targetMsg.showRecalled;
        saveCurrentChatSessionData(false); renderChatroom();
      }
      return;
    }
    const rBtn = e.target.closest("button[data-chat-recall-idx]");
    if (rBtn) {
      const idx = Number(rBtn.dataset.chatRecallIdx), targetMsg = state.groupMessages[idx];
      if (targetMsg && !targetMsg.type && targetMsg.self) {
        state.groupMessages[idx] = { type: "recall", selfRecall: true, recallBy: state.userName, originalText: targetMsg.text, text: `${state.userName} 撤回了一条消息` };
        saveCurrentChatSessionData(false); renderChatroom();
      }
      return;
    }
    const dBtn = e.target.closest("button[data-chat-del-idx]");
    if (dBtn) {
      const idx = Number(dBtn.dataset.chatDelIdx), targetMsg = state.groupMessages[idx];
      if (targetMsg && (targetMsg.self || targetMsg.selfRecall)) {
        state.groupMessages.splice(idx, 1);
        saveCurrentChatSessionData(false); renderChatroom();
      }
    }
  });

  targetDoc.getElementById("twCancelChatQuoteBtn").addEventListener("click", () => {
    state.chatQuoteTarget = null;
    updateChatQuoteBar();
  });

  function appendChatroomUserMessageOnly(userMsg) {
    const sender = state.userName;
    const quotedObj = state.chatQuoteTarget ? { ...state.chatQuoteTarget } : null;
    state.chatQuoteTarget = null;
    state.showAtPicker = false;
    state.atFilterKeyword = "";
    state.groupMessages.push({
      sender,
      text: enforceAddressingRules(userMsg),
      quote: quotedObj,
      self: true
    });
    saveCurrentChatSessionData(false);
    renderChatroom();
  }

  async function triggerChatroomAiReply() {
    const inp = targetDoc.getElementById("twChatroomInput");
    if (inp && inp.value.trim()) {
      appendChatroomUserMessageOnly(inp.value.trim());
      inp.value = "";
    }
    const waitBtn = targetDoc.getElementById("twChatroomWaitAiBtn");
    if (waitBtn) waitBtn.disabled = true;
    state.chatroomTyping = true;
    renderChatroom();
    try {
      const msgCount = 6;
      const memLimit = Math.max(4, Math.min(60, Number(config.chatMemoryCount) || 20));
      const historySlice = state.groupMessages.slice(-memLimit);
      const lastNonSys = [...historySlice].reverse().find(m => !m.type);
      const hasRecentUserMsg = Boolean(lastNonSys && lastNonSys.self);

      let targetDirective = "";
      if (hasRecentUserMsg && lastNonSys) {
        const mentionedList = (lastNonSys.text.match(/@([\u4e00-\u9fa5A-Za-z0-9_·（）：:]+)/g) || []).map(s => s.slice(1));
        if (lastNonSys.quote && lastNonSys.quote.sender) {
          targetDirective = `\n【🎯 重点回复指令】：${state.userName} 刚刚专门【引用回复】了「${lastNonSys.quote.sender}」说的“${lastNonSys.quote.text}”，并说：“${lastNonSys.text}”！请务必让「${lastNonSys.quote.sender}」第一个出来直接针对这句话作出回应（并在返回的 JSON 中带上 "quote": {"sender": "${state.userName}", "text": "${lastNonSys.text}"}），其他群友再顺着话头接话！`;
        } else if (mentionedList.length > 0) {
          targetDirective = `\n【🎯 重点回复指令】：${state.userName} 刚刚在群里点名艾特了【${mentionedList.join("、")}】说：“${lastNonSys.text}”！请务必让被艾特的【${mentionedList.join("、")}】优先出来直接回应 ${state.userName}！`;
        }
      }

      const hist = historySlice.map(m => {
        if (m.type === "recall") return `[系统提示：${m.text}（撤回内容为：“${m.originalText || ""}”，群成员均看到了撤回）]`;
        if (m.type === "join" || m.type === "system") return `[系统提示：${m.text}]`;
        const quotePrefix = (m.quote && m.quote.sender) ? `（引用回复 @${m.quote.sender}：“${m.quote.text}”）` : "";
        return `${m.sender}${quotePrefix}：${m.text}`;
      }).join("\n");
      const relCtx = getRelationshipAndFamiliarityContext();
      const themeInfo = getGroupThemePromptBlock(hasRecentUserMsg);

      const prompt = `《太微宫茶话群聊》最近记忆上下文：\n${hist || "（暂无对话）"}\n\n${themeInfo.block}\n${themeInfo.isIfMode ? "" : relCtx}${targetDirective}\n请模拟真实鲜活的太微宫微信群聊，让 4~6 位不同性格的 NPC 紧接上面的对话与当前主题【${themeInfo.name}】热聊起来！\n- 若刚刚 ${state.userName} 引用或 @了某人，被引用/被 @的人必须正面回应 ${state.userName}，同时群友之间也会互相 @对方 接话抬杠；若 ${state.userName} 没说话且非女主中心主题，大家就聊自己的事！\n- 中途穿插 1 条符合角色性格与动作的花样进群提示（{"type": "join", "text": "某角色 + 特色动作神态 + 进入了聊天室"}）！\n- 如果某个NPC说了失言、害羞或嘴硬的话，可随机给其中 1 条消息设置 "recall": true。严禁代替 ${state.userName} 发言！\n输出 ${msgCount} 项 JSON 数组（普通发言格式为 {"sender": "姓名（后妃带位分）", "text": "简短口语化消息（可含@某人）", "quote": {"sender": "被引用人姓名（可选）", "text": "被引用原话（可选）"}, "recall": false}）：`;
      const resp = await callAI(prompt, "太微群聊回复");
      state.chatroomTyping = false;
      renderChatroom();
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) await appendChatMessagesWithDelay(JSON.parse(m[0]));
    } catch (e) {}
    finally {
      state.chatroomTyping = false;
      renderChatroom();
      if (waitBtn) waitBtn.disabled = false;
    }
  }

  async function triggerAiNpcRandomTopic() {
    const topicBtn = targetDoc.getElementById("twRandomChatTopicBtn");
    topicBtn.disabled = true; topicBtn.textContent = "刷新中…";
    const themeInfo = getGroupThemePromptBlock(false);
    state.groupMessages = [{ type: "system", text: `当前群聊主题：【${themeInfo.name}】` }];
    state.chatQuoteTarget = null;
    state.chatroomTyping = true;
    saveCurrentChatSessionData(false);
    renderChatroom();
    try {
      const msgCount = 8;
      const relCtx = getRelationshipAndFamiliarityContext();
      const allRosterNames = state.dmNpcOptions.map(x => x.name).join("、");
      const prompt = `这里是《太微宫茶话群聊》。\n${themeInfo.block}\n${themeInfo.isIfMode ? "" : relCtx}\n当前群成员池共有：${allRosterNames}。\n请根据当前主题【${themeInfo.name}】的氛围，从上述成员池中随机挑选 5~7 位最贴合该话题的不同人物，严格围绕当前主题开启新话题斗嘴、八卦或插科打诨！\n- 群友之间自然使用 @对方 互相吐槽或接话；\n- 中途穿插 1~2 条带角色特色动作神态的花样进群提示（{"type": "join", "text": "某角色 + 特色动作神态 + 进入了聊天室"}）；\n- 可随机给某 1 条失言或嘴硬的消息设置 "recall": true。严禁代替 ${state.userName} 发言！\n总共生成 ${msgCount} 项 JSON 数组（普通发言格式：{"sender": "姓名（后妃带位分）", "text": "简短口语化消息6至26字", "recall": false}）：`;
      const resp = await callAI(prompt, `太微群聊·${themeInfo.name}`);
      state.chatroomTyping = false;
      renderChatroom();
      const m = String(resp).match(/\[[\s\S]*\]/);
      if (m) await appendChatMessagesWithDelay(JSON.parse(m[0]));
    } catch (e) {}
    finally {
      state.chatroomTyping = false;
      renderChatroom();
      topicBtn.disabled = false; topicBtn.textContent = "刷新群聊";
    }
  }

  targetDoc.getElementById("twChatroomSendBtn").addEventListener("click", () => {
    const inp = targetDoc.getElementById("twChatroomInput"), v = inp.value.trim(); if (!v) return;
    inp.value = ""; appendChatroomUserMessageOnly(v);
  });
  targetDoc.getElementById("twChatroomWaitAiBtn")?.addEventListener("click", triggerChatroomAiReply);
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
    if (act === "del-post") {
      state.posts = state.posts.filter(p => p.id !== id);
      delete state.replyTargets[id];
      saveCurrentChatSessionData(false);
      renderForum(targetDoc.getElementById("twSearch").value);
      return;
    }
    if (act === "del-cmt") {
      const cidx = Number(btn.dataset.cidx);
      if (Array.isArray(post.comments) && cidx >= 0 && cidx < post.comments.length) {
        post.comments.splice(cidx, 1);
        saveCurrentChatSessionData(false);
        renderForum(targetDoc.getElementById("twSearch").value);
      }
      return;
    }
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
    btn.disabled = true;
    out.innerHTML = `<div class="tw-empty-hint">🖌️ 翰林院词臣正在为您铺展泥金画卷撰写小剧场……</div>`;
    try {
      const { lastSceneEnding } = getFullStoryContext();
      const userPersona = getUserPersonaContext();
      const resp = await callAI(`为大景皇帝萧承稷与 ${getUserFullTag()} 写一篇 500 字左右、分 3~4 个自然段的古风番外小剧场。\n当前好感度：${state.affection}，阶段：${state.stage}。\n${state.userName}人设参考：${userPersona || "结合近期剧情"}\n当前剧情背景：${lastSceneEnding || "太微宫日常"}。\n主题：${st || "紧接当前剧情的私下互动与护短"}。\n要求：第一行可写一个简短四至八字古风剧场名（用《》包裹），随后分段写正文；直接自然称呼 ${state.userName}，萧承稷必自称“朕”或“我”（严禁自称“孤”）。`, "番外小剧场生成");
      let cleaned = cleanPureText(resp);
      let extractedTitle = st || "太微宫 · 浮生秘戏";
      const titleMatch = cleaned.match(/^《([^》]{2,18})》\s*\n+/);
      if (titleMatch) {
        extractedTitle = titleMatch[1].trim();
        cleaned = cleaned.replace(/^《[^》]{2,18}》\s*\n+/, "").trim();
      }
      state.theaterTitle = extractedTitle;
      state.theaterText = cleaned;
      renderTheaterFancyView();
      addAppBadgeCount("theater", 1);
      saveCurrentChatSessionData(false);
      showModuleSuccessToast("画卷小剧场生成完毕 (+1)");
    } catch (e) {
      out.innerHTML = `<div class="tw-empty-hint">生成失败：${e.message}</div>`;
    }
    btn.disabled = false;
  });

  targetDoc.getElementById("twClearTheaterBtn")?.addEventListener("click", () => {
    state.theaterText = "";
    state.theaterTitle = "";
    saveCurrentChatSessionData(false);
    renderTheaterFancyView();
    showModuleSuccessToast("已清空小剧场画卷");
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
  openAppPage("home");
  syncFabVisibilityWithModal();
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
})();
