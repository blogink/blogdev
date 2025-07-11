/*Aplayer默认关闭歌词*/
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
  const darkmode = document.getElementById("darkmode");
  const translateLink = document.getElementById("translateLink");

  // 创建一个按钮元素
  const buttonSetbg = document.createElement("button");
  buttonSetbg.id = "setbg";
  buttonSetbg.type = "button";
  buttonSetbg.innerHTML = '<i class="fas fa-image" />';

  const buttonRefresh = document.createElement("button");
  buttonRefresh.id = "refresh";
  buttonRefresh.type = "button";
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
    // 执行类似于 HTML 中的 onclick="toggleWinbox()" 的功能
    location.reload();
  });

  // 元素换位
  //const rightsideConfig = document.getElementById("rightside-config");
  //const goUpButton = document.getElementById("go-up");
  //rightsideConfig.parentNode.insertBefore(darkmode, rightsideConfig);

}
rightsideAddon();
*/
