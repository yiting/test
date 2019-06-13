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
};
