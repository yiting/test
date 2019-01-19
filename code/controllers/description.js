//访客相关接口
const express = require("express");
const router = express.Router();
//渲染页面路由
router.get("/", function(req, res, next) {
  res.render("description", {
    title: "视觉编译 - 内测版"
  });
});

module.exports = router;
