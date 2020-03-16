import LayerModel from '../../../../dsl_model/models/layer';
class List extends LayerModel {
  constructor(node: any = {}) {
    super(node);
    this.canLeftFlex = true;
    this.canRightFlex = true;
  }
}

export default List;
