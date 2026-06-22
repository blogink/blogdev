// 创建时钟管理器
function initClock() {
  // 检查元素是否存在
  const workboard = document.getElementById("workboard");
  if (!workboard) return;
  
  // 清除现有内容
  workboard.innerHTML = '';
  
  // 创建元素
  const logoImg = document.createElement('img');
  logoImg.className = 'boardsign';
  logoImg.alt = '清欢阁状态';
  
  const runtimeDiv = document.createElement('div');
  runtimeDiv.id = 'runtime';
  
  // 添加到容器
  workboard.appendChild(logoImg);
  workboard.appendChild(runtimeDiv);
  
  // 状态管理
  let lastStatus = null;
  const create_time = Math.round(new Date('2023/6/20 00:00:00').getTime() / 1000);
  
  // 更新函数
  const updateClock = () => {
    // 检查元素是否仍然存在（防止PJAX后元素被移除）
    if (!document.getElementById("workboard")) return;
    
    // 计算时间
    const timestamp = Math.round(Date.now() / 1000);
    let seconds = timestamp - create_time;
    
    const years = Math.floor(seconds / (365 * 86400));
    seconds %= 365 * 86400;
    
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;
    
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    
    // 使用本地时间判断状态
    const currentHour = new Date().getHours();
    const isOpen = currentHour >= 8 && currentHour < 22;
    
    // 仅当状态变化时更新徽标
    if (lastStatus !== isOpen) {
      if (isOpen) {
        logoImg.src = `https://img.shields.io/badge/清欢阁-营业中-6adea8?style=social&logo=cakephp&t=${Date.now()}`;
        logoImg.title = '距离百年老店也就差不到一百年~';
      } else {
        logoImg.src = `https://img.shields.io/badge/清欢阁-打烊了-6adea8?style=social&logo=coffeescript&t=${Date.now()}`;
        logoImg.title = '这个点了应该去睡觉啦~';
      }
      lastStatus = isOpen;
    }
    
    // 更新时间显示
    runtimeDiv.innerHTML = 
      `${years} YEAR ${days} DAYS ` +
      `${String(hours).padStart(2, '0')}:` +
      `${String(minutes).padStart(2, '0')}:` +
      `${String(seconds).padStart(2, '0')}`;
  };
  
  // 初始更新
  updateClock();
  
  // 设置定时器
  let clockInterval = setInterval(updateClock, 1000);
  
  // 清理函数（用于PJAX场景）
  return () => {
    clearInterval(clockInterval);
  };
}

// 初始执行
let cleanupClock = initClock();

// PJAX兼容处理
if (typeof window !== 'undefined') {
  // 监听可能的PJAX事件
  const handlePageChange = () => {
    // 清理之前的时钟
    if (cleanupClock) cleanupClock();
    
    // 重新初始化
    cleanupClock = initClock();
  };
  
  // PJAX重载事件（根据实际使用的PJAX库调整）
  document.addEventListener('pjax:complete', handlePageChange);
  window.addEventListener('hashchange', handlePageChange);
  
  // 常规页面卸载清理
  window.addEventListener('beforeunload', () => {
    if (cleanupClock) cleanupClock();
  });
}
/*
setInterval(() => {
  // let create_time = Math.round(new Date('2023-6-20 00:00:00').getTime() / 1000); //（原）在此行修改建站时间
  // 有苹果用户发现safari浏览器不能正常运行，百度了一下发现是格式化的问题，改成下面这种应该就可以了。感谢反馈。
  let create_time = Math.round(new Date('2023/6/20 00:00:00').getTime() / 1000); //在此行修改建站时间
  let timestamp = Math.round((new Date().getTime()) / 1000);
  let second = timestamp - create_time;
  let time = new Array(0, 0, 0, 0, 0);

  var nol = function(h){
    return h>9?h:'0'+h;
  }
  if (second >= 365 * 24 * 3600) {
    time[0] = parseInt(second / (365 * 24 * 3600));
    second %= 365 * 24 * 3600;
  }
  if (second >= 24 * 3600) {
    time[1] = parseInt(second / (24 * 3600));
    second %= 24 * 3600;
  }
  if (second >= 3600) {
    time[2] = nol(parseInt(second / 3600));
    second %= 3600;
  }
  if (second >= 60) {
    time[3] = nol(parseInt(second / 60));
    second %= 60;
  }
  if (second > 0) {
    time[4] = nol(second);
  }
  if ((Number(time[2])<22) && (Number(time[2])>7)){
    currentTimeHtml ="<img class='boardsign' src='https://img.shields.io/badge/清欢阁-营业中-6adea8?style=social&logo=cakephp' title='距离百年老店也就差不到一百年~'><div id='runtime'>" + time[0] + ' YEAR ' + time[1] + ' DAYS ' + time[2] + ' : ' + time[3] + ' : ' + time[4] + '</div>';
  }
  else{
    currentTimeHtml ="<img class='boardsign' src='https://img.shields.io/badge/清欢阁-打烊了-6adea8?style=social&logo=coffeescript' title='这个点了应该去睡觉啦~'><div id='runtime'>" + time[0] + ' YEAR ' + time[1] + ' DAYS ' + time[2] + ' : ' + time[3] + ' : ' + time[4] + '</div>';
  }
  document.getElementById("workboard").innerHTML = currentTimeHtml;
}, 1000);
*/