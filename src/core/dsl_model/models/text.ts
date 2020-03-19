import Model from '../model';
import Dictionary from '../../dsl_helper/dictionary';
class Text extends Model {
  constructor(node: any) {
    super(node);
    this.type = Dictionary.type.QText;
    this.canLeftFlex = false;
    this.canRightFlex = true;
    // 移除非模型特征属性
    this.path = null;
  }
  static regular(node: any) {
    return node.type == 'QText';
  }
  /**
   * 文本相似原则：
   * 字体相似、字号存在相似、字色存在相似
   */
  public isSimilarWith(target: any) {
    let a_font: string[] = [],
      a_size: number[] = [],
      a_color: string[] = [];
    let b_font: string[] = [],
      b_size: number[] = [],
      b_color: string[] = [];
    if (!this.styles.texts || !target.styles.texts) {
      return false;
    }
    this.styles.texts.forEach((text: any) => {
      let fontFamily = text.font.split(/-| /)[0];
      a_font.push(fontFamily);
      a_size.push(text.size);
      let { r, g, b, a } = text.color;
      a_color.push([r, g, b, a].join());
    });
    target.styles.texts.forEach((text: any) => {
      let fontFamily = text.font.split(/-| /)[0];
      b_font.push(fontFamily);
      b_size.push(text.size);
      let { r, g, b, a } = text.color;
      b_color.push([r, g, b, a].join());
    });
    return (
      this.isMultiline === target.isMultiline &&
      a_font.join(',').search(RegExp(b_font.join('|'), 'g')) > -1 &&
      a_size.join(',').search(RegExp(b_size.join('|'), 'g')) > -1 &&
      a_color.join(',').search(RegExp(b_color.join('|'), 'g')) > -1
    );
  }
}

export default Text;
