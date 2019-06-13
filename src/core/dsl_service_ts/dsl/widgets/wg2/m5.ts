// (2节点元素)上标题下文字描述
//
// (QText) + (QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class WG2M5 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg2-m5', 2, 0, 0, 0, Common.LvS, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = true;

    const that: any = this;
    // 节点记录
    that._matchNodes['1'] = null; // sub txt
    that._matchNodes['0'] = null; // main txt
  }

  _initNode() {
    const that: any = this;
    const txtNodes = that.getTextNodes();
    // 因为只有两个节点
    if (txtNodes[0].height > txtNodes[1].height) {
      const txtNodesIndex0 = 0;
      that._matchNodes['0'] = txtNodes[txtNodesIndex0];
      const txtNodesIndex1 = 1;
      that._matchNodes['1'] = txtNodes[txtNodesIndex1];
    } else {
      const txtNodesIndex1 = 1;
      that._matchNodes['0'] = txtNodes[txtNodesIndex1];
      const txtNodesIndex0 = 0;
      that._matchNodes['1'] = txtNodes[txtNodesIndex0];
    }
  }

  // 重要一个是两个文字不能字号相等
  regular1() {
    const that: any = this;
    return that._matchNodes['0'].height !== that._matchNodes['1'].height;
  }

  // 元素方向
  regular2() {
    const that: any = this;
    return Feature.directionAbottomToB(
      that._matchNodes['1'],
      that._matchNodes['0'],
    );
  }

  // 水平轴方向
  regular3() {
    const that: any = this;
    // 两个文字在垂直轴方向
    return Feature.baselineABInVertical(
      that._matchNodes['1'],
      that._matchNodes['0'],
    );
  }

  // 元素距离
  regular4() {
    const that: any = this;
    // 大标题与小标题的距离必须大于0, 小于小标题的高度
    return (
      Feature.distanceGreatAbottomToBtop(
        that._matchNodes['0'],
        that._matchNodes['1'],
        0,
      ) &&
      Feature.distanceLessAbottomToBtop(
        that._matchNodes['0'],
        that._matchNodes['1'],
        that._matchNodes['1'].height,
      )
    );
  }
}

export default WG2M5;
