// ============================================================
// < 控制台 > 统一脚本
// 命名约定：
//   setting* = 既有元素 id / HTML 接口（保留）
//   scc*     = 统一模块 / 全局函数前缀，公开函数与存储键一律 scc 开头，避免与其他项目冲突
// 结构：
//   1. 调试开关        2. 存储工具     3. 面板显隐     4. 选项卡/抽屉
//   5. 通用工具        6. 效果函数     7. 控件注册表（数据驱动）
//   8. 统一绑定        9. 统一重置    10. 字体        11. 背景
//   12. 系统信息      13. 静态绑定    14. 引导入口
// ============================================================

//---------- 1. 调试开关 ----------
// enabled = 总开关；各子项 false 则关闭对应类别的日志输出。
var SCC_DEBUG = {
    enabled: false,    // 总开关
    conv: false,       // 面板 / 布局 / 绑定
    theme: false,      // 主题效果（面板与页面透明度 / 模糊 / 卡片）
    bg: false,         // 背景切换
    font: false,       // 字体
    info: false,       // 系统信息
    storage: false    // localStorage 读写
};

function sccLog(scope, ...args) {
    if (!SCC_DEBUG.enabled || SCC_DEBUG[scope] === false) return;
    console.log(`[控制台/${scope}]`, ...args);
}

//---------- 2. 存储工具 ----------
// 统一读写 localStorage：checkbox 用 '1'/'0'，range 用数字字符串，radio 用选项值。
var sccStore = {
    get(key, def) {
        const v = localStorage.getItem(key);
        if (SCC_DEBUG.storage) sccLog('storage', 'get', key, '=>', v);
        return v === null ? def : v;
    },
    set(key, v) {
        if (SCC_DEBUG.storage) sccLog('storage', 'set', key, '=', v);
        localStorage.setItem(key, v);
    },
    remove(key) {
        if (SCC_DEBUG.storage) sccLog('storage', 'remove', key);
        localStorage.removeItem(key);
    },
    // JSON + 过期时间（分钟）存取，用于背景等带时效数据
    getJson(key, minutes) {
        try {
            const d = JSON.parse(localStorage.getItem(key));
            if (d) {
                const t = Date.now() - d.time;
                if (t < minutes * 60 * 1000 && t > -1) return d.data;
            }
        } catch (e) { /* 数据损坏按缺失处理 */ }
        return 0;
    },
    setJson(key, data) {
        localStorage.setItem(key, JSON.stringify({ time: Date.now(), data }));
    }
};

//---------- 3. 面板显隐 ----------
function sccOpenPanel() {
    const settingPanel = document.getElementById("settingPanel");
    const settingMask = document.getElementById("settingMask");
    if (!settingPanel || !settingMask) return;

    // 显示遮罩
    settingMask.classList.remove("sphide");
    settingMask.classList.add("spshow");

    // 显示面板
    setTimeout(() => {
        settingPanel.classList.remove("sphide");
        settingPanel.classList.add("spshow");
    }, 20);
    sccLog('conv', '面板打开');
}

function sccClosePanel() {
    const settingPanel = document.getElementById("settingPanel");
    const settingMask = document.getElementById("settingMask");
    if (!settingPanel || !settingMask) return;

    settingPanel.classList.remove("spshow");
    settingPanel.classList.add("sphide-anim"); // 添加隐藏动画
    settingMask.classList.remove("spshow");

    // 等待动画完成后再隐藏面板
    setTimeout(() => {
        settingPanel.classList.add("sphide");
        settingPanel.classList.remove("sphide-anim");
        settingMask.classList.add("sphide");
    }, 200);
}

//---------- 4. 选项卡 / 抽屉 ----------
// 桌面端（≥500px）侧栏常显、与内容并排；移动端（<500px）抽屉侧栏由顶栏菜单按钮滑出。
var sccTabsMedia = window.matchMedia('(min-width: 500px)');
var sccTabsEl = document.getElementById('settingTabs');
var sccItemsEl = document.getElementById('settingItems');
var sccMenuBtn = document.getElementById('settingMenuBtn');

// 当前选中选项卡：优先手动 .active，兜底 DOM 第一个
function sccActiveTab() {
    return sccTabsEl.querySelector('button.active') || sccTabsEl.querySelector('button');
}

// 切换并显示对应内容
function sccShowTab(button) {
    sccTabsEl.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === button));
    const target = document.getElementById(button.id + '-Content');
    Array.prototype.forEach.call(sccItemsEl.children, div => {
        div.classList.toggle('active', div === target);
    });
    sccOpenTabs(false); // 移动端选择后收起侧栏
    sccItemsEl.scrollTo({ top: 0 });
}

// 移动端抽屉侧栏开合
function sccOpenTabs(open) {
    if (sccTabsMedia.matches) return; // 桌面端常显，无需开合
    sccTabsEl.classList.toggle('scc-open', open);
}

// 给选项卡按钮绑定点击（Pjax 重建 DOM 后需重新绑定）
function sccBindTabsButtons() {
    sccTabsEl.querySelectorAll('button').forEach(button => {
        button.onclick = () => sccShowTab(button);
    });
}

// 根据断点 / DOM 情况初始化布局
function sccInitTabs() {
    if (sccTabsMedia.matches) {
        sccTabsEl.classList.remove('scc-open');
    } else {
        sccOpenTabs(false);
    }
    sccBindTabsButtons();
    sccShowTab(sccActiveTab());
}

//---------- 5. 通用工具 ----------
// 创建/获取 style 容器，position: 'start' | 'end'
function sccGetStyleTag(id, position = 'end') {
    let styleTag = document.getElementById(id);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = id;
        if (position === 'start') {
            document.head.insertBefore(styleTag, document.head.firstChild);
        } else {
            document.head.appendChild(styleTag);
        }
    }
    return styleTag;
}

// 状态写法：只写 <html data-scc-*>，具体样式由 scc-state.css 消费。
// 好处：状态挂在 documentElement 上，Pjax 替换 #body-wrap 时天然保留；
// 且首屏引导脚本能在首次绘制前就写好，避免「先画错、再纠正」的跳动。
function sccSetFlag(name, value) {
    document.documentElement.setAttribute('data-scc-' + name, value);
}

//---------- 6. 效果函数 ----------
// 6.1 通用开关效果
// 分层：**依赖是全局的，实例是可选的**。
//   依赖（APlayer.min.js/.css、Meting-sr.min.js）由 inject.bottom 无条件加载——
//   文章正文里也写着 <meting-js>（hello-world、aplayer测试），它们和页脚这个
//   播放器共用同一套脚本。把依赖绑在页脚开关上，文章里的播放器就只剩空标签。
//   可选的是页脚这个**实例**：放进 <template id="sccAplayerTpl">，开关打开时
//   才克隆出来。默认关闭的用户因此不会产生歌单接口请求（脚本在，但没元素去
//   触发初始化）；这正是「省资源」真正该发生的地方。
//   关 → 暂停 + 隐藏（CSS 见 scc-state.css），不销毁，原因见 sccRemoveAplayer。
function sccAplayerReady() {
    return !!(window.APlayer && window.customElements && window.customElements.get('meting-js'));
}

// consolex.js 在 inject.bottom 里排在 APlayer/Meting 之前，脚本又都是 defer，
// 所以本文件执行时依赖通常还没到位。用 whenDefined 等它，而不是"点了没反应"。
var sccAplayerWaiters = [];

function sccWhenAplayerReady(cb) {
    if (sccAplayerReady()) { cb(); return; }
    sccAplayerWaiters.push(cb);
    if (sccAplayerWaiters.length > 1) return;            // whenDefined 只挂一次
    if (!(window.customElements && window.customElements.whenDefined)) return;
    window.customElements.whenDefined('meting-js').then(function () {
        var waiting = sccAplayerWaiters;
        sccAplayerWaiters = [];
        for (var i = 0; i < waiting.length; i++) {
            try { waiting[i](); } catch (e) { sccLog('ap', '播放器挂载失败', e); }
        }
    });
}

// 页脚实例挂在一层 #scc-footer-aplayer 容器里：Meting 把 <meting-js> 的 id
// 当成歌单号用，那个标签上没法再挂 DOM id。容器就是稳定的锚点。
// 内层 meting-js 上的 .aplayerBgMusic 是兼容用的（sakurink.js 的音乐页 +
// 皮肤样式还按它找），新代码一律走 id。
function sccFooterHost() {
    return document.getElementById('scc-footer-aplayer');
}

function sccFooterPlayer() {
    var host = sccFooterHost();
    var el = host && host.querySelector('meting-js');
    return el && el.aplayer ? el.aplayer : null;
}

function sccMountAplayer() {
    // 状态可能在等待依赖的途中被关掉（点了开关又反悔），这里再确认一次，
    // 否则依赖回来时会把已经"关掉"的播放器重新挂上。
    if (document.documentElement.getAttribute('data-scc-aplayer') !== 'on') return;
    if (sccFooterHost()) return;
    var tpl = document.getElementById('sccAplayerTpl');
    if (!tpl || !tpl.content) return;
    document.body.appendChild(tpl.content.cloneNode(true));
}

function sccEnsureAplayer() {
    if (sccFooterHost()) return;   // 已有实例，直接复用（显隐交给 CSS）
    sccWhenAplayerReady(sccMountAplayer);
}

function sccAplayerMain() {
    sccSetFlag('aplayer', 'on');
    sccEnsureAplayer();
}

function sccRemoveAplayer() {
    sccSetFlag('aplayer', 'off');
    var player = sccFooterPlayer();
    if (player) {
        try { player.pause(); } catch (e) { /* 实例未就绪 */ }
    }

    /* 刻意不 removeChild —— 这里踩过坑，写清楚免得以后改回去：
       移除元素会触发 Meting 的 disconnectedCallback → aplayer.destroy()，而
       APlayer 1.10.1 的 destroy 有两步互相冲突：
         destroy(): pause() → container.innerHTML = '' → audio.src = ''
       `audio.src = ''` 会被解析成"当前页面地址"而不是空，必然抛 media error；
       紧接着 player.js 的 error 处理器排一个 2000ms 的定时器去 skipForward()，
       而那个定时器只有 listswitch 事件会 clearTimeout，destroy 不负责清。
       两秒后回调醒来，列表 DOM 已被 innerHTML = '' 清空：
         list.switch() → container.querySelectorAll('.aplayer-list li')[i].classList
       → undefined.classList，控制台报的就是这一条。
       这是上游缺陷（本站无法改），所以关闭取「暂停 + 隐藏」语义：
       实例留着，下次打开直接复用，既不重建也不销毁。
       真正的资源节省发生在首屏——默认关闭时模板根本不克隆，零请求。 */
}

// FPS 是「自己造出来的节点」，属于可重建资源：关掉就该销毁。
// 注意必须 cancelAnimationFrame——只 remove 节点的话，循环会一直往游离节点
// 里写文本，反复开关还会累积出多个循环。
var sccFpsRaf = 0;

function sccFpsMain() {
    if (document.getElementById('fpsDisplayElement')) return;
    const fpsElement = document.createElement('div');
    fpsElement.id = 'fpsDisplayElement';
    fpsElement.setAttribute('data-scc-owned', 'fps');
    document.body.appendChild(fpsElement);

    let lastFrameTime = performance.now();
    let frameCount = 0;

    function updateFPS() {
        if (!fpsElement.isConnected) { sccFpsRaf = 0; return; }
        const now = performance.now();
        frameCount++;
        const delta = now - lastFrameTime;
        if (delta >= 1000) {
            const fps = Math.round((frameCount * 1000) / delta);
            fpsElement.textContent = 'FPS: ' + fps;
            frameCount = 0;
            lastFrameTime = now;
        }
        sccFpsRaf = requestAnimationFrame(updateFPS);
    }
    sccFpsRaf = requestAnimationFrame(updateFPS);
}

function sccRemoveFps() {
    if (sccFpsRaf) { cancelAnimationFrame(sccFpsRaf); sccFpsRaf = 0; }
    const fpsElement = document.getElementById('fpsDisplayElement');
    if (fpsElement) fpsElement.remove();
}

// 粒子：显示交给 scc-state.css，绘制循环交给 universe.js 暴露的 sccUniverse。
// 只 display:none 的话，canvas 每天仍在后台画 276 个粒子。
function sccAstralMain() {
    sccSetFlag('universe', 'on');
    if (window.sccUniverse) window.sccUniverse.start();
}

function sccRemoveAstral() {
    sccSetFlag('universe', 'off');
    if (window.sccUniverse) window.sccUniverse.stop();
}

function sccIndexImgMain() {
    sccSetFlag('index-img', 'on');
}

function sccRemoveIndexImg() {
    sccSetFlag('index-img', 'off');
}

// 测试按钮占位效果
function sccFunctionState111() {
    sccLog('conv', 'func111');
}

function sccFunctionState000() {
    sccLog('conv', 'func000');
}

// 6.2 主题效果
// 主题分页：背景透明度（100% 不透明=原样；值越小背景图越透明）
function sccUpdateThemeBgOpacity(rangeValue) {
    const styleTag = sccGetStyleTag('sccThemeBgOpacityStyleBox');
    if (parseInt(rangeValue) >= 100) {
        styleTag.innerHTML = '';
        return;
    }
    styleTag.innerHTML = `#web_bg { opacity: ${rangeValue / 100}; }`;
    sccLog('theme', '背景透明度更新为: ' + rangeValue + '%');
}

// 主题分页：背景模糊度
function sccUpdateThemeBgBlur(rangeValue) {
    const styleTag = sccGetStyleTag('sccThemeBgBlurStyleBox');
    if (parseInt(rangeValue) <= 0) {
        styleTag.innerHTML = '';
        return;
    }
    styleTag.innerHTML = `
        #web_bg { -webkit-filter: blur(${rangeValue}px); filter: blur(${rangeValue}px); }
    `;
    sccLog('theme', '背景模糊度更新为: ' + rangeValue + 'px');
}

// 主题分页：卡片透明度
// 换算成不透明度 alpha = 100 - 滑杆值，写成两个终态：
//   data-scc-card      → 是否启用半透明底色（alpha < 100）
//   --scc-card-alpha   → 具体数值，由 scc-state.css 的 color-mix 消费
//   data-scc-frosted   → 是否开背景模糊
// 模糊只在 alpha ≤ 92%（滑杆 ≥ 8）时开：再往上卡片几乎看不见背景，
// 20px 模糊不产出像素，却要让每张卡各建一层合成、每次移动都重采样。
// 这个阈值现在是"从同一个 alpha 派生"的，不再是一处孤立的魔法数；
// UI 上也会给出提示（见 scc-state.css 的 .scc-tip）。
function sccUpdateThemeCardOpacity(rangeValue) {
    // alpha 的换算（含 90% 上限）在 scc-boot.js 的 cardAlpha() 里，
    // 首屏引导和这里共用同一条规则。
    const alpha = (window.sccBoot && window.sccBoot.cardAlpha)
        ? window.sccBoot.cardAlpha(rangeValue)
        : (100 - (isNaN(parseInt(rangeValue, 10)) ? 0 : parseInt(rangeValue, 10)));
    const root = document.documentElement;

    if (alpha >= 100) {
        root.removeAttribute('data-scc-card');
        root.style.removeProperty('--scc-card-alpha');
    } else {
        root.setAttribute('data-scc-card', '');
        root.style.setProperty('--scc-card-alpha', alpha + '%');
    }

    // 模糊只在卡片真的透到能看见背景时才有产出（>92% 不透明时 blur 近乎为零）
    root.setAttribute('data-scc-frosted', alpha <= 92 ? 'on' : 'off');
    sccLog('theme', '卡片透明度更新为: ' + rangeValue);
}

// 主题分页：卡片模糊度（关联文章卡片与侧栏卡片，写入 --f-card-blur）
function sccUpdateThemeCardBlur(rangeValue) {
    const styleTag = sccGetStyleTag('sccThemeCardBlurStyleBox');
    const blur = parseInt(rangeValue);
    styleTag.innerHTML = `:root { --f-card-blur: ${isNaN(blur) ? 20 : blur}px; }`;
    sccLog('theme', '卡片模糊度更新为: ' + rangeValue + 'px');
}

// 6.3 灯笼 / aplayer 皮肤 / 测试 radio
// 灯笼是纯 CSS 动画：display:none 之后合成器不再为它出帧，隐藏即等于关闭，
// 所以和 indexImg 一样只写状态，不碰元素。
function sccSetLantern(value) {
    sccSetFlag('lantern', value);
}

function sccRemoveLantern() {
    sccSetLantern('off');
}

function sccLanternLeft() {
    sccSetLantern('left');
}

function sccLanternRight() {
    sccSetLantern('right');
}

function sccAplayerSkinStyle1() {
    const styleTag = sccGetStyleTag('aplayerSkinStyleBox');
    styleTag.innerHTML = `
        .aplayerBgMusic .aplayer-narrow .aplayer-miniswitcher { left: 300px !important; }
        .aplayerBgMusic .aplayer.aplayer-fixed.aplayer-narrow .aplayer-body { transform: translateX(-300px) !important; }
    `;
}
function sccAplayerSkinStyle2() {
    const styleTag = sccGetStyleTag('aplayerSkinStyleBox');
    styleTag.innerHTML = `
        .aplayerBgMusic .aplayer-narrow .aplayer-miniswitcher { left: auto !important; }
        .aplayerBgMusic .aplayer.aplayer-fixed.aplayer-narrow .aplayer-body { transform: none !important; }
    `;
}

function sccRadio2Func1() { sccLog('conv', '选择了 Huey-2'); }
function sccRadio2Func2() { sccLog('conv', '选择了 Dewey-2'); }
function sccRadio2Func3() { sccLog('conv', '选择了 Louie-2'); }

//---------- 7. 控件注册表（数据驱动） ----------
// 唯一来源：存储键、开关回调、重置基准。
// 默认值**不在这里**——它们在 /js/scc-boot.js 的 SCC_DEFAULTS 里，那是全站唯一
// 一份（首屏引导脚本也要用它，而它在 defer 之前执行，只能自己带常量）。
// 这里只引用，避免"两处默认值各改一半"。
var SCC_D = (window.sccBoot && window.sccBoot.DEFAULTS) || {};
if (!window.sccBoot) {
    console.error('[consolex] /js/scc-boot.js 未加载：控件默认值将不可用，请检查 head 注入。');
}

// 说明：id 对 checkbox/range 为控件元素 id；radio 用 name。
var SCC_CONTROLS = {
    version: 1,
    checkboxes: [
        { id: 'aplayerOnOff',   key: 'aplayerOnOff',    default: SCC_D.aplayerOnOff,   on: sccAplayerMain,       off: sccRemoveAplayer,   switch: 'sccAplayerState' },
        { id: 'fpsDisplay',     key: 'fpsDisplay',      default: SCC_D.fpsDisplay,     on: sccFpsMain,           off: sccRemoveFps,       switch: 'sccFpsState' },
        { id: 'universeEffect', key: 'universeEffect',  default: SCC_D.universeEffect, on: sccAstralMain,        off: sccRemoveAstral,    switch: 'sccUniverseState' },
        { id: 'indexImgDisplay', key: 'indexImgDisplay', default: SCC_D.indexImgDisplay, on: sccIndexImgMain,    off: sccRemoveIndexImg,  switch: 'sccIndexImgState' },
        { id: 'variable1',      key: 'variable1',       default: SCC_D.variable1,      on: sccFunctionState111,  off: sccFunctionState000, switch: 'sccSwitchState1' }
    ],
    ranges: [
        { id: 'themeBgOpacityRange',    displayId: 'themeBgOpacityVal', key: 'sccThemeBgOpacity',     default: SCC_D.sccThemeBgOpacity, value: sccUpdateThemeBgOpacity },
        { id: 'themeBgBlurRange',       displayId: 'themeBgBlurVal',    key: 'sccThemeBgBlur',        default: SCC_D.sccThemeBgBlur,   value: sccUpdateThemeBgBlur },
        { id: 'themeCardOpacityRange',  displayId: 'themeCardOpacityVal', key: 'sccThemeCardOpacity', default: SCC_D.sccThemeCardOpacity, value: sccUpdateThemeCardOpacity },
        { id: 'themeCardBlurRange',     displayId: 'themeCardBlurVal',   key: 'sccThemeCardBlur',    default: SCC_D.sccThemeCardBlur, value: sccUpdateThemeCardBlur }
    ],
    radios: [
        { name: 'lanternDisplay',          default: SCC_D.lanternDisplay },
        { name: 'aplayerSkinStyleDisplay', default: SCC_D.aplayerSkinStyleDisplay },
        { name: 'drone2',                  default: SCC_D.drone2 }
    ]
};

// 已绑定的控件句柄，供重置按钮反查（Pjax 后元素重建会自动覆盖）
var sccRegistry = {
    checkboxes: new Map(),
    ranges: new Map(),
    radios: new Map()
};

//---------- 8. 统一绑定 ----------
function sccBindCheckbox(entry) {
    const checkbox = document.getElementById(entry.id);
    if (!checkbox) {
        sccLog('conv', '[checkbox] 未找到元素:', entry.id);
        return;
    }

    // 状态统一从存储读（1/0），不再用闭包变量：
    // Pjax 换页后重新 apply 时读到的就是真源，不会和存储漂移。
    const read = () => sccStore.get(entry.key, entry.default ? '1' : '0') === '1' ? 1 : 0;
    const apply = () => {
        const state = read();
        checkbox.checked = state === 1;
        if (state === 1) entry.on(); else entry.off();
    };

    if (!checkbox.dataset.sccBound) {
        checkbox.dataset.sccBound = '1';
        const set = (v) => { sccStore.set(entry.key, v ? 1 : 0); apply(); };
        const toggle = () => { set(read() === 1 ? 0 : 1); };
        window[entry.switch] = toggle; // 供 HTML onclick 调用
        checkbox.onclick = toggle;     // 覆盖内联 onclick，避免二次触发
        sccRegistry.checkboxes.set(entry.key, { entry, set });
    }

    // 关键：即使已经绑定过，也要再 apply 一次。
    // 以前这里是 `if (dataset.sccBound) return`，而面板本身不在 Pjax 的替换区，
    // 于是 pjax:complete 里所有控件都直接早退，效果一次都没重放过。
    apply();
}

function sccBindRange(entry) {
    const range = document.getElementById(entry.id);
    const unitEl = document.getElementById(entry.displayId);
    if (!range || !unitEl) {
        sccLog('conv', '[range] 未找到元素:', entry.id, '/', entry.displayId);
        return;
    }

    // 更新显示文本（含单位）与滑块进度
    const applyValue = (value) => {
        unitEl.textContent = value + (unitEl.dataset.unit || '');
        const min = parseFloat(range.min);
        const max = parseFloat(range.max);
        if (!isNaN(min) && !isNaN(max) && max !== min) {
            const percent = ((value - min) / (max - min)) * 100;
            range.style.setProperty('--range-progress', percent + '%');
        }
    };

    // 设置滑块值 + 显示 + 存储 + 调用效果函数（幂等，可重复调用）
    const setStored = (value) => {
        range.value = value;
        applyValue(value);
        sccStore.set(entry.key, value);
        if (entry.value) entry.value(value);
    };

    if (!range.dataset.sccBound) {
        range.dataset.sccBound = '1';
        range.addEventListener('input', () => setStored(range.value));
        sccRegistry.ranges.set(entry.key, { entry, setStored });
    }

    const initial = parseFloat(sccStore.get(entry.key, entry.default));
    setStored(isNaN(initial) ? entry.default : initial);
}

function sccBindRadio(entry) {
    const group = document.querySelectorAll(`input[name="${entry.name}"]`);
    if (group.length === 0) {
        sccLog('conv', '[radio] 未找到组:', entry.name);
        return;
    }

    const def = entry.default;

    const applyValue = (value) => {
        group.forEach(r => { r.checked = (r.value === value); });
    };
    // 触发当前选中项由 HTML onclick 定义的函数
    const fireChecked = () => {
        group.forEach(r => { if (r.checked && r.onclick) r.onclick(); });
    };

    if (!group[0].dataset.sccBound) {
        group[0].dataset.sccBound = '1';
        // 持久化用户选择（HTML onclick 属性另作效果回调）
        group.forEach(radio => {
            radio.addEventListener('click', () => sccStore.set(entry.name, radio.value));
        });
        sccRegistry.radios.set(entry.name, {
            entry,
            reset: () => { applyValue(def); fireChecked(); }
        });
    }

    // 同样：绑定过也要重放，Pjax 换页后才有意义
    const initial = sccStore.get(entry.name, def) || def;
    applyValue(initial);
    fireChecked();
}

//---------- 9. 统一重置 ----------
function sccResetCheckboxes() {
    sccRegistry.checkboxes.forEach(h => h.set(h.entry.default));
}

function sccResetRange(key) {
    const h = sccRegistry.ranges.get(key);
    if (h) h.setStored(h.entry.default);
}

function sccResetRanges() {
    sccRegistry.ranges.forEach(h => {
        sccStore.remove(h.entry.key);
        h.setStored(h.entry.default);
    });
}

function sccResetRadio(name) {
    const h = sccRegistry.radios.get(name);
    if (!h) return;
    sccStore.remove(name);
    h.reset();
}

function sccResetRadios() {
    sccRegistry.radios.forEach((h, name) => sccResetRadio(name));
}

// 绑定底部重置按钮组（一次性）
function sccBindResetButtons() {
    const byId = (id) => document.getElementById(id);
    const on = (el, fn) => { if (el) el.addEventListener('click', fn); };

    on(byId('resetSwitches'), sccResetCheckboxes);
    on(byId('resetRangeBar'), sccResetRanges);
    on(byId('resetRadio'), sccResetRadios);

    SCC_CONTROLS.ranges.forEach(e => on(byId('resetRangeBar-' + e.id), () => sccResetRange(e.key)));
    SCC_CONTROLS.radios.forEach(e => on(byId('resetRadio-' + e.name), () => sccResetRadio(e.name)));

    on(byId('sccResetFont'), sccResetFont);
    on(byId('sccResetBg'), sccResetBg);
}

//---------- 10. 字体 ----------
// 派生规则（值 → font-family 兜底链）在 scc-boot.js 里，这里只调用，
// 免得首屏引导和这里各写一条、日后改一处忘一处。
var SCC_FONT_STACK = '-apple-system, "IBM Plex Mono", monospace, "微软雅黑", sans-serif'; // 仅 scc-boot 缺失时兜底

function sccFontStack(name) {
    if (window.sccBoot && window.sccBoot.fontStack) return window.sccBoot.fontStack(name);
    return name === 'main' ? SCC_FONT_STACK : name + ', ' + SCC_FONT_STACK;
}

// 全局函数：HTML 字体按钮 onclick 直接引用
// 写的是 consolex.css 里 *{font-family:var(--global-font)} 的取值，
// 所以必须带上兜底链——否则在没装该字体的设备上会直接掉回浏览器默认字体。
// 不再写 body.style：defer 之后改 body 会让文字重排一次。
function sccSetFont(fontName) {
    sccStore.set('selectedFont', fontName);
    const root = document.documentElement;
    root.setAttribute('data-scc-font', '');
    root.style.setProperty('--global-font', sccFontStack(fontName));
    sccLog('font', '字体切换为:', fontName);
}

function sccResetFont() {
    sccSetFont(SCC_D.selectedFont);
}

function sccInitFont() {
    sccSetFont(sccStore.get('selectedFont', SCC_D.selectedFont));
}

//---------- 11. 背景 ----------
// 全局函数：HTML 背景控件 onclick 直接引用（flag=0 存储，=1 仅套用）
function sccChangeBg(s, flag) {
    const bg = document.getElementById('web_bg');
    if (!bg || typeof s !== 'string') return;
    if (s.charAt(0) === '#') {
        bg.style.backgroundColor = s;
        bg.style.backgroundImage = 'none';
    } else {
        bg.style.backgroundImage = s;
    }
    if (!flag) sccStore.setJson('blogbg', s);
    sccLog('bg', '背景切换:', s, flag ? '(仅套用)' : '(已存储)');
}

// 重置背景（清除已存记录并恢复默认图）
function sccResetBg() {
    sccStore.remove('blogbg');
    sccChangeBg('url(/img/background_img.jpg)');
}

// 读取已存背景（24 小时分钟内有效）
function sccInitBg() {
    try {
        const data = sccStore.getJson('blogbg', 1440);
        if (data) sccChangeBg(data, 1);
        else sccStore.remove('blogbg');
    } catch (e) {
        sccStore.remove('blogbg');
    }
}

// 全局函数：清空 localStorage（按钮可能直接引用）
function sccClearLocalStorage() {
    localStorage.clear();
    sccLog('storage', 'LocalStorage 已清除');
    location.reload();
}

// 通用“清理”按钮绑定
function sccClearBrowserStorage(clearElementName, clearFunction) {
    document.getElementById(clearElementName).addEventListener('click', function() {
        clearFunction();
        this.textContent = '已清除';
        sccLog('conv', '已执行清理:', clearElementName);
        setTimeout(() => location.reload(), 1000);
    });
}

//---------- 12. 系统信息 ----------
function sccFillInfo() {
    // 初始化信息
    const info = {
        userAgent: "获取中",
        language: "获取中",
        platform: "获取中",
        maxTouchPoints: "获取中",
        referrer: "获取中",
        browserName: "获取中",
        osName: "获取中",
        userAgentDataBrands: "获取中",
        userAgentDataMobile: "获取中",
        userAgentDataPlatform: "获取中"
    };

    // 辅助函数：更新 span 内容
    function updateSpan(id, value) {
        const span = document.getElementById(id);
        if (span) span.textContent = value;
    }

    // 带错误兜底的信息获取
    const safeSet = (id, getter, fallback) => {
        try {
            updateSpan(id, getter() || fallback);
        } catch (e) {
            updateSpan(id, fallback);
        }
    };

    safeSet("userAgent", () => navigator.userAgent, "未获取");
    safeSet("language", () => navigator.language || navigator.userLanguage, "未获取");
    safeSet("platform", () => navigator.platform, "未获取");
    safeSet("maxTouchPoints", () => navigator.maxTouchPoints, "未获取");
    safeSet("referrer", () => document.referrer || "没有引用信息", "未获取");

    // 浏览器与操作系统名称
    function getBrowserAndOS() {
        const userAgent = navigator.userAgent;
        let browserName = "未获取";
        let osName = "未获取";

        if (/Edg\//i.test(userAgent)) browserName = "Edge";
        else if (/OPR\//i.test(userAgent)) browserName = "Opera";
        else if (/Firefox/i.test(userAgent)) browserName = "Firefox";
        else if (/Chrome/i.test(userAgent)) browserName = "Chrome";
        else if (/Safari/i.test(userAgent)) browserName = "Safari";
        else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) browserName = "Internet Explorer";
        else if (userAgent.includes("Baidu") || userAgent.includes("BaiduBrowser")) browserName = "Baidu";
        else if (userAgent.includes("Maxthon")) browserName = "Maxthon";
        else if (userAgent.includes("QQBrowser")) browserName = "QQ";
        else if (userAgent.includes("Sogou")) browserName = "搜狗";
        else browserName = "Others";

        if (/OpenHarmony/i.test(userAgent) || typeof window.ohos !== 'undefined') osName = "OpenHarmony";
        else if (/HarmonyOS|HMOS/i.test(userAgent)) osName = /Android/i.test(userAgent) ? "HarmonyOS" : "HarmonyOS NEXT";
        else if (/Android/i.test(userAgent)) osName = "Android";
        else if (/iPhone|iPad/i.test(userAgent)) osName = "iOS";
        else if (/Macintosh/i.test(userAgent)) osName = "macOS";
        else if (/Windows/i.test(userAgent)) osName = "Windows";
        else if (/CrOS/i.test(userAgent)) osName = "Chrome OS";
        else if (/Linux/i.test(userAgent)) osName = "Linux";

        updateSpan("browserName", browserName);
        updateSpan("osName", osName);
    }
    getBrowserAndOS();

    // UserAgentData 高熵信息（带降级）
    try {
        if (navigator.userAgentData) {
            navigator.userAgentData.getHighEntropyValues(["platform", "brands", "mobile"])
                .then(ua => {
                    updateSpan("userAgentDataBrands", ua.brands.map(b => b.brand + ' ' + b.version).join(', '));
                    updateSpan("userAgentDataMobile", ua.mobile ? 'True' : 'False');
                    updateSpan("userAgentDataPlatform", ua.platform);
                })
                .catch(() => {
                    updateSpan("userAgentDataBrands", "未获取");
                    updateSpan("userAgentDataMobile", "未获取");
                    updateSpan("userAgentDataPlatform", "未获取");
                });
        } else {
            updateSpan("userAgentDataBrands", "未获取");
            updateSpan("userAgentDataMobile", /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'True' : 'False');
            updateSpan("userAgentDataPlatform", "未获取");
        }
    } catch (e) {
        updateSpan("userAgentDataBrands", "未获取");
        updateSpan("userAgentDataMobile", "未获取");
        updateSpan("userAgentDataPlatform", "未获取");
    }
    sccLog('info', '系统信息已填充');
}

//---------- 13. 静态绑定（一次性，Pjax 后不重复挂载） ----------
function sccBindStatic() {
    if (window.__SCC_STATIC_BOUND) return;
    window.__SCC_STATIC_BOUND = true;

    // 遮罩点击关闭面板
    const mask = document.getElementById('settingMask');
    if (mask) mask.addEventListener('click', sccClosePanel);

    // 选项卡：断点变化
    const onMediaChange = () => sccInitTabs();
    if (typeof sccTabsMedia.addEventListener === 'function') {
        sccTabsMedia.addEventListener('change', onMediaChange);
    } else if (typeof sccTabsMedia.addListener === 'function') {
        sccTabsMedia.addListener(onMediaChange);
    }

    // 抽屉：点侧栏外区域收起（移动端）
    document.addEventListener('click', function(e) {
        if (!sccTabsMedia.matches && sccTabsEl.classList.contains('scc-open')) {
            if (!sccTabsEl.contains(e.target) && !(sccMenuBtn && sccMenuBtn.contains(e.target))) {
                sccOpenTabs(false);
            }
        }
    });

    // 抽屉：顶栏菜单按钮
    if (sccMenuBtn) {
        sccMenuBtn.onclick = () => sccOpenTabs(!sccTabsEl.classList.contains('scc-open'));
    }

    // 全屏按钮
    const fullscreenBtn = document.getElementById('settingFullScreen');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch((err) => {
                    sccLog('conv', '进入全屏失败:', err.message, `(${err.name})`);
                });
            } else {
                document.exitFullscreen().catch((err) => {
                    sccLog('conv', '退出全屏失败:', err.message, `(${err.name})`);
                });
            }
        });
    }

    // 夜里/白天切换按钮（Butterfly 主题）
    const darkBtn = document.getElementById('menu-darkmode');
    if (darkBtn) {
        darkBtn.onclick = function() {
            const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            if (nowMode === 'light') {
                btf.activateDarkMode();
                btf.saveToLocal.set('theme', 'dark', 2);
                GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night);
            } else {
                btf.activateLightMode();
                btf.saveToLocal.set('theme', 'light', 2);
                GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day);
            }
            // 兼容各评论/分享方案的刷新
            typeof utterancesTheme === 'function' && utterancesTheme();
            typeof FB === 'object' && typeof window.loadFBComment === 'function' && window.loadFBComment();
            window.DISQUS && document.getElementById('disqus_thread') && document.getElementById('disqus_thread').children.length && setTimeout(() => window.disqusReset(), 200);
        };
    }

    // 重置按钮组
    sccBindResetButtons();

    // 清理按钮组
    sccClearBrowserStorage('clearSessionStorage', () => sessionStorage.clear());
    sccClearBrowserStorage('clearCookies', function() {
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
        });
    });
    sccClearBrowserStorage('clearServiceWorkers', function() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for (let registration of registrations) registration.unregister();
            });
        }
    });
    sccClearBrowserStorage('clearCaches', function() {
        if ('caches' in window) {
            caches.keys().then(function(names) {
                for (let name of names) caches.delete(name);
            });
        }
    });

    sccLog('conv', '静态绑定完成');
}

//---------- 14. 引导入口 ----------
// 按注册表补齐缺失的 localStorage 默认值
function sccSeedDefaults() {
    SCC_CONTROLS.checkboxes.forEach(e => {
        if (sccStore.get(e.key, null) === null) sccStore.set(e.key, e.default ? '1' : '0');
    });
    SCC_CONTROLS.ranges.forEach(e => {
        if (sccStore.get(e.key, null) === null) sccStore.set(e.key, e.default);
    });
    SCC_CONTROLS.radios.forEach(e => {
        if (sccStore.get(e.name, null) === null) sccStore.set(e.name, e.default);
    });
    sccLog('conv', '默认值已补齐');
}

// 统一初始化：DOMContentLoaded 与 Pjax 完成各执行一次
function sccInit() {
    sccSeedDefaults();
    sccBindStatic(); // 一次性监听
    SCC_CONTROLS.checkboxes.forEach(sccBindCheckbox);
    SCC_CONTROLS.ranges.forEach(sccBindRange);
    SCC_CONTROLS.radios.forEach(sccBindRadio);
    sccInitTabs();
    sccInitFont();
    sccInitBg();
    sccFillInfo();
    sccLog('conv', '控制台初始化完成');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sccInit);
} else {
    sccInit();
}
document.addEventListener('pjax:complete', sccInit);
