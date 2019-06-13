// (1节点基础元素)图片Image
//
// 此模型为纯Image组件模型, 只包含一个QImage
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class EM1M3 extends Model.ElementModel {
  constructor() {
    super('em1-m3', 0, 0, 1, 0, Common.LvD, Common.QImage);

    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    const that: any = this;
    const NodesIndex0 = 0;
    that._matchNodes['0'] = this.getImageNodes()[NodesIndex0];
  }

  // 节点必须是QImage节点
  regular1() {
    const nodes = this.getNodes();
    return Feature.propertyNodeAreQImage(nodes);
  }
}

export default EM1M3;
