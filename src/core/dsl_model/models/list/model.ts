import LayerModel from '../layer/model';
import Dictionary from '../../../dsl_service_ts/helper/dictionary';
class List extends LayerModel {
  constructor(node: any = {}) {
    super(node);
    this.canLeftFlex = true;
    this.canRightFlex = true;
  }
}

export default List;
