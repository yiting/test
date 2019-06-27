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
function isInclude(nodeA, nodeB) {
  var nodeAX = getAbX(nodeA);
  var nodeAXOps = getAbXOps(nodeA);
  var nodeAY = getAbY(nodeA);
  var nodeAYOps = getAbYOps(nodeA);
  var nodeBX = getAbX(nodeB);
  var nodeBXOps = getAbXOps(nodeB);
  var nodeBY = getAbY(nodeB);
  var nodeBYOps = getAbYOps(nodeB);
  var result = false;
  if (
    nodeAX <= nodeBX &&
    nodeAXOps >= nodeBXOps &&
    nodeAY <= nodeBY &&
    nodeAYOps >= nodeBYOps
  ) {
    result = true;
  }
  return result;
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
  if (node[type].indexOf(id1) > -1 && brother[type].indexOf(id2) > -1) {
    result = true;
  }
  if (node[type].indexOf(id2) > -1 && brother[type].indexOf(id1) > -1) {
    result = true;
  }
  return result;
}

function isLine(node) {
  //如果形状是矩形、圆形、直线以外的就不能css实现
  var result = false;
  if (node.width > 50 && node.height <= 2) {
    result = true;
  }
  if (node.width <= 2 && node.height >= 20) {
    result = true;
  }
  return result;
}

function isRedPoint(node) {
  var result = false;
  if (
    node.width >= 12 &&
    node.height >= 12 &&
    node.width <= 20 &&
    node.height <= 20 &&
    node.styles &&
    node.styles.borderRadius &&
    node.styles.borderRadius.filter(k => k == '50%').length ==
      node.styles.borderRadius.length &&
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
    node.styles.borderRadius.filter(k => k == '50%').length ==
      node.styles.borderRadius.length &&
    node.type == 'QImage'
  ) {
    result = true;
  }
  return result;
}

function isSimpleBackground(node) {
  let result = true;
  if (node.name.indexOf('Base') > -1) {
    console.log(1);
  }
  if (node.name.indexOf('椭圆形') > -1) {
    console.log(1);
  }
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
      (node.width > 50 && node.height <= 2)
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
  if (result && node.styles.background == null) {
    result = false;
  }

  //如果该节点下有多个子节点组成，则不能css实现
  if (result && node._origin.layers && node._origin.layers.length > 1) {
    result = false;
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
  isInclude,
  isSimpleBackground,
  isRedPoint,
  isAvatar,
  findNodeByCond,
};
