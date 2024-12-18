/**
 * 用于构建的虚拟树
 * 树的节点储存信息为QObject类型
 */
const QObject = require('./QObject');
const QNODES = require('./');
const {
  generateGroupAttr,
  getBiggestNode,
  mergeStyle,
  cloneNodeByKeys,
  serialize,
  isIntersect,
} = require('../utils');
/**
 * @class 设计树控制类
 */
class DesignTree {
  /**
   * @public 创建节点
   * @param {string} type 节点类型
   */
  static createNode(type) {
    if (type == null) return new QObject();
    return new QNODES[type]();
  }

  /**
   * @public 节点转换
   * @param {QObject} node 目标节点
   * @param {string} type 转换类型
   */
  static convert(node, type) {
    switch (type) {
      case QNODES.QImage.name:
        this._toImage(node);
        break;
      default:
        break;
    }
    node.type = type;
  }

  /**
   * @public 合并多个节点
   * @param {Array.<QObject>} nodes 目标节点列表
   * @param {string} type 合并节点类型
   * @param {boolean} isMerge 是否合图流程合并
   */
  static union(nodes, type = 'QImage', isMerge = true) {
    if (!Array.isArray(nodes) || !nodes[0]) return null;
    const newNode = this.createNode(type);
    newNode.isModified = newNode.isNew = true;
    const [id, name] = nodes.reduce(
      (p, c) => [`${p[0]}_${c.id}`, `${p[1]}_${c.name}`],
      ['', ''],
    );
    newNode.id = id;
    newNode.name = name;
    console.log('合并', name);
    // 设置组的样式
    Object.assign(newNode, generateGroupAttr(nodes));
    switch (type) {
      case 'QImage':
        {
          newNode.path = `${newNode.id}.png`;
          // const nodesData = nodes.map(n => this._getMergeNode(n, newNode));
          const nodesData = this._getNodesData(nodes);
          if (nodes.length) {
            newNode.isMerge = isMerge;
            const images = nodes.reduce((p, c) => {
              if (c.isMerge) return p.concat(c.images);
              else return p;
            }, []);
            newNode.images = [...images, ...nodesData];
          }
          // if (isMerge) {
          //   const biggestNode = getBiggestNode(nodes);
          //   if (
          //     biggestNode &&
          //     ['width', 'height', 'abX', 'abY']
          //       .map(key => biggestNode[key] === newNode[key])
          //       .every(val => val)
          //   ) {
          //     console.log('合并样式从', biggestNode.name, '到', newNode.name);
          //     mergeStyle(newNode, biggestNode, [
          //       'borderRadius',
          //       'border',
          //       'shadows',
          //     ]);
          //   }
          // }
        }
        break;
      default:
        break;
    }
    nodes.sort((a, b) => a.index - b.index);
    const { parent } = nodes[0];
    let newIndex = nodes[0].index;
    const brothers = parent.children.filter(n => !~nodes.indexOf(n));
    nodes.forEach(n => {
      if (~brothers.indexOf(n._behindNode)) {
        newIndex = n.index;
      }
    });
    if (!~newIndex) return null;
    parent.add(newNode, newIndex);
    try {
      nodes.forEach(n => {
        parent.remove(n);
      }); // 删除旧节点
    } catch (error) {
      console.error('删除失败');
    }
    return newNode;
  }

  static _getNodesData(nodes) {
    return nodes.map(n => {
      const cloneNode = cloneNodeByKeys(n, [
        'id',
        'name',
        // 'styles',
        'path',
        'abX',
        'abY',
        'type',
        '_origin',
        'height',
        'width',
        'isMerge',
        'levelArr',
        'images',
      ]);
      if (n.isMerge) cloneNode.images = [];
      return cloneNode;
    });
  }
  /**
   * @private
   * @param {QObject} node
   * @param {QObject} mNode
   */
  static _getMergeNode(node, mNode) {
    const n = cloneNodeByKeys(node, [
      'id',
      'name',
      'styles',
      'path',
      'abX',
      'abY',
      'type',
      '_origin',
      'height',
      'width',
      '_imageChildren',
      'levelArr',
    ]);
    n.x = node.abX - mNode.abX;
    n.y = node.abY - mNode.abY; // 后续要去掉
    return n;
  }

  /**
   * @private 转换为图片节点
   * @param {QObject} node
   */
  static _toImage(node) {
    // if (option.saveChild && Array.isArray(node.children) && node.children.length) {
    //   const nodesData = this._getNodesData(node.children);
    //   node._imageChildren = nodesData;
    // }
    // console.log('转化为图片',node.name);
    node.path = `${node.id}.png`;
    this._clearImageStyles(node.styles);
    switch (node.type) {
      case QNODES.QShape.name:
        break;
      case QNODES.QLayer.name:
        break;
      case QNODES.QText.name:
        delete QText.text;
        delete QText.styles.texts;
        delete QText.styles.verticalAlign;
        delete QText.styles.textAlign;
        delete QText.styles.lineHeight;
        break;
      default:
        break;
    }
    node.removeAll();
    // node.styles = {};
    // Object.assign(node,new QImage(),{ path, type: QImage.name, id: node.id, name: node.name });
    // node.styles = {borderRadius: node.styles.borderRadius || [0,0,0,0]};
    // node.pureColor = this.getNodesCommonColor(node.children);
  }

  static _clearImageStyles(styles) {
    if (styles) {
      Object.assign(styles, {
        background: null,
        opacity: 1,
      });
    }
  }

  // z-index空间关系计算
  static zIndexCompute(rootNode) {
    function _setNodeZIndex(node) {
      let n = node;
      while (n._behindNode) {
        node.zIndex++;
        n = n._behindNode;
      }
    }
    const nodeList = serialize(rootNode);
    for (let index = nodeList.length - 1; index > 0; index--) {
      const node = nodeList[index];
      node.zIndex = 0;
      const list = nodeList.slice(0, index).reverse();
      const bNode = list.find(
        n => isIntersect(node, n) && !(n.type === QNODES.QLayer.name),
      );
      if (bNode) node._behindNode = bNode;
    }
    nodeList.forEach(node => _setNodeZIndex(node));
  }
}
module.exports = DesignTree;
