const express = require('express');
const router = express.Router();
const project = require('../models/project');
//创建新项目
router.post('/create', function(req, res, next){
    var p=new project(req.body);
    var user = p.create(function(result){
        res.json(result);
    });
});