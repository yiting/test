// 以Image为底, Text在里面的紧凑型按钮结构
// (QImage)-(QText)
//
// 判断标准
// 1, 文本位于QImage中间
// 2, 文本高度占图形超1/2
// 3, 文本长度占图形长度超1/2
// 4, 按钮高度超过40
// 5, 按钮长度小于200
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class EM2M3 extends Model.ElementModel {
  constructor() {
    // 元素构成规则
    super('em2-m3', 1, 0, 1, 0, Common.LvA, Common.QText);

    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    let texts = this.getTextNodes();
    let images = this.getImageNodes();

    this._matchNodes['0'] = texts[0];           // QText
    this._matchNodes['1'] = images[0];          // QImage
  }

  // 1.
  regular1() {
    let bool: boolean = Feature.positionAInB(this._matchNodes['0'], this._matchNodes['1']);
    return bool;
  }

  // 2.
  regular2() {
    let bool: boolean = Feature.sizeHeightRatioAGreatB(this._matchNodes['0'], this._matchNodes['1'], 0.5);
    return bool;
  }

  // 3.
  regular3() {
    let bool: boolean = Feature.sizeWidthRatioAGreatB(this._matchNodes['0'], this._matchNodes['1'], 0.4);
    return bool;
  }

  // 4.
  regular4() {
    let bool: boolean = Feature.sizeHeightGreat(this._matchNodes['1'], 40);
    return bool;
  }

  // 5.
  regular() {
    let bool: boolean = Feature.sizeWidthLess(this._matchNodes['1'], 200);
    return bool;
  }
}

export default EM2M3;
