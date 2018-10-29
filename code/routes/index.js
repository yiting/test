/*系统包、工具模块*/
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer')
const router = express.Router()
//解压包
const unzip = require('unzip');
//随机生成uuid:项目文件夹名
//https://github.com/kelektiv/node-uuid
const uuidv1 = require('uuid/v1');
//工具类
let Utils = require('../server_modules/util/utils');
//上传文件及新的文件名称变量;//生成的uuid字符串及返回前台页面的json
let originFileName, potIndex, uuidStr, responseJson;

//上传文件配置
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data/upload_file/')
    },
    filename: function (req, file, cb) {
        originFileName = Utils.getDateStr() + '_' + file.originalname
        //截取sketch文件前缀为项目名称(即为sketch文件名)
        potIndex = originFileName.lastIndexOf('.')
        //直接保留原始文件格式(.sketch)
        cb(null, originFileName);
    }
})
//上传文件对象
let upload = multer({
    storage: storage
})
/*业务逻辑*/
//渲染页面路由
router.get('/', function (req, res, next) {
    res.render('index', {
        title: '设计编译 - 内测版'
    });
});

/*文件上传及对应上传记录*/
router.post('/upload', upload.any(), function (req, res, next) {
    //请求ip
    let reqIP = Utils.getClientIp(req).match(/\d+.\d+.\d+.\d+/)
    let newDesFile = './data/upload_file/' + originFileName
    //生成uuid
    uuidStr = uuidv1()
    responseJson = {
        message: '上传文件成功',
        filename: originFileName.substring(0, potIndex), //无后缀
        uuid: uuidStr
    }
    //将生成的uuid写入到文本中，作为生成url的标示
    fs.appendFile('./data/upload_data/上传标识数据.txt', JSON.stringify({
        ip: reqIP,
        name: originFileName,
        uuid: uuidStr,
        time: new Date().toLocaleString()
    }) + '\r\n', function (err) {
        if (err) {
            // 读文件是不存在报错
            // 意外错误
            // 文件权限问题
            // 文件夹找不到(不会自动创建文件夹)
            console.log(err)
        } else {
            console.log('写入文件成功')
        }
    })
    //2018-08-17:解压zip文件到指定文件夹
    let extract = unzip.Extract({
        path: './data/unzip_file/' + originFileName.substring(0, potIndex)
    })
    //解压异常处理
    extract.on('error', function (err) {
        console.log(err)
    })
    //解压完成处理
    extract.on('finish', function () {
        console.log('解压完成!!')
        res.end(JSON.stringify(responseJson));
    })
    fs.createReadStream(newDesFile).pipe(extract)
})

module.exports = router