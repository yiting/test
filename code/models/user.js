let connection = require("./database");
function User(conf) {
  conf = conf || {};
  this.staffid = conf.staffid;
  this.staffname = conf.staffname;
  this.ChnName = conf.ChnName;
  this.DeptName = conf.DeptName;
}
//保存数据
User.prototype = {
  //创建新用户
  create: function(callback) {
    var that = this;
    var addSql =
      "INSERT INTO user(staffid,staffname,ChnName,DeptName,last_login_time) VALUES(?,?,?,?,?)";
    var addSqlParams = [
      that.staffid,
      that.staffname,
      that.ChnName,
      that.DeptName,
      new Date()
    ];
    connection.query(addSql, addSqlParams, function(err, result) {
      if (err) {
        callback && callback({ code: 1, msg: "创建新用户失败 ", err: err });
        return;
      } else {
        callback && callback({ code: 0, msg: "创建新用户成功", data: result });
      }
    });
  },
  //查找员工
  findStaff: function(staffid, callback) {
    var that = this;
    var sql = "SELECT * FROM user WHERE staffid =?";
    // make the query
    connection.query(sql, [staffid], function(err, result) {
      if (err) {
        callback && callback({ code: 1, msg: "查找新用户失败 ", err: err });
      } else {
        let updateTimeSql = "UPDATE user set last_login_time=? where staffid=?";
        //更新时间
        connection.query(updateTimeSql, [new Date(), staffid], function(
          err,
          result
        ) {
          console.log("用户登录,更新时间成功");
        });

        callback &&
          callback({ code: 0, msg: "查找新用户成功：", data: result });
      }
    });
  },
  /**
   * 查询所有用户
   */
  getAllUsers: function(staffid, callback) {
    var that = this;
    var sql = "SELECT * FROM user order by last_login_time desc";
    // make the query
    connection.query(sql, function(err, result) {
      if (err) {
        callback && callback({ code: 1, msg: "查找所有用户失败 ", err: err });
      } else {
        callback &&
          callback({ code: 0, msg: "查找所有用户成功：", data: result });
      }
    });
  }
};
module.exports = User;
