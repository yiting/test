// (3节点基础元素) 连续标签组件
//
// (QText)-(QShape)-(QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class EM3M9 extends Model.ElementModel {
  constructor() {
    // 元素构成规则
    super('em3-m9', 2, 0, 0, 1, Common.LvS, Common.QText);
    this.canLeftFlex = false;
    this.canRightFlex = true;
    const that: any = this;
    // 三个节点记录
    that._matchNodes['0'] = null; // 文本
    that._matchNodes['1'] = null; // 分割线
    that._matchNodes['2'] = null; // 文本
  }

  // 区分三个基础元素的逻辑
  _initNode() {
    const that: any = this;
    const txtNodes = this.getTextNodes();
    const shapeNodes = this.getShapeNodes();

    const txtNodesIndex0 = 0;
    const txtNodesIndex1 = 1;
    const shapeNodesIndex0 = 0;
    if (txtNodes[0].abX <= txtNodes[txtNodesIndex1].abX) {
      that._matchNodes['0'] = txtNodes[txtNodesIndex0];
      that._matchNodes['2'] = txtNodes[txtNodesIndex1];
    } else {
      that._matchNodes['0'] = txtNodes[txtNodesIndex1];
      that._matchNodes['2'] = txtNodes[txtNodesIndex0];
    }

    that._matchNodes['1'] = shapeNodes[shapeNodesIndex0];
  }

  // 元素方向
  regular1() {
    const that: any = this;
    const res =
      Feature.directionAleftToB(that._matchNodes['0'], that._matchNodes['1']) &&
      Feature.directionAleftToB(that._matchNodes['1'], that._matchNodes['2']);

    return res;
  }

  // 水平轴方向
  regular2() {
    const that: any = this;
    // 三者处于水平轴方向上
    const res = Feature.baselineGroupAInHorizontal([
      that._matchNodes['0'],
      that._matchNodes['2'],
      that._matchNodes['1'],
    ]);

    return res;
  }

  // 元素距离
  regular3() {
    const that: any = this;
    // 文字与分割线大于0, 小于22
    const res =
      Feature.distanceGreatArightToBLeft(
        that._matchNodes['0'],
        that._matchNodes['1'],
        0,
      ) &&
      Feature.distanceLessArightToBleft(
        that._matchNodes['0'],
        that._matchNodes['1'],
        22,
      ) &&
      Feature.distanceGreatArightToBLeft(
        that._matchNodes['1'],
        that._matchNodes['2'],
        0,
      ) &&
      Feature.distanceLessArightToBleft(
        that._matchNodes['1'],
        that._matchNodes['2'],
        22,
      );

    return res;
  }

  // 尺寸关系
  regular4() {
    const that: any = this;
    // 分割线是icon, 但宽度小于4, 高度小于文字高度*1.1
    const height = that._matchNodes['0'].height * 1.1;
    const res =
      Feature.sizeWidthLess(that._matchNodes['1'], 4) &&
      Feature.sizeHeightLess(that._matchNodes['1'], height);

    return res;
  }
}

export default EM3M9;
