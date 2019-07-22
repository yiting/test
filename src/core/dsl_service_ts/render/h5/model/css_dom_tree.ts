// 样式的计算处理
import { debug } from 'util';
import Common from '../../../dsl2/common';
import Constraints from '../../../helper/constraints';
import Utils from '../../utils';
import Func from '../css_func';
import QLog from '../../../log/qlog';
import VDom from '../../vdom';
import cssProperty from '../css_property';
const Loger = QLog.getInstance(QLog.moduleData.render);

// 生成的Css记录树
let cssDomTree = null;

const CompatibleKey = ['box-flex', 'box-orient', 'box-pack', 'box-align'];
const CompatibleValue = ['box'];
const cssPropertyMap = cssProperty.map;

class CssDom extends VDom {
  _zIndex: any;

  selfCss: any;

  similarCssName: any;

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
    return this.abX - this.parent.abX;
  }

  // 转换过的基于父节点的parentY
  get parentY() {
    return this.abY - this.parent.abY;
  }
  _hasHeight() {
    if (
      this.constraints.LayoutFixedHeight ===
        Constraints.LayoutFixedHeight.Fixed ||
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
      const _height = this.abYops - this.abY;
      if (_height / lineHeight > 1.6) {
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
    const hasText = this.text;
    if (!hasText) {
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
      const that: any = this;
      // 获取属性值并进行拼接
      cssPropertyMap.forEach((mod: any) => {
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
