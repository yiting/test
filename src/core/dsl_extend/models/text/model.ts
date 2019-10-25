import Model from '../../../dsl_service_ts/model/model';
import Dictionary from '../../../dsl_service_ts/helper/dictionary';
import Store from '../../../dsl_service_ts/helper/store';
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
}

export default Text;
