const Logger = require('../logger');
const { serialize, walkin, walkout, isCollide } = require('../utils');
function process(node) {
  try {
    // 树层级关系预处理
    Calculator.zIndex(node); // 计算zindex
  } catch (err) {
    Logger.error('计算z轴报错！');
  }
}
class Calculator {
  static zIndex(rootNode) {
    const nodeList = serialize(rootNode);
    for (let index = nodeList.length - 1; index > 0; index--) {
      const node = nodeList[index];
      const list = nodeList.slice(0, index).reverse();
      const bNode = list.find(
        n =>
          isCollide(node, n) && !(n.type === 'QText' && node.type === 'QText'),
      );
      if (bNode) node._behindNode = bNode;
    }
    nodeList.forEach(node => this._setNodeZIndex(node));
  }

  static _setNodeZIndex(node) {
    if (node.name === '60%') debugger;
    let n = node;
    while (n._behindNode) {
      node.zIndex++;
      n = n._behindNode;
    }
  }
}
module.exports = process;
