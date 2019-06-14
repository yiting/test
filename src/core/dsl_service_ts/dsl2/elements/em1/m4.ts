// (1节点基础元素)绘图Shape
//
// 此模型为纯Shape组件模型, 只包含一个QShape
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class EM1M4 extends Model.ElementModel {
  constructor() {
    super('em1-m4', 0, 0, 0, 1, Common.LvD, Common.QShape);

    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    const that: any = this;
    const NodesIndex0 = 0;
    that._matchNodes['0'] = this.getShapeNodes()[NodesIndex0];
  }

  // 节点必须是QShape节点
  regular1() {
    const nodes = this.getNodes();
    return Feature.propertyNodeAreQShape(nodes);
  }
}

export default EM1M4;
