//导入所需模块  
var mysql=require("mysql");    
//导入配置文件  
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'tosee666',
  database : 'tosee'
});
connection.connect();
module.exports=connection;
