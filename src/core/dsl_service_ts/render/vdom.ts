import Constraints from '../helper/constraints';
import Utils from './utils';
import Common from '../dsl2/common';
import FontLineHeight from '../helper/fontLineHeight';
class VDom {
  children: any[];
  parent: any;
  id: any;
  type: any;
  serialId: any;
  similarId: any;
  canLeftFlex: any;
  canRightFlex: any;
  modelId: any;
  modelName: any;
  tagName: any;
  isClosedTag: any;
  text: any;
  abX: any;
  abY: any;
  path: any;
  tplAttr: any;
  styles: any;
  abXops: any;
  abYops: any;
  constraints: any;
  zindex: any;
  isMultiline: any;

  constructor(node: any, parent: any) {
    // super(node)
    this.children = [];
    this.parent = parent || null;
    this.id = node.id;
    this.type = node.type;
    this.serialId = node.serialId;
    this.similarId = node.similarId;
    this.canLeftFlex = node.canLeftFlex;
    this.canRightFlex = node.canRightFlex;
    this.modelId = node.modelId;
    this.modelName = node.modelName;
    this.tagName = node.tagName;
    this.isClosedTag = node.isClosedTag;
    this.text = node.text;
    this.abX = node.abX || 0;
    this.abY = node.abY || 0;
    this.abXops = node.abXops;
    this.abYops = node.abYops;
    this.path = node.path || null;
    this.zindex = node.zIndex;
    this.tplAttr = node.tplAttr || {};
    this.styles = node.styles || {};
    this.constraints = node.constraints || {};
    this.isMultiline = null;
    if (this.text) {
      const arr = this.styles.texts.map((word: any) => {
        const rate = FontLineHeight(word.font, word.size);
        return rate;
      });
      const _lineHeight = this.styles.lineHeight || Math.max(arr);
      const _height = this.abYops - this.abY;
      // 如果高度高于行高，则为多行，固定宽度
      this.isMultiline = _height / _lineHeight > 1.6;
    }
  }
  toJSON() {
    return {
      children: this.children.map((node: any) => node.toJSON()),
      parentId: this.parent && this.parent.id,
      id: this.id,
      type: this.type,
      serialId: this.serialId,
      similarId: this.similarId,
      canLeftFlex: this.canLeftFlex,
      canRightFlex: this.canRightFlex,
      modelId: this.modelId,
      modelName: this.modelName,
      tagName: this.tagName,
      isClosedTag: this.isClosedTag,
      text: this.text,
      abX: this.abX,
      abY: this.abY,
      abXops: this.abXops,
      abYops: this.abYops,
      path: this.path,
      zIndex: this.zindex,
      isMultiline: this.isMultiline,
      tplAttr: this.tplAttr,
      styles: this.styles,
      constraints: this.constraints,
    };
  }
  get x() {
    return this.parent ? this.abX - this.parent.abX : this.abX;
  }

  get y() {
    return this.parent ? this.abY - this.parent.abY : this.abY;
  }

  get width() {
    return this.abXops - this.abX;
  }

  get height() {
    return this.abYops - this.abY;
  }
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
  _isParentVertical() {
    if (!this.parent) {
      return true;
    }
    if (this.parent.constraints.LayoutDirection) {
      return (
        this.parent.constraints.LayoutDirection ==
        Constraints.LayoutDirection.Vertical
      );
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
  _canFlex(isLeft: boolean) {
    if (
      this.constraints.LayoutFixedWidth === Constraints.LayoutFixedWidth.Fixed
    ) {
      return false;
    }
    // 如果文本为水平布局，则不计算拓展；
    // 如果文本为垂直布局，则继续判断
    // if (this.text && !this._textCanFlex()) {
    if (
      this.type === Common.QText &&
      (!this.parent ||
        this.parent.constraints.LayoutDirection !==
          Constraints.LayoutDirection.Vertical)
    ) {
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
            ? 'abX'
            : 'abY';
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
    const _prevNodes: any = [];
    if (that.type === Common.QBody || !that.parent) {
      // 根节点
      return _prevNodes;
    }
    const prevKey =
      that.parent.constraints.LayoutDirection ==
      Constraints.LayoutDirection.Horizontal
        ? 'abYops'
        : 'abXops';
    const selfKey =
      that.parent.constraints.LayoutDirection ==
      Constraints.LayoutDirection.Horizontal
        ? 'abY'
        : 'abX';
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
   * 获取当前节点的下一行内容
   * 判断逻辑：
   * 1. 水平排列的，比当前节点位置低的
   * 2. 垂直排列的，比当前节点位置右的
   */
  _nextLine() {
    const that: any = this;
    const _nextNodes: any = [];
    if (that.type === Common.QBody || !that.parent) {
      // 根节点
      return _nextNodes;
    }
    const nextKey =
      that.parent.constraints.LayoutDirection ==
      Constraints.LayoutDirection.Horizontal
        ? 'abY'
        : 'abX';
    const selfKey =
      that.parent.constraints.LayoutDirection ==
      Constraints.LayoutDirection.Horizontal
        ? 'abYops'
        : 'abXops';
    that.parent.children.some((node: any) => {
      if (node.id === that.id) {
        return false;
      }
      // 如果非绝对定位，且节点位置靠前
      if (!node._isAbsolute() && node[nextKey] > that[selfKey]) {
        _nextNodes.push(node);
      }
    });
    return _nextNodes;
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
}

export default VDom;
