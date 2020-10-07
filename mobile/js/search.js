$(function() {
  //1、默认渲染历史记录
  //1-1、有记录，读取出来，渲染到页面
  //1-2、没有记录 显示无记录
  //2、根据输入的关键字 跳转到搜索列表页进行搜索
  //2-1、验证 如果没有输入关键字 提示用户输入关键字
  //2-2、存储刚才的搜索关键字
  //2-2-1、只能存储10条
  //2-2-2、如果是新的历史记录 且没有超过10条 往后追加
  //2-2-3、如果是新的历史记录 且超过10条 往后追加 但是去掉第一条
  //2-2-4、如果是旧的历史搜索记录 往后追加 清除之前的那一条
  //3、删除点击的当前历史 重新渲染列表
  //4、点击清空的时候，清除所有的历史 重新渲染列表
  new Search();
});
var Search = function(storageKey) {
  //约定存储数据的key
  this.storageKey = storageKey || 'letaoHistory';
  //获取搜索历史记录
  this.historyArr = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  this.init();
};
Search.prototype.init = function() {
  this.render();
  this.bindEvent();
};
// 渲染列表
Search.prototype.render = function() {
  //传入的数据在模板内是可以直接使用 默认变量名称 $value
  $('.lt_history').html(template('history',this.historyArr));
};
//添加历史
Search.prototype.addStorage = function(key) {
  var newObj = this.isNewKey(key);
  //判断是否是新的关键字
  if(newObj.isNewKey) {
    //新的
    if(this.historyArr.length < 10) {
      this.historyArr.push(key);
    } else {
      //保留后10个 删除之前所有的
      this.historyArr.push(key);
      this.historyArr.splice(0, this.historyArr.length - 10);
    }
  } else {
    //旧的
    this.historyArr.push(key);
    this.historyArr.splice(newObj.oldIndex, 1);
  } 
  localStorage.setItem(this.storageKey,JSON.stringify(this.historyArr));
};
//判断是否是新的关键字
Search.prototype.isNewKey = function(key) {
  //默认是新的
  var obj = {};
  obj.isNewKey = true;
  this.historyArr.forEach((v,k) => {
    if(v == key){
      obj.isNewKey = false;
      obj.oldIndex = k;
      return false;
    }
  });
  return obj;
};
//删除历史
Search.prototype.removeStorage = function(index) {
  this.historyArr.splice(index, 1);
  localStorage.setItem(this.storageKey,JSON.stringify(this.historyArr));
  this.render();
};
//清空历史
Search.prototype.clearStorage = function() {
  this.historyArr = [];
  localStorage.removeItem(this.storageKey);
  this.render();
};
//事件绑定
Search.prototype.bindEvent = function() {
  var that = this;
  //mui 提供tap事件
  $('.lt_search a').on('tap',function(){
    var $input = $('.lt_search input');
    var key = $.trim($input.val());
    if(!key) {
      mui.toast('请输入关键字');
      return false;
    }
    // 存储关键字
    that.addStorage(key);
    //跳到搜索列表页
    location.href = 'searchList.html?key=' + encodeURIComponent(key);
    $input.val('');
  });
  //删除当前一条
  $('.lt_history').on('tap','li span',function() {
    var index = $(this).data('index');
    that.removeStorage(index);
  });

  //清空
  $('.lt_history').on('tap','.title a',function() {
    that.clearStorage();
  });

  $('.lt_history').on('tap','.content li a',function() {
    var key = $(this).text();
    location.href = 'searchList.html?key='+encodeURIComponent(key);
  });
};
