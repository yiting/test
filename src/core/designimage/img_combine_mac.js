const download = require('download-file');
const unzip = require('unzip');

// 图片生成目录
const outputDir = './data/complie/';
// sketch文件解压缩目录
const inputDir = './data/unzip_file/';
// sketch目录
const sketchDir = './data/upload_file/';

const fs = require('fs');
const { exec } = require('child_process');
const serverModulesUtils = require('../util/utils');
const qlog = require('../log/qlog');
let logger = qlog.getInstance(qlog.moduleData.img);
logger = console;
// const BIN='./server_modules/designimage/Contents/Resources/sketchtool/bin/sketchtool';
let BIN =
  '/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool';

const logData = {
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
   * imageCombineConfig.outputDir : 图片输出目录
   * imageCombineConfig.inputDir ：解压后的源文件目录（可选）
   * imageCombineConfig.binDir : 绘图库的路径（可选）
   * imageCombineConfig.sketchDir : 设计稿所在目录（可选）
   */
  this.init = function(param) {
    this.inputDir = param.inputDir || inputDir;
    // pageJson = param.pageJson;
    that = this;
    logData.num._makePreComposeImage = 0;
    logData.num._combineTwoShape = 0;
    logData.costTime = new Date().getTime();
    this.urlPre = '';
    if (param.binDir) {
      BIN = param.binDir;
    }
    this.sketchDir = param.sketchDir || sketchDir;
    this.outputDir = param.outputDir || outputDir;
    this.pageId = param.pageId;
  };

  this.unzipSketch = async projectName => {
    const that = this;
    const sketchPath = `${that.sketchDir + projectName}.sketch`;

    return new Promise(function(resolve, reject) {
      const extract = unzip.Extract({
        path: that.inputDir + projectName, // md5
      });
      // 解压异常处理
      extract.on('error', function(err) {
        console.log(err);
      });
      // 解压完成处理
      extract.on('finish', function() {
        console.log('解压完成!!');
        const result = {
          message: 'ok',
        };
        resolve(result);
      });
      fs.createReadStream(sketchPath).pipe(extract);
    });
  };

  this.downloadSketch = async url => {
    const that = this;
    let projectName = url.substring(
      url.lastIndexOf('/') + 1,
      url.lastIndexOf('.sketch'),
    );
    if (url.indexOf('getSketchFile') > -1) {
      projectName = url.substring(
        url.lastIndexOf('path=') + 5,
        url.lastIndexOf('.sketch'),
      );
    }
    const options = {
      directory: that.sketchDir,
      filename: projectName + '.sketch',
    };
    return new Promise(function(resolve, reject) {
      download(url, options, function(err, path) {
        if (err) throw err;
        const result = {
          message: 'ok',
        };
        resolve(result);
      });
    });
  };

  // 获取所有的imageChildren里的id
  this.getImageChildrenFlatsData = function(
    imageChildren,
    imageChildrenFlatArr,
  ) {
    const that = this;
    imageChildren.forEach(imageItem => {
      if (imageItem._imageChildren && imageItem._imageChildren.length > 0) {
        that.getImageChildrenFlatsData(
          imageItem._imageChildren,
          imageChildrenFlatArr,
        );
      } else {
        imageChildrenFlatArr.push(imageItem);
      }
    });
    return imageChildrenFlatArr;
  };

  // 将最小父层级对应的json
  this.getMinParentJson = function(param) {
    const { tmpPageJson, imageChildrenFlatArr, minParentIndex } = param;
    let tmpJson = tmpPageJson;
    // 获取最小父层级的节点
    try {
      for (let i = 0, ilen = minParentIndex; i <= ilen; i++) {
        tmpJson = tmpJson.layers[imageChildrenFlatArr[0].levelArr[i]];
      }
    } catch (e) {
      logger.warn(e);
    }

    return tmpJson;
  };

  // 将最小父层级下无关的层级隐藏
  this.showNodes = function(param) {
    const { tmpJson, imageChildrenFlatArr, level } = param;
    const that = this;
    // try {
    if (typeof tmpJson == 'undefined') {
      console.log(12);
    }
    tmpJson.layers.forEach((item, index) => {
      let isShow = false;
      let isParent = false;
      imageChildrenFlatArr.forEach(imageItem => {
        if (imageItem.id == item.do_objectID) {
          item.isVisible = true;
          isShow = true;
        }
        if (index == imageItem.levelArr[level]) {
          isParent = true;
        }
      });

      if (!isShow && isParent && item.layers && item.layers.length > 0) {
        that.showNodes({
          tmpJson: item,
          imageChildrenFlatArr,
          level: level + 1,
        });
      } else if (!isShow && !isParent) {
        item.isVisible = false;
      }
    });
    // } catch (e) {
    //   logger.warn(e);
    // }
  };

  // 获取所有子图层的最小父层级
  this.getMinParentIndex = function(imageChildren) {
    let minParentIndex = -1;
    let maxLevelLength = 0;
    imageChildren.forEach(item => {
      const { levelArr } = item;
      if (levelArr && levelArr.length > maxLevelLength) {
        maxLevelLength = levelArr.length;
      }
    });
    for (let i = 0, ilen = maxLevelLength; i < ilen; i++) {
      if (minParentIndex == -1) {
        for (let j = 0, jlen = imageChildren.length - 1; j < jlen; j++) {
          if (
            imageChildren[j].levelArr &&
            imageChildren[j + 1].levelArr &&
            imageChildren[j].levelArr[i] != imageChildren[j + 1].levelArr[i]
          ) {
            minParentIndex = i - 1;
            break;
          }
        }
      }
    }
    return minParentIndex;
  };

  this.makeGroup = function(tmpJson) {
    var groundId = '94EB1372-43F1-41A5-B082-1887B1B0F235';
    var groupJson = {
      _class: 'group',
      do_objectID: groundId,
      booleanOperation: -1,
      exportOptions: {
        _class: 'exportOptions',
        exportFormats: [],
        includedLayerIds: [],
        layerOptions: 0,
        shouldTrim: false,
      },
      frame: {
        _class: 'rect',
        constrainProportions: false,
        height: tmpJson.frame.height,
        width: tmpJson.frame.width,
        x: 0,
        y: 0,
      },
      isFixedToViewport: false,
      isFlippedHorizontal: false,
      isFlippedVertical: false,
      isLocked: false,
      isVisible: true,
      layerListExpandedType: 0,
      name: '编组',
      nameIsFixed: false,
      resizingConstraint: 63,
      resizingType: 0,
      rotation: 0,
      shouldBreakMaskChain: false,
      clippingMaskMode: 0,
      hasClippingMask: false,
      style: {
        _class: 'style',
        endMarkerType: 0,
        miterLimit: 10,
        startMarkerType: 0,
        windingRule: 1,
      },
      groupLayout: {
        _class: 'MSImmutableFreeformGroupLayout',
      },
      hasClickThrough: false,
      layers: [],
    };
    groupJson.layers = tmpJson.layers;
    tmpJson.layers = [groupJson];
    return groundId;
  };

  this.readDirSync = function(path, newFileName) {
    const pa = fs.readdirSync(path);
    const that = this;
    for (let i = 0, ilen = pa.length; i < ilen; i++) {
      const ele = pa[i];
      const info = fs.statSync(`${path}/${ele}`);
      if (info.isDirectory()) {
        if (fs.existsSync(`${path + ele}/${newFileName}`)) {
          return `${path + ele}/${newFileName}`;
        }
        return that.readDirSync(`${path + ele}/`, newFileName);
      }
    }
  };
  // 搜索outputDir目录下newFileName的路径
  this.findFilePath = function(outputDir, newFileName) {
    if (fs.existsSync(outputDir + newFileName)) {
      return outputDir + newFileName;
    }
    return this.readDirSync(outputDir, newFileName);
  };

  /**
   * 入参 do_objectID  , projectName , path , generateId
   */
  this.makeImgByUpdateSketch = async param => {
    try {
      const { path, projectName, generateId, imageChildren } = param;
      // 通过隐藏不要图层然后用运行库合图的方式来合图
      const updateFileAfterFix = '_imgForCombine_';
      const projectNameWithoutAfterFix = projectName;
      // 2、复制sketch源文件,用于修改
      const updateFilePath =
        that.inputDir +
        projectNameWithoutAfterFix +
        updateFileAfterFix +
        generateId;
      await serverModulesUtils.copyFolderPromise(
        that.inputDir + projectNameWithoutAfterFix,
        updateFilePath,
      );

      // 3.获取pageId
      if (typeof that.pageId === 'undefined' && fs.existsSync(updateFilePath)) {
        const files = fs.readdirSync(`${updateFilePath}/pages/`);
        files.forEach(item => {
          that.pageId = item.substring(0, item.indexOf('.json'));
        });
      }

      // 3、获取json
      if (typeof that.pageJson === 'undefined') {
        that.pageJson = serverModulesUtils.getJsonFileData(
          `${that.inputDir + projectNameWithoutAfterFix}/pages/${
            that.pageId
          }.json`,
        );
      }
      const tmpPageJson = {};
      Object.assign(tmpPageJson, that.pageJson);
      // 4、获取所有imageChildren的平铺数据
      let imageChildrenFlatArr = [];
      imageChildrenFlatArr = this.getImageChildrenFlatsData(
        imageChildren,
        imageChildrenFlatArr,
      );
      // 1、获取所有子图层的最小父层级
      const minParentIndex = this.getMinParentIndex(imageChildrenFlatArr);
      // 1、获取最小父层级对应的json
      const tmpJson = this.getMinParentJson({
        tmpPageJson,
        imageChildrenFlatArr,
        minParentIndex,
      });

      // 5、将最小父层级下无关的层级隐藏
      this.showNodes({
        tmpJson,
        imageChildrenFlatArr,
        level: 1,
      });
      // 6、如果最小父层级是artboard节点，则需要建一个组，将所有节点都包含进去
      var newGroupId;
      if (minParentIndex == 0) {
        newGroupId = this.makeGroup(tmpJson);
      }
      // 6、合成修改版sketch
      // tmpPageJson = require("./1.json");
      // console.log(tmpPageJson.layers[0].layers[0].layers[1].layers[0].isVisible);
      const str = JSON.stringify(tmpPageJson);
      fs.unlinkSync(`${updateFilePath}/pages/${that.pageId}.json`);
      fs.writeFileSync(`${updateFilePath}/pages/${that.pageId}.json`, str);
      await serverModulesUtils.zipFolderPromise(
        `${that.sketchDir +
          projectNameWithoutAfterFix +
          updateFileAfterFix +
          generateId}.sketch`,
        updateFilePath,
      );
      // 7、运行库
      param.do_objectID = newGroupId || tmpJson.do_objectID;
      param.sketchName =
        projectNameWithoutAfterFix + updateFileAfterFix + generateId;
      const result = await this.makeImg(param);

      // 8、删除修改版sketch
      serverModulesUtils.deleteFolder(updateFilePath);
      serverModulesUtils.deleteFolder(
        `${that.sketchDir +
          projectNameWithoutAfterFix +
          updateFileAfterFix +
          generateId}.sketch`,
      );

      // 返回
      return new Promise(function(resolve, reject) {
        resolve(result);
      });
    } catch (e) {
      logger.error(e);
      return new Promise(function(resolve, reject) {
        resolve(e);
      });
    }
  };

  /**
   * 入参 do_objectID  , path , projectName , generateId
   */
  this.makeImg = async param => {
    path = await this.combineShapeGroupNodeWithNative(param);
    const result = {
      path: this.getUrl(path),
    };
    return result;
  };

  this.getUrlPre = () => {
    return this.urlPre;
  };

  this.getUrl = path => {
    return this.getUrlPre() + path;
  };
  /**
   * 使用绘图库进行合并
   * @param {QNode} item ：要合并的节点
   * @param {Boolean} isReleaseFile ： 是否直接输出图片，不用走临时图片的逻辑
   * @returns {String} fileName ：生成图片的文件名
   *
   * 入参 do_objectID  , path , projectName  , generateId
   */
  this.combineShapeGroupNodeWithNative = function(param) {
    const main = async () => {
      // var queryParam = req.query;
      // sketchFile = "designFile/"+queryParam.sketchFile;

      let { do_objectID, path, projectName, sketchName, generateId } = param;
      if (typeof sketchName == 'undefined') {
        sketchName = projectName;
      }
      const that = this;
      const { sketchDir } = that;
      const outputDir = `${that.outputDir + projectName}/images/${generateId}/`;
      return new Promise(function(resolve, reject) {
        const command = `${BIN} export layers --output=${outputDir} --formats=png ${`${sketchDir +
          sketchName}.sketch`} --item=${do_objectID}`;
        let filePath;
        let fileName;
        // command = `./server_modules/designimage/Contents/Resources/sketchtool/bin/sketchtool list layers  ./data/upload_file/20181029145053_空白页推荐游戏2.sketch —item=DC51D000-5164-4444-A290-5762135D4131`;
        // command = `./server_modules/designimage/Contents/Resources/sketchtool/bin/sketchtool export layers --output=./public/result/bc4f5440-cdcf-11e8-a39c-712f9937d34d/ --formats=png ./data/upload_file/20181012113433_1单页.sketch --item=14A47E63-7037-482D-843F-0B234D12A70C`;
        // console.log(command);
        logData.num._combineShapeGroupNodeWithNative++;
        exec(command, function(a, b, c) {
          if (path.indexOf('251A6DC3-7148-42D8-A0AF-7917BAE1C703.png') > -1) {
            console.log(3);
          }
          if (a) {
            logger.error(a);
            // console.log(a);
          }
          if (b == '') {
            // debugger;
          }
          const newFileName = b.substring(9, b.length - 1);
          if (newFileName.indexOf('Group') > -1) {
            // console.log(3);
          }
          fileName = path;
          filePath = `${that.outputDir + projectName}/images/${fileName}`;
          try {
            fs.renameSync(
              that.findFilePath(outputDir, newFileName),
              filePath,
              function(err) {},
            );
            //删除临时文件夹
            serverModulesUtils.deleteFolder(outputDir);
          } catch (e) {
            logger.warn(e);
            // console.error(e);
          }

          resolve(`${projectName}/images/${fileName}`);
        });
      });
    };
    try {
      return main();
    } catch (e) {
      logger.warn(e);
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
