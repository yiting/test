import Model from '../../../dsl_service_ts/model/model';
import Dictionary from '../../../dsl_service_ts/helper/dictionary';
import Store from '../../../dsl_service_ts/helper/store';
import Methods from '../../../dsl_service_ts/helper/methods';
class Inline extends Model {
  constructor(node: any = {}) {
    super(node);
    this.type = Dictionary.type.QLayer;
    this.canLeftFlex = false;
    this.canRightFlex = true;
  }
  static define() {}
  static capture(nodes: any[]) {
    Methods.gatherByLogic(nodes, () => {});
  }
}

export default Inline;
