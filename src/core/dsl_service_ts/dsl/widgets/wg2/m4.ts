// (2节点元素)上图片下文字
//
// (QImage) + (QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class WG2M4 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg2-m4', 1, 0, 1, 0, Common.LvS, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = false;
    const that: any = this;

    // 节点记录
    that._matchNodes['0'] = null; // image
    that._matchNodes['1'] = null; // txt
  }

  _initNode() {
    const txtNodes = this.getTextNodes();
    const imageNodes = this.getImageNodes();
    const that: any = this;

    const imageNodesIndex0 = 0;
    that._matchNodes['0'] = imageNodes[imageNodesIndex0];
    const txtNodesIndex0 = 0;
    that._matchNodes['1'] = txtNodes[txtNodesIndex0];
  }

  // 元素位置
  regular1() {
    const that: any = this;
    // 文字位于图片下面
    return (
      Feature.directionAbottomToB(
        that._matchNodes['1'],
        that._matchNodes['0'],
      ) &&
      // image和txt在主轴上属于垂直轴
      Feature.baselineABInVertical(that._matchNodes['0'], that._matchNodes['1'])
    );
  }

  // 元素距离关系
  regular2() {
    const that: any = this;
    // 图片与txt的距离必须大于-4,小于50
    return (
      Feature.distanceGreatAbottomToBtop(
        that._matchNodes['0'],
        that._matchNodes['1'],
        -4,
      ) &&
      Feature.distanceLessAbottomToBtop(
        that._matchNodes['0'],
        that._matchNodes['1'],
        25,
      ) &&
      // 左对齐
      (Feature.baselineABJustifyLeft(
        that._matchNodes['0'],
        that._matchNodes['1'],
        2,
      ) ||
        Feature.baselineABJustifyCenter(
          that._matchNodes['0'],
          that._matchNodes['1'],
          4,
        ))
    );
  }
}

export default WG2M4;
