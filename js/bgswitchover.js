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

// 以下为2.0新增内容

// 创建窗口
var winbox = ''

function createWinbox() {
    let div = document.createElement('div')
    document.body.appendChild(div)
    winbox = WinBox({
        id: 'changeBgBox',
        index: 999,
        title: "切换背景",
        x: "center",
        y: "center",
        minwidth: '300px',
        height: "60%",
        background: '#1ba784',
        onmaximize: () => { div.innerHTML = `<style>body::-webkit-scrollbar {display: none;}div#changeBgBox {width: 100% !important;}</style>` },
        onrestore: () => { div.innerHTML = '' }
    });
    winResize();
    window.addEventListener('resize', winResize)

    // 每一类我放了一个演示，直接往下复制粘贴 a标签 就可以，需要注意的是 函数里面的链接 冒号前面需要添加反斜杠\进行转义
    
    // 这里是备用代码段，利用 butterfly 主题的折叠栏功能，其他主题不一定适用
    // <details class="toggle">
    //   <summary class="toggle-button" style="">查看电脑壁纸</summary>
    //   <div class="toggle-content">
    //     <div class="bgbox">
    //     
    //     </div>
    //   </div>
    // </details>

    winbox.body.innerHTML = `

    <div id="article-container" style="padding:10px;">

    <p>说明：1.此功能处于测试阶段，不保证可靠性；2.请不要使用 IE 进行测试（实际上 IE 和某些浏览器的古老版本能不能正常加载出此站点都是个未知数）</p>

    <p>
        <button onclick="localStorage.removeItem('blogbg');location.reload();" style="background:#1ba784;display:block;width:100%;padding: 8px 0;border-radius:5px;color:white;">
            <i class="fa-solid fa-arrows-rotate"></i> 点我恢复默认背景
        </button>
    </p>
    
    <h2 id="图片（宽屏）">
        <a href="#图片（宽屏）" class="headerlink" title="图片（宽屏）"></a>图片（宽屏）
    </h2>
    <div class="bgbox">
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(/img/bg/bg-pc-1.jpg)"
            class="imgbox"
            onclick="changeBg('url(/img/bg/bg-pc-1.jpg)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(/img/bg/bg-pc-2.jpg)"
            class="imgbox"
            onclick="changeBg('url(/img/bg/bg-pc-2.jpg)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(/img/bg/bg-pc-3.jpg)"
            class="imgbox"
            onclick="changeBg('url(/img/bg/bg-pc-3.jpg)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(/img/bg/bg-pc-4.jpg)"
            class="imgbox"
            onclick="changeBg('url(/img/bg/bg-pc-4.jpg)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(https://cdn-hw-static2.shanhutech.cn/bizhi/staticwp/202307/8fcf913bba1a703714e2dc7cd1bdba3e--2133436291.jpg)"
            class="imgbox"
            onclick="changeBg('url(https://cdn-hw-static2.shanhutech.cn/bizhi/staticwp/202307/8fcf913bba1a703714e2dc7cd1bdba3e--2133436291.jpg)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(https://cdn-hw-static2.shanhutech.cn/bizhi/staticwp/202407/18eb61a58120b76130803b26246d83f7--208058497.jpg)"
            class="imgbox"
            onclick="changeBg('url(https://cdn-hw-static2.shanhutech.cn/bizhi/staticwp/202407/18eb61a58120b76130803b26246d83f7--208058497.jpg)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(https://cdn-hw-static2.shanhutech.cn/bizhi/staticwp/202408/4d78b8c4a3a3547c0e3b21b85401b687--1602406427.jpg)"
            class="imgbox"
            onclick="changeBg('url(https://cdn-hw-static2.shanhutech.cn/bizhi/staticwp/202408/4d78b8c4a3a3547c0e3b21b85401b687--1602406427.jpg)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(https://cdn-hw-static2.shanhutech.cn/bizhi/staticwp/202405/4a913a3a8d36b0fd2dd28de7cb9f7c08--2822596592.jpg)"
            class="imgbox"
            onclick="changeBg('url(https://cdn-hw-static2.shanhutech.cn/bizhi/staticwp/202405/4a913a3a8d36b0fd2dd28de7cb9f7c08--2822596592.jpg)')"
        ></a>
    </div>

    <h2 id="图片（移动端）">
        <a href="#图片（移动端）" class="headerlink" title="图片（移动端）"></a>图片（移动端）
    </h2>
    <div class="bgbox">
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(/img/bg/bg-m-1.jpg)"
            class="imgbox"
            onclick="changeBg('url(/img/bg/bg-m-1.jpg)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(/img/bg/bg-m-2.jpg)"
            class="imgbox"
            onclick="changeBg('url(/img/bg/bg-m-2.jpg)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(/img/bg/bg-m-3.jpg)"
            class="imgbox"
            onclick="changeBg('url(/img/bg/bg-m-3.jpg)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(/img/bg/bg-m-4.jpg)"
            class="imgbox"
            onclick="changeBg('url(/img/bg/bg-m-4.jpg)')"
        ></a>
    </div>

    <h2 id="图片（随机）">
        <a href="#图片（随机）" class="headerlink" title="图片（随机）"></a>图片（随机）
    </h2>
    <div class="bgbox">
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(https://bing.img.run/1920x1080.php)"
            class="imgbox"
            onclick="changeBg('url(https\://bing.img.run/1920x1080.php)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(https://imgapi.xl0408.top/index.php)"
            class="imgbox"
            onclick="changeBg('url(https\://imgapi.xl0408.top/index.php)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(https://img.paulzzh.com/touhou/random)"
            class="imgbox"
            onclick="changeBg('url(https\://img.paulzzh.com/touhou/random)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            style="background-image: url(https://api.yimian.xyz/img?size=1920x1080)"
            class="imgbox"
            onclick="changeBg('url(https\://api.yimian.xyz/img?size=1920x1080)')"
        ></a>
    </div>

    <h2 id="渐变色">
        <a href="#渐变色" class="headerlink" title="渐变色"></a>渐变色
    </h2>
    <div class="bgbox">
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            class="box"
            style="background: linear-gradient(to right, #eecda3, #ef629f)"
            onclick="changeBg('linear-gradient(to right, #eecda3, #ef629f)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            class="box"
            style="background: linear-gradient(to right, #e4afcb 0%, #b8cbb8 0%, #b8cbb8 0%, #e2c58b 30%, #c2ce9c 64%, #7edbdc 100%)"
            onclick="changeBg('linear-gradient(to right, #e4afcb 0%, #b8cbb8 0%, #b8cbb8 0%, #e2c58b 30%, #c2ce9c 64%, #7edbdc 100%)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            class="box"
            style="background: linear-gradient(to top, #30cfd0 0%, #330867 100%)"
            onclick="changeBg('linear-gradient(to top, #30cfd0 0%, #330867 100%)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            class="box"
            style="background: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)"
            onclick="changeBg('linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            class="box"
            style="background: linear-gradient(to right, #EAECC6, #2BC0E4)"
            onclick="changeBg('linear-gradient(to right, #EAECC6, #2BC0E4)')"
        ></a>
        <a
            href="javascript:;"
            rel="noopener external nofollow"
            class="box"
            style="background: linear-gradient(60deg, #ffd7e4 0%, #c8f1ff 100%)"
            onclick="changeBg('linear-gradient(60deg, #ffd7e4 0%, #c8f1ff 100%)')"
        ></a>
    </div>

    <h2 id="纯色">
        <a href="#纯色" class="headerlink" title="纯色"></a>纯色
    </h2>
    <div class="bgbox">
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #eef7f2" onclick="changeBg('#eef7f2')"></a>
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #7D9D9C" onclick="changeBg('#7D9D9C')"></a>
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #C7EDCC" onclick="changeBg('#C7EDCC')"></a>
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #E3DCCF" onclick="changeBg('#E3DCCF')"></a>
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #0F69B8" onclick="changeBg('#0F69B8')"></a>
        <a href="javascript:;" rel="noopener external nofollow" class="box" style="background: #F0AABE" onclick="changeBg('#F0AABE')"></a>
    </div>
`;
}

// 适应窗口大小
function winResize() {
    let box = document.querySelector('#changeBgBox')
    if (!box || box.classList.contains('min') || box.classList.contains('max')) return // 2023-02-10更新
    var offsetWid = document.documentElement.clientWidth;
    if (offsetWid <= 768) {
        winbox.resize(offsetWid * 0.95 + "px", "90%").move("center", "center");
    } else {
        winbox.resize(offsetWid * 0.6 + "px", "70%").move("center", "center");
    }
}

// 切换状态，窗口已创建则控制窗口显示和隐藏，没窗口则创建窗口
function toggleWinbox() {
    if (document.querySelector('#changeBgBox')) winbox.toggleClass('hide');
    else createWinbox();
}
