/**
 * 用于构建的虚拟树
 * 树的节点储存信息为QObject类型
 */
const QNODES = require('./');
const { generateGroupAttr, getBiggestNode, mergeStyle } = require('../utils');
/**
 * @class 设计树控制类
 */
class DesignTree {
  /**
   * @public 创建节点
   * @param {string} type 节点类型
   */
  static createNode(type) {
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
   * @param {boolean} isMergeStyle 是否合并样式
   */
  static union(nodes, type = 'QImage', isMergeStyle = true) {
    if (!Array.isArray(nodes) || !nodes[0]) return null;
    const newNode = this.createNode(type);
    newNode.isModified = newNode.isNew = true;
    const [id, name] = nodes.reduce(
      (p, c) => [`${p[0]}_${c.id.slice(0, 4)}`, `${p[1]}_${c.name}`],
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
          const nodesData = nodes.map(n => this._getMergeNode(n, newNode));
          if (nodes.length) newNode._imageChildren = nodesData;
          if (isMergeStyle) {
            const biggestNode = getBiggestNode(nodes);
            if (
              biggestNode &&
              ['width', 'height', 'abX', 'abY']
                .map(key => biggestNode[key] === newNode[key])
                .every(val => val)
            ) {
              console.log('合并样式从', biggestNode.name, '到', newNode.name);
              mergeStyle(newNode, biggestNode, [
                'borderRadius',
                'border',
                'shadows',
              ]);
            }
          }
        }
        break;
      default:
        break;
    }
    let parent = nodes[0].parent;
    try {
      nodes.forEach(n => parent.remove(n)); // 删除旧节点
    } catch (error) {
      console.error('删除失败');
    }
    parent.add(newNode);
    return newNode;
  }

  /**
   * @private
   * @param {QObject} node
   * @param {Array.<string>} keys
   */
  static _getNodeData(node, keys = []) {
    const obj = {};
    keys.forEach(key => {
      if (node[key] !== undefined) obj[key] = node[key];
    });
    return obj;
  }

  /**
   * @private
   * @param {QObject} node
   * @param {QObject} mNode
   */
  static _getMergeNode(node, mNode) {
    const n = this._getNodeData(node, [
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
    // if (node.children && node.children.length)
    //     node._imageChildren = [...node.children];
    // console.log('转化为图片',node.name);
    node.path = `${node.id}.png`;
    this._clearImageStyles(node.styles);
    switch (node.type) {
      case QNODES.QShape.name:
        break;
      case QNODES.QLayer.name:
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
}
module.exports = DesignTree;
