import Model from '../../../dsl_service_ts/model/model';
import Dictionary from '../../../dsl_service_ts/helper/dictionary';
import Store from '../../../dsl_service_ts/helper/store';
class Image extends Model {
  constructor(node: any) {
    super(node);
    this.type = Dictionary.type.QImage;
  }
  static regular(node: any) {
    return node.type == 'QImage' || node.type == 'QShape';
  }
}

export default Image;
