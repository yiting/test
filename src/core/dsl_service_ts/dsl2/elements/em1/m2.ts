// (1节点基础元素)图标Icon
//
// 此模型为纯Icon组件模型, 只包含一个QIcon
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class EM1M2 extends Model.ElementModel {
  constructor() {
    super('em1-m2', 0, 1, 0, 0, Common.LvD, Common.QIcon);

    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    const that: any = this;
    const NodesIndex0 = 0;
    that._matchNodes['0'] = this.getIconNodes()[NodesIndex0];
  }

  // 节点必须是QIcon节点
  regular1() {
    const nodes = this.getNodes();
    return Feature.propertyNodeAreQIcon(nodes);
  }
}

export default EM1M2;
