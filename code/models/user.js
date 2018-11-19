let connection=require("./database")
function User(conf){
  conf=conf || {};
  this.staffid=conf.staffid;
  this.staffname=conf.staffname;
  this.ChnName=conf.ChnName;
  this.DeptName=conf.DeptName;
}
//保存数据
User.prototype={
  //创建新用户
  create:function(callback) {
    var that=this;
    var  addSql = 'INSERT INTO user(staffid,staffname,ChnName,DeptName) VALUES(?,?,?,?)';
    var  addSqlParams = [that.staffid,that.staffname,that.ChnName,that.DeptName];
    connection.query(addSql,addSqlParams,function (err, result) {
      if(err){
       callback && callback({code: 1, msg: '创建新用户失败 ',err: err});
       return;
      }else{
        callback && callback({code: 0, msg: '创建新用户成功',data: result});
      }
    });
  },
  //查找员工
  findStaff:function(staffid,callback){
    var that=this;
    var sql = "SELECT * FROM user WHERE staffid =?";
    // make the query
    connection.query(sql, [staffid], function(err, result) {
      if (err) {
        callback && callback({code: 1, msg: '查找新用户失败 ',err: err});
      }else{  
        callback && callback({code: 0, msg: '查找新用户成功：',data: result});
      }
    });
  }
}
module.exports = User;

