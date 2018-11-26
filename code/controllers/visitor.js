//访客相关接口
const express = require("express");
const router = express.Router();
const user = require("../models/user");
//渲染页面路由
router.get("/", function(req, res, next) {
  res.render("visitor", {
    title: "视觉编译 - 内测版"
  });
});

router.post("/getAllVisitors", function(req, res, next) {
  let u = new user();
  u.getAllUsers(req.body.userid, function(result) {
    res.json(result);
  });
});

module.exports = router;
