//个人中心相关接口
const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const router = express.Router();
//解压包
const unzip = require("unzip");
const uuidv1 = require("uuid/v1");
//工具类
let Utils = require("../server_modules/util/utils");

//业务类
const project = require("../models/project");
const history = require("../models/history");
const user = require("../models/user");
const artboard = require("../models/artboard");

//上传配置
//上传文件及新的文件名称变量;//生成的uuid字符串及返回前台页面的json
let originFileName, potIndex, projectId, responseJson;

//上传文件配置
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./data/upload_file/");
  },
  filename: function(req, file, cb) {
    originFileName = Utils.getDateStr() + "_" + file.originalname.replace(/\s*/g,"");
    //originFileName = Utils.getDateStr() + "_" + file.originalname;
    //截取sketch文件前缀为项目名称(即为sketch文件名)
    potIndex = originFileName.lastIndexOf(".");
    //直接保留原始文件格式(.sketch)
    cb(null, originFileName);
  }
});
//上传文件对象
let upload = multer({
  storage: storage
});

//请求个人中心
router.get("/", function(req, res, next) {
  res.render("person", {
    title: "设计编译 - 个人中心"
  });
});
//创建项目:文件上传及对应上传记录
router.post("/upload", upload.any(), function(req, res, next) {
  //上传文件时，获取当前用户id
  let userid = req.cookies.staffid;
  let newDesFile = "./data/upload_file/" + originFileName;
  //生成uuid(projectid)
  projectId = uuidv1();
  responseJson = {
    message: "上传文件成功",
    filename: originFileName.substring(0, potIndex), //无后缀
    uuid: projectId
  };
  let proId = projectId,
    proName = originFileName.substring(0, potIndex);
  let projectInsert = {
    userid: userid,
    isdel: 0,
    projectId: proId,
    projectName: proName,
    unzipPath: "http://" + req.headers.host + "/unzip_file/" + proName,
    compliePath: "http://" + req.headers.host + "/complie/" + proName
  };
  //插入创建的项目数据到数据库
  let p = new project(projectInsert);
  p.create(function(result) {
    projectInsert.id = result.data.insertId;
    projectInsert.modifytime=result.data.modifytime;
    //console.log("创建项目成功");
    responseJson.projectData = projectInsert;
    //插入数据库成功后，再解压数据
    //2018-08-17:解压zip文件到指定文件夹
    let extract = unzip.Extract({
      path: "./data/unzip_file/" + originFileName.substring(0, potIndex)
    });
    //解压异常处理
    extract.on("error", function(err) {
      console.log(err);
    });
    //解压完成处理
    extract.on("finish", function() {
      console.log("解压完成!!");
      res.end(JSON.stringify(responseJson));
    });
    fs.createReadStream(newDesFile).pipe(extract);
  });
});
//获取所有项目
router.post("/getAllProjectById", function(req, res, next) {
  let p = new project();
  p.getAllProjectById(req.body.userid, function(result) {
    res.json(result);
  });
});
//获取所有浏览过的项目
router.post("/getAllViewHistoryProjectById", function(req, res, next) {
  let h = new history();
  h.getAllHistoryById(req.body.userid, function(result) {
    if (result.code != 0) {
      res.json({});
      return;
    }
    //拿到所有的projectid
    var projectsId = [];
    for (var i = 0; i < result.data.length; i++) {
      projectsId.push(result.data[i]["projectId"]);
    }
    //查找项目
    let p = new project();
    p.getAllProjectByProjectId(projectsId, function(result) {
      res.json(result);
    });

    // res.json(result);
  });
});
//根据id删除浏览过的历史记录
router.post("/deleteHistoryById", function(req, res, next) {
  let h = new history();
  //根据项目id删除当前历史记录表的浏览记录
  h.deleteHistoryById(req.body.pid, function(result) {
    res.json(result);
  });
});

//根据id删除一个项目及其当前项目下生成的artBoard记录
router.post("/deleteProjectById", function(req, res, next) {
  let p = new project();
  p.deleteProjectById(req.body.id, function(result) {
    //2018-11-19：同时也需要删除当前projectId下所有的artBoard
    let artbd = new artboard();
    artbd.deleteAllArtboardByProjectId(req.body.pid, function(result) {
      res.json(result);
    });
  });
});

//获取个人信息
router.post("/findStaff", function(req, res, next) {
  let u = new user();
  u.findStaff(req.body.staffid, function(result) {
    res.json(result);
  });
});

module.exports = router;
