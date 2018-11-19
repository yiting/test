//个人中心相关接口
const express = require('express');
const router = express.Router()
const project = require('../models/project');
const user = require('../models/user');
console.log()
//请求个人中心
router.get('/', function (req, res, next) {
    res.render('person', {
        title: '设计编译 - 个人中心'
    });
});


//获取所有项目
router.post('/getAllProjectById', function(req, res, next){
    var p=new project()
    p.getAllProjectById(req.body.userid,function(result){
        res.json(result);
    });
});

//获取一个项目
router.post('/deleteProjectById', function(req, res, next){
    var p=new project()
    p.deleteProjectById(req.body.id,function(result){
        res.json(result);
    });
});

//获取个人信息
router.post('/findStaff', function(req, res, next){
    var u=new user()
    u.findStaff(req.body.staffid,function(result){
        res.json(result);
    });
});

module.exports =router;