import VDom from '../../vdom';
import Utils from '../../../dsl_helper/methods';
// propertys
import margin from '../property/margin';
import anchors from '../property/anchors';
import orientation from '../property/orientation';
import size from '../property/size';
import multiline from '../property/multiline';
import align from '../property/align';
import radius from '../property/radius';

export default class ArkDom extends VDom {
  constructor(node: any, parent: any) {
    super(node, parent);
    // 根据映射定义属性
  }
  get relPath() {
    if (this.path) {
      return 'res/' + this.path;
    }
    return null;
  }
  get margin() {
    return margin.value.call(this);
  }
  get anchors() {
    return anchors.value.call(this);
  }
  get orientation() {
    return orientation.value.call(this);
  }
  get size() {
    return size.value.call(this);
  }
  get multiline() {
    return multiline.value.call(this);
  }
  get align() {
    return align.value.call(this);
  }
  get radius() {
    return radius.value.call(this);
  }
  get width() {
    return (this.abXops - this.abX) / 2;
  }
  get height() {
    return (this.abYops - this.abY) / 2;
  }
  get textColor() {
    // 样式修改
    if (this.styles && this.styles.texts && this.styles.texts[0].color) {
      return Utils.RGB2HEX(this.styles.texts[0].color);
    }
  }
  get font() {
    if (this.styles && this.styles.texts) {
      return this.styles.texts[0];
    }
  }
  get textSize() {
    if (this.styles && this.styles.texts && this.styles.texts[0].size) {
      return this.styles.texts[0].size / 2;
    }
  }
  get bgColor() {
    if (this.styles && this.styles.background) {
      let bg = this.styles.background;
      return Utils.RGB2HEX(bg.color);
    }
  }
}
