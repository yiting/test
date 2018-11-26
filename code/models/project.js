let connection = require("./database");
function Project(conf) {
  conf = conf || {};
  this.userid = conf.userid || 0;
  this.isdel = conf.isdel || 0;
  this.compliePath = conf.compliePath || "";
  this.unzipPath = conf.unzipPath || "";
  this.modifytime = new Date();
  this.projectId = conf.projectId;
  this.projectName = conf.projectName;
}
//保存数据
Project.prototype = {
  //创建新项目
  create: function(callback) {
    var that = this;
    var addSql =
      "INSERT INTO project(userid,isdel,compliePath,unzipPath,modifytime,projectId,projectName) VALUES(?,?,?,?,?,?,?)";
    var addSqlParams = [
      that.userid,
      that.isdel,
      that.compliePath,
      that.unzipPath,
      that.modifytime,
      that.projectId,
      that.projectName
    ];
    connection.query(addSql, addSqlParams, function(err, result) {
      if (err) {
        callback && callback({ code: 1, msg: "创建新项目失败", err: err });
      } else {
        callback && callback({ code: 0, msg: "创建项目成功", data: result });
      }
    });
  },
  //获取所有项目
  getAllProjectById: function(userid, callback) {
    var that = this;
    var sql = "SELECT * FROM project WHERE userid =?";
    connection.query(sql, [userid], function(err, result) {
      if (err) {
        callback && callback({ code: 1, msg: "获取项目失败", err: err });
      } else {
        callback && callback({ code: 0, msg: "获取项目成功", data: result });
      }
    });
  },
  //删除项目
  deleteProjectById: function(id, callback) {
    var that = this;
    var sql = "DELETE FROM project WHERE id =?";
    // make the query
    connection.query(sql, [id], function(err, result) {
      if (err) {
        callback && callback({ code: 1, msg: "删除项目失败", err: err });
      } else {
        callback && callback({ code: 0, msg: "删除项目成功", data: result });
      }
    });
  }
};
module.exports = Project;
