
//-----开关与显隐

function openPanel() {
    const settingPanel = document.getElementById("settingPanel");

    // 如果已有show类，先关闭面板
    if (settingPanel.classList.contains("show")) {
        closePanel();
        return;
    }

    // 移除隐藏类并稍后添加显示类
    settingPanel.classList.remove("hide");  
    setTimeout(() => {
        settingPanel.classList.add("show");
    }, 20);
}

function closePanel() {
    const settingPanel = document.getElementById("settingPanel");

    settingPanel.classList.remove("show");
    settingPanel.style.bottom = '-100%';

    setTimeout(() => {
        settingPanel.classList.add("hide");
        settingPanel.style.bottom = '';
    }, 250);
}

function showItems() {
    const settingItems = document.getElementById("settingItems");
    settingItems.classList.remove("hide");
    settingItems.classList.remove("fade-out");
    settingItems.classList.add("fade-in");
}

function hideItems() {
    const settingItems = document.getElementById("settingItems");
    settingItems.classList.add("fade-out");
    setTimeout(() => {
        settingItems.classList.add("hide");
    }, 250); // 等待动画完成后再隐藏
}

document.getElementById("settingBackToMain2").onclick = function() {
    // 淡出 settingItems
    document.getElementById("settingItems").classList.add("fade-out");
    document.getElementById("settingBackToMain2").classList.add("fade-out");
    document.getElementById("settingBackToMain2").classList.add("hide"); // 隐藏返回按钮

    setTimeout(() => {
        document.getElementById("settingItems").classList.add("hide"); // 隐藏 settingItems
        document.getElementById("settingTabs").classList.remove("hide"); // 显示 settingTabs
        document.getElementById("settingWidget").classList.remove("hide"); // 显示 settingWidget

        setTimeout(() => {
            document.getElementById("settingTabs").classList.remove("fade-out"); // 移除淡出效果
            document.getElementById("settingWidget").classList.remove("fade-out"); // 移除淡出效果
            document.getElementById("settingTabs").classList.add("fade-in"); // 淡入 settingTabs
            document.getElementById("settingWidget").classList.add("fade-in"); // 淡入 settingWidget
        }, 10); // 等待 0.01秒后淡入
    }, 100); // 等待后完全隐藏
};

// 设置选项卡的逻辑
document.querySelectorAll("#settingTabs button").forEach(button => {
    button.onclick = function() {
        // 淡出 settingTabs 和 settingWidget
        document.getElementById("settingTabs").classList.add("fade-out");
        document.getElementById("settingWidget").classList.add("fade-out");

        // 返回按钮淡入
        document.getElementById("settingBackToMain2").classList.remove("hide");
        document.getElementById("settingBackToMain2").classList.remove("fade-out");
        document.getElementById("settingBackToMain2").classList.add("fade-in");
            

        setTimeout(() => {
            document.getElementById("settingTabs").classList.add("hide"); // 隐藏 settingTabs
            document.getElementById("settingWidget").classList.add("hide"); // 隐藏 settingWidget

            // 显示 settingItems
            document.getElementById("settingItems").classList.remove("hide");
            // 隐藏所有内容 div
            document.querySelectorAll("#settingItems > div").forEach(div => {
                div.classList.add("hide");
            });

            // 显示对应内容
            document.getElementById(button.id + "-Content").classList.remove("hide");

            // 淡入 settingItems
            setTimeout(() => {
                document.getElementById("settingItems").classList.remove("fade-out");
                document.getElementById("settingItems").classList.add("fade-in");

            }, 10); // 等待 0.01秒后淡入
        }, 100); // 等待后隐藏选项卡
    };
});
/*
function settingMainAutoHeightAdjust() {
    var topBarHeight = document.getElementById('settingBottomBar').offsetHeight;
    var settingMain = document.getElementById('settingMain');
    settingMain.style.height = `calc(100% - ${topBarHeight}px)`;
}

function checkAndAdjustHeight() {
    var topBar = document.getElementById('settingBottomBar');
    var main = document.getElementById('settingMain');
    if (topBar && main) {
        settingMainAutoHeightAdjust();
    }
}

// Adjust height on window resize
window.onresize = checkAndAdjustHeight;

// Monitor DOM changes
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            checkAndAdjustHeight();
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial check
checkAndAdjustHeight();
*/

//-----部分功能按钮
// Add scroll to top functionality
document.getElementById("settingScrollToTop").onclick = function() {
    document.getElementById("settingMain").scrollTo({
        top: 0,
        behavior: "smooth"
    });
};
document.getElementById('settingFullScreen').addEventListener('click', function() {
    if (!document.fullscreenElement) {
        // 进入全屏模式
        document.documentElement.requestFullscreen().catch((err) => {
            console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        // 退出全屏模式
        document.exitFullscreen().catch((err) => {
            console.log(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
        });
    }
});


//-----清理


function clearLocalStorage(){
    localStorage.clear();
    //alert("LocalStorage 已清除！");
    location.reload(); // 刷新页面以应用更改
}

// 清理浏览器储存
function clearBrowserStorage(clearElementName, clearFunction) {
    document.getElementById(clearElementName).addEventListener('click', function() {
        // 执行清除操作
        clearFunction();

        // 更改按钮文字
        this.textContent = '已清除';

        // 1秒后刷新页面
        setTimeout(function() {
            location.reload();
        }, 1000);
    });
}

// 清除 localStorage
/*clearBrowserStorage('clearLocalStorage', function() {
    localStorage.clear();
});*/

// 清除 sessionStorage
clearBrowserStorage('clearSessionStorage', function() {
    sessionStorage.clear();
});

// 清除 cookies
clearBrowserStorage('clearCookies', function() {
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    });
});

// 清除 service workers
clearBrowserStorage('clearServiceWorkers', function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for (let registration of registrations) {
                registration.unregister();
            }
        });
    }
});

// 清除缓存
clearBrowserStorage('clearCaches', function() {
    if ('caches' in window) {
        caches.keys().then(function(names) {
            for (let name of names) {
                caches.delete(name);
            }
        });
    }
});


//-----Butterfly 主题部分悬浮栏功能
function settingAddRemove(id, addRemove) {
    var element = document.querySelector(id);
    if (element) {
        if (addRemove === 'add') {
            // 增加 display: block 属性，且不删除原有的样式
            element.style.display = (element.style.display === 'none' || element.style.display === '') ? 'block' : element.style.display;
        } else if (addRemove === 'remove') {
            // 增加 display: none 属性，且不删除原有的样式
            element.style.display = (element.style.display === 'block') ? 'none' : element.style.display;
        }
    }
}


var sps = {};

sps.switchDarkMode = function(){
    const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    if (nowMode === 'light') {
        btf.activateDarkMode()
        btf.saveToLocal.set('theme', 'dark', 2)
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
    } else {
        btf.activateLightMode()
        btf.saveToLocal.set('theme', 'light', 2)
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
    }
    // handle some cases
    typeof utterancesTheme === 'function' && utterancesTheme()
    typeof FB === 'object' && window.loadFBComment()
    window.DISQUS && document.getElementById('disqus_thread').children.length && setTimeout(() => window.disqusReset(), 200)
};

document.getElementById("menu-darkmode").onclick = function() {
    sps.switchDarkMode();
};

/*
// 监听页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    settingAddRemove(id, addRemove);
});

// 监听 PJAX 切换完成事件
document.addEventListener('pjax:end', function() {
    settingAddRemove(id, addRemove);
});

// 监听其他的内容切换事件（您可以使用其他相应的方法）
document.addEventListener('content:changed', function() {
    settingAddRemove(id, addRemove);
});
*/
/*
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('#body-wrap > #content-inner > #post')) {
        settingAddRemove('#settingBottomBar > #menu-reading', 'add');
    } else {
        settingAddRemove('#settingBottomBar > #menu-reading', 'remove');
    }
});
*/
//#body-wrap > #content-inner > #post
//-----CheckBox 功能


function settingCheckboxBinding(variable, initialState, switchState, functionState1, functionState0) {
    // 判断：若绑定元素不是checkbox则不执行；若 initialState 对应的部分填写的不是"fffff"也不是"ttttt"则不执行
    if (typeof initialState !== 'string' || (initialState !== 'fffff' && initialState !== 'ttttt')) {
        console.error('Invalid initialState value');
        return;
    }

    // 初始化变量
    var state = localStorage.getItem(variable);
    if (state === null) {
        state = initialState === 'fffff' ? 0 : 1;
        localStorage.setItem(variable, state);
    } else {
        state = parseInt(state);
    }

    // 设置初始效果
    if (state === 1) {
        functionState1();
    } else {
        functionState0();
    }

    // 定义切换函数
    window[switchState] = function() {
        state = !state ? 1 : 0;
        localStorage.setItem(variable, state);
        if (state === 1) {
            functionState1();
        } else {
            functionState0();
        }
    };

    // 恢复复选框状态
    function restoreCheckboxState() {
        var checkbox = document.getElementById(variable);
        if (checkbox) {
            checkbox.checked = state === 1;
            checkbox.onclick = window[switchState];
        }
    }

    // 使用 MutationObserver 监控 DOM 变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                restoreCheckboxState();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初始恢复复选框状态
    document.addEventListener('DOMContentLoaded', restoreCheckboxState);

    // 添加重置按钮的功能
    document.getElementById('resetSwitches').addEventListener('click', function() {
        // 清除所有 localStorage 相关记录
        localStorage.removeItem(variable);

        // 根据 initialState 还原状态
        state = initialState === 'fffff' ? 0 : 1;
        localStorage.setItem(variable, state);
        
        // 执行相应的函数
        if (state === 1) {
            functionState1();
        } else {
            functionState0();
        }

        // 恢复复选框状态
        restoreCheckboxState();
    });
}

// 示例函数：启用和关闭aplayer效果
function aplayerMain() {
    if (!document.getElementById('aplayerScript')) {
    const aplayerBgMusic = document.querySelector('.aplayerBgMusic');
    if (aplayerBgMusic) {
        // 显示 meting-js 元素
        aplayerBgMusic.style.display = 'block';
        }
    }
}

function removeAplayer() {
    const aplayerBgMusic = document.querySelector('.aplayerBgMusic');
    if (aplayerBgMusic) {
        // 隐藏 meting-js 元素
        aplayerBgMusic.style.display = 'none';
        if (aplayerBgMusic.aplayer) {
            aplayerBgMusic.aplayer.pause();
        }
    }
}

function FPSMain() {
    if (!document.getElementById('fpsDisplayElement')) {
        const fpsElement = document.createElement('div');
        fpsElement.id = 'fpsDisplayElement';
        /*弃用，交由 CSS 完成
        fpsElement.style.position = 'fixed';
        fpsElement.style.bottom = '5px';
        fpsElement.style.right = '5px';
        fpsElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        fpsElement.style.pointerEvents = 'none';
        fpsElement.style.padding = '5px';
        fpsElement.style.borderRadius = '5px';
        */
        document.body.appendChild(fpsElement);

        let lastFrameTime = performance.now();
        let frameCount = 0;

        function updateFPS() {
            const now = performance.now();
            frameCount++;
            const delta = now - lastFrameTime;
            if (delta >= 1000) {
                const fps = Math.round((frameCount * 1000) / delta);
                fpsElement.innerHTML = `FPS: ${fps}`;
                frameCount = 0;
                lastFrameTime = now;
            }
            requestAnimationFrame(updateFPS);
        }

        updateFPS();
    }
}

function removeFPS() {
    const fpsElement = document.getElementById('fpsDisplayElement');
    if (fpsElement) {
        fpsElement.remove();
    }
}

/*function astralMain() {
    if (!document.getElementById('universe')) {
    // 获取canvas元素
    const universe = document.getElementById("universe");
    if (universe) {
        // 设置style中的display为block
        universe.style.display = "block";
        }
    }
}

function removeAstral() {
    const universe = document.getElementById("universe");
    if (universe) {
        // 设置style中的display为none
        universe.style.display = "none";
    }
}*/

function astralMain() {
    const universe = document.getElementById("universe");
    // 设置style中的display为block
    universe.style.display = "block";
}

function removeAstral() {
    const universe = document.getElementById("universe");
    // 设置style中的display为none
    universe.style.display = "none";
}

// 示例函数
function functionState111() {
    console.log("func111");
}

function functionState000() {
    console.log("func000");
}

// 调用 settingCheckboxBinding 函数。这里 initialState 值修改后没反应是正常的，大概率是没有清理 localstorage，导致记录的仍是修改前的状态。
settingCheckboxBinding('aplayerOnOff', 'ttttt', 'aplayerState', aplayerMain, removeAplayer);
settingCheckboxBinding('fpsDisplay', 'fffff', 'fpsState', FPSMain, removeFPS);
settingCheckboxBinding('universeEffect', 'fffff', 'universeState', astralMain, removeAstral);
settingCheckboxBinding('variable1', 'ttttt', 'switchState1', functionState111, functionState000);

//<input type="checkbox" id="sakuraEffect" onclick="sakuraState()">


//-----字体切换


/* Ariasaka 字体切换 
if (localStorage.getItem("selectedFont") === null) {
    localStorage.setItem("selectedFont", "微软雅黑");
}
setFont(localStorage.getItem("selectedFont"));

function setFont(fontName) {
    localStorage.setItem("selectedFont", fontName);
    if (fontName === "main") {
        document.body.style.fontFamily = "-apple-system, IBM Plex Mono, monospace, '微软雅黑', sans-serif";
        document.documentElement.style.removeProperty('--global-font');
    } else {
        document.body.style.fontFamily = "var(--global-font), -apple-system, IBM Plex Mono, monospace, '微软雅黑', sans-serif";
        document.documentElement.style.setProperty('--global-font', fontName);
    }
}*/
// 初始化字体设置
if (localStorage.getItem("selectedFont") === null) {
    localStorage.setItem("selectedFont", "微软雅黑");
}
setFont(localStorage.getItem("selectedFont"));

// 设置字体的函数
function setFont(fontName) {
    localStorage.setItem("selectedFont", fontName);
    if (fontName === "main") {
        document.body.style.fontFamily = "-apple-system, IBM Plex Mono, monospace, '微软雅黑', sans-serif";
        document.documentElement.style.removeProperty('--global-font');
    } else {
        document.body.style.fontFamily = "var(--global-font), -apple-system, IBM Plex Mono, monospace, '微软雅黑', sans-serif";
        document.documentElement.style.setProperty('--global-font', fontName);
    }
}

// 添加重置字体的功能
function resetFont() {
    // 清除 localStorage 中的 selectedFont
    localStorage.removeItem("selectedFont");
    // 恢复默认字体
    setFont("微软雅黑");
}

// 绑定按钮点击事件
document.getElementById("resetFont").addEventListener("click", resetFont);


//-----背景切换


// 基于 Leonus 背景切换修改
// 存数据
// name：命名 data：数据
function saveData(name, data) {
    localStorage.setItem(name, JSON.stringify({ 'time': Date.now(), 'data': data }))
}
 
// 取数据
// name：命名 time：过期时长,单位分钟,如传入30,即加载数据时如果超出30分钟返回0,否则返回数据
function loadData(name, time) {
    let d = JSON.parse(localStorage.getItem(name));
    // 过期或有错误返回 0 否则返回数据
    if (d) {
        let t = Date.now() - d.time
        if (t < (time * 60 * 1000) && t > -1) return d.data;
    }
    return 0;
}
 
// 上面两个函数如果你有其他需要存取数据的功能，也可以直接使用
 
// 读取背景
/* 使用版本 2 时注释掉这段代码 */
try {
    let data = loadData('blogbg', 1440)
    if (data) changeBg(data, 1)
    else localStorage.removeItem('blogbg');
} catch (error) { localStorage.removeItem('blogbg'); }

// 切换背景函数
// 此处的flag是为了每次读取时都重新存储一次,导致过期时间不稳定
// 如果flag为0则存储,即设置背景. 为1则不存储,即每次加载自动读取背景.
function changeBg(s, flag) {
    let bg = document.getElementById('web_bg')
    if (s.charAt(0) == '#') {
        bg.style.backgroundColor = s
        bg.style.backgroundImage = 'none'
    } else bg.style.backgroundImage = s
    if (!flag) { saveData('blogbg', s) }
}

/* 重置背景，三选一使用 */
// 版本1，写死原背景链接。更换新的初始背景后此处也要修改
/**/
// 重置背景的函数
function resetBg() {
    let bg = document.getElementById('web_bg');
    let originalBg = localStorage.getItem('original_blog_bg');
    localStorage.removeItem('blogbg');  // 清除更改后的背景记录
    changeBg('url(/img/background_img.jpg)');  // 恢复原背景，使用了上面的切换背景函数
}


// 版本2，在首次加载时自动获取并储存原始背景。如果更换主背景，需要在客户端手动重置才能更新
/*
// 尝试从 localStorage 中加载背景并设置
try {
    let bg = document.getElementById('web_bg');
    let originalBlogBg = bg.style.backgroundImage || '';
    // 只在第一次加载时存储初始背景
    if (!localStorage.getItem('original_blog_bg')) {
        localStorage.setItem('original_blog_bg', originalBlogBg);
    }

    let data = loadData('blogbg', 1440);
    if (data) {
        changeBg(data, 1);
    } else {
        localStorage.removeItem('blogbg');
    }
} catch (error) {
    localStorage.removeItem('blogbg');
}

// 重置背景的函数
function resetBg() {
    let bg = document.getElementById('web_bg');
    let originalBg = localStorage.getItem('original_blog_bg');
    bg.style.backgroundImage = originalBg || 'none';  // 恢复原背景
    localStorage.removeItem('blogbg');  // 清除更改后的背景记录
}
*/

// 版本3，完整。存在问题不建议使用
/*
// 存储数据到 localStorage
function saveData(name, data) {
    localStorage.setItem(name, JSON.stringify({'time': Date.now(), 'data': data}));
}

// 从 localStorage 读取数据
function loadData(name, time) {
    let d = JSON.parse(localStorage.getItem(name));
    if (d) {
        let t = Date.now() - d.time;
        if (t < (time * 60 * 1000) && t > -1)
            return d.data;
    }
    return 0;
}

// 尝试从 localStorage 中加载背景并设置
try {
    let originalBlogBg = document.getElementById('web_bg').style.backgroundImage || '';
    localStorage.setItem('original_blog_bg', originalBlogBg);

    let data = loadData('blogbg', 1440);
    if (data) {
        changeBg(data, 1);
    } else {
        localStorage.removeItem('blogbg');
    }
} catch (error) {
    localStorage.removeItem('blogbg');
}

// 改变背景
function changeBg(s, flag) {
    let bg = document.getElementById('web_bg');
    if (s.charAt(0) == '#') {
        bg.style.backgroundColor = s;
        bg.style.backgroundImage = 'none';
    } else {
        bg.style.backgroundImage = s;
    }
    if (!flag) {
        saveData('blogbg', s);
    }
}

// 重置背景的函数
function resetBg() {
    let bg = document.getElementById('web_bg');
    let originalBg = localStorage.getItem('original_blog_bg');
    bg.style.backgroundImage = originalBg || 'none';  // 恢复原背景
    localStorage.removeItem('blogbg');  // 清除更改后的背景记录
}

*/

// 给重置按钮绑定事件
document.getElementById('resetBg').onclick = function() {
    resetBg();
};

//-----插入触发按钮


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


//-----测试区

function settingRangeBarBinding(sDisplayMainId, sObjectMainId, sValue, initValue, cusFunc) {
    const displayElement = document.getElementById(sDisplayMainId);
    const rangeElement = document.getElementById(sObjectMainId);
    
    // 获取 localStorage 中的值
    const storedValue = localStorage.getItem(sValue);
    const initialValue = storedValue !== null ? storedValue : (initValue || rangeElement.value);
    
    // 初始化范围控件和显示文本
    rangeElement.value = initialValue;
    displayElement.textContent = initialValue;

    // 更新显示和 localStorage，并调用自定义函数
    const updateDisplay = () => {
        const value = rangeElement.value;
        displayElement.textContent = value;
        localStorage.setItem(sValue, value);
        if (cusFunc) {
            cusFunc(value); // 调用自定义函数
        }
    };

    // 绑定 input 事件
    rangeElement.addEventListener('input', updateDisplay);

    // 还原所有范围控件值的函数
    const resetValue = () => {
        rangeElement.value = initValue; // 恢复到初值
        localStorage.setItem(sValue, initValue); // 更新 localStorage
        displayElement.textContent = initValue; // 更新显示文本
        
        // 调用相应的 cusFunc
        if (cusFunc) {
            cusFunc(initValue);
        }
    };

    // 为重置按钮添加事件监听器
    document.getElementById('resetRangeBar').addEventListener('click', resetValue);
    
    // 在设置范围控件时调用 cusFunc 确保初始值应用
    if (cusFunc) {
        cusFunc(initialValue);
    }
}

// 直接调用函数
settingRangeBarBinding('valueDisplaySp', 'opacityRangeSp', 'opacityValueSp', '95', updateColorBoxSp);
settingRangeBarBinding('valueDisplaySpButtons', 'opacityRangeSpButtons', 'opacityValueSpButtons', '40', updateColorBoxSpButton);

function getOrCreateStyleTag(id) {
    let styleTag = document.getElementById(id);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = id;
        document.head.appendChild(styleTag);
    }
    return styleTag;
}

function updateColorBoxSp(rangeValue) {
    const rgbaValue = `rgba(250, 250, 250, ${rangeValue / 100})`;
    const rgbaValueDark = `rgba(10, 10, 10, ${rangeValue / 100})`;

    const styleTag = getOrCreateStyleTag('spstyleColorBox');

    // 更新或添加样式
    styleTag.innerHTML = `
        #settingPanel {
            background: ${rgbaValue};
        }
        [data-theme="dark"] #settingPanel {
            background: ${rgbaValueDark};
        }
    `;
}

function updateColorBoxSpButton(rangeValue) {
    const rgbaValue = `rgba(150, 150, 150, ${rangeValue / 100})`;
    const rgbaValueHover = `rgba(200, 200, 200, ${rangeValue / 100})`;
    const rgbaValueDark = `rgba(10, 10, 10, ${rangeValue / 100})`;
    const rgbaValueDarkHover = `rgba(120, 120, 120, ${rangeValue / 100})`;

    const styleTag = getOrCreateStyleTag('spstyleColorBoxStButton');

    // 更新或添加样式
    styleTag.innerHTML = `
        #settingPanel button {
            background: ${rgbaValue};
        }
        #settingPanel button:hover {
            background-color: ${rgbaValueHover};
        }
        [data-theme="dark"] #settingPanel button {
            background: ${rgbaValueDark};
        }
        [data-theme="dark"] #settingPanel button:hover {
            background-color: ${rgbaValueDarkHover};
        }
    `;
}
/*function settingRangeBarBinding(sDisplayMainId, sDisplayValueCon, sObjectMainId, sValue, func) {
    const sDisplayMain = document.getElementById(sDisplayMainId);
    const sObjectMain = document.getElementById(sObjectMainId);
    const resetButton = document.getElementById('resetRangeBar');
    
    // 用于存储初始值的对象
    const initialValueMap = {};

    // 从 localStorage 获取值，若不存在则使用范围控件的初始值
    const storedValue = localStorage.getItem(sValue);
    const defaultValue = parseFloat(sObjectMain.value);
    const initialValue = storedValue !== null ? parseFloat(storedValue) : defaultValue;

    // 只在首次加载时存储初始值
    if (!initialValueMap[sValue]) {
        initialValueMap[sValue] = defaultValue; // 使用控件的初始值
    }

    // 初始化范围控件
    sObjectMain.value = initialValue;
    updateDisplay(initialValue);
    func(initialValue);

    // 事件监听：实时更新透明度和显示
    sObjectMain.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        updateDisplay(value);
        localStorage.setItem(sValue, value);
        func(value);
    });

    // 添加重置按钮的点击事件
    resetButton.addEventListener('click', () => {
        // 清除 localStorage 中的记录
        localStorage.removeItem(sValue);
        
        // 平滑地将滑块重置到初始值
        sObjectMain.value = initialValueMap[sValue]; // 使用初始值
        updateDisplay(initialValueMap[sValue]); // 更新显示
        func(initialValueMap[sValue]); // 调用传入的函数
    });

    function updateDisplay(rangeValue) {
        sDisplayMain.textContent = `${sDisplayValueCon} ${rangeValue}%`;
    }
}

function getOrCreateStyleTag(id) {
    let styleTag = document.getElementById(id);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = id;
        document.head.appendChild(styleTag);
    }
    return styleTag;
}

function updateColorBox(rangeValue) {
    const rgbaValue = `rgba(250, 250, 250, ${rangeValue / 100})`;
    const rgbaValueDark = `rgba(10, 10, 10, ${rangeValue / 100})`;

    const styleTag = getOrCreateStyleTag('spstyleColorBox');

    // 更新或添加样式
    styleTag.innerHTML = `
        #settingPanel {
            background: linear-gradient(-45deg, transparent 20px, ${rgbaValue} 0);
        }
        [data-theme="dark"] #settingPanel {
            background: linear-gradient(-45deg, transparent 20px, ${rgbaValueDark} 0);
        }
    `;
}

function updateColorBoxStButton(rangeValue) {
    const rgbaValue = `rgba(150, 150, 150, ${rangeValue / 100})`;
    const rgbaValueHover = `rgba(200, 200, 200, ${rangeValue / 100})`;
    const rgbaValueDark = `rgba(10, 10, 10, ${rangeValue / 100})`;
    const rgbaValueDarkHover = `rgba(120, 120, 120, ${rangeValue / 100})`;

    const styleTag = getOrCreateStyleTag('spstyleColorBoxStButton');

    // 更新或添加样式
    styleTag.innerHTML = `
        #settingPanel button {
            background: ${rgbaValue};
        }
        #settingPanel button:hover {
            background-color: ${rgbaValueHover};
        }
        [data-theme="dark"] #settingPanel button {
            background: ${rgbaValueDark};
        }
        [data-theme="dark"] #settingPanel button:hover {
            background-color: ${rgbaValueDarkHover};
        }
    `;
}

// 初始化并绑定元素
settingRangeBarBinding('valueDisplay', '控制台透明度：', 'opacityRange', 'opacityValue', updateColorBox);

// PJAX 完成加载后调用初始化函数（如果需要）
document.addEventListener('pjax:end', () => {
    settingRangeBarBinding('valueDisplay', '控制台透明度：', 'opacityRange', 'opacityValue', updateColorBox);
});

// 新的初始化并绑定元素
settingRangeBarBinding('valueDisplayStButtons', '控制台按钮透明度：', 'opacityRangeStButtons', 'opacityValueStButtons', updateColorBoxStButton);

// PJAX 完成加载后调用初始化函数（如果需要）
document.addEventListener('pjax:end', () => {
    settingRangeBarBinding('valueDisplayStButtons', '控制台按钮透明度：', 'opacityRangeStButtons', 'opacityValueStButtons', updateColorBoxStButton);
});
*/