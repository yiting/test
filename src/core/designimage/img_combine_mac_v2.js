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
    // logger = console;
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
        }, 50);
      });
      fs.createReadStream(sketchPath).pipe(extract);
    });
  };

  this.deleteScaleFilename = async dirPath => {
    fs.readdir(dirPath, (err, files) => {
      files.forEach(file => {
        if (file.indexOf('@') > -1) {
          //去掉2倍图@2X等文件名字符
          fs.renameSync(
            dirPath + file,
            dirPath +
              file.substring(0, file.indexOf('@')) +
              file.substring(file.lastIndexOf('.')),
            function(err) {},
          );
        }
      });
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

  //将symbol instance覆盖的内容补回去
  this.overrideSymbol = function(instance, master) {
    let that = this;
    master.layers.forEach(masterItem => {
      instance.forEach(instanceItem => {
        if (instanceItem.overrideId == masterItem.do_objectID) {
          if (instanceItem.overrideType == 'stringValue') {
            masterItem.attributedString.string = instanceItem.value;
          } else if (instanceItem.overrideType == 'image') {
            masterItem.image._ref = instanceItem.value._ref;
          }
        }
      });
      if (masterItem.layers && masterItem.layers.length > 0) {
        that.overrideSymbol(instance, masterItem);
      }
    });
  };

  //获取symbolId获取对应的json
  this.getSymbolJson = function(symbolId, node) {
    var that = this;
    var tmpJson = {};
    var hasFound = false;
    var isInDocumentJson = false;
    //获取symbol对应的pageJson
    //先尝试在document.json里找
    let documentFile = fs.readFileSync(`${that.updateFilePath}/document.json`);
    if (documentFile.indexOf(symbolId) > -1) {
      tmpJson = JSON.parse(documentFile);
      hasFound = true;
      isInDocumentJson = true;
    }
    //再尝试在pages里找
    if (!isInDocumentJson) {
      const files = fs.readdirSync(`${that.updateFilePath}/pages/`);
      files.forEach(item => {
        let pageId = item.substring(0, item.indexOf('.json'));
        if (pageId != that.pageId) {
          // that.pageJson = JSON.parse(
          var jsonStr = that.getJsonFileData(
            `${that.inputDir +
              that.projectNameWithoutAfterFix}/pages/${pageId}.json`,
          );
          if (
            jsonStr.indexOf(symbolId) > -1 &&
            jsonStr.indexOf('symbolMaster') > -1
          ) {
            tmpJson = JSON.parse(jsonStr);
            hasFound = true;
          }
        }
      });
    }

    //遍历symbol，获取目标symbol
    if (isInDocumentJson == false) {
      tmpJson.layers.forEach((item, index) => {
        if (item.symbolID == symbolId) {
          tmpJson = item;
        }
      });
    } else {
      tmpJson.foreignSymbols.forEach((item, index) => {
        if (item.symbolMaster && item.symbolMaster.symbolID == symbolId) {
          tmpJson = item.symbolMaster;
        } else if (
          item.originalMaster &&
          item.originalMaster.symbolID == symbolId
        ) {
          tmpJson = item.originalMaster;
        }
      });
    }

    //将覆盖的内容补回去
    let overrideValues = node.overrideValues;
    if (overrideValues && overrideValues.length > 0) {
      overrideValues.forEach(item => {
        if (item._class == 'overrideValue') {
          item.overrideId = item.overrideName.substring(
            0,
            item.overrideName.indexOf('_'),
          );
          item.overrideType = item.overrideName.substring(
            item.overrideName.indexOf('_') + 1,
          );
        }
      });
      that.overrideSymbol(overrideValues, tmpJson);
    }

    tmpJson.frame.x = node.frame.x;
    tmpJson.frame.y = node.frame.y;
    // let scale = node.scale;
    // if(scale && scale != 1){
    //   that.updateScaleProp(tmpJson,scale);
    // }
    return tmpJson;
  };

  // this.updateScaleProp = function(node, scale) {
  //   let that = this;
  //   node.frame.width = node.frame.width * scale;
  //   node.frame.height = node.frame.height * scale;
  //   if (node._class != 'shapeGroup' && node.layers && node.layers.length > 0) {
  //     node.layers.forEach(item => {
  //       that.updateScaleProp(item, scale);
  //     });
  //   }
  // };

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
          tmpJson = this.getSymbolJson(tmpJson.symbolID, tmpJson);
        }
        tmpJson = tmpJson.layers[levelArr[i]];
      }
    } catch (e) {
      logger.warn(e);
    }
    // tmpJson = JSON.parse(JSON.stringify(tmpJson));
    if (tmpJson._class == 'symbolInstance') {
      tmpJson = this.getSymbolJson(tmpJson.symbolID, tmpJson);
    }
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
        let targetImageChildrenFlatArr = [];
        //判断symbol节点是否当前layers下要找的节点，如果不是，就将symbol节点转换成symbolMaster再继续处理
        if (item._class == 'symbolInstance') {
          let isInSymbol = true;
          imageChildrenFlatArr.forEach(imageItem => {
            if (
              imageItem.id == item.do_objectID ||
              imageItem.originId == item.do_objectID
            ) {
              isInSymbol = false;
            }
          });
          if (isInSymbol) {
            item = this.getSymbolJson(item.symbolID, item);
          }
        }
        imageChildrenFlatArr.forEach(imageItem => {
          if (
            imageItem.id == item.do_objectID ||
            imageItem.originId == item.do_objectID
          ) {
            // item.isVisible = true;
            isShow = true;
            generateJson.layers.push(item);
          }
          if (
            imageItem.levelArr &&
            index == imageItem.levelArr[level] &&
            level < imageItem.levelArr.length - 1
          ) {
            if (!isParent) {
              isParent = true;
              //复制一个没有layers属性的的item
              var layers = item['layers'];
              item['layers'] = [];
              var pushItem = this.cloneJson(item);
              item['layers'] = layers;
              generateJson.layers.push(pushItem);
            }
            targetImageChildrenFlatArr.push(imageItem);
          }
        });

        if (!isShow && isParent && item.layers && item.layers.length > 0) {
          that.showNodes({
            generateJson: generateJson.layers[generateJson.layers.length - 1],
            tmpJson: item,
            imageChildrenFlatArr: targetImageChildrenFlatArr,
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

  this.makeNewBlankNode = function(param) {
    //imageItem:具体要合的图层，用于判断这个图层是否超出边界，如果无超出边界，则将图层放在左上角，否则按原位置放置；如果没传进来，说明是不能直接合成的图片，则取父节点的坐标和宽高来判断是否超出边界
    var { tmpJson, imageItem } = param;
    var groundId = '94EB1372-43F1-41A5-B082-1887B1B0F235';
    let x = 0,
      y = 0;
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
        x: x,
        y: y,
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
    var groupJson = this.makeNewBlankNode({ tmpJson });
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

  // this.changeJsonIds = function(tmpJson, preStr) {
  //   let that = this;
  //   tmpJson.do_objectID = preStr + tmpJson.do_objectID;
  //   if (tmpJson.layers && tmpJson.layers.length > 0) {
  //     tmpJson.layers.forEach(item => {
  //       item.do_objectID = preStr + item.do_objectID;
  //       if (item.layers && item.layers.length > 0) {
  //         that.changeJsonIds(item, preStr);
  //       }
  //     });
  //   }
  // };

  // this.updateLevelArr = function(imageItem) {
  //   var levelArr = [];
  //   that.pageJson.layers.forEach((item, index) => {
  //     if (item.do_objectID == imageItem.id) {
  //       levelArr.push(index);
  //     }
  //   });
  //   imageItem.levelArr = levelArr;
  // };

  this.cloneJson = function(json) {
    return JSON.parse(JSON.stringify(json));
  };

  this.getSliceLayer = function(node) {
    var result = null;
    if (node.layers) {
      node.layers.forEach((item, index) => {
        if (item._class == 'slice') {
          result = item;
        }
      });
    }
    return result;
  };

  this.getAbsoultePosition = function(param) {
    let { tmpPageJson, minParentIndex, levelArr } = param;
    let tmpJson = tmpPageJson;
    let abX = 0,
      abY = 0;
    if (typeof levelArr == 'undefined') {
      return { abX, abY };
    }
    for (var i = 0, ilen = minParentIndex; i <= ilen; i++) {
      tmpJson = tmpJson.layers[levelArr[i]];
      if (i > 0) {
        abX += tmpJson.frame.x;
        abY += tmpJson.frame.y;
      }
    }
    return { abX, abY };
  };

  //当父节点里实际元素占的面积比父节点圈出来的面积少很多，这时要重新计算父节点的坐标和宽高
  this.updateParentPositionAndSize = function(node) {
    let abX = 10000;
    let abY = 10000;
    let abXPos = 0;
    let abYPos = 0;
    let isInMask = false;
    let widthThreshold = 200;
    if (node.layers && node.frame.width > 300) {
      node.layers.forEach(item => {
        if (isInMask && item.hasClippingMask == false) {
          //这是在遮罩层里的图层
          isInMask = true;
        } else {
          isInMask = false;
        }
        if (!isInMask) {
          if (item.frame.x < abX) {
            abX = item.frame.x;
          }
          if (item.frame.y < abY) {
            abY = item.frame.y;
          }
          if (item.frame.x + item.frame.width > abXPos) {
            abXPos = item.frame.x + item.frame.width;
          }
          if (item.frame.y + item.frame.height > abYPos) {
            abYPos = item.frame.y + item.frame.height;
          }
          if (item.hasClippingMask == true) {
            isInMask = true;
          }
        }
      });
      if (node.frame.width - (abXPos - abX) > widthThreshold) {
        //表示组里实际元素占的面积比组圈出来的面积少很多，这时要重新计算组的坐标和宽高
        node.frame.x = abX;
        node.frame.y = abY;
        node.frame.width = abXPos - abX;
        node.frame.height = abYPos - abY;
      }
    }
  };

  this.updatePosition = function(param) {
    let that = this;
    let { generateJson } = param;
    let innerJson = generateJson.layers[0];
    //如果目标超过artboard范围，则外层坐标设为距离artboard的相对位置
    if (
      (innerJson.frame.x <= 0 &&
        innerJson.frame.x + innerJson.frame.width > that.artboardWidth) ||
      (innerJson.frame.y <= 0 &&
        innerJson.frame.y + innerJson.frame.height > that.artboardHeight)
    ) {
      let { abX, abY } = that.getAbsoultePosition(param);
      generateJson.frame.x = abX;
      generateJson.frame.y = abY;
    } else {
      //不超过artboard范围，将图层移到左上角
      generateJson.frame.x = 10;
      generateJson.frame.y = 10;
      //如果要合的图较小但移动位置后去到屏幕外了，则反向移回来相应但距离
      generateJson.layers.forEach(item => {
        that.updateParentPositionAndSize(item);
        if (
          generateJson.frame.x + item.frame.x + item.frame.width >
          that.artboardWidth
        ) {
          item.frame.x = item.frame.x - generateJson.frame.x;
        }
        if (
          generateJson.frame.y + item.frame.y + item.frame.height >
          that.artboardHeight
        ) {
          item.frame.y = item.frame.y - generateJson.frame.y;
        }
      });

      // if(typeof levelArr != "undefined"){
      //   generateJson.layers.forEach(item=>{
      //     item.frame.x = item.frame.x - 10;
      //     item.frame.y = item.frame.y - 10;
      //   });
      // }
      // innerJson.frame.x = innerJson.frame.x - 10;
      // innerJson.frame.y = innerJson.frame.y - 10;
    }
  };

  this.getUpdateJson = function(param) {
    let { imageItem, index } = param;
    var generateId, tmpJson;
    var generateJson = {};
    var that = this;

    if (imageItem.id.indexOf('_') == -1) {
      //可以直接合成的情况
      imageItem.levelArr[0] = 0;
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
      generateJson = that.makeNewBlankNode({ tmpJson, imageItem });
      if (tmpJson._class != 'symbolInstance') {
        generateJson.layers[0] =
          tmpJson.layers[imageChildren[0]['levelArr'][minParentIndex + 1]];
      } else {
        generateJson.layers[0] = tmpJson;
      }

      //检查是否里面有slice，如果有则合成slice的图层
      var slice = that.getSliceLayer(generateJson.layers[0]);
      if (slice) {
        generateJson.layers[0].do_objectID =
          'Update-inner-' + generateJson.layers[0].do_objectID;
        generateId = imageItem.id;
        generateId = 'Update-' + index + '-' + generateId;
        slice.do_objectID = generateId;
        slice.name = imageItem.path.substring(
          0,
          imageItem.path.indexOf('.png'),
        );
      } else {
        generateJson.layers[0].do_objectID =
          'Update-inner-' + generateJson.layers[0].do_objectID;
        generateId = generateJson.do_objectID;
        generateId = 'Update-' + index + '-' + generateId;
        generateJson.do_objectID = generateId;
        that.updatePosition({
          generateJson,
          tmpPageJson,
          minParentIndex,
          levelArr: imageItem.levelArr,
        });
        generateJson.name = imageItem.path.substring(
          0,
          imageItem.path.indexOf('.png'),
        );
      }
    } else {
      //不可以直接合成的情况
      const imageChildren =
        imageItem._imageChildren && imageItem._imageChildren.length > 0
          ? imageItem._imageChildren
          : [imageItem];

      let tmpPageJson = that.pageJson;
      // Object.assign(tmpPageJson, that.pageJson);
      // 4、获取所有imageChildren的平铺数据
      let imageChildrenFlatArr = [];
      imageChildrenFlatArr = this.getImageChildrenFlatsData(
        imageChildren,
        imageChildrenFlatArr,
      );
      // 1、获取所有子图层的最小父层级
      const minParentIndex = this.getMinParentIndex(imageChildrenFlatArr);
      // 1、获取最小父层级对应的json
      tmpJson = this.getMinParentJson({
        tmpPageJson,
        imageChildrenFlatArr,
        minParentIndex,
      });

      // 5、如果不是直接合成的节点，将最小父层级下无关的层级隐藏
      generateJson = that.makeNewBlankNode({ tmpJson });
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

      that.updatePosition({
        generateJson,
      });
    }

    //将json里的id都改一下，避免重复
    // this.changeJsonIds(tmpJson,'Update_' + index + '_');

    return {
      generateJson,
      generateId,
    };
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
    // try {
    let { projectName, imgList } = param;

    if (imgList.length == 0) {
      return new Promise(function(resolve, reject) {
        resolve([]);
      });
    }
    // imgList.filter
    var that = this;
    // imgList = imgList.filter(function(item) {
    //   return item.path.indexOf('57da51f5565ce468366c1d9deadb91fa')>-1;
    // });
    // imgList = imgList.slice(0,1);
    // imgList = [imgList[18]];
    // 通过隐藏不要图层然后用运行库合图的方式来合图
    const updateFileAfterFix = '_imgForCombine';
    const projectNameWithoutAfterFix = projectName;
    that.projectNameWithoutAfterFix = projectNameWithoutAfterFix;
    // let isGenerateArtboard = this.isGenerateArtboard(imgList);
    // 2、复制sketch源文件,用于修改
    const updateFilePath =
      that.inputDir + projectNameWithoutAfterFix + updateFileAfterFix;
    that.updateFilePath = updateFilePath;
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
    // if (typeof artboardIndex == 'undefined') {
    //   //缩略图情况下没levelArr，需自己找
    //   for (var i = 0, ilen = that.pageJson.layers.length; i < ilen; i++) {
    //     if (that.pageJson.layers[i].do_objectID == imgList[0].id) {
    //       imgList[0]['levelArr'] = [i];
    //       artboardIndex = i;
    //     }
    //   }
    // }
    let pageJsonOriginLength;

    //将多余的artboard去掉
    for (var i = that.pageJson.layers.length - 1; i >= 0; i--) {
      if (i != artboardIndex) {
        that.pageJson.layers.splice(i, 1);
      } else {
        pageJsonOriginLength = that.pageJson.layers[i].layers.length;
        that.artboardHeight = that.pageJson.layers[i].frame.height;
        that.artboardWidth = that.pageJson.layers[i].frame.width;
      }
    }

    // artboardIndex = 0;

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
      // if (!isGenerateArtboard) {
      that.pageJson.layers[artboardIndex].layers.push(generateJson);
      // } else {
      //   that.pageJson.layers[artboardIndex] = generateJson;
      // }

      itemIds.push(generateId);
    });

    // 6、合成修改版sketch

    //将原始的数据去掉，节省内存
    // if (!isGenerateArtboard) {
    tmpPageJson.layers[artboardIndex].layers = tmpPageJson.layers[
      artboardIndex
    ].layers.slice(pageJsonOriginLength);
    // }

    //清除边框/阴影等属性
    let clearnList = ImageClean.cleanImg(tmpPageJson, [
      // 'border',
      'shadows',
      // 'borders',
    ]);
    ImageClean.clearJSON(tmpPageJson, clearnList, [
      // 'border',
      'shadows',
      // 'borders',
    ]);

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
    // } catch (e) {
    //   logger.error(e);
    //   return new Promise(function(resolve, reject) {
    //     resolve(e);
    //   });
    // }
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
      let scales = 1;
      if (that.artboardWidth < 750) {
        scales = 750 / that.artboardWidth;
      }
      return new Promise(function(resolve, reject) {
        const command = `${BIN} export layers --output=${outputDir} --formats=png ${`${sketchDir +
          sketchName}.sketch`} --items=${itemIds} --scales=${scales}`;
        logData.num._combineShapeGroupNodeWithNative++;
        // console.log(command);
        exec(command, function(a, b, c) {
          if (a) {
            logger.error(a);
          } else {
            if (scales != 1) {
              that.deleteScaleFilename(outputDir);
            }
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
      const that = this;
      let { projectName, sketchName, imgList } = param;
      let itemIds = [];
      let result = [];
      imgList.forEach(item => {
        itemIds.push(item['id']);
        result.push({
          path: that.getUrl(`${projectName}/images/${item['id']}.png`),
        });
      });
      if (typeof sketchName == 'undefined') {
        sketchName = projectName;
      }
      const { sketchDir } = that;
      const outputDir = `${that.outputDir + projectName}/images/`;
      // let scales = 750 / that.artboardWidth ;
      return new Promise(function(resolve, reject) {
        let command = `${BIN} export layers --output=${outputDir} --formats=png ${`${sketchDir +
          sketchName}.sketch`} --items=${itemIds} --use-id-for-name`;
        // console.log(command);
        exec(command, function(a, b, c) {
          if (a) {
            logger.error(a);
          }
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
