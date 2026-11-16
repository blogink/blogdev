/*!
 * kinetic.js · 动效层的「时机」控制（配套 kinetic.css，约 190 行）
 * ---------------------------------------------------------------------------
 * 分工：CSS 定义「长什么样」（进场 / 离场 / 头图幽灵的时长与曲线都在 CSS 里），
 *       本文件只回答四件事：
 *         1. 什么时候挂 `kt-out`（离场）—— 现在带 150ms 闸门
 *         2. 什么时候挂 `kt-nav` / `kt-back`（抑制主题入场 / 后退不播入场）
 *         3. 换页时放不放「旧头图幽灵」（做几何或图片变化时的交叉淡化）
 *         4. 换页后的滚动落点：前进回顶、后退恢复位置
 *       外加一条首页专属的滚轮翻页（一次滚轮越过 full_page 头图）。
 * ---------------------------------------------------------------------------
 * 为什么进场动画不用脚本播：CSS animation 在节点首次渲染时自己就播了，时机最好；
 *   换成 JS 调 animate()，只要浏览器在 defer 脚本执行前画过一帧，就会看到
 *   「内容先出现 → 再消失 → 再淡入」。
 * 为什么离场要闸门：`pjax:send` 是**请求发出**的时刻，不是内容换掉的时刻。
 *   原来在这里立刻淡出，冷缓存 / 弱网下会「先擦干净再对着壁纸等几百毫秒」，
 *   是全站最不像 APP 的一瞬。现在 150ms 内响应回来就根本不淡，直接换页。
 * 为什么自己接管滚动：pjax 在派发 `pjax:complete` **之后**才 `window.scrollTo(0,0)`，
 *   所以在事件里调 smooth 会被它紧接着的瞬移覆盖；而且它不做「返回恢复位置」。
 *   改法是把 `window.pjax.options.scrollTo` 置 false（运行时，不改主题），
 *   位置由本文件记。
 * 不挂 data-pjax：监听器全在 document / window 上，换页后不需要重新绑定。
 */
!function(){"use strict";if(!window.__kinetic){window.__kinetic=true;var e=document.documentElement,t="kt-out",n="kt-nav",o="kt-back",a=0,i=0,d=0,c=null,s=null,r={},l=false,u=false,m=false,g=location.pathname+location.search;window.addEventListener("popstate",function(){l=true,setTimeout(function(){l=false},50)}),document.addEventListener("pjax:send",function(){!function(){try{r[g]=window.scrollY||0}catch(e){}}(),v(),e.classList.contains(n)||e.classList.add(n),u=l,l=false,u?e.classList.add(o):e.classList.remove(o),function(){if(k(),!f()){var e=document.getElementById("page-header");if(e){var t=window.getComputedStyle(e),n=t.backgroundImage;if(n&&"none"!==n){var o=e.getBoundingClientRect();if(o.height){s={height:o.height,image:n};var a=document.createElement("div");if(a.className="kt-ghost",a.setAttribute("aria-hidden","true"),a.style.top=o.top+"px",a.style.height=o.height+"px",a.style.backgroundImage=n,a.style.backgroundColor=t.backgroundColor,a.style.backgroundSize=t.backgroundSize,a.style.backgroundPosition=t.backgroundPosition,a.style.backgroundRepeat=t.backgroundRepeat,a.style.backgroundAttachment=t.backgroundAttachment,!e.classList.contains("not-top-img")){var i=document.createElement("div");i.className="kt-ghost-mask",a.appendChild(i)}document.body.appendChild(a),c=a}}}}}(),f()||a||(a=setTimeout(function(){a=0,e.classList.add(t),a=setTimeout(p,700)},150))}),document.addEventListener("pjax:complete",function(){if(p(),function(){if(c){var e=document.getElementById("page-header");if(e){var t=e.getBoundingClientRect(),n=window.getComputedStyle(e).backgroundImage;s&&Math.abs(t.height-s.height)<8&&n===s.image?k():(c.classList.add("kt-ghost-out"),i=setTimeout(k,320))}else k()}}(),m){var e=u&&r[h()]||0;try{window.scrollTo(0,e)}catch(e){window.scrollTo(0,0)}}u=false,g=h()}),document.addEventListener("pjax:error",function(){p(),k()}),window.addEventListener("pageshow",function(){p(),k()}),document.addEventListener("DOMContentLoaded",v),window.addEventListener("wheel",function(e){if(!e.defaultPrevented&&!(e.ctrlKey||e.metaKey||e.shiftKey||e.target&&e.target.closest&&e.target.closest("#local-search, .search-dialog, #sidebar-menus, #rightside, #card-toc, .aplayer")||e.deltaY*(1===e.deltaMode?16:2===e.deltaMode?window.innerHeight:1)<=0||(window.scrollY||0)>4||w()<d)){var t=document.getElementById("page-header");if(t&&t.classList.contains("full_page")){var n=document.getElementById("content-inner");if(n){var o=Math.round(n.getBoundingClientRect().top+(window.scrollY||0));o<.6*window.innerHeight||(e.preventDefault(),d=w()+700,function(e){var t=window.scrollY||0;if(f())window.scrollTo(0,e);else{var n=performance.now(),o=function(a){var i=Math.min((a-n)/400,1),d=i<.5?2*i*i:1-Math.pow(-2*i+2,2)/2;window.scrollTo(0,t+(e-t)*d),i<1&&requestAnimationFrame(o)};requestAnimationFrame(o)}}(o))}}}},{passive:false})}function f(){return!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)}function h(){return location.pathname+location.search}function w(){return Date.now()}function p(){a&&(clearTimeout(a),a=0),e.classList.contains(t)&&e.classList.remove(t)}function v(){var e=window.pjax;return!m&&e&&e.options?(e.options.scrollTo=false,m=true,true):m}function k(){i&&(clearTimeout(i),i=0),c&&c.parentNode&&c.parentNode.removeChild(c),c=null,s=null}}();