/*老旧浏览器弹窗提醒*/
function browserCheck() {
    var sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/edge\/([\d.]+)/)) ? sys.edge = s[1] :
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[1] :
    (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;

    if (sys.edge && parseFloat(sys.edge) < 90) {
        BrowserTC();
    } else if (sys.chrome && parseFloat(sys.chrome) < 90) {
        BrowserTC();
    } else if (sys.firefox && parseFloat(sys.firefox) < 90) {
        BrowserTC();
    } else if (sys.opera && parseFloat(sys.opera) < 80) {
        BrowserTC();
    } else if (sys.safari && parseFloat(sys.safari) < 12) {
        BrowserTC();
    } else if (sys.ie) {
        BrowserTC();
    }
}

/*function browserTC() {
    btf.snackbarShow("");
    Snackbar.show({
        text: '浏览器版本较低，网站样式可能错乱',
        actionText: '关闭',
        duration: '6000',
        pos: 'bottom-right'
    });
}*/

function BrowserTC() {
    alert("您的浏览器版本较低，网站可能无法正常显示");
}

// 调用检测浏览器版本函数
browserCheck();
