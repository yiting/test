import Model from '../../../dsl_service_ts/model/model';
import Dictionary from '../../../dsl_service_ts/helper/dictionary';
import Store from '../../../dsl_service_ts/helper/store';
class Dividing extends Model {
  designWidth: number;
  static designWidth: number;
  constructor(node: any) {
    super(node);
    Dividing.designWidth = Store.get('designWidth');
  }
  static regular(node: any) {
    return (
      node.type == Dictionary.type.QImage &&
      node.width > Dividing.designWidth * 0.7 &&
      node.height < 4
    );
  }
}

export default Dividing;
