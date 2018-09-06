// 工具函数
const fs = require('fs');
//依赖文件下载包
const archiver = require('archiver');
/**
 * 写内容到文件
 * @param {String} filePath 写文件的路径
 * @param {String} str 要写入的数据
 */
let writeToFile = function (filePath, str, callback) {
    //https://blog.csdn.net/u011127019/article/details/52297180
    //返回对应平台下的文件夹分隔符，win下为'\'，*nix下为'/'
    let potIndex = filePath.lastIndexOf('/')
    let fileFolder = filePath.substring(0, potIndex)
    try {
        //判断文件夹目录是否存在
        isFileExist(fileFolder, function (existFlag) {
            //文件不存在的话
            console.log('检测文件是否存在标识:' + existFlag)

            if (!existFlag) {
                fs.mkdir(fileFolder, function (err) {
                    if (err) {
                        //console.log(err)
                        console.log('创建目录失败')
                    } else {
                        console.log('创建目录成功')
                        //写入目录
                        fs.writeFile(filePath, str, function (err) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log('写入文件成功')
                                callback()
                            }
                        })
                    }
                })
            } else {
                //写入文件到已存在的目录
                fs.writeFile(filePath, str, function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('写入文件成功')
                        callback()
                    }
                })
            }
        })

    }
    catch (e) {
        console.log('utils.js - writeToFile: 写入文件内容异常')
    }
}

/**
 * 判断文件是否存在
 * @param {NSUrl} path 路径
 * @returns {Boolean} result
 */
let isFileExist = function (filePath, callback) {
    var existFlag = false
    fs.exists(filePath, function (exists) {
        if (exists) {
            console.log('判断目录存在')
            existFlag = true
        } else {
            console.log('判断目录不存在')
            existFlag = false
        }
        callback(existFlag)
    })
}
/**
 *压缩文件为zip公共方法
 */
//https://blog.csdn.net/uikoo9/article/details/79010842
//注释：archives.bulk已被弃用，已被archive.directory
let zipFolder = function (destZip, sourceFolder, cb) {
    let output = fs.createWriteStream(destZip);
    let archive = archiver('zip', {
        zlib: {level: 9}
    });
    output.on('close', function () {
        cb(null, '压缩完成！');
    });
    archive.on('error', function (err) {
        cb(err);
    });
    // zip
    archive.pipe(output);
    archive.directory(sourceFolder, false);
    archive.finalize();
};

/*获取客户端请求ip*/
let getClientIp = function (req) {
    return req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || ''
}
/*获取当前时间*/
let getDateStr = function () {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()

    if (month >= 1 && month <= 9) {
        month = '0' + month
    }
    if (day >= 0 && day <= 9) {
        day = '0' + day
    }
    if (hour >= 0 && hour <= 9) {
        hour = '0' + hour
    }
    if (minute >= 0 && minute <= 9) {
        minute = '0' + minute
    }
    if (second >= 0 && second <= 9) {
        second = '0' + second
    }
    return year + '' + month + '' + day + '' + hour + '' + minute + '' + second
}


module.exports = {
    getDateStr,
    getClientIp,
    writeToFile,
    zipFolder,
    isFileExist
}
