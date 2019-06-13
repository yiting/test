// (3节点基础元素)左文字 + 右固定长度标签
//
// (QText)-(QShape+QText)
//
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';

class EM3M2 extends Model.ElementModel {
  _tagTxt: any;

  _mainTxt: any;

  _tagShape: any;

  constructor() {
    // 元素构成规则
    super('em3-m2', 2, 0, 0, 1, Common.LvS, Common.QText);
    this.canLeftFlex = false;
    this.canRightFlex = false;

    // 三个节点记录
    this._tagTxt = null;
    this._mainTxt = null;
    this._tagShape = null;
  }

  // 区分三个基础元素的逻辑
  _initNode() {
    const txtNodes = this.getTextNodes();
    const shapeNodes = this.getShapeNodes();
    const that: any = this;

    const txtNodesIndex1 = 1;
    const txtNodesIndex0 = 0;
    const shapeNodesIndex0 = 0;
    if (txtNodes[0].abX <= txtNodes[txtNodesIndex1].abX) {
      that._mainTxt = txtNodes[txtNodesIndex0];
      that._tagTxt = txtNodes[txtNodesIndex1];
    } else {
      that._mainTxt = txtNodes[txtNodesIndex1];
      that._tagTxt = txtNodes[txtNodesIndex0];
    }

    that._tagShape = shapeNodes[shapeNodesIndex0];

    that._matchNodes['0'] = that._tagShape; // tag的shape背景
    that._matchNodes['1'] = that._tagTxt; // tag的文字
    that._matchNodes['2'] = that._mainTxt; // 主文字
  }

  // 元素方向
  regular1() {
    const that: any = this;

    return (
      Feature.directionAleftToB(that._mainTxt, that._tagTxt) &&
      Feature.directionAleftToB(that._mainTxt, that._tagShape)
    );
  }

  // 水平轴方向
  regular2() {
    const that: any = this;

    // 三者都处于水平轴方向上
    return (
      Feature.baselineABInHorizontal(that._tagShape, that._mainTxt) &&
      Feature.baselineABInHorizontal(that._tagShape, that._tagTxt) &&
      Feature.baselineABInHorizontal(that._mainTxt, that._tagTxt)
    );
  }

  // 元素距离
  regular3() {
    const that: any = this;

    // tagShape与mainTxt的距离必须小于22,大于0
    return (
      Feature.distanceGreatAleftToBright(that._tagShape, that._mainTxt, 0) &&
      Feature.distanceLessAleftToBright(that._tagShape, that._mainTxt, 22)
    );
  }

  // 位置关系
  regular4() {
    const that: any = this;

    // tagTxt在tagShape的里面并且居中
    return Feature.positionAInBCenter(that._tagTxt, that._tagShape);
  }

  // 尺寸关系
  regular5() {
    const that: any = this;

    // 1. tagShape一般占mainTxt字高度的大于1/2, 小于1.05(1)
    // 2. tagShape的宽度一般超tagTxt字宽度小于1.2
    return (
      Feature.sizeHeightRatioAGreatB(that._tagShape, that._mainTxt, 0.5) &&
      Feature.sizeHeightRatioALessB(that._tagShape, that._mainTxt, 1.05) &&
      Feature.sizeWidthRatioAGreatB(that._tagTxt, that._tagShape, 0.5)
    );
  }
}

export default EM3M2;
