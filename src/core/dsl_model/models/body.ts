import Model from '../../dsl_layout/model/model';
import Dictionary from '../../dsl_helper/dictionary';
class Body extends Model {
  constructor(node: any) {
    super(node);
    if (this.type == 'QShape') {
      this.path = null;
    }
    this.type = Dictionary.type.QBody;
    this.canLeftFlex = true;
    this.canRightFlex = true;
    // 移除非模型特征属性
    this.styles.texts = null;
  }
  static regular(node: any) {
    return node.type == 'QLayer' || node.type == 'QBody';
  }
}

export default Body;
