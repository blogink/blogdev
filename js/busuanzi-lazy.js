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
!function(){var e="data-bsz-lazy",n=['[id^="busuanzi_value_"]',"#post-info .post-meta-pv-cv span[id]",".card-webinfo .item-count[id]"].join(", "),t=/^(umami|runtimeshow|last-push-date)/i;function o(){var o="pending"===window.__bszLazyState,d=window.__bszHolder,i=!!(d&&d.isConnected);if(!o&&!i){var a=function(){for(var e=document.querySelectorAll(n),o=0;o<e.length;o++)if(!t.test(e[o].id||""))return e[o];return null}();if(a){window.__bszLazyState="pending",window.__bszHolder=a;for(var r=document.querySelectorAll("script["+e+"]"),u=0;u<r.length;u++)r[u].parentNode&&r[u].parentNode.removeChild(r[u]);var s=document.createElement("script");s.async=true,s.src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js",s.setAttribute(e,""),s.onload=function(){s.parentNode&&(window.__bszLazyState="done")},s.onerror=function(){s.parentNode&&(window.__bszLazyState="idle",window.__bszHolder=null)},document.body.appendChild(s)}}}"complete"===document.readyState?o():window.addEventListener("load",o,{once:true}),window.__bszLazyBound||(window.__bszLazyBound=true,document.addEventListener("pjax:complete",o))}();