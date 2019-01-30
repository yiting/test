/*1.系统包、工具模块*/
const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const router = express.Router();
//依赖文件下载包
const archiver = require("archiver");
//网络包
let requestHttp = require("request");
//上传文件及新的文件名称变量
let originFileName, uploadTimeStamp;
//上传文件配置
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./data/upload_ai_img/");
  },
  filename: function(req, file, cb) {
    originFileName = uploadTimeStamp + "_" + file.originalname;
    //直接保留原始文件格式(.sketch)
    cb(null, originFileName);
  }
});
//上传文件对象
let upload = multer({
  storage: storage
});

/*2.base modules*/
//日志模块(2018-11-09)
const qlog = require("../../server_modules/log/qlog");
let Utils = require("../../server_modules/util/utils");
let ControllerUtils = require("../util/utils");
//导出类
const Export = require("../../server_modules/util/export");
//1.引入parser模块
const Parser = require("../../server_modules/designjson/parser/designjson_parser_sketch")
  .parse;
const Optimize = require("../../server_modules/designjson/optimize/designjson_optimize");
//2.引入dsl模块
const Common = require("../../server_modules/dsl2/dsl_common.js");
const Dsl = require("../../server_modules/dsl2/dsl.js");
const Render = require("../../server_modules/render/render.js");
//3.引入图片模块
let ImageCombine = require("../../server_modules/designimage/img_combine")
  .ImageCombine;

//数据库业务类
const artboard = require("../../models/artboard");
const history = require("../../models/history");
//当前基础库版本相关信息
const MODULES_INFO = require("../../server_modules/version");

module.exports = {
    
};
