/*1.系统包、工具模块*/
const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const router = express.Router();
//依赖文件下载包
const archiver = require("archiver");
//网络包
let requestHttp = require("request");
//上传文件及新的文件名称变量
let originFileName, uploadTimeStamp;

/*2.base modules*/
//日志模块(2018-11-09)
const qlog = require("../../server_modules/log/qlog");
let Utils = require("../../server_modules/util/utils");
let ControllerUtils = require("../util/utils");
//导出类
const Export = require("../../server_modules/util/export");
//1.引入parser模块
const Parser = require("../../server_modules/designjson/parser/designjson_parser_sketch")
  .parse;
const Optimize = require("../../server_modules/designjson/optimize/designjson_optimize");
//2.引入dsl模块
const Common = require("../../server_modules/dsl2/dsl_common.js");
const Dsl = require("../../server_modules/dsl2/dsl.js");
const Render = require("../../server_modules/render/render.js");
//3.引入图片模块
let ImageCombine = require("../../server_modules/designimage/img_combine")
  .ImageCombine;

//数据库业务类
const artboard = require("../../models/artboard");
const history = require("../../models/history");
//当前基础库版本相关信息
const MODULES_INFO = require("../../server_modules/version");

//3.声明页面数据;生成的图片名数组
let pageArtboardsData = [],
  projectUUID,
  projectName,
  generateImgArr = [],
  pageArtBoardIndex,
  currentImgsList,
  currentDesignJson,
  currentArtBoardUrl;

//4.用户id、用户名
let userId, userName;

//定时任务，合并在这里
require("../util/task");

/*业务逻辑*/
//渲染页面路由:初始化编辑查看页面,填充页面数据
router.get("/", function(req, res, next) {
  //初始化一次，清空数据
  pageArtboardsData = [];
  //获取参数
  projectUUID = req.query.id;
  //解码中文项目名
  projectName = decodeURIComponent(req.query.name);
  //2018-11-09：日志模块初始化
  //initLogConfig(req, res, next);
  //初始化请求，并渲染:先获得数据；再将数据传到页面上
  getPagesAndArtBoards(projectName, res, function(pageData) {
    res.render("edit", {
      data: JSON.stringify(pageData)
    });
  });
});

//2018-10-10:根据pageid、artboardID请求页面结构
router.post("/getPageById", function(req, res, next) {
  //用户id、用户名:用于记录日志信息
  userId = req.body.userId;
  userName = req.body.userName;
  //2018-12-27：日志模块初始化
  initLogConfig(req, res, next);
  //console.log("获取当前artboard骨架请求");
  logger.debug("[edit.js-getPageById]获取当前artboard骨架请求");
  //每次请求生成新的文件命名:html和css命名使用
  uploadTimeStamp = Utils.getDateStr();
  getHtmlCss(req, res, next);
});

//2018-10-10:根据pageid、artboardID生成图片请求
router.post("/getPageImgById", function(req, res, next) {
  //console.log("获取当前artboard图片素材请求");
  logger.debug("[edit.js-getPageImgById]获取当前artboard图片素材请求");
  //getHtmlCss(req, res, next, 1);
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
      artIndex: pageArtBoardIndex, //存入当前artBoard的索引位置，便于生成图片命名
      proId: projectUUID,
      proName: projectName,
      //artJsonTxt: JSON.stringify(currentDesignJson), //当前页面的designdom字符串
      artJsonTxt: "", //取消插入当前页面designdom字符串(数据较大,后期记录)
      artImgsTxt: JSON.stringify(generateImgArr), //当前页面生成的图片字符串
      mVersion: MODULES_INFO.version //当前基础库版本
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
  //projectId和artBoard同时相同时，artBoardImg再次请求，不必再次图片生成
  let artbd = new artboard({
    artImg: artBoardImgName
  });
  //请求数据库，判断数据库是否已存入预览图地址
  artbd.getArtboardImg(artBoardID, projectUUID, function(result) {
    //查询数据库存在记录时，则不需要再次生成
    if (result.code == 0) {
      //数据库存在预览图地址
      if (result.data.length != 0) {
        let resultData = result.data[0];
        //返回生成的预览图地址
        res.send(
          JSON.stringify({
            artBoardImgName: artBoardImgName
          })
        );
      } else {
        //不存在数据库时，需要插入数据库
        let artBoardObj = {
          path: artBoardImgName,
          _origin: {
            do_objectID: artBoardID
          }
        };
        Promise.all([getArtBoardImg(artBoardObj)]).then(info => {
          //将地址存储到数据库中
          //生成图片完成后，则将当前artBoard信息插入到数据库
          //将生成预览图地址存入到数据库
          artbd.updateArtBoardImg(artBoardID, projectUUID, function(result) {
            //返回生成的预览图地址
            res.send(
              JSON.stringify({
                artBoardImgName: artBoardImgName
              })
            );
          });
        });
      }
    } else {
      console.log("查询结果失败");
    }
  });
});

//2018-11-20：AI服务请求方法
let AIImgData;
router.post("/getAIData", function(req, res, next) {
  //console.log("获取当前artboard预览图片请求");
  logger.debug("[edit.js-getAIData]获取当前artboard预览图片对应的AI数据");
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
    //再次请求数据到AI
    var formData = {
      // Pass a simple key-value pair
      my_field: "my_value",
      // Pass data via Buffers
      my_buffer: new Buffer([1, 2, 3]),
      // Pass data via Streams
      file: fs.createReadStream(
        "./data/complie/" + projectName + "/images/" + artBoardImgName
      )
    };
    requestHttp.post(
      {
        url: ControllerUtils.AIServiceUrl + "/upload/image",
        formData: formData
      },
      function optionalCallback(error, response, body) {
        if (!error && response.statusCode == 200) {
          AIImgData = ControllerUtils.AIDataHandle(body);
        } else {
          AIImgData = [
            {
              errCode: 0,
              errMsg: "获取AI结果错误"
            }
          ];
        }
        //将AI结果返回
        res.json(AIImgData);
        //AI结果作为俊标和Yone，算法模型+AI模型的数据来源
      }
    );
  });
});

/**
 * AI数据请求方法:默认自动首先先创建图片文件夹，然后新建图片
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
let getAIDataByArtBoardId = function(artBoardID, projectName) {
  logger.debug("[edit.js-getAIData]获取当前artboard预览图片对应的AI数据");
  //根据artBoardId来获取对应的缩略图,返回url地址到页面上
  let artBoardImgName = artBoardID + ".png";
  let artBoardObj = {
    path: artBoardImgName,
    _origin: {
      do_objectID: artBoardID
    }
  };
  let aiDataPromise = new Promise((resolve, reject) => {
    getArtBoardImg(artBoardObj, function() {
      resolve("success");
    });
    //resolve("success");
  });
  aiDataPromise.then(info => {
    var formData = {
      my_field: "my_value",
      my_buffer: new Buffer([1, 2, 3]),
      file: fs.createReadStream(
        "./data/complie/" + projectName + "/images/" + artBoardImgName
      )
    };
    requestHttp.post(
      {
        url: ControllerUtils.AIServiceUrl + "/upload/image",
        formData: formData
      },
      function optionalCallback(error, response, body) {
        if (!error && response.statusCode == 200) {
          AIImgData = ControllerUtils.AIDataHandle(body);
        } else {
          AIImgData = [
            {
              errCode: 0,
              errMsg: "获取AI结果错误"
            }
          ];
        }
        //将AI结果返回
        //res.json(AIImgData);
        //AI结果作为俊标和Yone，算法模型+AI模型的数据来源
        //或者resolve
        //return aiDataPromise(AIImgData);
        //return AIImgData;
        //resolve(AIImgData)
        return Promise.resolve(AIImgData);
      }
    );
  });
  //return aiDataPromise;
};

/**
 * 文件下载模块
 */
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
              //.replace(/id=".*?"|id=.*?(?=\s|>)/g, "")
              .replace(/data-id=".*?"|data-id=.*?(?=\s|>)/g, "")
              .replace(/data-layout=".*?"|data-layout=.*?(?=\s|>)/g, "")
              .replace(/isSource/g, "")
              .replace(/contenteditable="true"/g, "");
            //过滤属性后，重新写入文件
            fs.writeFile(desProjectPath + "/" + item, result, "utf8", function(
              err
            ) {
              if (err) logger.error("[edit.js-download]报错，不解析：" + err);
              resolve("succss");
            });
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

/**
 * 2018-11-09:初始化日志配置
 */
let initLogConfig = function(req, res, next) {
  let TOSEEURL = "http://uitocode.oa.com/";
  //平台模块日志初始化
  qlog.init({
    projectName: projectName + ".sketch",
    userName,
    url:
      TOSEEURL +
      "edit?id=" +
      projectUUID +
      "&name=" +
      encodeURIComponent(encodeURIComponent(projectName))
  });
  logger = qlog.getInstance(qlog.moduleData.platform);
};

/*根据artBoard获取当前的designDom*
 type:0----designjson
 type:1----designimgs
 */
let getHtmlCss = function(req, res, next) {
  //let currentDesignDom;
  //console.log("传到后台的pid为:" )
  let pageId = req.body.pageId;
  let artBoardId = req.body.artboardId;
  pageArtBoardIndex = req.body.pageArtBoardIndex;
  //console.log("获取到的artBoard index:" + pageArtBoardIndex);
  logger.debug(
    "[edit.js-getHtmlCss]获取到的artBoard index:" + pageArtBoardIndex
  );
  //页面是否需要生成标识
  let isHtmlGenerate = true;
  //检测artBoard是否生成:相同的项目需要检测是否生成，不同的项目，再次上传时，需要重新生成(projectId和artboardId同时检测)
  let artbd = new artboard();
  let testArtBoardPromise = new Promise(function(resolve, reject) {
    //projectId和artBoard、moduleVersion同时相同时，artBoard不会生成，直接从数据库去拉取对应的编译路径
    artbd.getArtboardById(
      artBoardId,
      projectUUID,
      MODULES_INFO.version,
      function(result) {
        //查询数据库存在记录时，则不需要再次生成
        if (result.code == 0 && result.data.length != 0) {
          let resultData = result.data[0];
          //如果相同稿子上传，则直接从之前路径读取内容(即为已生成页面)
          projectName = resultData.projectName;
          uploadTimeStamp = resultData.artboardName;
          currentArtBoardUrl = resultData.artboardUrl;
          //currentDesignJson = JSON.parse(resultData.artboardJson);
          generateImgArr = JSON.parse(resultData.artboardImgs);
          isHtmlGenerate = false;
        }
        resolve("success");
      }
    );
  });
  testArtBoardPromise
    .then(data => {
      try {
        let AIData = getAIDataByArtBoardId(artBoardId, projectName);
      } catch (error) {
        // 触发这一句
        console.log("error");
      }
    })
    .then(data => {
      //1.如果已生成，则直接返回结果
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
        res.send(JSON.stringify(resultJson));
        return false;
      }
      //2.如果需要重新生成，则继续走编译过程
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
      let currentDocumentJsonPath =
        "./data/unzip_file/" + projectName + "/document.json";
      let currentDocumentJson = JSON.parse(
        fs.readFileSync(currentDocumentJsonPath)
      );
      //根据artBoard获取AI截图
      //let AIData =  getAIDataByArtBoardId(artBoardId);

      if (fs.existsSync(pagesJsonDirectory)) {
        let files = fs.readdirSync(pagesJsonDirectory);
        let pagesFileLen = files.length;
        for (let i = 0; i < pagesFileLen; i++) {
          let pageOneFilePath = pagesJsonDirectory + "/" + files[i];
          let pageOneJson = JSON.parse(fs.readFileSync(pageOneFilePath));
          currentPagesJsonsArr.push(pageOneJson);
        }
        try {
          //2018-10-29
          let currentDesignObj = Parser(
            artBoardId,
            currentPagesJsonsArr,
            pageArtBoardIndex,
            //描述文件
            currentDocumentJson
          );
          let currentDesignDom = currentDesignObj.document,
            currentPageId = currentDesignObj.pageId;
          if (currentDesignDom) {
            //01-29:AI Data传给yone，yone和大雄使用AI Data进行
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
                logger.debug("[edit.js-getHtmlCss]结构骨架输出成功");
                resultURL.projectId = projectUUID;
                resultURL.projectName = projectName;
                resultURL.htmlFileName = uploadTimeStamp;
                res.send(JSON.stringify(resultURL));
              }
            );
          } else {
            res.send(currentPageId);
          }
        } catch (e) {
          //console.log("报错，不解析：" + e);
          logger.error("[edit.js-getHtmlCss]报错，不解析：" + e);
          res.send(e.toString());
        }
      }
    });
};

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
 * DSL2：根据给到当前artBoardId对应designDom，调用DSL模块方法转为html和css
 * 导出html+css模块
 * @param {*} artBoardId
 * @param {*} currentDesignDom
 */

let jsonToHtmlCss = (artBoardId, currentDesignDom) => {
  let htmlCssPromise,
    cssHtmlfileName = uploadTimeStamp;
  let dslTree = Dsl.process(currentDesignDom, 750, 750, Common.FlexLayout);
  let render = Render.process(dslTree);
  let htmlStr = render.getTagString("css/" + cssHtmlfileName + ".css");
  let cssStr = render.getStyleString();

  //生成文件导出对应路径
  let exportPath = "./data/complie/" + projectName;
  //console.log('全路径:' + exportPath)
  // 导出html文件和css文件
  try {
    htmlCssPromise = new Promise(function(resolve, reject) {
      if (htmlStr) {
        Export.exportHtml(exportPath, cssHtmlfileName, htmlStr, function() {
          //console.log("导出html成功");
          logger.debug("[edit.js-jsonToHtmlCss]导出html成功");
          resolve("success");
        });
      }
    });
    htmlCssPromise.then(data => {
      if (cssStr) {
        Export.exportCss(
          exportPath + "/css",
          cssHtmlfileName,
          cssStr,
          function() {
            //console.log("导出css成功");
            logger.debug("[edit.js-jsonToHtmlCss]导出css成功");
            //复制公共样式reset.css到当前目录
            fs.copyFile(
              "./data/complie/css/reset.css",
              exportPath + "/css/reset.css",
              function(err) {
                if (err) {
                  console.log(err);
                  return;
                }
              }
            );
          }
        );
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
let getArtBoardImg = async (artBoardObj, callback) => {
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
  callback();
};

//创建新项目
router.post("/createViewhistory", function(req, res, next) {
  var h = new history(req.body);
  var user = h.create(function(result) {
    res.json(result);
  });
});

module.exports = router;
