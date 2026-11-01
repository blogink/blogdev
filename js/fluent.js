/*!
 * fluent.js · Fluent Reveal 光效（约 30 行，只写 CSS 变量，不碰 DOM 结构）
 * 与 fluent.css 配套使用：卡片 ::before 的径向渐变读取 --f-mx / --f-my。
 * 使用事件委托，pjax 换页后无需重新绑定；重入时直接返回。
 */
(function () {
  'use strict';

  if (window.__fluentReveal) return;
  window.__fluentReveal = true;

  var SEL = '.recent-post-item, #aside-content .card-widget, #pagination.pagination-post .pagination-related';
  var pending = null;
  var raf = 0;

  function flush() {
    raf = 0;
    var job = pending;
    pending = null;
    if (!job) return;
    var rect = job.el.getBoundingClientRect();
    job.el.style.setProperty('--f-mx', (job.x - rect.left).toFixed(0) + 'px');
    job.el.style.setProperty('--f-my', (job.y - rect.top).toFixed(0) + 'px');
  }

  document.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    var target = e.target;
    if (!target || !target.closest) return;
    var el = target.closest(SEL);
    if (!el) return;
    pending = { el: el, x: e.clientX, y: e.clientY };
    if (!raf) raf = window.requestAnimationFrame(flush);
  }, { passive: true });

  /* 触屏设备不做光效，省电也省事 */
  if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
    document.documentElement.classList.add('f-touch');
  }

  /* ------------------------------------------------------------------
   * 深浅色切换
   *
   * 目标：整页一次性完成过渡，不要"卡片渐隐、容器硬切"的割裂感，
   *      同时**不能**靠给全文档挂 transition 来实现——那条路在
   *      1049 个节点的页面上，光"加类"这一帧就要 28ms 重算，
   *      设备越弱越难看。
   *
   * 两条路：
   *   1) 支持 View Transitions 时：把切换包进 startViewTransition()，
   *      浏览器替我们截两张图做一次交叉淡入。成本 O(1)，与节点数无关。
   *      时机很关键：真正的 data-theme 变更必须发生在回调**内部**，
   *      否则"旧态快照"抓到的已经是变色后的画面。
   *      所以这里在捕获阶段拦下开关的 click，回调里再原样重放一次
   *      （重放的那次靠 __fvReplay 放行）。
   *   2) 不支持时：退回 .f-theme-switch 白名单过渡（fluent.css 第 2 节），
   *      由 pointerdown 提前挂类，MutationObserver 兜底。
   * ------------------------------------------------------------------ */
  var root = document.documentElement;
  var switchTimer = 0;
  var SWITCH_CLASS = 'f-theme-switch';

  /* 站点上所有会切主题的入口：右侧栏按钮、移动端菜单、控制台里的开关 */
  var THEME_BTN = '#darkmode, #menu-darkmode, #darkmode_navswitch, .darkmode-switch';

  var canViewTransition = typeof document.startViewTransition === 'function' &&
    !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var vtRunning = false;
  var inViewTransition = false;

  function releaseSwitch() {
    root.classList.remove(SWITCH_CLASS);
  }

  /* 兜底：先挂类（这一刻还没变色），1.2s 后无论怎样都摘掉；
     真正变色的那一刻由 runSwitch 重新计时。 */
  function armSwitch() {
    root.classList.add(SWITCH_CLASS);
    clearTimeout(switchTimer);
    switchTimer = setTimeout(releaseSwitch, 1200);
  }

  /* 过渡 200ms，留 60ms 余量后摘掉，避免收尾被切。 */
  function runSwitch() {
    root.classList.add(SWITCH_CLASS);
    clearTimeout(switchTimer);
    switchTimer = setTimeout(releaseSwitch, 260);
  }

  function replayClick(btn) {
    btn.__fvReplay = true;
    btn.click();
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var btn = t.closest(THEME_BTN);
    if (!btn) return;
    if (btn.__fvReplay) {           // 我们自己重放的那一次，放行
      btn.__fvReplay = false;
      return;
    }
    if (!canViewTransition) {       // 老浏览器：交给下面的 pointerdown + 类过渡
      armSwitch();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (vtRunning) {                // 连点：不再排队，直接切（此时页面已在淡入淡出）
      replayClick(btn);
      return;
    }
    vtRunning = true;
    inViewTransition = true;
    var vt;
    try {
      vt = document.startViewTransition(function () { replayClick(btn); });
    } catch (err) {                 // 极少数情况下 VT 不可用，退回普通切换
      vtRunning = false;
      inViewTransition = false;
      replayClick(btn);
      return;
    }
    var settle = function () {
      vtRunning = false;
      inViewTransition = false;
    };
    if (vt && vt.finished && vt.finished.then) {
      vt.finished.then(settle, settle);
    } else {
      setTimeout(settle, 260);
    }
  }, true);

  document.addEventListener('pointerdown', function (e) {
    if (canViewTransition) return;  // VT 路径不需要预挂类
    var t = e.target;
    if (t && t.closest && t.closest(THEME_BTN)) armSwitch();
  }, { capture: true, passive: true });

  try {
    new MutationObserver(function () {
      /* VT 正在接管这一轮切换：不要再挂类，否则等于白算一遍全文档 */
      if (inViewTransition) return;
      runSwitch();
    }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (err) { /* 老浏览器忽略 */ }

  /* ------------------------------------------------------------------
   * 键盘可达性：主题里有几个「div 型按钮」（搜索按钮、汉堡菜单）没有
   * tabindex，键盘根本 focus 不到，自然也就没有 focus 态。这里补上
   * tabindex / role，并把 Enter / Space 映射成 click。
   * data-f-key 去重，pjax 换页后重新扫一遍即可。
   * ------------------------------------------------------------------ */
  var DIV_BTNS = ['#search-button', '#spNavBtn', '#toggle-menu'];

  function makeFocusable() {
    for (var i = 0; i < DIV_BTNS.length; i++) {
      var list = document.querySelectorAll(DIV_BTNS[i]);
      for (var k = 0; k < list.length; k++) {
        (function (el) {
          if (el.getAttribute('data-f-key') === '1') return;
          el.setAttribute('data-f-key', '1');
          el.setAttribute('tabindex', '0');
          el.setAttribute('role', 'button');
          el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
              e.preventDefault();
              el.click();
            }
          });
        })(list[k]);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', makeFocusable);
  } else {
    makeFocusable();
  }
  document.addEventListener('pjax:complete', makeFocusable);
})();
