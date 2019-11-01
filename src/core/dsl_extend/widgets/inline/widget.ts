import Model from '../../../dsl_service_ts/model/model';
import Dictionary from '../../../dsl_service_ts/helper/dictionary';
import Store from '../../../dsl_service_ts/helper/store';
import Methods from '../../../dsl_service_ts/helper/methods';

const H_SPACE = 20; // 水平间距
const V_HEIGHT = 50; // 垂直高度要求
const LINE_HEIGHT = 1.4; //sketch 默认行高
let ErrorCoefficient: number;
let CoordinateWidth: number;

class Inline extends Model {
  constructor(node: any = {}) {
    super(node);
    this.type = Dictionary.type.QText;
    this.canLeftFlex = false;
    this.canRightFlex = true;
  }
  static define() {}
  static capture(nodes: any[]): any[] {
    ErrorCoefficient = Store.get('errorCoefficient') || 0;
    CoordinateWidth = Store.get('coordinateWidth');
    let groups = calInline(nodes);
    let res = groups.filter((col: any) => col.length > 1);
    return res;
  }
}
function calInline(nodes: any) {
  return Methods.gatherByLogic(nodes, (meta: any, target: any) => {
    if (
      meta.id == '80290016-D209-4BDF-9D0C-E21F93FD485F' &&
      target.id == 'FAE4F664-29A2-4E6F-883B-FFB8C97558F0'
    )
      debugger;
    let max =
      Math.max(meta.maxFontSize, target.maxFontSize) * 2 ||
      Math.min(meta.height, target.height) * 2;
    let gapAllowed = Math.min(
      meta.minFontSize || V_HEIGHT,
      target.minFontSize || V_HEIGHT,
    );
    return (
      meta.height < V_HEIGHT &&
      target.height < V_HEIGHT && // 中线对齐
      (Math.abs(meta.abY + meta.abYops - target.abY - target.abYops) <
        ErrorCoefficient ||
        // 底对齐
        Math.abs(meta.abYops - target.abYops) < ErrorCoefficient) &&
      meta.height < max &&
      target.height < max &&
      Methods.isXConnect(meta, target, gapAllowed)
    );
  });
}
export default Inline;
