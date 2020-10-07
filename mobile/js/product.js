$(function(){
  //初始化轮播图
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
  });
  //初始化区域滚动
  mui('.mui-scroll-wrapper').scroll({
    indicators: false
  });

  //0、获取地址栏的商品id
  //1、主动触发下拉刷新 去渲染商品详情
  //1-1、轮播图的渲染和初始化
  //1-2、渲染尺码按钮 40-50这个范围
  //2、选择尺码的交互效果
  //3、选择数量 最小0，最大是剩余数量（库存）
  //4、加入购物车
  //4-1、验证尺码
  //4-2、验证数量
  //4-3、提交
  //4-4、响应
  //4-4-1、没有登录，跳转登录页，登录完成返回商品详情页
  //4-4-2、如果已经登录 添加成功 弹出提示框 ‘亲，添加成功，去购物车看看吗’
  //4-4-3、否 关闭提示框
  //4-4-4、是 跳转到购物车页面
  new Product();
});
var Product = function() {
  this.productId = letao.getParamsByUrl().id;
  //需要动态渲染的容器
  this.$el = $('.mui-scroll');
  this.num = 1;//默认一件
  this.init();
};
Product.prototype.init = function() {
  var that = this;
  mui.init({
    pullRefresh: {
      container: '.mui-scroll-wrapper',
      indicators: false,
      down: {
        auto: true,
        callback: function(){
          that.render(function(){
            // 关闭下拉效果
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
          });
        }
      }
    }
  });
  //初始化的时候调用事件绑定
  that.bindEvent();
};
Product.prototype.render = function(callback) {
  var that = this;
  $.ajax({
    type: 'get',
    url: 'http://localhost:3000/product/queryProductDetail',
    xhrFields:{withCredentials:true},
    data: {
      id: that.productId
    },
    dataType: 'json',
    success: function(data) {
      // 渲染
      that.$el.html(template('detail',data));
      // 初始化轮播图 // 由于接口数据里没有图片，所以这里是静态的，正常动态渲染需要初始化轮播图
      mui('.mui-slider').slider({
        interval: 2000
      });
      callback && callback();
    }
  });
};
Product.prototype.changeSize = function($this) {
  // 选择尺码
  $('.pro_size span').removeClass('now');
  $this.addClass('now');
  // 选择的时候记录尺码
  this.size = $this.text();
};
Product.prototype.changeNum = function($this) {
  //选择数量
  var $input = $('.pro_num input');
  var value = $input.val();
  var max = $input.data('max');
  var type = $this.data('type');
  if(type== 0) {
    // 减
    if(value <= 1) {
      mui.toast('亲，不能再少了');
      return false;
    }
    value --;
  } else {
    //加
    if(value >= max) {
      mui.toast('亲，不能再多了');
      return false;
    }
    value ++;
  }
  $input.val(value);
  //记录先择的数量
  this.num = value;
};
Product.prototype.addCart = function() {
  var that = this;
  //添加购物车 
  if(!that.size) {
    mui.toast('亲，请选择尺码');
    return  false;
  }
  if(!that.num) {
    mui.toast('亲，请选择数量');
    return false;
  }
  $.ajax({
    type: 'post',
    url: 'http://localhost:3000/cart/addCart',
    xhrFields:{withCredentials:true},
    data: {
      productId: that.productId,
      num: that.num,
      size: that.size
    },
    dataType: 'json',
    success:function(data) {
      if(data.status === 200) {
        //弹框提示
        mui.confirm('亲，添加成功,去购物车看看?','温馨提示',['取消','确认'],function(e){
          //点击按钮的时候执行
          // console.log(e);
          if(e.index ==1) {
            location.href = '../views/user/cart.html';
            //阻止关闭窗口
            return false;
          }
        });
      } else {
        var url = encodeURIComponent(location.href);
        location.href = '../views/user/login.html?returnUrl=' + url;
      }
    }
  });
};
Product.prototype.bindEvent = function() {
  var that = this;
  //选择尺码
  that.$el.on('tap','.pro_size span',function() {
    that.changeSize($(this));
  });
  //选择数量
  that.$el.on('tap','.pro_num span',function() {
    that.changeNum($(this));
  });
  //加入购物车
  $('.addCart').on('tap',function() {
    that.addCart();
  });
};
