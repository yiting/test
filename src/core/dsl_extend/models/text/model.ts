import Model from '../../../dsl_service_ts/model/model';
import Dictionary from '../../../dsl_service_ts/helper/dictionary';
class Text extends Model {
  constructor(node: any) {
    super(node);
    this.type = Dictionary.type.QText;
    this.canLeftFlex = false;
    this.canRightFlex = true;
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
      a_font.push(text.font);
      a_size.push(text.size);
      let { r, g, b, a } = text.color;
      a_color.push([r, g, b, a].join());
    });
    target.styles.texts.forEach((text: any) => {
      b_font.push(text.font);
      b_size.push(text.size);
      let { r, g, b, a } = text.color;
      b_color.push([r, g, b, a].join());
    });
    return (
      a_font.join(',').search(RegExp(b_font.join('|'), 'g')) > -1 &&
      a_size.join(',').search(RegExp(b_size.join('|'), 'g')) > -1 &&
      a_color.join(',').search(RegExp(b_color.join('|'), 'g')) > -1
    );
  }
}

export default Text;
