// 特征判断函数抽象
// 特征由一系列特征判断函数组成, 如: 元素性质特性, 元素组成关系, 元素方向关系, 元素距离关系, 元素位置关系, 元素颜色特征等
// 元素属性判断: propertyNodeXXX, 元素的属性特征
// 元素组成关系: composeWithXXX, 组件由什么元素组成
// 元素方向关系: directionXXXX, 组件元素方向的描述
// 元素距离关系: distanceXXX, 组件元素的距离描述
// 元素位置关系: positionXXX, 组件元素的位置关系
// 元素的主轴关系: baselineXXX, 组件元素在主轴上的排列关系
// 元素的尺寸关系: sizeXXXX, 组件元素在宽度,高度,面积,宽高比之类的特征

// 特征: 元素属性特征

/**
 * 节点是否为QText节点
 * @param {Node} 元素
 * @returns {Boolean}
 */
const propertyNodeIsQText = function(node: any) {
  if (!node || !node.type || node.type !== 'QText') {
    return false;
  }
  return true;
};

/**
 * 节点组是否全为QText
 * @param {Array} nodes 元素数组
 * @returns {Boolean}
 */
const propertyNodeAreQText = function(nodes: any) {
  const result = false;

  if (!nodes || !nodes.length) {
    return result;
  }

  return nodes.every((item: any) => propertyNodeIsQText(item));
};

/**
 * 节点是否为QImage节点
 * @param {Node} 元素
 * @returns {Boolean}
 */
const propertyNodeIsQImage = function(node: any) {
  if (!node || !node.type || node.type !== 'QImage') {
    return false;
  }
  return true;
};

/**
 * 节点组是否全为QImage
 * @param {Array} nodes 元素数组
 * @returns {Boolean}
 */
const propertyNodeAreQImage = function(nodes: any) {
  const result = false;

  if (!nodes || !nodes.length) {
    return result;
  }

  return nodes.every((item: any) => propertyNodeIsQImage(item));
};

/**
 * 节点是否为QIcon节点
 * @param {Node} 元素
 * @returns {Boolean}
 */
const propertyNodeIsQIcon = function(node: any) {
  if (!node || !node.type || node.type !== 'QIcon') {
    return false;
  }
  return true;
};

/**
 * 节点组是否全为QIcon
 * @param {Array} nodes 元素数组
 * @returns {Boolean}
 */
const propertyNodeAreQIcon = function(nodes: any) {
  const result = false;

  if (!nodes || !nodes.length) {
    return result;
  }

  // nodes.forEach((item: any) => {
  return nodes.every((item: any) => propertyNodeIsQIcon(item));
};

/**
 * 节点是否为QShape节点
 * @param {Node} 元素
 * @returns {Boolean}
 */
const propertyNodeIsQShape = function(node: any) {
  if (!node || !node.type || node.type !== 'QShape') {
    return false;
  }
  return true;
};

/**
 * 节点组是否全为QIcon
 * @param {Array} nodes 元素数组
 * @returns {Boolean}
 */
const propertyNodeAreQShape = function(nodes: any) {
  const result = false;

  if (!nodes || !nodes.length) {
    return result;
  }
  return nodes.every((item: any) => propertyNodeIsQShape(item));
};

// 特征: 元素组成关系

/**
 * 传进的节点数组是否由若干QText组成
 * @param {Array} nodes 元素数组
 * @param {Int} num 数量
 * @returns {Boolean}
 */
const composeWithQText = function(nodes: any, num: number) {
  if (!nodes || !nodes.length) {
    return false;
  }

  let matchNode = 0;
  nodes.forEach((item: any) => {
    if (propertyNodeIsQText(item)) {
      matchNode += 1;
    }
  });
  return matchNode === num;
};

/**
 * 传进的节点数组是否由若干QIcon组成
 * @param {Array} nodes 元素数组
 * @param {Int} num 数量
 * @returns {Boolean}
 */
const composeWithQIcon = function(nodes: any, num: number) {
  if (!nodes || !nodes.length) {
    return false;
  }

  let matchNode = 0;
  nodes.forEach((item: any) => {
    if (propertyNodeIsQIcon(item)) {
      matchNode += 1;
    }
  });
  return matchNode === num;
};

/**
 * 传进的节点数组是否由若干QImage组成
 * @param {Array} nodes 元素数组
 * @param {Int} num 数量
 * @returns {Boolean}
 */
const composeWithQImage = function(nodes: any, num: number) {
  if (!nodes || !nodes.length) {
    return false;
  }

  let matchNode = 0;
  nodes.forEach((item: any) => {
    if (propertyNodeIsQImage(item)) {
      matchNode += 1;
    }
  });
  return matchNode === num;
};

/**
 * 传进的节点数组是否由若干QShape组成
 * @param {Array} nodes 元素数组
 * @param {Int} num 数量
 * @returns {Boolean}
 */
const composeWithQShape = function(nodes: any, num: number) {
  if (!nodes || !nodes.length) {
    return false;
  }

  let matchNode = 0;
  nodes.forEach((item: any) => {
    if (propertyNodeIsQShape(item)) {
      matchNode += 1;
    }
  });
  return matchNode === num;
};

// 特征: 元素方向关系

/**
 * A位于B的左边
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 */
const directionAleftToB = function(eleA: any, eleB: any) {
  // 通过中心点判断
  const pA = eleA.abX + eleA.width / 2;
  const pB = eleB.abX + eleB.width / 2;
  return pA <= pB;
};

/**
 * 元素组A的所有元素位于元素组B的左边
 * @param {Array} groupA 元素组A
 * @param {Array} groupB 元素组B
 * @returns {Boolean}
 */
const directionGroupAleftToGroupB = function(groupA: any, groupB: any) {
  let result = true;
  for (let i = 0; i < groupA.length; i++) {
    for (let j = 0; j < groupB.length; j++) {
      if (!directionAleftToB(groupA[i], groupB[j])) {
        result = false;
        break;
      }
    }
  }
  return result;
};

/**
 * A位于B的右边
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 */
const directionArightToB = function(eleA: any, eleB: any) {
  // 通过中心点判断
  const pA = eleA.abX + eleA.width / 2;
  const pB = eleB.abX + eleB.width / 2;
  return !(pA <= pB);
};

/**
 * A位于B的上边
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 */
const directionAtopToB = function(eleA: any, eleB: any) {
  // 通过中心点判断
  const pA = eleA.abY + eleA.height / 2;
  const pB = eleB.abY + eleB.height / 2;
  return pA <= pB;
};

/**
 * A位于B的下边
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 */
const directionAbottomToB = function(eleA: any, eleB: any) {
  // 通过中心点判断
  const pA = eleA.abY + eleA.height / 2;
  const pB = eleB.abY + eleB.height / 2;
  return !(pA <= pB);
};

// 特征: 元素的距离关系

/**
 * A的右边距距离B的左边距少于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
const distanceLessArightToBleft = function(
  eleA: any,
  eleB: any,
  distance: any,
) {
  // 这里需要比较两个边的距离
  const pA = eleA.abX + eleA.width; // A的右边距
  const pB = eleB.abX; // B的左边距
  return pB - pA <= distance;
};

/**
 * A的下边距距离B的上边距少于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
const distanceLessAbottomToBtop = function(
  eleA: any,
  eleB: any,
  distance: any,
) {
  const pA = eleA.abY + eleA.height; // A的下边距
  const pB = eleB.abY; // B的上边距
  return pB - pA <= distance;
};

/**
 * A的左边距离B的右边距少于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
const distanceLessAleftToBright = function(
  eleA: any,
  eleB: any,
  distance: any,
) {
  const pA = eleA.abX; // A的左边距
  const pB = eleB.abX + eleB.width; // B的右边距
  return pA - pB <= distance;
};

/**
 * A的上边距离B的下边距少于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
const distanceLessAtopToBbottom = function(
  eleA: any,
  eleB: any,
  distance: any,
) {
  const pA = eleA.abY; // A的上边距
  const pB = eleB.abY + eleB.height; // B的下边距
  return pA - pB <= distance;
};

/**
 * A的右边距距离B的左边距大于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
const distanceGreatArightToBLeft = function(
  eleA: any,
  eleB: any,
  distance: any,
) {
  return !distanceLessArightToBleft(eleA, eleB, distance);
};

/**
 * A的下边距距离B的上边距大于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
const distanceGreatAbottomToBtop = function(
  eleA: any,
  eleB: any,
  distance: any,
) {
  return !distanceLessAbottomToBtop(eleA, eleB, distance);
};

/**
 * A的左边距离B的右边距大于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
const distanceGreatAleftToBright = function(
  eleA: any,
  eleB: any,
  distance: any,
) {
  return !distanceLessAleftToBright(eleA, eleB, distance);
};

/**
 * A的上边距离B的下边距大于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
const distanceGreatAtopToBbottom = function(
  eleA: any,
  eleB: any,
  distance: any,
) {
  return !distanceLessAtopToBbottom(eleA, eleB, distance);
};

/**
 * AB元素的垂直间距小于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
const distanceABLessInVertical = function(eleA: any, eleB: any, distance: any) {
  // 等于A的bottom到B的top小于distance或者A的top到B的bottom小于diatance
  return (
    distanceLessAbottomToBtop(eleA, eleB, distance) ||
    distanceLessAtopToBbottom(eleA, eleB, distance)
  );
};

/**
 * AB元素的垂直间距大于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
const distanceABGreatInVertical = function(
  eleA: any,
  eleB: any,
  distance: any,
) {
  return !distanceABLessInVertical(eleA, eleB, distance);
};

/**
 * AB元素的水平间距小于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
const distanceABLessInHorizontal = function(
  eleA: any,
  eleB: any,
  distance: any,
) {
  // 等于A的right到B的left小于distance或者A的left到B的right小于distance
  return (
    distanceLessArightToBleft(eleA, eleB, distance) ||
    distanceLessAleftToBright(eleA, eleB, distance)
  );
};

/**
 * AB元素的水平间距大于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
const distanceABGreatInHorizontal = function(
  eleA: any,
  eleB: any,
  distance: any,
) {
  // 等于A的right到B的left大于distance或者A的left到B的right大于distance
  return (
    distanceGreatArightToBLeft(eleA, eleB, distance) ||
    distanceGreatAleftToBright(eleA, eleB, distance)
  );
};

/**
 * 元素组A的右边距离元素组B的左边(左到右方向)的距离小于某值
 * @param groupA 元素组A
 * @param groupB 元素组B
 */
const distanceLessGroupABInHorizontal = function(
  groupA: any,
  groupB: any,
  distance: any,
) {
  // 通过计算groupA里的最大x坐标与groupB里的最小x坐标的距离
  let pAmax = 0;
  let pBmin = 0;

  groupA.forEach((item: any, index: any) => {
    if (index === 0) {
      pAmax = item.abX + item.width;
    } else {
      pAmax = item.abX + item.width > pAmax ? item.abX + item.width : pAmax;
    }
  });

  groupB.forEach((item: any, index: any) => {
    if (index === 0) {
      pBmin = item.abX;
    } else {
      pBmin = item.abX < pBmin ? item.abX : pBmin;
    }
  });

  return pBmin - pAmax < distance;
};

/**
 * 元素组A的右边距离元素组B的左边(左到右方向)的距离大于某值
 * @param groupA 元素组A
 * @param groupB 元素组B
 */
const distanceGreatGroupABInHorizontal = function(
  groupA: any,
  groupB: any,
  distance: any,
) {
  return !distanceLessGroupABInHorizontal(groupA, groupB, distance);
};

// 特征: 元素的位置关系

/**
 * 元素A位于元素B内
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @returns {Boolean}
 */
const positionAInB = function(eleA: any, eleB: any) {
  const xA = eleA.abX;
  const yA = eleA.abY;
  const wA = eleA.width;
  const hA = eleA.height;

  const xB = eleB.abX;
  const yB = eleB.abY;
  const wB = eleB.width;
  const hB = eleB.height;

  return xA > xB && yA > yB && xA + wA < xB + wB && yA + hA < yB + hB;
};

/**
 * 元素A位于元素B内的中间
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @returns {Boolean}
 */
const positionAInBCenter = function(eleA: any, eleB: any) {
  if (!positionAInB(eleA, eleB)) {
    return false;
  }

  // 居中的偏差值在10px, !important
  const deta = 10;
  const xA = eleA.abX;
  const yA = eleA.abY;
  const wA = eleA.width;
  const hA = eleA.height;

  const xB = eleB.abX;
  const yB = eleB.abY;
  const wB = eleB.width;
  const hB = eleB.height;

  const centerXA = (xA + wA) / 2;
  const centerYA = (yA + hA) / 2;
  const centerXB = (xB + wB) / 2;
  const centerYB = (yB + hB) / 2;

  return (
    Math.abs(centerXA - centerXB) <= deta ||
    Math.abs(centerYA - centerYB) <= deta
  );
};

// 特征: 元素的主轴关系

/**
 * AB元素在水平位置投影相交
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 */
const baselineABInHorizontal = function(eleA: any, eleB: any) {
  const yA = eleA.abY;
  const hA = eleA.height;
  const yB = eleB.abY;
  const hB = eleB.height;

  return yA + hA > yB && yB + hB > yA;
};

/**
 * AB元素在水平位置投影不相交
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 */
const baselineABNotInHorizontal = function(eleA: any, eleB: any) {
  return !baselineABInHorizontal(eleA, eleB);
};
/**
 * 元素组A的所有元素在水平位置投影相交
 * @param groupA 元素组A
 * @returns {Boolean}
 */
const baselineGroupAInHorizontal = function(groupA: any) {
  // 元素组内元素彼此在水平位置相交
  let result = true;

  if (groupA.length < 2) {
    return false;
  }

  for (let i = 0; i < groupA.length - 1; i++) {
    for (let j = i + 1; j < groupA.length; j++) {
      if (baselineABNotInHorizontal(groupA[i], groupA[j])) {
        result = false;
        break;
      }
    }
  }

  return result;
};

/**
 * 元素组A与元素组B在水平位置投影相交
 * @param groupA 元素组A
 * @param groupB 元素组B
 */
const baselineGroupABInHorizontal = function(groupA: any, groupB: any) {
  // 分别计算组A,B的水平投影, 然后是否相交
  let pAmin = 0;
  let pAmax = 0;
  let pBmin = 0;
  let pBmax = 0;

  groupA.forEach((item: any, index: any) => {
    if (index === 0) {
      pAmin = item.abY;
      pAmax = item.abY + item.height;
    } else {
      pAmin = item.abY < pAmin ? item.abY : pAmin;
      pAmax = item.abY + item.height > pAmax ? item.abY + item.height : pAmax;
    }
  });

  groupB.forEach((item: any, index: any) => {
    if (index === 0) {
      pBmin = item.abY;
      pBmax = item.abY + item.height;
    } else {
      pBmin = item.abY < pBmin ? item.abY : pBmin;
      pBmax = item.abY + item.height > pBmax ? item.abY + item.height : pBmax;
    }
  });

  return pAmax > pBmin && pBmax > pAmin;
};

/**
 * 元素组A组成的水平投影包含了元素B
 * @param groupA 元素组A
 * @param eleB 元素B
 */
const baselineGroupAcontainBInHorizontal = function(groupA: any, eleB: any) {
  // console.log('containB begin: ---------------------------');
  let pAmin = 0;
  let pAmax = 0;

  groupA.forEach((item: any, index: any) => {
    if (index === 0) {
      pAmin = item.abY;
      pAmax = item.abY + item.height;
    } else {
      pAmin = item.abY < pAmin ? item.abY : pAmin;
      pAmax = item.abY + item.height > pAmax ? item.abY + item.height : pAmax;
    }
  });

  // console.log('组的pAmin: ' + pAmin);
  // console.log('组的pAmax: ' + pAmax);
  // console.log('元素的pBmin: ' + eleB.abY);
  // console.log('元素的pBmax: ' + (eleB.abY + eleB.height));
  return pAmin <= eleB.abY && pAmax >= eleB.abY + eleB.height;
};

/**
 * AB元素在垂直位置投影相交
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 */
const baselineABInVertical = function(eleA: any, eleB: any) {
  const xA = eleA.abX;
  const wA = eleA.width;
  const xB = eleB.abX;
  const wB = eleB.width;

  return xA + wA > xB && xB + wB > xA;
};

/**
 * AB元素在垂直位置投影不相交
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 */
const baselineABNotInVertical = function(eleA: any, eleB: any) {
  return !baselineABInVertical(eleA, eleB);
};
/**
 * 元素组A的所有元素在垂直位置投影相交
 * @param groupA 元素组A
 * @returns {Boolean}
 */
const baselineGroupAInVertical = function(groupA: any) {
  // 元素组内元素彼此在垂直位置相交
  let result = true;

  if (groupA.length < 2) {
    return false;
  }

  for (let i = 0; i < groupA.length - 1; i++) {
    for (let j = i + 1; j < groupA.length; j++) {
      if (baselineABNotInVertical(groupA[i], groupA[j])) {
        result = false;
        break;
      }
    }
  }

  return result;
};

/**
 * AB元素左侧间距
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Number} distance 左对齐间距
 */
const baselineABJustifyLeft = function(eleA: any, eleB: any, distance: any) {
  return Math.abs(eleA.abX - eleB.abX) < distance;
};
/**
 * AB元素水平方向中心间距
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Number} distance 中间对齐间距
 */
const baselineABJustifyCenter = function(eleA: any, eleB: any, distance: any) {
  return (
    Math.abs(eleA.abX + eleA.width / 2 - eleB.abX - eleB.width / 2) < distance
  );
};

// 特征: 元素的尺寸关系

/**
 * 元素A与元素B在宽度比例上小于某数值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Float} ratio 比例
 * @return {Boolean}
 */
const sizeWidthRatioALessB = function(eleA: any, eleB: any, ratio: any) {
  if (eleA.width === 0 || eleB.width === 0) {
    return false;
  }

  const wA = eleA.width;
  const wB = eleB.width;
  const tmp = wA / wB;

  return tmp < ratio;
};

/**
 * 元素A与元素B在宽度比例上大于某数值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Float} ratio 比例
 * @returns {Boolean}
 */
const sizeWidthRatioAGreatB = function(eleA: any, eleB: any, ratio: any) {
  return !sizeWidthRatioALessB(eleA, eleB, ratio);
};

/**
 * 元素A与元素B在高度比例上小于某数值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Float} ratio 比例
 * @returns {Boolean}
 */
const sizeHeightRatioALessB = function(eleA: any, eleB: any, ratio: any) {
  if (eleA.height === 0 || eleB.height === 0) {
    return false;
  }

  const hA = eleA.height;
  const hB = eleB.height;
  const tmp = hA / hB;

  return tmp < ratio;
};

/**
 * 元素A与元素B在高度比例上大于某数值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Float} ratio 比例
 * @returns {Boolean}
 */
const sizeHeightRatioAGreatB = function(eleA: any, eleB: any, ratio: any) {
  return !sizeHeightRatioALessB(eleA, eleB, ratio);
};

/**
 * 元素A的高度小于某数值
 * @param {Node} eleA 节点元素
 * @param {Int} num 数值
 */
const sizeHeightLess = function(eleA: any, num: any) {
  return eleA.height <= num;
};

/**
 * 元素A的高度大于某数值
 * @param {Node} eleA 节点元素
 * @param {Int} num 数值
 */
const sizeHeightGreat = function(eleA: any, num: any) {
  return !sizeHeightLess(eleA, num);
};

/**
 * 元素A的宽度小于某数值
 * @param {Node} eleA 节点元素
 * @param {Int} num 数值
 */
const sizeWidthLess = function(eleA: any, num: any) {
  return eleA.width <= num;
};

/**
 * 元素A的宽度高于某数值
 * @param {Node} eleA 节点元素
 * @param {Int} num 数值
 */
const sizeWidthGreat = function(eleA: any, num: any) {
  return !sizeWidthLess(eleA, num);
};
/**
 * 判断元素字号范围
 * @param {Node} eleA 节点元素
 * @param {Int} min 最小字号
 * @param {Int} max 最大字号
 */
const fontSizeLimit = function(eleA: any, min: any, max: any) {
  const size = Math.max(...eleA.styles.texts.map((s: any) => s.size));
  return size >= min && size <= max;
};
/**
 * 判断元素行数范围
 * @param {Node} eleA 节点元素
 * @param {Int} min 最小行数
 * @param {Int} max 最大行数
 */
const fontLineLimit = function(eleA: any, min: any, max: any) {
  const lines = Math.round(eleA.height / eleA.lineHeight);
  return lines >= min && lines <= max;
};

export default {
  // 元素属性判断
  propertyNodeIsQText,
  propertyNodeAreQText,
  propertyNodeIsQIcon,
  propertyNodeAreQIcon,
  propertyNodeIsQImage,
  propertyNodeAreQImage,
  propertyNodeIsQShape,
  propertyNodeAreQShape,
  // 字符值判断
  fontLineLimit,
  fontSizeLimit,
  // 元素组成关系
  composeWithQText,
  composeWithQIcon,
  composeWithQImage,
  composeWithQShape,
  // 元素方向关系
  directionAleftToB,
  directionGroupAleftToGroupB,
  directionArightToB,
  directionAtopToB,
  directionAbottomToB,
  // 元素距离关系
  distanceLessArightToBleft,
  distanceLessAbottomToBtop,
  distanceLessAleftToBright,
  distanceLessAtopToBbottom,
  distanceGreatArightToBLeft,
  distanceGreatAbottomToBtop,
  distanceGreatAleftToBright,
  distanceGreatAtopToBbottom,
  distanceABLessInVertical,
  distanceABGreatInVertical,
  distanceABLessInHorizontal,
  distanceABGreatInHorizontal,
  distanceLessGroupABInHorizontal,
  distanceGreatGroupABInHorizontal,
  // 元素位置关系
  positionAInB,
  positionAInBCenter,
  // 元素的主轴关系
  baselineABInHorizontal,
  baselineGroupAInHorizontal,
  baselineGroupABInHorizontal,
  baselineGroupAcontainBInHorizontal,
  baselineABNotInHorizontal,
  baselineABInVertical,
  baselineGroupAInVertical,
  baselineABNotInVertical,
  // 对齐关系
  baselineABJustifyLeft,
  baselineABJustifyCenter,

  // 元素的尺寸关系
  sizeWidthRatioALessB,
  sizeWidthRatioAGreatB,
  sizeHeightRatioALessB,
  sizeHeightRatioAGreatB,
  sizeHeightLess,
  sizeHeightGreat,
  sizeWidthLess,
  sizeWidthGreat,
};
