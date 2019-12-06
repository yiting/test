// (4节点元素)左QImage右三QText
//
// (QImage) + (QText) + (QText) + (QText)
//
import Common from '../common';
import BaseModel from '../model';

class WG4M1 extends BaseModel {
  constructor() {
    // 构成规则
    super('wg4-m1', 3, 1, Common.LvS, Common.QWidget);
  }
}

export default WG4M1;
