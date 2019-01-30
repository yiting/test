/**
 * 版本任务编译类:定时每天凌晨三点左右执行
 * 1.首先去扫描检测每个artboard的编译版本moduleVersion与本地基础库版本是否一致
 * 2.a.如果一致，则跳过不重新编译
 *   b.如果不一致，则重新编译
 */
/*1.系统包、工具模块*/
const fs = require("fs");
const path = require("path");

const schedule = require("node-schedule");
//基础库版本
const MODULE_VERSION = require("../../server_modules/version").version;
//工具类
let Utils = require("../../server_modules/util/utils");
const ControllerUtils = require("../util/utils");
//数据库业务类
const artboard = require("../../models/artboard");
//执行任务时间
const TASK_TIME_HOUR = 10,
  TASK_TIME_MINUTE = 19;
//编译相关
const Common = require("../../server_modules/dsl2/dsl_common.js");
const Dsl = require("../../server_modules/dsl2/dsl.js");
const Render = require("../../server_modules/render/render.js");
//模板类
const Template = require("../../server_modules/util/template");
//导出类
const Export = require("../../server_modules/util/export");
//1.引入parser模块
const Parser = require("../../server_modules/designjson/parser/designjson_parser_sketch")
  .parse;
const Optimize = require("../../server_modules/designjson/optimize/designjson_optimize");
//2.引入dsl模块
//const DSL = require("../../server_modules/dsl/dsl");
//3.引入图片模块
let ImageCombine = require("../../server_modules/designimage/img_combine");

let pageArtBoardIndex,
  currentImgsList, //每个页面存放一个需要合并的图的列表
  currentDesignJson,
  uploadTimeStamp,
  projectName,
  imageCombineConfig;

class versionTask {
  constructor() {
    this.currentImgsListObj = {};
    this.taskList = [];
  }
  /**
   * 定时执行一批任务
   */
  scheduleCronstyle(taskList) {
    let that = this;
    //每天的凌晨三点执行
    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0, new schedule.Range(1, 6)];
    rule.hour = TASK_TIME_HOUR;
    rule.minute = TASK_TIME_MINUTE;
    schedule.scheduleJob(rule, () => {
      //开始队列执行任务
      that.excuteTaskList();
    });
  }

  //查询所有artBoard的名称，即为当前artBoard页的创建时间:artBoardTime
  async getArtBoardList() {
    let artbd = new artboard();
    return new Promise((resolve, reject) => {
      artbd.getAllArtBoards(function(result) {
        resolve(result);
      });
    });
  }

  /**
   * 获取所有需要重新编译的artBoard列表:通过扫描查询artBoard的版本号，与当前基础库版本匹配(取最近7天的数据)
   */
  async getNeedArtBoardList() {
    //如果版本不匹配，则将该artBoardId放入到该任务列表中
    let artboardList = await this.getArtBoardList();
    artboardList.data.forEach(artboardObj => {
      let artId = artboardObj.artboardId,
        artBoardDate = artboardObj.artboardName,
        artIndex = artboardObj.artboardIndex,
        pId = artboardObj.projectId,
        pName = artboardObj.projectName,
        mVersion = artboardObj.moduleVersion;
      let isWeek = ControllerUtils.isWeek(artBoardDate);
      if (isWeek && mVersion != MODULE_VERSION) {
        //在一周内且版本与当前基础库版本不一致的需要编译的artBoard
        this.taskList.push({
          pId,
          pName,
          artId,
          artBoardDate,
          artIndex
        });
      }
    });
    console.log("需要编译的artBoard列表为:" + this.taskList);
  }

  /**
   * 依次执行需要重新编译的artBoard的任务列表
   */
  async excuteTaskList() {
    //获取满足条件需要编译的artBoard列表
    await this.getNeedArtBoardList();
    //单项编译任务
    let needArtBoardList = this.taskList;
    for (let i = 0; i < needArtBoardList.length; i++) {
      let needArtBoard = needArtBoardList[i];
      let pId = needArtBoard.pId,
        pName = needArtBoard.pName,
        artId = needArtBoard.artId,
        artIndex = needArtBoard.artIndex,
        artDate = needArtBoard.artBoardDate;
      //执行单个编译任务
      console.log(
        "----------------------开始执行任务" + i + "------------------------"
      );
      await this.excuteTask(pId, pName, artId, artDate, artIndex, i);
      console.log(
        "----------------------结束执行任务" + i + "------------------------"
      );
    }
  }
  /**
   * 执行单个任务
   * @param {*} artboardId
   */
  async excuteTask(pId, pName, artId, artDate, artIndex, i) {
    //先生成骨架
    await this.getArtboardStructure(pId, pName, artId, artDate, artIndex);
    //再生成images
    return this.getArtboardImages(pId, artId, pName, artDate);
  }

  //1.编译生成骨架方法
  async getArtboardStructure(pId, projectName, artBoardId, artDate, artIndex) {
    let that = this;
    //uploadTimeStamp = Utils.getDateStr();
    //不再重新新建html，html命名和之前一样，只是重新生成覆盖即可
    uploadTimeStamp = artDate;

    //将pages下面所有json读取出来给到yone。根据artBoardID，[json数组]获取当前artBoard对应的degisnDom，然后调用俊标模块，获取对应的html和css;调用大雄模块，获取处理后的图片
    let currentPagesJsonsArr = [];
    let pagesJsonDirectory = "./data/unzip_file/" + projectName + "/pages";
    let currentDocumentJsonPath =
      "./data/unzip_file/" + projectName + "/document.json";
    let currentDocumentJson = JSON.parse(
      fs.readFileSync(currentDocumentJsonPath)
    );
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
          //pageArtBoardIndex,
          //"1_1",
          artIndex,
          //描述文件
          currentDocumentJson
        );
        let currentDesignDom = currentDesignObj.document,
          currentPageId = currentDesignObj.pageId;
        if (currentDesignDom) {
          Optimize(currentDesignDom);
          //获取要合并的图片列表
          currentImgsList = currentDesignDom.getImage();
          that.currentImgsListObj[artBoardId] = {
            pId,
            projectName,
            currentImgsList
          };
          //获取当前的designdom对应的json
          currentDesignJson = currentDesignDom.toList();
          //生成骨架
          //2018-10-10:先出骨架，再等待图片生成后，再刷新页面
          return that
            .jsonToHtmlCss(projectName, artBoardId, currentDesignJson, artDate)
            .then(info => {
              console.log("骨架输出成功");
              //将编译结果插入数据库
              //本次只重新编译html:生成html后，将当前artBoard信息插入到数据库
              let artbd = new artboard({
                mVersion: MODULE_VERSION //当前基础库版本
              });
              artbd.updateModuleVersion(artBoardId, pId, function(result) {
                console.log("更新当前重新编译artBoard基础版本成功");
              });
            });
        }
      } catch (e) {
        console.log("报错，不解析：" + e);
      }
    }
  }

  /**
   * 根据当前artboard json数据生成html和css文件
   * @param {*} projectName
   * @param {*} artBoardId
   * @param {*} currentDesignDom
   * @param {*} artBoardDate
   */
  async jsonToHtmlCss(projectName, artBoardId, currentDesignDom, artBoardDate) {
    let htmlCssPromise,
      cssHtmlfileName = artBoardDate;
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
            logger.debug(
              "[edit.js-jsonToHtmlCss]导出html" + cssHtmlfileName + "成功"
            );
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
              logger.debug(
                "[edit.js-jsonToHtmlCss]导出css" + cssHtmlfileName + "成功"
              );
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
      logger.error("[edit.js-jsonToHtmlCss]导出html或css出错!");
    }
    return htmlCssPromise;
  }

  /**
   * 编译生成当前artboard图片方法
   * @param {*} pId
   * @param {*} artBoardId
   * @param {*} projectName
   * @param {*} artDate
   */
  async getArtboardImages(pId, artBoardId, projectName, artDate) {
    //默认需要生成
    return this.combineImages(projectName, artBoardId).then(info => {
      //设置标识为false，代表已生成，下次不需要再次生成
      //console.log("图片输出成功,图片数组个数:" + generateImgArr.length);
      //生成图片完成后，则将当前artBoard信息插入到数据库:在生成html时候即开始更新数据库版本库数据
      /* let artbd = new artboard({
        mVersion: MODULE_VERSION //当前基础库版本
      });
      artbd.updateModuleVersion(artBoardId, pId, function(result) {
        console.log("更新当前重新编译artBoard基础版本成功");
      }); */
    });
  }

  /**
   * 导出图片模块:获取所有图片素材
   * @param callback
   * @returns {Promise.<void>}
   */

  async combineImages(projectName, artBoardId) {
    let startTime = new Date().getTime();
    //console.log("开始生成图片");
    logger.debug("[edit.js-combineImages]开始生成图片");
    let promiselist = [];
    //根据对应的artBoard获取对应的需要合并图片的列表
    let imageList = this.currentImgsListObj[artBoardId].currentImgsList;
    for (let i = 0, ilen = imageList.length; i < ilen; i++) {
      let imageCombine = new ImageCombine.ImageCombine();
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
      logger.debug(
        "[edit.js-combineImages]生成目标图片，用时" + costTime + "秒"
      );
      var imageCombine = new ImageCombine.ImageCombine();
      imageCombineConfig = {
        outputDir: "./data/complie/" + projectName + "/images/"
      };
      imageCombine.init(imageCombineConfig);
      imageCombine.deleteTmpFiles("./data/complie/" + projectName + "/images/");
      // ImageCombine.deleteTmpFiles();
    });
  }
}
//1.定时执行任务
new versionTask().scheduleCronstyle();

//2.直接执行任务
//new versionTask().excuteTaskList();
module.exports = versionTask;
