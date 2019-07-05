// 以Shape为底,Text在里面的tag结构
// (QIcon)-(QText)
//
// 判断标准
// 1, 文本位于icon中间
// 2, 文本高度占图形超1/2
// 3, 文本长度占图形长度7/10
// 4, tag结构高度少于40
// 5, tag结构长度小于250
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class EM2M2 extends Model.ElementModel {
  constructor() {
    // 元素构成规则
    super('em2-m2', 1, 0, 0, 1, Common.LvA, Common.QText);

    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    let texts = this.getTextNodes();
    let shapes = this.getShapeNodes();

    this._matchNodes['0'] = texts[0]; // QText
    this._matchNodes['1'] = shapes[0]; // QShape
  }

  // 1.
  regular1() {
    let bool: boolean = Feature.positionAInBCenter(
      this._matchNodes['0'],
      this._matchNodes['1'],
    );
    return bool;
  }

  // 2.
  regular2() {
    let bool: boolean = Feature.sizeHeightRatioAGreatB(
      this._matchNodes['0'],
      this._matchNodes['1'],
      0.5,
    );
    return bool;
  }

  // 3.
  regular3() {
    let bool: boolean = Feature.sizeWidthRatioAGreatB(
      this._matchNodes['0'],
      this._matchNodes['1'],
      0.7,
    );
    return bool;
  }

  // 4.
  regular4() {
    let bool: boolean = Feature.sizeHeightLess(this._matchNodes['1'], 40);
    return bool;
  }

  // 5.
  regular5() {
    let bool: boolean = Feature.sizeWidthLess(this._matchNodes['1'], 250);
    return bool;
  }
}

export default EM2M2;
