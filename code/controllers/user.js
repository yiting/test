
const express = require('express');
const router = express.Router();
// router.get('/', function (req, res, next) {
//     res.render('person', {
//         title: '设计编译 - 个人中心'
//     });
// });

// 登录接口
router.post('/login', function(req, res, next){
    var sess = req.session;
    var user = findUser(req.body.name, req.body.password);
    if(user){
        req.session.regenerate(function(err) {
            if(err){
                return res.json({ret_code: 2, ret_msg: '登录失败'});                
            }
            
            req.session.loginUser = user.name;
            res.json({ret_code: 0, ret_msg: '登录成功'});                           
        });
    }else{
        res.json({ret_code: 1, ret_msg: '账号或密码错误'});
    }   
});


// 退出登录
router.get('/logout', function(req, res, next){
    // 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
    // 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
    // 然后去查找对应的 session 文件，报错
    // session-file-store 本身的bug    

    req.session.destroy(function(err) {
        if(err){
            res.json({ret_code: 2, ret_msg: '退出登录失败'});
            return;
        }
        
        // req.session.loginUser = null;
        res.clearCookie(identityKey);
        res.redirect('/');
    });
});