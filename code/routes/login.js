const express = require('express');
const router = express.Router();
const user=require('../models/user');
router.post('/', function (req, res, next) {
  var result = req.body;
  if(!result.staffid){
    //拒绝登陆
    return;
  }
  var u=new user(result);
  //查找员工
  u.findStaff(result.staffid,function(findStaffRes){
    if(findStaffRes.code==0 && findStaffRes.data.length==0){
      u.create(function(creatRes){
        res.cookie('staffid', result.staffid);
        res.cookie('staffname', result.staffname);
        res.json({code: 1, msg: '创建用户成功',data: creatRes});
      })
    }else{
      //已经存在的用户
      res.cookie('staffid', result.staffid);
      res.cookie('staffname', result.staffname);
      res.json(findStaffRes);
    }
  })
});
module.exports = router