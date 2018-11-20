/*系统包、工具模块*/
const express = require("express");
const router = express.Router();

/*业务逻辑*/
//渲染页面路由
router.get("/", function(req, res, next) {
  res.render("start", {
    title: "设计编译 - 内测版"
  });
});

router.get("/index", function(req, res, next) {
  res.render("index", {
    title: "设计编译 - 内测版"
  });
});

module.exports = router;
