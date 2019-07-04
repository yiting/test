// 样式的计算处理
import { debug } from 'util';
import Common from '../../../dsl2/common';
import Constraints from '../../../helper/constraints';
import Utils from '../../utils';
import Func from '../css_func';
import QLog from '../../../log/qlog';

import cssProperty from '../css_property';

const Loger = QLog.getInstance(QLog.moduleData.render);
// 生成的Css记录树
let cssDomTree = null;

const CompatibleKey = ['box-flex', 'box-orient', 'box-pack', 'box-align'];
const CompatibleValue = ['box'];
const cssPropertyMap = cssProperty.map;

class CssDom {
  id: any;

  tagName: any;

  serialId: any;

  modelId: any;

  type: any;

  modelName: any;

  canLeftFlex: any;

  canRightFlex: any;

  isCalculate: any;

  tplAttr: any;

  similarId: any;

  parent: any;

  _abX: any;

  _abY: any;

  _abXops: any;

  _abYops: any;

  _width: any;

  _height: any;

  _zIndex: any;

  _hasText: boolean;

  constraints: any;

  path: any;

  styles: any;

  children: any;

  selfCss: any;

  similarCssName: any;

  extendStyle: any;

  renderStyle: any;

  countStyle: {
    add: any;
    subtract: any;
  };

  constructor(parent: any, data: any) {
    // 节点的信息
    this.id = data.id;
    this.tagName = data.tagName;
    this.serialId = data.serialId;
    this.modelId = data.modelId;
    this.type = data.type;
    this.modelName = data.modelName;
    this.canLeftFlex = data.canLeftFlex;
    this.canRightFlex = data.canRightFlex;
    this.isCalculate = data.isCalculate;
    this.tplAttr = data.tplAttr || {};
    this.similarId = data.similarId;
    this.parent = parent || null;

    // 布局计算的数值
    this._abX = data.abX;
    this._abY = data.abY;
    this._abXops = data.abXops;
    this._abYops = data.abYops;
    this._width = data.width;
    this._height = data.height;
    this._zIndex = data.zIndex;
    this._hasText = !!data.text;

    // 样式属性
    this.constraints = data.constraints;
    this.path = data.path;

    //具体元素的sketch样式
    this.styles = data.styles || {};
    //继承属性
    this.extendStyle = {};
    //最终输出css时候当前节点的样式
    this.renderStyle = {};

    //需要去重或者被上升的样式（样式合并冗余）
    this.countStyle = {
      add: [],
      subtract: [],
    };
    // 子节点
    this.children = [];

    this.selfCss = data.selfCss || [];
    this.similarCssName = data.similarCssName || [];
    // 根据映射定义属性
    cssPropertyMap.forEach((s: any) => {
      Object.defineProperty(this, s.key, {
        get: s.value,
      });
    });
  }

  // 转换过的基于父节点的parentX
  get parentX() {
    return this._abX - this.parent._abX;
  }

  // 转换过的基于父节点的parentY
  get parentY() {
    return this._abY - this.parent._abY;
  }

  /**
   * 获取当前节点的前一个兄弟节点,若没有则返回null
   */
  _prevNode() {
    if (this.type === Common.QBody || !this.parent) {
      // 根节点
      return null;
    }

    const len = this.parent.children.length;

    let canBegin = false;
    for (let i = len - 1; i >= 0; ) {
      const node = this.parent.children[i];

      if (node.id === this.id) {
        canBegin = true;
      } else if (canBegin && !node._isAbsolute()) {
        /**
         * 新增多行的判断逻辑,如果前节点位置后于当前节点，则错误
         */
        const directKeyName =
          this.parent.constraints.LayoutDirection ==
          Constraints.LayoutDirection.Horizontal
            ? '_abX'
            : '_abY';
        if (node[directKeyName] > this[directKeyName]) {
          return null;
        }
        return node;
      }
      i -= 1;
    }
    return null;
  }
  /**
   * 获取当前节点的上一行内容
   * 判断逻辑：
   * 1. 水平排列的，比当前节点位置高的
   * 2. 垂直排列的，比当前节点位置左的
   */
  _prevLine() {
    const that: any = this;
    if (that.type === Common.QBody || !that.parent) {
      // 根节点
      return null;
    }
    const prevKey =
      that.parent.constraints.LayoutDirection ==
      Constraints.LayoutDirection.Horizontal
        ? '_abYops'
        : '_abXops';
    const selfKey =
      that.parent.constraints.LayoutDirection ==
      Constraints.LayoutDirection.Horizontal
        ? '_abY'
        : '_abX';
    const _prevNodes: any = [];
    that.parent.children.some((node: any) => {
      if (node.id === that.id) {
        return false;
      }
      // 如果非绝对定位，且节点位置靠前
      if (!node._isAbsolute() && node[prevKey] < that[selfKey]) {
        _prevNodes.push(node);
      }
    });
    return _prevNodes;
  }
  /**
   * 获取当前节点的下一个兄弟节点,若没有则返回null
   */
  _nextNode() {
    if (this.type === Common.QBody || !this.parent) {
      // 根节点
      return null;
    }

    const len = this.parent.children.length;

    let canBegin = false;
    for (let i = 0; i < len; i++) {
      const node: any = this.parent.children[i];
      if (node.id === this.id) {
        canBegin = true;
      } else if (canBegin && !node._isAbsolute()) {
        return node;
      }
    }
    return null;
  }
  _hasHeight() {
    if (
      this.type === Common.QShape ||
      this.type === Common.QImage ||
      !!this.path
    ) {
      return true;
    }
    return false;
  }

  _hasWidth() {
    if (this.type === Common.QText && this.styles.texts) {
      const lineHeight =
        this.styles.lineHeight ||
        Math.max(this.styles.texts.map((s: any) => s.size)) * 1.33;
      if (this._height / lineHeight > 1.1) {
        // 如果高度高于行高，则为多行，固定宽度
        return true;
      }
    }
    if (
      this.type === Common.QText &&
      !this._isParentVertical() &&
      this.constraints.LayoutFixedWidth !== Constraints.LayoutFixedWidth.Fixed
    ) {
      return false;
    }
    return true;
  }

  _isTextCenter() {
    if (!this._hasText) {
      return null;
    }
    if (
      this.constraints.LayoutJustifyContent ===
        Constraints.LayoutJustifyContent.Center ||
      this.constraints.LayoutAlignItems === Constraints.LayoutAlignItems.Center
    ) {
      return true;
    }

    if (this.styles.textAlign == 1) {
      return true;
    }
    return false;
  }

  _isImgTag() {
    return this.tagName === 'img';
  }

  /**
   * 节点是否属于绝对定位
   */
  _isAbsolute() {
    if (
      this.constraints.LayoutSelfPosition &&
      this.constraints.LayoutSelfPosition ===
        Constraints.LayoutSelfPosition.Absolute
    ) {
      return true;
    }

    return false;
  }

  /**
   * 父节点是否属于相对定位
   */
  _isRelative() {
    if (
      this.parent &&
      this.parent.constraints.LayoutPosition ===
        Constraints.LayoutPosition.Absolute
    ) {
      return true;
    }
    return false;
  }

  _isParentVertical() {
    if (!this.parent) {
      return true;
    }
    if (
      this.parent.constraints.LayoutDirection &&
      this.parent.constraints.LayoutDirection ==
        Constraints.LayoutDirection.Vertical
    ) {
      return true;
    }

    if (Utils.isVertical(this.parent.children)) {
      return true;
    }
    return false;
  }

  /**
   * 节点的排列是否为横排
   * @returns {Boolean}
   */
  _isParentHorizontal() {
    if (!this.parent) {
      return false;
    }
    // if (this.parent.children.length===1) { // 1个元素默认是横排
    //     return true;
    // }

    if (
      this.parent.constraints.LayoutDirection &&
      this.parent.constraints.LayoutDirection ==
        Constraints.LayoutDirection.Horizontal
    ) {
      return true;
    }

    if (Utils.isHorizontal(this.parent.children)) {
      return true;
    }

    return false; // 默认为竖排
  }

  _canFlex(isLeft: boolean) {
    if (
      this.constraints.LayoutFixedWidth === Constraints.LayoutFixedWidth.Fixed
    ) {
      return false;
    }
    // 如果文本为水平布局，则不计算拓展；
    // 如果文本为垂直布局，则继续判断
    if (this._hasText && !this._textCanFlex()) {
      return false;
    }
    // 如果有拓展属性，则应用默认拓展属性
    if (isLeft && typeof this.canLeftFlex === 'boolean') {
      return this.canLeftFlex;
    }
    if (!isLeft && typeof this.canRightFlex === 'boolean') {
      return this.canRightFlex;
    }

    const _dir: string = isLeft ? 'End' : 'Start';
    const _c: any = this.constraints;
    const _C: any = Constraints;

    const isHorizontal = _c.LayoutDirection === _C.LayoutDirection.Horizontal;
    const isJustifyDir =
      _c.LayoutJustifyContent === _C.LayoutJustifyContent[_dir];
    const isAlignDir = _c.LayoutAlignItems === _C.LayoutAlignItems[_dir];
    const isJustifyCenter =
      _c.LayoutJustifyContent === _C.LayoutJustifyContent.Center;
    const isAlignCenter =
      _c.LayoutAlignItems === Constraints.LayoutAlignItems.Center;
    // 如果左对齐，不能向左拓展
    if (
      isHorizontal
        ? isJustifyCenter || isJustifyDir
        : isAlignCenter || isAlignDir
    ) {
      return true;
    }
    if (this.parent) {
      const _pc: any = this.parent.constraints;
      const isPHorizontal =
        _pc.LayoutDirection === _C.LayoutDirection.Horizontal;
      const isPJustifyDir =
        _pc.LayoutJustifyContent === _C.LayoutJustifyContent[_dir];
      const isPAlignDir = _pc.LayoutAlignItems === _C.LayoutAlignItems[_dir];
      const isPJustifyCenter =
        _pc.LayoutJustifyContent === _C.LayoutJustifyContent.Center;
      const isPAlignCenter =
        _pc.LayoutAlignItems === Constraints.LayoutAlignItems.Center;
      if (
        isPHorizontal
          ? isPJustifyCenter || isPJustifyDir
          : isPAlignCenter || isPAlignDir
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * 节点是否为固定宽度节点
   * @param {CssDom} node CssDom节点
   */
  _canLeftFlex() {
    return this._canFlex(true);
  }

  _canRightFlex() {
    return this._canFlex(false);
  }

  /**
   * 节点是否为固定宽度节点
   * @param {CssDom} node CssDom节点
   */
  _isFixedHeight(node: any) {
    let result = false;

    if (!this.modelName) {
      // 不是模板元素, 默认做最大扩展
      return false;
    }

    if (
      this.constraints.LayoutFixedHeight &&
      this.constraints.LayoutFixedHeight === Constraints.LayoutFixedHeight.Fixed
    ) {
      result = true;
    } else if (node.modelName) {
      // 有node.modelName 则为非模板生成的元素,可以认为是固定高
      result = true;
    }
    return result;
  }

  /**
   * 判断文本是否可拓展，
   * 如果文本为水平方向，则不能拓展
   */
  _textCanFlex() {
    return (
      this.parent &&
      this.parent.constraints.LayoutDirection ===
        Constraints.LayoutDirection.Vertical
    );
  }

  /**
   * 判断是否使用paddingTop，如果是垂直布局，则用paddingTop，则返回第一个非绝对定位节点
   */
  _usePaddingTop() {
    if (this._isAbsolute()) {
      return false;
    }
    return (
      this.constraints.LayoutDirection ===
        Constraints.LayoutDirection.Vertical &&
      // parent.children.find(nd => !nd._isAbsolute());
      this._getFirstChild()
    );
  }

  _getFirstChild() {
    return this.children.find((nd: any) => !nd._isAbsolute());
  }

  /**
   * 获取className
   */
  getCssSelector() {
    return this.selfCss.map((n: any) => `.${n}`).join(' ');
  }

  /**
   * 获取得到的属性
   */
  getCssProperty(similarCss: any) {
    const props: any[] = [];
    let key = '';
    try {
      // 获取属性值并进行拼接
      cssPropertyMap.forEach((mod: any) => {
        const that: any = this;
        ({ key } = mod);
        const value = that[key];
        //大家都有样式属性值，这里开始区分哪些用来显示，哪些是继承而来的。。
        //存在父节点，当前样式具有可继承性，父节点的显示样式或者继承来的样式与当前样式值相等
        if (Func.isExtend(key)) {
          that.extendStyle[key] = value;
        }
        const similarValue = similarCss && similarCss[key];
        if (value !== null && value !== undefined && similarValue !== value) {
          // console.log(`${that.id}-${that.type}来到一个${key}，父亲的值${that.parent.extendStyle[key]},当前的值${value}`)
          if (!(that.parent && that.parent.extendStyle[key] == value)) {
            //查看样式是否已经属于合并过的。。
            if (!that.countStyle.subtract[key]) {
              props.push(CssDom.getCssProperty(key, value));
            }
          } else {
            // console.log(`&&&&&&&&&&找到一个key，父亲的值${that.parent.extendStyle[key]},当前的值${value}`)
          }
        } else {
          if (that.countStyle.add[key]) {
            props.push(
              CssDom.getCssProperty(key, that.countStyle.add[key]['value']),
            );
          }
        }
      });
    } catch (e) {
      Loger.error(
        `css_dom.js [this.getCssProperty] ${e}, 
        params[this.id:${this.id},
        key:${key},
        similarCss;${similarCss}]`,
      );
    }
    return props;
  }

  /**
   * 获取该节点的样式
   */
  getCss(similarCss: any) {
    let str = '';
    const cssSelector = this.getCssSelector();
    const cssPropArr = this.getCssProperty(similarCss);
    if (cssPropArr.length) {
      str = `${cssSelector} {${cssPropArr.join(';')}}`;
    }
    return str;
  }

  /**
   * 获取样式属性：值
   * @param {string} key
   * @param {any} value
   */
  static getCssProperty(key: string, _value: any) {
    let value: any = _value;
    if (typeof value === 'number' && key !== 'opacity' && key !== 'zIndex') {
      // 数字的话进行单位转换
      value = Func.transUnit(value);
    }

    const name = Utils.nameLower(key);
    if (CompatibleKey.includes(name)) {
      const webkitName = `-webkit-${name}`;
      return `${webkitName}: ${value}`;
    }
    return `${name}: ${value}`;
  }
}
export default CssDom;
