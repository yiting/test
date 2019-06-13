const { serialize } = require('../utils');
/**
 * 基础节点类
 */
class QObject {
  constructor() {
    // id
    this.id = null;
    // 图层名
    this.name = '';
    // 长度
    this.width = 0;
    // 宽度
    this.height = 0;
    // 相对于坐标原点(左上角的位置)
    this.abX = 0;
    // 相对于坐标原点(左上角的位置)
    this.abY = 0;
    this.zIndex = 0;
    this.styles = {};
    this.children = [];
    this.parent = null;
    this.isModified = false;
    this._origin = {};
    this._imageChildren = [];
  }

  convert(type) {
    this.type = type;
  }

  get childNum() {
    return this.children.length;
  }

  get x() {
    if (this.parent) return this.abX - this.parent.abX;
    return 0;
  }

  get y() {
    if (this.parent) return this.abY - this.parent.abY;
    return 0;
  }

  get abXops() {
    return this.abX + this.width;
  }

  get abYops() {
    return this.abY + this.height;
  }

  // 节点是否包具有样式
  get hasStyle() {
    if (!this.styles) return false;
    const {
      opacity,
      rotation,
      border,
      borderRadius,
      shadows,
      background,
    } = this.styles;
    return !!(
      background ||
      opacity !== 1 ||
      rotation !== 0 ||
      border ||
      shadows ||
      borderRadius
    );
  }

  // 节点是否包含影响子元素的样式属性
  get hasComplexStyle() {
    // TODO 性：opacity,transform
    if (!this.styles) return false;
    const {
      opacity,
      rotation,
      border,
      borderRadius,
      shadows,
      background,
    } = this.styles;
    const isBgComplex =
      (background && background.hasOpacity) || (!background && border);
    return !!(
      opacity !== 1 ||
      rotation !== 0 ||
      //   border ||
      shadows ||
      //   borderRadius ||
      isBgComplex
    );
  }

  get hasComplexColor() {
    if (!this.styles) return false;
    const { opacity, rotation, border, shadows, background } = this.styles;
    const isBgComplex = background && background.hasOpacity;
    // return opacity != 1 || rotation!= 0 || border || shadows || borderRadius!=0 || isBgComplex ;
    return !!(
      opacity !== 1 ||
      rotation !== 0 ||
      border ||
      shadows ||
      isBgComplex
    );
  }

  get isTransparent() {
    return +this.styles.opacity === 0;
  }

  get index() {
    const index = this.parent ? this.parent.children.indexOf(this) : -1;
    return index;
  }

  /**
   * 删除子节点
   * @param {QObject} node
   */
  remove(node) {
    const index = this.children.findIndex(n => node.id === n.id);
    if (~index) this.children.splice(index, 1);
    node.parent = null;
  }

  /**
   * 添加子节点
   * @param {QObject} node
   * @param {number} index
   */
  add(node, index = this.children.length) {
    this.children.splice(index, 0, node); // 在特定位置插入元素
    node.parent = this;
  }

  removeSelf() {
    if (this.parent) this.parent.remove(this);
  }

  removeAll() {
    this.children.forEach(child => (child.parent = null));
    this.children = [];
  }

  getNodeById(id) {
    const nodes = serialize(this);
    return _getNodeByList('id', id, nodes);
  }

  getNodeByName(name) {
    const nodes = serialize(this);
    return _getNodeByList('name', name, nodes);
  }

  /**
   * 获取祖父列表
   */
  getParentList() {
    const parentList = [];
    let parent = this.parent;
    while (parent) {
      parentList.push(parent);
      parent = parent.parent;
    }
    return parentList;
  }

  toJson() {
    const rules = [
      'id',
      'name',
      'type',
      'width',
      'height',
      'abX',
      'abY',
      'styles',
      'path',
      'text',
      'zIndex',
      'symbolRoot',
      'symbolIdentity',
    ];
    const res = {};
    for (const key in this) {
      // 除去不需要的
      if (~rules.indexOf(key) && this[key] !== undefined) {
        res[key] = this[key];
      }
    }
    res.children = this.children.map(child => child.toJson());
    return res;
  }

  /**
   * 平铺树节点
   */
  toList() {
    const rules = [
      'id',
      'name',
      'type',
      'width',
      'height',
      'abX',
      'abY',
      'styles',
      'path',
      'text',
      'zIndex',
      'symbolRoot',
      'symbolIdentity',
    ];
    return serialize(this).map(node => {
      const res = {};
      for (const key in node) {
        // 除去不需要的
        if (~rules.indexOf(key) && node[key] !== undefined) {
          res[key] = node[key];
        }
      }
      return res;
    });
  }

  /**
   * 返回解析中遇到的图片层
   */
  getImages(dir) {
    return serialize(this)
      .filter(node => node.type === 'QImage')
      .map(node => {
        const {
          id,
          name,
          type,
          width,
          height,
          x,
          y,
          abX,
          abY,
          path,
          _imageChildren: imgchildren,
          levelArr,
          isModified,
          styles,
        } = node;
        const _imageChildren = getImageChild(imgchildren);
        // if(_origin) _origin = {
        //     ..._origin,
        //     layers: 'shapeGroup' === _origin._class ? _origin.layers : null
        // }
        return {
          id,
          name,
          type,
          width,
          height,
          x,
          y,
          abX,
          abY,
          path,
          _imageChildren,
          levelArr,
          styles,
          isModified,
        };
      });
  }
}
/**
 * 设置json值
 * @param {string} id json对象
 * @param {Array.<QObject>} nodes 节点
 */
function _getNodeByList(key, val, nodes) {
  return nodes.find(n => n[key] === val);
}
function getImageChild(_imageChildren) {
  const arr = [];
  const not_include = ['_origin', '_imageChildren'];
  const process = children => {
    children.forEach(n => {
      const obj = {};
      const { _origin } = n;
      if (_origin && _origin.do_objectID) obj.originId = _origin.do_objectID;
      obj.isMask = !!(n._origin.maskedNodes && n._origin.maskedNodes.length);
      Object.keys(n).forEach(key => {
        if (!~not_include.indexOf(key)) obj[key] = n[key];
      });
      arr.push(obj);
      if (Array.isArray(n._imageChildren)) process(n._imageChildren);
    });
  };
  process(_imageChildren);
  return arr;
}
module.exports = QObject;
