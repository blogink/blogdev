function dark() {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var n, e, i, h, t = 0.05,
        s = document.getElementById("universe"),
        o = !0,
        lastDraw = 0,
        a = "180,184,240",
        r = "226,225,142",
        d = "226,225,224",
        c = [];

    function f() {
        (n = window.innerWidth), (e = window.innerHeight), (i = 0.216 * n), s.setAttribute("width", n), s.setAttribute("height", e)
    }

    function u() {
        h.clearRect(0, 0, n, e);
        for (var t = c.length, i = 0; i < t; i++) {
            var s = c[i];
            s.move(), s.fadeIn(), s.fadeOut(), s.draw()
        }
    }

    function y() {
        (this.reset = function() {
            (this.giant = m(3)), (this.comet = !this.giant && !o && m(10)), (this.x = l(0, n - 10)), (this.y = l(0, e)), (this.r = l(1.1, 2.6)), (this.dx = l(t, 6 * t) + (this.comet + 1 - 1) * t * l(50, 120) + 2 * t), (this.dy = -l(t, 6 * t) - (this.comet + 1 - 1) * t * l(50, 120)), (this.fadingOut = null), (this.fadingIn = !0), (this.opacity = 0), (this.opacityTresh = l(0.2, 1 - 0.4 * (this.comet + 1 - 1))), (this.do = l(5e-4, 0.002) + 0.001 * (this.comet + 1 - 1))
        }), (this.fadeIn = function() {
            this.fadingIn && ((this.fadingIn = !(this.opacity > this.opacityTresh)), (this.opacity += this.do))
        }), (this.fadeOut = function() {
            this.fadingOut && ((this.fadingOut = !(this.opacity < 0)), (this.opacity -= this.do * 0.5), (this.x > n || this.y < 0) && ((this.fadingOut = !1), this.reset()))
        }), (this.draw = function() {
            if ((h.beginPath(), this.giant))(h.fillStyle = "rgba(" + a + "," + this.opacity + ")"), h.arc(this.x, this.y, 2, 0, 2 * Math.PI, !1);
            else if (this.comet) {
                (h.fillStyle = "rgba(" + d + "," + this.opacity + ")"), h.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, !1);
                for (var t = 0; t < 30; t++)(h.fillStyle = "rgba(" + d + "," + (this.opacity - (this.opacity / 20) * t) + ")"), h.rect(this.x - (this.dx / 4) * t, this.y - (this.dy / 4) * t - 2, 2, 2, ), h.fill()
            } else(h.fillStyle = "rgba(" + r + "," + this.opacity + ")"), h.rect(this.x, this.y, this.r, this.r);
            h.closePath(), h.fill()
        }), (this.move = function() {
            (this.x += this.dx), (this.y += this.dy), !1 === this.fadingOut && this.reset(), (this.x > n - n / 4 || this.y < 0) && (this.fadingOut = !0)
        }), setTimeout(function() {
            o = !1
        }, 50)
    }

    function m(t) {
        return Math.floor(1e3 * Math.random()) + 1 < 10 * t
    }

    function l(t, i) {
        return Math.random() * (i - t) + t
    }
    f(), window.addEventListener("resize", f, !1), (function() {
        h = s.getContext("2d");
        for (var t = 0; t < i; t++)(c[t] = new y()), c[t].reset();
        u()
    })(),

    /* 绘制循环，做成可停可启。
       以前是「永远排帧，只有深色才画」：关掉粒子后 canvas 虽然被隐藏，
       rAF 照样每帧回调。现在 stop() 直接 cancelAnimationFrame，关掉后
       一帧都不排；同时在深色 + 页面可见时压到 ~30fps（33ms 一帧）——
       这张 canvas 的 z-index 是 -998，压在所有卡片下面，它每重绘一帧，
       上面每一层 backdrop-filter 都要重新采样，帧率减半 = 连带成本减半，
       而星星漂得很慢，肉眼几乎无差。 */
    (function() {
        var rafId = 0, wanted = false;
        function loop(now) {
            rafId = 0;
            if (!wanted) return;
            var isDark = document.documentElement.getAttribute("data-theme") == "dark";
            if (isDark && !document.hidden && now - lastDraw >= 33) { lastDraw = now; u() }
            rafId = window.requestAnimationFrame(loop);
        }
        function start() {
            wanted = true;
            if (!rafId) rafId = window.requestAnimationFrame(loop);
        }
        function stop() {
            wanted = false;
            if (rafId) { window.cancelAnimationFrame(rafId); rafId = 0; }
        }
        window.sccUniverse = { start: start, stop: stop };
        // 首次状态已由 head 引导脚本写在 <html> 上；属性缺失时按「开」处理。
        if (document.documentElement.getAttribute("data-scc-universe") !== "off") start();
    })();
}
dark();