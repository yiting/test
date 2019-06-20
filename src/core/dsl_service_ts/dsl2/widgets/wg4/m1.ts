// (4节点元素) 左image右三text的设计
// (QImage + QText + QText + QText)
//
// 判断标准
// 1, image位于text左边
// 2, image与三text位于水平轴
// 3, 三text位于垂直轴
// 4, image与三text左右距离大于0小于44
// 5, 三text上下距离大于0小于text高
// 6, image的高度的1倍必须大于三text的高度范围
// 6, && image的高度的0.7倍必须小于三text的高度范围
import Common from '../../common';
import Model from '../../model';
import Feature from '../../feature';
import Utils from '../../utils';

class WG4M1 extends Model.WidgetModel {
  constructor() {
    // 元素构成规则
    super('wg4-m1', 3, 0, 1, 0, Common.LvA, Common.QWidget);
    this.canLeftFlex = false;
    this.canRightFlex = true;
  }

  _initNode() {
    let texts: any = this.getTextNodes();
    let images: any = this.getImageNodes();
    Utils.sortListByParam(texts, 'abY', false);

    this._matchNodes['0'] = texts[0];
    this._matchNodes['1'] = texts[1];
    this._matchNodes['2'] = texts[2];
    this._matchNodes['3'] = images[0];

    // 测试想要的节点匹配与规则
    // if (this._matchNodes['2'].id == '36D662A5-00E9-4275-ABD9-5B4E0C1334D5-c'
    //     && this._matchNodes['0'].id == '9715718D-CC7A-4BD5-9B43-815BD796C06D-c'
    //     && this._matchNodes['1'].id == '7C99E424-3F08-4741-947E-A9D31E707B89-c') {
      

    //   let bool: boolean = this.regular4();
    //   console.log('regular6: ' + bool);
    // }
  }

  // 1.
  regular1() {
    let bool: boolean = Feature.directionAleftToB(this._matchNodes['3'], this._matchNodes['0'])
                        && Feature.directionAleftToB(this._matchNodes['3'], this._matchNodes['1'])
                        && Feature.directionAleftToB(this._matchNodes['3'], this._matchNodes['2']);
    return bool;
  }

  // 2.
  regular2() {
    let bool: boolean = Feature.baselineABInHorizontal(this._matchNodes['3'], this._matchNodes['0'])
                        && Feature.baselineABInHorizontal(this._matchNodes['3'], this._matchNodes['1'])
                        && Feature.baselineABInHorizontal(this._matchNodes['3'], this._matchNodes['2']);
    return bool;
  }

  // 3.
  regular3() {
    let gA: any = [this._matchNodes['0'], this._matchNodes['1'], this._matchNodes['2']];
    let bool: boolean = Feature.baselineGroupAInVertical(gA);
    return bool;
  }

  // 4.
  regular4() {
    let gA: any = [this._matchNodes['3']];
    let gB: any = [this._matchNodes['0'], this._matchNodes['1'], this._matchNodes['2']];

    let bool: boolean = Feature.distanceGreatGroupABInHorizontal(gA, gB, 0)
                        && Feature.distanceLessGroupABInHorizontal(gA, gB, 44);
    return bool;
  }

  // 5.
  regular5() {
    let t1Height: number = this._matchNodes['0'].height * 1.05;
    let t2Height: number = this._matchNodes['1'].height * 1.05;
    
    let b1: boolean = Feature.distanceGreatAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], 0)
                      && Feature.distanceLessAbottomToBtop(this._matchNodes['0'], this._matchNodes['1'], t1Height);

    let b2: boolean = Feature.distanceGreatAbottomToBtop(this._matchNodes['1'], this._matchNodes['2'], 0)
                      && Feature.distanceLessAbottomToBtop(this._matchNodes['1'], this._matchNodes['2'], t2Height);
      
    return (b1 && b2);
  }

  // 6.
  regular6() {
    let txtAreaHeight: number = Math.abs(this._matchNodes['0'].abY - this._matchNodes['2'].abYops);

    let b1: boolean = this._matchNodes['3'].height * 1.05 - txtAreaHeight >= 0? true : false;
    let b2: boolean = this._matchNodes['3'].height * 0.7 - txtAreaHeight <= 0? true : false;
    return (b1 && b2);
  }
}

export default WG4M1;
