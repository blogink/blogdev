var percentFlag = false;
let resizeTimer = null;

function essayScroll() {
  const wf = document.querySelector('#waterfall');
  if (!wf) return;

  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const clientH = document.documentElement.clientHeight;
  const pageH = document.documentElement.scrollHeight;

  // 触发瀑布流排版
  if (scrollY + clientH >= pageH - 100 && !percentFlag) {
    percentFlag = true;
    waterfall('#waterfall');
  }
}

// 窗口大小改变时防抖重排
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (document.querySelector('#waterfall')) waterfall('#waterfall');
  }, 200);
});

// 初始化执行
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => waterfall('#waterfall'), 100);
});
function replaceAll(e, n, t) {
  return e.split(n).join(t);
}
var blogessay = {
  diffDate: function (d, more = false) {
    const dateNow = new Date();
    const datePost = new Date(d);
    const dateDiff = dateNow.getTime() - datePost.getTime();
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;

    let result;
    // Check if the suffix object and required properties exist
    const suffix = GLOBAL_CONFIG.date_suffix || {};
    const daySuffix = suffix.day || '天前';
    const hourSuffix = suffix.hour || '小时前';
    const minSuffix = suffix.hour || '分钟前';
    
    if (more) {
      const monthCount = dateDiff / month;
      const dayCount = dateDiff / day;
      const hourCount = dateDiff / hour;
      const minuteCount = dateDiff / minute;

      if (monthCount >= 1) {
        result = datePost.toLocaleDateString().replace(/\//g, "-");
      } else if (dayCount >= 1) {
        result = parseInt(dayCount) + " " + daySuffix;
      } else if (hourCount >= 1) {
        result = parseInt(hourCount) + " " + hourSuffix;
      } else if (minuteCount >= 1) {
        result = parseInt(minuteCount) + " " + minSuffix;
      } else {
        result = suffix.just;
      }
    } else {
      result = parseInt(dateDiff / day);
    }
    return result;
  },
  changeTimeInEssay: function () {
    document.querySelector("#bber") &&
      document.querySelectorAll("#bber time").forEach(function (e) {
        var t = e,
          datetime = t.getAttribute("datetime");
        (t.innerText = blogessay.diffDate(datetime, true)), (t.style.display = "inline");
      });
  },
  reflashEssayWaterFall: function () {
    document.querySelector("#waterfall") &&
      setTimeout(function () {
        waterfall("#waterfall");
        document.getElementById("waterfall").classList.add("show");
      }, 500);
  },
  commentText: function (e) {
    if (e === undefined || e === null || e === 'undefined' || e === 'null') e = '好棒！';
    // 修复原代码中类名末尾多余的空格
    const textarea = document.querySelector('.el-textarea__inner');
    if (!textarea) return;

    // 将换行符统一转为 Markdown 引用格式
    const formattedText = `> ${e.replace(/\n/g, '\n> ')}\n\n`;
    
    textarea.value = formattedText + textarea.value;
    // 触发 input 事件以适配现代前端框架（如 Vue/React 渲染的评论框）
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    
    const commentSection = document.getElementById('post-comment') || document.getElementById('footer');
    if (commentSection) {
      window.scrollTo({ top: commentSection.offsetTop - 80, behavior: 'smooth' });
    }
    
    textarea.focus();
    textarea.setSelectionRange(-1, -1);
    document.getElementById('comment-tips')?.classList.add('show');
  },
};

blogessay.changeTimeInEssay();
blogessay.reflashEssayWaterFall();