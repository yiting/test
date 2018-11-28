const {
  fs,
  path,
  express,
  multer,
  router,
  archiver,
  requestHttp
} = require("../util/base.js");

const Utils = require("../../server_modules/util/utils");
const ControllerUtils = require("../util/utils");
/**
 * 文件下载模块
 */
let downloadProject = function(projectUUID, projectName) {
  //目前是根据已有生成的文件进行打包：如果没有生成：1.尽量全部生成后在下载 2.空闲时间：来进行默默写入文件到工程目录
  router.post("/download", function(req, res, next) {
    //是否下载sketch源文件
    let isDownloadsketch = req.query.isDownloadsketch;
    //console.log("进入下载")
    logger.debug("[edit.js-download]进入编译项目下载");
    let desZipPath = "./data/download_file/" + projectName + ".zip";
    let srcPojectPath = "./data/complie/" + projectName;
    let desProjectPath = "./data/complie/" + projectName + "_filter";
    res.set({
      "Content-Type": "application/octet-stream;charset=utf8", //告诉浏览器这是一个二进制文件
      "Content-Disposition": "attachment;filename=" + encodeURI(projectUUID)
    });
    let downloadPromise = new Promise(function(resolve, reject) {
      //拷贝已生成的编译目录文件夹
      ControllerUtils.copyFolder(srcPojectPath, desProjectPath, function(err) {
        if (err) {
          return;
        }
        logger.debug("[edit.js-download]生成编译文件夹拷贝完毕");
        resolve("success");
      });
    });
    //清洗html中的多余属性
    downloadPromise.then(data => {
      //读取拷贝后的文件
      let allfiles = fs.readdirSync(desProjectPath);
      new Promise(function(resolve, reject) {
        allfiles.forEach(function(item, index) {
          if (path.extname(item) == ".html") {
            //console.log(path.basename(item, ".html")); //使用basename一个参数为取文件名包括后缀名，如果不想要后缀名把后缀名加到第二个参数上就OK了。
            //读取当前文件内容，
            fs.readFile(desProjectPath + "/" + item, "utf8", function(
              err,
              files
            ) {
              //属性过滤去重
              let result = files
                .replace(/data-id=".*?"|data-id=.*?(?=\s|>)/g, "")
                .replace(/data-layout=".*?"|data-layout=.*?(?=\s|>)/g, "")
                .replace(/isSource/g, "");
              //过滤属性后，重新写入文件
              fs.writeFile(
                desProjectPath + "/" + item,
                result,
                "utf8",
                function(err) {
                  if (err)
                    logger.error("[edit.js-download]报错，不解析：" + err);
                  resolve("succss");
                }
              );
            });
          }
        });
        //复制sketch文件到当前目录
        if (isDownloadsketch == "true") {
          fs.copyFile(
            "./data/upload_file/" + projectName + ".sketch",
            desProjectPath + "/" + projectName + ".sketch",
            function(err) {
              if (err) {
                console.log(err);
                return;
              }
            }
          );
        }
      }).then(data => {
        Utils.zipFolder(desZipPath, desProjectPath, function() {
          //下载去除属性后的临时项目
          res.download(desZipPath);
          //删除临时项目
          ControllerUtils.deleteFolder(desProjectPath);
        });
      });
    });
  });
};

module.exports = { router, downloadProject };
