import Model from '../../../dsl_service_ts/model/model';
import Dictionary from '../../../dsl_service_ts/helper/dictionary';
class Body extends Model {
  constructor(node: any) {
    super(node);
    this.type = Dictionary.type.QBody;
    this.canLeftFlex = true;
    this.canRightFlex = true;
  }
  static regular(node: any) {
    return node.type == 'QLayer' || node.type == 'QBody';
  }
}

export default Body;
