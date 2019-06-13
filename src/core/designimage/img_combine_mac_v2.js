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
const store = require('./helper/store');
const ImageClean = require('./img_clean');
let logger = undefined;
// logger = console;
// const BIN='./server_modules/designimage/Contents/Resources/sketchtool/bin/sketchtool';
let BIN =
  '/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool';

let logData = {
  costTime: 0,
  num: {
    _makePreComposeImage: 0,
    _combineTwoShape: 0,
    _combineShapeGroupNodeWithNative: 0,
  },
};

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

    logger = qlog.getInstance(store.default.getAll());
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
        setTimeout(function() {
          resolve(result);
        }, 10);
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
      //由于多余的artboard去掉了，只剩下要合图的artboard，所以levelArr的第一位改为0
      if (imageItem.levelArr) {
        imageItem.levelArr[0] = 0;
      }
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
    var hasLevelArrIndex = 0;
    while (
      typeof imageChildrenFlatArr[hasLevelArrIndex]['levelArr'] == 'undefined'
    ) {
      hasLevelArrIndex++;
    }
    var levelArr = imageChildrenFlatArr[hasLevelArrIndex]['levelArr'];
    try {
      for (let i = 0, ilen = minParentIndex; i <= ilen; i++) {
        if (tmpJson._class == 'symbolInstance') {
          break;
        }
        tmpJson = tmpJson.layers[levelArr[i]];
      }
    } catch (e) {
      logger.warn(e);
    }
    // tmpJson = JSON.parse(JSON.stringify(tmpJson));
    return tmpJson;
  };

  // 将最小父层级下无关的层级隐藏
  this.showNodes = function(param) {
    const { generateJson, tmpJson, imageChildrenFlatArr, level } = param;
    const that = this;
    // try {
    if (tmpJson.layers) {
      tmpJson.layers.forEach((item, index) => {
        let isShow = false;
        let isParent = false;
        imageChildrenFlatArr.forEach(imageItem => {
          if (imageItem.id == item.do_objectID) {
            // item.isVisible = true;
            isShow = true;
            generateJson.layers.push(item);
          }
          if (
            imageItem.levelArr &&
            index == imageItem.levelArr[level] &&
            level < imageItem.levelArr.length - 1 &&
            !isParent
          ) {
            isParent = true;
            //复制一个没有layers属性的的item
            var layers = item['layers'];
            item['layers'] = [];
            var pushItem = this.cloneJson(item);
            item['layers'] = layers;
            generateJson.layers.push(pushItem);
          }
        });

        if (!isShow && isParent && item.layers && item.layers.length > 0) {
          that.showNodes({
            generateJson: generateJson.layers[generateJson.layers.length - 1],
            tmpJson: item,
            imageChildrenFlatArr,
            level: level + 1,
          });
        } else if (!isShow && !isParent) {
          // item.isVisible = false;
        }
      });
    }

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
    if (imageChildren.length == 1) {
      minParentIndex = maxLevelLength - 1 - 1;
    } else {
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
    }

    return minParentIndex;
  };

  this.makeNewBlankNode = function(tmpJson) {
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
        x:
          tmpJson._class == 'page' || tmpJson._class == 'artboard'
            ? 0
            : tmpJson.frame.width >= 750
            ? tmpJson.frame.x
            : 10,
        y:
          tmpJson._class == 'page' || tmpJson._class == 'artboard'
            ? 0
            : tmpJson.frame.width >= 750
            ? tmpJson.frame.y
            : 10,
      },
      isFixedToViewport: tmpJson.isFixedToViewport,
      isFlippedHorizontal: tmpJson.isFlippedHorizontal,
      isFlippedVertical: tmpJson.isFlippedVertical,
      isLocked: tmpJson.isLocked,
      isVisible: true,
      layerListExpandedType: tmpJson.layerListExpandedType,
      name: '编组',
      nameIsFixed: false,
      resizingConstraint: 63,
      resizingType: 0,
      rotation: 0,
      shouldBreakMaskChain: tmpJson.shouldBreakMaskChain,
      clippingMaskMode: 0,
      hasClippingMask: tmpJson.hasClippingMask,
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
      hasClickThrough: tmpJson.hasClickThrough,
      layers: [],
    };
    return groupJson;
  };

  this.makeGroup = function(tmpJson) {
    var groupJson = this.makeNewBlankNode(tmpJson);
    var that = this;
    for (var i = tmpJson.layers.length - 1; i >= 0; i--) {
      if (tmpJson.layers[i].isVisible == false) {
        tmpJson.layers.splice(i, 1);
      }
    }
    let layers = that.cloneJson(tmpJson.layers);
    groupJson.layers = layers;
    tmpJson = groupJson;

    return groupJson.do_objectID;
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

  this.changeJsonIds = function(tmpJson, preStr) {
    let that = this;
    tmpJson.do_objectID = preStr + tmpJson.do_objectID;
    if (tmpJson.layers && tmpJson.layers.length > 0) {
      tmpJson.layers.forEach(item => {
        item.do_objectID = preStr + item.do_objectID;
        if (item.layers && item.layers.length > 0) {
          that.changeJsonIds(item, preStr);
        }
      });
    }
  };

  this.updateLevelArr = function(imageItem) {
    var levelArr = [];
    that.pageJson.layers.forEach((item, index) => {
      if (item.do_objectID == imageItem.id) {
        levelArr.push(index);
      }
    });
    imageItem.levelArr = levelArr;
  };

  this.cloneJson = function(json) {
    return JSON.parse(JSON.stringify(json));
  };

  this.getUpdateJson = function(param) {
    let { imageItem, index } = param;
    var generateId, tmpJson;
    var generateJson = {};
    var that = this;

    if (imageItem.id.indexOf('_') == -1) {
      //可以直接合成的情况
      //如果是artboard缩略图合成，则要再补充levelArr数据
      imageItem.levelArr[0] = 0;
      if (imageItem._origin && imageItem._origin._class == 'artboard') {
        this.updateLevelArr(imageItem);
      }
      const imageChildren = [imageItem];
      let tmpPageJson = that.pageJson;

      // 1、获取所有子图层的最小父层级
      const minParentIndex = this.getMinParentIndex(imageChildren);
      // 1、获取最小父层级对应的json
      tmpJson = this.getMinParentJson({
        tmpPageJson,
        imageChildrenFlatArr: imageChildren,
        minParentIndex,
      });

      // generateJson = that.cloneJson(tmpJson);
      generateJson = that.makeNewBlankNode(tmpJson);
      if (
        tmpJson._class != 'page' &&
        tmpJson._class != 'artboard' &&
        tmpJson.frame.width < 750
      ) {
        tmpJson.frame.x = tmpJson.frame.x - 10;
        tmpJson.frame.y = tmpJson.frame.y - 10;
      }
      // generateJson.layers[0] = that.cloneJson(tmpJson);
      if (tmpJson._class != 'symbolInstance') {
        generateJson.layers[0] =
          tmpJson.layers[imageChildren[0]['levelArr'][minParentIndex + 1]];
      } else {
        generateJson.layers[0] = tmpJson;
      }

      generateJson.layers[0].do_objectID =
        'Update-inner-' + generateJson.layers[0].do_objectID;
      generateId = generateJson.do_objectID;
      generateId = 'Update-' + index + '-' + generateId;
      generateJson.do_objectID = generateId;
      generateJson.name = imageItem.path.substring(
        0,
        imageItem.path.indexOf('.png'),
      );
      // if(imageItem._origin && imageItem._origin._class == "artboard"){
      //   tmpJson._class = 'group';
      //   tmpJson.frame.x = 0;
      //   tmpJson.frame.y = 0;
      // }
    } else {
      //不可以直接合成的情况
      const imageChildren =
        imageItem._imageChildren && imageItem._imageChildren.length > 0
          ? imageItem._imageChildren
          : [imageItem];

      let tmpPageJson = that.pageJson;
      // Object.assign(tmpPageJson, that.pageJson);
      // tmpPageJson.aa = 'bb';
      // 4、获取所有imageChildren的平铺数据
      let imageChildrenFlatArr = [];
      imageChildrenFlatArr = this.getImageChildrenFlatsData(
        imageChildren,
        imageChildrenFlatArr,
      );
      // 1、获取所有子图层的最小父层级
      const minParentIndex = this.getMinParentIndex(imageChildrenFlatArr);
      // if(imageChildrenFlatArr[0]["id"].indexOf("E23075AB-79C5-4CD1-A91C-17806FC31")>-1){
      //   debugger;
      // }
      // 1、获取最小父层级对应的json
      tmpJson = this.getMinParentJson({
        tmpPageJson,
        imageChildrenFlatArr,
        minParentIndex,
      });

      // 5、如果不是直接合成的节点，将最小父层级下无关的层级隐藏
      generateJson = that.makeNewBlankNode(tmpJson);
      if (imageItem.id.indexOf('_') != -1) {
        that.showNodes({
          generateJson,
          tmpJson,
          imageChildrenFlatArr,
          level: minParentIndex + 1,
        });
      }

      // 6、如果最小父层级是artboard节点，则需要建一个组，将所有节点都包含进去
      // if (minParentIndex == 0 && imageItem.id.indexOf('_') != -1) {
      //   generateId = this.makeGroup(generateJson);
      // } else {
      generateId = generateJson.do_objectID;
      // }
      generateId = 'Update-' + index + '-' + generateId;
      generateJson.do_objectID = generateId;
      generateJson.name = imageItem.path.substring(
        0,
        imageItem.path.indexOf('.png'),
      );
    }

    //将json里的id都改一下，避免重复
    // this.changeJsonIds(tmpJson,'Update_' + index + '_');

    return {
      generateJson,
      generateId,
    };
  };

  this.isGenerateArtboard = function(imgList) {
    var imageItem = imgList[0];
    var result = false;
    if (imageItem._origin && imageItem._origin._class == 'artboard') {
      result = true;
    }
    return result;
  };

  this.getJsonFileData = function(path) {
    let data = {};
    let str;
    if (fs.existsSync(path)) {
      str = fs.readFileSync(path);
    }
    return str;
  };

  this.makeImgsByUpdateSketch = async param => {
    try {
      let { projectName, imgList } = param;

      var that = this;
      // imgList = imgList.filter(function(item) {
      //   return item.path.indexOf('_CC3B_0788')>-1;
      // });
      // imgList = imgList.slice(0,1);
      // imgList = [imgList[60]];
      // 通过隐藏不要图层然后用运行库合图的方式来合图
      const updateFileAfterFix = '_imgForCombine';
      const projectNameWithoutAfterFix = projectName;
      let isGenerateArtboard = this.isGenerateArtboard(imgList);
      // 2、复制sketch源文件,用于修改
      const updateFilePath =
        that.inputDir + projectNameWithoutAfterFix + updateFileAfterFix;
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
        that.pageJson = JSON.parse(
          this.getJsonFileData(
            `${that.inputDir + projectNameWithoutAfterFix}/pages/${
              that.pageId
            }.json`,
          ),
        );
      }
      let clearnList = ImageClean.cleanImg(that.pageJson, [
        'border',
        'shadows',
      ]);
      ImageClean.clearJSON(that.pageJson, clearnList, ['border', 'shadows']);
      // //拷贝源文件，同时解压
      // await serverModulesUtils.copyFolderPromise(
      //   path.resolve(__dirname, `./data/unzip_file/${projectName}`),
      //   path.resolve(
      //     __dirname,
      //     `./data/unzip_file/${projectName}_imgClearn`
      //   )
      // );
      // //查找源文件，替换这些，
      // await ImageClean.cleanFile(
      //   path.resolve(
      //     __dirname,
      //     `./data/unzip_file//${projectName}_imgClearn/pages`
      //   ),
      //   clearnList,
      //   ["borders", "shadows"]
      // );
      // //生成新的源文件给合同用
      // await serverModulesUtils.zipFolderPromise(
      //   path.resolve(
      //     __dirname,
      //     `./data/upload_file/${projectName}_imgClearn.sketch`
      //   ),
      //   path.resolve(
      //     __dirname,
      //     `./data/unzip_file/${projectName}_imgClearn/`
      //   )
      // );
      // logger.debug("[edit_img.js-getArtBoardImageList]成功去除属性数据");

      //获取artboard index
      var artboardIndex;
      for (var i = 0, ilen = imgList.length; i < ilen; i++) {
        if (
          typeof imgList[i] != 'undefined' &&
          typeof imgList[i]['levelArr'] != 'undefined'
        ) {
          artboardIndex = imgList[i]['levelArr'][0];
          break;
        }
        if (
          typeof imgList[i]['_imageChildren'] != 'undefined' &&
          imgList[i]['_imageChildren'].length > 0 &&
          typeof imgList[i]['_imageChildren'][0]['levelArr'] != 'undefined'
        ) {
          artboardIndex = imgList[i]['_imageChildren'][0]['levelArr'][0];
          break;
        }
      }
      if (typeof artboardIndex == 'undefined') {
        //缩略图情况下没levelArr，需自己找
        for (var i = 0, ilen = that.pageJson.layers.length; i < ilen; i++) {
          if (that.pageJson.layers[i].do_objectID == imgList[0].id) {
            imgList[0]['levelArr'] = [i];
            artboardIndex = i;
          }
        }
      }
      let pageJsonOriginLength;

      //将多余的artboard去掉
      for (var i = that.pageJson.layers.length - 1; i >= 0; i--) {
        if (i != artboardIndex) {
          that.pageJson.layers.splice(i, 1);
        } else {
          pageJsonOriginLength = that.pageJson.layers[i].layers.length;
        }
      }

      artboardIndex = 0;

      let tmpPageJson = that.pageJson;

      let itemIds = [];
      imgList.forEach((imageItem, index) => {
        //对每个节点，获取json，同时json改id，将name改为path，
        //返回修改后的json，及要导出的id
        if (index == 22) {
          // console.log(1);
        }
        var { generateJson, generateId } = that.getUpdateJson({
          imageItem,
          index,
        });
        //将json追加到最后getUpdateJson
        if (!isGenerateArtboard) {
          that.pageJson.layers[artboardIndex].layers.push(generateJson);
        } else {
          that.pageJson.layers[artboardIndex] = generateJson;
        }

        itemIds.push(generateId);
      });

      // 6、合成修改版sketch

      //将原始的数据去掉，节省内存
      if (!isGenerateArtboard) {
        tmpPageJson.layers[artboardIndex].layers = tmpPageJson.layers[
          artboardIndex
        ].layers.slice(pageJsonOriginLength);
      }

      fs.unlinkSync(`${updateFilePath}/pages/${that.pageId}.json`);

      const str = JSON.stringify(tmpPageJson);

      fs.writeFileSync(`${updateFilePath}/pages/${that.pageId}.json`, str);
      await serverModulesUtils.zipFolderPromise(
        `${that.sketchDir +
          projectNameWithoutAfterFix +
          updateFileAfterFix}.sketch`,
        updateFilePath,
      );
      // 7、运行库
      param.itemIds = itemIds;
      param.sketchName = projectNameWithoutAfterFix + updateFileAfterFix;
      const result = await this.makeImg(param);

      // 8、删除修改版sketch
      // serverModulesUtils.deleteFolder(updateFilePath);
      // serverModulesUtils.deleteFolder(
      //   `${that.sketchDir +
      //     projectNameWithoutAfterFix +
      //     updateFileAfterFix
      //     }.sketch`,
      // );

      // 返回
      // return new Promise(function(resolve, reject) {
      //   resolve({
      //     path:"20190425163447_8d35599670e6f921eb509718efab001b/images/_4DE6_B093.png"
      //   });
      // });
      var resultObj = [];
      imgList.forEach((imageItem, index) => {
        resultObj.push({
          path: `${projectName}/images/${imageItem.path}`,
        });
      });
      return new Promise(function(resolve, reject) {
        resolve(resultObj);
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
      let { itemIds, path, projectName, sketchName } = param;
      if (typeof sketchName == 'undefined') {
        sketchName = projectName;
      }
      const that = this;
      const { sketchDir } = that;
      const outputDir = `${that.outputDir + projectName}/images/`;
      return new Promise(function(resolve, reject) {
        const command = `${BIN} export layers --output=${outputDir} --formats=png ${`${sketchDir +
          sketchName}.sketch`} --items=${itemIds}`;
        logData.num._combineShapeGroupNodeWithNative++;
        exec(command, function(a, b, c) {
          if (a) {
            logger.error(a);
          }
          resolve(`${projectName}/images/1111`);
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

  this.readDirSync = function(path, newFileName) {
    var pa = fs.readdirSync(path);
    var that = this;
    for (var i = 0, ilen = pa.length; i < ilen; i++) {
      var ele = pa[i];
      var info = fs.statSync(path + '/' + ele);
      if (info.isDirectory()) {
        if (fs.existsSync(path + ele + '/' + newFileName)) {
          return path + ele + '/' + newFileName;
        } else {
          return that.readDirSync(path + ele + '/', newFileName);
        }
      }
    }
  };
  //搜索outputDir目录下newFileName的路径
  this.findFilePath = function(outputDir, newFileName) {
    if (fs.existsSync(outputDir + newFileName)) {
      return outputDir + newFileName;
    } else {
      return this.readDirSync(outputDir, newFileName);
    }
  };

  //预览图查看
  this.preview = function(param) {
    const main = async () => {
      let { projectName, sketchName } = param;
      let itemIds = [param.imgList[0]['id']];
      if (typeof sketchName == 'undefined') {
        sketchName = projectName;
      }
      const that = this;
      const { sketchDir } = that;
      const outputDir = `${that.outputDir + projectName}/images/`;
      return new Promise(function(resolve, reject) {
        const command = `${BIN} export layers --output=${outputDir} --formats=png ${`${sketchDir +
          sketchName}.sketch`} --items=${itemIds}`;
        exec(command, function(a, b, c) {
          if (a) {
            logger.error(a);
          }
          var newFileName = b.substring(9, b.length - 1);
          fileName = itemIds[0] + '.png';
          filePath = outputDir + fileName;
          try {
            fs.renameSync(
              that.findFilePath(outputDir, newFileName),
              filePath,
              function(err) {},
            );
          } catch (e) {
            logger.error(e);
          }
          const result = {
            path: that.getUrl(`${projectName}/images/${fileName}`),
          };
          resolve(result);
        });
      });
    };

    try {
      return main();
    } catch (e) {
      logger.warn(e);
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
