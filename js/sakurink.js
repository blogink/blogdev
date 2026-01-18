/*Aplayer默认关闭歌词
function removelrc() {
  // 检测是否存在歌词按钮
  const lrcIcon = document.querySelector(".aplayer-icon-lrc");
  if (!lrcIcon) {
    return;
  }

  // 触发以后立刻移除监听
  observer.disconnect();

  // 稍作延时保证触发函数时存在按钮
  setTimeout(() => {
    // 以触发按钮的方式隐藏歌词，防止在点击显示歌词按钮时需要点击两次才能出现的问题
    lrcIcon.click();
  }, 1);

  console.log("success");
}

const observer = new MutationObserver((mutationsList, observer) => {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      removelrc();
    }
  }
});

const observerConfig = {
  childList: true, // 观察子节点的变化
  subtree: true, // 观察所有后代节点的变化
};

observer.observe(document, observerConfig); // 开始观察document节点的变化
*/


/*进入离开页面时修改标题*/
var originTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        document.title = 'w(ﾟДﾟ)w不要走啊！！！ ' + originTitle;
        if (titleTime != null) {
            clearTimeout(titleTime);
        }
    } else {
        document.title = 'ヾ(^▽^*)))欢迎回来！ ' + originTitle;
        titleTime = setTimeout(function () {
            document.title = originTitle;
        }, 2000);
    }
});

//window.addEventListener("pjax:complete",rightsideAddon);//后面几次，pjax加载
////window.addEventListener("DOMContentLoaded",rightsideAddon);//第一次
//function rightsideAddon(){

//  // 获取位置
//  const darkmode = document.getElementById("darkmode");
//  const translateLink = document.getElementById("translateLink");

//  // 创建一个按钮元素
//  const button1 = document.createElement("button");
//  button1.id = "c2";
//  button1.type = "button";
//  button1.textContent = "222";

//  const button2 = document.createElement("button");
//  button2.id = "c4";
//  button2.type = "button";
//  button2.innerHTML = '<i class="fas fa-sync-alt"/>';

//  // 插入按钮，若相对 position 字符串相同，则渲染时元素顺序与此处的相同
//  //darkmode.insertAdjacentElement("afterend", button);
//  translateLink.insertAdjacentElement("beforebegin", button1);
//  darkmode.insertAdjacentElement("afterend", button2);

//  button1.addEventListener("click", function() {
//    // 执行类似于 HTML 中的 onclick="toggleWinbox()" 的功能
//    toggleWinbox();
//  });
//  button2.addEventListener("click", function() {
//    // 执行类似于 HTML 中的 onclick="toggleWinbox()" 的功能
//    location.reload();
//  });
//}
//rightsideAddon();

/*
window.addEventListener("pjax:complete",rightsideAddon);//后面几次，pjax加载
//window.addEventListener("DOMContentLoaded",rightsideAddon);//第一次
function rightsideAddon(){

  // 获取位置
  const rightsideConfigShow = document.getElementById("rightside-config-show");
  const rightsideConfigHide = document.getElementById("rightside-config-hide");
  const darkmode = document.getElementById("darkmode");
  const translateLink = document.getElementById("translateLink");

  // 创建一个按钮元素
  const buttonSetbg = document.createElement("button");
  buttonSetbg.id = "setbg";
  buttonSetbg.type = "button";
  buttonSetbg.title = "背景更换"
  buttonSetbg.innerHTML = '<i class="fas fa-image" />';

  const buttonRefresh = document.createElement("button");
  buttonRefresh.id = "refresh";
  buttonRefresh.type = "button";
  buttonRefresh.title = "刷新页面"
  buttonRefresh.innerHTML = '<i class="fas fa-sync-alt"/>';

  // 插入按钮
  //darkmode.insertAdjacentElement("afterend", button);
  translateLink.insertAdjacentElement("beforebegin", buttonSetbg);
  translateLink.insertAdjacentElement("beforebegin", buttonRefresh);

  buttonSetbg.addEventListener("click", function() {
    // 执行类似于 HTML 中的 onclick="toggleWinbox()" 的功能
    toggleWinbox();
  });
  buttonRefresh.addEventListener("click", function() {
    location.reload();
  });

  //更改元素颜色
  //rightsideConfig.style.backgroundColor = "red"

  // 元素换位
  //const rightsideConfig = document.getElementById("rightside-config");
  //const goUpButton = document.getElementById("go-up");
  //rightsideConfig.parentNode.insertBefore(darkmode, rightsideConfig);

}
rightsideAddon();
*/
/* sidebar 乾坤大挪移（移动端只移动特定子元素）
(function () {
  const MOBILE_MAX_WIDTH = 768;
  const TARGET_WRAPPER_ID = 'mobile-aside-wrapper';
  const TARGET_CONTENT_ID = 'mobile-aside-content'; // 避免ID重复

  function initTargetContainer() {
    const sidebarMenus = document.getElementById('sidebar-menus');
    if (!sidebarMenus) return null;

    // 创建/获取目标容器结构
    let wrapper = document.getElementById(TARGET_WRAPPER_ID);
    if (!wrapper) {
      wrapper = Object.assign(document.createElement('div'), {
        id: TARGET_WRAPPER_ID,
        className: 'mobile-aside-wrapper'
      });

      const contentContainer = Object.assign(document.createElement('div'), {
        id: TARGET_CONTENT_ID,
        className: 'mobile-aside-content'
      });
      
      wrapper.appendChild(contentContainer);
      sidebarMenus.appendChild(wrapper); // 插入到sidebar-menus内部
    }
    return wrapper.querySelector(`#${TARGET_CONTENT_ID}`);
  }

  function moveAsideContent() {
    const isMobile = window.innerWidth <= MOBILE_MAX_WIDTH;
    const originalContainer = document.querySelector('#content-inner > #aside-content');
    const targetContainer = initTargetContainer();
    
    if (!originalContainer || !targetContainer) return;

    // 1. 先清空目标容器（桌面端时还原元素）
    while (targetContainer.firstChild) {
      originalContainer.appendChild(targetContainer.firstChild);
    }

    // 2. 移动端：移动符合条件的子元素
    if (isMobile) {
      // 从后往前遍历（避免DOM变化影响）
      Array.from(originalContainer.children).reverse().forEach(child => {
        const hasCardWidget = child.classList.contains('card-widget');
        const hasStickyLayout = child.classList.contains('sticky_layout');
        
        // 只移动含card-widget且不含sticky_layout的直接子元素
        if (hasCardWidget && !hasStickyLayout) {
          targetContainer.prepend(child); // 保持原始顺序
        }
      });
    }
  }

  // 初始加载
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', moveAsideContent);
  } else {
    moveAsideContent();
  }

  // 监听窗口变化
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(moveAsideContent, 150);
  });
})(); */

/*
function cssConModuleOn() {

  const supportsHas = CSS.supports('selector(:has(*))')

  // 若浏览器不支持:has()
  if (!supportsHas) {

    console.log("您的浏览器不支持 :has()，尝试备用方案");

    const srMusicPage = document.getElementById('srMusic-page');

    if (srMusicPage) {

      console.log("MusicPage 已加载，启用兼容方案");

      const page = document.querySelector("#page");
      if (page) {
      console.log("实际执行");
        // 对 #page 进行操作
        page.style.border = "0";
        page.style.boxShadow = "none";
        page.style.padding = "0";
        page.style.background = "transparent";
      }

      const srMusicBg = document.getElementById("srMusic_bg");
      if (srMusicBg) {
        srMusicBg.style.display = "block";
      }

      // 对 #web_bg 进行操作
      const webBg = document.querySelector("#web_bg");
      if (webBg) {
        webBg.style.display = "none";
      }

      // 对 #nav 进行操作
      const nav = document.querySelector("#nav");
      if (nav) {
        nav.style.background = "transparent";
        nav.style.boxShadow = "none";
      }

      // 对 #content-inner 进行操作
      const contentInner = document.querySelector("#content-inner");
      if (contentInner) {
        contentInner.style.padding = "10px 15px";
      }

      // 对 #footer 进行操作
      const footer = document.querySelector("#footer");
      if (footer) {
        footer.style.display = "none";
      }

      // 对 .aplayer .aplayer-info .aplayer-controller .aplayer-time .aplayer-icon.aplayer-icon-loop 进行操作
      const aplayerIconLoop = document.querySelector(".aplayer .aplayer-info .aplayer-controller .aplayer-time .aplayer-icon.aplayer-icon-loop");
      if (aplayerIconLoop) {
        aplayerIconLoop.style.marginRight = "15px";
      }

      // 媒体查询：如果屏幕宽度小于768px，对 #rightside 进行操作
      const rightSide = document.querySelector("#rightside");
      if (window.matchMedia("(max-width: 768px)").matches && rightSide) {
        rightSide.style.display = "none";
      }

    }
  } else {
     console.log("【加载兼容】您的浏览器支持 :has()，无需使用备用方案");
  }
}

function cssConModuleOff() {

  const supportsHas = CSS.supports('selector(:has(*))')

  // 若浏览器不支持:has()
  if (!supportsHas) {

    console.log("当前非 MusicPage，兼容方案恢复");

    const page = document.querySelector("#page");
    if (page) {
      page.style.border = "";
      page.style.boxShadow = "";
      page.style.padding = "";
      page.style.background = "";
    }

    const srMusicBg = document.querySelector("#srMusic_bg");
    if (srMusicBg) {
      srMusicBg.style.display = "";
    }

    const webBg = document.querySelector("#web_bg");
    if (webBg) {
      webBg.style.display = "";
    }

    const nav = document.querySelector("#nav");
    if (nav) {
      nav.style.background = "";
      nav.style.boxShadow = "";
    }

    const contentInner = document.querySelector("#content-inner");
    if (contentInner) {
      contentInner.style.padding = "";
    }

    const footer = document.querySelector("#footer");
    if (footer) {
      footer.style.display = "";
    }

    const aplayerIconLoop = document.querySelector(".aplayer .aplayer-info .aplayer-controller .aplayer-time .aplayer-icon.aplayer-icon-loop");
    if (aplayerIconLoop) {
      aplayerIconLoop.style.marginRight = "";
    }

    const rightSide = document.querySelector("#rightside");
    if (window.matchMedia("(max-width: 768px)").matches && rightSide) {
      rightSide.style.display = "";
    }
  } else {
     console.log("【恢复】您的浏览器支持 :has()，无需使用备用方案");
  }
}*/
/*
播放器正在播放时：
srMusicBox.aplayer.on('play', function () {
  //事件
});

播放器开始播放：srMusicBox.aplayer.play();

播放器停止播放：srMusicBox.aplayer.pause();



      let isKeyDown = false; // 跟踪空格键是否被按下
      if (event.code === "Space" && !isKeyDown) {
        event.preventDefault();
        if (srMusicBox.aplayer.audio.paused) {
          srMusicBox.aplayer.play(); // 播放
          isKeyDown = true; // 设置状态为已按下
        } else {
          srMusicBox.aplayer.pause(); // 暂停
          isKeyDown = true; // 设置状态为已按下
        }
        setTimeout(() => {
          isKeyDown = false; // 重置为未按下状态
        }, 500);
      };


  let isPlaying = false; // 记录音乐是否正在播放
  if (srMusicBox) {
    document.addEventListener("keydown", function (event) {
      if (event.code === "Space") {
        event.preventDefault();
        
        if (!isPlaying) {
          srMusicBox.aplayer.play(); // 播放
          isPlaying = true; // 更新状态
          console.log('音乐开始播放');
        } else {
          srMusicBox.aplayer.pause(); // 暂停
          isPlaying = false; // 更新状态
          console.log('音乐已暂停');
        }
      };

if (event.code === "Space") {
  event.preventDefault();
  srMusicBox.aplayer.toggle();
};
*/


/*function checkSrMusicBox() {
  const srMusicBox = document.querySelector('#srMusic-page meting-js');
  var volume = srMusicBox.aplayer.audio.volume;
  if (srMusicBox) {
    document.addEventListener("keydown", function (event) {
      if (event.code === "Space") {
        event.preventDefault();
        srMusicBox.aplayer.toggle();
      };

      //切换下一曲
      if (event.keyCode === 39) {
        event.preventDefault();
        srMusicBox.aplayer.skipForward();

      };
      //切换上一曲
      if (event.keyCode === 37) {
        event.preventDefault();
        srMusicBox.aplayer.skipBack();

      }
      // 增加音量
      if (event.keyCode === 38) {
        event.preventDefault();
        if (volume < 1) {
          volume = Math.min(volume + 0.05, 1);
          srMusicBox.aplayer.volume(volume, true);
        }
      }

      // 减小音量
      if (event.keyCode === 40) {
        event.preventDefault();
        if (volume > 0) {
          volume = Math.max(volume - 0.05, 0);
          srMusicBox.aplayer.volume(volume, true);
        }
      }
    });
  }
}
*/
/*
function displayVolume() {
    const srMusicBox = document.querySelector('#srMusic-page meting-js');
    // 找到需要插入元素的父元素
    const aplayerVolumeBar = document.querySelector('#srMusic-page meting-js .aplayer-volume-bar');

    // 创建一个新的元素用于显示音量
    const volumeDisplay = document.createElement('div');
    
    // 设置初始的音量显示
    volumeDisplay.textContent = `${Math.round(srMusicBox.aplayer.audio.volume * 100)}%`;
    
    // 将音量显示插入到父元素的第一个子元素前面
    if (aplayerVolumeBar.firstChild) {
        aplayerVolumeBar.insertBefore(volumeDisplay, aplayerVolumeBar.firstChild);
    } else {
        aplayerVolumeBar.appendChild(volumeDisplay);
    }

    // 定义一个更新音量的函数
    function updateVolume() {
        volumeDisplay.textContent = `${Math.round(srMusicBox.aplayer.audio.volume * 100)}%`;
    }

    // 设定音量变化的监听器
    srMusicBox.aplayer.audio.addEventListener('volumechange', updateVolume);
}
*/

/*var srMusicPageMain = {
  // 音乐节目切换背景
  changeMusicBg: function (isChangeBg = true) {
    if (window.location.pathname !== "/music/") {
      console.log("非 music 页");
      cssConModuleOff();
      return;
    }

    function srMusicBgAddon() {
      const srMusicBg = document.getElementById("srMusic_bg");
      const originalWebBg = document.getElementById("web_bg");

      if (!srMusicBg) {
        const srMusicBg = document.createElement("div");
        srMusicBg.id = "srMusic_bg";
        srMusicBg.style.transition = "background-image 1s ease"; // 添加过渡效果

        // 使用 insertBefore 方法
        if (originalWebBg.nextSibling) {
          originalWebBg.parentNode.insertBefore(srMusicBg, originalWebBg.nextSibling);
        } else {
          // 如果没有下一个兄弟节点，直接添加到父元素的末尾
          originalWebBg.parentNode.appendChild(srMusicBg);
        }
      }
    }

    srMusicBgAddon();

    const srMusicBg = document.getElementById("srMusic_bg");

    if (isChangeBg) {
      // player listswitch 会进入此处
      const musiccover = document.querySelector("#srMusic-page .aplayer-pic");
      srMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
    } else {
      // 第一次进入，绑定事件，改背景
      const observer = new MutationObserver(() => {
        cssConModuleOn();
        const musiccover = document.querySelector("#srMusic-page .aplayer-pic");
        // 确保player加载完成
        console.info("已加载",srMusicBg);
        if (musiccover) {
          observer.disconnect();
          srMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
          srMusicPageMain.addEventListenerChangeMusicBg();

          const aplayerBgMusic = document.querySelector('.aplayerBgMusic');
          if (aplayerBgMusic) {
            // 隐藏 meting-js 元素
            aplayerBgMusic.style.display = 'none';
            if (aplayerBgMusic.aplayer) {
              aplayerBgMusic.aplayer.pause();
            }
          }
        }
      });

      // 开始观察目标节点的变化
      observer.observe(document.querySelector("#srMusic-page"), {
        childList: true,
        subtree: true
      });
    }
  },
  addEventListenerChangeMusicBg: function () {
    console.log("检测到 music 页");
    //checkSrMusicBox();
    //displayVolume();

    const srMusicPage = document.getElementById("srMusic-page");
    const aplayerIconMenu = srMusicPage.querySelector(".aplayer-info .aplayer-time .aplayer-icon-menu");

    srMusicPage.querySelector("meting-js").aplayer.on("loadeddata", function () {
      srMusicPageMain.changeMusicBg();
      console.info("player loadeddata");
    });
  }
};

// 调用
srMusicPageMain.changeMusicBg(false);
*/

/* 插入按钮方式2 */
/*
window.addEventListener("pjax:complete", spElementsAddon);

function spElementsAddon() {
    const rightsideConfig = document.getElementById("rightside-config");
    const settingSPanelBtn = document.getElementById("SPanel");

    // 检查按钮是否已存在
    if (!settingSPanelBtn) {
        const buttonSPanel = document.createElement("button");
        buttonSPanel.id = "SPanel";
        buttonSPanel.type = "button";
        buttonSPanel.title = "控制面板";
        buttonSPanel.innerHTML = '<i class="fas fa-gears"></i>';

        // 使用 insertBefore 方法
        if (rightsideConfig.parentNode) {
            rightsideConfig.parentNode.insertBefore(buttonSPanel, rightsideConfig);
        }

        buttonSPanel.addEventListener("click", function() {
            openPanel();
        });
    }
}

// 初始化调用
spElementsAddon();
*/

// 获取要插入新元素的目标元素
/*const searchButton = document.getElementById('search-button');

// 创建新元素
const newElement = document.createElement('div');
newElement.textContent = '这是新插入的元素';

// 插入新元素
if (searchButton.nextSibling) {
    searchButton.parentNode.insertBefore(newElement, searchButton.nextSibling);
} else {
    // 如果没有下一个兄弟节点，直接添加到父元素的末尾
    searchButton.parentNode.appendChild(newElement);
}*/

function NavElementsAddon() {
    const searchButton = document.querySelector("#nav > #menus > #search-button");
    /*const darkModeNavBtnExist = document.getElementById("darkModeNavBtn");*/
    const spNavBtnExist = document.getElementById("spNavBtn");

    /*if (!darkModeNavBtnExist) {
        const darkModeNavBtn = document.createElement("div");
        darkModeNavBtn.id = "darkModeNavBtn";
        darkModeNavBtn.type = "button";
        darkModeNavBtn.title = "深色模式";
        darkModeNavBtn.innerHTML = '<span class="site-page social-icon dark"><i class="fas fa-adjust"></i></span>';

        // 使用 insertBefore 方法
        if (searchButton.nextSibling) {
            searchButton.parentNode.insertBefore(darkModeNavBtn, searchButton.nextSibling);
        } else {
            // 如果没有下一个兄弟节点，直接添加到父元素的末尾
            searchButton.parentNode.appendChild(darkModeNavBtn);
        }

        darkModeNavBtn.addEventListener("click", function() {
            sps.switchDarkMode();;
        });
    };*/
    
    // 检查按钮是否已存在
    if (!spNavBtnExist) {
        const spNavBtn = document.createElement("div");
        spNavBtn.id = "spNavBtn";
        spNavBtn.type = "button";
        spNavBtn.title = "控制面板";
        spNavBtn.innerHTML = '<span class="site-page social-icon dash"><i class="fas fa-gears"></i></span>';

        // 使用 insertBefore 方法
        if (searchButton.nextSibling) {
            searchButton.parentNode.insertBefore(spNavBtn, searchButton.nextSibling);
        } else {
            // 如果没有下一个兄弟节点，直接添加到父元素的末尾
            searchButton.parentNode.appendChild(spNavBtn);
        }

        spNavBtn.addEventListener("click", function() {
            openPanel();
        });
    };

}

// 初始化调用
//NavElementsAddon();

window.addEventListener("pjax:complete", NavElementsAddon);
document.addEventListener("DOMContentLoaded", NavElementsAddon);

/* 评论区侧栏弹出：https://akilar.top/posts/397b8b90/ */
/*
//移除FixedComment类，保持原生样式，确保不与最新评论跳转冲突
function RemoveFixedComment() {
  var activedItems = document.querySelectorAll('.fixedcomment');
  if (activedItems) {
    for (i = 0; i < activedItems.length; i++) {
      activedItems[i].classList.remove('fixedcomment');
    }
  }
}
//给post-comment添加fixedcomment类
function AddFixedComment(){
  var commentBoard = document.getElementById('post-comment');
  var quitBoard = document.getElementById('quit-board');
  commentBoard.classList.add('fixedcomment');
  quitBoard.classList.add('fixedcomment');
}
//创建一个蒙版，作为退出键使用
function CreateQuitBoard(){
  var quitBoard = `<div id="quit-board" onclick="RemoveFixedComment()"></div>`
  var commentBoard = document.getElementById('post-comment');
  commentBoard.insertAdjacentHTML("beforebegin",quitBoard)
}

function FixedCommentBtn(){
  //第一步，判断当前是否存在FixedComment类，存在则移除，不存在则添加
  // 获取评论区对象
  var commentBoard = document.getElementById('post-comment');
  // 若评论区存在
  if (commentBoard) {
      // 判断是否存在fixedcomment类
      if (commentBoard.className.indexOf('fixedcomment') > -1){
        // 存在则移除
        RemoveFixedComment();
      }
      else{
        // 不存在则添加
        CreateQuitBoard();
        AddFixedComment();
      }
  }
  // 若不存在评论区则跳转至留言板(留言板路径记得改为自己的)
  else{
    // 判断是否开启了pjax，尽量不破坏全局吸底音乐刷新
      if (pjax){
        pjax.loadUrl("/comments/#post-comment");
      }
      else{
        window.location.href = "/comments/#post-comment";
      }
  }
}
//切换页面先初始化一遍，确保开始时是原生状态。所以要加pjax重载。
RemoveFixedComment();


window.addEventListener("pjax:complete", rightsideAddon);

function rightsideAddon() {
    const rightsideConfig = document.getElementById("rightside-config");
    const settingfixedCommentBtn = document.getElementById("fixedComment");

    // 检查按钮是否已存在
    if (!settingfixedCommentBtn) {
        const buttonfixedComment = document.createElement("button");
        buttonfixedComment.id = "fixedComment";
        buttonfixedComment.type = "button";
        buttonfixedComment.title = "评论悬浮框";
        buttonfixedComment.innerHTML = '<i class="fas fa-comments"></i>';

        // 使用 insertBefore 方法
        if (rightsideConfig.parentNode) {
            rightsideConfig.parentNode.insertBefore(buttonfixedComment, rightsideConfig);
        }

        buttonfixedComment.addEventListener("click", function() {
            FixedCommentBtn();
        });
    }
}

// 初始化调用
rightsideAddon();
*/


/*
//document.addEventListener("DOMContentLoaded", function () {
//    const url = "https://60s.viki.moe/?v2=1"; // 将此处替换为实际的 JSON URL
// https://api.southerly.top/api/60s?format=json

// 获取新闻数据的函数
async function getNews60s() {
    const url = "https://60s.viki.moe/60s?v2=1"; // 请替换为您的JSON数据链接
    // 备用
    // https://cdn.lylme.com/api/60s/
    // https://60s.viki.moe/60s?v2=1
    // http://api.suxun.site/api/sixs?type=json
    const newsInfoDiv = document.getElementById("news-info");
    const newsMainDiv = document.getElementById("news-main");
    
    // 显示加载信息
    newsInfoDiv.innerHTML = "数据获取中...";
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`错误状态码: ${response.status}`);
        }
        
        const json = await response.json();
        
        // 清空之前的内容
        newsMainDiv.innerHTML = "";

        // 检查并渲染数据，若不存在则显示"无"
        if (document.getElementById("head-image")) {
            const headImageDiv = document.getElementById("head-image");
            headImageDiv.innerHTML = json.data.cover ? `<img src="${json.data.cover}" alt="Head Image">` : "未获取";
        }

        //if (document.getElementById("news-date")) {
        //    const dateDiv = document.getElementById("news-date");
        //    dateDiv.innerHTML = json.data.date ? `<p>${json.data.date}</p>` : "未获取";
        //}

        if (document.getElementById("news-weiyu")) {
            const weiyuDiv = document.getElementById("news-weiyu");
            weiyuDiv.innerHTML = json.data.tip ? `<p>【微语】${json.data.tip}</p>` : "未获取";
        }

        // 控制是否显示序号的变量
        const NewsNumberShow = 1; // 1 表示显示序号，0 表示不显示

        if (document.getElementById("news-main")) {
            const newsList = json.data.news && json.data.news.length > 0 
                ? json.data.news.map((item, index) => {
                    // 根据NewsNumberShow的值决定是否添加序号
                    const indexDisplay = NewsNumberShow === 1 ? `<span>${index + 1}. </span>` : '';
                    return `<div class="news-item">${indexDisplay}${item}</div>`;
                }).join("") 
                : '<div class="news-item">未获取</div>';
            
            newsMainDiv.innerHTML = newsList;
        }

        // 隐藏加载信息
        newsInfoDiv.innerHTML = "";

    } catch (error) {
        // 处理错误并显示错误信息
        newsInfoDiv.innerHTML = `数据获取失败: ${error.message}`;
    }
}

// 检查是否需要获取数据
function checkNews60s() {
    const funcElement = document.getElementById("news60s-func");
    if (funcElement) {
        getNews60s(); // 触发获取数据
    }
}


// 监听pjax完成后触发checkNews60s
document.addEventListener("pjax:complete", checkNews60s);

// 页面加载完成时直接触发checkNews60s函数
document.addEventListener("DOMContentLoaded", checkNews60s);

*/