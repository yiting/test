const {
  fs,
  path,
  express,
  multer,
  router,
  archiver,
  requestHttp
} = require("../util/base.js");
//history实体
const history = require("../../models/history");

let createViewhistory = function(req, res, next) {
  //根据浏览记录，创建新项目
  router.post("/createViewhistory", function(req, res, next) {
    var h = new history(req.body);
    var user = h.create(function(result) {
      res.json(result);
    });
  });
};

module.exports = { router, createViewhistory };
