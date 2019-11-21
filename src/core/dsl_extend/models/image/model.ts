import Model from '../../../dsl_service_ts/model/model';
import Dictionary from '../../../dsl_service_ts/helper/dictionary';
import Store from '../../../dsl_service_ts/helper/store';
import Methods from '../../../dsl_service_ts/helper/methods';
class Image extends Model {
  constructor(node: any) {
    super(node);
    this.type = Dictionary.type.QImage;
  }
  static regular(node: any) {
    return node.type == 'QImage' || node.type == 'QShape';
  }
  /**
   * 图片相似原则：
   * 高宽相似
   * 颜色相似
   * 圆角相似
   */
  public isSimilarWith(target: any) {
    let ErrorCoefficient = Store.get('errorCoefficient') || 0;
    let a_bgColor =
      this.styles.background && Methods.RGB2HEX(this.styles.background.color);
    let b_bgColor =
      target.styles.background &&
      Methods.RGB2HEX(target.styles.background.color);
    let a_borderRadius =
      this.styles.borderRadius && this.styles.borderRadius.join();
    let b_borderRadius =
      target.styles.borderRadius && target.styles.borderRadius.join();
    return (
      Math.abs(this.width - target.width) < ErrorCoefficient &&
      Math.abs(this.height - target.height) < ErrorCoefficient &&
      a_bgColor == b_bgColor &&
      a_borderRadius == b_borderRadius
    );
  }
}

export default Image;
