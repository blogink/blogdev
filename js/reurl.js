
// 重定向浏览器地址，解决hexo-offline-popup和pjax同时使用时地址栏链接后缀的问题
pjax.site_handleResponse = pjax.handleResponse;
pjax.handleResponse = function(responseText, request, href, options) {
    Object.defineProperty(request, 'responseURL', {
        value: href
    });
    pjax.site_handleResponse(responseText, request, href, options);
}
