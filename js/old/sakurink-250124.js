var titleTime,originTitle=document.title;async function getNews60s(){const e=document.getElementById("news-info"),t=document.getElementById("news-main");e.innerHTML="数据获取中...";try{const n=await fetch("https://60s.viki.moe/60s?v2=1");if(!n.ok)throw new Error(`错误状态码: ${n.status}`);const i=await n.json();if(t.innerHTML="",document.getElementById("head-image")){document.getElementById("head-image").innerHTML=i.data.cover?`<img src="${i.data.cover}" alt="Head Image">`:"未获取"}if(document.getElementById("news-weiyu")){document.getElementById("news-weiyu").innerHTML=i.data.tip?`<p>【微语】${i.data.tip}</p>`:"未获取"}const d=1;if(document.getElementById("news-main")){const e=i.data.news&&i.data.news.length>0?i.data.news.map(((e,t)=>`<div class="news-item">${1===d?`<span>${t+1}. </span>`:""}${e}</div>`)).join(""):'<div class="news-item">未获取</div>';t.innerHTML=e}e.innerHTML=""}catch(t){e.innerHTML=`数据获取失败: ${t.message}`}}function checkNews60s(){document.getElementById("news60s-func")&&getNews60s()}document.addEventListener("visibilitychange",(function(){document.hidden?(document.title="w(ﾟДﾟ)w不要走啊！！！ "+originTitle,null!=titleTime&&clearTimeout(titleTime)):(document.title="ヾ(^▽^*)))欢迎回来！ "+originTitle,titleTime=setTimeout((function(){document.title=originTitle}),2e3))})),document.addEventListener("pjax:complete",checkNews60s),document.addEventListener("DOMContentLoaded",checkNews60s);