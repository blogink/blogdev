/* ==========================================================================
   scc-boot.js · 控制台的「第 0 层」：默认值 + 首屏引导
   --------------------------------------------------------------------------
   加载方式：<head> 里**同步**引入（不是 defer）。
   原因：它要在浏览器第一次布局之前，把用户上次的设置写成 <html data-scc-*>。
   defer 要等 HTML 解析完、首次绘制之后才跑，等于白做——那正是以前"头部先
   是大图、再收成 60px"的来源。

   这里是控制台所有默认值的**唯一来源**：
     · SCC_DEFAULTS  —— consolex.js 的控件注册表直接引用，不再各写一份
     · fontStack() / cardAlpha() —— 派生规则也只在这里写一次
   面板 HTML（settingpanel.pug）里的 value / checked 只是 SSR 初值，会被 JS 覆盖。

   体量约 2KB、同域、无第三方请求，同步执行的代价远小于一次布局跳动。
   ========================================================================== */
(function () {
  'use strict';

  /* ---- 默认值：全站唯一一份 ------------------------------------------
     改这里就够了。consolex.js 通过 window.sccBoot.DEFAULTS 读取。 */
  var DEFAULTS = {
    aplayerOnOff: false,          // 页脚播放器（实例按需创建，默认不存在）
    fpsDisplay: false,            // FPS 读数
    universeEffect: false,        // 背景粒子
    indexImgDisplay: true,        // 首页大图
    variable1: true,
    lanternDisplay: 'close',      // close | left | right
    sccThemeCardOpacity: 5,       // 卡片「透明度」，0~90；不透明度 = 100 - v
    sccThemeBgOpacity: 100,
    sccThemeBgBlur: 0,
    sccThemeCardBlur: 20,
    aplayerSkinStyleDisplay: 'skin1',
    drone2: '22222',
    selectedFont: 'main'
  };

  var FONT_STACK = '-apple-system, "IBM Plex Mono", monospace, "微软雅黑", sans-serif';

  /* ---- 派生规则 ------------------------------------------------------ */

  /* 字体值 → font-family。必须带兜底链，否则没装该字体的设备会掉回浏览器默认。 */
  function fontStack(name) {
    return name === 'main' ? FONT_STACK : name + ', ' + FONT_STACK;
  }

  /* 卡片「透明度」滑杆 → 不透明度百分比。
     滑杆 0 表示不透明，100 表示全透；夹到 90，留一点底，否则正文没法读。 */
  function cardAlpha(sliderValue) {
    var v = parseInt(sliderValue, 10);
    if (isNaN(v)) v = DEFAULTS.sccThemeCardOpacity;
    v = Math.min(90, Math.max(0, v));
    return 100 - v;
  }

  /* ---- 存储读取（无痕模式下 localStorage 会抛，全部吞掉） ------------ */
  function get(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function readBool(k, def) {
    var v = get(k);
    return v === null ? def : v === '1';
  }
  function readStr(k, def, allowed) {
    var v = get(k);
    if (v === null) return def;
    if (allowed && allowed.indexOf(v) < 0) return def;
    return v;
  }

  /* ---- 状态 → <html> 属性，CSS 侧由 scc-state.css 消费 ---------------- */
  function apply() {
    var d = document.documentElement;

    d.setAttribute('data-scc-aplayer', readBool('aplayerOnOff', DEFAULTS.aplayerOnOff) ? 'on' : 'off');
    d.setAttribute('data-scc-universe', readBool('universeEffect', DEFAULTS.universeEffect) ? 'on' : 'off');
    d.setAttribute('data-scc-index-img', readBool('indexImgDisplay', DEFAULTS.indexImgDisplay) ? 'on' : 'off');

    /* 灯笼：radio 里叫 close，CSS 里叫 off，在这里翻译一次 */
    var lantern = readStr('lanternDisplay', DEFAULTS.lanternDisplay, ['close', 'left', 'right']);
    d.setAttribute('data-scc-lantern', lantern === 'left' || lantern === 'right' ? lantern : 'off');

    var alpha = cardAlpha(get('sccThemeCardOpacity'));
    if (alpha < 100) {
      d.setAttribute('data-scc-card', '');
      d.style.setProperty('--scc-card-alpha', alpha + '%');
    } else {
      d.removeAttribute('data-scc-card');
      d.style.removeProperty('--scc-card-alpha');
    }
    // 模糊只在卡片真的透到能看见背景时才有产出：不透明度 >92% 时 blur(20px)
    // 在视觉上近乎为零，却仍要让每张卡单独建一层合成。
    d.setAttribute('data-scc-frosted', alpha <= 92 ? 'on' : 'off');

    d.setAttribute('data-scc-font', '');
    d.style.setProperty('--global-font', fontStack(readStr('selectedFont', DEFAULTS.selectedFont)));
  }

  try { apply(); } catch (e) { /* 引导脚本自己永远不该挡住页面 */ }

  window.SCC_DEFAULTS = DEFAULTS;   // 便捷别名
  window.sccBoot = {
    DEFAULTS: DEFAULTS,
    fontStack: fontStack,
    cardAlpha: cardAlpha,
    apply: apply
  };
})();
