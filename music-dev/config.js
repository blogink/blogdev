
window.PlayerConfig = window.PlayerConfig || {};

// ========== 音量记忆配置 ==========
PlayerConfig.volumeKey = "player_volume";
PlayerConfig.defaultVolume = 0.2;

// ========== 播放模式记忆配置 ==========
// 循环模式 (loopMode) 的 localStorage 键名和默认值
PlayerConfig.loopModeKey = "player_loop_mode";
PlayerConfig.defaultLoopMode = "loop"; // 'loop', 'single', 'none'

// 播放顺序 (playOrder) 的 localStorage 键名和默认值
PlayerConfig.playOrderKey = "player_play_order";
PlayerConfig.defaultPlayOrder = "sequential"; // 'sequential', 'random'

// ========== API 配置（分离清晰）==========
// 1. 简易模式 - API 模板选项（用于 <select id="apiBase">）
// 可调整顺序，格式：[{ value: "URL", label: "显示名称" }, ...]
PlayerConfig.apiBaseTemplate = [
  {
    value: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
    label: "官方 API"
  },
  {
    value: "https://apivc-meting.sakurink.eu.org/api?server=:server&type=:type&id=:id&r=:r",
    label: "备用 API"
  },
  {
    value: "https://music.lingxuan.top/api?server=:server&type=:type&id=:id&r=:r",
    label: "凌轩 API"
  },
  {
    value: "https://meting.sirius.cool/api?server=:server&type=:type&id=:id&r=:r",
    label: "Sirius API"
  },
  {
    value: "https://api.zsxq.com/meting?server=:server&type=:type&id=:id&r=:r",
    label: "ZSXQ API（测试）"
  }
];

// 2. 简易模式 - 默认选中的 API 模板索引（0 = 第一个）。该方法已弃用，直接从“API 模板选项”选第一个为默认值
//PlayerConfig.defaultApiBaseIndex = 0; // 默认选中“备用 API”

// 3. 完整模式 - 完整API输入框的默认填充值和默认占位文本
PlayerConfig.fullApiDefaultValue = "https://apivc-meting.sakurink.eu.org/api?server=netease&type=playlist&id=8510095321";
PlayerConfig.fullApiExample = "在此填入带实际参数的 Meting API 链接";

// 4. 简易模式 - 默认ID
PlayerConfig.defaultApiId = "8510095321";

// 5. 简易模式 - 服务器选项（可调整顺序）
PlayerConfig.defaultApiServers = [
  { value: "netease", label: "网易云" },
  { value: "tencent", label: "QQ音乐" },
  { value: "kugou", label: "酷狗" },
  { value: "kuwo", label: "酷我" }
];

// 6. 简易模式 - 类型选项（可调整顺序）
PlayerConfig.defaultApiTypes = [
  { value: "playlist", label: "歌单" },
  { value: "song", label: "单曲" },
  { value: "search", label: "搜索" }
];

// ========== 推荐歌曲配置（可选）==========
// 如果你希望启用推荐区，请取消注释并修改以下内容
// 如果完全不定义，则 player.js 将跳过推荐区渲染
PlayerConfig.recommendConfig = {
  // 默认样式（可选）
  default: {
    thumbBg: "linear-gradient(90deg, #223a52, #123a6b)",
  },
  // 按 type 匹配
  type: {
    playlist: {
      thumbBg: "linear-gradient(90deg, #3a2252, #2a126b)", // 紫调深色
    },
    song: {
      thumbBg: "linear-gradient(90deg, #22523a, #126b4a)", // 绿调深色
    },
  },
  // 自定义匹配规则（按字段 + 值）
  custom: [
    {
      field: "fullapi",
      value: "*", // 存在且非空即匹配
      style: {
        thumbBg: "linear-gradient(90deg, #522222, #6b1212)", // 红调深色（自定义API专用）
      },
    },
  ],
};

PlayerConfig.recommendItems = [
  {
    type: "playlist",
    id: "12891197901",
    server: "netease",
    api: "",
    title: "那些听过但是不知道名字的歌",
    desc: "点击解析并加载",
    thumb: "https://example.com/playlist1.jpg",
  },
  {
    type: "playlist",
    id: "7113350104",
    server: "netease",
    api: "",
    title: "Doomer｜俄罗斯后朋克&东欧冷潮",
    desc: "Doomer丧文化，俄罗斯及东欧后朋克歌曲收录",
    thumb: "https://p1.music.126.net/WNj9-4HacGLsi-oNXUxRIQ==/109951167544484290.jpg?param=200y200",
  },
  {
    type: "song",
    id: "002vwfuY2MkEiY",
    server: "tencent",
    api: "",
    title: "青空~After~ - Candy_Wind",
    desc: "【单曲】点击直接播放",
    thumb: "https://y.gtimg.cn/music/photo_new/T002R300x300M000004NtgkJ4Ib16e.jpg?max_age=2592000",
  },
  {
    type: "song",
    id: "1985462435",
    server: "netease",
    api: "",
    title: "Самые грустные песни - Перемотка",
    desc: "【单曲】点击直接播放",
    thumb: "https://p3.music.126.net/G-fDNxPtEoOHbGXcKs2mmw==/109951167918422860.jpg?param=300y300",
  },
  {
    type: "song",
    id: "2360173606",
    server: "netease",
    api: "",
    fullapi: "https://api.i-meto.com/meting/api?server=netease&type=song&id=2711834126",
    title: "莫愁乡 - 亞細亞曠世奇才",
    desc: "【自定义api测试；单曲】点击直接播放",
    thumb: "https://p3.music.126.net/DVi9B70oYVFtDxVqZf_56g==/109951171264259694.jpg?param=300y300",
  },
];