// 以Shape为底, Text在里面的紧凑型按钮结构
//
// (QShape)-(QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class EM2M4 extends Model.ElementModel {
  constructor() {
    // 元素构成规则
    super('em2-m4', 1, 0, 0, 1, Common.LvA, Common.QText);

    this.canLeftFlex = false;
    this.canRightFlex = false;
  }

  _initNode() {
    let texts = this.getTextNodes();
    let shapes = this.getShapeNodes();

    this._matchNodes['0'] = texts[0]; // QText
    this._matchNodes['1'] = shapes[0]; // QShape
  }

  // 位置关系
  regular1() {
    let bool = Feature.positionAInBCenter(
      this._matchNodes['0'],
      this._matchNodes['1'],
    );

    return bool;
  }

  // 尺寸关系
  regular2() {
    // 1. 文字高度占图形超 1/2
    // 2. 文字长度占图形超 1/2
    let bool =
      Feature.sizeHeightRatioAGreatB(
        this._matchNodes['0'],
        this._matchNodes['1'],
        0.5,
      ) &&
      Feature.sizeHeightRatioAGreatB(
        this._matchNodes['0'],
        this._matchNodes['1'],
        0.4,
      );

    return bool;
  }

  // 尺寸关系
  regular3() {
    // 1.按钮高度必须大于40
    let bool = Feature.sizeHeightGreat(this._matchNodes['1'], 40);

    return bool;
  }
}

export default EM2M4;
