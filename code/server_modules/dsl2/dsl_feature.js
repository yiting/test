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
// ---------------------------------------------------------------------------------------------------------

/**
 * 节点是否为QText节点
 * @param {Node} 元素
 * @returns {Boolean}
 */
let propertyNodeIsQText = function(node) {
    if (!node || !node.type || node.type != 'QText') {
        return false;
    }
    else {
        return true;
    }
}

/**
 * 节点组是否全为QText
 * @param {Array} nodes 元素数组
 * @returns {Boolean}
 */
let propertyNodeAreQText = function(nodes) {
    let result = false;

    if (!nodes || !nodes.length) {
        return result;
    }

    nodes.forEach(item => {
        result = propertyNodeIsQText(item);

        if (!result) {
            return result;
        }
    });
    return result;
}

/**
 * 节点是否为QImage节点
 * @param {Node} 元素
 * @returns {Boolean}
 */
let propertyNodeIsQImage = function(node) {
    if (!node || !node.type || node.type != 'QImage') {
        return false;
    }
    else {
        return true;
    }
}

/**
 * 节点组是否全为QImage
 * @param {Array} nodes 元素数组
 * @returns {Boolean}
 */
let propertyNodeAreQImage = function(nodes) {
    let result = false;

    if (!nodes || !nodes.length) {
        return result;
    }

    nodes.forEach(item => {
        result = propertyNodeIsQImage(item);

        if (!result) {
            return result;
        }
    });
    return result;
}

/**
 * 节点是否为QIcon节点
 * @param {Node} 元素
 * @returns {Boolean}
 */
let propertyNodeIsQIcon = function(node) {
    if (!node || !node.type || node.type != 'QIcon') {
        return false;
    }
    else {
        return true;
    }
}

/**
 * 节点组是否全为QIcon
 * @param {Array} nodes 元素数组
 * @returns {Boolean}
 */
let propertyNodeAreQIcon = function(nodes) {
    let result = false;

    if (!nodes || !nodes.length) {
        return result;
    }

    nodes.forEach(item => {
        result = propertyNodeIsQIcon(item);

        if (!result) {
            return result;
        }
    });
    return result;
}

/**
 * 节点是否为QShape节点
 * @param {Node} 元素
 * @returns {Boolean}
 */
let propertyNodeIsQShape = function(node) {
    if (!node || !node.type || node.type != 'QShape') {
        return false;
    }
    else {
        return true;
    }
}

/**
 * 节点组是否全为QIcon
 * @param {Array} nodes 元素数组
 * @returns {Boolean}
 */
let propertyNodeAreQShape = function(nodes) {
    let result = false;

    if (!nodes || !nodes.length) {
        return result;
    }

    nodes.forEach(item => {
        result = propertyNodeIsQShape(item);

        if (!result) {
            return result;
        }
    });
    return result;
}

// 特征: 元素组成关系
// ---------------------------------------------------------------------------------------------------------

/**
 * 传进的节点数组是否由若干QText组成
 * @param {Array} nodes 元素数组
 * @param {Int} num 数量
 * @returns {Boolean}
 */
let composeWithQText = function(nodes, num) {
    if (!nodes || !nodes.length) {
        return false;
    }

    let matchNode = 0;
    nodes.forEach(item => {
        if (propertyNodeIsQText(item)) {
            matchNode++;
        }
    });
    return matchNode == num;
}

/**
 * 传进的节点数组是否由若干QIcon组成
 * @param {Array} nodes 元素数组
 * @param {Int} num 数量
 * @returns {Boolean}
 */
let composeWithQIcon = function(nodes, num) {
    if (!nodes || !nodes.length) {
        return false;
    }

    let matchNode = 0;
    nodes.forEach(item => {
        if (propertyNodeIsQIcon(item)) {
            matchNode++;
        }
    });
    return matchNode == num;
}

/**
 * 传进的节点数组是否由若干QImage组成
 * @param {Array} nodes 元素数组
 * @param {Int} num 数量
 * @returns {Boolean}
 */
let composeWithQImage = function(nodes, num) {
    if (!nodes || !nodes.length) {
        return false;
    }

    let matchNode = 0;
    nodes.forEach(item => {
        if (propertyNodeIsQImage(item)) {
            matchNode++;
        }
    });
    return matchNode == num;
}

/**
 * 传进的节点数组是否由若干QShape组成
 * @param {Array} nodes 元素数组
 * @param {Int} num 数量
 * @returns {Boolean}
 */
let composeWithQShape = function(nodes, num) {
    if (!nodes || !nodes.length) {
        return false;
    }

    let matchNode = 0;
    nodes.forEach(item => {
        if (propertyNodeIsQShape(item)) {
            matchNode++;
        }
    });
    return matchNode == num;
}

// 特征: 元素方向关系
// ---------------------------------------------------------------------------------------------------------

/**
 * A位于B的左边
 * @param {Node} eleA 元素A 
 * @param {Node} eleB 元素B
 */
let directionAleftToB = function(eleA, eleB) {
    // 通过中心点判断
    let pA = eleA.abX + (eleA.width / 2);
    let pB = eleB.abX + (eleB.width / 2);
    return pA <= pB? true : false;
}

/**
 * 元素组A的所有元素位于元素组B的左边
 * @param {Array} groupA 元素组A
 * @param {Array} groupB 元素组B
 * @returns {Boolean}
 */
let directionGroupAleftToGroupB = function(groupA, groupB) {
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
}

/**
 * A位于B的右边
 * @param {Node} eleA 元素A 
 * @param {Node} eleB 元素B
 */
let directionArightToB = function(eleA, eleB) {
    // 通过中心点判断
    let pA = eleA.abX + (eleA.width / 2);
    let pB = eleB.abX + (eleB.width / 2);
    return pA <= pB? false : true;
}

/**
 * A位于B的上边
 * @param {Node} eleA 元素A 
 * @param {Node} eleB 元素B
 */
let directionAtopToB = function(eleA, eleB) {
    // 通过中心点判断
    let pA = eleA.abY + (eleA.height / 2);
    let pB = eleB.abY + (eleB.height / 2);
    return pA <= pB? true : false;
}

/**
 * A位于B的下边
 * @param {Node} eleA 元素A 
 * @param {Node} eleB 元素B
 */
let directionAbottomToB = function(eleA, eleB) {
    // 通过中心点判断
    let pA = eleA.abY + (eleA.height / 2);
    let pB = eleB.abY + (eleB.height / 2);
    return pA <= pB? false : true;
}

// 特征: 元素的距离关系
// ---------------------------------------------------------------------------------------------------------

/**
 * A的右边距距离B的左边距少于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离 
 */
let distanceLessArightToBleft = function(eleA, eleB, distance) {
    // 这里需要比较两个边的距离
    let pA = eleA.abX + eleA.width;     // A的右边距
    let pB = eleB.abX;                  // B的左边距
    return pB - pA <= distance? true : false;
}

/**
 * A的下边距距离B的上边距少于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离 
 */
let distanceLessAbottomToBtop = function(eleA, eleB, distance) {
    let pA = eleA.abY + eleA.height;     // A的下边距
    let pB = eleB.abY;                   // B的上边距
    return pB - pA <= distance? true : false;
}

/**
 * A的左边距离B的右边距少于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离 
 */
let distanceLessAleftToBright = function(eleA, eleB, distance) {
    let pA = eleA.abX;                   // A的左边距
    let pB = eleB.abX + eleB.width;      // B的右边距
    return pA - pB <= distance? true : false;
}

/**
 * A的上边距离B的下边距少于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离 
 */
let distanceLessAtopToBbottom = function(eleA, eleB, distance) {
    let pA = eleA.abY;                   // A的上边距
    let pB = eleB.abY + eleB.height;     // B的下边距
    return pA - pB <= distance? true : false;
}

/**
 * A的右边距距离B的左边距大于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离 
 */
let distanceGreatArightToBleft = function(eleA, eleB, distance) {
    return !distanceLessArightToBleft(eleA, eleB, distance);
}

/**
 * A的下边距距离B的上边距大于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离 
 */
let distanceGreatAbottomToBtop = function(eleA, eleB, distance) {
    return !distanceLessAbottomToBtop(eleA, eleB, distance);
}

/**
 * A的左边距离B的右边距大于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离 
 */
let distanceGreatAleftToBright = function(eleA, eleB, distance) {
    return !distanceLessAleftToBright(eleA, eleB, distance);
}

/**
 * A的上边距离B的下边距大于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离 
 */
let distanceGreatAtopToBbottom = function(eleA, eleB, distance) {
    return !distanceLessAtopToBbottom(eleA, eleB, distance);
}

/**
 * AB元素的垂直间距小于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
let distanceABLessInVertical = function(eleA, eleB, distance) {
    // 等于A的bottom到B的top小于distance或者A的top到B的bottom小于diatance
    return distanceLessAbottomToBtop(eleA, eleB, distance) || distanceLessAtopToBbottom(eleA, eleB, distance);
}

/**
 * AB元素的垂直间距大于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
let distanceABGreatInVertical = function(eleA, eleB, distance) {
    return !distanceABLessInVertical(eleA, eleB, distance);
}

/**
 * AB元素的水平间距小于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
let distanceABLessInHorizontal = function(eleA, eleB, distance) {
    // 等于A的right到B的left小于distance或者A的left到B的right小于distance
    return distanceLessArightToBleft(eleA, eleB, distance) || distanceLessAleftToBright(eleA, eleB, distance);
}

/**
 * AB元素的水平间距大于某值
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @param {Int} distance 距离
 */
let distanceABGreatInHorizontal = function(eleA, eleB, distance) {
    // 等于A的right到B的left大于distance或者A的left到B的right大于distance
    return distanceGreatArightToBLeft(eleA, eleB, distance) || distanceGreatAleftToBright(eleA, eleB, distance);
}

/**
 * 元素组A的右边距离元素组B的左边(左到右方向)的距离小于某值
 * @param groupA 元素组A
 * @param groupB 元素组B
 */
let distanceLessGroupABInHorizontal = function(groupA, groupB, distance) {
    // 通过计算groupA里的最大x坐标与groupB里的最小x坐标的距离
    let pAmax = 0;
    let pBmin = 0;

    groupA.forEach((item, index) => {
        if (index == 0) {
            pAmax = item.abX + item.width;
        }
        else {
            pAmax = (item.abX + item.width) > pAmax? (item.abX + item.width) : pAmax;
        }
    });

    groupB.forEach((item, index) => {
        if (index == 0) {
            pBmin = item.abX;
        }
        else {
            pBmin = item.abX < pBmin? item.abX : pBmin;
        }
    });

    return pBmin - pAmax < distance? true : false;
}

/**
 * 元素组A的右边距离元素组B的左边(左到右方向)的距离大于某值
 * @param groupA 元素组A
 * @param groupB 元素组B
 */
let distanceGreatGroupABInHorizontal = function(groupA, groupB, distance) {
    return !distanceLessGroupABInHorizontal(groupA, groupB, distance);
}

// 特征: 元素的位置关系
// ---------------------------------------------------------------------------------------------------------

/**
 * 元素A位于元素B内
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @returns {Boolean}
 */
let positionAInB = function(eleA, eleB) {
    let xA = eleA.abX;
    let yA = eleA.abY;
    let wA = eleA.width;
    let hA = eleA.height;
    
    let xB = eleB.abX;
    let yB = eleB.abY;
    let wB = eleB.width;
    let hB = eleB.height;
    
    return (xA > xB) && (yA > yB) && ((xA + wA) < (xB + wB)) && ((yA + hA) < (yB + hB));
}

/**
 * 元素A位于元素B内的中间
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 * @returns {Boolean}
 */
let positionAInBCenter = function(eleA, eleB) {
    if (!positionAInB(eleA, eleB)) {
        return false;
    }

    // 居中的偏差值在10px, !important
    const deta = 10;
    let xA = eleA.abX;
    let yA = eleA.abY;
    let wA = eleA.width;
    let hA = eleA.height;
    
    let xB = eleB.abX;
    let yB = eleB.abY;
    let wB = eleB.width;
    let hB = eleB.height;

    let centerXA = (xA + wA) / 2;
    let centerYA = (yA + hA) / 2;
    let centerXB = (xB + wB) / 2;
    let centerYB = (yB + hB) / 2;

    return Math.abs(centerXA - centerXB) <= deta || Math.abs(centerYA - centerYB) <= deta;
}


// 特征: 元素的主轴关系
// ---------------------------------------------------------------------------------------------------------

/**
 * AB元素在水平位置投影相交
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 */
let baselineABInHorizontal = function(eleA, eleB) {
    let yA = eleA.abY;
    let hA = eleA.height;
    let yB = eleB.abY;
    let hB = eleB.height;

    return ((yA + hA) > yB) && ((yB + hB) > yA);
}

/**
 * 元素组A的所有元素在水平位置投影相交
 * @param groupA 元素组A
 * @returns {Boolean}
 */
let baselineGroupAInHorizontal = function(groupA) {
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
}

/**
 * 元素组A与元素组B在水平位置投影相交
 * @param groupA 元素组A
 * @param groupB 元素组B
 */
let baselineGroupABInHorizontal = function(groupA, groupB) {
    // 分别计算组A,B的水平投影, 然后是否相交
    let pAmin = 0;                           
    let pAmax = 0;
    let pBmin = 0;
    let pBmax = 0;   
    
    groupA.forEach((item, index) => {
        if (index == 0) {
            pAmin = item.abY;
            pAmax = item.abY + item.height;
        }
        else {
            pAmin = item.abY < pAmin? item.abY : pAmin;
            pAmax = (item.abY + item.height) > pAmax? (item.abY + item.height) : pAmax;
        }
    });

    groupB.forEach((item, index) => {
        if (index == 0) {
            pBmin = item.abY;
            pBmax = item.abY + item.height;
        }
        else {
            pBmin = item.abY < pBmin? item.abY : pBmin;
            pBmax = (item.abY + item.height) > pBmax? (item.abY + item.height) : pBmax;
        }
    });

    return pAmax > pBmin && pBmax > pAmin;
}

/**
 * 元素组A组成的水平投影包含了元素B
 * @param groupA 元素组A
 * @param eleB 元素B
 */
let baselineGroupAcontainBInHorizontal = function(groupA, eleB) {
    // console.log('containB begin: ---------------------------');
    let pAmin = 0;                           
    let pAmax = 0;

    groupA.forEach((item, index) => {
        if (index == 0) {
            pAmin = item.abY;
            pAmax = item.abY + item.height;
        }
        else {
            pAmin = item.abY < pAmin? item.abY : pAmin;
            pAmax = (item.abY + item.height) > pAmax? (item.abY + item.height) : pAmax;
        }
    });

    // console.log('组的pAmin: ' + pAmin);
    // console.log('组的pAmax: ' + pAmax);
    // console.log('元素的pBmin: ' + eleB.abY);
    // console.log('元素的pBmax: ' + (eleB.abY + eleB.height));
    return pAmin <= eleB.abY && pAmax >= (eleB.abY + eleB.height);
}

/**
 * AB元素在水平位置投影不相交
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 */
let baselineABNotInHorizontal = function(eleA, eleB) {
    return !baselineABInHorizontal(eleA, eleB);
}

/**
 * AB元素在垂直位置投影相交
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 */
let baselineABInVertical = function(eleA, eleB) {
    let xA = eleA.abX;
    let wA = eleA.width;
    let xB = eleB.abX;
    let wB = eleB.width;

    return ((xA + wA) > xB) && ((xB + wB) > xA);
}

/**
 * 元素组A的所有元素在垂直位置投影相交
 * @param groupA 元素组A
 * @returns {Boolean}
 */
let baselineGroupAInVertical = function(groupA) {
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
}

/**
 * AB元素在垂直位置投影不相交
 * @param {Node} eleA 元素A
 * @param {Node} eleB 元素B
 */
let baselineABNotInVertical = function(eleA, eleB) {
    return !baselineABInVertical(eleA, eleB);
}


// 特征: 元素的尺寸关系
// ---------------------------------------------------------------------------------------------------------

/**
 * 元素A与元素B在宽度比例上小于某数值
 * @param {Node} eleA 元素A 
 * @param {Node} eleB 元素B
 * @param {Float} ratio 比例
 * @return {Boolean}
 */
let sizeWidthRatioALessB = function(eleA, eleB, ratio) {
    if (eleA.width == 0 || eleB.width == 0) {
        return false;
    }

    let wA = eleA.width;
    let wB = eleB.width;
    let tmp = wA / wB;

    return tmp < ratio? true : false;
}

/**
 * 元素A与元素B在宽度比例上大于某数值
 * @param {Node} eleA 元素A 
 * @param {Node} eleB 元素B 
 * @param {Float} ratio 比例
 * @returns {Boolean} 
 */
let sizeWidthRatioAGreatB = function(eleA, eleB, ratio) {
    return !sizeWidthRatioALessB(eleA, eleB, ratio);
}

/**
 * 元素A与元素B在高度比例上小于某数值
 * @param {Node} eleA 元素A 
 * @param {Node} eleB 元素B 
 * @param {Float} ratio 比例
 * @returns {Boolean} 
 */
let sizeHeightRatioALessB = function(eleA, eleB, ratio) {
    if (eleA.height == 0 || eleB.height == 0) {
        return false;
    }

    let hA = eleA.height;
    let hB = eleB.height;
    let tmp = hA / hB;

    return tmp < ratio? true : false;
}

/**
 * 元素A与元素B在高度比例上大于某数值
 * @param {Node} eleA 元素A 
 * @param {Node} eleB 元素B 
 * @param {Float} ratio 比例
 * @returns {Boolean} 
 */
let sizeHeightRatioAGreatB = function(eleA, eleB, ratio) {
    return !sizeHeightRatioALessB(eleA, eleB, ratio);
}

/**
 * 元素A的高度小于某数值
 * @param {Node} eleA 节点元素 
 * @param {Int} num 数值
 */
let sizeHeightLess = function(eleA, num) {
    return eleA.height <= num;
}

/**
 * 元素A的高度大于某数值
 * @param {Node} eleA 节点元素
 * @param {Int} num 数值 
 */
let sizeHeightGreat = function(eleA, num) {
    return !sizeHeightLess(eleA, num);
}

/**
 * 元素A的宽度小于某数值
 * @param {Node} eleA 节点元素
 * @param {Int} num 数值
 */
let sizeWidthLess = function(eleA, num) {
    return eleA.width <= num;
}

/**
 * 元素A的宽度高于某数值
 * @param {Node} eleA 节点元素
 * @param {Int} num 数值
 */
let sizeWidthGreat = function(eleA, num) {
    return !sizeWidthLess(eleA, num);
}


module.exports = {
    // 元素属性判断
    propertyNodeIsQText,
    propertyNodeAreQText,
    propertyNodeIsQIcon,
    propertyNodeAreQIcon,
    propertyNodeIsQImage,
    propertyNodeAreQImage,
    propertyNodeIsQShape,
    propertyNodeAreQShape,
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
    distanceGreatArightToBleft,
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
    // 元素的尺寸关系
    sizeWidthRatioALessB,
    sizeWidthRatioAGreatB,
    sizeHeightRatioALessB,
    sizeHeightRatioAGreatB,
    sizeHeightLess,
    sizeHeightGreat,
    sizeWidthLess,
    sizeWidthGreat
}