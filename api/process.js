const md5 = require('md5');
const fs = require('fs');
const uurl = require('url');
var db = require('./data');
module.exports.getLogin = function(req,res) {
  
};
//登录
module.exports.postLogin = function(req,res) {
  var params = req.body;
  var data1 = JSON.stringify(params);
  params = JSON.parse(data1);
  var sql = `select * from user`;
  db.query(sql,(err,result,fields) => {
    if(err) throw err;
    //验证登录信息
    result.forEach((item,index) => {
      if(item.username == params.username) {
        //验证成功
        //保存session
        req.session.username = params.username;
        //响应会浏览器
        res.json({msg: "登录成功",status: 201});
      } else {
        res.json({msg: "验证失败,请重新登录",status: 400})
      }
    });
  });
};
module.exports.getIndex = function(req,res) {
  
};
//获取一级分类
module.exports.getTopCategory = function(req,res) {
  var url = req.url;
  var sql = 'select * from category';
  db.query(sql,(err,result,fields) => {
    if(err) throw err;
    res.json({rows: result});
  });
};
//获取二级分类
module.exports.getSecondCategory = function(req,res) {
  var url = req.url;
  var id = uurl.parse(url, true).query.id;
  var sql = `select * from brand where categoryId = ${id}`;
  db.query(sql,(err,result,fields) => {
    if(err) throw err;
    for(var i =0;i<result.length;i++) {
      result[i].brandLogo = 'http://localhost:3000'+ result[i].brandLogo;
    }
    res.json({rows: result});
  });
};
//商品列表页
module.exports.getProduct = function(req,res) {
  var url = req.url;
  var query = uurl.parse(url,true).query;
  var data = JSON.stringify(query);
  var paramsObj = JSON.parse(data); 
  var obj = {};
  var sql0 = 'select *from product';
  db.query(sql0,(err0,result0,fields0) => {
    if(err0) throw err0;
    obj.count = result0.length;
  });
  var sql = `select * from product where proName like '%${paramsObj.proName}%' LIMIT ${paramsObj.page},${paramsObj.pageSize}`;
  db.query(sql, (err, result, fields) =>{
    if(err) throw err;
    obj.page= Number(paramsObj.page);
    obj.pageSize = Number(paramsObj.pageSize);
    // obj.list = result;
    obj.list = result;
    res.json(obj);
  });  
};
//获取商品详情页信息
module.exports.getProductDetail = function(req,res) {
  var url = req.url;
  var pId = uurl.parse(url,true).query.id;
  var sql = `select * from product where id = ${pId}`;
  db.query(sql,(err,result,fields) => {
    if(err) throw err;
    res.json({data: result});
  });
};
//添加购物车
module.exports.postAddCart = function(req,res) {
  var paramsObj = req.body;
  var data1 = JSON.stringify(paramsObj);
  paramsObj = JSON.parse(data1);
  console.log(req.session.username);
  if(req.session.username) {
    var sql = `insert into cart (productId,num,size) values (${paramsObj.productId},${paramsObj.num},${paramsObj.size})`;
    db.query(sql,(err,result,fields)=> {
      if(err) throw err;
      if(result.affectedRows == 1) {
        res.json({ msg: "添加成功",status:200});
      }
    });
  } else {
    res.send({msg:"请先登录",status:400});
  }
};
//获取购物车信息
module.exports.getQueryCart = function(req,res) {
  var sql = 'select * from cart';
  db.query(sql,(err,result,fields) => {
    if(err) throw err;
    for(var i = 0; i < result.length; i++) {
      (function(i){
        var proId = result[i].productId;
        var sql1 = `select * from product where id=${proId}`;
        db.query(sql1,(err1,result1,fields1) => {
          if(err1) throw err1;
          for(var j = 0; j < result1.length; j++) {
            result[i].proName = result1[j].proName;
            result[i].price = result1[j].price;
            result[i].oldPrice = result1[j].oldPrice;
            result[i].productNum = result1[j].num;
            result[i].productSize = result1[j].size;
          }
          if(i == result.length -1) {
            res.send(result);
          }
        });
      })(i);
    }   
  });
};
//更新购物车
module.exports.postUpdateCart = function(req,res) {
  var params = req.body;
  var data1 = JSON.stringify(params);
  params = JSON.parse(data1);
  var sql = `update cart set num=${params.num},size=${params.size} where id=${params.id}`;
  db.query(sql,(err,result,fields) => {
    if(err) throw err;
    if(result.affectedRows == 1) {
      res.json({success:true});
    }
  });
};
//删除购物车商品
module.exports.getDeleteCart = function(req,res) {
  var url = req.url;
  var id = uurl.parse(url,true).query.id;
  var sql = `delete from cart where id=${id}`;
  db.query(sql,(err,result,fields) => {
    if(err) throw err;
    if(result.affectedRows == 1) {
      res.json({success:true});
    }
  });
  
};
