// (4节点元素)左QImage右二QText
//
// (QImage) + (QText) + (QText)
//
import Common from '../common';
import BaseModel from '../model';
import Utils from '../utils';
import Feature from '../feature';

class WG3M1 extends BaseModel {
  constructor() {
    // 构成规则
    super('wg3-m1', 2, 1, Common.LvS, Common.QWidget);
  }

  // 匹配到的节点做记录
  _initNode() {
    let matchNodes: any = {};

    matchNodes['0'] = this.nodesImages[0];
    let texts = this.nodesTexts;
    // 按从上到下排序
    Utils.sortListByParam(texts, 'abY');
    matchNodes['1'] = texts[0];     // 文本1
    matchNodes['2'] = texts[1];     // 文本2
    this.matchNodes = matchNodes;
  }

  // 元素方向
  regular1() {
    // image位于三个文字左侧
    let bool = Feature.directionAleftToB(this.matchNodes['0'], this.matchNodes['1'])
                && Feature.directionAleftToB(this.matchNodes['0'], this.matchNodes['2']);
    return bool;
  }

  // 水平轴
  regular2() {
    // 图片至少与文字1,2位于水平轴
    let bool = Feature.baselineABInHorizontal(this.matchNodes['0'], this.matchNodes['1'])
                && Feature.baselineABInHorizontal(this.matchNodes['0'], this.matchNodes['2']);
    return bool;
  }

  // 三个文字位于垂直轴
  regular3() {
    let bool = Feature.baselineGroupAInVertical([this.matchNodes['1'], this.matchNodes['2']]);
    return bool;
  }

  // 元素距离
  regular4() {
    // image与三个文字的距离大于0, 小于44
    let bool = Feature.distanceGreatArightToBleft(this.matchNodes['0'], this.matchNodes['1'], 0)
                && Feature.distanceLessArightToBleft(this.matchNodes['0'], this.matchNodes['1'], 44)
                && Feature.distanceGreatArightToBleft(this.matchNodes['0'], this.matchNodes['2'], 0)
                && Feature.distanceLessArightToBleft(this.matchNodes['0'], this.matchNodes['2'], 44);
    return bool;
  }

  // 元素距离
  regular5() {
    // 文本间距离大于0, 小于44
    let bool = Feature.distanceGreatAbottomToBtop(this.matchNodes['1'], this.matchNodes['2'], 0)
                && Feature.distanceLessAbottomToBtop(this.matchNodes['1'], this.matchNodes['2'], 44);
    return bool;
  }
}

export default WG3M1;
