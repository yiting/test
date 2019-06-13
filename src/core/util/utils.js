// 工具函数
const fs = require('fs');
const fse = require('fs-extra');
// 依赖文件下载包
const archiver = require('archiver');
/**
 * 写内容到文件
 * @param {String} filePath 写文件的路径
 * @param {String} str 要写入的数据
 */
const writeToFile = function(filePath, str, callback) {
  // https://blog.csdn.net/u011127019/article/details/52297180
  // 返回对应平台下的文件夹分隔符，win下为'\'，*nix下为'/'
  const potIndex = filePath.lastIndexOf('/');
  const fileFolder = filePath.substring(0, potIndex);
  try {
    // 判断文件夹目录是否存在
    isFileExist(fileFolder, function(existFlag) {
      // 文件不存在的话
      // console.log('检测文件是否存在标识:' + existFlag)
      logger.debug(`[util.js-writeToFile]检测文件是否存在标识:${existFlag}`);

      if (!existFlag) {
        fs.mkdir(fileFolder, function(err) {
          if (err) {
            // console.log(err)
            // console.log('创建目录失败')
            logger.error(`[util.js-writeToFile]创建目录失败:${err}`);
          } else {
            // console.log('创建目录成功')
            logger.debug('[util.js-writeToFile]创建目录成功');
            // 写入目录
            fs.writeFile(filePath, str, function(err) {
              if (err) {
                // console.log(err)
                logger.error(`[util.js-writeToFile]写入文件失败:${err}`);
              } else {
                // console.log('写入文件成功')
                logger.debug('[util.js-writeToFile]写入文件成功');
                callback();
              }
            });
          }
        });
      } else {
        // 写入文件到已存在的目录
        fs.writeFile(filePath, str, function(err) {
          if (err) {
            // console.log(err)
            logger.error(`[util.js-writeToFile]写入文件失败:${err}`);
          } else {
            // console.log('写入文件成功')
            logger.debug('[util.js-writeToFile]写入文件成功');
            callback();
          }
        });
      }
    });
  } catch (e) {
    // console.log('utils.js - writeToFile: 写入文件内容异常')
    logger.error('[util.js-writeToFile]写入文件内容异常');
  }
};

/**
 * 判断文件是否存在
 * @param {NSUrl} path 路径
 * @returns {Boolean} result
 */
let isFileExist = function(filePath, callback) {
  let existFlag = false;
  fs.exists(filePath, function(exists) {
    if (exists) {
      // console.log('判断目录存在')
      logger.debug('[util.js-isFileExist]判断目录存在');
      existFlag = true;
    } else {
      // console.log('判断目录不存在')
      logger.debug('[util.js-isFileExist]判断目录不存在');
      existFlag = false;
    }
    callback(existFlag);
  });
};

/**
 *压缩文件为zip公共方法
 */
// https://blog.csdn.net/uikoo9/article/details/79010842
// 注释：archives.bulk已被弃用，已被archive.directory
const zipFolder = function(destZip, sourceFolder, cb) {
  const output = fs.createWriteStream(destZip);
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });
  output.on('close', function() {
    cb(null, '压缩完成！');
  });
  archive.on('error', function(err) {
    cb(err);
  });
  // zip
  archive.pipe(output);
  archive.directory(sourceFolder, false);
  archive.finalize();
};
const zipFolderPromise = function(destZip, sourceFolder) {
  return new Promise(resolve => {
    const output = fs.createWriteStream(destZip);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });
    output.on('close', function() {
      // cb(null, "压缩完成！");
      resolve('ok');
    });
    archive.on('error', function(err) {
      resolve(err);
    });
    // zip
    archive.pipe(output);
    archive.directory(sourceFolder, false);
    archive.finalize();
  });
};
/* 获取客户端请求ip */
const getClientIp = function(req) {
  return (
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    ''
  );
};
/* 获取当前时间 */
const getDateStr = function() {
  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  if (month >= 1 && month <= 9) {
    month = `0${month}`;
  }
  if (day >= 0 && day <= 9) {
    day = `0${day}`;
  }
  if (hour >= 0 && hour <= 9) {
    hour = `0${hour}`;
  }
  if (minute >= 0 && minute <= 9) {
    minute = `0${minute}`;
  }
  if (second >= 0 && second <= 9) {
    second = `0${second}`;
  }
  return `${year}${month}${day}${hour}${minute}${second}`;
};

const copyFolderPromise = function(srcDir, tarDir) {
  return new Promise(resolve => {
    fse.copySync(srcDir, tarDir); // 拷贝目录
    resolve('ok');
  });
};
/**
 * 删除文件夹
 * @param {*} path
 */
const deleteFolder = function(path) {
  fse.removeSync(path);
};
/**
 * 获取json文件内容
 */
const getJsonFileData = function(path) {
  let data = {};
  if (fs.existsSync(path)) {
    const str = fs.readFileSync(path);
    // console.log("111111  "+str.substing(0,100));
    data = JSON.parse(str);
  }
  return data;
};

module.exports = {
  getDateStr,
  getClientIp,
  writeToFile,
  zipFolder,
  isFileExist,
  zipFolderPromise,
  copyFolderPromise,
  deleteFolder,
  getJsonFileData,
};
