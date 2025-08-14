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
//document.addEventListener("DOMContentLoaded", function () {
//    const url = "https://60s.viki.moe/?v2=1"; // 将此处替换为实际的 JSON URL
// https://api.southerly.top/api/60s?format=json

// 获取新闻数据的函数
async function getNews60s() {
    const url = "https://60s.viki.moe/60s?v2=1"; // 请替换为您的JSON数据链接
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