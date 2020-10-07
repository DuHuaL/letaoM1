$(function(){
  //需求：
  //1、自动的下拉 加载数据进行渲染
  //2、点击刷新按钮 也可以加载数据进行渲染
  //3、手动下拉 加载数据进行渲染
  //4、编辑功能
  //4-1、点击编辑按钮 需要弹窗
  //4-2、弹框内容 动态渲染 可选尺码 可选数量 当前选择的尺码和数量 都要渲染上去
  //4-3、重新选择尺码 和数量
  //4-4、点击确认之后 请求后台 如果成功 列表重新渲染
  //5、删除
  //5-1、点击删除 弹框
  //5-2、弹框内容 温馨提示 老铁 确认删除改商品吗？
  //5-3、点击确认 请求后台 如果成功 列表重新渲染
  //6、总金额的计算
  //6-1、选择checkbox 重新计算
  //6-2、修改的时候 重新计算
  //6-3、删除的时候 重新计算

  new Cart();
});
var Cart = function() {
  this.$el = $('.mui-table-view');//需要更新的容器
  this.init();
};
Cart.prototype.init = function() {
  var that = this;
  mui.init({
    pullRefresh: {
      container: '.mui-scroll-wrapper',
      indicators: false,
      down: {
        auto: true,
        callback:function() {
          var pr = this;
          that.render(function(){
            //关闭下拉
            pr.endPulldownToRefresh();
          });

        }
      }
    }
  });
  that.bindEvent();
};//渲染
Cart.prototype.render = function(callback) {
  //如果没有存储数据在内存 Ajax 重新渲染 默认后台数据
  //如果获取过一次 存在内存  修改内存
  var that = this;
  if(that.cartList) {
    that.$el.html(template('cart',that.cartList));
    callback && callback();
  } else {
    //这里发请求需要登录，由于接口没写完，这是就省略登录验证
    $.ajax({
      type: 'get',
      url: 'http://localhost:3000/cart/queryCart',
      xhrFields:{withCredentials:true},
      data: {},
      dataType: 'json',
      success:function(data) {
        // console.log(data);
        //保存数据在内存////////////////////////////////////////////
        that.cartList = data;
        that.$el.html(template('cart',data));
        callback && callback();
      }
    });
  }
  
};
//拿存储在内存中的商品信息
Cart.prototype.getCartProductById = function(id) {
  var product = null;
  this.cartList.forEach((v,k)=>{
    if(v.id == id) {
      product = v;
      //追加一个索引
      product.index = k;
      return false;
    }
  });
  return product;
};
//编辑商品信息
Cart.prototype.editCart = function($this) {
  var that = this;
  var id = $this.data('id')
  //根据id获取当前商品信息
  var product = that.getCartProductById(id);
  //弹出窗口并且把当前商品信息渲染上去
  //\n字符会被解析成<br>mui做的
  mui.confirm(template('editCart',{data:product}).replace(/\n/g,''),'编辑商品',['取消','确认'],function(e){
    if(e.index == 1) {
      //确认
      var size = $('.mui-popup-button').data('size');
      var num = $('.mui-popup-button').data('num');
      //提交到后台
      $.ajax({
        type: 'post',
        url: 'http://localhost:3000/cart/updateCart',
        xhrFields:{withCredentials:true},
        data: {
          id: id,
          size: size || product.size,
          num: num || product.num
        },
        dataType: 'json',
        success:function(data) {
          console.log(data);
          if(data.success) {
            //修改成功
            product.size = size;
            product.num = num;
            //渲染列表
            that.render(function(){
              mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            });
            //修改后重新计算金额
            that.setAmount();
          }
        }
      });
    } else {
      //取消关闭滑块
      mui.swipeoutClose($this.parent().parent()[0]);
    }
  });
};
//删除
Cart.prototype.deleteCart = function($this) {
  var that = this
  var id = $this.data('id');
  var index = that.getCartProductById(id).index;
  mui.confirm('老铁,确认删除该商品吗?','删除商品',['取消','确认'],function(e){
    if(e.index == 1) {
      //删除
      $.ajax({
        type: 'get',
        url: 'http://localhost:3000/cart/deleteCart',
        xhrFields:{withCredentials:true},
        data: {
          id:id
        },
        dataType: 'json',
        success:function(data) {
          if(data.success) {
            //更新列表数据
            that.cartList.splice(index,1);
            //渲染列表
            that.render(function(){
              mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            });
            //重新计算金额
            that.setAmount();
          }
        }
      });
    } else {
      //取消
      mui.swipeoutClose($this.parent().parent()[0]);
    }
  });
};
Cart.prototype.changeSize = function($this) {
  // 选择尺码
  $('.pro_size span').removeClass('now');
  $this.addClass('now');
  // 选择的时候记录尺码
  // this.size = $this.text();
  //保存为了提交时候使用
  $('.mui-popup-button').data('size',$this.text());
};
Cart.prototype.changeNum = function($this) {
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
  // this.num = value;
  //保存为了提交时候使用
  $('.mui-popup-button').data('num', value);
};
//复选框计算金额
Cart.prototype.setAmount = function($this) {
  //修改金额
  //计算
  //获取所有被选中的input
  //根据id去拿所有被选中的商品信息
  //去计算数量和单价
  //计算总金额
  //修改
  var amount = 0;
  this.cartList.forEach((v,k) => {
    if(v.isChecked) {v
      //说明被选中
      //计算
      amount += v.num * v.price;
    }
  });
  //设置
  $('.lt_money span').html(amount.toFixed(2));
};
Cart.prototype.bindEvent= function() {
  var that = this;
  //js的方式触发下拉刷新按钮
  $('.mui-icon-refresh').on('tap',function(){
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  });
  //编辑按钮
  that.$el.on('tap','.mui-btn-blue',function() {
    that.editCart($(this));
  });
  //绑定弹窗的尺码和数量
  $('body').on('tap','.pro_size span',function() {
    that.changeSize($(this));
  }).on('tap','.pro_num span',function() {
    that.changeNum($(this));
  });
  //删除按钮
  $('.mui-table-view').on('tap','.mui-btn-red',function(){
    that.deleteCart($(this));
  });
  //修改金额
  that.$el.on('change','input',function(){
    var id = $(this).data('id');
    var product = that.getCartProductById(id);
    //设置一个能够判断是否选中的标识
    //$(this).prop('checked');获取的是布尔类型的
    //prop()  attr()
    product.isChecked = $(this).prop('checked');
    that.setAmount();
  });
};