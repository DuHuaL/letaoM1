const express = require('express');
const router = require('./router');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const app = express();

app.use(cors({
  origin: ['http://localhost:8080'],//可以设置多个跨域
  credentials: true //允许客户端携带验证信息
}));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// 处理静态资源
app.use('/mobile',express.static('mobile'));
// app.use('/public/css/mobile.css',express.static('public/css/mobile.css'));
app.use('/node_modules', express.static('node_modules'));
// app.engine('html', require('express-art-template'));

//做统一的登录验证的
// app.use(function(req,res,next){
//   var sessionObj = req.session;
//   var data1 = JSON.stringify(sessionObj);
//   sessionObj = JSON.parse(data1);
//   if(sessionObj.username) {
//     //进入此判断说明已经登陆
//     next();
//   } else {
//     //进入此判断说明没有登录
//     //再次判断是否是登录页面
//     var url = req.url;
//     if(url == '/user/login') {
//       //如果是登录页面继续进行
//       next();
//     } else {
//       //进入此判断说明不是登录页面
//       //提示跳转到登录页面
//       res.json({error: 400, message: "未登录"});
//     }
//   }
// });
app.use(router);
//
app.listen(3000,() =>{
  console.log('running');
});