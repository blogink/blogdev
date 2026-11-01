/*!
 * busuanzi 的「延迟加载替身」。
 *
 * 卡的是谁（这是关键，别搞错）：
 *   真正拖慢 `load` 的不是 busuanzi.pure.mini.js 这个文件，而是它运行时做的事——
 *   它在 DOM 里再插一个 <script src="//busuanzi.ibruce.info/busuanzi?jsonpCallback=…">
 *   去官方接口取数。**解析期插入的脚本同样计入 `load` 的等待集**，接口一慢/一挂，
 *   load 就一直不来。
 *
 *   所以「把 busuanzi.js 换个更快的 CDN」没用：文件本身才几十 KB，秒下；换了之后
 *   它照样会在 load 之前去敲 ibruce.info，等待集里那一项一字节都没少。
 *   唯一有效的是**改变执行时机**——让这个文件在 load 之后才第一次执行，
 *   那时它再插什么都与 load 无关了。
 *
 * 为什么非要处理：主题的本地搜索把初始化整个包在 `load` 里
 *   （themes/butterfly/source/js/search/local-search.js 末尾
 *    `window.addEventListener('load', () => { … searchClickFn() … })`），
 *   于是 load 不来 = 搜索按钮点了完全没反应。统计组件「不影响普通访问」是真的，
 *   但它顺手把搜索一起带走了——这才是必须处理的理由。同理 Pace 以 load 为终点，
 *   它也会把进度条钉在 99%。
 *
 * 怎么不改主题源码：
 *   Butterfly 自己留了钩子。additional-js.pug 里是
 *     src=theme.asset.busuanzi ? url_for(theme.asset.busuanzi) : '<默认 CDN>'
 *   站点配置的 CDN.option 会合并进 theme.asset（主题 scripts/events/cdn.js），
 *   于是 _config.butterfly.yml 里一行
 *     CDN.option.busuanzi: /js/busuanzi-lazy.js
 *   就让主题来加载本文件，再由本文件在 load 之后去抓真正的计数脚本。主题目录
 *   一个字节都没动，升级照旧。
 */
(function () {
  var SRC = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  var ATTR = 'data-bsz-lazy';

  // 去重不是靠时间窗。换页时「pjax 重放带 data-pjax 的脚本」和「本文件挂的
  // pjax:complete 监听」是两条独立路径，谁先到不一定；用 500ms 时间窗去重，
  // 慢机上第二次执行晚于窗口就会重复请求（busuanzi 侧多记一次 PV）。
  // 这里改用「计数占位节点」的引用做身份比对：pjax 换页会把占位整块换掉，
  // 旧节点脱离文档（isConnected 变 false），据此判断是新的页面视图。
  // 状态只用来防同一 tick 内的并发，不承担跨页判断。
  function inject() {
    var busy = window.__bszLazyState === 'pending';
    var el = window.__bszHolder;
    var samePage = !!(el && el.isConnected);

    if (busy || samePage) return;

    var holder = document.getElementById('busuanzi_value_site_pv') ||
                 document.getElementById('busuanzi_value_site_uv') ||
                 document.getElementById('busuanzi_value_page_pv');
    // 页面上没有计数占位（例如自定义页面）就不必请求，省一次跨域请求。
    if (!holder) return;

    window.__bszLazyState = 'pending';
    window.__bszHolder = holder;

    // 换页重跑时先摘掉上一轮的实例：busuanzi 每次执行都会重写页面上的计数，
    // 留着多份只会互相打架。
    var old = document.querySelectorAll('script[' + ATTR + ']');
    for (var i = 0; i < old.length; i++) {
      if (old[i].parentNode) old[i].parentNode.removeChild(old[i]);
    }

    var s = document.createElement('script');
    s.async = true;
    s.src = SRC;
    s.setAttribute(ATTR, '');
    s.onload = function () {
      // 只认还在文档里的那一份：上一轮被摘掉的实例若迟到的回调命中，不该改状态。
      if (s.parentNode) window.__bszLazyState = 'done';
    };
    // 失败就退回 idle：下次换页还能再试，而不是整轮会话都不再计数。
    s.onerror = function () {
      if (!s.parentNode) return;
      window.__bszLazyState = 'idle';
      window.__bszHolder = null;
    };
    document.body.appendChild(s);
  }

  // 首次加载：等 load。pjax 换页时 readyState 已是 complete，会立刻走 inject()。
  if (document.readyState === 'complete') inject();
  else window.addEventListener('load', inject, { once: true });

  // 换页：本文件由 inject.bottom 注入，不在 .js-pjax 替换区内，主题给的那个
  // data-pjax 对它是空转的（脚本不会被重新执行）。而计数占位
  // （#busuanzi_value_page_pv）在换页后是新节点、内容是空的，不重跑就一直空着。
  // 所以自己监听 pjax:complete 重放一次。
  document.addEventListener('pjax:complete', inject);
})();
