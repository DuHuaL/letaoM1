const express = require('express');
const router = express.Router();
var process = require('./process');
router
    .get('/user/login',process.getLogin)
    .post('/user/login',process.postLogin)
    .get('/',process.getIndex)
    .get('/category/queryTopCategory',process.getTopCategory)
    .get('/category/querySecondCategory',process.getSecondCategory)
    .get('/product/queryProduct', process.getProduct)
    .get('/product/queryProductDetail',process.getProductDetail)
    .post('/cart/addCart',process.postAddCart)
    .get('/cart/queryCart',process.getQueryCart)
    .post('/cart/updateCart',process.postUpdateCart)
    .get('/cart/deleteCart',process.getDeleteCart);
module.exports = router; 