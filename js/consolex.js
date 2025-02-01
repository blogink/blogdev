function openPanel(){const e=document.getElementById("settingPanel"),t=document.getElementById("settingMask");e.classList.contains("spshow")?closePanel():(t.classList.remove("sphide"),t.classList.add("spshow"),setTimeout((()=>{e.classList.remove("sphide"),e.classList.add("spshow")}),20))}function closePanel(){const e=document.getElementById("settingPanel"),t=document.getElementById("settingMask");e.classList.remove("spshow"),e.classList.add("sphide-anim"),t.classList.remove("spshow"),setTimeout((()=>{e.classList.add("sphide"),e.classList.remove("sphide-anim"),t.classList.add("sphide")}),200)}function showItems(){const e=document.getElementById("settingItems");e.classList.remove("hide"),e.classList.remove("fade-out"),e.classList.add("fade-in")}function hideItems(){const e=document.getElementById("settingItems");e.classList.add("fade-out"),setTimeout((()=>{e.classList.add("hide")}),150)}function clearLocalStorage(){localStorage.clear(),location.reload()}function clearBrowserStorage(e,t){document.getElementById(e).addEventListener("click",(function(){t(),this.textContent="已清除",setTimeout((function(){location.reload()}),1e3)}))}function settingAddRemove(e,t){var n=document.querySelector(e);n&&("add"===t?n.style.display="none"===n.style.display||""===n.style.display?"block":n.style.display:"remove"===t&&(n.style.display="block"===n.style.display?"none":n.style.display))}document.getElementById("settingMask").addEventListener("click",closePanel),document.getElementById("settingBackToMain2").onclick=function(){document.getElementById("settingItems").classList.add("fade-out"),document.getElementById("settingBackToMain2").classList.add("hide"),setTimeout((()=>{document.getElementById("settingItems").classList.add("hide"),document.getElementById("settingTabs").classList.remove("hide"),document.getElementById("settingWidget").classList.remove("hide"),document.getElementById("settingMain").scrollTo({top:0,behavior:"smooth"}),setTimeout((()=>{document.getElementById("settingTabs").classList.remove("fade-out"),document.getElementById("settingWidget").classList.remove("fade-out"),document.getElementById("settingTabs").classList.add("fade-in"),document.getElementById("settingWidget").classList.add("fade-in")}),10)}),150)},document.querySelectorAll("#settingTabs button").forEach((e=>{e.onclick=function(){document.getElementById("settingTabs").classList.add("fade-out"),document.getElementById("settingWidget").classList.add("fade-out"),document.getElementById("settingBackToMain2").classList.remove("hide"),setTimeout((()=>{document.getElementById("settingTabs").classList.add("hide"),document.getElementById("settingWidget").classList.add("hide"),document.getElementById("settingItems").classList.remove("hide"),document.querySelectorAll("#settingItems > div").forEach((e=>{e.classList.add("hide")})),document.getElementById(e.id+"-Content").classList.remove("hide"),setTimeout((()=>{document.getElementById("settingItems").classList.remove("fade-out"),document.getElementById("settingItems").classList.add("fade-in"),document.getElementById("settingMain").scrollTo({top:0,behavior:"smooth"})}),10)}),150)}})),document.getElementById("settingScrollToTop").onclick=function(){document.getElementById("settingMain").scrollTo({top:0,behavior:"smooth"})},document.getElementById("settingFullScreen").addEventListener("click",(function(){document.fullscreenElement?document.exitFullscreen().catch((e=>{console.log(`Error attempting to exit full-screen mode: ${e.message} (${e.name})`)})):document.documentElement.requestFullscreen().catch((e=>{console.log(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`)}))})),clearBrowserStorage("clearSessionStorage",(function(){sessionStorage.clear()})),clearBrowserStorage("clearCookies",(function(){document.cookie.split(";").forEach((function(e){document.cookie=e.trim().split("=")[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"}))})),clearBrowserStorage("clearServiceWorkers",(function(){"serviceWorker"in navigator&&navigator.serviceWorker.getRegistrations().then((function(e){for(let t of e)t.unregister()}))})),clearBrowserStorage("clearCaches",(function(){"caches"in window&&caches.keys().then((function(e){for(let t of e)caches.delete(t)}))}));var sps={};function getOrCreateStyleTag(e,t="end"){let n=document.getElementById(e);return n||(n=document.createElement("style"),n.id=e,"start"===t?document.head.insertBefore(n,document.head.firstChild):document.head.appendChild(n)),n}function settingCheckboxBinding(e,t,n,o,a){if("string"!=typeof t||"fffff"!==t&&"ttttt"!==t)console.log(`初始状态值不合法: ${e}`);else{var r=localStorage.getItem(e);null===r?(r="fffff"===t?0:1,localStorage.setItem(e,r)):r=parseInt(r),1===r?o():a(),window[n]=function(){r=r?0:1,localStorage.setItem(e,r),1===r?o():a()},new MutationObserver((function(e){e.forEach((function(e){"childList"===e.type&&s()}))})).observe(document.body,{childList:!0,subtree:!0}),document.addEventListener("DOMContentLoaded",s),document.getElementById("resetSwitches").addEventListener("click",(function(){localStorage.removeItem(e),r="fffff"===t?0:1,localStorage.setItem(e,r),1===r?o():a(),s()}))}function s(){var t=document.getElementById(e);t?(t.checked=1===r,t.onclick=window[n]):console.log(`未找到元素: ${e}`)}}function aplayerMain(){if(!document.getElementById("aplayerScript")){const e=document.querySelector(".aplayerBgMusic");e&&(e.style.display="block")}}function removeAplayer(){const e=document.querySelector(".aplayerBgMusic");e&&(e.style.display="none",e.aplayer&&e.aplayer.pause())}function FPSMain(){if(!document.getElementById("fpsDisplayElement")){const e=document.createElement("div");e.id="fpsDisplayElement",document.body.appendChild(e);let t=performance.now(),n=0;!function o(){const a=performance.now();n++;const r=a-t;if(r>=1e3){const o=Math.round(1e3*n/r);e.innerHTML=`FPS: ${o}`,n=0,t=a}requestAnimationFrame(o)}()}}function removeFPS(){const e=document.getElementById("fpsDisplayElement");e&&e.remove()}function astralMain(){document.getElementById("universe").style.display="block"}function removeAstral(){document.getElementById("universe").style.display="none"}function indexImgMain(){getOrCreateStyleTag("indexImgStyleBox").innerHTML="\n        #site-info {\n            display: block !important;\n        }\n        #scroll-down {\n            display: block !important;\n        }\n        \n    "}function removeIndexImg(){getOrCreateStyleTag("indexImgStyleBox").innerHTML="        #site-info {\n            display: none !important;\n        }\n        #scroll-down {\n            display: none !important;\n        }\n\n        .full_page#page-header {\n            margin-bottom: 10px !important;\n            height: 60px !important;\n            background: 0 !important;\n        }\n        .full_page#page-header #nav {\n            background: rgba(255,255,255,0.8) !important;\n            -webkit-box-shadow: 0 5px 6px -5px rgba(133,133,133,0.6) !important;\n            box-shadow: 0 5px 6px -5px rgba(133,133,133,0.6) !important;\n        }\n        .full_page#page-header #nav a,\n        .full_page#page-header #nav span.site-page,\n        .full_page#page-header #nav .site-name {\n            color: var(--font-color) !important;\n            text-shadow: none !important;\n        }\n        [data-theme='dark'] .full_page#page-header > #nav {\n            background: rgba(18,18,18,0.8) !important;\n            -webkit-box-shadow: 0 5px 6px -5px rgba(133,133,133,0) !important;\n            box-shadow: 0 5px 6px -5px rgba(133,133,133,0) !important;\n        }\n    "}function functionState111(){console.log("func111")}function functionState000(){console.log("func000")}function settingRangeBarBinding(e,t,n,o,a){const r=document.getElementById(e),s=document.getElementById(t);if(!r)return void console.log(`暂无此元素: ${e}`);if(!s)return void console.log(`暂无此元素: ${t}`);const i=localStorage.getItem(n),l=null!==i?i:o||s.value;s.value=l,r.textContent=l;s.addEventListener("input",(()=>{const e=s.value;r.textContent=e,localStorage.setItem(n,e),a&&a(e)}));const c=()=>{s.value=o,localStorage.setItem(n,o),r.textContent=o,a&&a(o)},d=document.getElementById("resetRangeBar"),g=document.getElementById(`resetRangeBar-${t}`);d&&d.addEventListener("click",(()=>{localStorage.removeItem(n),c()})),g&&g.addEventListener("click",c),a&&a(l)}function updateColorBoxSp(e){const t=`rgba(250, 250, 250, ${e/100})`,n=`rgba(10, 10, 10, ${e/100})`;getOrCreateStyleTag("spstyleColorBox").innerHTML=`\n        #settingPanel {\n            background: ${t};\n        }\n        [data-theme="dark"] #settingPanel {\n            background: ${n};\n        }\n    `,console.log("控制台透明度更新为: "+e)}function updateColorBoxSpButton(e){const t=`rgba(150, 150, 150, ${e/100})`,n=`rgba(200, 200, 200, ${e/100})`,o=`rgba(10, 10, 10, ${e/100})`,a=`rgba(120, 120, 120, ${e/100})`;getOrCreateStyleTag("spstyleColorBoxSpButton").innerHTML=`\n        #settingPanel button {\n            background: ${t};\n        }\n        #settingPanel button:hover {\n            background-color: ${n};\n        }\n        [data-theme="dark"] #settingPanel button {\n            background: ${o};\n        }\n        [data-theme="dark"] #settingPanel button:hover {\n            background-color: ${a};\n        }\n    `,console.log("控制台按钮透明度更新为: "+e)}function updateColorSpBgMask(e){const t=`rgba(255, 255, 255, ${e/100})`,n=`rgba(10, 10, 10, ${e/100})`;getOrCreateStyleTag("spstyleColorBoxSPBgMask").innerHTML=`\n        #settingMask {\n            background: ${t};\n        }\n        [data-theme="dark"] #settingMask {\n            background: ${n};\n        }\n    `,console.log("控制台遮罩透明度更新为: "+e)}function settingRadioBinding(e,t){const n=document.querySelectorAll(`input[name="${e}"]`);if(0===n.length)return void console.log(`绑定不规范: 未找到对应的 radio 组，name 为 ${e}`);const o=localStorage.getItem(e)||t;function a(){const o=this.id;if(o.startsWith("resetRadio-")){const e=o.replace("resetRadio-","");document.querySelectorAll(`input[name="${e}"]`).forEach((e=>{e.checked=e.value===t,e.onclick&&e.checked&&e.onclick()})),localStorage.removeItem(e)}else localStorage.removeItem(e),n.forEach((e=>{e.checked=e.value===t,e.onclick&&e.checked&&e.onclick()}))}n.forEach((t=>{t.value===o&&(t.checked=!0,t.onclick&&t.onclick()),t.addEventListener("click",(function(){localStorage.setItem(e,this.value)}))}));const r=document.getElementById("resetRadio"),s=document.getElementById(`resetRadio-${e}`);r&&r.addEventListener("click",a),s&&s.addEventListener("click",a)}function removeLantern(){document.getElementById("lantern");getOrCreateStyleTag("lanternStyleBox").innerHTML="\n        #lantern {\n            display: none !important;\n        }\n    "}function lanternLeft(){document.getElementById("lantern");getOrCreateStyleTag("lanternStyleBox").innerHTML="\n        #lantern {\n            display: block !important;\n        }\n        .lantern-box-1 {\n            left: -20px !important;\n            right: auto !important;\n        }\n        .lantern-box-2 {\n            left: 10px !important;\n            right: auto !important;\n        }\n    "}function lanternRight(){document.getElementById("lantern");getOrCreateStyleTag("lanternStyleBox").innerHTML="\n        #lantern {\n            display: block !important;\n        }\n        .lantern-box-1 {\n            left: auto !important;\n            right: -20px !important;\n        }\n        .lantern-box-2 {\n            left: auto !important;\n            right: -20px !important;\n        }\n    "}function contentInnerBgOp0(){document.getElementById("contentInnerBgOp");getOrCreateStyleTag("contentInnerBgStyleBox").innerHTML='\n        #body-wrap > #content-inner {\n            background-color: transparent !important;\n        }\n        [data-theme="dark"] #body-wrap > #content-inner {\n            background-color: transparent !important;\n        }\n    '}function contentInnerBgOp85(){document.getElementById("contentInnerBgOp");getOrCreateStyleTag("contentInnerBgStyleBox").innerHTML='\n        #body-wrap > #content-inner {\n            background-color: rgba(255,255,255,0.85) !important;\n        }\n        [data-theme="dark"] #body-wrap > #content-inner {\n            background-color: rgba(10,10,10,0.85) !important;\n        }\n    '}function contentInnerBgOp100(){document.getElementById("contentInnerBgOp");getOrCreateStyleTag("contentInnerBgStyleBox").innerHTML='\n        #body-wrap > #content-inner {\n            background-color: var(--tasseles-background) !important;\n        }\n        [data-theme="dark"] #body-wrap > #content-inner {\n            background-color: var(--tasseles-background) !important\n        }\n    '}function radio1Func1(){console.log("选择了 Huey")}function radio1Func2(){console.log("选择了 Dewey")}function radio1Func3(){console.log("选择了 Louie")}function radio2Func1(){console.log("选择了 Huey-2")}function radio2Func2(){console.log("选择了 Dewey-2")}function radio2Func3(){console.log("选择了 Louie-2")}function setFont(e){localStorage.setItem("selectedFont",e),"main"===e?(document.body.style.fontFamily="-apple-system, IBM Plex Mono, monospace, '微软雅黑', sans-serif",document.documentElement.style.removeProperty("--global-font")):(document.body.style.fontFamily="var(--global-font), -apple-system, IBM Plex Mono, monospace, '微软雅黑', sans-serif",document.documentElement.style.setProperty("--global-font",e))}function resetFont(){localStorage.removeItem("selectedFont"),setFont("微软雅黑")}function saveData(e,t){localStorage.setItem(e,JSON.stringify({time:Date.now(),data:t}))}function loadData(e,t){let n=JSON.parse(localStorage.getItem(e));if(n){let e=Date.now()-n.time;if(e<60*t*1e3&&e>-1)return n.data}return 0}sps.switchDarkMode=function(){"light"===("dark"===document.documentElement.getAttribute("data-theme")?"dark":"light")?(btf.activateDarkMode(),btf.saveToLocal.set("theme","dark",2),void 0!==GLOBAL_CONFIG.Snackbar&&btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)):(btf.activateLightMode(),btf.saveToLocal.set("theme","light",2),void 0!==GLOBAL_CONFIG.Snackbar&&btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)),"function"==typeof utterancesTheme&&utterancesTheme(),"object"==typeof FB&&window.loadFBComment(),window.DISQUS&&document.getElementById("disqus_thread").children.length&&setTimeout((()=>window.disqusReset()),200)},document.getElementById("menu-darkmode").onclick=function(){sps.switchDarkMode()},window.addEventListener("DOMContentLoaded",(()=>{settingCheckboxBinding("aplayerOnOff","ttttt","aplayerState",aplayerMain,removeAplayer),settingCheckboxBinding("fpsDisplay","fffff","fpsState",FPSMain,removeFPS),settingCheckboxBinding("universeEffect","fffff","universeState",astralMain,removeAstral),settingCheckboxBinding("indexImgDisplay","ttttt","indexImgState",indexImgMain,removeIndexImg),settingCheckboxBinding("variable1","ttttt","switchState1",functionState111,functionState000)})),window.addEventListener("DOMContentLoaded",(()=>{settingRangeBarBinding("settingBgOp","settingBgOpRange","opacityValueSp","95",updateColorBoxSp),settingRangeBarBinding("settingButtonOp","settingButtonOpRange","opacityValueSpButtons","30",updateColorBoxSpButton),settingRangeBarBinding("settingBgMaskOp","settingBgMaskOpRange","opacityValueSpBgMask","80",updateColorSpBgMask)})),window.addEventListener("DOMContentLoaded",(()=>{settingRadioBinding("lanternDisplay","close"),settingRadioBinding("contentInnerBgOpDisplay","op0"),settingRadioBinding("drone","11111"),settingRadioBinding("drone2","22222")})),null===localStorage.getItem("selectedFont")&&localStorage.setItem("selectedFont","微软雅黑"),setFont(localStorage.getItem("selectedFont")),document.getElementById("resetFont").addEventListener("click",resetFont);try{let e=loadData("blogbg",1440);e?changeBg(e,1):localStorage.removeItem("blogbg")}catch(e){localStorage.removeItem("blogbg")}function changeBg(e,t){let n=document.getElementById("web_bg");"#"==e.charAt(0)?(n.style.backgroundColor=e,n.style.backgroundImage="none"):n.style.backgroundImage=e,t||saveData("blogbg",e)}function resetBg(){document.getElementById("web_bg"),localStorage.getItem("original_blog_bg");localStorage.removeItem("blogbg"),changeBg("url(/img/background_img.jpg)")}function calendarCard(){let e=!1;if(e)return;const t=document.getElementById("sp-cal-calendar"),n=document.getElementById("sp-cal-monthYear"),o=document.getElementById("sp-cal-today"),a=document.getElementById("sp-cal-prevMonth"),r=document.getElementById("sp-cal-nextMonth");let s=new Date;const i=e=>{const o=document.createElement("div");o.className="sp-cal-days-container",o.style.display="flex",o.style.flexWrap="wrap";const a=e.getFullYear(),r=e.getMonth();n.textContent=`${a}年${r+1}月`;const s=new Date(a,r,1),i=(new Date(a,r+1,0),new Date(s));i.setDate(i.getDate()-(0===i.getDay()?6:i.getDay()-1));for(let e=0;e<42;e++){const t=document.createElement("div");t.className="sp-cal-day";const n=new Date(i);n.setDate(i.getDate()+e),n.getMonth()===r?(t.textContent=n.getDate(),n.toDateString()===(new Date).toDateString()&&t.classList.add("sp-cal-current-day")):(t.textContent=n.getDate(),t.classList.add("sp-cal-other-month")),o.appendChild(t)}const l=t.querySelector(".sp-cal-days-container");l&&t.removeChild(l),t.appendChild(o)};a.addEventListener("click",(()=>{s.setMonth(s.getMonth()-1),i(s)})),r.addEventListener("click",(()=>{s.setMonth(s.getMonth()+1),i(s)})),o.addEventListener("click",(()=>{s=new Date,i(s)})),i(s),e=!0}function settingInfo(){const e={userAgent:"获取中",language:"获取中",platform:"获取中",maxTouchPoints:"获取中",referrer:"获取中",browserName:"获取中",osName:"获取中",userAgentDataBrands:"获取中",userAgentDataMobile:"获取中",userAgentDataPlatform:"获取中"};function t(e,t){const n=document.getElementById(e);n&&(n.textContent=t)}try{e.userAgent=navigator.userAgent,t("userAgent",e.userAgent)}catch(e){t("userAgent","未获取")}try{e.language=navigator.language||navigator.userLanguage,t("language",e.language)}catch(e){t("language","未获取")}try{e.platform=navigator.platform,t("platform",e.platform)}catch(e){t("platform","未获取")}try{e.maxTouchPoints=navigator.maxTouchPoints,t("maxTouchPoints",e.maxTouchPoints)}catch(e){t("maxTouchPoints","未获取")}try{e.referrer=document.referrer||"没有引用信息",t("referrer",e.referrer)}catch(e){t("referrer","未获取")}try{navigator.userAgentData?navigator.userAgentData.getHighEntropyValues(["platform","brands","mobile"]).then((n=>{e.userAgentDataBrands=n.brands.map((e=>e.brand+" "+e.version)).join(", "),e.userAgentDataMobile=n.mobile?"True":"False",e.userAgentDataPlatform=n.platform,t("userAgentDataBrands",e.userAgentDataBrands),t("userAgentDataMobile",e.userAgentDataMobile),t("userAgentDataPlatform",e.userAgentDataPlatform)})).catch((()=>{t("userAgentDataBrands","未获取"),t("userAgentDataMobile","未获取"),t("userAgentDataPlatform","未获取")})):(t("userAgentDataBrands","未获取"),e.userAgentDataMobile=/Mobile|Android|iPhone/i.test(userAgent)?"True":"False",t("userAgentDataMobile",e.userAgentDataMobile),t("userAgentDataPlatform","未获取"))}catch(e){t("userAgentDataBrands","未获取"),t("userAgentDataMobile","未获取"),t("userAgentDataPlatform","未获取")}!function(){const e=navigator.userAgent;let n="未获取",o="未获取";n=/Edg\//i.test(e)?"Edge":/OPR\//i.test(e)?"Opera":/Firefox/i.test(e)?"Firefox":/Chrome/i.test(e)?"Chrome":/Safari/i.test(e)?"Safari":e.includes("MSIE")||e.includes("Trident")?"Internet Explorer":e.includes("Baidu")||e.includes("BaiduBrowser")?"Baidu":e.includes("Maxthon")?"Maxthon":e.includes("QQBrowser")?"QQ":e.includes("Sogou")?"搜狗":"Others",/OpenHarmony/i.test(e)||void 0!==window.ohos?o="OpenHarmony":/HarmonyOS|HMOS/i.test(e)?o=/Android/i.test(e)?"HarmonyOS":"HarmonyOS NEXT":/Android/i.test(e)?o="Android":/iPhone|iPad/i.test(e)?o="iOS":/Macintosh/i.test(e)?o="macOS":/Windows/i.test(e)?o="Windows":/CrOS/i.test(e)?o="Chrome OS":/Linux/i.test(e)&&(o="Linux"),t("browserName",n),t("osName",o)}()}document.getElementById("resetBg").onclick=function(){resetBg()},document.addEventListener("DOMContentLoaded",calendarCard),document.addEventListener("pjax:complete",calendarCard),window.addEventListener("DOMContentLoaded",(()=>{settingInfo()}));