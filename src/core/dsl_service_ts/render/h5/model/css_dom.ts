// 样式的计算处理
import { debug } from 'util';
import Dictionary from '../../../helper/dictionary';
import Constraints from '../../../helper/constraints';
import Func from '../utils/css_func';
import QLog from '../../../log/qlog';
import VDom from '../../vdom';
import cssProperty from '../utils/css_property';

let Loger = QLog.getInstance(QLog.moduleData.render);

let cssPropertyMap = cssProperty.map;
let cssInheritProperty = cssProperty.inheritProperties;

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
    this.classNameChain = data.classNameChain || [];
    this.simClassNameChain = data.simClassNameChain || [];

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
    let props: any[] = [];
    let key = '';
    try {
      let that: any = this;
      // 获取属性值并进行拼接
      cssPropertyMap.forEach((mod: any) => {
        ({ key } = mod);
        let value = that[key];
        let compValue = value + '';
        let isInherit = cssInheritProperty.includes(key);
        let similarValue = similarCss && similarCss[key] + '';
        // 如果属性可继承
        let parentValue = that.parent && that.parent[key] + '';
        // 获取默认属性
        let defaultValue = cssProperty.default[key];
        // if (value !== null && value !== undefined && similarValue !== value) {
        let overlook: boolean = false;
        if (similarValue) {
          overlook = compValue === similarValue;
        } else if (isInherit) {
          overlook = compValue === parentValue;
        } else {
          overlook = compValue === defaultValue;
        }

        if (!overlook) {
          props.push(Func.transCssValue(key, value));
        }
      });
    } catch (e) {
      Loger.error(
        `css_dom.ts [getCssProperty] ${e}, 
        params[this.id:${this.id},
        key:${key},
        similarCss;${similarCss}]`,
      );
    }
    return props;
  }
}
export default CssDom;
