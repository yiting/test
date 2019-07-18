// (1节点基础元素)图片Image
// (QImage)
//
// 判断标准
// 1, 只包含一个QImage
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class EM1M3 extends Model.ElementModel {
  constructor() {
    super('em1-m3', 0, 1, Common.LvD, Common.QImage);

    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    let images = this.getImageNodes();
    this._matchNodes['0'] = images[0];
  }

  // 节点必须是QImage节点
  regular1() {
    const nodes = this.getNodes();
    return Feature.propertyNodeAreQImage(nodes);
  }
  regular2() {
    const icon = this.getNodes()[0];
    return (
      Feature.sizeHeightLess(icon, Common.IconSize) &&
      Feature.sizeWidthLess(icon, Common.IconSize)
    );
  }
}

export default EM1M3;
