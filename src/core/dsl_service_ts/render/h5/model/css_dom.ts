// 样式的计算处理
import { debug } from 'util';
import Dictionary from '../../../helper/dictionary';
import Constraints from '../../../helper/constraints';
import Utils from '../../../helper/methods';
import Func from '../function/css_func';
import QLog from '../../../log/qlog';
import VDom from '../../vdom';
import cssProperty from '../function/css_property';
const Loger = QLog.getInstance(QLog.moduleData.render);

const CompatibleKey = ['box-flex', 'box-orient', 'box-pack', 'box-align'];
const CompatibleValue = ['box'];
const cssPropertyMap = cssProperty.map;

class CssDom extends VDom {
  _zIndex: any;

  className: string;

  classNameChain: any;

  simClassName: string;

  simClassNameChain: any;

  extendStyle: any;

  renderStyle: any;

  countStyle: {
    add: any;
    subtract: any;
  };
  _textWidth: number | null;

  constructor(data: any, parent: any) {
    super(data, parent);
    // 节点的信息
    // 布局计算的数值
    this._textWidth = null;
    //继承属性
    this.extendStyle = {};
    //最终输出css时候当前节点的样式
    this.renderStyle = {};

    //需要去重或者被上升的样式（样式合并冗余）
    this.countStyle = {
      add: [],
      subtract: [],
    };

    this.className = data.className;
    this.simClassName = data.simClassName;
    this.classNameChain = data.classNameChain;
    this.simClassNameChain = data.simClassNameChain;

    // 根据映射定义属性
    cssPropertyMap.forEach((s: any) => {
      Object.defineProperty(this, s.key, {
        get: s.value,
      });
    });
  }

  // 转换过的基于父节点的parentX
  get parentX() {
    return this.abX - this.parent.abX;
  }

  // 转换过的基于父节点的parentY
  get parentY() {
    return this.abY - this.parent.abY;
  }
  _hasHeight() {
    if (
      // 约束高度固定
      this.constraints.LayoutFixedHeight === Constraints.LayoutFixedHeight.Fixed
    ) {
      return true;
    }
    // 有图片
    if (this.type === Dictionary.type.QImage || !!this.path) {
      return true;
    }
    // 水平布局
    if (
      this.constraints.LayoutDirection ===
      Constraints.LayoutDirection.Horizontal
    ) {
      return true;
    }
    return false;
  }

  _hasWidth() {
    // 约束-固定宽度
    if (
      this.constraints.LayoutFixedWidth === Constraints.LayoutFixedWidth.Default
    ) {
      return false;
    }

    if (
      this.type == Dictionary.type.QText && // 是文本
      !this.isMultiline && // 单行
      this._isParentHorizontal() //水平布局
    ) {
      return false;
    }
    return true;
  }

  _isTextCenter() {
    // const hasText = this.text;
    // if (!hasText) {
    //   return null;
    // }
    if (this.type !== Dictionary.type.QText) {
      return null;
    }
    if (
      (this.constraints.LayoutDirection ===
        Constraints.LayoutDirection.Horizontal &&
        this.constraints.LayoutJustifyContent ===
          Constraints.LayoutJustifyContent.Center) ||
      (this.constraints.LayoutDirection ===
        Constraints.LayoutDirection.Vertical &&
        this.constraints.LayoutAlignItems ===
          Constraints.LayoutAlignItems.Center)
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
  _isBgTag() {
    return this.tagName === 'i';
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

  _getFirstChild() {
    return this.children.find((nd: any) => !nd._isAbsolute());
  }

  _getLastChild() {
    for (let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children[i];
      if (!child._isAbsolute()) {
        return child;
      }
    }
  }

  /**
   * 获取className
   */
  getCssSelector() {
    return this.classNameChain.map((n: any) => `.${n}`).join(' ');
  }

  /**
   * 获取得到的属性
   */
  getCssProperty(similarCss: any) {
    const props: any[] = [];
    let key = '';
    try {
      const that: any = this;
      // 获取属性值并进行拼接
      cssPropertyMap.forEach((mod: any) => {
        ({ key } = mod);
        const value = that[key];
        const similarValue = similarCss && similarCss[key];
        if (value !== null && value !== undefined && similarValue !== value) {
          props.push(CssDom.getCssProperty(key, value));
        }
      });
    } catch (e) {
      Loger.error(
        `css_dom_tree.js [this.getCssProperty] ${e}, 
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
