let connection = require("./database");
function History(conf) {
  conf = conf || {};
  this.userid = conf.userid || 0;
  this.projectId = conf.projectId || 0;
  this.time = new Date();
}
//保存数据
History.prototype = {
  //创建新项目
  create: function(callback) {
    var that = this;
    var addSql = "INSERT INTO history(userid,projectId,time) VALUES(?,?,?)";
    var addSqlParams = [that.userid, that.projectId, that.time];
    //查找记录是否存在
    var sql = "SELECT * FROM history WHERE userid =? and projectId =? ";
    connection.query(sql, addSqlParams, function(err, result) {
      if (err) {
        callback && callback({ code: 1, msg: "创建新访问记录失败", err: err });
      } else {
        if (result.length == 0) {
          connection.query(addSql, addSqlParams, function(err, result) {
            if (err) {
              callback &&
                callback({ code: 1, msg: "创建新访问记录失败", err: err });
            } else {
              callback &&
                callback({ code: 0, msg: "创建访问记录成功", data: result });
            }
          });
        } else {
          callback &&
            callback({
              code: 2,
              msg: "创建新访问记录失败,记录已存在",
              err: err
            });
        }
      }
    });
  },
  //获取所有访问记录
  getAllHistoryById: function(userid, callback) {
    var that = this;
    var sql =
      "SELECT * FROM history WHERE userid =? order by time desc limit 10";
    connection.query(sql, [userid], function(err, result) {
      if (err) {
        callback && callback({ code: 1, msg: "获取访问记录失败", err: err });
      } else {
        callback &&
          callback({ code: 0, msg: "获取访问记录成功", data: result });
      }
    });
  },
  // //getAllProjectByProjectId
  // getAllProjectByProjectId:function(idArr, callback) {
  //   var that = this;
  //   var sql = "SELECT * FROM history WHERE projectId =?;";
  //   for(var i=0;i<idArr.length;i++){
  //     sql+=sql;
  //   }
  //   connection.query(sql, idArr, function(err, result) {
  //     console.dir(result)
  //     if (err) {
  //       callback && callback({ code: 1, msg: "获取访问记录失败", err: err });
  //     } else {
  //       callback && callback({ code: 0, msg: "获取访问记录成功", data: result });
  //     }
  //   });
  // },
  //删除访问记录
  deleteHistoryById: function(pid, callback) {
    var that = this;
    var sql = "DELETE FROM history WHERE projectId =?";
    // make the query
    connection.query(sql, [pid], function(err, result) {
      if (err) {
        callback && callback({ code: 1, msg: "删除访问记录失败", err: err });
      } else {
        callback &&
          callback({ code: 0, msg: "删除访问记录成功", data: result });
      }
    });
  }
};
module.exports = History;
