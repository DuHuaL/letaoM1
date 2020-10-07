$(function() {
  //0、把url中的关键字赋值给输入框
  //1、初始化 根据输入框中的关键字进行下拉加载，并且渲染列表内容
  //2、主动下拉的时候 根据输入框的内容进行搜索 并且渲染
  //3、点击搜索按钮 根据搜索框的内容进行下拉加载
  //4、主动上拉 根据输入框中的关键字上拉加载追加渲染列表内容
  //5、点击排序
  //5-1、点击任何排序 选中 根据当前的排序进行搜索 默认降序
  //5-2、已经点击了排序 再次点击根据当前的排序进行搜索 反着进行排序
  new SearchList();
});
var SearchList = function() {
  //输入框
  this.$input = $('.lt_search input');
  this.key = this.queryUrlParams().key;
  this.page = 1;
  this.orderObj = {},
  this.init();
};
SearchList.prototype.init = function() {
  var that = this;
  //给输入框赋值
  that.$input.val(that.key);
  //初始化下啦或上拉
  mui.init({
    //拉去刷新容器的名称
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down : {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        indicators: false,//去除滚动条
        //下拉之后需要做的事情
        //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        callback :function(){
          //请求服务 响应成功 取消刷新效果
          //mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
          that.page = 1;
          that.renderList(function(){
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            //重置上拉加载效果
            mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
          });
        } 
      },
      up: {
        indicators: false,
        callback: function() {
          // setTimeout(function(){
          //   mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh()
          // },1000);
          that.page++;
          that.renderList(function(data){
            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(data.list.length==0);
          })
        }
      }
    }
  });
  that.bindEvent();
};
//获取地址栏数据
SearchList.prototype.queryUrlParams = function() {
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
//渲染
SearchList.prototype.renderList = function(callback) {
  var that = this;
  // console.log(that.orderObj);
  //将排序合并到data属性中
  $.ajax({
    type: 'get',
    url: 'http://localhost:3000/product/queryProduct',
    xhrFields:{withCredentials:true},
    data: $.extend({
      proName: that.key,
      page: that.page,
      pageSize: 4
    },that.orderObj),
    success: function(data) {
      console.log(data);
      //模拟五百毫秒网络延迟的效果
      setTimeout(function(){
        //判断是下拉还是第一次加载，还是上拉
        if(that.page == 1) {
          //是第一次加载或上拉
          $('.lt_product ul').html(template('renderList',data));
        } else {
          //上拉追加
          $('.lt_product ul').append(template('renderList',data));
        }
        
        callback && callback(data);
      },500);
    }
  });
};
//绑定事件
SearchList.prototype.bindEvent = function() {
  var that = this;
  $('.lt_search a').on('tap',function() {
    that.key = that.$input.val();
    //点击搜索需要下拉效果 加载数据 再去渲染列表
    //js的方式去触发下拉刷新效果
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  });

  $('.lt_order a').on('tap',function(){
    //根据不同的排序类型重新渲染列表
    //price 1升序 2 降序
    //num 1升序 2降序 
    var $aList = $('.lt_order a');
    //1、判断点击的元素是否已经是选中的
    if($(this).hasClass('now')) {
      //已经选中
      var $angle = $(this).find('span');
      if($angle.hasClass('mui-icon-arrowdown')) {
        $angle.addClass('mui-icon-arrowup').removeClass('mui-icon-arrowdown');
      } else {
        $angle.addClass('mui-icon-arrowdown').removeClass('mui-icon-arrowup');
      }
    } else {
      //未选中 //回复其他按钮的箭头默认朝下
      $aList.removeClass('now').find('span').addClass('mui-icon-arrowdown').removeClass('mui-icon-arrowup');
      $(this).addClass('now');
    }
    //获取排序信息
    //根据当前选中的a 和箭头方向
    var orderType = $(this).data('orderType');
    var orderValue = $(this).find('span').hasClass('mui-icon-arrowdown') ? 2 : 1;
    //将上面两个追加到Ajax请求中的data属性中即属性为orderType：orderValue
    that.orderObj = {};
    that.orderObj[orderType] = orderValue;
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  });
};
//排序
SearchList.prototype.changeOrderType = function() {};