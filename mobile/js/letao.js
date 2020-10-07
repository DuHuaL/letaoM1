(function(w,z){
  if(!w.letao) {
    w.letao = {};
  }
  var getParamsByUrl= function() {
    var obj = {};
    //获取搜索信心 url?之后的信息
    var search = location.search;
    if(search) {
      search = search.replace(/^\?/,'');
      if(search) {
        var arr = search.split('&');
        arr.forEach((v,k) => {
          var itemArr = v.split('=');
          obj[itemArr[0]] = itemArr[1];
        });
      }
    }
    return obj;
  };
  //拦截未登录的时候
  var ajax = function(options) {
    //修改success的逻辑
    var mySuccess = options.success;
    // 重新定义success的逻辑
    options.success = function(data) {
      if(data.error == 400) {
        //将要回跳的地址
        var url = encodeURIComponent(location.href);
        location.href = '../views/user/login.html?returnUrl=' + url;
      } else {
        
        mySuccess && mySuccess();
      }
    };
    $.ajax(options);
  };
  w.letao.getParamsByUrl = getParamsByUrl;
  w.letao.ajax = ajax;
})(window,$);