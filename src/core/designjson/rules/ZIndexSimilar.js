const Rule = require('./Rule');
const Utils = require('./Util');
var maxVal = 25;
let weight = 0.1;
/**
 * 层级距离相似度的规则
 * 计算两节点在层级上的距离，距离越小得分越高。
 * 逻辑是更里层的节点走到一起所需要的步数。为了和同层的距离做出差别，当需要向外层走时，需要付出更大的代价（2的层数次方步）
 */
class ZIndexSimilar extends Rule {
  constructor(param) {
    super(param);
    this.maxValue = param && param.maxValue ? param.maxValue : maxVal;
  }
  getRuleType() {
    return this.constructor.name;
  }
  getValue(nodeA, nodeB) {
    let nodeALevelArr = [];
    let nodeBLevelArr = [];
    let value = 0;
    Object.assign(nodeALevelArr, Utils.getLevelArr(nodeA));
    Object.assign(nodeBLevelArr, Utils.getLevelArr(nodeB));
    // console.log(JSON.stringify(nodeALevelArr) + "   " + JSON.stringify(nodeBLevelArr));
    if (
      nodeA.name.indexOf('Group 6 Copy') > -1 &&
      nodeB.name.indexOf('Group 6 Copy') > -1
    ) {
      // debugger;
      console.log(1);
    }
    if (nodeALevelArr.length == 0 || nodeBLevelArr.length == 0) {
      return value;
    }
    if (nodeALevelArr.length < nodeBLevelArr.length) {
      //确保A的层级较深，后面的逻辑是较深的A节点走去B节点处
      var tmpNode = nodeBLevelArr;
      nodeBLevelArr = nodeALevelArr;
      nodeALevelArr = tmpNode;
    }
    nodeALevelArr.unshift(1);
    nodeBLevelArr.unshift(1);
    let minParentIndex;
    let maxLevelLength = Math.max(nodeALevelArr.length, nodeBLevelArr.length);
    for (var i = 0, ilen = maxLevelLength; i < ilen; i++) {
      if (nodeALevelArr[i] != nodeBLevelArr[i]) {
        minParentIndex = i - 1;
        break;
      }
    }
    let minNodeAParentDistance = nodeALevelArr.length - 1 - minParentIndex;
    let minNodeBParentDistance = nodeBLevelArr.length - 1 - minParentIndex;

    //如果此时A与B同层，则计算层级差
    if (minNodeAParentDistance == 1 && minNodeBParentDistance == 1) {
      value = Math.abs(
        nodeALevelArr[nodeALevelArr.length - 1] -
          nodeBLevelArr[nodeBLevelArr.length - 1],
      );
    } else {
      //A走去自己层级的最顶层
      value = value + nodeALevelArr[nodeALevelArr.length - 1] - 1;
      //A走去最小父目录的下一层
      value = value + Math.pow(2, minNodeAParentDistance - 1);
      //如果此时A与B同层，则计算走到B旁边需要的层级
      if (minParentIndex + 1 == nodeBLevelArr.length - 1) {
        value =
          value +
          Math.abs(
            nodeALevelArr[minParentIndex + 1] -
              nodeBLevelArr[nodeBLevelArr.length - 1],
          ) -
          1;
      } else {
        //否则走去包含B节点的那一层中
        value =
          value +
          Math.abs(
            nodeALevelArr[minParentIndex + 1] -
              nodeBLevelArr[minParentIndex + 1],
          );
        //接着A走到跟B同一层的节点中
        value =
          value + Math.pow(2, minNodeBParentDistance - (minParentIndex + 1));
        //再计算走到B旁边需要的层级
        value = value + Math.abs(nodeBLevelArr[nodeBLevelArr.length - 1]) - 1;
      }
    }

    // console.log(this.getRuleType()+" value:"+value);

    // if(minNodeAParentDistance-1 == 0 || minNodeBParentDistance-1 == 0){
    //     if(minNodeAParentDistance == 1 && minNodeBParentDistance == 1){
    //         value = Math.abs(nodeALevelArr[nodeALevelArr.length-1],nodeBLevelArr[nodeBLevelArr.length-1]);
    //     }else{
    //         value = Math.abs(nodeALevelArr[minParentIndex+1]-nodeBLevelArr[minParentIndex+1])+Math.abs(nodeALevelArr[nodeALevelArr.length-1],nodeBLevelArr[nodeBLevelArr.length-1]);
    //     }
    // }else{
    //     value = Math.pow(2,minNodeAParentDistance-1)+Math.pow(2,minNodeBParentDistance-1)+Math.abs(nodeALevelArr[minParentIndex+1]-nodeBLevelArr[minParentIndex+1])+Math.abs(nodeALevelArr[nodeALevelArr.length-1]-nodeBLevelArr[nodeBLevelArr.length-1]);
    // }
    let percent = 1 - (value - 1) / maxVal;
    return percent;
  }
  getPureScore(nodeA, nodeB) {
    if (typeof this.pureScore == 'undefined') {
      var value = this.getValue(nodeA, nodeB);
      this.pureScore =
        ((Math.pow(value + 1, 5) - Math.pow(1, 5)) /
          (Math.pow(2, 5) - Math.pow(1, 5))) *
        100;
    }
    return this.pureScore;
  }
}
module.exports = ZIndexSimilar;
