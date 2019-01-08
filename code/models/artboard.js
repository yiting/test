let connection = require("./database");
function Artboard(conf) {
  conf = conf || {};
  this.artboardId = conf.artId;
  this.artboardName = conf.artName;
  this.artboardUrl = conf.artUrl;
  this.projectId = conf.proId;
  this.projectName = conf.proName;
  this.artboardJson = conf.artJsonTxt;
  this.artboardImgs = conf.artImgsTxt;
  this.artboardImg = conf.artImg;
}
//保存数据
Artboard.prototype = {
  //插入新的artBoard数据
  create: function(callback) {
    var that = this;
    var addSql =
      "INSERT INTO artboard(artboardId,artboardName,projectId,projectName,artboardJson,artboardImgs) VALUES(?,?,?,?,?,?)";
    var addSqlParams = [
      that.artboardId,
      that.artboardName,
      that.projectId,
      that.projectName,
      that.artboardJson,
      that.artboardImgs
    ];
    connection.query(addSql, addSqlParams, function(err, result) {
      if (err) {
        callback &&
          callback({ code: 1, msg: "创建artBoard页面记录失败", err: err });
      } else {
        callback &&
          callback({ code: 0, msg: "创建artBoard页面记录成功", data: result });
      }
    });
  },
  //插入线上地址到记录中
  updateArtBoardUrl: function(artboardId, projectId, callback) {
    var that = this;
    var addSql =
      "update artboard set artboardUrl=? where artboardId =? and projectId =?";
    var addSqlParams = [that.artboardUrl, artboardId, projectId];
    connection.query(addSql, addSqlParams, function(err, result) {
      if (err) {
        callback &&
          callback({ code: 1, msg: "修改artBoard页面记录失败", err: err });
      } else {
        callback &&
          callback({ code: 0, msg: "修改artBoard页面记录成功", data: result });
      }
    });
  },
  //插入生成预览图到记录中
  updateArtBoardImg: function(artboardId, projectId, callback) {
    var that = this;
    var addSql =
      "update artboard set artboardImg=? where artboardId =? and projectId =?";
    var addSqlParams = [that.artboardImg, artboardId, projectId];
    connection.query(addSql, addSqlParams, function(err, result) {
      if (err) {
        callback &&
          callback({ code: 1, msg: "修改artBoard图片地址记录失败", err: err });
      } else {
        callback &&
          callback({
            code: 0,
            msg: "修改artBoard图片地址记录成功",
            data: result
          });
      }
    });
  },
  //更新当前artBoard的json到记录中
  updateArtBoardJson: function(artboardId, projectId, callback) {
    var that = this;
    var addSql =
      "update artboard set artboardJson=? where artboardId =? and projectId =?";
    var addSqlParams = [that.artboardJson, artboardId, projectId];
    connection.query(addSql, addSqlParams, function(err, result) {
      if (err) {
        callback &&
          callback({ code: 1, msg: "修改artBoard页面记录失败", err: err });
      } else {
        callback &&
          callback({ code: 0, msg: "修改artBoard页面记录成功", data: result });
      }
    });
  },
  //获取artBoard记录
  getArtboardById: function(artboardId, projectId, callback) {
    var that = this;
    var sql = "SELECT * FROM artboard WHERE artboardId =? and projectId =?";
    connection.query(sql, [artboardId, projectId], function(err, result) {
      // if (err) {
        callback &&
          callback({ code: 1, msg: "获取artBoard页面记录失败", err: err });
      // } else {
      //   callback &&
      //     callback({ code: 0, msg: "获取artBoard页面记录成功", data: result });
      // }
    });
  },
  //根据artBoardId、projectUUID、artBoardImg查询记录
  getArtboardImg: function(artboardId, projectId, callback) {
    var that = this;
    var sql =
      "SELECT * FROM artboard WHERE artboardId =? and projectId =? and artboardImg=?";
    connection.query(sql, [artboardId, projectId, that.artboardImg], function(
      err,
      result
    ) {
      if (err) {
        callback &&
          callback({ code: 1, msg: "获取artBoard页面记录失败", err: err });
      } else {
        callback &&
          callback({ code: 0, msg: "获取artBoard页面记录成功", data: result });
      }
    });
  },
  //根据artBoardId删除单条artBoard记录
  deleteArtboardById: function(artboardId, projectId, callback) {
    var that = this;
    var sql = "DELETE FROM artboard WHERE artboardId =? and projectId =?";
    // make the query
    connection.query(sql, [artboardId, projectId], function(err, result) {
      if (err) {
        callback && callback({ code: 1, msg: "删除项目失败", err: err });
      } else {
        callback && callback({ code: 0, msg: "删除项目成功", data: result });
      }
    });
  },
  //根据project删除当前项目下所有的artBoard
  deleteAllArtboardByProjectId: function(projectId, callback) {
    var that = this;
    var sql = "DELETE FROM artboard WHERE projectid =?";
    // make the query
    connection.query(sql, [projectId], function(err, result) {
      if (err) {
        callback &&
          callback({ code: 1, msg: "删除当前项目下页面失败", err: err });
      } else {
        callback &&
          callback({ code: 0, msg: "删除当前项目下页面成功", data: result });
      }
    });
  }
};
module.exports = Artboard;
