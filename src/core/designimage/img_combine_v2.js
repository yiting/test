const request = require('request');

// const logger = console;
const outputDir = './data/complie/';
const fs = require('fs');
const { exec } = require('child_process');
const CombineMac = require('./img_combine_mac');
const qlog = require('../log/qlog');

const store = require('./helper/store');
let logger = undefined;

var os = require('os');
//获取内网ip
function getLocalIp() {
  var ifaces = os.networkInterfaces();
  for (var dev in ifaces) {
    if (
      ifaces[dev][1] &&
      ifaces[dev][1].address &&
      ifaces[dev][1].address.indexOf('10.') != -1
    ) {
      return ifaces[dev][1].address;
    }
  }
  return 'localhost';
}

let BIN =
  '/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool';
const sketchDir = './data/upload_file/';
let interfacePre = 'http://' + getLocalIp() + ':8081/';
let logData = {
  costTime: 0,
  num: {
    _makePreComposeImage: 0,
    _combineTwoShape: 0,
    _combineShapeGroupNodeWithNative: 0,
  },
};

// 合图方法1：输入节点，先合并最里面的组，然后往外合并，直至合完，返回合成的bitmap节点
// mask方法1：输入节点和mask图层，输出该mask后的bitmap节点
// slice方法1：输入含slice的节点，输出slice后的bitmap节点

// "convert circle_left.gif circle_right.gif -compose Darken -composite    circle_intersection.gif"
// gm翻译为 outputImage.out("convert","circle_left.gif","circle_right.gif","-compose","Darken","-composite","circle_intersection.gif");

/**
 * 合图类
 * 将要合的多个图层合并成一张图片
 */
const ImageCombine = function() {
  this.rootNode = undefined;
  this.generateId = undefined;
  this.that = this;
  this.outputDir = undefined;
  // this.targetDir = undefined;
  /**
   * 初始化
   * @param {Object} imageCombineConfig
   * imageCombineConfig.projectName : 要处理的设计稿的名字
   * imageCombineConfig.outputDir : 图片输出目录
   * imageCombineConfig.generateId : 生成图片ID
   * imageCombineConfig.inputDir ：解压后的源文件目录（可选）
   * imageCombineConfig.binDir : 绘图库的路径（可选）
   * imageCombineConfig.pageJson : 所有要合成的图片的数据json（可选）
   * imageCombineConfig.sketchDir : 设计稿所在目录（可选）
   * projectName generateId
   */
  this.init = function(param) {
    this.inputDir = param.inputDir;
    that = this;
    logData.num._makePreComposeImage = 0;
    logData.num._combineTwoShape = 0;
    logData.costTime = new Date().getTime();
    this.projectName = param.projectName;
    this.generateId = param.generateId;
    // this.pageId = param.pageId;
    this.outputDir = param.outputDir || outputDir;
    if (this.generateId) {
      this.outputDir += `${this.generateId}/`;
    }
    if (param.binDir) {
      BIN = param.binDir;
    }

    this.sketchDir = param.sketchDir || sketchDir;
    this.pageId = param.pageId;
    if (param.interfacePre) {
      interfacePre = param.interfacePre;
    }

    // this.combineMacInstance = new CombineMac();
    // this.combineMacInstance.init(param);
    logger = qlog.getInstance(store.default.getAll());
    // logger.error('Cheese is too ripe!');
  };

  this.makeImg = async param => {
    logData.num._combineShapeGroupNodeWithNative++;
    // console.log("使用直接生成的数量："+logData.num._combineShapeGroupNodeWithNative)
    if (parseInt(param.generateId.substring(3)) > 30) {
      return new Promise(function(resolve, reject) {
        resolve({
          path:
            'http://10.64.70.72:3000/imgData?path=20190425163447_8d35599670e6f921eb509718efab001b/images/FE9A34BE-72B5-4E86-A6FC-D08AB65B9B82.png',
        });
      });
    }
    return new Promise(function(resolve, reject) {
      const url = `${interfacePre}img_makeImg`;
      request.post(
        {
          url,
          json: {
            param,
          },
        },
        function(error, response, body) {
          if (!error && response.statusCode == 200) {
            const result = response.body;
            resolve(result);
          }
        },
      );
    });
  };
  this.makeImgsByUpdateSketch = async param => {
    // if(parseInt(param.generateId.substring(3)) > 30){
    //   return new Promise(function(resolve, reject) {
    //     resolve({
    //       path:"http://10.64.70.72:3000/imgData?path=20190425163447_8d35599670e6f921eb509718efab001b/images/FE9A34BE-72B5-4E86-A6FC-D08AB65B9B82.png"
    //     });
    //   });
    // }
    // return new Promise(function(resolve, reject) {
    //   resolve({
    //     path:"http://10.64.70.72:3000/imgData?path=20190425163447_8d35599670e6f921eb509718efab001b/images/FE9A34BE-72B5-4E86-A6FC-D08AB65B9B82.png"
    //   });
    // });
    return new Promise(function(resolve, reject) {
      const url = `${interfacePre}img_makeImgsByUpdateSketch_v2`;
      request.post(
        {
          url,
          json: {
            param,
          },
        },
        function(error, response, body) {
          if (!error && response.statusCode == 200) {
            const result = response.body;
            resolve(result);
          }
        },
      );
    });
  };

  /**
   * 将节点及其子节点合并成一张图片
   * @param {QNode} node
   * @param {Object} param
   * param.width 设置要合成的图片宽度
   * param.height 设置要合成的图片高度
   * param.cantNative 设置是否不能用绘图库
   * param.masked 标记该节点是被遮罩的
   * @returns {QNode} newNode 合成后的节点数据
   */
  this.combineNodes = function(imgList, param) {
    const that = this;
    const main = async () => {
      const pathList = await this.makeImgsByUpdateSketch({
        projectName: that.projectName,
        imgList,
        pageId: that.pageId,
      });

      // 返回
      return new Promise(function(resolve, reject) {
        resolve(pathList);
      });
    };
    try {
      return main();
    } catch (e) {
      logger.error(e);
      resolve(e);
      // console.log(e);
    }
  };

  this.getLogData = function() {
    logData.costTime = (new Date().getTime() - logData.costTime) / 1000;
    logger.debug(logData);
    // console.log(logData);
    return logData;
  };
};

module.exports = ImageCombine;
