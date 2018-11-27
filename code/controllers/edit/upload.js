const {
  fs,
  path,
  express,
  multer,
  router,
  archiver,
  requestHttp
} = require("../util/base.js");

const ftpConfig = require("../../config/config.js");

//业务类
const artboard = require("../../models/artboard");

//2018-10-16:上传本地生成的编译代码文件夹，上传到线上，返回对应的url
let getOnlineUrl = function(projectUUID, projectName, uploadTimeStamp) {
  router.post("/getOnlineUrl", function(req, res, next) {
    //console.log("进入上传代码模块");
    logger.debug("[edit.js-getOnlineUrl]进入上传代码模块");
    let artId = req.body.artboardId;
    let ftpServer = ftpConfig.ftpConfig.host,
      ftpUserName = ftpConfig.ftpConfig.username,
      ftpPort = ftpConfig.ftpConfig.port,
      ftpPassword = ftpConfig.ftpConfig.password,
      localPath = ftpConfig.ftpConfig.localPath,
      remotePath = ftpConfig.ftpConfig.remotePath;
    let node_ssh = require("node-ssh");
    let ssh = new node_ssh();
    //connect sftp
    ssh
      .connect({
        host: ftpServer,
        username: ftpUserName,
        port: ftpPort,
        password: ftpPassword,
        tryKeyboard: true
      })
      .then(function() {
        //console.log("ftp开始上传");
        logger.debug("[edit.js-getOnlineUrl]ftp开始上传");
        //上传整个目录
        const failed = [];
        const successful = [];
        ssh
          .putDirectory(localPath + projectName, remotePath + projectName, {
            recursive: true,
            concurrency: 5,
            //concurrency: 1000,
            validate: function(itemPath) {
              const baseName = path.basename(itemPath);
              return (
                baseName.substr(0, 1) !== "." && baseName !== "node_modules" // do not allow dot files
              ); // do not allow node_modules
            },
            tick: function(localPath, remotePath, error) {
              if (error) {
                failed.push(localPath);
              } else {
                successful.push(localPath);
              }
            }
          })
          .then(
            function(status) {
              //console.log("ftp上传成功");
              logger.debug("[edit.js-getOnlineUrl]ftp上传成功");
              //上传成功
              //2018-10-29:返回页面命名简短为时间戳命名
              let urlHeader =
                  "http://" + ftpServer + ":8080/complie/" + projectName + "/",
                lastSuffix = ".html?_wv=131072";
              currentArtBoardUrl = urlHeader + uploadTimeStamp + lastSuffix;
              let artbd = new artboard({
                artUrl: currentArtBoardUrl
              });
              //将线上url存储在数据库
              artbd.updateArtBoardUrl(artId, projectUUID, function(result) {
                //本地编译成的代码文件夹上传到线上，并返回线上地址
                res.end(
                  JSON.stringify({
                    message: "上传文件成功",
                    artUrl: currentArtBoardUrl
                  })
                );
              });
            },
            function(error) {
              //console.log("Something's wrong")
              //console.log(error)
              logger.error("[edit.js-getOnlineUrl]ftp上传错误:" + error);
            }
          );
      });
  });
};

module.exports = { router, getOnlineUrl };
