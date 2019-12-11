import Model from '../../../dsl_service_ts/model/model';
import Dictionary from '../../../dsl_service_ts/helper/dictionary';
import Store from '../../../dsl_service_ts/helper/store';
class Dividing extends Model {
  designWidth: number;
  static designWidth: number;
  constructor(node: any) {
    super(node);
  }
  static regular(node: any) {
    Dividing.designWidth = Store.get('designWidth');
    return (
      (node.type == 'QImage' || node.type == 'QShape') &&
      node.width > Dividing.designWidth * 0.7 &&
      node.height < Dividing.designWidth * 0.04266
    );
  }

  /**
   * 图片相似原则：
   * 高宽相似，颜色相似
   */
  public isSimilarWith(target: any) {
    return this.width == target.width && this.height == target.height;
  }
}

export default Dividing;
