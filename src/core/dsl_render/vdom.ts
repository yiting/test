import Constraints from '../dsl_helper/constraints';
import Utils from '../dsl_helper/methods';
import Dictionary from '../dsl_helper/dictionary';
export default class VDom {
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
  isClosedTag: any;
  text: any;
  abX: any;
  abY: any;
  path: any;
  styles: any;
  abXops: any;
  abYops: any;
  constraints: any;
  zindex: any;
  isMultiline: any;

  constructor(node: any, parent: any) {
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
    this.text = node.text || '';
    this.abX = node.abX || 0;
    this.abY = node.abY || 0;
    this.abXops = node.abXops;
    this.abYops = node.abYops;

    this.path = node.path || null;
    this.zindex = node.zIndex;
    this.styles = node.styles || {};
    this.constraints = node.constraints || {};
    this.isMultiline = node.isMultiline;
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
      text: this.text,
      abX: this.abX,
      abY: this.abY,
      abXops: this.abXops,
      abYops: this.abYops,
      path: this.path,
      zIndex: this.zindex,
      isMultiline: this.isMultiline,
      styles: this.styles,
      constraints: this.constraints,
    };
  }

  getUI() {
    return '';
  }

  protected _isAbsolute() {
    if (
      this.constraints.LayoutPosition &&
      this.constraints.LayoutPosition === Constraints.LayoutPosition.Absolute
    ) {
      return true;
    }

    return false;
  }
  protected _isParentVertical() {
    return !this._isParentHorizontal();
  }

  /**
   * 节点的排列是否为横排
   * @returns {Boolean}
   */
  protected _isParentHorizontal() {
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
  protected _canLeftFlex() {
    return this._canFlex(true);
  }

  protected _canRightFlex() {
    return this._canFlex(false);
  }
  private _canFlex(isLeft: boolean) {
    if (
      this.constraints.LayoutFixedWidth === Constraints.LayoutFixedWidth.Fixed
    ) {
      return false;
    }
    // 如果文本为水平布局，则不计算拓展；
    // 如果文本为垂直布局，则继续判断
    // if (this.text && !this._textCanFlex()) {
    if (
      this.type === Dictionary.type.QText &&
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
  protected _prevNode() {
    if (this.type === Dictionary.type.QBody || !this.parent) {
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
  protected _prevLine() {
    const that: any = this;
    const _prevNodes: any = [];
    if (that.type === Dictionary.type.QBody || !that.parent) {
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
  protected _nextLine() {
    const that: any = this;
    const _nextNodes: any = [];
    if (that.type === Dictionary.type.QBody || !that.parent) {
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
  protected _nextNode() {
    if (this.type === Dictionary.type.QBody || !this.parent) {
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

  protected get slot() {
    return (
      this.children &&
      this.children
        .map((d: any) => {
          return d.getUI();
        })
        .join('')
    );
  }

  protected get _left() {
    return this.parent ? this.abX - this.parent.abX : this.abX;
  }

  protected get _top() {
    return this.parent ? this.abY - this.parent.abY : this.abY;
  }

  protected get _right() {
    return this.parent ? this.parent.abXops - this.abXops : 0;
  }

  protected get _bottom() {
    return this.parent ? this.parent.abYops - this.abYops : 0;
  }

  protected get _width() {
    return this.abXops - this.abX;
  }

  protected get _height() {
    return this.abYops - this.abY;
  }

  protected get _margin() {
    let left = this._left,
      right = this._right,
      top = this._top,
      bottom = this._bottom;

    // 绝对定位
    if (this._isAbsolute()) {
      return { left, right, top, bottom };
    }
    const prevNode = this._prevNode();
    const nextNode = this._nextNode();
    const prevLine = this._prevLine();
    const nextLine = this._nextLine();

    function _parentLayout(parent: any) {
      if (parent) {
        return {
          justifyContent: parent.constraints.LayoutJustifyContent,
          alignItems: parent.constraints.LayoutAlignItems,
        };
      } else {
        return {
          justifyContent: null,
          alignItems: null,
        };
      }
    }
    // margin-left函数
    function _marginLeft(that: any) {
      let _this = that;
      if (_this._isParentHorizontal()) {
        // 水平居中，或是右对齐，第一个子节点marginLeft=0;
        if (
          !prevNode &&
          _parentLayout(_this.parent).justifyContent === 'Center'
        ) {
          return 0;
        }
        if (_parentLayout(_this.parent).justifyContent === 'End') {
          return 0;
        }
        if (prevNode) {
          return _this.abX - prevNode.abXops;
        }
        return _this.abX - _this.parent.abX;
      }
      // 竖向排列
      //辅轴居中或右对齐,margin-left=0
      else if (
        _parentLayout(_this.parent).alignItems === 'Center' ||
        _parentLayout(_this.parent).alignItems === 'End'
      ) {
        return 0;
      }

      return left;
    }

    // margin-right函数
    function _marginRight(that: any) {
      let _this = that;
      // margin-right:
      // 水平居中，左对齐，margin-right=0
      if (_this._isParentHorizontal()) {
        if (
          _parentLayout(_this.parent).justifyContent === 'Start' ||
          _parentLayout(_this.parent).justifyContent === 'Center'
        ) {
          return 0;
        } else if (nextNode) {
          return nextNode.abX - _this.abXops;
        }
      } else {
        if (
          _parentLayout(_this.parent).alignItems === 'Start' ||
          _parentLayout(_this.parent).alignItems === 'Center'
        ) {
          return 0;
        }
        if (_parentLayout(_this.parent).alignItems === 'End') {
          return _this.parent.abXops - _this.abXops;
        }
      }

      return right;
    }
    // margin-top函数
    function _marginTop(that: any) {
      const _this = that;
      if (!_this.parent) {
        return top;
      }
      // if(_this.parent && _this.parent.type === 'QText') {
      //   return top;
      // }
      if (_this._isParentHorizontal()) {
        if (
          _parentLayout(_this.parent).alignItems === 'Center' ||
          _parentLayout(_this.parent).alignItems === 'End'
        ) {
          return top;
        }
        if (prevLine.length) {
          const prevLineAbYops = _this._prevLine().map((n: any) => n.abYops);
          const maxTop = Math.max(...prevLineAbYops) || _this.parent.abY;
          return _this.abY - maxTop === Infinity ? 0 : _this.abY - maxTop;
        } else {
          return _this.abY - _this.parent.abY;
        }
      } else {
        if (prevNode) {
          return _this.abY - prevNode.abYops;
        } else if (_this.parent) {
          return _this.abY - _this.parent.abY;
        }
      }

      return top;
    }
    // margin-bottom函数
    function _marginBottom(that: any) {
      const _this = that;
      if (!_this.parent) {
        return bottom;
      }
      if (_this._isParentHorizontal()) {
        if (
          _parentLayout(_this.parent).alignItems === 'Start' ||
          _parentLayout(_this.parent).alignItems === 'Center'
        ) {
          return bottom;
        }
        if (nextLine.length) {
          const nextLineAbY = nextLine.map((n: any) => n.abY);
          const maxBottom = Math.max(...nextLineAbY) || _this.parent.abYops;
          // LayoutAlignItems.Start
          bottom = maxBottom - _this.abYops;
        }
        return _this.parent.abY - _this.abYops;
      } else {
        if (
          !nextNode &&
          _parentLayout(_this.parent).justifyContent === 'Center'
        ) {
          return 0;
        }
        if (_parentLayout(_this.parent).justifyContent === 'Start') {
          return 0;
        }
        if (nextNode) {
          return nextNode.abY - _this.abYops;
        } else {
          return _this.abY - _this.parent.abY;
        }
      }
    }

    return {
      left: _marginLeft(this),
      right: _marginRight(this),
      top: _marginTop(this),
      bottom: _marginBottom(this),
    };
  }

  protected get _padding() {
    let flexNodes = this.children.map((node: any) => !node._isAbsolute());
    let range = Utils.calRange(flexNodes);
    return {
      left: range.abX - this.abX,
      right: this.abXops - range.abXops,
      top: range.abY - this.abY,
      bottom: this.abYops - range.abY,
    };
  }
}
