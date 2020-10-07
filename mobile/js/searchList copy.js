$(function() {
  // mui('.mui-scroll-wrapper').scroll({
  //   indicators: false
  // });
  //0、把url中的关键字赋值给输入框
  //1、初始化 根据输入框中的关键字进行下拉加载，并且渲染列表内容
  //2、主动下拉的时候 根据输入框的内容进行搜索 并且渲染
  //3、点击搜索按钮 根据搜索框的内容进行下拉加载
  //4、主动上拉 根据输入框中的关键字上拉加载追加渲染列表内容
  //5、点击排序
  //5-1、点击任何排序 选中 根据当前的排序进行搜索 默认降序
  //5-2、已经点击了排序 再次点击根据当前的排序进行搜索 反着进行排序
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
          setTimeout(function(){
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
          },1000);
        } 
      },
      up: {
        indicators: false,
        callback: function() {
          setTimeout(function(){
            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh()
          },1000);
        }
      }
    }
  });
});