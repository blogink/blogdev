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
!function(){var e="data-bsz-lazy";function n(){var n="pending"===window.__bszLazyState,t=window.__bszHolder,d=!!(t&&t.isConnected);if(!n&&!d){var o=document.getElementById("busuanzi_value_site_pv")||document.getElementById("busuanzi_value_site_uv")||document.getElementById("busuanzi_value_page_pv");if(o){window.__bszLazyState="pending",window.__bszHolder=o;for(var a=document.querySelectorAll("script["+e+"]"),i=0;i<a.length;i++)a[i].parentNode&&a[i].parentNode.removeChild(a[i]);var u=document.createElement("script");u.async=true,u.src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js",u.setAttribute(e,""),u.onload=function(){u.parentNode&&(window.__bszLazyState="done")},u.onerror=function(){u.parentNode&&(window.__bszLazyState="idle",window.__bszHolder=null)},document.body.appendChild(u)}}}"complete"===document.readyState?n():window.addEventListener("load",n,{once:true}),document.addEventListener("pjax:complete",n)}();