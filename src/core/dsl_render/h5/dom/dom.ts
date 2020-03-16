// 样式的计算处理
import { debug } from 'util';
import Dictionary from '../../../dsl_helper/dictionary';
import Constraints from '../../../dsl_helper/constraints';
import Func from '../utils/css_func';
import QLog from '../../../dsl_helper/qlog';
import VDom from '../../vdom';
import {
  map as MapProperty,
  inheritProperty as cssInheritProperty,
  defaultProperty as cssDefaultProperty,
} from './propertyMap';

let Loger = QLog.getInstance(QLog.moduleData.render);

export default class TemplateDom extends VDom {
  _zIndex: any;

  _tagName: string;

  _className: string;

  _classNameChain: any;

  _simClassName: string;

  _simClassNameChain: any;

  _orignClassName: string;

  _orignTagName: string;

  constructor(data: any, parent: any) {
    super(data, parent);
    // 节点的信息
    // this._orignClassName = className;
    // this._orignTagName = tagName;
    // this._orignClassName = data.className;
    // this._simClassName = data.simClassName;
    // this._classNameChain = data.classNameChain || [];
    // this._simClassNameChain = data.simClassNameChain || [];

    // 根据映射定义属性
    MapProperty.forEach((prop: any) => {
      Object.defineProperty(this, prop.key, {
        get: prop.value,
      });
    });
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
    if (this.type === Dictionary.type.QText && !this.isMultiline) {
      return false;
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

  _isBgTag() {
    return this.type === Dictionary.type.QImage;
  }

  /**
   * 节点是否属于绝对定位
   */
  _isAbsolute() {
    if (
      this.constraints.LayoutPosition &&
      this.constraints.LayoutPosition === Constraints.LayoutPosition.Absolute
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
    return this._classNameChain.map((n: any) => `.${n}`).join(' ');
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
      MapProperty.forEach((mod: any) => {
        ({ key } = mod);
        let value = that[key];
        let compValue = value + '';
        let isInherit = cssInheritProperty.includes(key);
        let similarValue = similarCss && similarCss[key] + '';
        // 如果属性可继承
        let parentValue = that.parent && that.parent[key] + '';
        // 获取默认属性
        let defaultValue = cssDefaultProperty[key];
        // if (value !== null && value !== undefined && similarValue !== value) {
        let overlook: boolean = false;
        if (similarValue) {
          overlook = compValue === similarValue;
        } else if (that.parent && isInherit) {
          // 如果有父节点，且可继承
          overlook = compValue === parentValue;
        } else {
          overlook = compValue === defaultValue;
        }

        if (!overlook) {
          props.push(Func.transCssValue(key, value) + ';');
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
  layerClassName(): string {
    let node = this;
    let indexObj = {
      level: 0,
      layerLevel: 0,
    };
    getLayerLevel(node, indexObj);
    if (indexObj.level === 0) {
      return 'body';
    }
    if (indexObj.level === 1) {
      return 'section';
    }
    if (indexObj.level === 2) {
      return 'panel';
    }
    if (indexObj.layerLevel === 3) {
      return 'wrap';
    }
    if (indexObj.layerLevel === 4) {
      return 'box';
    }
    if (indexObj.layerLevel === 5) {
      return 'inner';
    }
    return 'block';
  }
  get htmlClassName() {
    return [this._className, this._simClassName].join(' ');
  }
  get imgPath() {
    let path = this.path;
    if (!path) {
      return '';
    }
    // return Path.join(
    // Path.relative(Config.HTML.output.htmlPath, Config.HTML.output.imgPath),
    // path,
    // );
    // const p = path.replace(/^.*\//gi, '');
    const p = path.split('/').pop();
    return `../images/${p}`;
  }
}
function getLayerLevel(_node: any, _indexObj: any): any {
  const node: any = _node;
  const indexObj: any = _indexObj;
  if (!node.parent) {
    return null;
  }
  if (node.parent.modelName === 'Layer') {
    indexObj.layerLevel += 1;
  }
  indexObj.level += 1;
  const newLevel = getLayerLevel(node.parent, indexObj);
  return newLevel;
}
