$(function(){
  $('.mui-btn-primary').on('tap',function(){
    var username = $.trim($('[name="username"]').val());
    var password = $.trim($('[name="password"]').val());
    // 校验
    if(!username) {
      mui.toast('请输入用户名');
      return false;
    }
    if(!password) {
      mui.toast('请输入密码');
      return false;
    }

    // 提交
    $.ajax({
      type: 'post',
      url: 'http://localhost:3000/user/login',
      xhrFields:{withCredentials:true},
      data: {
        username: username,
        password: password
      },
      dataType: 'json',
      success: function(data) {
        if(data.status === 201) {
          //登录成功
          //回跳
          var params = letao.getParamsByUrl();
          if(params.returnUrl) {
            //1、从其他页面跳过来，需要跳回那个页面
            // 获取url上的地址
            location.href = decodeURIComponent(params.returnUrl);
          } else {
             //2、直接登录的，回到首页
             location.href = '../views/user/index.html';
          }
        } else {
          mui.alert(data.msg);
          $('[name="username"]').val('');
          $('[name="password"]').val('');
        }
      }
    });
  });
});