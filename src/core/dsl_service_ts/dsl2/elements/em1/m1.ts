// (1节点基础元素)文字Text
// (QText)
// 
// 判断标准
// 1, 只包含一个QText
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class EM1M1 extends Model.ElementModel {
  constructor() {
    super('em1-m1', 1, 0, 0, 0, Common.LvD, Common.QText);
    // 文本不设置左右拓展逻辑
    // this.canLeftFlex = false;
    // this.canRightFlex = false;
  }

  _initNode() {
    let texts = this.getTextNodes();
    this._matchNodes['0'] = texts[0];
  }

  // 节点必须是QText节点
  regular1() {
    const nodes = this.getNodes();
    return Feature.propertyNodeAreQText(nodes);
  }
}

export default EM1M1;
