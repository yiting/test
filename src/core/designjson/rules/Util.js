function getRect(node, brother) {
  let abX = Math.min(node.abX, brother.abX);
  let abY = Math.min(node.abY, brother.abY);
  let abXops = Math.max(getAbXOps(node), getAbXOps(brother));
  let abYops = Math.max(getAbYOps(node), getAbYOps(brother));
  let width = abXops - abX;
  let height = abYops - abY;
  return {
    abX,
    abY,
    abXops,
    abYops,
    width,
    height,
  };
}

function getAbX(node) {
  return node.abX;
}

function getAbXOps(node) {
  return node.abX + node.width;
}

function getAbY(node) {
  return node.abY;
}

function getAbYOps(node) {
  return node.abY + node.height;
}

function getHeight(node) {
  return node.height;
}

function getZIndex(node) {
  return node.zIndex;
}

function getLevelArr(node) {
  return node.levelArr;
}

function swap(nodeA, nodeB) {
  var tmpNode = nodeB;
  nodeB = nodeA;
  nodeA = tmpNode;
}
// function isInclude(nodeA, nodeB) {
//   var nodeAX = getAbX(nodeA);
//   var nodeAXOps = getAbXOps(nodeA);
//   var nodeAY = getAbY(nodeA);
//   var nodeAYOps = getAbYOps(nodeA);
//   var nodeBX = getAbX(nodeB);
//   var nodeBXOps = getAbXOps(nodeB);
//   var nodeBY = getAbY(nodeB);
//   var nodeBYOps = getAbYOps(nodeB);
//   var result = false;
//   if (
//     nodeAX <= nodeBX &&
//     nodeAXOps >= nodeBXOps &&
//     nodeAY <= nodeBY &&
//     nodeAYOps >= nodeBYOps
//   ) {
//     result = true;
//   }
//   return result;
// }

let INTERSECT_TYPE = {
  INCLUDE: 0, //包含
  INTERSECT: 1, //相交
  DISJOINT: 2, //相离
  UNKONWN: -1,
};

function isOnlyBorder(node) {
  let style = (node._origin && node._origin.style) || {};
  let fills = style.fills || [];
  let borders = style.borders || [];
  let result = false;
  if (fills) {
    fills.forEach(item => {
      if (item.isEnabled == true) {
        return result;
      }
    });
  }
  if (borders) {
    borders.forEach(item => {
      if (item.isEnabled == true) {
        result = true;
      }
    });
  }
  return result;
}

//阈值添加：处理关怀ark中按钮突出了背景图的情况
function isIntersect(inputNodeA, inputNodeB, threshold = 0) {
  let nodeA = Object.assign(inputNodeA);
  let nodeB = Object.assign(inputNodeB);
  let nodeAabX = nodeA.abX;
  let nodeBabX = nodeB.abX;
  let result = 0;
  let type = INTERSECT_TYPE.UNKONWN; // 0 包含 ， 1 相交 ，2相离
  //保证A在左，B在右
  if (nodeAabX > nodeBabX) {
    var tmpNode = nodeB;
    nodeB = nodeA;
    nodeA = tmpNode;
    nodeAabX = nodeA.abX;
    nodeBabX = nodeB.abX;
  }
  let nodeAabXOpsOri = getAbXOps(nodeA);
  let nodeAabXOps = getAbXOps(nodeA);
  let nodeBabXOpsOri = getAbXOps(nodeB);
  let nodeAabYOpsOri = getAbYOps(nodeA);
  let nodeAabYOps = getAbYOps(nodeA);
  let nodeBabYOpsOri = getAbYOps(nodeB);
  let nodeBabYOps = getAbYOps(nodeB);
  let nodeAabY = nodeA.abY;
  let nodeBabY = nodeB.abY;

  if (
    nodeA.abX <= nodeB.abX &&
    nodeAabXOpsOri >= nodeBabXOpsOri &&
    nodeA.abY <= nodeB.abY &&
    nodeAabYOpsOri >= nodeBabYOpsOri
  ) {
    //A包含B的情况
    type = INTERSECT_TYPE.INCLUDE;
  } else if (
    nodeA.abX <= nodeB.abX &&
    nodeAabXOpsOri + threshold >= nodeBabXOpsOri &&
    nodeA.abY <= nodeB.abY &&
    nodeAabYOpsOri + threshold >= nodeBabYOpsOri
  ) {
    //A包含B的情况(加阈值)
    type = INTERSECT_TYPE.INCLUDE;
  } else if (
    nodeAabXOps < nodeBabX ||
    (nodeAabYOps < nodeBabY && nodeAabY < nodeBabY) ||
    (nodeBabYOps < nodeAabY && nodeBabY < nodeAabY)
  ) {
    //AB相离的情况
    type = INTERSECT_TYPE.DISJOINT;
  } else {
    //AB相交的情况
    type = INTERSECT_TYPE.INTERSECT;
  }
  return type;
}

function getColorRGB(node) {
  let type;
  let result = undefined;
  let r = 0;
  let g = 0;
  let b = 0;
  if (
    typeof node.styles.background == 'undefined' ||
    node.styles.background == null
  ) {
    return result;
  } else {
    type = node.styles.background.type;
  }
  if (
    node.styles &&
    node.styles.background &&
    node.styles.background.colorStops
  ) {
    let colorStops = node.styles.background.colorStops;
    colorStops.forEach(stop => {
      r += stop.color.r;
      g += stop.color.g;
      b += stop.color.b;
    });
    r = r / colorStops.length;
    g = g / colorStops.length;
    b = b / colorStops.length;
    result = {
      r: r,
      g: g,
      b: b,
    };
  } else if (
    node.styles &&
    node.styles.background &&
    node.styles.background.color
  ) {
    result = node.styles.background.color;
  }
  return result;
}

function getSize(node) {
  return node.width * node.height;
}

function findNodeByCond(node, brother, type, id1, id2) {
  let result = false;
  if (node[type] == id1 && brother[type] == id2) {
    result = true;
  }
  if (node[type] == id2 && brother[type] == id1) {
    result = true;
  }
  return result;
}

function isLine(node, ratio = 1) {
  //如果形状是矩形、圆形、直线以外的就不能css实现
  var result = false;
  if (node.width > 50 * ratio && node.height <= 4) {
    result = true;
  }
  if (node.width <= 2 && node.height >= 35) {
    result = true;
  }
  return result;
}

function isRedPoint(node) {
  var result = false;
  if (
    node.width >= 12 &&
    node.height >= 12 &&
    // node.width <= 20 && //当红点里有数字撑宽时宽度会变大
    node.height <= 30 && //卡普的红点高度
    node.styles &&
    node.styles.borderRadius &&
    (node.styles.borderRadius.filter(k => k == '50%').length ==
      node.styles.borderRadius.length ||
      node.styles.borderRadius.filter(k => k >= node.height / 2).length ==
        node.styles.borderRadius.length) &&
    node.styles.background &&
    node.styles.background.color &&
    node.styles.background.color.r > 240 &&
    node.styles.background.color.g < 100 &&
    node.styles.background.color.b < 100
  ) {
    result = true;
  }
  return result;
}

//如果节点是用户头像，则不合并
function isAvatar(node) {
  var result = false;
  if (node.name.indexOf('头像') > -1) {
    result = true;
  } else if (
    node.styles &&
    node.styles.borderRadius &&
    (node.styles.borderRadius.filter(k => k == '50%').length ==
      node.styles.borderRadius.length ||
      node.styles.borderRadius.filter(k => k > 0).length > 0) &&
    node.type == 'QImage' &&
    node.width == node.height &&
    node.width > 40 //找到最小的头像，游戏城里的头像宽度42
  ) {
    result = true;
  }
  return result;
}

function cloneJson(json) {
  return JSON.parse(JSON.stringify(json));
}

//查看是否symbolInstance
function isSymbolInstance(node) {
  return (
    typeof node.symbolRoot != 'undefined' &&
    node.parent &&
    typeof node.parent.symbolRoot == 'undefined'
  );
}

//如果节点由大的矩形和小的三角形/小的旋转了45度的尖角组成，则认为是气泡
function isBubble(node, ratio = 1) {
  let hasTriangle = false;
  let hasRectangle = false;
  let result = false;
  if (node._origin && node._origin.layers) {
    node._origin.layers.forEach(item => {
      if (
        item.frame &&
        item._class == 'rectangle' &&
        getSize(item.frame) > 150 * ratio * 20
      ) {
        hasRectangle = true;
      }
      if (
        item.frame &&
        getSize(item.frame) < 30 * ratio * 20 &&
        (item._class == 'triangle' || (item.points && item.points.length == 3))
      ) {
        hasTriangle = true;
      }
      if (
        item.frame &&
        item._class == 'rectangle' &&
        getSize(item.frame) < 30 * ratio * 20 &&
        (item.rotation == 45 || item.rotation == 315)
      ) {
        hasTriangle = true;
      }
    });
  }
  if (hasTriangle && hasRectangle) {
    result = true;
  }
  return result;
}

function isImage(_origin) {
  let result = false;
  let that = this;
  if (typeof _origin == 'undefined' || _origin._class == 'shapeGroup') {
    result = false;
  } else if (_origin._class == 'bitmap') {
    result = true;
  } else if (_origin.layers) {
    for (var i = 0, ilen = _origin.layers.length; i < ilen; i++) {
      let itemResult = that.isImage(_origin.layers[i]);
      if (itemResult == true) {
        result = true;
        break;
      }
    }
  }
  return result;
}

//如果任意三个点在同一直线上，则中间的点是没用的，把他去掉
function updatePoints(node) {
  if (node._origin && node._origin.points) {
    var points = node._origin.points;
    if (points.length > 3) {
      var popIndexArr = [];
      for (var i = 0, ilen = points.length; i < ilen; i++) {
        for (var j = i + 1, jlen = points.length; j < jlen; j++) {
          for (var k = j + 1, klen = points.length; k < klen; k++) {
            var p = [];
            p[0] = JSON.parse(
              points[i].point.replace('{', '[').replace('}', ']'),
            );
            p[1] = JSON.parse(
              points[j].point.replace('{', '[').replace('}', ']'),
            );
            p[2] = JSON.parse(
              points[k].point.replace('{', '[').replace('}', ']'),
            );
            var p1X = p[0][0];
            var p1Y = p[0][1];
            var p2X = p[1][0];
            var p2Y = p[1][1];
            var p3X = p[2][0];
            var p3Y = p[2][1];
            var calP3Y = ((p3X - p2X) / (p1X - p2X)) * (p1Y - p2Y) + p2Y;
            if (Math.abs(p1X - p2X) < 0.001) {
              //垂直的直线
              if (Math.abs(p3X - p2X) < 0.001) {
                //三点在同一垂直线上
                calP3Y = p3Y;
              }
            }
            if (Math.abs(p3Y - calP3Y) < 0.001) {
              //三点在同一直线上
              for (var t = 0; t < 3; t++) {
                if (
                  (p[t][0] > 0.01 && p[t][0] < 0.99) ||
                  (p[t][1] > 0.01 && p[t][1] < 0.99)
                ) {
                  if (t == 0) {
                    popIndexArr.push(i);
                  } else if (t == 1) {
                    popIndexArr.push(j);
                  } else if (t == 2) {
                    popIndexArr.push(k);
                  }
                  break;
                }
              }
            }
          }
        }
      }
      if (popIndexArr.length > 0) {
        var newArr = [];
        for (var k = 0, klen = popIndexArr.length; k < klen; k++) {
          if (k == 0) {
            newArr.push(...points.slice(0, popIndexArr[k]));
          } else {
            newArr.push(
              ...points.slice(popIndexArr[k - 1] + 1, popIndexArr[k]),
            );
          }
        }
        // newArr = newArr.concat(points.slice(popIndexArr[popIndexArr.length-1]+1))
        newArr.push(...points.slice(popIndexArr[popIndexArr.length - 1] + 1));
        node._origin.points = newArr;
      }
    }
  }
}

function isSimpleBackground(node) {
  let that = this;
  let result = true;
  //删减多余的point节点，即三个点在同一直线上，中间不起作用的点
  that.updatePoints(node);
  //如果形状是矩形、圆形、直线以外的就不能css实现
  if (
    !(
      (node.shapeType == 'rectangle' &&
        node._origin.points &&
        node._origin.points.length == 4 &&
        (node._origin.points[0]._class == 'point' ||
          node._origin.points[0]._class == 'curvePoint')) ||
      ((node.shapeType == 'oval' ||
        node.name.toLowerCase().indexOf('oval') > -1) &&
        node.width == node.height &&
        (typeof node._origin.layers == 'undefined' ||
          (node._origin.layers && node._origin.layers.length < 2))) ||
      (node.width > 50 && node.height <= 2) ||
      node.shapeType == 'shapeGroup'
    )
  ) {
    result = false;
  }
  //如果图片则不能css实现
  if (result && node._origin._class == 'bitmap') {
    result = false;
  }
  //如果fill属性是linear/color/radical之外则不能css实现
  if (
    result &&
    node.styles.background &&
    !(
      node.styles.background.type == 'linear' ||
      node.styles.background.type == 'color' ||
      node.styles.background.type == 'radical'
    )
  ) {
    result = false;
  }
  if (
    result &&
    node.shapeType != 'shapeGroup' &&
    node.styles.background == null
  ) {
    result = false;
  }

  //如果该节点下有多个子节点组成，则不能css实现
  if (result && node._origin.layers && node._origin.layers.length > 1) {
    //如果子节点由矩形/圆形组成，颜色一样，相交，则认为是个背景
    let isOK = true;
    let fills = undefined;
    for (var i = 0, ilen = node._origin.layers.length; i < ilen; i++) {
      if (isOK == false) {
        break;
      }
      let item = node._origin.layers[i];
      if (item._class != 'rectangle' && item._class != 'oval') {
        isOK = false;
        break;
      }
      if (item.booleanOperation != 0) {
        //如果不是取组合图形，而是取相交/异或/xor等形状，则不认为是个简单的背景
        isOK = false;
        break;
      }
      if (fills == undefined && item.style && item.style.fills) {
        fills = item.style.fills;
      } else if (item.style && item.style.fills) {
        var itemFills = item.style.fills;
        if (!itemFills || fills.length != itemFills.length) {
          isOK = false;
          break;
        }
        for (var j = 0, jlen = fills.length; j < jlen; j++) {
          var colorA = fills[j]['color'];
          var colorB = itemFills[j]['color'];
          if (
            colorA &&
            colorB &&
            colorA._class == colorB._class &&
            colorA.alpha == colorB.alpha &&
            colorA.blue == colorB.blue &&
            colorA.green == colorB.green &&
            colorA.red == colorB.red
          ) {
          } else {
            isOK = false;
            break;
          }
        }
      }

      if (i > 0) {
        let intersectType = isIntersect(
          node._origin.layers[i],
          node._origin.layers[i - 1],
        );
        if (
          intersectType != INTERSECT_TYPE.INCLUDE &&
          intersectType != INTERSECT_TYPE.INTERSECT
        ) {
          isOK = false;
          break;
        }
      }
    }
    result = isOK;
  }

  //如果父节点有旋转等对整体进行处理的属性时，则认为该父节点下的节点需要合并，不能用css实现
  var parent = node.parent;
  if (result && parent && parent.styles && parent.styles.rotation != 0) {
    result = false;
  }

  return result;
}

module.exports = {
  getAbX,
  getAbY,
  getRect,
  getSize,
  swap,
  getAbXOps,
  getAbYOps,
  getColorRGB,
  getZIndex,
  getLevelArr,
  getHeight,
  isLine,
  // isInclude,
  isSimpleBackground,
  isRedPoint,
  isAvatar,
  findNodeByCond,
  isIntersect,
  INTERSECT_TYPE,
  isBubble,
  isImage,
  isOnlyBorder,
  isSymbolInstance,
  updatePoints,
};
