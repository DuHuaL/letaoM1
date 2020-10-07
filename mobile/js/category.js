$(function() {
  //1、默认渲染左侧的一级分类
  //2、根据第一个一级分类，渲染对应的二级分类
  //3、点击一级分类可以进行切换
  //4、根据当前点击的一级分类去加载渲染对应的二级分类
  new Category();
});
var Category = function() {
  this.init();
};
//初始化方法
Category.prototype.init = function() {
  var that = this;
  //一级分类
  that.renderTopCategory(function(data) {
    var id= data.rows[0].id
    //二级分类
    that.renderSecondCategory(id);
  });
  //初始化切换功能
  that.toggleTopCategory();
};
//渲染顶级分类
Category.prototype.renderTopCategory = function(callback) {
  $.ajax({
    url: 'http://localhost:3000/category/queryTopCategory',
    type: 'get',
    data: {},
    xhrFields:{withCredentials:true},
    dataType: 'json',
    success:function(data) {
      // console.log(data);
      //使用模板引擎渲染页面
      var html = template('topRender',data);
      $('.lt_cateLeft ul').html(html);
      //传个回调函数把数据的id传给二级分类，用于渲染
      callback && callback(data);
    }
  });
};
//渲染二级分类
Category.prototype.renderSecondCategory = function(id) {
  $.ajax({
    type: 'get',
    url: 'http://localhost:3000/category/querySecondCategory',
    xhrFields:{withCredentials:true},
    data: {
      id: id
    },
    dataType: 'json',
    success:function(data) {
      var html = template('secondRender',data);
      $('.lt_cateRight ul').html(html);
    }
  });
};
//切换分类
Category.prototype.toggleTopCategory = function() {
  var that = this;
  // tap  zepto touch mui 都会提供
  $('.lt_cateLeft ul').on('tap','li a', function() {
    // 修改样式
    $('.lt_cateLeft ul li').removeClass('now');
    $(this).parent().addClass('now');
    //二级分类渲染
    var id = $(this).data('id');
    that.renderSecondCategory(id);
  });
};