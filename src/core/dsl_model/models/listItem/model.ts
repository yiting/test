import LayerModel from '../layer/model';
import Dictionary from '../../../dsl_service_ts/helper/dictionary';
class ListItem extends LayerModel {
  constructor(node: any = {}) {
    super(node);
    this.canLeftFlex = node.canLeftFlex;
    this.canRightFlex = node.canRightFlex;
  }
}

export default ListItem;
