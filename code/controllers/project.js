const express = require("express");
const router = express.Router();
//业务类
const project = require("../models/project");
router.get("/", function(req, res, next) {
  res.render("projects", {
    title: "设计编译 - 所有项目"
  });
});
//创建新项目
router.post("/create", function(req, res, next) {
  var p = new project(req.body);
  var user = p.create(function(result) {
    res.json(result);
  });
});

//获取所有项目
router.post("/getAllProjects", function(req, res, next) {
  let p = new project();
  p.getAllProjects(function(result) {
    res.json(result);
  });
});

module.exports = router;
