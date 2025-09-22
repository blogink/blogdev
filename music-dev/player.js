
/* ---------- DOM 元素引用 ---------- */
// 播放器控制
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const loopBtn = document.getElementById('loopBtn');
const orderBtn = document.getElementById('orderBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressSlider = document.getElementById('progressSlider');
const currentTime = document.getElementById('currentTime');
const durationTime = document.getElementById('durationTime');

// 歌曲信息显示
const albumCover = document.getElementById('albumCover');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');

// 歌词显示
const lyricsDisplay = document.getElementById('lyricsDisplay');
const lyricsPlaceholder = document.getElementById('lyricsPlaceholder');

// API控制
const easyModeBtn = document.getElementById('easyModeBtn');
const fullModeBtn = document.getElementById('fullModeBtn');
const easyModeContainer = document.getElementById('easyModeContainer');
const fullModeContainer = document.getElementById('fullModeContainer');
const apiBase = document.getElementById('apiBase');
const apiServer = document.getElementById('apiServer');
const apiType = document.getElementById('apiType');
const apiId = document.getElementById('apiId');
const fullApiInput = document.getElementById('fullApiInput');
const loadApiBtn = document.getElementById('loadApiBtn');
const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');

// 歌单显示
const playlistDisplay = document.getElementById('playlistDisplay');

// 推荐区域
const recommendContainer = document.getElementById('recommendContainer');

/* ---------- 交互面板设计 ---------- */
class controlTabs {
    constructor(element) {
        this.element = element; // 直接接收 DOM 元素
        this.navItems = this.element.querySelectorAll('.controlTab-nav li');
        this.panels = this.element.querySelectorAll('.controlTab-panel');
        this.init();
    }
    init() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => this.switchControlTab(e));
        });
    }
    switchControlTab(e) {
        const targetControlTab = e.currentTarget.getAttribute('data-controlTab');
        // 移除当前容器内所有激活状态
        this.navItems.forEach(item => item.classList.remove('active'));
        this.panels.forEach(panel => panel.classList.remove('active'));
        // 添加激活状态到当前容器内
        e.currentTarget.classList.add('active');
        document.getElementById(targetControlTab).classList.add('active');
    }
}

// 修复后的初始化：为每个 .mycontrolTabs 创建一个独立的实例
document.addEventListener('DOMContentLoaded', () => {
    // 使用 querySelectorAll 获取所有匹配的元素
    const allControlTabs = document.querySelectorAll('.mycontrolTabs');
    // 为每一个元素创建一个新的 controlTabs 实例
    allControlTabs.forEach(container => {
        new controlTabs(container);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // 创建遮罩层（如果不存在）
    let mask = document.querySelector('.slide-container-mask');
    if (!mask) {
        mask = document.createElement('div');
        mask.className = 'slide-container-mask';
        document.body.appendChild(mask);
    }

    // 绑定所有toggle按钮
    document.querySelectorAll('.slide-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const container = document.getElementById(targetId);
            
            if (container) {
                toggleContainer(container, mask);
            }
        });
    });

    // 绑定关闭按钮
    document.querySelectorAll('.slide-container .close-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const container = this.closest('.slide-container');
            closeContainer(container, mask);
        });
    });

    // 点击遮罩层关闭
    mask.addEventListener('click', function() {
        document.querySelectorAll('.slide-container.active').forEach(container => {
            closeContainer(container, mask);
        });
    });

    // 阻止点击容器内部时关闭
    document.querySelectorAll('.slide-container').forEach(container => {
        container.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
});

// 切换容器显示状态
function toggleContainer(container, mask) {
    if (container.classList.contains('active')) {
        closeContainer(container, mask);
    } else {
        // 先关闭其他已打开的容器
        document.querySelectorAll('.slide-container.active').forEach(activeContainer => {
            if (activeContainer !== container) {
                closeContainer(activeContainer, mask);
            }
        });
        
        // 打开当前容器
        container.classList.add('active');
        mask.classList.add('active');
        
        // 阻止body滚动
        document.body.style.overflow = 'hidden';
    }
}

// 关闭容器
function closeContainer(container, mask) {
    container.classList.remove('active');
    
    // 检查是否还有其他容器是激活状态
    const activeContainers = document.querySelectorAll('.slide-container.active');
    if (activeContainers.length === 0) {
        mask.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ---------- 初始化 ---------- */
// ========== 加载配置（来自 config.js）==========
if (typeof window.PlayerConfig === 'undefined') {
  console.warn("未检测到 config.js，使用默认音量配置");
  window.PlayerConfig = {
    volumeKey: "desktop_player_volume",
    defaultVolume: 0.5,
    _internalLastVolKey: "__lastVolKey",
    // ====== 新增：API 配置（分离清晰）======
    apiBaseTemplate: [
      "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
      "https://apivc-meting.sakurink.eu.org/api?server=:server&type=:type&id=:id&r=:r"
    ],
    defaultApiBaseIndex: 1, // 默认选中“备用 API”
    fullApiExample: "https://apivc-meting.sakurink.eu.org/api?server=netease&type=playlist&id=8510095321&r=:r",
    defaultApiId: "8510095321",
    defaultApiServers: [
      { value: "netease", label: "网易云" },
      { value: "tencent", label: "QQ音乐" },
      { value: "kugou", label: "酷狗" },
      { value: "kuwo", label: "酷我" }
    ],
    defaultApiTypes: [
      { value: "playlist", label: "歌单" },
      { value: "song", label: "单曲" },
      { value: "search", label: "搜索" }
    ],
    recommendConfig: null,
    recommendItems: []
  };
}

// ========== 为 loopMode 和 playOrder 设计记忆系统 ==========
// 定义常量，方便复用
const LOOP_MODE_KEY = PlayerConfig.loopModeKey;
const DEFAULT_LOOP_MODE = PlayerConfig.defaultLoopMode;
const PLAY_ORDER_KEY = PlayerConfig.playOrderKey;
const DEFAULT_PLAY_ORDER = PlayerConfig.defaultPlayOrder;

// ========== 自动清理旧键逻辑 ==========
// 获取上一次使用的 LOOP_MODE_KEY 和 PLAY_ORDER_KEY（系统内部记录）
const lastLoopModeKey = localStorage.getItem("__lastLoopModeKey");
const lastPlayOrderKey = localStorage.getItem("__lastPlayOrderKey");

// 如果当前 KEY 和上一次不同，则清理旧键
if (lastLoopModeKey && lastLoopModeKey !== LOOP_MODE_KEY) {
  console.log(`[循环模式] 检测到 LOOP_MODE_KEY 已变更："${lastLoopModeKey}" → "${LOOP_MODE_KEY}"，正在清理旧键...`);
  localStorage.removeItem(lastLoopModeKey);
}
if (lastPlayOrderKey && lastPlayOrderKey !== PLAY_ORDER_KEY) {
  console.log(`[播放顺序] 检测到 PLAY_ORDER_KEY 已变更："${lastPlayOrderKey}" → "${PLAY_ORDER_KEY}"，正在清理旧键...`);
  localStorage.removeItem(lastPlayOrderKey);
}

// 更新系统记录：当前 KEY 成为新的“上一次”
localStorage.setItem("__lastLoopModeKey", LOOP_MODE_KEY);
localStorage.setItem("__lastPlayOrderKey", PLAY_ORDER_KEY);

// ========== 应用 loopMode 和 playOrder ==========
// 优先从 localStorage 读取，如果没有则使用 PlayerConfig.defaultXxx
const savedLoopMode = localStorage.getItem(LOOP_MODE_KEY);
const finalLoopMode = (savedLoopMode && ['loop', 'single', 'none'].includes(savedLoopMode)) ? savedLoopMode : DEFAULT_LOOP_MODE;

const savedPlayOrder = localStorage.getItem(PLAY_ORDER_KEY);
const finalPlayOrder = (savedPlayOrder && ['sequential', 'random'].includes(savedPlayOrder)) ? savedPlayOrder : DEFAULT_PLAY_ORDER;

// ========== 音量系统 (保持不变，仅做微小调整以适应新结构) ==========
// 确保 _internalLastVolKey 存在
PlayerConfig._internalLastVolKey = "__lastVolKey";
const VOL_KEY = PlayerConfig.volumeKey;
const DEFAULT_VOLUME = PlayerConfig.defaultVolume;
const INTERNAL_LAST_VOL_KEY = PlayerConfig._internalLastVolKey;

// ========== 自动清理旧音量键逻辑 ==========
const lastVolKey = localStorage.getItem(INTERNAL_LAST_VOL_KEY);
if (lastVolKey && lastVolKey !== VOL_KEY) {
  console.log(`[音量系统] 检测到 VOL_KEY 已变更："${lastVolKey}" → "${VOL_KEY}"，正在清理旧键...`);
  localStorage.removeItem(lastVolKey);
  showNotice("音量设置已重置，请重新调整");
}
localStorage.setItem(INTERNAL_LAST_VOL_KEY, VOL_KEY);

const savedVolume = parseFloat(localStorage.getItem(VOL_KEY));
const finalVolume = (savedVolume !== null && !isNaN(savedVolume)) ? savedVolume : DEFAULT_VOLUME;
volumeSlider.value = finalVolume;
audioPlayer.volume = finalVolume;
updateVolumePercent(finalVolume * 100);

// ========== 核心状态初始化 ==========
// 现在 state 的初始值完全由 PlayerConfig 决定
const state = {
  tracks: [],
  currentIndex: 0,
  isPlaying: false,
  isDragging: false,
  currentLyrics: [],
  isLoading: false,
  isBusy: false,
  loopMode: finalLoopMode, // 使用从 config 或 localStorage 读取的值
  playOrder: finalPlayOrder // 使用从 config 或 localStorage 读取的值
};
// ========== 设置默认API输入框值和动态生成下拉菜单 ==========
if (typeof PlayerConfig !== 'undefined') {
  // --- 1. 动态生成 apiBase 下拉菜单 ---
  if (apiBase && Array.isArray(PlayerConfig.apiBaseTemplate)) {
    apiBase.innerHTML = '';
    PlayerConfig.apiBaseTemplate.forEach((item, index) => { // 注意：这里是 item
      const option = document.createElement('option');
      option.value = item.value; // 使用 item.value
      const label = item.label;  // 使用 item.label
      option.textContent = label;
      apiBase.appendChild(option);
    });
    /*const defaultIndex = PlayerConfig.defaultApiBaseIndex || 0;
    if (defaultIndex >= 0 && defaultIndex < PlayerConfig.apiBaseTemplate.length) {
      apiBase.value = PlayerConfig.apiBaseTemplate[defaultIndex].value; // 使用 .value
    } else {
      apiBase.value = PlayerConfig.apiBaseTemplate[0].value;
    }*/
    apiBase.value = PlayerConfig.apiBaseTemplate[0].value;
  }

  // --- 2. 设置 fullApiInput 的默认占位文本（提示语）---
  if (fullApiInput) {
    fullApiInput.placeholder = PlayerConfig.fullApiExample || '';
  }

  // --- 新增：设置 fullApiInput 的默认填充值（可选）---
  if (fullApiInput && PlayerConfig.fullApiDefaultValue) {
    fullApiInput.value = PlayerConfig.fullApiDefaultValue;
  }

  // --- 3. 动态生成 apiServer 下拉菜单 ---
  if (apiServer && Array.isArray(PlayerConfig.defaultApiServers)) {
    apiServer.innerHTML = '';
    PlayerConfig.defaultApiServers.forEach(server => {
      const option = document.createElement('option');
      option.value = server.value;
      option.textContent = server.label;
      apiServer.appendChild(option);
    });
    apiServer.value = PlayerConfig.defaultApiServers[0].value;
  }

  // --- 4. 动态生成 apiType 下拉菜单 ---
  if (apiType && Array.isArray(PlayerConfig.defaultApiTypes)) {
    apiType.innerHTML = '';
    PlayerConfig.defaultApiTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.value;
      option.textContent = type.label;
      apiType.appendChild(option);
    });
    apiType.value = PlayerConfig.defaultApiTypes[0].value;
  }

  // --- 5. 设置 apiId 默认值 ---
  if (apiId) {
    apiId.value = PlayerConfig.defaultApiId || '';
  }

  // --- 6. 切换到 easy mode 作为默认状态 ---
  if (easyModeBtn && fullModeBtn) {
    easyModeBtn.classList.add('active');
    fullModeBtn.classList.remove('active');
    easyModeContainer.style.display = 'flex';
    fullModeContainer.style.display = 'none';
  }
}
// ========== 新增：图标渲染函数 ==========
function updateLoopIcon() {
  const modes = ["loop", "single", "none"];
  const labels = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-repeat" viewBox="0 0 16 16"><path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-repeat-1" viewBox="0 0 16 16"><path d="M11 4v1.466a.25.25 0 0 0 .41.192l2.36-1.966a.25.25 0 0 0 0-.384l-2.36-1.966a.25.25 0 0 0-.41.192V3H5a5 5 0 0 0-4.48 7.223.5.5 0 0 0 .896-.446A4 4 0 0 1 5 4zm4.48 1.777a.5.5 0 0 0-.896.446A4 4 0 0 1 11 12H5.001v-1.466a.25.25 0 0 0-.41-.192l-2.36 1.966a.25.25 0 0 0 0 .384l2.36 1.966a.25.25 0 0 0 .41-.192V13h6a5 5 0 0 0 4.48-7.223Z"/><path d="M9 5.5a.5.5 0 0 0-.854-.354l-1.75 1.75a.5.5 0 1 0 .708.708L8 6.707V10.5a.5.5 0 0 0 1 0z"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-slash-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708"/></svg>'
  ];
  const currentIndex = modes.indexOf(state.loopMode);
  loopBtn.innerHTML = labels[currentIndex];
}

function updateOrderIcon() {
  const orders = ["sequential", "random"];
  const labels = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shuffle" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/><path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"/></svg>'
  ];
  const currentIndex = orders.indexOf(state.playOrder);
  orderBtn.innerHTML = labels[currentIndex];
}

// ========== 更新：初始化按钮图标 ==========
// 在设置 state 之后立即调用，确保UI与状态同步
updateLoopIcon();
updateOrderIcon();

/* ---------- 事件监听器 ---------- */
// 模式切换
easyModeBtn.addEventListener('click', () => {
  easyModeBtn.classList.add('active');
  fullModeBtn.classList.remove('active');
  easyModeContainer.style.display = 'flex';
  fullModeContainer.style.display = 'none';
});

fullModeBtn.addEventListener('click', () => {
  fullModeBtn.classList.add('active');
  easyModeBtn.classList.remove('active');
  fullModeContainer.style.display = 'flex';
  easyModeContainer.style.display = 'none';
});

// 音量控制
volumeSlider.addEventListener('input', (e) => {
  audioPlayer.volume = parseFloat(e.target.value);
  localStorage.setItem(VOL_KEY, audioPlayer.volume);
});

// 播放/暂停
playBtn.addEventListener('click', async () => {
  if (state.tracks.length === 0) {
    showNotice('请先加载歌单');
    return;
  }
  
  if (state.isBusy) return;
  
  try {
    if (audioPlayer.paused) {
      await audioPlayer.play();
      state.isPlaying = true;
      playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause" viewBox="0 0 16 16"><path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/></svg>';
    } else {
      audioPlayer.pause();
      state.isPlaying = false;
      playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></svg>';
    }
  } catch (e) {
    console.warn('播放/暂停出错：', e);
    showNotice('播放失败，请尝试下一首');
  }
});

// 上一首/下一首
prevBtn.addEventListener('click', () => playPrevious());
nextBtn.addEventListener('click', () => playNext());

// 循环模式
loopBtn.addEventListener('click', () => {
  const modes = ['loop', 'single', 'none'];
  const labels = ['<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-repeat" viewBox="0 0 16 16"><path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/></svg>', 
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-repeat-1" viewBox="0 0 16 16"><path d="M11 4v1.466a.25.25 0 0 0 .41.192l2.36-1.966a.25.25 0 0 0 0-.384l-2.36-1.966a.25.25 0 0 0-.41.192V3H5a5 5 0 0 0-4.48 7.223.5.5 0 0 0 .896-.446A4 4 0 0 1 5 4zm4.48 1.777a.5.5 0 0 0-.896.446A4 4 0 0 1 11 12H5.001v-1.466a.25.25 0 0 0-.41-.192l-2.36 1.966a.25.25 0 0 0 0 .384l2.36 1.966a.25.25 0 0 0 .41-.192V13h6a5 5 0 0 0 4.48-7.223Z"/><path d="M9 5.5a.5.5 0 0 0-.854-.354l-1.75 1.75a.5.5 0 1 0 .708.708L8 6.707V10.5a.5.5 0 0 0 1 0z"/></svg>', 
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-slash-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708"/></svg>'
    ];
  const currentIndex = modes.indexOf(state.loopMode);
  state.loopMode = modes[(currentIndex + 1) % modes.length]; // 更新 state
  loopBtn.innerHTML = labels[(currentIndex + 1) % modes.length]; // 更新 UI
  // ====== 新增：持久化存储 ======
  localStorage.setItem(LOOP_MODE_KEY, state.loopMode);
});

// 播放顺序
orderBtn.addEventListener('click', () => {
  const orders = ['sequential', 'random'];
  const labels = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/></svg>', 
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shuffle" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/><path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"/></svg>'
    ];
  const currentIndex = orders.indexOf(state.playOrder);
  state.playOrder = orders[(currentIndex + 1) % orders.length]; // 更新 state
  orderBtn.innerHTML = labels[(currentIndex + 1) % orders.length]; // 更新 UI
  // ====== 新增：持久化存储 ======
  localStorage.setItem(PLAY_ORDER_KEY, state.playOrder);
});

// 进度条
progressSlider.addEventListener('input', (e) => {
  state.isDragging = true;
  const percentage = parseFloat(e.target.value) / 100.0;
  const time = isFinite(audioPlayer.duration) ? audioPlayer.duration * percentage : 0;
  currentTime.textContent = formatTime(time);
  highlightLyricsAtTime(time);
});

progressSlider.addEventListener('change', (e) => {
  const percentage = parseFloat(e.target.value) / 100.0;
  const time = isFinite(audioPlayer.duration) ? audioPlayer.duration * percentage : 0;
  audioPlayer.currentTime = time;
  state.isDragging = false;
});

// 清空歌单
clearPlaylistBtn.addEventListener('click', () => {
  state.tracks = [];
  state.currentIndex = 0;
  renderPlaylist();
  resetPlayerUI();
  showNotice('歌单已清空');
});

// 加载API
loadApiBtn.addEventListener('click', () => {
  const apiUrl = buildApiUrl();
  if (apiUrl) {
    loadMetingApi(apiUrl);
  }
});

// 歌单点击事件
playlistDisplay.addEventListener('click', (e) => {
  const item = e.target.closest('.playlist-item');
  if (!item) return;
  
  const index = parseInt(item.dataset.index);
  if (isNaN(index) || index < 0 || index >= state.tracks.length) return;
  
  playTrack(index);
});


// 推荐歌曲点击事件-new
/* ---------- 推荐歌曲模块（按需加载）---------- */
// 只有当 PlayerConfig 中定义了 recommendConfig 和 recommendItems 时才初始化推荐区
if (
  window.PlayerConfig &&
  Array.isArray(PlayerConfig.recommendItems) &&
  PlayerConfig.recommendConfig
) {
  const recommendConfig = PlayerConfig.recommendConfig;
  const recommendItems = PlayerConfig.recommendItems;

  // ✅ 获取推荐项样式（轻量匹配函数）
  function getThumbStyle(item) {
    // 1. 先检查 custom 规则（优先级最高）
    if (recommendConfig.custom) {
      for (let rule of recommendConfig.custom) {
        const { field, value, style } = rule;
        if (item.hasOwnProperty(field)) {
          if (value === "*" && item[field]) {
            return style;
          } else if (item[field] === value) {
            return style;
          }
        }
      }
    }
    // 2. 再检查 type 规则
    if (recommendConfig.type && recommendConfig.type[item.type]) {
      return recommendConfig.type[item.type];
    }
    // 3. 最后返回默认
    return recommendConfig.default || {};
  }

  // ✅ 渲染函数（仅在 thumb 容器上动态加 style）
  function renderRecommendItems() {
    const container = document.getElementById("recommendContainer");
    if (!container) return;
    container.innerHTML = recommendItems
      .map((item) => {
        const style = getThumbStyle(item);
        const thumbBg =
          style.thumbBg || "linear-gradient(90deg, #223a52, #123a6b)";
        return `
        <div class="recommend-item" data-meta='${JSON.stringify(item)}' style="background: ${thumbBg}">
          <div class="recommend-thumb">
            ${
              item.thumb
                ? `<img src="${item.thumb}" alt="封面" onerror="handleThumbError(this)">`
                : `暂无图片`
            }
          </div>
          <div class="recommend-meta">
            <div class="recommend-title">${item.title}</div>
            <div class="recommend-desc">${item.desc}</div>
          </div>
          <div class="recommend-arrow">→</div>
        </div>
      `;
      })
      .join("");
  }

  // ✅ 图片加载失败处理
  function handleThumbError(img) {
    const parent = img.parentElement;
    if (!parent) return;
    parent.innerHTML = "暂无图片";
    parent.classList.add("no-thumb");
  }

  // ✅ 初始化渲染
  renderRecommendItems();

  // ✅ 点击事件（支持 fullapi 优先）
  const recommendContainer = document.getElementById("recommendContainer");
  if (recommendContainer) {
    recommendContainer.addEventListener("click", (e) => {
      const item = e.target.closest(".recommend-item");
      if (!item) return;
      try {
        const meta = JSON.parse(item.getAttribute("data-meta"));
        let apiUrl;
        if (
          meta.fullapi &&
          typeof meta.fullapi === "string" &&
          meta.fullapi.trim()
        ) {
          apiUrl =
            meta.fullapi +
            (meta.fullapi.includes("?") ? "&" : "?") +
            "r=" +
            Math.random();
        } else {
          const apiTemplate = meta.api || apiBase.value;
          apiUrl = apiTemplate
            .replace(":server", meta.server || "netease")
            .replace(":type", meta.type || "playlist")
            .replace(":id", meta.id || "")
            .replace(":r", Math.random());
        }
        loadMetingApi(apiUrl);
      } catch (err) {
        console.error("解析推荐项失败：", err);
        showNotice("解析推荐项失败");
      }
    });
  }
} else {
  // 可选：调试提示（生产环境可删除）
  console.log("[推荐系统] 未检测到 PlayerConfig.recommendConfig 或 recommendItems，推荐区已跳过。");
}
// 推荐歌曲点击事件
/*recommendContainer.addEventListener('click', (e) => {
  const item = e.target.closest('.recommend-item');
  if (!item) return;
  
  try {
    const meta = JSON.parse(item.getAttribute('data-meta'));
    //const apiTemplate = meta.api || 'https://apivc-meting.sakurink.eu.org/api?server=:server&type=:type&id=:id&r=:r';
    const apiTemplate = meta.api || apiBase.value;
    const apiUrl = apiTemplate
      .replace(':server', meta.server || 'netease')
      .replace(':type', meta.type || 'playlist')
      .replace(':id', meta.id || '')
      .replace(':r', Math.random());
    
    loadMetingApi(apiUrl);
  } catch (e) {
    console.error('解析推荐项失败：', e);
    showNotice('解析推荐项失败');
  }
});*/

// 音频事件
audioPlayer.addEventListener('timeupdate', updateTimeDisplay);
audioPlayer.addEventListener('durationchange', () => {
  durationTime.textContent = formatTime(audioPlayer.duration);
});
audioPlayer.addEventListener('play', () => {
  state.isPlaying = true;
  playBtn.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause" viewBox="0 0 16 16"><path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/></svg>';
});
audioPlayer.addEventListener('pause', () => {
  state.isPlaying = false;
  playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></svg>';
});
audioPlayer.addEventListener('ended', handleTrackEnded);
audioPlayer.addEventListener('error', (e) => {
  console.warn('音频播放错误：', e);
  showNotice('音频播放失败，请尝试下一首');
  state.isBusy = false;
});

/* ---------- API加载与解析 ---------- */
function buildApiUrl() {
  if (easyModeBtn.classList.contains('active')) {
    const base = apiBase ? apiBase.value.trim() : '';
    const server = apiServer ? apiServer.value : 'netease';
    const type = apiType ? apiType.value : 'playlist';
    const id = apiId ? apiId.value.trim() : '';

    if (!id) {
      showNotice('请填写ID');
      return null;
    }

    if (!base) {
      showNotice('API基础链接为空，请检查配置');
      return null;
    }

    return base
      .replace(':server', server)
      .replace(':type', type)
      .replace(':id', encodeURIComponent(id))
      .replace(':r', Math.random());
  } else {
    const url = fullApiInput ? fullApiInput.value.trim() : '';
    if (!url) {
      showNotice('请填写完整API链接');
      return null;
    }
    return url;
  }
}

async function loadMetingApi(url) {
  if (state.isLoading) {
    showNotice('正在加载，请稍后');
    return;
  }
  
  state.isLoading = true;
  loadApiBtn.disabled = true;
  loadApiBtn.textContent = '加载中...';
  
  try {
    let response;
    try {
      response = await fetch(url, { cache: 'no-store' });
    } catch (networkError) {
      console.error('网络请求失败：', networkError);
      showNotice('网络错误，请检查API链接');
      return;
    }
    
    if (!response.ok) {
      console.error('API返回错误：', response.status, response.statusText);
      showNotice(`API错误：${response.status}`);
      return;
    }
    
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('JSON解析失败：', parseError);
      showNotice('API返回的不是有效JSON');
      return;
    }
    
    if (!Array.isArray(data) || data.length === 0) {
      state.tracks = [];
      renderPlaylist();
      showNotice('API返回数据为空');
      return;
    }
    
    // 映射到内部曲目结构
    state.tracks = data.map(item => ({
      title: item.name || item.title || '未知标题',
      artist: item.artist || item.author || (item.artists ? item.artists.map(a => a.name).join('/') : '未知作者'),
      album: item.album || '',
      pic: item.pic || item.cover || (item.album && item.album.pic) || '',
      url: item.url || item.path || item.audio || '',
      lrc: item.lrc || item.lyric || item.lyrics || '',
      duration: item.time || item.duration || item.dt || item.playtime || 0,
      parsedLyrics: null
    }));
    
    state.currentIndex = 0;
    renderPlaylist();
    await playTrack(0);
    showNotice('歌单加载成功');
    
  } catch (error) {
    console.error('加载API失败：', error);
    showNotice('加载失败，请重试');
  } finally {
    state.isLoading = false;
    loadApiBtn.disabled = false;
    loadApiBtn.textContent = '更新歌单';
  }
}

/* ---------- 播放控制 ---------- */
async function playTrack(index) {
  if (state.isBusy || index < 0 || index >= state.tracks.length) return;
  
  state.isBusy = true;
  state.currentIndex = index;
  
  try {
    // 更新UI状态
    renderPlaylist();
    await loadTrackData(state.tracks[index]);
    await startPlayback();
  } catch (error) {
    console.warn(`播放曲目失败：`, error);
    showNotice('播放失败，自动切换到下一首');
    state.isBusy = false;
    playNext();
    return;
  }
  
  state.isBusy = false;
}

async function loadTrackData(track) {
  // --- 原有功能：更新歌曲信息 ---
  trackTitle.textContent = track.title || '未知标题';
  trackArtist.textContent = track.artist || '未知作者';

  // --- 原有功能：更新封面 ---
  if (track.pic) {
    albumCover.style.backgroundImage = `url(${track.pic})`;
    albumCover.style.backgroundSize = 'cover';
    albumCover.style.backgroundPosition = 'center';
    albumCover.textContent = '';
  } else {
    albumCover.style.backgroundImage = '';
    albumCover.textContent = '暂无图片';
  }

  // --- 原有功能：处理歌词 ---
  await loadLyrics(track);

  // --- 原有功能：设置音频源 ---
  if (!track.url) {
    throw new Error('无可用音频URL');
  }
  try {
    audioPlayer.removeAttribute('crossorigin');
  } catch (e) {
    console.warn('移除crossorigin属性失败：', e);
  }
  audioPlayer.src = track.url;
  audioPlayer.load();

  // ========== 新增：沉浸式背景切换 ==========
  // 只有在有封面图时才尝试切换背景
  if (track.pic) {
    const bgContainer = document.getElementById('dynamic-bg');
    if (bgContainer) {
      // 创建一个 Image 对象来预加载封面图
      const img = new Image();
      img.src = track.pic;

      // 图片加载成功后，再将其设置为背景
      img.onload = () => {
        bgContainer.style.backgroundImage = `url(${track.pic})`;
        bgContainer.classList.add('has-bg'); // 移除初始背景色，让图片成为唯一背景
        console.log('沉浸式背景已切换');
      };

      // 如果图片加载失败，则不进行任何操作（保持上一张或初始背景）
      img.onerror = () => {
        console.warn('背景图片加载失败，将不切换背景:', track.pic);
      };
    }
  }
  // ========== 新增功能结束 ==========
}
async function loadLyrics(track) {
  lyricsDisplay.innerHTML = '';
  lyricsPlaceholder.textContent = '加载歌词...';
  lyricsPlaceholder.style.display = 'block';
  state.currentLyrics = [];
  
  if (!track.lrc) {
    lyricsPlaceholder.textContent = '暂无歌词';
    return;
  }
  
  try {
    let lyricsText = null;
    
    // 判断是URL还是直接文本
    if (isUrl(track.lrc)) {
      try {
        const response = await fetch(track.lrc, { cache: 'no-store' });
        if (response.ok) {
          lyricsText = await response.text();
        }
      } catch (error) {
        console.warn('加载歌词文件失败：', error);
      }
    } else if (typeof track.lrc === 'string') {
      lyricsText = track.lrc;
    }
    
    if (lyricsText) {
      const parsedLyrics = parseLyrics(lyricsText);
      track.parsedLyrics = parsedLyrics;
      renderLyrics(parsedLyrics);
    } else {
      lyricsPlaceholder.textContent = '暂无歌词';
    }
  } catch (error) {
    console.warn('解析歌词失败：', error);
    lyricsPlaceholder.textContent = '歌词加载失败';
  }
}

async function startPlayback() {
  try {
    // 尝试播放，设置超时
    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
      await Promise.race([
        playPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('播放超时')), 8000))
      ]);
    }
    
    playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause" viewBox="0 0 16 16"><path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/></svg>';
    state.isPlaying = true;
  } catch (error) {
    console.warn('播放失败：', error);
    throw error;
  }
}

function playPrevious() {
  if (state.tracks.length === 0) return;
  if (state.isBusy) return;
  
  let newIndex;
  if (state.playOrder === 'random') {
    if (state.tracks.length === 1) {
      newIndex = 0;
    } else {
      do {
        newIndex = Math.floor(Math.random() * state.tracks.length);
      } while (newIndex === state.currentIndex && state.tracks.length > 1);
    }
  } else {
    newIndex = (state.currentIndex - 1 + state.tracks.length) % state.tracks.length;
  }
  
  playTrack(newIndex);
}

function playNext() {
  if (state.tracks.length === 0) return;
  if (state.isBusy) return;
  
  let newIndex;
  if (state.playOrder === 'random') {
    if (state.tracks.length === 1) {
      newIndex = 0;
    } else {
      do {
        newIndex = Math.floor(Math.random() * state.tracks.length);
      } while (newIndex === state.currentIndex && state.tracks.length > 1);
    }
  } else {
    newIndex = (state.currentIndex + 1) % state.tracks.length;
  }
  
  playTrack(newIndex);
}

function handleTrackEnded() {
  switch (state.loopMode) {
    case 'single':
      // 单曲循环
      audioPlayer.currentTime = 0;
      audioPlayer.play();
      break;
    case 'loop':
      // 列表循环
      playNext();
      break;
    case 'none':
      // 不循环
      playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></svg>';
      state.isPlaying = false;
      // 保持最后一行歌词高亮
      if (state.currentLyrics.length > 0) {
        const lastLine = state.currentLyrics[state.currentLyrics.length - 1];
        if (lastLine && lastLine.time !== null) {
          highlightLyricsAtTime(audioPlayer.duration);
        }
      }
      break;
  }
}

/* ---------- UI更新函数 ---------- */
function renderPlaylist() {
  playlistDisplay.innerHTML = '';
  
  if (state.tracks.length === 0) {
    playlistDisplay.innerHTML = '<div class="small-text">暂无歌曲，使用“更新歌单”加载</div>';
    return;
  }
  
  state.tracks.forEach((track, index) => {
    const item = document.createElement('div');
    item.className = `playlist-item${index === state.currentIndex ? ' active' : ''}`;
    item.dataset.index = index;
    
    // 格式化时长
    const duration = formatDuration(track.duration);
    
    item.innerHTML = `
      <img class="playlist-thumb" src="${track.pic || ''}" onerror="this.style.background='linear-gradient(90deg,#223a52,#123a6b)';this.src='';this.alt='无封面'">
      <div class="playlist-meta">
        <div class="playlist-title">${escapeHtml(track.title)}</div>
        <div class="playlist-artist">${escapeHtml(track.artist)}</div>
      </div>
      <div class="playlist-duration">${duration}</div>
    `;
    
    playlistDisplay.appendChild(item);
  });
}

function renderLyrics(parsedLyrics) {
  lyricsDisplay.innerHTML = '';
  lyricsPlaceholder.style.display = 'none';
  
  parsedLyrics.forEach(item => {
    if (item.element) {
      lyricsDisplay.appendChild(item.element);
    }
  });
  
  state.currentLyrics = parsedLyrics;
}

function updateTimeDisplay() {
  if (!state.isDragging && isFinite(audioPlayer.duration) && audioPlayer.duration > 0) {
    const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressSlider.value = percentage;
    progressSlider.style.setProperty('--progress', percentage + '%');
    currentTime.textContent = formatTime(audioPlayer.currentTime);
  } else if (!state.isDragging) {
    currentTime.textContent = formatTime(audioPlayer.currentTime);
  }
  
  highlightLyricsAtTime(audioPlayer.currentTime);
}

// 更新进度条 CSS 变量
function updateProgressPercent(percent) {
  progressSlider.style.setProperty('--progress', percent + '%');
}

// 更新音量条 CSS 变量
function updateVolumePercent(percent) {
  volumeSlider.style.setProperty('--volume', percent + '%');
}

// 监听用户拖动：实时更新视觉进度
progressSlider.addEventListener('input', function() {
  updateProgressPercent(this.value);
});

volumeSlider.addEventListener('input', function() {
  updateVolumePercent(this.value * 100); // 音量值是 0~1，转成百分比
});

// 初始化：设置初始值对应的 CSS 变量
updateProgressPercent(progressSlider.value);
updateVolumePercent(volumeSlider.value * 100);

function highlightLyricsAtTime(time) {
  if (!state.currentLyrics || state.currentLyrics.length === 0) return;
  
  let currentIndex = -1;
  
  // 找到当前应该高亮的歌词行
  for (let i = 0; i < state.currentLyrics.length; i++) {
    const line = state.currentLyrics[i];
    if (line.time === null) continue;
    
    if (line.time <= time && (i === state.currentLyrics.length - 1 || time < state.currentLyrics[i + 1].time)) {
      currentIndex = i;
      break;
    }
  }
  
  // 更新样式
  state.currentLyrics.forEach((line, i) => {
    if (line.element) {
      line.element.classList.toggle('lyrics-line-current', i === currentIndex);
      line.element.classList.toggle('lyrics-line-faded', i !== currentIndex && Math.abs(i - currentIndex) > 2);
    }
  });
  
  // 滚动到当前歌词
  if (currentIndex >= 0 && state.currentLyrics[currentIndex].element) {
    const container = lyricsDisplay;
    const element = state.currentLyrics[currentIndex].element;
    
    requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const containerHeight = containerRect.height;
      const elementTopInContainer = elementRect.top - containerRect.top + container.scrollTop;
      const elementHeight = elementRect.height;
      const targetScrollTop = elementTopInContainer - (containerHeight - elementHeight) / 2;
      
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    });
  }
}

function resetPlayerUI() {
  trackTitle.textContent = '暂无歌曲';
  trackArtist.textContent = '——';
  albumCover.style.backgroundImage = '';
  albumCover.textContent = '暂无图片';
  lyricsDisplay.innerHTML = '';
  lyricsPlaceholder.textContent = '暂无歌词';
  lyricsPlaceholder.style.display = 'block';
  currentTime.textContent = '00:00';
  durationTime.textContent = '00:00';
  progressSlider.value = 0;
  audioPlayer.src = '';
  playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></svg>';
  state.isPlaying = false;
  state.currentLyrics = [];
}

/* ---------- 工具函数 ---------- */
function parseLyrics(text) {
  const lines = text.split(/\r?\n/);
  const result = [];
  
  // 匹配时间标签的正则表达式
  const timeTagRegex = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;
  
  for (const rawLine of lines) {
    let line = rawLine.trim();
    if (!line) continue;
    
    let timeTags = [];
    let match;
    
    // 提取所有时间标签
    while ((match = timeTagRegex.exec(line)) !== null) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = match[3] ? parseInt((match[3] + '00').slice(0, 3), 10) : 0;
      const timeInSeconds = minutes * 60 + seconds + milliseconds / 1000;
      timeTags.push(timeInSeconds);
    }
    
    // 移除时间标签，只保留歌词文本
    const textOnly = line.replace(timeTagRegex, '').trim();
    
    if (timeTags.length > 0) {
      for (const time of timeTags) {
        const element = document.createElement('div');
        element.className = 'lyrics-line';
        element.textContent = textOnly || '　';
        
        result.push({
          time: time,
          text: textOnly || '　',
          element: element
        });
      }
    } else {
      // 没有时间标签的行
      const element = document.createElement('div');
      element.className = 'lyrics-line no-timestamp';
      element.textContent = line;
      
      result.push({
        time: null,
        text: line,
        element: element
      });
    }
  }
  
  // 按时间排序
  result.sort((a, b) => {
    if (a.time === null) return 1;
    if (b.time === null) return -1;
    return a.time - b.time;
  });
  
  return result;
}

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds <= 0) return '00:00';
  
  seconds = Math.max(0, Math.floor(seconds));
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  
  return `${minutes}:${secs}`;
}

function formatDuration(duration) {
  if (!duration) return '';
  
  const seconds = Math.round(Number(duration) || 0);
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  
  return `${minutes}:${secs}`;
}

function isUrl(string) {
  return typeof string === 'string' && /^https?:\/\//i.test(string);
}

function escapeHtml(string) {
  return String(string || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function showNotice(message, duration = 3000) {
  const notice = document.getElementById('playerNotice');
  notice.textContent = message;
  notice.style.display = 'block';
  
  if (notice.timeout) {
    clearTimeout(notice.timeout);
  }
  
  notice.timeout = setTimeout(() => {
    notice.style.display = 'none';
  }, duration);
}