import Model from '../../../dsl_service_ts/model/model';
import Dictionary from '../../../dsl_service_ts/helper/dictionary';
import Store from '../../../dsl_service_ts/helper/store';
class List extends Model {
  constructor(node: any = {}) {
    super(node);
    this.type = Dictionary.type.QLayer;
    this.canLeftFlex = true;
    this.canRightFlex = true;
  }
}

export default List;
