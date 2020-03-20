import Dictionary from '../../../../dsl_helper/dictionary';
import Store from '../../../../dsl_helper/store';
import Methods from '../../../../dsl_helper/methods';
import ImageModel from '../../../../dsl_model/models/image';
import TextModel from '../../../../dsl_model/models/text';
import Model from '../../../../dsl_model/model';
import * as ConstraintsMap from '../../../../dsl_helper/constraints';

let ErrorCoefficient: number;

class Button extends ImageModel {
  constructor(nodes: any[]) {
    super(nodes[0]);
    this.canLeftFlex = false;
    this.canRightFlex = false;
    let child = nodes[0].children[0];
    this.text = child.text;
    this.styles.texts = child.styles.texts;
    this.styles.lineHeight = this.height;
    this.styles.textAlign = child.styles.textAlign;
    this.styles.verticalAlign = child.styles.verticalAlign;
    this.constraints.LayoutDirection =
      ConstraintsMap.LayoutDirection.Horizontal;
    this.constraints.LayoutFixedWidth = ConstraintsMap.LayoutFixedWidth.Fixed;
    this.constraints.LayoutJustifyContent =
      ConstraintsMap.LayoutJustifyContent.Center;
    this.constraints.LayoutAlignItems = ConstraintsMap.LayoutAlignItems.Center;
  }
  static define() {}
  static capture(nodes: any[]): any[] {
    if (nodes.length == 0) {
      return nodes;
    }
    ErrorCoefficient = Store.get('errorCoefficient') || 0;
    let groups = nodes.filter((parent: Model) => {
      var onlyChild: Model = parent.children[0];
      return (
        parent.constructor !== TextModel &&
        parent.children.length == 1 &&
        onlyChild.constructor == TextModel &&
        Math.abs(
          onlyChild.abXops + onlyChild.abX - (parent.abXops + parent.abX),
        ) < ErrorCoefficient &&
        Math.abs(
          onlyChild.abYops + onlyChild.abY - (parent.abYops + parent.abY),
        ) < ErrorCoefficient
      );
    });
    return groups.map(g => [g]);
  }
}
export default Button;
