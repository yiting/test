import LayerModel from '../../../../dsl_model/models/layer';
import Dictionary from '../../../../dsl_layout/helper/dictionary';
class ListItem extends LayerModel {
  constructor(node: any = {}) {
    super(node);
    this.canLeftFlex = node.canLeftFlex;
    this.canRightFlex = node.canRightFlex;
  }
}

export default ListItem;
