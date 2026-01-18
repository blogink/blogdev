
//-----开关与显隐

function openPanel() {
    const settingPanel = document.getElementById("settingPanel");
    const settingMask = document.getElementById("settingMask");

    // 如果已有spshow类，先关闭面板
    if (settingPanel.classList.contains("spshow")) {
        closePanel();
        return;
    }

    // 显示遮罩
    settingMask.classList.remove("sphide");
    settingMask.classList.add("spshow");

    // 显示面板
    setTimeout(() => {
        settingPanel.classList.remove("sphide");
        settingPanel.classList.add("spshow");
    }, 20);
}

function closePanel() {
    const settingPanel = document.getElementById("settingPanel");
    const settingMask = document.getElementById("settingMask");

    settingPanel.classList.remove("spshow");
    settingPanel.classList.add("sphide-anim"); // 添加隐藏动画
    settingMask.classList.remove("spshow");

    // 等待动画完成后再隐藏面板
    setTimeout(() => {
        settingPanel.classList.add("sphide");
        settingPanel.classList.remove("sphide-anim"); // 移除隐藏动画类
        settingMask.classList.add("sphide");
    }, 200); // 等待动画时间
}

// 点击遮罩关闭面板
document.getElementById("settingMask").addEventListener("click", closePanel);

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
    }, 150); // 等待动画完成后再隐藏
}

document.getElementById("settingBackToMain2").onclick = function() {
    // 淡出 settingItems
    document.getElementById("settingItems").classList.add("fade-out");
    document.getElementById("settingBackToMain2").classList.add("hide"); // 隐藏返回按钮

    setTimeout(() => {
        document.getElementById("settingItems").classList.add("hide"); // 隐藏 settingItems
        document.getElementById("settingTabs").classList.remove("hide"); // 显示 settingTabs
        document.getElementById("settingWidget").classList.remove("hide"); // 显示 settingWidget
        document.getElementById("settingMain").scrollTo({
            top: 0
        });

        setTimeout(() => {
            document.getElementById("settingTabs").classList.remove("fade-out"); // 移除淡出效果
            document.getElementById("settingWidget").classList.remove("fade-out"); // 移除淡出效果
            document.getElementById("settingTabs").classList.add("fade-in"); // 淡入 settingTabs
            document.getElementById("settingWidget").classList.add("fade-in"); // 淡入 settingWidget
        }, 10); // 等待 0.01秒后淡入
    }, 150); // 等待后完全隐藏
};

// 设置选项卡的逻辑
document.querySelectorAll("#settingTabs button").forEach(button => {
    button.onclick = function() {
        // 淡出 settingTabs 和 settingWidget
        document.getElementById("settingTabs").classList.add("fade-out");
        document.getElementById("settingWidget").classList.add("fade-out");

        // 返回按钮淡入
        document.getElementById("settingBackToMain2").classList.remove("hide");
            

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
                document.getElementById("settingMain").scrollTo({
                    top: 0
                });

            }, 10); // 等待 0.01秒后淡入
        }, 150); // 等待后隐藏选项卡
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

//-----创建 Style 容器，第二个参数可以填'start'、'end'或不填
function getOrCreateStyleTag(id, position = 'end') {
    let styleTag = document.getElementById(id);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = id;

        if (position === 'start') {
            // 添加到头部
            document.head.insertBefore(styleTag, document.head.firstChild);
        } else {
            // 默认添加到尾部
            document.head.appendChild(styleTag);
        }
    }
    return styleTag;
}


//-----CheckBox 功能

function settingCheckboxBinding(variable, initialState, switchState, functionState1, functionState0) {
    // 判断：若绑定元素不是checkbox则不执行；若 initialState 对应的部分填写的不是"fffff"也不是"ttttt"则不执行
    if (typeof initialState !== 'string' || (initialState !== 'fffff' && initialState !== 'ttttt')) {
        console.log(`初始状态值不合法: ${variable}`);
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
        } else {
            console.log(`未找到元素: ${variable}`);
            return; // 跳过绑定
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

    // 添加重置功能
    function resetCheckboxState() {
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
    }

    // 绑定重置按钮的点击事件
    document.getElementById('resetSwitches').addEventListener('click', resetCheckboxState);
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

/*function indexImgMain() {
    const siteInfo = document.getElementById("site-info");
    const scrollDown = document.getElementById("scroll-down");
    // 设置style中的display为block
    siteInfo.style.display = "block";
    scrollDown.style.display = "block";
}

function removeIndexImg() {
    const siteInfo = document.getElementById("site-info");
    const scrollDown = document.getElementById("scroll-down");
    // 设置style中的display为none
    siteInfo.style.display = "none";
    scrollDown.style.display = "none";
}*/
function indexImgMain() {
    //const siteInfo = document.getElementById("site-info");
    //const scrollDown = document.getElementById("scroll-down");
    const styleTag = getOrCreateStyleTag('indexImgStyleBox');
    styleTag.innerHTML = `
        #site-info {
            display: block !important;
        }
        #scroll-down {
            display: block !important;
        }
        
    `;
    // 设置style中的display为block
    //siteInfo.style.display = "block";
    //scrollDown.style.display = "block";
}

function removeIndexImg() {
    //const siteInfo = document.getElementById("site-info");
    //const scrollDown = document.getElementById("scroll-down");
    const styleTag = getOrCreateStyleTag('indexImgStyleBox');
    styleTag.innerHTML = `\
        #site-info {
            display: none !important;
        }
        #scroll-down {
            display: none !important;
        }

        .full_page#page-header {
            margin-bottom: 10px !important;
            height: 60px !important;
            background: 0 !important;
        }
        .full_page#page-header #nav {
            background: rgba(255,255,255,0.8) !important;
            -webkit-box-shadow: 0 5px 6px -5px rgba(133,133,133,0.6) !important;
            box-shadow: 0 5px 6px -5px rgba(133,133,133,0.6) !important;
        }
        .full_page#page-header #nav a,
        .full_page#page-header #nav span.site-page,
        .full_page#page-header #nav .site-name {
            color: var(--font-color) !important;
            text-shadow: none !important;
        }
        [data-theme='dark'] .full_page#page-header > #nav {
            background: rgba(18,18,18,0.8) !important;
            -webkit-box-shadow: 0 5px 6px -5px rgba(133,133,133,0) !important;
            box-shadow: 0 5px 6px -5px rgba(133,133,133,0) !important;
        }
    `;
    // 设置style中的display为none
    //siteInfo.style.display = "none";
    //scrollDown.style.display = "none";
}

// 示例函数
function functionState111() {
    console.log("func111");
}

function functionState000() {
    console.log("func000");
}

// 调用 settingCheckboxBinding 函数。这里 initialState 值修改后没反应是正常的，大概率是没有清理 localstorage，导致记录的仍是修改前的状态。
window.addEventListener("DOMContentLoaded",()=>{
    settingCheckboxBinding('aplayerOnOff', 'ttttt', 'aplayerState', aplayerMain, removeAplayer);
    settingCheckboxBinding('fpsDisplay', 'fffff', 'fpsState', FPSMain, removeFPS);
    settingCheckboxBinding('universeEffect', 'fffff', 'universeState', astralMain, removeAstral);
    settingCheckboxBinding('indexImgDisplay', 'ttttt', 'indexImgState', indexImgMain, removeIndexImg);
    settingCheckboxBinding('variable1', 'ttttt', 'switchState1', functionState111, functionState000);
})

//<input type="checkbox" id="sakuraEffect" onclick="sakuraState()">

//-----Range 组件

function settingRangeBarBinding(sDisplayMainId, sObjectMainId, sValue, initValue, cusFunc) {
    const displayElement = document.getElementById(sDisplayMainId);
    const rangeElement = document.getElementById(sObjectMainId);

    // 检查元素是否存在
    if (!displayElement) {
        console.log(`暂无此元素: ${sDisplayMainId}`);
        return; // 跳过对该元素的绑定
    }
    if (!rangeElement) {
        console.log(`暂无此元素: ${sObjectMainId}`);
        return; // 跳过对该元素的绑定
    }

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

    // 还原范围控件值的函数
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
    const resetButton = document.getElementById('resetRangeBar');
    const specificResetButton = document.getElementById(`resetRangeBar-${sObjectMainId}`);
    
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            localStorage.removeItem(sValue); // 清除 localStorage 中的值
            resetValue(); // 恢复所有范围控件
        });
    }
    
    if (specificResetButton) {
        specificResetButton.addEventListener('click', resetValue); // 仅重置特定范围控件
    }

    // 在设置范围控件时调用 cusFunc 确保初始值应用
    if (cusFunc) {
        cusFunc(initialValue);
    }
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

    console.log("控制台透明度更新为: " + rangeValue);
}

function updateColorBoxSpButton(rangeValue) {
    const rgbaValue = `rgba(150, 150, 150, ${rangeValue / 100})`;
    const rgbaValueHover = `rgba(200, 200, 200, ${rangeValue / 100})`;
    const rgbaValueDark = `rgba(10, 10, 10, ${rangeValue / 100})`;
    const rgbaValueDarkHover = `rgba(120, 120, 120, ${rangeValue / 100})`;

    const styleTag = getOrCreateStyleTag('spstyleColorBoxSpButton');

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

    console.log("控制台按钮透明度更新为: " + rangeValue);
}

function updateColorSpBgMask(rangeValue) {
    const rgbaValue = `rgba(255, 255, 255, ${rangeValue / 100})`;
    const rgbaValueDark = `rgba(10, 10, 10, ${rangeValue / 100})`;

    const styleTag = getOrCreateStyleTag('spstyleColorBoxSPBgMask');

    // 更新或添加样式
    styleTag.innerHTML = `
        #settingMask {
            background: ${rgbaValue};
        }
        [data-theme="dark"] #settingMask {
            background: ${rgbaValueDark};
        }
    `;

    console.log("控制台遮罩透明度更新为: " + rangeValue);
}
window.addEventListener("DOMContentLoaded",()=>{
    settingRangeBarBinding('settingBgOp', 'settingBgOpRange', 'opacityValueSp', '95', updateColorBoxSp);
    settingRangeBarBinding('settingButtonOp', 'settingButtonOpRange', 'opacityValueSpButtons', '30', updateColorBoxSpButton);
    settingRangeBarBinding('settingBgMaskOp', 'settingBgMaskOpRange', 'opacityValueSpBgMask', '80', updateColorSpBgMask);
})

/*
function settingRangeBarBinding(sDisplayMainId, sDisplayValueCon, sObjectMainId, sValue, func) {
    const sDisplayMain = document.getElementById(sDisplayMainId);
    const sObjectMain = document.getElementById(sObjectMainId);
    const resetButton = document.getElementById('resetRangeBar');

    // 从 localStorage 获取值，若不存在则使用范围控件的初始值
    const storedValue = localStorage.getItem(sValue);
    const defaultValue = parseFloat(sObjectMain.value);
    const initialValue = storedValue !== null ? parseFloat(storedValue) : defaultValue;

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
        sObjectMain.value = defaultValue; // 使用默认值
        updateDisplay(defaultValue); // 更新显示
        func(defaultValue); // 调用传入的函数
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

//-----Radio 标签

function settingRadioBinding(name, init) {
    // 规范检查
    const radioGroup = document.querySelectorAll(`input[name="${name}"]`);
    if (radioGroup.length === 0) {
        console.log(`绑定不规范: 未找到对应的 radio 组，name 为 ${name}`);
        return;
    }

    // 初始化选项
    const storedValue = localStorage.getItem(name);
    const initValue = storedValue || init;

    // 设置选中的 radio
    radioGroup.forEach(radio => {
        if (radio.value === initValue) {
            radio.checked = true;
            if (radio.onclick) radio.onclick(); // 调用对应的函数
        }
        radio.addEventListener('click', function() {
            localStorage.setItem(name, this.value); // 储存用户选择
        });
    });

    // resetRadio 函数
    function resetRadio() {
        const resetButtonId = this.id;

        // 判断是单个 radio 组的还原还是全部还原
        if (resetButtonId.startsWith('resetRadio-')) {
            const specificName = resetButtonId.replace('resetRadio-', '');
            const specificRadioGroup = document.querySelectorAll(`input[name="${specificName}"]`);
            
            specificRadioGroup.forEach(radio => {
                radio.checked = (radio.value === init);
                if (radio.onclick && radio.checked) radio.onclick(); // 调用对应的函数
            });
            localStorage.removeItem(specificName);
        } else {
            // 恢复所有 radio 组
            localStorage.removeItem(name);
            radioGroup.forEach(radio => {
                radio.checked = (radio.value === init);
                if (radio.onclick && radio.checked) radio.onclick(); // 调用对应的函数
            });
        }
    }

    // 绑定 resetRadio 函数到一个按钮
    const resetButton = document.getElementById('resetRadio');
    const specificResetButton = document.getElementById(`resetRadio-${name}`);
    
    if (resetButton) {
        resetButton.addEventListener('click', resetRadio);
    }
    
    if (specificResetButton) {
        specificResetButton.addEventListener('click', resetRadio);
    }
}

function removeLantern() {
    const lantern = document.getElementById("lantern");
    const styleTag = getOrCreateStyleTag('lanternStyleBox');

    // 更新或添加样式
    styleTag.innerHTML = `
        #lantern {
            display: none !important;
        }
    `;
    // 设置style中的display为none
    //lantern.style.display = "none";
}
function lanternLeft() {
    const lantern = document.getElementById("lantern");
    const styleTag = getOrCreateStyleTag('lanternStyleBox');

    // 更新或添加样式
    styleTag.innerHTML = `
        #lantern {
            display: block !important;
        }
        .lantern-box-1 {
            left: -20px !important;
            right: auto !important;
        }
        .lantern-box-2 {
            left: 10px !important;
            right: auto !important;
        }
    `;
    // 设置style中的display为block
    //lantern.style.display = "block";
}
function lanternRight() {
    const lantern = document.getElementById("lantern");
    const styleTag = getOrCreateStyleTag('lanternStyleBox');

    // 更新或添加样式
    styleTag.innerHTML = `
        #lantern {
            display: block !important;
        }
        .lantern-box-1 {
            left: auto !important;
            right: -20px !important;
        }
        .lantern-box-2 {
            left: auto !important;
            right: -20px !important;
        }
    `;
    // 设置style中的display为block
    //lantern.style.display = "block";
}

function contentInnerBgOp0() {
    const contentInnerBgOp = document.getElementById("contentInnerBgOp");
    const styleTag = getOrCreateStyleTag('contentInnerBgStyleBox');

    // 更新或添加样式
    styleTag.innerHTML = `
        #body-wrap > #content-inner {
            background-color: transparent !important;
        }
        [data-theme="dark"] #body-wrap > #content-inner {
            background-color: transparent !important;
        }
    `;
}

function contentInnerBgOp85() {
    const contentInnerBgOp = document.getElementById("contentInnerBgOp");
    const styleTag = getOrCreateStyleTag('contentInnerBgStyleBox');

    // 更新或添加样式
    styleTag.innerHTML = `
        #body-wrap > #content-inner {
            background-color: rgba(255,255,255,0.85) !important;
        }
        [data-theme="dark"] #body-wrap > #content-inner {
            background-color: rgba(10,10,10,0.85) !important;
        }
    `;
}

function contentInnerBgOp100() {
    const contentInnerBgOp = document.getElementById("contentInnerBgOp");
    const styleTag = getOrCreateStyleTag('contentInnerBgStyleBox');

    // 更新或添加样式
    styleTag.innerHTML = `
        #body-wrap > #content-inner {
            left: !important;
        }
        [data-theme="dark"] #body-wrap > #content-inner {
            transform: !important
        }
    `;
}

function aplayerSkinStyle1() {
    const contentInnerBgOp = document.getElementById("contentInnerBgOp");
    const styleTag = getOrCreateStyleTag('aplayerSkinStyleBox');

    // 更新或添加样式
    styleTag.innerHTML = `
        .aplayerBgMusic .aplayer-narrow .aplayer-miniswitcher {
            left: 300px !important;
        }
        .aplayerBgMusic .aplayer.aplayer-fixed.aplayer-narrow .aplayer-body {
            transform: translateX(-300px) !important;
        }
    `;
}
function aplayerSkinStyle2() {
    const contentInnerBgOp = document.getElementById("contentInnerBgOp");
    const styleTag = getOrCreateStyleTag('aplayerSkinStyleBox');

    // 更新或添加样式
    styleTag.innerHTML = `
        .aplayerBgMusic .aplayer-narrow .aplayer-miniswitcher {
            left: !important;
        }
        .aplayerBgMusic .aplayer.aplayer-fixed.aplayer-narrow .aplayer-body {
            transform: !important;
        }
    `;
}

function radio2Func1() {
    console.log('选择了 Huey-2');
}

function radio2Func2() {
    console.log('选择了 Dewey-2');
}

function radio2Func3() {
    console.log('选择了 Louie-2');
}

window.addEventListener("DOMContentLoaded",()=>{
    settingRadioBinding('lanternDisplay', 'close');
    settingRadioBinding('contentInnerBgOpDisplay', 'op0');
    settingRadioBinding('aplayerSkinStyleDisplay', 'skin1');
    settingRadioBinding('drone2', '22222');
})


//-----字体


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



//-----Widget部分

function calendarCard() {
    // 初始化标志
    let calendarInitialized = false;

    if (calendarInitialized) {
        return; // 如果已经初始化，直接返回
    }

    const calendarElement = document.getElementById('sp-cal-calendar');
    const monthYearElement = document.getElementById('sp-cal-monthYear');
    const todayButton = document.getElementById('sp-cal-today');
    const prevMonthButton = document.getElementById('sp-cal-prevMonth');
    const nextMonthButton = document.getElementById('sp-cal-nextMonth');

    let currentDate = new Date();

    const renderCalendar = (date) => {
        const daysContainer = document.createElement('div');
        daysContainer.className = 'sp-cal-days-container';
        daysContainer.style.display = 'flex';
        daysContainer.style.flexWrap = 'wrap';

        const year = date.getFullYear();
        const month = date.getMonth();

        monthYearElement.textContent = `${year}年${month + 1}月`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1));

        for (let i = 0; i < 42; i++) { // 6 weeks
            const currentCell = document.createElement('div');
            currentCell.className = 'sp-cal-day';
            const cellDate = new Date(startDate);
            cellDate.setDate(startDate.getDate() + i);

            if (cellDate.getMonth() === month) {
                currentCell.textContent = cellDate.getDate();
                if (cellDate.toDateString() === new Date().toDateString()) {
                    currentCell.classList.add('sp-cal-current-day');
                }
            } else {
                currentCell.textContent = cellDate.getDate();
                currentCell.classList.add('sp-cal-other-month');
            }

            daysContainer.appendChild(currentCell);
        }

        // 清除之前的日期容器
        const previousDaysContainer = calendarElement.querySelector('.sp-cal-days-container');
        if (previousDaysContainer) {
            calendarElement.removeChild(previousDaysContainer);
        }

        calendarElement.appendChild(daysContainer);
    };

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    todayButton.addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar(currentDate);
    });

    renderCalendar(currentDate);

    calendarInitialized = true; // 标记为已初始化
}

document.addEventListener("DOMContentLoaded", calendarCard);
document.addEventListener("pjax:complete", calendarCard);


//-----其他部分
function settingInfo() {
    // 初始化信息
    const info = {
        userAgent: "获取中",
        language: "获取中",
        platform: "获取中",
        maxTouchPoints: "获取中",
        referrer: "获取中",
        browserName: "获取中",
        osName: "获取中",
        userAgentDataBrands: "获取中",
        userAgentDataMobile: "获取中",
        userAgentDataPlatform: "获取中",
    };

    // 辅助函数：更新 span 内容
    function updateSpan(id, value) {
        const span = document.getElementById(id);
        if (span) {
            span.textContent = value;
        }
    }

    // 获取信息
    try {
        info.userAgent = navigator.userAgent;
        updateSpan("userAgent", info.userAgent);
    } catch (e) {
        updateSpan("userAgent", "未获取");
    }

    try {
        info.language = navigator.language || navigator.userLanguage;
        updateSpan("language", info.language);
    } catch (e) {
        updateSpan("language", "未获取");
    }

    try {
        info.platform = navigator.platform;
        updateSpan("platform", info.platform);
    } catch (e) {
        updateSpan("platform", "未获取");
    }

    try {
        info.maxTouchPoints = navigator.maxTouchPoints;
        updateSpan("maxTouchPoints", info.maxTouchPoints);
    } catch (e) {
        updateSpan("maxTouchPoints", "未获取");
    }

    try {
        info.referrer = document.referrer || "没有引用信息";
        updateSpan("referrer", info.referrer);
    } catch (e) {
        updateSpan("referrer", "未获取");
    }

    // 获取浏览器名称和操作系统名称
    function getBrowserAndOS() {
        const userAgent = navigator.userAgent;
        let browserName = "未获取";
        let osName = "未获取";

        // 浏览器名称
        /*if (userAgent.includes("Chrome")) {
            browserName = "Chrome";
        } else if (userAgent.includes("Firefox")) {
            browserName = "Firefox";
        } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
            browserName = "Safari";
        } else if (userAgent.includes("Edge")) {
            browserName = "Edge";
        } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
            browserName = "Internet Explorer";
        } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
            browserName = "Opera";
        } else if (userAgent.includes("UCWEB") || userAgent.includes("UCBrowser")) {
            browserName = "UC";
        } else if (userAgent.includes("Baidu") || userAgent.includes("BaiduBrowser")) {
            browserName = "Baidu";
        } else if (userAgent.includes("Maxthon")) {
            browserName = "Maxthon";
        } else if (userAgent.includes("QQBrowser")) {
            browserName = "QQ";
        } else if (userAgent.includes("Sogou")) {
            browserName = "搜狗";
        } else {
            browserName = "Others"
        }*/
        // 调整顺序并使用正则表达式
        if (/Edg\//i.test(userAgent)) {
          browserName = "Edge";
        } else if (/OPR\//i.test(userAgent)) {
          browserName = "Opera";
        } else if (/Firefox/i.test(userAgent)) {
          browserName = "Firefox";
        } else if (/Chrome/i.test(userAgent)) {
          browserName = "Chrome";
        } else if (/Safari/i.test(userAgent)) {
          browserName = "Safari";
        } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
            browserName = "Internet Explorer";
        } else if (userAgent.includes("Baidu") || userAgent.includes("BaiduBrowser")) {
            browserName = "Baidu";
        } else if (userAgent.includes("Maxthon")) {
            browserName = "Maxthon";
        } else if (userAgent.includes("QQBrowser")) {
            browserName = "QQ";
        } else if (userAgent.includes("Sogou")) {
            browserName = "搜狗";
        } else {
            browserName = "Others"
        }

        if (/OpenHarmony/i.test(userAgent) || typeof window.ohos !== 'undefined') {
          osName = "OpenHarmony";
        } else if (/HarmonyOS|HMOS/i.test(userAgent)) {
          osName = /Android/i.test(userAgent) ? "HarmonyOS" : "HarmonyOS NEXT";
        } else if (/Android/i.test(userAgent)) {
          osName = "Android";
        } else if (/iPhone|iPad/i.test(userAgent)) {
          osName = "iOS";
        } else if (/Macintosh/i.test(userAgent)) {
          osName = "macOS";
        } else if (/Windows/i.test(userAgent)) {
          osName = "Windows";
        } else if (/CrOS/i.test(userAgent)) {
          osName = "Chrome OS";
        } else if (/Linux/i.test(userAgent)) {
          osName = "Linux";
        }

        updateSpan("browserName", browserName);
        updateSpan("osName", osName);
    }

    /* 使用 UAParser.js 库时，函数可编写为 */
    /*function getBrowserAndOS() {
        const parser = new UAParser();
        const { name: browserName } = parser.getBrowser();
        const { name: osName } = parser.getOS();
        updateSpan("browserName", browserName || "未获取");
        updateSpan("osName", osName || "未获取");
    }*/

    try {
        if (navigator.userAgentData) {
            navigator.userAgentData.getHighEntropyValues(["platform", "brands", "mobile"])
                .then(ua => {
                    info.userAgentDataBrands = ua.brands.map(brand => brand.brand + ' ' + brand.version).join(', ');
                    info.userAgentDataMobile = ua.mobile ? 'True' : 'False';
                    info.userAgentDataPlatform = ua.platform;

                    updateSpan("userAgentDataBrands", info.userAgentDataBrands);
                    updateSpan("userAgentDataMobile", info.userAgentDataMobile);
                    updateSpan("userAgentDataPlatform", info.userAgentDataPlatform);
                })
                .catch(() => {
                    updateSpan("userAgentDataBrands", "未获取");
                    updateSpan("userAgentDataMobile", "未获取");
                    updateSpan("userAgentDataPlatform", "未获取");
                });
        } else {
          // 降级方案：从 User Agent 中解析移动端标识
            updateSpan("userAgentDataBrands", "未获取");
            info.userAgentDataMobile = /Mobile|Android|iPhone/i.test(userAgent) ? 'True' : 'False';
            updateSpan("userAgentDataMobile", info.userAgentDataMobile);
            updateSpan("userAgentDataPlatform", "未获取");
        }
    } catch (e) {
        updateSpan("userAgentDataBrands", "未获取");
        updateSpan("userAgentDataMobile", "未获取");
        updateSpan("userAgentDataPlatform", "未获取");
    }

    getBrowserAndOS();
}

// 调用函数
window.addEventListener("DOMContentLoaded",()=>{
    settingInfo();
})
