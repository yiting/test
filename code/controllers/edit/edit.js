/*1.系统包、工具模块*/
const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const router = express.Router();
//依赖文件下载包
const archiver = require("archiver");
//上传文件及新的文件名称变量
let originFileName, uploadTimeStamp;
//上传文件配置
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./data/upload_ai_img/");
  },
  filename: function(req, file, cb) {
    originFileName = uploadTimeStamp + "_" + file.originalname;
    //直接保留原始文件格式(.sketch)
    cb(null, originFileName);
  }
});
//上传文件对象
let upload = multer({
  storage: storage
});

/*2.base modules*/
//日志模块(2018-11-09)
const qlog = require("../../server_modules/log/qlog");
let Utils = require("../../server_modules/util/utils");
//模板类
const Template = require("../../server_modules/util/template");
//导出类
const Export = require("../../server_modules/util/export");
//1.引入parser模块
const Parser = require("../../server_modules/designjson/designjson_parser_sketch")
  .parse;
const Optimize = require("../../server_modules/designjson/designjson_optimize");
//2.引入dsl模块
const DSL = require("../../server_modules/dsl/dsl");
//3.引入图片模块
let ImageCombine = require("../../server_modules/designimage/img_combine")
  .ImageCombine;
//2018-10-21:线上云服务上传地址
let ftpConfig = require("../../config/config.js");
//数据库业务类
const artboard = require("../../models/artboard");

//3.声明页面数据;生成的图片名数组
let pageArtboardsData = [],
  projectUUID,
  projectName,
  generateImgArr = [],
  pageArtBoardIndex,
  currentImgsList,
  currentDesignJson,
  currentArtBoardUrl;

/*业务逻辑*/
//渲染页面路由:初始化编辑查看页面,填充页面数据
router.get("/", function(req, res, next) {
  //初始化一次，清空数据
  pageArtboardsData = [];
  //获取参数
  projectUUID = req.query.id;
  projectName = req.query.name;
  //2018-11-09：日志模块初始化
  initLogConfig(req, res, next);
  //初始化请求，并渲染:先获得数据；再将数据传到页面上
  getPagesAndArtBoards(projectName, res, function(pageData) {
    res.render("edit", {
      data: JSON.stringify(pageData)
    });
  });
});

//2018-10-10:根据pageid、artboardID请求页面结构
router.post("/getPageById", function(req, res, next) {
  //console.log("获取当前artboard骨架请求");
  logger.debug("[edit.js-getPageById]获取当前artboard骨架请求");
  //每次请求生成新的文件命名:html和css命名使用
  uploadTimeStamp = Utils.getDateStr();
  getCurrentPageInfo(req, res, next);
});

//2018-10-10:根据pageid、artboardID生成图片请求
router.post("/getPageImgById", function(req, res, next) {
  //console.log("获取当前artboard图片素材请求");
  logger.debug("[edit.js-getPageImgById]获取当前artboard图片素材请求");
  //getCurrentPageInfo(req, res, next, 1);
  let pageId = req.body.pageId;
  let artBoardId = req.body.artboardId;
  //生成图片
  let imgsResultJson = {};
  //默认需要生成
  combineImages(currentImgsList).then(info => {
    //设置标识为false，代表已生成，下次不需要再次生成
    //console.log("图片输出成功,图片数组个数:" + generateImgArr.length);
    logger.debug(
      "[edit.js-getPageImgById]图片输出成功,图片数组个数:" +
        generateImgArr.length
    );
    //需要大雄返回删除临时图片后的图片路径数组
    imgsResultJson.imgPaths = generateImgArr;
    //返回项目文件夹的id，可作为静态资源读取的路径拼接
    imgsResultJson.projectId = projectUUID;
    imgsResultJson.projectName = projectName;
    //生成图片完成后，则将当前artBoard信息插入到数据库
    let artbd = new artboard({
      artId: artBoardId,
      artName: uploadTimeStamp,
      proId: projectUUID,
      proName: projectName,
      artJsonTxt: JSON.stringify(currentDesignJson), //当前页面的designdom字符串
      artImgsTxt: JSON.stringify(generateImgArr) //当前页面生成的图片字符串
    });
    artbd.create(function(result) {
      console.log("创建项目成功");
    });
    res.send(JSON.stringify(imgsResultJson));
  });
});

//2018-10-12:根据pageid、artboardID生成预览图请求
router.post("/getArtBoardImg", function(req, res, next) {
  //console.log("获取当前artboard预览图片请求");
  logger.debug("[edit.js-getArtBoardImg]获取当前artboard预览图片请求");
  //根据artBoardId来获取对应的缩略图,返回url地址到页面上
  //getImgsPrew(req.body.artboardId);
  let artBoardID = req.body.artboardId;
  let artBoardImgName = artBoardID + ".png";
  let artBoardObj = {
    path: artBoardImgName,
    _origin: {
      do_objectID: artBoardID
    }
  };
  Promise.all([getArtBoardImg(artBoardObj)]).then(info => {
    res.send(
      JSON.stringify({
        artBoardImgName: artBoardImgName
      })
    );
  });
});

//2018-10-16:上传本地生成的编译代码文件夹，上传到线上，返回对应的url
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

/**
 * 文件下载模块
 */
//目前是根据已有生成的文件进行打包：如果没有生成：1.尽量全部生成后在下载 2.空闲时间：来进行默默写入文件到工程目录
router.post("/download", function(req, res, next) {
  //console.log("进入下载")
  logger.debug("[edit.js-download]进入编译项目下载");
  let desZipPath = "./data/download_file/" + projectName + ".zip";
  let srcPojectPath = "./data/complie/" + projectName;
  res.set({
    "Content-Type": "application/octet-stream;charset=utf8", //告诉浏览器这是一个二进制文件
    "Content-Disposition": "attachment;filename=" + encodeURI(projectUUID)
  });
  Utils.zipFolder(desZipPath, srcPojectPath, function() {
    res.download(desZipPath);
  });
});

/**
 * AI模式上传图片，返回结果，结合俊标规则，生成页面
 */
router.post("/uploadAIImg", upload.any(), function(req, res, next) {
  let responseJson = {
    message: "上传文件成功",
    imgName: originFileName,
    imgUrl: "http://" + req.headers.host + "/upload_ai_img/" + originFileName
  };
  //可以在服务端请求萝莉AI服务，将返回结果给俊标，再生成AI页面
  res.end(JSON.stringify(responseJson));
});

/**
 * 2018-11-09:初始化日志配置
 */
let initLogConfig = function(req, res, next) {
  //平台模块日志初始化
  qlog.init({
    projectName: projectName + ".sketch",
    url:
      "http://" +
      req.headers.host +
      "/edit?id=" +
      projectUUID +
      "&name=" +
      projectName
  });
  logger = qlog.getInstance(qlog.moduleData.platform);
};

/*根据artBoard获取当前的designDom*
 type:0----designjson
 type:1----designimgs
 */
let getCurrentPageInfo = (req, res, next) => {
  //let currentDesignDom;
  //console.log("传到后台的pid为:" )
  let pageId = req.body.pageId;
  let artBoardId = req.body.artboardId;
  pageArtBoardIndex = req.body.pageArtBoardIndex;
  //console.log("获取到的artBoard index:" + pageArtBoardIndex);
  logger.debug(
    "[edit.js-getCurrentPageInfo]获取到的artBoard index:" + pageArtBoardIndex
  );
  //页面是否需要生成标识
  let isHtmlGenerate = true;
  //检测artBoard是否生成:相同的项目需要检测是否生成，不同的项目，再次上传时，需要重新生成(projectId和artboardId同时检测)
  let artbd = new artboard();
  let testArtBoardPromise = new Promise(function(resolve, reject) {
    //projectId和artBoard同时相同时，artBoard再次请求，才不会生成
    artbd.getArtboardById(artBoardId, projectUUID, function(result) {
      //查询数据库存在记录时，则不需要再次生成
      if (result.code == 0 && result.data.length != 0) {
        let resultData = result.data[0];
        //如果相同稿子上传，则直接从之前路径读取内容(即为已生成页面)
        projectName = resultData.projectName;
        uploadTimeStamp = resultData.artboardName;
        currentArtBoardUrl = resultData.artboardUrl;
        currentDesignJson = JSON.parse(resultData.artboardJson);
        generateImgArr = JSON.parse(resultData.artboardImgs);
        isHtmlGenerate = false;
      }
      resolve("success");
    });
  });
  testArtBoardPromise.then(data => {
    //如果已生成，则直接返回结果
    if (!isHtmlGenerate) {
      //当前artBoard对应的时间戳
      let resultJson = {
        projectId: projectUUID,
        projectName: projectName,
        htmlFileName: uploadTimeStamp,
        url:
          "http://" +
          req.headers.host +
          "/complie/" +
          projectName +
          "/" +
          uploadTimeStamp +
          ".html?_wv=131072",
        onelineUrl: currentArtBoardUrl,
        imgPaths: generateImgArr,
        isHtmlGenerate: false
      };
      //输出对应处理好的artBoard数据
      //resultURL.htmlJson = h5Json;
      res.send(JSON.stringify(resultJson));
      return false;
    }
    //2018-10-30:生成html重命名，简短命名--时间戳
    let resultURL = {
      url:
        "http://" +
        req.headers.host +
        "/complie/" +
        projectName +
        "/" +
        uploadTimeStamp +
        ".html?_wv=131072"
    };
    //将pages下面所有json读取出来给到yone。根据artBoardID，[json数组]获取当前artBoard对应的degisnDom，然后调用俊标模块，获取对应的html和css;调用大雄模块，获取处理后的图片
    let currentPagesJsonsArr = [];
    let pagesJsonDirectory = "./data/unzip_file/" + projectName + "/pages";
    if (fs.existsSync(pagesJsonDirectory)) {
      fs.readdir(pagesJsonDirectory, function(err, files) {
        let pagesFileLen = files.length;
        for (let i = 0; i < pagesFileLen; i++) {
          let pageOneFilePath = pagesJsonDirectory + "/" + files[i];
          let pageOneJson = JSON.parse(fs.readFileSync(pageOneFilePath));
          currentPagesJsonsArr.push(pageOneJson);
        }
        try {
          //2018-10-29
          let currentDesignDom = Parser(
            artBoardId,
            currentPagesJsonsArr,
            pageArtBoardIndex
          );
          if (currentDesignDom) {
            Optimize(currentDesignDom);
            //获取要合并的图片列表
            currentImgsList = currentDesignDom.getImage();
            //获取当前的designdom对应的json
            //let currentDesignJson = currentDesignDom.toJson();
            //2018-11-11
            currentDesignJson = currentDesignDom.toList();
            //生成骨架
            //2018-10-10:先出骨架，再等待图片生成后，再刷新页面
            Promise.all([jsonToHtmlCss(artBoardId, currentDesignJson)]).then(
              info => {
                //console.log("骨架输出成功");
                logger.debug("[edit.js-getCurrentPageInfo]结构骨架输出成功");
                resultURL.projectId = projectUUID;
                resultURL.projectName = projectName;
                resultURL.htmlFileName = uploadTimeStamp;
                //输出对应处理好的artBoard数据
                //resultURL.htmlJson = h5Json;
                res.send(JSON.stringify(resultURL));
              }
            );
          } else {
            res.send("Symbol暂不解析");
          }
        } catch (e) {
          //console.log("报错，不解析：" + e);
          logger.error("[edit.js-getCurrentPageInfo]报错，不解析：" + e);
          res.send(e.toString());
        }
      });
    }
  });
};

//2018-11-11
router.post("/adjust", function(req, res) {
  // Yone
  const { artboardId, operate } = req.body;
  if (!currentDesignJson)
    res.send(
      JSON.stringify({
        status: "999999",
        msg: "修改失败"
      })
    );
  switch (operate) {
    case "1":
      {
        currentDesignJson = DSL.insertJson(
          currentDesignJson,
          req.body["nodeIds[]"]
        );
      }
      break; // 重组
  }
  //重组后，更新下当前json到数据库
  let artbd = new artboard({
    artJsonTxt: JSON.stringify(currentDesignJson)
  });
  artbd.updateArtBoardJson(artboardId, projectUUID, function(result) {
    console.log(result);
  });
  //重新生成调整后的url
  return Promise.all([jsonToHtmlCss(artboardId, currentDesignJson)]).then(
    info => {
      //console.log("骨架输出成功");
      logger.debug("[edit.js-adjust]骨架输出成功");
      //输出对应处理好的artBoard数据
      // resultURL.htmlJson = h5Json;
      res.send(
        JSON.stringify({
          status: "000000",
          msg: "修改成功"
        })
      );
    }
  );
});

/**
 * 解析sketch pages数据基本信息---来源:meta.json
 * 获取页面基本结构模块
 * @param projectName
 * @param callback
 */
let getPagesAndArtBoards = (projectName, res, callback) => {
  fs.readFile(
    "./data/unzip_file/" + projectName + "/meta.json",
    "utf8",
    function(err, data) {
      if (err) console.log(err);
      //console.log(data);
      //如果url参数有误，则跳转到404提示页面，找不到页面
      try {
        let metaJson = JSON.parse(data);
        let pagesData = metaJson.pagesAndArtboards;
        //遍历map
        for (let pageProp in pagesData) {
          if (pagesData.hasOwnProperty(pageProp)) {
            let objOneKey = pageProp;
            let objOneValue = pagesData[pageProp];
            let pageOne = {
              pageId: objOneKey,
              pageName: objOneValue.name,
              artBoards: []
            };
            let pageOneArtBoards = objOneValue.artboards;
            for (let artProp in pageOneArtBoards) {
              if (pageOneArtBoards.hasOwnProperty(artProp)) {
                let artOneKey = artProp;
                let artOneValue = pageOneArtBoards[artProp];
                let artOne = {
                  artboardId: artProp,
                  artboardName: artOneValue.name
                };
                pageOne.artBoards.push(artOne);
              }
            }
            pageArtboardsData.push(pageOne);
          }
        }
        //将拼装的数据结构返回预览页面进行填充
        callback(pageArtboardsData);
      } catch (e) {
        res.render("tips");
      }
    }
  );
};

/**
 * 根据给到当前artBoardId对应designDom，调用DSL模块方法转为html和css
 * 导出html+css模块
 * @param artBoardId
 * @param currentDesignDom
 * @returns {*}
 */
let h5Json;
let jsonToHtmlCss = (artBoardId, currentDesignDom) => {
  let htmlCssPromise;
  let h5Render = DSL.mobileHtml(currentDesignDom, {
      output: {
        //关闭dom节点输出字段:下载时候，用正则表达式过滤去掉多余字段
        debug: true
      }
    }),
    html = h5Render.toHtml(),
    css = h5Render.toCss();
  //获取页面json数据，供给页面属性面板操作
  //h5Json = DSL.getHtmlJson(currentDesignDom);
  //动态传入css文件名称:按照遍历序号来
  //let cssHtmlfileName = artBoardId;
  //2018-10-29:简短html和CSS命名
  let cssHtmlfileName = uploadTimeStamp;
  html = Template.htmlStart(cssHtmlfileName) + html + Template.htmlEnd();
  //console.log('html日志:' + html)
  //生成文件导出对应路径
  let exportPath = "./data/complie/" + projectName;
  //console.log('全路径:' + exportPath)
  // 导出html文件和css文件
  try {
    htmlCssPromise = new Promise(function(resolve, reject) {
      if (html) {
        Export.exportHtml(exportPath, cssHtmlfileName, html, function() {
          //console.log("导出html成功");
          logger.debug("[edit.js-jsonToHtmlCss]导出html成功");
          resolve("success");
        });
      }
    });
    htmlCssPromise.then(data => {
      if (css) {
        Export.exportCss(exportPath + "/css", cssHtmlfileName, css, function() {
          //console.log("导出css成功");
          logger.debug("[edit.js-jsonToHtmlCss]导出css成功");
        });
      }
    });
  } catch (e) {
    //console.log("导出文件出错！");
    logger.error("[edit.js-jsonToHtmlCss]导出html或css出错!");
  }
  return htmlCssPromise;
};

/**
 * 导出图片模块:获取所有图片素材
 * @param callback
 * @returns {Promise.<void>}
 */
let imageCombineConfig;
let combineImages = async imageList => {
  let startTime = new Date().getTime();
  //console.log("开始生成图片");
  logger.debug("[edit.js-combineImages]开始生成图片");
  let promiselist = [];
  for (let i = 0, ilen = imageList.length; i < ilen; i++) {
    let imageCombine = new ImageCombine();
    imageCombineConfig = {
      inputDir: "./data/unzip_file/" + projectName + "/", //源图片------'./unzip_file/' + projectName + "/images";
      outputDir: "./data/complie/" + projectName + "/images/", //图片导出路径---let exportPath = './data/complie/' + projectName
      pageJson: imageList,
      projectName: projectName + ".sketch",
      generateId: "img" + i
    };
    imageCombine.init(imageCombineConfig);
    let promise = imageCombine.combineNode(imageList[i]);
    promiselist.push(promise);
  }

  //2018-10-29
  return Promise.all(promiselist).then(newNodes => {
    var costTime = (new Date().getTime() - startTime) / 1000;
    //console.log("生成目标图片，用时" + costTime + "秒");
    logger.debug("[edit.js-combineImages]生成目标图片，用时" + costTime + "秒");
    var imageCombine = new ImageCombine();
    imageCombineConfig = {
      outputDir: "./data/complie/" + projectName + "/images/"
    };
    imageCombine.init(imageCombineConfig);
    imageCombine.deleteTmpFiles("./data/complie/" + projectName + "/images/");
    // ImageCombine.deleteTmpFiles();
    //能否返回当前页面的图片列表
    generateImgArr = imageList;
  });
};

/**
 * 根据artBoardId获取对应的缩略图
 * @param artBoardObj
 * @returns {Promise.<void>}
 */
let getArtBoardImg = async artBoardObj => {
  let imageCombine = new ImageCombine();
  if (!imageCombineConfig) {
    imageCombineConfig = {
      inputDir: "./data/unzip_file/" + projectName + "/", //源图片------'./unzip_file/' + projectName + "/images";
      outputDir: "./data/complie/" + projectName + "/images/", //图片导出路径---let exportPath = './data/complie/' + projectName
      projectName: projectName + ".sketch",
      generateId: ""
    };
  } else {
    imageCombineConfig.generateId = "";
    imageCombineConfig.projectName = projectName + ".sketch";
  }
  imageCombine.init(imageCombineConfig);
  let artBoardImgUrl = await imageCombine.combineShapeGroupNodeWithNative(
    artBoardObj,
    true
  );
};

module.exports = router;
